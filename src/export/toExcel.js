/**
 * Exportar factura a Excel
 */

import * as XLSX from 'xlsx'
import { sanitizeExcelValue, sanitizeFilename } from '../utils/sanitizers.js'

export function exportToExcel(data) {
  const invoice = data.invoices[0]
  const safeNumber = sanitizeFilename(`${invoice.series || ''}${invoice.number || ''}`)
  const filename = `factura-${safeNumber || 'sin-numero'}.xlsx`
  const currencyCode = data.fileHeader?.currencyCode || 'EUR'

  // Crear workbook
  const wb = XLSX.utils.book_new()

  // Hoja 1: Datos generales (sanitizar textos para prevenir inyección de fórmulas)
  const generalData = [
    ['DATOS DE LA FACTURA'],
    [''],
    ['Número', sanitizeExcelValue(`${invoice.series || ''}${invoice.series ? '/' : ''}${invoice.number}`)],
    ['Fecha emisión', sanitizeExcelValue(invoice.issueDate)],
    ['Versión Facturae', sanitizeExcelValue(data.version)],
    ['Moneda', sanitizeExcelValue(currencyCode)],
    [''],
    ['EMISOR'],
    ['Nombre/Razón social', sanitizeExcelValue(data.seller?.name || '')],
    ['NIF/CIF', sanitizeExcelValue(data.seller?.taxId || '')],
    ['Dirección', sanitizeExcelValue(formatAddress(data.seller?.address))],
    [''],
    ['RECEPTOR'],
    ['Nombre/Razón social', sanitizeExcelValue(data.buyer?.name || '')],
    ['NIF/CIF', sanitizeExcelValue(data.buyer?.taxId || '')],
    ['Dirección', sanitizeExcelValue(formatAddress(data.buyer?.address))],
    [''],
    ['TOTALES'],
    ['Base imponible', invoice.totals?.grossAmount || 0],
    ['Total impuestos', invoice.totals?.taxOutputs || 0],
    ['Retenciones', invoice.totals?.taxesWithheld || 0],
    ['Total factura', invoice.totals?.invoiceTotal || 0],
    ['TOTAL A PAGAR', invoice.totals?.totalToPay || 0],
    [''],
    ['INFORMACIÓN DE PAGO'],
    ['Forma de pago', sanitizeExcelValue(invoice.payment?.paymentMeans ? getPaymentMeansLabel(invoice.payment.paymentMeans) : '')],
    ['Fecha vencimiento', sanitizeExcelValue(invoice.payment?.dueDate || '')],
    ['IBAN', sanitizeExcelValue(invoice.payment?.iban || '')],
    ['BIC', sanitizeExcelValue(invoice.payment?.bic || '')]
  ]

  const wsGeneral = XLSX.utils.aoa_to_sheet(generalData)

  // Anchos de columna para hoja General
  wsGeneral['!cols'] = [
    { wch: 22 },  // Columna A - etiquetas
    { wch: 45 }   // Columna B - valores
  ]

  XLSX.utils.book_append_sheet(wb, wsGeneral, 'General')

  // Hoja 2: Líneas de detalle
  const linesHeader = ['Nº', 'Descripción', 'Cantidad', 'Precio unitario', 'IVA %', 'Importe bruto']
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

  XLSX.utils.book_append_sheet(wb, wsLines, 'Líneas')

  // Hoja 3: Impuestos
  if (invoice.taxes && invoice.taxes.length > 0) {
    const taxesHeader = ['Tipo impuesto', 'Porcentaje', 'Base imponible', 'Cuota']
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

    XLSX.utils.book_append_sheet(wb, wsTaxes, 'Impuestos')
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
  const means = {
    '01': 'Efectivo',
    '02': 'Cheque',
    '04': 'Transferencia',
    '05': 'Letra aceptada',
    '13': 'Pago contra reembolso',
    '14': 'Recibo domiciliado',
    '15': 'Recibo',
    '16': 'Tarjeta crédito',
    '19': 'Domiciliación'
  }
  return means[code] || code
}

function getTaxTypeLabel(code) {
  const types = {
    '01': 'IVA',
    '02': 'IPSI',
    '03': 'IGIC',
    '04': 'IRPF',
    '05': 'Otro'
  }
  return types[code] || code || 'IVA'
}