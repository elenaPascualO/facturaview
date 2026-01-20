/**
 * Componente TotalsBox - Caja de impuestos y totales
 */

import { formatCurrency } from '../utils/formatters.js'
import { escapeHtml } from '../utils/sanitizers.js'

export function createTotalsBox(taxes, totals) {
  if (!totals) {
    return ''
  }

  const taxRows = taxes && taxes.length > 0
    ? taxes.map(tax => `
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">IVA ${escapeHtml(tax.rate)}% (Base: ${escapeHtml(formatCurrency(tax.base))})</span>
          <span class="text-gray-800">${escapeHtml(formatCurrency(tax.amount))}</span>
        </div>
      `).join('')
    : ''

  return `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Totales</h3>

      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600">Base imponible</span>
          <span class="text-gray-800">${escapeHtml(formatCurrency(totals.grossAmount))}</span>
        </div>

        ${taxRows}

        ${totals.taxesWithheld > 0 ? `
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Retenciones</span>
            <span class="text-red-600">-${escapeHtml(formatCurrency(totals.taxesWithheld))}</span>
          </div>
        ` : ''}

        <div class="border-t border-gray-200 pt-2 mt-2">
          <div class="flex justify-between text-lg font-semibold">
            <span class="text-gray-800">TOTAL</span>
            <span class="text-gray-900">${escapeHtml(formatCurrency(totals.totalToPay))}</span>
          </div>
        </div>
      </div>
    </div>
  `
}
