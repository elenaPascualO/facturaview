/**
 * Componente FileSelector - Navegación entre múltiples archivos cargados
 */

import { escapeHtml } from '../utils/sanitizers.js'
import { t } from '../utils/i18n.js'

/**
 * Creates the file selector header for navigating between multiple loaded files
 * @param {Array} files - Array of loaded file objects with metadata
 * @param {number} currentIndex - Current file index (0-based)
 * @returns {string} HTML string
 */
export function createFileSelector(files, currentIndex) {
  const total = files.length

  // Don't render if only one file
  if (total <= 1) return ''

  return `
    <div class="bg-indigo-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
            ${t('files.title', { count: total })}
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <!-- Previous button -->
          <button
            id="btn-prev-file"
            aria-label="${t('files.previous')}"
            title="${t('files.previous')}"
            class="p-2 rounded-lg bg-white dark:bg-slate-600 hover:bg-gray-100 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ${currentIndex === 0 ? 'disabled' : ''}
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- File selector dropdown -->
          <select
            id="file-selector"
            aria-label="${t('files.selectFile')}"
            class="px-3 py-2 rounded-lg bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-xs truncate"
          >
            ${files.map((file, idx) => {
              const label = getFileLabel(file, idx)
              return `
                <option value="${idx}" ${idx === currentIndex ? 'selected' : ''}>
                  ${idx + 1}. ${escapeHtml(label)}
                </option>
              `
            }).join('')}
          </select>

          <!-- Next button -->
          <button
            id="btn-next-file"
            aria-label="${t('files.next')}"
            title="${t('files.next')}"
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

/**
 * Get a display label for a file
 * @param {Object} file - File object with data and filename
 * @param {number} index - File index
 * @returns {string} Display label
 */
function getFileLabel(file, index) {
  // Try to use filename if available
  if (file.filename) {
    // Remove extension and truncate if too long
    const name = file.filename.replace(/\.(xml|xsig)$/i, '')
    return name.length > 30 ? name.substring(0, 27) + '...' : name
  }

  // Fall back to invoice number from first invoice
  const firstInvoice = file.data?.invoices?.[0]
  if (firstInvoice?.number) {
    const series = firstInvoice.series ? firstInvoice.series + '/' : ''
    return series + firstInvoice.number
  }

  // Last resort: use index
  return `Archivo ${index + 1}`
}
