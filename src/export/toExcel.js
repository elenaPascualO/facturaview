/**
 * Exportar factura a Excel
 */

import * as XLSX from 'xlsx'

export function exportToExcel(data) {
  const invoice = data.invoices[0]
  const filename = `factura-${invoice.series || ''}${invoice.number || 'sin-numero'}.xlsx`

  // Crear workbook
  const wb = XLSX.utils.book_new()

  // Hoja 1: Datos generales
  const generalData = [
    ['FACTURA', `${invoice.series || ''}${invoice.series ? '/' : ''}${invoice.number}`],
    ['Fecha', invoice.issueDate],
    ['Versión Facturae', data.version],
    [''],
    ['EMISOR'],
    ['Nombre', data.seller?.name || ''],
    ['NIF/CIF', data.seller?.taxId || ''],
    ['Dirección', formatAddress(data.seller?.address)],
    [''],
    ['RECEPTOR'],
    ['Nombre', data.buyer?.name || ''],
    ['NIF/CIF', data.buyer?.taxId || ''],
    ['Dirección', formatAddress(data.buyer?.address)],
    [''],
    ['TOTALES'],
    ['Base imponible', invoice.totals?.grossAmount || 0],
    ['IVA', invoice.totals?.taxOutputs || 0],
    ['Retenciones', invoice.totals?.taxesWithheld || 0],
    ['TOTAL A PAGAR', invoice.totals?.totalToPay || 0]
  ]

  const wsGeneral = XLSX.utils.aoa_to_sheet(generalData)
  XLSX.utils.book_append_sheet(wb, wsGeneral, 'General')

  // Hoja 2: Líneas de detalle
  const linesHeader = ['Descripción', 'Cantidad', 'Precio unitario', 'IVA %', 'Total']
  const linesData = [
    linesHeader,
    ...invoice.lines.map(line => [
      line.description,
      line.quantity,
      line.unitPrice,
      line.taxRate,
      line.grossAmount || line.totalAmount
    ])
  ]

  const wsLines = XLSX.utils.aoa_to_sheet(linesData)
  XLSX.utils.book_append_sheet(wb, wsLines, 'Líneas')

  // Hoja 3: Impuestos
  if (invoice.taxes && invoice.taxes.length > 0) {
    const taxesHeader = ['Tipo', 'Porcentaje', 'Base', 'Cuota']
    const taxesData = [
      taxesHeader,
      ...invoice.taxes.map(tax => [
        tax.type || 'IVA',
        tax.rate,
        tax.base,
        tax.amount
      ])
    ]

    const wsTaxes = XLSX.utils.aoa_to_sheet(taxesData)
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
