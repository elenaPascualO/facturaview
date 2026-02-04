/**
 * Utilidades para manejo de errores amigables
 */

import { t } from './i18n.js'

/**
 * Códigos de error internos
 */
export const ErrorCodes = {
  XML_MALFORMED: 'XML_MALFORMED',
  NOT_FACTURAE: 'NOT_FACTURAE',
  NO_INVOICES: 'NO_INVOICES',
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
  MISSING_SELLER: 'MISSING_SELLER',
  MISSING_BUYER: 'MISSING_BUYER',
  MISSING_TOTALS: 'MISSING_TOTALS',
  UNKNOWN: 'UNKNOWN'
}

/**
 * Mapeo de códigos de error a claves de traducción
 */
const errorTranslationKeys = {
  [ErrorCodes.XML_MALFORMED]: 'error.xmlMalformed',
  [ErrorCodes.NOT_FACTURAE]: 'error.notFacturae',
  [ErrorCodes.NO_INVOICES]: 'error.noInvoices',
  [ErrorCodes.UNSUPPORTED_VERSION]: 'error.unsupportedVersion',
  [ErrorCodes.MISSING_SELLER]: 'error.missingSeller',
  [ErrorCodes.MISSING_BUYER]: 'error.missingBuyer',
  [ErrorCodes.MISSING_TOTALS]: 'error.missingTotals',
  [ErrorCodes.UNKNOWN]: 'error.unknown'
}

/**
 * Obtener mensaje de error amigable por código
 * @param {string} code - Código de error
 * @returns {string} - Mensaje amigable traducido
 */
function getFriendlyMessageByCode(code) {
  const key = errorTranslationKeys[code] || errorTranslationKeys[ErrorCodes.UNKNOWN]
  return t(key)
}

/**
 * Patrones de errores técnicos y su mapeo a códigos
 */
const errorPatterns = [
  { pattern: /parsererror/i, code: ErrorCodes.XML_MALFORMED },
  { pattern: /XML inválido/i, code: ErrorCodes.XML_MALFORMED },
  { pattern: /invoice.*undefined|undefined.*invoice/i, code: ErrorCodes.NO_INVOICES },
  { pattern: /invoices\[0\]/i, code: ErrorCodes.NO_INVOICES },
  { pattern: /is not an object.*invoice/i, code: ErrorCodes.NO_INVOICES },
  { pattern: /Cannot read.*invoice/i, code: ErrorCodes.NO_INVOICES },
  { pattern: /no.*facturae/i, code: ErrorCodes.NOT_FACTURAE },
  { pattern: /SchemaVersion/i, code: ErrorCodes.UNSUPPORTED_VERSION },
  { pattern: /seller.*null|null.*seller/i, code: ErrorCodes.MISSING_SELLER },
  { pattern: /buyer.*null|null.*buyer/i, code: ErrorCodes.MISSING_BUYER },
  { pattern: /totals.*null|null.*totals/i, code: ErrorCodes.MISSING_TOTALS }
]

/**
 * Clase de error personalizada para errores de Facturae
 */
export class FacturaeError extends Error {
  constructor(code, technicalMessage = '') {
    const friendlyMessage = getFriendlyMessageByCode(code)
    super(friendlyMessage)
    this.name = 'FacturaeError'
    this.code = code
    this.technicalMessage = technicalMessage
    this.friendlyMessage = friendlyMessage
  }
}

/**
 * Obtener mensaje amigable a partir de un error técnico
 * @param {Error|string} error - Error técnico o mensaje de error
 * @returns {string} - Mensaje amigable para el usuario
 */
export function getFriendlyErrorMessage(error) {
  // Si ya es un FacturaeError, devolver el mensaje amigable
  if (error instanceof FacturaeError) {
    return error.friendlyMessage
  }

  const errorMessage = error instanceof Error ? error.message : String(error)

  // Buscar coincidencia con patrones conocidos
  for (const { pattern, code } of errorPatterns) {
    if (pattern.test(errorMessage)) {
      return getFriendlyMessageByCode(code)
    }
  }

  // Si no hay coincidencia, devolver mensaje genérico
  return getFriendlyMessageByCode(ErrorCodes.UNKNOWN)
}

/**
 * Detectar código de error a partir de un error técnico
 * @param {Error|string} error - Error técnico
 * @returns {string} - Código de error
 */
export function detectErrorCode(error) {
  if (error instanceof FacturaeError) {
    return error.code
  }

  const errorMessage = error instanceof Error ? error.message : String(error)

  for (const { pattern, code } of errorPatterns) {
    if (pattern.test(errorMessage)) {
      return code
    }
  }

  return ErrorCodes.UNKNOWN
}
