/**
 * Utilidades de almacenamiento local para historial de facturas
 */

const STORAGE_KEY = 'facturaview-history'
const MAX_INVOICES = 50
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB

/**
 * Estructura de datos en localStorage:
 * {
 *   invoices: [{
 *     id: string (UUID),
 *     savedAt: string (ISO date),
 *     metadata: {
 *       number, series, issueDate,
 *       sellerName, buyerName,
 *       total, currency, version
 *     },
 *     signatureValid: true | false | null,
 *     data: object (factura completa parseada),
 *     xmlContent: string (contenido XML original)
 *   }],
 *   preferences: {
 *     saveMode: 'ask' | 'always' | 'never'
 *   }
 * }
 */

/**
 * Lee los datos del localStorage de forma segura
 * @returns {Object} Datos del historial o estructura vacía
 */
function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { invoices: [], preferences: { saveMode: 'ask' } }
    }
    const data = JSON.parse(raw)
    // Validar estructura básica
    if (!data || typeof data !== 'object') {
      return { invoices: [], preferences: { saveMode: 'ask' } }
    }
    if (!Array.isArray(data.invoices)) {
      data.invoices = []
    }
    if (!data.preferences || typeof data.preferences !== 'object') {
      data.preferences = { saveMode: 'ask' }
    }
    return data
  } catch {
    // localStorage corrupto o inaccesible
    return { invoices: [], preferences: { saveMode: 'ask' } }
  }
}

/**
 * Escribe datos en localStorage de forma segura
 * @param {Object} data - Datos a guardar
 * @returns {boolean} true si se guardó correctamente
 */
function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    // localStorage lleno o inaccesible
    return false
  }
}

/**
 * Genera un UUID v4
 * @returns {string} UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Obtiene el historial de facturas
 * @returns {Array} Lista de facturas guardadas (más recientes primero)
 */
export function getHistory() {
  const data = readStorage()
  return data.invoices.slice().sort((a, b) =>
    new Date(b.savedAt) - new Date(a.savedAt)
  )
}

/**
 * Obtiene una factura por su ID
 * @param {string} id - ID de la factura
 * @returns {Object|null} Factura o null si no existe
 */
export function getInvoice(id) {
  if (!id) return null
  const data = readStorage()
  return data.invoices.find(inv => inv.id === id) || null
}

/**
 * Extrae metadata de una factura parseada
 * @param {Object} parsedData - Datos parseados de la factura
 * @returns {Object} Metadata resumida
 */
function extractMetadata(parsedData) {
  const invoice = parsedData.invoices?.[0] || {}
  return {
    number: invoice.number || '',
    series: invoice.series || '',
    issueDate: invoice.issueDate || '',
    sellerName: parsedData.seller?.name || '',
    buyerName: parsedData.buyer?.name || '',
    total: invoice.totals?.total || 0,
    currency: parsedData.currency || 'EUR',
    version: parsedData.version || ''
  }
}

/**
 * Guarda una factura en el historial
 * @param {Object} parsedData - Datos parseados de la factura
 * @param {string} xmlContent - Contenido XML original
 * @param {Object|null} signatureData - Datos de validación de firma
 * @returns {Object} { success: boolean, id?: string, error?: string }
 */
export function saveInvoice(parsedData, xmlContent, signatureData = null) {
  if (!parsedData || !xmlContent) {
    return { success: false, error: 'Datos inválidos' }
  }

  const data = readStorage()

  // Verificar límite de tamaño antes de añadir
  const newInvoice = {
    id: generateUUID(),
    savedAt: new Date().toISOString(),
    metadata: extractMetadata(parsedData),
    signatureValid: signatureData?.valid ?? null,
    data: parsedData,
    xmlContent: xmlContent
  }

  const newInvoiceSize = JSON.stringify(newInvoice).length

  // Si la nueva factura sola excede el límite, no se puede guardar
  if (newInvoiceSize > MAX_SIZE_BYTES) {
    return { success: false, error: 'La factura es demasiado grande para guardar' }
  }

  // Añadir al principio
  data.invoices.unshift(newInvoice)

  // Aplicar límite de número de facturas (FIFO - eliminar las más antiguas)
  while (data.invoices.length > MAX_INVOICES) {
    data.invoices.pop()
  }

  // Aplicar límite de tamaño (eliminar las más antiguas hasta cumplir)
  while (getDataSize(data) > MAX_SIZE_BYTES && data.invoices.length > 1) {
    data.invoices.pop()
  }

  // Verificar si aún excede el límite (la nueva factura es muy grande)
  if (getDataSize(data) > MAX_SIZE_BYTES) {
    return { success: false, error: 'No hay espacio suficiente en el historial' }
  }

  if (writeStorage(data)) {
    return { success: true, id: newInvoice.id }
  }

  return { success: false, error: 'Error al guardar en localStorage' }
}

/**
 * Elimina una factura del historial
 * @param {string} id - ID de la factura
 * @returns {boolean} true si se eliminó
 */
export function deleteInvoice(id) {
  if (!id) return false
  const data = readStorage()
  const initialLength = data.invoices.length
  data.invoices = data.invoices.filter(inv => inv.id !== id)
  if (data.invoices.length < initialLength) {
    return writeStorage(data)
  }
  return false
}

/**
 * Limpia todo el historial de facturas
 * @returns {boolean} true si se limpió correctamente
 */
export function clearHistory() {
  const data = readStorage()
  data.invoices = []
  return writeStorage(data)
}

/**
 * Calcula el tamaño en bytes de los datos
 * @param {Object} data - Datos a medir
 * @returns {number} Tamaño en bytes
 */
function getDataSize(data) {
  try {
    return new Blob([JSON.stringify(data)]).size
  } catch {
    // Fallback para entornos sin Blob
    return JSON.stringify(data).length * 2 // Aproximación UTF-16
  }
}

/**
 * Obtiene el tamaño actual usado por el historial
 * @returns {number} Tamaño en bytes
 */
export function getStorageSize() {
  const data = readStorage()
  return getDataSize(data)
}

/**
 * Obtiene la preferencia de guardado actual
 * @returns {string} 'ask' | 'always' | 'never'
 */
export function getSavePreference() {
  const data = readStorage()
  const mode = data.preferences?.saveMode
  if (['ask', 'always', 'never'].includes(mode)) {
    return mode
  }
  return 'ask'
}

/**
 * Determina si se debe mostrar el prompt de guardado
 * @returns {boolean} true si debe preguntar
 */
export function shouldAskToSave() {
  return getSavePreference() === 'ask'
}

/**
 * Determina si se debe guardar automáticamente
 * @returns {boolean} true si debe guardar automáticamente
 */
export function shouldAutoSave() {
  return getSavePreference() === 'always'
}

/**
 * Guarda la preferencia de guardado
 * @param {string} value - 'ask' | 'always' | 'never'
 * @returns {boolean} true si se guardó
 */
export function setSavePreference(value) {
  if (!['ask', 'always', 'never'].includes(value)) {
    return false
  }
  const data = readStorage()
  data.preferences.saveMode = value
  return writeStorage(data)
}

/**
 * Verifica si una factura ya está guardada (por número y fecha)
 * @param {Object} parsedData - Datos parseados de la factura
 * @returns {Object|null} Factura guardada si existe, null si no
 */
export function findExistingInvoice(parsedData) {
  const invoice = parsedData?.invoices?.[0]
  if (!invoice) return null

  const data = readStorage()
  return data.invoices.find(saved =>
    saved.metadata.number === invoice.number &&
    saved.metadata.series === (invoice.series || '') &&
    saved.metadata.issueDate === invoice.issueDate
  ) || null
}

// Exportar constantes para tests
export { STORAGE_KEY, MAX_INVOICES, MAX_SIZE_BYTES }
