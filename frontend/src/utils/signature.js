/**
 * Cliente para API de validación de firmas digitales
 */

// URL base de la API. Si no está configurada, usa ruta relativa (mismo origen)
const API_URL = import.meta.env.VITE_SIGNATURE_API_URL || ''

/**
 * Validar firma digital de un XML
 * @param {string} xmlContent - Contenido XML de la factura
 * @returns {Promise<Object>} - Resultado de la validación
 */
export async function validateSignature(xmlContent) {
  try {
    const formData = new FormData()
    formData.append('file', new Blob([xmlContent], { type: 'application/xml' }), 'factura.xml')

    const response = await fetch(`${API_URL}/api/validate-signature`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Error ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[FacturaView] Error validando firma:', error)
    return {
      valid: null,
      error: error.message,
      errors: [`Error de conexión: ${error.message}`]
    }
  }
}

/**
 * Verificar si la API de firma está disponible
 * @returns {Promise<boolean>}
 */
export async function isSignatureApiAvailable() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    return response.ok
  } catch {
    return false
  }
}