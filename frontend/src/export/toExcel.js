/**
 * Exportar factura a Excel
 */

import * as XLSX from 'xlsx'
import { sanitizeExcelValue, sanitizeFilename } from '../utils/sanitizers.js'
import { t } from '../utils/i18n.js'

export function exportToExcel(data) {
  const invoice = data.invoices[0]
  const safeNumber = sanitizeFilename(`${invoice.series || ''}${invoice.number || ''}`)
  const filename = `factura-${safeNumber || 'sin-numero'}.xlsx`
  const currencyCode = data.fileHeader?.currencyCode || 'EUR'

  // Crear workbook
  const wb = XLSX.utils.book_new()

  // Hoja 1: Datos generales (sanitizar textos para prevenir inyección de fórmulas)
  const generalData = [
    [t('excel.invoiceData')],
    [''],
    [t('excel.number'), sanitizeExcelValue(`${invoice.series || ''}${invoice.series ? '/' : ''}${invoice.number}`)],
    [t('excel.issueDate'), sanitizeExcelValue(invoice.issueDate)],
    [t('excel.facturaeVersion'), sanitizeExcelValue(data.version)],
    [t('excel.currency'), sanitizeExcelValue(currencyCode)],
    [''],
    [t('excel.seller')],
    [t('excel.name'), sanitizeExcelValue(data.seller?.name || '')],
    [t('excel.taxId'), sanitizeExcelValue(data.seller?.taxId || '')],
    [t('excel.address'), sanitizeExcelValue(formatAddress(data.seller?.address))],
    [''],
    [t('excel.buyer')],
    [t('excel.name'), sanitizeExcelValue(data.buyer?.name || '')],
    [t('excel.taxId'), sanitizeExcelValue(data.buyer?.taxId || '')],
    [t('excel.address'), sanitizeExcelValue(formatAddress(data.buyer?.address))],
    [''],
    [t('excel.totals')],
    [t('excel.taxableBase'), invoice.totals?.grossAmount || 0],
    [t('excel.totalTaxes'), invoice.totals?.taxOutputs || 0],
    [t('excel.withholdings'), invoice.totals?.taxesWithheld || 0],
    [t('excel.invoiceTotal'), invoice.totals?.invoiceTotal || 0],
    [t('excel.totalToPay'), invoice.totals?.totalToPay || 0],
    [''],
    [t('excel.paymentInfo')],
    [t('excel.paymentMethod'), sanitizeExcelValue(invoice.payment?.paymentMeans ? getPaymentMeansLabel(invoice.payment.paymentMeans) : '')],
    [t('excel.dueDate'), sanitizeExcelValue(invoice.payment?.dueDate || '')],
    [t('excel.iban'), sanitizeExcelValue(invoice.payment?.iban || '')],
    [t('excel.bic'), sanitizeExcelValue(invoice.payment?.bic || '')]
  ]

  const wsGeneral = XLSX.utils.aoa_to_sheet(generalData)

  // Anchos de columna para hoja General
  wsGeneral['!cols'] = [
    { wch: 22 },  // Columna A - etiquetas
    { wch: 45 }   // Columna B - valores
  ]

  XLSX.utils.book_append_sheet(wb, wsGeneral, t('excel.sheetGeneral'))

  // Hoja 2: Líneas de detalle
  const linesHeader = [
    t('excel.lineNumber'),
    t('excel.description'),
    t('excel.quantity'),
    t('excel.unitPrice'),
    t('excel.vatPercent'),
    t('excel.grossAmount')
  ]
  const linesData = [
    linesHeader,
    ...invoice.lines.map((line, index) => [
      index + 1,
      sanitizeExcelValue(line.description),
      line.quantity,
      line.unitPrice,
      line.taxRate,
      line.grossAmount || line.totalAmount
    ])
  ]

  const wsLines = XLSX.utils.aoa_to_sheet(linesData)

  // Anchos de columna para hoja Líneas
  wsLines['!cols'] = [
    { wch: 5 },   // Nº
    { wch: 50 },  // Descripción
    { wch: 12 },  // Cantidad
    { wch: 15 },  // Precio unitario
    { wch: 8 },   // IVA %
    { wch: 15 }   // Importe bruto
  ]

  XLSX.utils.book_append_sheet(wb, wsLines, t('excel.sheetLines'))

  // Hoja 3: Impuestos
  if (invoice.taxes && invoice.taxes.length > 0) {
    const taxesHeader = [
      t('excel.taxType'),
      t('excel.percentage'),
      t('excel.taxBase'),
      t('excel.taxAmount')
    ]
    const taxesData = [
      taxesHeader,
      ...invoice.taxes.map(tax => [
        sanitizeExcelValue(getTaxTypeLabel(tax.type)),
        tax.rate,
        tax.base,
        tax.amount
      ])
    ]

    const wsTaxes = XLSX.utils.aoa_to_sheet(taxesData)

    // Anchos de columna para hoja Impuestos
    wsTaxes['!cols'] = [
      { wch: 20 },  // Tipo impuesto
      { wch: 12 },  // Porcentaje
      { wch: 15 },  // Base imponible
      { wch: 15 }   // Cuota
    ]

    XLSX.utils.book_append_sheet(wb, wsTaxes, t('excel.sheetTaxes'))
  }

  // Descargar
  XLSX.writeFile(wb, filename)
}

function formatAddress(address) {
  if (!address) return ''
  return [address.street, address.postCode, address.town, address.province]
    .filter(Boolean)
    .join(', ')
}

function getPaymentMeansLabel(code) {
  const key = `paymentMethod.${code}`
  const translated = t(key)
  return translated !== key ? translated : code
}

function getTaxTypeLabel(code) {
  const key = `taxType.${code}`
  const translated = t(key)
  return translated !== key ? translated : t('taxType.default')
}
