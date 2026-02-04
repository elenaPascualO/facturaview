/**
 * Utilidades para manejo de errores amigables
 */

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
 * Mensajes de error amigables para el usuario
 */
const friendlyMessages = {
  [ErrorCodes.XML_MALFORMED]: 'El archivo no es un XML válido. Verifica que el archivo no esté dañado.',
  [ErrorCodes.NOT_FACTURAE]: 'El archivo no parece ser una factura electrónica Facturae. Asegúrate de subir un archivo XML de factura electrónica española.',
  [ErrorCodes.NO_INVOICES]: 'El archivo XML no contiene ninguna factura. Verifica que sea un archivo Facturae válido.',
  [ErrorCodes.UNSUPPORTED_VERSION]: 'Esta versión de Facturae no está soportada. Solo se admiten las versiones 3.2, 3.2.1 y 3.2.2.',
  [ErrorCodes.MISSING_SELLER]: 'La factura no contiene datos del emisor (SellerParty).',
  [ErrorCodes.MISSING_BUYER]: 'La factura no contiene datos del receptor (BuyerParty).',
  [ErrorCodes.MISSING_TOTALS]: 'La factura no contiene información de totales.',
  [ErrorCodes.UNKNOWN]: 'Ha ocurrido un error inesperado al procesar la factura.'
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
    const friendlyMessage = friendlyMessages[code] || friendlyMessages[ErrorCodes.UNKNOWN]
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
      return friendlyMessages[code]
    }
  }

  // Si no hay coincidencia, devolver mensaje genérico
  return friendlyMessages[ErrorCodes.UNKNOWN]
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