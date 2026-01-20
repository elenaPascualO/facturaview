/**
 * Componente InvoiceView - Vista de factura
 */

import { formatCurrency, formatDate } from '../utils/formatters.js'
import { escapeHtml } from '../utils/sanitizers.js'
import { createPartyCard } from './PartyCard.js'
import { createLinesTable } from './LinesTable.js'
import { createTotalsBox } from './TotalsBox.js'

export function createInvoiceView(data) {
  const invoice = data.invoices[0] // Por ahora solo la primera factura

  return `
    <div class="min-h-screen bg-gray-50 p-4 md:p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 class="text-2xl font-bold text-gray-800">📄 FacturaView</h1>
          <div class="flex gap-2">
            <button
              id="btn-pdf"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Descargar PDF
            </button>
            <button
              id="btn-excel"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Descargar Excel
            </button>
          </div>
        </header>

        <!-- Info de factura -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-800">
            FACTURA Nº: ${invoice.series ? escapeHtml(invoice.series) + '/' : ''}${escapeHtml(invoice.number)}
              </h2>
              <p class="text-gray-500">${escapeHtml(getInvoiceTypeLabel(invoice.invoiceType))} · ${escapeHtml(getInvoiceClassLabel(invoice.invoiceClass))}</p>
            </div>
            <div class="text-right">
              <p class="text-gray-600">Fecha: <span class="font-medium">${escapeHtml(formatDate(invoice.issueDate))}</span></p>
              <p class="text-sm text-gray-400">Versión Facturae: ${escapeHtml(data.version)}</p>
              ${data.isSigned ? '<p class="text-sm text-green-600">✓ Firmada digitalmente</p>' : ''}
            </div>
          </div>
        </div>

        <!-- Emisor y Receptor -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          ${createPartyCard('Emisor', data.seller)}
          ${createPartyCard('Receptor', data.buyer)}
        </div>

        <!-- Líneas de detalle -->
        ${createLinesTable(invoice.lines)}

        <!-- Impuestos y Totales -->
        ${createTotalsBox(invoice.taxes, invoice.totals)}

        <!-- Información de pago -->
        ${invoice.payment ? createPaymentInfo(invoice.payment) : ''}

        <!-- Botón volver -->
        <div class="mt-8 text-center">
          <button
            id="btn-back"
            class="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Cargar otra factura
          </button>
        </div>
      </div>
    </div>
  `
}

function getInvoiceTypeLabel(type) {
  const types = {
    'FC': 'Factura completa',
    'FA': 'Factura simplificada',
    'AF': 'Autofactura'
  }
  return types[type] || type || 'Factura'
}

function getInvoiceClassLabel(invoiceClass) {
  const classes = {
    'OO': 'Original',
    'OR': 'Rectificativa',
    'CO': 'Copia'
  }
  return classes[invoiceClass] || invoiceClass || ''
}

function createPaymentInfo(payment) {
  return `
    <div class="bg-white rounded-xl shadow-sm p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Información de Pago</h3>
      <div class="grid md:grid-cols-2 gap-4 text-sm">
        ${payment.dueDate ? `<p><span class="text-gray-500">Vencimiento:</span> ${escapeHtml(formatDate(payment.dueDate))}</p>` : ''}
        ${payment.paymentMeans ? `<p><span class="text-gray-500">Forma de pago:</span> ${escapeHtml(getPaymentMeansLabel(payment.paymentMeans))}</p>` : ''}
        ${payment.iban ? `<p><span class="text-gray-500">IBAN:</span> ${escapeHtml(payment.iban)}</p>` : ''}
        ${payment.bic ? `<p><span class="text-gray-500">BIC:</span> ${escapeHtml(payment.bic)}</p>` : ''}
      </div>
    </div>
  `
}

function getPaymentMeansLabel(code) {
  const means = {
    '01': 'Efectivo',
    '02': 'Cheque',
    '04': 'Transferencia',
    '05': 'Letra aceptada',
    '06': 'Crédito documentario',
    '07': 'Contrato adjudicación',
    '08': 'Letra de cambio',
    '09': 'Pagaré a la orden',
    '10': 'Pagaré no a la orden',
    '11': 'Cheque conformado',
    '12': 'Cheque bancario',
    '13': 'Pago contra reembolso',
    '14': 'Recibo domiciliado',
    '15': 'Recibo',
    '16': 'Tarjeta crédito',
    '17': 'Compensación',
    '18': 'Pago especial',
    '19': 'Domiciliación'
  }
  return means[code] || code
}
