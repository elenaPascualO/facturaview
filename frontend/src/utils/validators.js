/**
 * Funciones de validación de archivos
 */

import { t } from './i18n.js'

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
    return { valid: false, error: t('validator.invalidFilename') }
  }

  const lowerName = fileName.toLowerCase()
  const isValid = ALLOWED_EXTENSIONS.some(ext => lowerName.endsWith(ext))

  if (!isValid) {
    return { valid: false, error: t('validator.unsupportedFormat') }
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
    return { valid: false, error: t('validator.invalidFileSize') }
  }

  if (fileSize > MAX_FILE_SIZE) {
    return { valid: false, error: t('validator.fileTooLarge') }
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
    return { valid: false, error: t('validator.noFile') }
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
