import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseFacturae } from '../src/parser/facturae.js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Helper para leer fixtures
function readFixture(filename) {
  return readFileSync(join(__dirname, 'fixtures', filename), 'utf-8')
}

// Mock para jsPDF - usando clase
vi.mock('jspdf', () => {
  class MockJsPDF {
    constructor() {
      this.internal = {
        pageSize: {
          getWidth: () => 210,
          getHeight: () => 297
        }
      }
    }
    setFontSize() {}
    setTextColor() {}
    setFillColor() {}
    setDrawColor() {}
    text() {}
    rect() {}
    line() {}
    splitTextToSize(text) { return [text] }
    save() {}
  }

  return { jsPDF: MockJsPDF }
})

// Mock para xlsx
vi.mock('xlsx', () => ({
  utils: {
    book_new: vi.fn(() => ({})),
    aoa_to_sheet: vi.fn(() => ({})),
    book_append_sheet: vi.fn()
  },
  writeFile: vi.fn()
}))

describe('Exportación a PDF', () => {
  let invoiceData

  beforeEach(async () => {
    vi.clearAllMocks()
    const xml = readFixture('simple-322.xml')
    invoiceData = parseFacturae(xml)
  })

  it('genera PDF sin errores para factura simple', async () => {
    const { exportToPdf } = await import('../src/export/toPdf.js')

    expect(() => exportToPdf(invoiceData)).not.toThrow()
  })

  it('genera PDF para factura con retenciones', async () => {
    const xml = readFixture('with-retention.xml')
    const dataWithRetention = parseFacturae(xml)
    const { exportToPdf } = await import('../src/export/toPdf.js')

    expect(() => exportToPdf(dataWithRetention)).not.toThrow()
  })

  it('genera PDF para factura compleja con múltiples líneas', async () => {
    const xml = readFixture('complex-322.xml')
    const complexData = parseFacturae(xml)
    const { exportToPdf } = await import('../src/export/toPdf.js')

    expect(() => exportToPdf(complexData)).not.toThrow()
  })

  it('genera PDF para factura rectificativa con importes negativos', async () => {
    const xml = readFixture('rectificativa.xml')
    const rectificativaData = parseFacturae(xml)
    const { exportToPdf } = await import('../src/export/toPdf.js')

    expect(() => exportToPdf(rectificativaData)).not.toThrow()
  })

  it('genera PDF para todas las versiones Facturae', async () => {
    const { exportToPdf } = await import('../src/export/toPdf.js')

    const versions = ['simple-322.xml', 'simple-321.xml', 'simple-32.xml']
    for (const file of versions) {
      const xml = readFixture(file)
      const data = parseFacturae(xml)
      expect(() => exportToPdf(data)).not.toThrow()
    }
  })
})

describe('Exportación a Excel', () => {
  let invoiceData

  beforeEach(async () => {
    vi.clearAllMocks()
    const xml = readFixture('simple-322.xml')
    invoiceData = parseFacturae(xml)
  })

  it('genera Excel sin errores para factura simple', async () => {
    const { exportToExcel } = await import('../src/export/toExcel.js')

    expect(() => exportToExcel(invoiceData)).not.toThrow()
  })

  it('llama a XLSX.writeFile', async () => {
    const XLSX = await import('xlsx')
    const { exportToExcel } = await import('../src/export/toExcel.js')

    exportToExcel(invoiceData)

    expect(XLSX.writeFile).toHaveBeenCalled()
  })

  it('crea hojas para General, Líneas e Impuestos', async () => {
    const XLSX = await import('xlsx')
    const { exportToExcel } = await import('../src/export/toExcel.js')

    exportToExcel(invoiceData)

    // Verificar que se crearon las hojas
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(3)

    // Verificar nombres de hojas
    const calls = XLSX.utils.book_append_sheet.mock.calls
    expect(calls[0][2]).toBe('General')
    expect(calls[1][2]).toBe('Líneas')
    expect(calls[2][2]).toBe('Impuestos')
  })

  it('genera Excel para factura compleja', async () => {
    const xml = readFixture('complex-322.xml')
    const complexData = parseFacturae(xml)
    const { exportToExcel } = await import('../src/export/toExcel.js')

    expect(() => exportToExcel(complexData)).not.toThrow()
  })

  it('genera Excel para factura sin información de pago', async () => {
    const xml = readFixture('rectificativa.xml')
    const dataNoPayment = parseFacturae(xml)
    const { exportToExcel } = await import('../src/export/toExcel.js')

    expect(() => exportToExcel(dataNoPayment)).not.toThrow()
  })

  it('genera Excel para todas las versiones Facturae', async () => {
    const { exportToExcel } = await import('../src/export/toExcel.js')

    const versions = ['simple-322.xml', 'simple-321.xml', 'simple-32.xml']
    for (const file of versions) {
      const xml = readFixture(file)
      const data = parseFacturae(xml)
      expect(() => exportToExcel(data)).not.toThrow()
    }
  })
})

describe('Formato de datos en exportación', () => {
  it('formatea correctamente moneda EUR', async () => {
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    })

    // Usar includes para evitar problemas con espacios no separables
    const formatted100 = formatter.format(100)
    expect(formatted100).toContain('100,00')
    expect(formatted100).toContain('€')

    const formattedNegative = formatter.format(-50)
    expect(formattedNegative).toContain('50,00')
    expect(formattedNegative).toContain('€')
  })

  it('formatea correctamente fechas españolas', async () => {
    const formatter = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    expect(formatter.format(new Date('2024-01-15'))).toBe('15/01/2024')
  })
})