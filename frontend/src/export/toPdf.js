/**
 * Exportar factura a PDF usando jsPDF directamente
 */

import { jsPDF } from 'jspdf'
import { sanitizeFilename } from '../utils/sanitizers.js'
import { t, getLang } from '../utils/i18n.js'

/**
 * Export a single invoice to PDF (public function)
 * @param {Object} data - Parsed Facturae data
 * @param {number} invoiceIndex - Index of the invoice to export (default: 0)
 */
export function exportToPdf(data, invoiceIndex = 0) {
  const invoice = data.invoices[invoiceIndex]
  const safeNumber = sanitizeFilename(`${invoice.series || ''}${invoice.number || ''}`)
  const filename = `factura-${safeNumber || 'sin-numero'}.pdf`

  try {
    const pdf = generatePdfForInvoice(data, invoice)
    pdf.save(filename)
  } catch (error) {
    console.error(`${t('pdf.errorGenerating')}`, error)
    alert(`${t('pdf.errorGenerating')} ${error.message}`)
  }
}

/**
 * Generate a jsPDF document for a single invoice (reusable for batch export)
 * @param {Object} data - Parsed Facturae data (contains seller, buyer, fileHeader)
 * @param {Object} invoice - Single invoice object
 * @returns {jsPDF} The generated PDF document
 */
export function generatePdfForInvoice(data, invoice) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 20
    let y = 20

    // Colores
    const primaryColor = [59, 130, 246] // blue-500
    const grayDark = [31, 41, 55] // gray-800
    const grayMedium = [107, 114, 128] // gray-500
    const grayLight = [156, 163, 175] // gray-400

    // Moneda del documento
    const currencyCode = data.fileHeader?.currencyCode || 'EUR'

    // Obtener locale para formateo
    const lang = getLang()
    const locale = lang === 'en' ? 'en-GB' : 'es-ES'

    // Número y fecha de factura
    pdf.setFontSize(16)
    pdf.setTextColor(...grayDark)
    const invoiceTitle = `${t('pdf.invoiceNumber')} ${invoice.series ? invoice.series + '/' : ''}${invoice.number}`
    pdf.text(invoiceTitle, margin, y)

    pdf.setFontSize(10)
    pdf.setTextColor(...grayMedium)
    pdf.text(`${t('pdf.date')} ${formatDate(invoice.issueDate, locale)}`, pageWidth - margin - 40, y)
    y += 6
    pdf.text(`${t('pdf.version')} ${data.version}`, pageWidth - margin - 40, y)
    y += 15

    // Emisor y Receptor
    const colWidth = (pageWidth - margin * 2 - 10) / 2

    // Emisor
    pdf.setFontSize(10)
    pdf.setTextColor(...grayMedium)
    pdf.text(t('pdf.seller'), margin, y)

    pdf.setFontSize(11)
    pdf.setTextColor(...grayDark)
    y += 5
    pdf.text(data.seller?.name || t('pdf.noName'), margin, y)
    y += 5
    pdf.setFontSize(10)
    pdf.text(data.seller?.taxId || '', margin, y)
    y += 4
    if (data.seller?.address) {
      pdf.setTextColor(...grayLight)
      const address = formatAddress(data.seller.address)
      const addressLines = pdf.splitTextToSize(address, colWidth - 5)
      pdf.text(addressLines, margin, y)
      y += addressLines.length * 4
    }

    // Receptor (al lado)
    let yReceptor = y - (data.seller?.address ? 18 : 14)
    const receptorX = margin + colWidth + 10

    pdf.setFontSize(10)
    pdf.setTextColor(...grayMedium)
    pdf.text(t('pdf.buyer'), receptorX, yReceptor)

    pdf.setFontSize(11)
    pdf.setTextColor(...grayDark)
    yReceptor += 5
    pdf.text(data.buyer?.name || t('pdf.noName'), receptorX, yReceptor)
    yReceptor += 5
    pdf.setFontSize(10)
    pdf.text(data.buyer?.taxId || '', receptorX, yReceptor)
    yReceptor += 4
    if (data.buyer?.address) {
      pdf.setTextColor(...grayLight)
      const address = formatAddress(data.buyer.address)
      const addressLines = pdf.splitTextToSize(address, colWidth - 5)
      pdf.text(addressLines, receptorX, yReceptor)
    }

    y = Math.max(y, yReceptor) + 15

    // Líneas de detalle
    pdf.setFontSize(12)
    pdf.setTextColor(...grayDark)
    pdf.text(t('pdf.detail'), margin, y)
    y += 8

    // Cabecera de tabla
    pdf.setFillColor(249, 250, 251) // gray-50
    pdf.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F')

    pdf.setFontSize(9)
    pdf.setTextColor(...grayMedium)
    pdf.text(t('pdf.description'), margin + 2, y)
    pdf.text(t('pdf.quantity'), margin + 70, y)
    pdf.text(t('pdf.price'), margin + 90, y)
    pdf.text(t('pdf.vat'), margin + 115, y)
    pdf.text(t('pdf.total'), pageWidth - margin, y, { align: 'right' })
    y += 6

    // Líneas
    pdf.setTextColor(...grayDark)
    invoice.lines.forEach(line => {
      const desc = line.description || '-'
      const descLines = pdf.splitTextToSize(desc, 65)

      pdf.text(descLines, margin + 2, y)
      pdf.text(String(line.quantity), margin + 70, y)
      pdf.text(formatCurrency(line.unitPrice, currencyCode, locale), margin + 90, y)
      pdf.text(`${line.taxRate}%`, margin + 115, y)
      pdf.text(formatCurrency(line.grossAmount || line.totalAmount, currencyCode, locale), pageWidth - margin, y, { align: 'right' })

      y += Math.max(descLines.length * 4, 6)

      // Línea separadora
      pdf.setDrawColor(229, 231, 235) // gray-200
      pdf.line(margin, y, pageWidth - margin, y)
      y += 4
    })

    y += 10

    // Totales
    pdf.setFontSize(12)
    pdf.setTextColor(...grayDark)
    pdf.text(t('pdf.totals'), margin, y)
    y += 8

    const totalsX = pageWidth - margin - 60
    const valuesX = pageWidth - margin

    pdf.setFontSize(10)
    pdf.setTextColor(...grayMedium)
    pdf.text(t('pdf.taxableBase'), totalsX, y)
    pdf.setTextColor(...grayDark)
    pdf.text(formatCurrency(invoice.totals.grossAmount, currencyCode, locale), valuesX, y, { align: 'right' })
    y += 6

    // Impuestos
    if (invoice.taxes && invoice.taxes.length > 0) {
      invoice.taxes.forEach(tax => {
        pdf.setTextColor(...grayMedium)
        pdf.text(t('pdf.vatRate', { rate: tax.rate }), totalsX, y)
        pdf.setTextColor(...grayDark)
        pdf.text(formatCurrency(tax.amount, currencyCode, locale), valuesX, y, { align: 'right' })
        y += 6
      })
    }

    // Retenciones
    if (invoice.totals.taxesWithheld > 0) {
      pdf.setTextColor(...grayMedium)
      pdf.text(t('pdf.withholdings'), totalsX, y)
      pdf.setTextColor(220, 38, 38) // red-600
      pdf.text(`-${formatCurrency(invoice.totals.taxesWithheld, currencyCode, locale)}`, valuesX, y, { align: 'right' })
      y += 6
    }

    // Total
    y += 2
    pdf.setDrawColor(229, 231, 235)
    pdf.line(totalsX - 5, y - 2, valuesX, y - 2)

    pdf.setFontSize(12)
    pdf.setTextColor(...grayDark)
    pdf.text('TOTAL', totalsX, y + 4)
    pdf.setTextColor(...primaryColor)
    pdf.text(formatCurrency(invoice.totals.totalToPay, currencyCode, locale), valuesX, y + 4, { align: 'right' })
    y += 15

    // Información de pago
    if (invoice.payment) {
      pdf.setFontSize(12)
      pdf.setTextColor(...grayDark)
      pdf.text(t('pdf.paymentInfo'), margin, y)
      y += 8

      pdf.setFontSize(10)
      if (invoice.payment.dueDate) {
        pdf.setTextColor(...grayMedium)
        pdf.text(t('pdf.dueDate'), margin, y)
        pdf.setTextColor(...grayDark)
        pdf.text(formatDate(invoice.payment.dueDate, locale), margin + 30, y)
        y += 5
      }
      if (invoice.payment.paymentMeans) {
        pdf.setTextColor(...grayMedium)
        pdf.text(t('pdf.paymentMethod'), margin, y)
        pdf.setTextColor(...grayDark)
        pdf.text(getPaymentMeansLabel(invoice.payment.paymentMeans), margin + 30, y)
        y += 5
      }
      if (invoice.payment.iban) {
        pdf.setTextColor(...grayMedium)
        pdf.text(t('pdf.iban'), margin, y)
        pdf.setTextColor(...grayDark)
        pdf.text(invoice.payment.iban, margin + 30, y)
        y += 5
      }
    }

  return pdf
}

function formatCurrency(amount, currency = 'EUR', locale = 'es-ES') {
  if (amount === null || amount === undefined) return '-'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}

function formatDate(dateString, locale = 'es-ES') {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
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
