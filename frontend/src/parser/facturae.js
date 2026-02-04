/**
 * Parser principal para facturas Facturae
 * Soporta versiones 3.2, 3.2.1 y 3.2.2
 */

import { FacturaeError, ErrorCodes } from '../utils/errors.js'

const SUPPORTED_VERSIONS = ['3.2', '3.2.1', '3.2.2']

export function parseFacturae(xmlString) {
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlString, "text/xml")

  // Detectar errores de parseo XML
  const parseError = xml.querySelector("parsererror")
  if (parseError) {
    throw new FacturaeError(ErrorCodes.XML_MALFORMED, parseError.textContent)
  }

  // Verificar que es un documento Facturae
  const root = xml.documentElement
  if (!root || !root.tagName.includes('Facturae')) {
    // Verificar también por namespace o elementos típicos
    const hasFacturaeElements = xml.querySelector('FileHeader, Invoices, SellerParty')
    if (!hasFacturaeElements) {
      throw new FacturaeError(ErrorCodes.NOT_FACTURAE)
    }
  }

  // Detectar y validar versión
  const version = getTextContent(xml, "SchemaVersion")
  if (version && !SUPPORTED_VERSIONS.includes(version)) {
    throw new FacturaeError(ErrorCodes.UNSUPPORTED_VERSION, `Versión detectada: ${version}`)
  }

  // Parsear facturas
  const invoices = parseInvoices(xml)
  if (!invoices || invoices.length === 0) {
    throw new FacturaeError(ErrorCodes.NO_INVOICES)
  }

  // Validar que al menos la primera factura tenga totales
  if (!invoices[0].totals) {
    throw new FacturaeError(ErrorCodes.MISSING_TOTALS)
  }

  // Extraer datos principales
  return {
    version,
    fileHeader: parseFileHeader(xml),
    seller: parseParty(xml, "SellerParty"),
    buyer: parseParty(xml, "BuyerParty"),
    invoices,
    isSigned: xml.querySelector("Signature") !== null
  }
}

function getTextContent(xml, tagName) {
  const el = xml.getElementsByTagName(tagName)[0]
  return el ? el.textContent.trim() : null
}

function parseFileHeader(xml) {
  return {
    schemaVersion: getTextContent(xml, "SchemaVersion"),
    modality: getTextContent(xml, "Modality"),
    invoiceIssuerType: getTextContent(xml, "InvoiceIssuerType"),
    currencyCode: getTextContent(xml, "InvoiceCurrencyCode") || "EUR"
  }
}

function parseParty(xml, partyType) {
  const party = xml.getElementsByTagName(partyType)[0]
  if (!party) return null

  const isLegalEntity = party.querySelector("LegalEntity") !== null

  return {
    type: isLegalEntity ? "legal" : "individual",
    taxId: getTextContent(party, "TaxIdentificationNumber"),
    personType: getTextContent(party, "PersonTypeCode"),
    name: isLegalEntity
      ? getTextContent(party, "CorporateName")
      : [
          getTextContent(party, "Name"),
          getTextContent(party, "FirstSurname"),
          getTextContent(party, "SecondSurname")
        ].filter(Boolean).join(" "),
    address: parseAddress(party)
  }
}

function parseAddress(partyEl) {
  const addr = partyEl.querySelector("AddressInSpain, OverseasAddress")
  if (!addr) return null

  return {
    street: getTextContent(addr, "Address"),
    postCode: getTextContent(addr, "PostCode"),
    town: getTextContent(addr, "Town"),
    province: getTextContent(addr, "Province"),
    country: getTextContent(addr, "CountryCode") || "ESP"
  }
}

function parseInvoices(xml) {
  const invoices = xml.getElementsByTagName("Invoice")
  return Array.from(invoices).map(inv => ({
    number: getTextContent(inv, "InvoiceNumber"),
    series: getTextContent(inv, "InvoiceSeriesCode"),
    issueDate: getTextContent(inv, "IssueDate"),
    invoiceType: getTextContent(inv, "InvoiceDocumentType"),
    invoiceClass: getTextContent(inv, "InvoiceClass"),
    lines: parseLines(inv),
    taxes: parseTaxes(inv),
    totals: parseTotals(inv),
    payment: parsePayment(inv)
  }))
}

function parseLines(invoiceEl) {
  const lines = invoiceEl.getElementsByTagName("InvoiceLine")
  return Array.from(lines).map(line => ({
    description: getTextContent(line, "ItemDescription"),
    quantity: parseFloat(getTextContent(line, "Quantity")) || 0,
    unitPrice: parseFloat(getTextContent(line, "UnitPriceWithoutTax")) || 0,
    totalAmount: parseFloat(getTextContent(line, "TotalCost")) || 0,
    grossAmount: parseFloat(getTextContent(line, "GrossAmount")) || 0,
    taxRate: parseLineTaxRate(line)
  }))
}

function parseLineTaxRate(lineEl) {
  const tax = lineEl.querySelector("TaxesOutputs Tax")
  if (!tax) return 0
  return parseFloat(getTextContent(tax, "TaxRate")) || 0
}

function parseTaxes(invoiceEl) {
  // Buscar TaxesOutputs directamente como hijo de Invoice, no dentro de InvoiceLine
  const taxesOutputs = Array.from(invoiceEl.children).find(child => child.tagName === 'TaxesOutputs')
  if (!taxesOutputs) return []

  const taxes = taxesOutputs.getElementsByTagName("Tax")
  return Array.from(taxes).map(tax => {
    const taxableBase = tax.querySelector("TaxableBase")
    const taxAmount = tax.querySelector("TaxAmount")
    return {
      type: getTextContent(tax, "TaxTypeCode"),
      rate: parseFloat(getTextContent(tax, "TaxRate")) || 0,
      base: taxableBase ? parseFloat(getTextContent(taxableBase, "TotalAmount")) || 0 : 0,
      amount: taxAmount ? parseFloat(getTextContent(taxAmount, "TotalAmount")) || 0 : 0
    }
  })
}

function parseTotals(invoiceEl) {
  const totals = invoiceEl.querySelector("InvoiceTotals")
  if (!totals) return null

  return {
    grossAmount: parseFloat(getTextContent(totals, "TotalGrossAmount")) || 0,
    generalDiscounts: parseFloat(getTextContent(totals, "TotalGeneralDiscounts")) || 0,
    generalSurcharges: parseFloat(getTextContent(totals, "TotalGeneralSurcharges")) || 0,
    grossAmountBeforeTaxes: parseFloat(getTextContent(totals, "TotalGrossAmountBeforeTaxes")) || 0,
    taxOutputs: parseFloat(getTextContent(totals, "TotalTaxOutputs")) || 0,
    taxesWithheld: parseFloat(getTextContent(totals, "TotalTaxesWithheld")) || 0,
    invoiceTotal: parseFloat(getTextContent(totals, "InvoiceTotal")) || 0,
    totalOutstanding: parseFloat(getTextContent(totals, "TotalOutstandingAmount")) || 0,
    totalToPay: parseFloat(getTextContent(totals, "TotalExecutableAmount")) || 0
  }
}

function parsePayment(invoiceEl) {
  const payment = invoiceEl.querySelector("PaymentDetails Installment")
  if (!payment) return null

  const account = payment.querySelector("AccountToBeCredited")

  return {
    dueDate: getTextContent(payment, "InstallmentDueDate"),
    amount: parseFloat(getTextContent(payment, "InstallmentAmount")) || 0,
    paymentMeans: getTextContent(payment, "PaymentMeans"),
    iban: account ? getTextContent(account, "IBAN") : null,
    bic: account ? getTextContent(account, "BIC") : null
  }
}
