/**
 * Utilidades de formateo
 */

/**
 * Formatea un número como moneda EUR
 */
export function formatCurrency(amount, currency = 'EUR') {
  if (amount === null || amount === undefined) return '-'

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Formatea una fecha ISO a formato español
 */
export function formatDate(dateString) {
  if (!dateString) return '-'

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * Formatea un NIF/CIF
 */
export function formatTaxId(taxId) {
  if (!taxId) return '-'
  return taxId.toUpperCase()
}
