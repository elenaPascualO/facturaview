/**
 * Utilidad para copiar al portapapeles
 */

/**
 * Copiar texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} - true si se copió correctamente
 */
export async function copyToClipboard(text) {
  if (!text) return false

  // Intentar con API moderna
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fallback si falla (ej: sin HTTPS)
    }
  }

  // Fallback con execCommand (deprecated pero funciona en más navegadores)
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '-9999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  } catch {
    return false
  }
}