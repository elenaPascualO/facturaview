/**
 * Componente LinesTable - Tabla de líneas de factura
 */

import { formatCurrency } from '../utils/formatters.js'
import { escapeHtml } from '../utils/sanitizers.js'
import { t } from '../utils/i18n.js'

export function createLinesTable(lines) {
  if (!lines || lines.length === 0) {
    return `
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">${t('lines.title')}</h3>
        <p class="text-gray-500 dark:text-gray-400">${t('lines.noLines')}</p>
      </div>
    `
  }

  const rows = lines.map(line => `
    <tr class="border-b border-gray-100 dark:border-slate-700">
      <td class="py-3 px-4 text-gray-800 dark:text-gray-200">${escapeHtml(line.description || '-')}</td>
      <td class="py-3 px-4 text-center text-gray-600 dark:text-gray-300">${escapeHtml(line.quantity)}</td>
      <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-300">${escapeHtml(formatCurrency(line.unitPrice))}</td>
      <td class="py-3 px-4 text-center text-gray-600 dark:text-gray-300">${escapeHtml(line.taxRate)}%</td>
      <td class="py-3 px-4 text-right font-medium text-gray-800 dark:text-gray-100">${escapeHtml(formatCurrency(line.grossAmount || line.totalAmount))}</td>
    </tr>
  `).join('')

  return `
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 p-6 pb-4">${t('lines.title')}</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th scope="col" class="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">${t('lines.description')}</th>
              <th scope="col" class="py-3 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-300">${t('lines.quantity')}</th>
              <th scope="col" class="py-3 px-4 text-right text-sm font-medium text-gray-500 dark:text-gray-300">${t('lines.price')}</th>
              <th scope="col" class="py-3 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-300">${t('lines.vat')}</th>
              <th scope="col" class="py-3 px-4 text-right text-sm font-medium text-gray-500 dark:text-gray-300">${t('lines.total')}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `
}
