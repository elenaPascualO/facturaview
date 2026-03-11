/**
 * Tracking de eventos con Umami
 * Wrapper que verifica si umami está disponible antes de trackear
 */

/**
 * Check if tracking should be skipped (localhost or manually disabled).
 * Disable in your browser: localStorage.setItem('umami.disabled', '1')
 * @returns {boolean}
 */
function isTrackingDisabled() {
  if (typeof window === 'undefined') return true
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') return true
  try {
    return localStorage.getItem('umami.disabled') === '1'
  } catch {
    return false
  }
}

/**
 * Trackea un evento en Umami
 * @param {string} event - Nombre del evento
 * @param {Object} [data] - Datos adicionales del evento
 */
export function track(event, data = {}) {
  if (typeof window !== 'undefined' && window.umami && !isTrackingDisabled()) {
    window.umami.track(event, data)
  }
}

// Eventos predefinidos para consistencia
export const events = {
  FILE_UPLOADED: 'file-uploaded',
  FILE_ERROR: 'file-error',
  EXPORT_PDF: 'export-pdf',
  EXPORT_EXCEL: 'export-excel',
  CONTACT_SENT: 'contact-sent'
}
