/**
 * Funciones de validación de archivos
 */

// Constantes de validación
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
export const ALLOWED_EXTENSIONS = ['.xml', '.xsig']

/**
 * Valida la extensión del archivo
 * @param {string} fileName - Nombre del archivo
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFileExtension(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    return { valid: false, error: 'Nombre de archivo inválido' }
  }

  const lowerName = fileName.toLowerCase()
  const isValid = ALLOWED_EXTENSIONS.some(ext => lowerName.endsWith(ext))

  if (!isValid) {
    return { valid: false, error: 'Formato no soportado. Usa archivos .xml o .xsig' }
  }

  return { valid: true }
}

/**
 * Valida el tamaño del archivo
 * @param {number} fileSize - Tamaño del archivo en bytes
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFileSize(fileSize) {
  if (typeof fileSize !== 'number' || fileSize < 0) {
    return { valid: false, error: 'Tamaño de archivo inválido' }
  }

  if (fileSize > MAX_FILE_SIZE) {
    return { valid: false, error: 'Archivo demasiado grande. Máximo: 10 MB' }
  }

  return { valid: true }
}

/**
 * Valida un archivo completo (extensión y tamaño)
 * @param {{ name: string, size: number }} file - Objeto con name y size
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No se ha proporcionado ningún archivo' }
  }

  const extensionResult = validateFileExtension(file.name)
  if (!extensionResult.valid) {
    return extensionResult
  }

  const sizeResult = validateFileSize(file.size)
  if (!sizeResult.valid) {
    return sizeResult
  }

  return { valid: true }
}
