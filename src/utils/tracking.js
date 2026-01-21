/**
 * Tracking de eventos con Umami
 * Wrapper que verifica si umami está disponible antes de trackear
 */

/**
 * Trackea un evento en Umami
 * @param {string} event - Nombre del evento
 * @param {Object} [data] - Datos adicionales del evento
 */
export function track(event, data = {}) {
  if (typeof window !== 'undefined' && window.umami) {
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
