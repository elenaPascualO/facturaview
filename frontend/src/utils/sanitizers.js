/**
 * Utilidades de sanitización para prevenir vulnerabilidades de seguridad
 */

/**
 * Escapar HTML para prevenir XSS
 * @param {*} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
export function escapeHtml(text) {
  if (text === null || text === undefined) return ''
  const str = String(text)
  const escapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  return str.replace(/[&<>"'/]/g, char => escapes[char])
}

/**
 * Sanitizar para Excel - prevenir inyección de fórmulas
 * Las fórmulas en Excel empiezan con =, +, -, @, tab, o newline
 * @param {*} value - Valor a sanitizar
 * @returns {string} - Valor seguro para Excel
 */
export function sanitizeExcelValue(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  // Si empieza con caracteres peligrosos, prefijar con apóstrofe
  if (str.length > 0 && ['=', '+', '-', '@', '\t', '\r', '\n'].includes(str.charAt(0))) {
    return "'" + str
  }
  return str
}

/**
 * Sanitizar nombres de archivo
 * Elimina caracteres peligrosos y caracteres de control
 * @param {*} name - Nombre de archivo a sanitizar
 * @returns {string} - Nombre de archivo seguro
 */
export function sanitizeFilename(name) {
  if (!name) return 'sin-numero'
  return String(name)
    // Eliminar caracteres no permitidos en sistemas de archivos
    .replace(/[<>:"/\\|?*]/g, '')
    // Eliminar caracteres de control
    .replace(/[\x00-\x1f\x80-\x9f]/g, '')
    // Reemplazar espacios con guiones
    .replace(/\s+/g, '-')
    // Limitar longitud
    .substring(0, 100) || 'sin-numero'
}