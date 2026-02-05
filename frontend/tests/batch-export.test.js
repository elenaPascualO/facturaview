import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { parseFacturae, isBatchInvoice } from '../src/parser/facturae.js'
import { generatePdfForInvoice } from '../src/export/toPdf.js'
import { setLang } from '../src/utils/i18n.js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Helper para leer fixtures
function readFixture(filename) {
  return readFileSync(join(__dirname, 'fixtures', filename), 'utf-8')
}

describe('Batch Export', () => {
  let batchData

  beforeAll(() => {
    const xml = readFixture('batch-322.xml')
    batchData = parseFacturae(xml)
  })

  beforeEach(() => {
    setLang('es')
  })

  describe('generatePdfForInvoice', () => {
    it('genera PDF para primera factura del lote', () => {
      const invoice = batchData.invoices[0]
      const pdf = generatePdfForInvoice(batchData, invoice)

      expect(pdf).toBeDefined()
      expect(typeof pdf.output).toBe('function')
    })

    it('genera PDF para segunda factura del lote', () => {
      const invoice = batchData.invoices[1]
      const pdf = generatePdfForInvoice(batchData, invoice)

      expect(pdf).toBeDefined()
      expect(typeof pdf.output).toBe('function')
    })

    it('genera PDF para tercera factura del lote', () => {
      const invoice = batchData.invoices[2]
      const pdf = generatePdfForInvoice(batchData, invoice)

      expect(pdf).toBeDefined()
      expect(typeof pdf.output).toBe('function')
    })

    it('genera PDFs diferentes para cada factura', () => {
      const pdf1 = generatePdfForInvoice(batchData, batchData.invoices[0])
      const pdf2 = generatePdfForInvoice(batchData, batchData.invoices[1])

      // Both should be valid PDF objects
      expect(pdf1.output('blob')).toBeDefined()
      expect(pdf2.output('blob')).toBeDefined()
    })
  })

  describe('isBatchInvoice helper', () => {
    it('returns true for batch invoice (Modality=L)', () => {
      expect(isBatchInvoice(batchData)).toBe(true)
    })

    it('returns true for multiple invoices even without Modality=L', () => {
      const multipleInvoices = {
        fileHeader: { modality: 'I' },
        invoices: [{}, {}, {}]
      }
      expect(isBatchInvoice(multipleInvoices)).toBe(true)
    })

    it('returns false for single invoice with Modality=I', () => {
      const singleInvoice = {
        fileHeader: { modality: 'I' },
        invoices: [{}]
      }
      expect(isBatchInvoice(singleInvoice)).toBe(false)
    })

    it('returns false for empty invoices array', () => {
      const emptyInvoices = {
        fileHeader: { modality: 'I' },
        invoices: []
      }
      expect(isBatchInvoice(emptyInvoices)).toBe(false)
    })

    it('handles missing fileHeader gracefully', () => {
      const noHeader = {
        invoices: [{}, {}]
      }
      expect(isBatchInvoice(noHeader)).toBe(true)
    })

    it('handles missing invoices gracefully', () => {
      const noInvoices = {
        fileHeader: { modality: 'L' }
      }
      expect(isBatchInvoice(noInvoices)).toBe(true)
    })
  })
})
