/**
 * Componente LinesTable - Tabla de líneas de factura
 */

import { formatCurrency } from '../utils/formatters.js'

export function createLinesTable(lines) {
  if (!lines || lines.length === 0) {
    return `
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Detalle</h3>
        <p class="text-gray-500">Sin líneas de detalle</p>
      </div>
    `
  }

  const rows = lines.map(line => `
    <tr class="border-b border-gray-100">
      <td class="py-3 px-4 text-gray-800">${line.description || '-'}</td>
      <td class="py-3 px-4 text-center text-gray-600">${line.quantity}</td>
      <td class="py-3 px-4 text-right text-gray-600">${formatCurrency(line.unitPrice)}</td>
      <td class="py-3 px-4 text-center text-gray-600">${line.taxRate}%</td>
      <td class="py-3 px-4 text-right font-medium text-gray-800">${formatCurrency(line.grossAmount || line.totalAmount)}</td>
    </tr>
  `).join('')

  return `
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <h3 class="text-lg font-semibold text-gray-800 p-6 pb-4">Detalle</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Descripción</th>
              <th class="py-3 px-4 text-center text-sm font-medium text-gray-500">Cantidad</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Precio</th>
              <th class="py-3 px-4 text-center text-sm font-medium text-gray-500">IVA</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Total</th>
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
