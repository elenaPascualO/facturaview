/**
 * Componente BatchHeader - Navegación de lote de facturas
 */

import { formatCurrency } from '../utils/formatters.js'
import { escapeHtml } from '../utils/sanitizers.js'
import { t } from '../utils/i18n.js'

/**
 * Creates the batch header with navigation controls
 * @param {Object} data - Parsed Facturae data
 * @param {number} currentIndex - Current invoice index (0-based)
 * @returns {string} HTML string
 */
export function createBatchHeader(data, currentIndex) {
  const { fileHeader, invoices } = data
  const total = invoices.length
  const batch = fileHeader.batch
  const currency = fileHeader.currencyCode || 'EUR'

  return `
    <div class="bg-blue-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-blue-800 dark:text-blue-200">
            ${t('batch.title', { count: total })}
          </h2>
          ${batch?.identifier ? `
            <p class="text-sm text-blue-600 dark:text-blue-300">
              ${t('batch.identifier')}: ${escapeHtml(batch.identifier)}
            </p>
          ` : ''}
          ${batch?.totalAmount ? `
            <p class="text-sm text-blue-600 dark:text-blue-300">
              ${t('batch.totalAmount')}: ${formatCurrency(batch.totalAmount, currency)}
            </p>
          ` : ''}
        </div>

        <div class="flex items-center gap-2">
          <!-- Previous button -->
          <button
            id="btn-prev-invoice"
            aria-label="${t('batch.previous')}"
            title="${t('batch.previous')}"
            class="p-2 rounded-lg bg-white dark:bg-slate-600 hover:bg-gray-100 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ${currentIndex === 0 ? 'disabled' : ''}
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Invoice selector dropdown -->
          <select
            id="invoice-selector"
            aria-label="${t('batch.selectInvoice')}"
            class="px-3 py-2 rounded-lg bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ${invoices.map((inv, idx) => `
              <option value="${idx}" ${idx === currentIndex ? 'selected' : ''}>
                ${idx + 1}. ${escapeHtml(inv.series ? inv.series + '/' : '')}${escapeHtml(inv.number || `#${idx + 1}`)}
              </option>
            `).join('')}
          </select>

          <!-- Next button -->
          <button
            id="btn-next-invoice"
            aria-label="${t('batch.next')}"
            title="${t('batch.next')}"
            class="p-2 rounded-lg bg-white dark:bg-slate-600 hover:bg-gray-100 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ${currentIndex === total - 1 ? 'disabled' : ''}
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Current position indicator -->
          <span class="text-sm text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
            ${currentIndex + 1} / ${total}
          </span>
        </div>
      </div>
    </div>
  `
}
