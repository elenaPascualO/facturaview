/**
 * Export batch of invoices to a ZIP file containing individual PDFs
 */

import JSZip from 'jszip'
import { generatePdfForInvoice } from './toPdf.js'
import { sanitizeFilename } from '../utils/sanitizers.js'
import { track, events } from '../utils/tracking.js'

/**
 * Export all invoices in a batch to a ZIP file containing individual PDFs
 * @param {Object} data - Parsed Facturae data containing multiple invoices
 * @returns {Promise<void>}
 */
export async function exportBatchToPdf(data) {
  const zip = new JSZip()
  const batchId = data.fileHeader?.batch?.identifier || 'lote'
  const safeBatchId = sanitizeFilename(batchId)

  // Generate PDF for each invoice and add to ZIP
  for (let i = 0; i < data.invoices.length; i++) {
    const invoice = data.invoices[i]
    const pdf = generatePdfForInvoice(data, invoice)
    const safeNumber = sanitizeFilename(`${invoice.series || ''}${invoice.number || String(i + 1)}`)
    const filename = `factura-${safeNumber}.pdf`

    // Get PDF as blob and add to ZIP
    const pdfBlob = pdf.output('blob')
    zip.file(filename, pdfBlob)
  }

  // Generate ZIP and trigger download
  const content = await zip.generateAsync({ type: 'blob' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(content)
  link.download = `lote-${safeBatchId}.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)

  // Track event
  track(events.EXPORT_PDF, {
    version: data.version,
    batch: true,
    count: data.invoices.length
  })
}
