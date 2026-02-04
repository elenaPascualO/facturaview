/**
 * Componente HistorySection - Sección de facturas recientes en el Dropzone
 */

import { formatCurrency, formatDate } from '../utils/formatters.js'
import { escapeHtml } from '../utils/sanitizers.js'
import { t } from '../utils/i18n.js'

/**
 * Crea la sección de historial de facturas recientes
 * @param {Array} invoices - Lista de facturas del historial (máx 5)
 * @returns {string} HTML de la sección
 */
export function createHistorySection(invoices) {
  if (!invoices || invoices.length === 0) {
    return ''
  }

  // Mostrar máximo 5 facturas
  const recentInvoices = invoices.slice(0, 5)

  return `
    <section class="mt-8 w-full max-w-xl" aria-label="${t('history.title')}">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span>${t('history.title')}</span>
          <span class="text-xs font-normal text-gray-400 dark:text-gray-500">(${invoices.length})</span>
        </h2>

        <ul class="space-y-3" role="list">
          ${recentInvoices.map(invoice => createHistoryCard(invoice)).join('')}
        </ul>

        <!-- Botón limpiar historial -->
        <button
          id="btn-clear-history"
          class="mt-4 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1"
          aria-label="${t('history.clearHistoryLabel')}"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          ${t('history.clearHistory')}
        </button>

        <!-- Mensaje de privacidad -->
        <p class="mt-4 text-xs text-gray-400 dark:text-gray-500 flex items-start gap-1">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>${t('history.privacyNote')}</span>
        </p>
      </div>
    </section>
  `
}

/**
 * Crea una tarjeta de factura para el historial
 * @param {Object} invoice - Factura del historial
 * @returns {string} HTML de la tarjeta
 */
function createHistoryCard(invoice) {
  const { id, metadata, signatureValid, savedAt } = invoice

  // Construir número de factura
  const invoiceNumber = metadata.series
    ? `${escapeHtml(metadata.series)}/${escapeHtml(metadata.number)}`
    : escapeHtml(metadata.number || t('history.noNumber'))

  // Formatear total con moneda
  const total = formatCurrency(metadata.total, metadata.currency || 'EUR')

  // Formatear fecha de emisión
  const issueDate = formatDate(metadata.issueDate)

  // Estado de firma
  const signatureStatus = getSignatureStatusHtml(signatureValid)

  // Nombre del vendedor (truncado)
  const sellerName = escapeHtml(truncate(metadata.sellerName || t('history.unknownSeller'), 25))

  return `
    <li>
      <button
        class="history-card w-full text-left p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-invoice-id="${escapeHtml(id)}"
        aria-label="${t('history.loadInvoice', { number: invoiceNumber })}"
      >
        <div class="flex justify-between items-start gap-2">
          <div class="min-w-0 flex-1">
            <p class="font-medium text-gray-800 dark:text-gray-100 truncate">
              ${invoiceNumber}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
              ${sellerName}
            </p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="font-medium text-gray-800 dark:text-gray-100">
              ${total}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              ${issueDate}
            </p>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-between text-xs">
          ${signatureStatus}
          <span class="text-gray-400 dark:text-gray-500">v${escapeHtml(metadata.version || '?')}</span>
        </div>
      </button>
    </li>
  `
}

/**
 * Genera el HTML del estado de firma
 * @param {boolean|null} signatureValid
 * @returns {string} HTML
 */
function getSignatureStatusHtml(signatureValid) {
  if (signatureValid === true) {
    return `<span class="text-green-600 dark:text-green-400 flex items-center gap-1"><span>✓</span> ${t('history.signatureValid')}</span>`
  }
  if (signatureValid === false) {
    return `<span class="text-red-600 dark:text-red-400 flex items-center gap-1"><span>✕</span> ${t('history.signatureInvalid')}</span>`
  }
  return `<span class="text-yellow-600 dark:text-yellow-400 flex items-center gap-1"><span>⚠</span> ${t('history.noSignature')}</span>`
}

/**
 * Trunca un texto a un máximo de caracteres
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text || ''
  return text.substring(0, maxLength - 1) + '…'
}

/**
 * Crea el modal de confirmación para limpiar historial
 * @returns {string} HTML del modal
 */
export function createClearHistoryModal() {
  return `
    <div id="clear-history-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="clear-history-title">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-sm w-full p-6">
        <h3 id="clear-history-title" class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          ${t('clearHistory.title')}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
          ${t('clearHistory.message')}
        </p>
        <div class="flex justify-end gap-3">
          <button
            id="btn-cancel-clear"
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ${t('clearHistory.cancel')}
          </button>
          <button
            id="btn-confirm-clear"
            class="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            ${t('clearHistory.confirm')}
          </button>
        </div>
      </div>
    </div>
  `
}
