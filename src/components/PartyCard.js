/**
 * Componente PartyCard - Tarjeta de emisor/receptor
 */

import { escapeHtml } from '../utils/sanitizers.js'

export function createPartyCard(title, party) {
  if (!party) {
    return `
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">${escapeHtml(title)}</h3>
        <p class="text-gray-500">No disponible</p>
      </div>
    `
  }

  const address = party.address
    ? [party.address.street, party.address.postCode, party.address.town, party.address.province]
        .filter(Boolean)
        .join(', ')
    : null

  return `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">${escapeHtml(title)}</h3>
      <p class="text-lg font-semibold text-gray-800">${escapeHtml(party.name || 'Sin nombre')}</p>
      <p class="text-gray-600">${escapeHtml(party.taxId || 'Sin NIF')}</p>
      ${address ? `<p class="text-sm text-gray-500 mt-2">${escapeHtml(address)}</p>` : ''}
    </div>
  `
}
