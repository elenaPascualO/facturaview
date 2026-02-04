/**
 * Tests de almacenamiento local (historial de facturas)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getHistory,
  getInvoice,
  saveInvoice,
  deleteInvoice,
  clearHistory,
  getStorageSize,
  getSavePreference,
  shouldAskToSave,
  shouldAutoSave,
  setSavePreference,
  findExistingInvoice,
  STORAGE_KEY,
  MAX_INVOICES,
  MAX_SIZE_BYTES
} from '../src/utils/storage.js'

// Mock de factura parseada
function createMockInvoice(overrides = {}) {
  return {
    version: '3.2.2',
    currency: 'EUR',
    isSigned: false,
    seller: { name: 'Empresa Test S.L.' },
    buyer: { name: 'Cliente Test' },
    invoices: [{
      number: '001',
      series: 'FA',
      issueDate: '2024-01-15',
      invoiceType: 'FC',
      invoiceClass: 'OO',
      lines: [],
      taxes: [],
      totals: { total: 1210.00 }
    }],
    ...overrides
  }
}

describe('Storage - getHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna array vacío si no hay datos', () => {
    const history = getHistory()
    expect(history).toEqual([])
  })

  it('retorna array vacío si localStorage está corrupto', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid json {')
    const history = getHistory()
    expect(history).toEqual([])
  })

  it('retorna array vacío si estructura es inválida', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ something: 'else' }))
    const history = getHistory()
    expect(history).toEqual([])
  })

  it('retorna facturas ordenadas por fecha (más reciente primero)', () => {
    const data = {
      invoices: [
        { id: '1', savedAt: '2024-01-01T00:00:00Z', metadata: {} },
        { id: '2', savedAt: '2024-01-15T00:00:00Z', metadata: {} },
        { id: '3', savedAt: '2024-01-10T00:00:00Z', metadata: {} }
      ],
      preferences: { saveMode: 'ask' }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

    const history = getHistory()
    expect(history[0].id).toBe('2')
    expect(history[1].id).toBe('3')
    expect(history[2].id).toBe('1')
  })
})

describe('Storage - saveInvoice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('guarda factura y genera UUID', () => {
    const invoice = createMockInvoice()
    const result = saveInvoice(invoice, '<xml>content</xml>')

    expect(result.success).toBe(true)
    expect(result.id).toBeDefined()
    expect(result.id).toMatch(/^[0-9a-f-]{36}$/)

    const history = getHistory()
    expect(history.length).toBe(1)
    expect(history[0].metadata.number).toBe('001')
    expect(history[0].metadata.sellerName).toBe('Empresa Test S.L.')
  })

  it('guarda metadata correctamente', () => {
    const invoice = createMockInvoice({
      seller: { name: 'Mi Empresa' },
      buyer: { name: 'Tu Empresa' },
      currency: 'USD'
    })
    invoice.invoices[0].number = '123'
    invoice.invoices[0].series = 'B'
    invoice.invoices[0].totals.total = 500

    const result = saveInvoice(invoice, '<xml/>')
    expect(result.success).toBe(true)

    const saved = getInvoice(result.id)
    expect(saved.metadata.number).toBe('123')
    expect(saved.metadata.series).toBe('B')
    expect(saved.metadata.sellerName).toBe('Mi Empresa')
    expect(saved.metadata.buyerName).toBe('Tu Empresa')
    expect(saved.metadata.total).toBe(500)
    expect(saved.metadata.currency).toBe('USD')
  })

  it('guarda estado de firma', () => {
    const invoice = createMockInvoice()
    const signatureData = { valid: true }

    const result = saveInvoice(invoice, '<xml/>', signatureData)
    const saved = getInvoice(result.id)

    expect(saved.signatureValid).toBe(true)
  })

  it('signatureValid es null si no hay datos de firma', () => {
    const invoice = createMockInvoice()
    const result = saveInvoice(invoice, '<xml/>')
    const saved = getInvoice(result.id)

    expect(saved.signatureValid).toBeNull()
  })

  it('respeta límite de 50 facturas (FIFO)', () => {
    // Guardar 51 facturas
    for (let i = 0; i < 51; i++) {
      const invoice = createMockInvoice()
      invoice.invoices[0].number = String(i).padStart(3, '0')
      saveInvoice(invoice, '<xml/>')
    }

    const history = getHistory()
    expect(history.length).toBe(MAX_INVOICES)
    // La primera (número 000) debería haberse eliminado
    expect(history.some(h => h.metadata.number === '000')).toBe(false)
    // La última (número 050) debería estar
    expect(history.some(h => h.metadata.number === '050')).toBe(true)
  })

  it('rechaza datos inválidos', () => {
    expect(saveInvoice(null, '<xml/>')).toEqual({
      success: false,
      error: 'Datos inválidos'
    })
    expect(saveInvoice({}, null)).toEqual({
      success: false,
      error: 'Datos inválidos'
    })
  })

  it('guarda xmlContent para re-validación', () => {
    const invoice = createMockInvoice()
    const xmlContent = '<?xml version="1.0"?><Facturae>...</Facturae>'

    const result = saveInvoice(invoice, xmlContent)
    const saved = getInvoice(result.id)

    expect(saved.xmlContent).toBe(xmlContent)
  })
})

describe('Storage - getInvoice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna factura por ID', () => {
    const invoice = createMockInvoice()
    const { id } = saveInvoice(invoice, '<xml/>')

    const found = getInvoice(id)
    expect(found).not.toBeNull()
    expect(found.id).toBe(id)
  })

  it('retorna null si no existe', () => {
    expect(getInvoice('non-existent-id')).toBeNull()
  })

  it('retorna null para ID vacío o inválido', () => {
    expect(getInvoice('')).toBeNull()
    expect(getInvoice(null)).toBeNull()
    expect(getInvoice(undefined)).toBeNull()
  })
})

describe('Storage - deleteInvoice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('elimina factura correctamente', () => {
    const invoice = createMockInvoice()
    const { id } = saveInvoice(invoice, '<xml/>')

    expect(getHistory().length).toBe(1)
    const deleted = deleteInvoice(id)
    expect(deleted).toBe(true)
    expect(getHistory().length).toBe(0)
    expect(getInvoice(id)).toBeNull()
  })

  it('retorna false si no existe', () => {
    expect(deleteInvoice('non-existent')).toBe(false)
  })

  it('retorna false para ID inválido', () => {
    expect(deleteInvoice('')).toBe(false)
    expect(deleteInvoice(null)).toBe(false)
  })

  it('no afecta otras facturas', () => {
    const invoice1 = createMockInvoice()
    invoice1.invoices[0].number = '001'
    const invoice2 = createMockInvoice()
    invoice2.invoices[0].number = '002'

    const { id: id1 } = saveInvoice(invoice1, '<xml/>')
    saveInvoice(invoice2, '<xml/>')

    deleteInvoice(id1)

    const history = getHistory()
    expect(history.length).toBe(1)
    expect(history[0].metadata.number).toBe('002')
  })
})

describe('Storage - clearHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('elimina todas las facturas', () => {
    saveInvoice(createMockInvoice(), '<xml/>')
    saveInvoice(createMockInvoice(), '<xml/>')
    saveInvoice(createMockInvoice(), '<xml/>')

    expect(getHistory().length).toBe(3)
    clearHistory()
    expect(getHistory().length).toBe(0)
  })

  it('mantiene las preferencias', () => {
    setSavePreference('always')
    saveInvoice(createMockInvoice(), '<xml/>')

    clearHistory()

    expect(getHistory().length).toBe(0)
    expect(getSavePreference()).toBe('always')
  })

  it('funciona con historial vacío', () => {
    expect(clearHistory()).toBe(true)
    expect(getHistory()).toEqual([])
  })
})

describe('Storage - Preferencias', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getSavePreference retorna "ask" por defecto', () => {
    expect(getSavePreference()).toBe('ask')
  })

  it('setSavePreference guarda preferencia "always"', () => {
    expect(setSavePreference('always')).toBe(true)
    expect(getSavePreference()).toBe('always')
  })

  it('setSavePreference guarda preferencia "never"', () => {
    expect(setSavePreference('never')).toBe(true)
    expect(getSavePreference()).toBe('never')
  })

  it('setSavePreference rechaza valores inválidos', () => {
    expect(setSavePreference('invalid')).toBe(false)
    expect(setSavePreference('')).toBe(false)
    expect(setSavePreference(null)).toBe(false)
  })

  it('shouldAskToSave retorna true cuando preference es "ask"', () => {
    setSavePreference('ask')
    expect(shouldAskToSave()).toBe(true)
  })

  it('shouldAskToSave retorna false cuando preference es "always"', () => {
    setSavePreference('always')
    expect(shouldAskToSave()).toBe(false)
  })

  it('shouldAutoSave retorna true cuando preference es "always"', () => {
    setSavePreference('always')
    expect(shouldAutoSave()).toBe(true)
  })

  it('shouldAutoSave retorna false cuando preference es "ask"', () => {
    setSavePreference('ask')
    expect(shouldAutoSave()).toBe(false)
  })
})

describe('Storage - getStorageSize', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna tamaño pequeño para historial vacío', () => {
    const size = getStorageSize()
    expect(size).toBeGreaterThan(0)
    expect(size).toBeLessThan(100) // Solo estructura base
  })

  it('aumenta con cada factura guardada', () => {
    const sizeBefore = getStorageSize()
    saveInvoice(createMockInvoice(), '<xml>some content here</xml>')
    const sizeAfter = getStorageSize()

    expect(sizeAfter).toBeGreaterThan(sizeBefore)
  })
})

describe('Storage - findExistingInvoice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('encuentra factura existente por número, serie y fecha', () => {
    const invoice = createMockInvoice()
    invoice.invoices[0].number = '123'
    invoice.invoices[0].series = 'A'
    invoice.invoices[0].issueDate = '2024-02-01'

    const { id } = saveInvoice(invoice, '<xml/>')

    const found = findExistingInvoice(invoice)
    expect(found).not.toBeNull()
    expect(found.id).toBe(id)
  })

  it('no encuentra factura con número diferente', () => {
    const invoice = createMockInvoice()
    invoice.invoices[0].number = '123'
    saveInvoice(invoice, '<xml/>')

    const differentInvoice = createMockInvoice()
    differentInvoice.invoices[0].number = '456'

    expect(findExistingInvoice(differentInvoice)).toBeNull()
  })

  it('distingue por serie', () => {
    const invoice = createMockInvoice()
    invoice.invoices[0].number = '001'
    invoice.invoices[0].series = 'A'
    saveInvoice(invoice, '<xml/>')

    const differentSeries = createMockInvoice()
    differentSeries.invoices[0].number = '001'
    differentSeries.invoices[0].series = 'B'

    expect(findExistingInvoice(differentSeries)).toBeNull()
  })

  it('retorna null para datos inválidos', () => {
    expect(findExistingInvoice(null)).toBeNull()
    expect(findExistingInvoice({})).toBeNull()
    expect(findExistingInvoice({ invoices: [] })).toBeNull()
  })
})

describe('Storage - Manejo de errores', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('maneja localStorage corrupto en getHistory', () => {
    localStorage.setItem(STORAGE_KEY, '{ invalid json }}}')
    expect(getHistory()).toEqual([])
  })

  it('maneja estructura inesperada', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]))
    expect(getHistory()).toEqual([])
  })

  it('maneja invoices como no-array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      invoices: 'not an array',
      preferences: { saveMode: 'ask' }
    }))
    expect(getHistory()).toEqual([])
  })

  it('maneja preferences corrupto', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      invoices: [],
      preferences: 'invalid'
    }))
    expect(getSavePreference()).toBe('ask')
  })
})

describe('Storage - Constantes', () => {
  it('MAX_INVOICES es 50', () => {
    expect(MAX_INVOICES).toBe(50)
  })

  it('MAX_SIZE_BYTES es 2 MB', () => {
    expect(MAX_SIZE_BYTES).toBe(2 * 1024 * 1024)
  })

  it('STORAGE_KEY está definido', () => {
    expect(STORAGE_KEY).toBe('facturaview-history')
  })
})
