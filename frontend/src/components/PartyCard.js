/**
 * Componente PartyCard - Tarjeta de emisor/receptor
 */

import { escapeHtml } from '../utils/sanitizers.js'
import { t } from '../utils/i18n.js'

export function createPartyCard(title, party) {
  if (!party) {
    return `
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">${escapeHtml(title)}</h3>
        <p class="text-gray-500 dark:text-gray-400">${t('party.notAvailable')}</p>
      </div>
    `
  }

  const address = party.address
    ? [party.address.street, party.address.postCode, party.address.town, party.address.province]
        .filter(Boolean)
        .join(', ')
    : null

  const taxId = party.taxId || ''

  return `
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">${escapeHtml(title)}</h3>
      <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">${escapeHtml(party.name || t('party.noName'))}</p>
      <p class="text-gray-600 dark:text-gray-300 flex items-center gap-2">
        <span>${escapeHtml(taxId || t('party.noTaxId'))}</span>
        ${taxId ? `
          <button
            class="btn-copy text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            data-copy="${escapeHtml(taxId)}"
            aria-label="${t('party.copyTaxId')}"
            title="${t('party.copyTaxId')}"
          >
            <svg class="w-4 h-4 copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <svg class="w-4 h-4 check-icon hidden text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
        ` : ''}
      </p>
      ${address ? `<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">${escapeHtml(address)}</p>` : ''}
    </div>
  `
}
