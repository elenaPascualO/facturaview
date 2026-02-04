/**
 * Componente TotalsBox - Caja de impuestos y totales
 */

import { formatCurrency } from '../utils/formatters.js'
import { escapeHtml } from '../utils/sanitizers.js'
import { t } from '../utils/i18n.js'

export function createTotalsBox(taxes, totals) {
  if (!totals) {
    return ''
  }

  const taxRows = taxes && taxes.length > 0
    ? taxes.map(tax => `
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">${t('totals.vatWithBase', { rate: escapeHtml(tax.rate), base: escapeHtml(formatCurrency(tax.base)) })}</span>
          <span class="text-gray-800 dark:text-gray-200">${escapeHtml(formatCurrency(tax.amount))}</span>
        </div>
      `).join('')
    : ''

  return `
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">${t('totals.title')}</h3>

      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">${t('totals.taxableBase')}</span>
          <span class="text-gray-800 dark:text-gray-200">${escapeHtml(formatCurrency(totals.grossAmount))}</span>
        </div>

        ${taxRows}

        ${totals.taxesWithheld > 0 ? `
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">${t('totals.withholdings')}</span>
            <span class="text-red-600 dark:text-red-400">-${escapeHtml(formatCurrency(totals.taxesWithheld))}</span>
          </div>
        ` : ''}

        <div class="border-t border-gray-200 dark:border-slate-700 pt-2 mt-2">
          <div class="flex justify-between items-center text-lg font-semibold">
            <span class="text-gray-800 dark:text-gray-100">${t('totals.total')}</span>
            <span class="flex items-center gap-2">
              <span class="text-gray-900 dark:text-white">${escapeHtml(formatCurrency(totals.totalToPay))}</span>
              <button
                class="btn-copy text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                data-copy="${totals.totalToPay}"
                aria-label="${t('totals.copyTotal')}"
                title="${t('totals.copyTotal')}"
              >
                <svg class="w-4 h-4 copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <svg class="w-4 h-4 check-icon hidden text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  `
}
