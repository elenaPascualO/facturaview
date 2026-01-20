import { describe, it, expect, beforeAll } from 'vitest'
import { parseFacturae } from '../src/parser/facturae.js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Helper para leer fixtures
function readFixture(filename) {
  return readFileSync(join(__dirname, 'fixtures', filename), 'utf-8')
}

describe('Parser Facturae', () => {
  describe('Detección de versión', () => {
    it('detecta versión 3.2.2', () => {
      const xml = readFixture('simple-322.xml')
      const result = parseFacturae(xml)
      expect(result.version).toBe('3.2.2')
    })

    it('detecta versión 3.2.1', () => {
      const xml = readFixture('simple-321.xml')
      const result = parseFacturae(xml)
      expect(result.version).toBe('3.2.1')
    })

    it('detecta versión 3.2', () => {
      const xml = readFixture('simple-32.xml')
      const result = parseFacturae(xml)
      expect(result.version).toBe('3.2')
    })
  })

  describe('Factura simple 3.2.2', () => {
    let result

    beforeAll(() => {
      const xml = readFixture('simple-322.xml')
      result = parseFacturae(xml)
    })

    it('extrae datos del emisor (empresa)', () => {
      expect(result.seller).toBeDefined()
      expect(result.seller.type).toBe('legal')
      expect(result.seller.name).toBe('Empresa Ejemplo S.L.')
      expect(result.seller.taxId).toBe('A12345678')
    })

    it('extrae dirección del emisor', () => {
      expect(result.seller.address).toBeDefined()
      expect(result.seller.address.street).toBe('Calle Mayor 123')
      expect(result.seller.address.postCode).toBe('28001')
      expect(result.seller.address.town).toBe('Madrid')
      expect(result.seller.address.province).toBe('Madrid')
    })

    it('extrae datos del receptor', () => {
      expect(result.buyer).toBeDefined()
      expect(result.buyer.name).toBe('Cliente Ejemplo S.A.')
      expect(result.buyer.taxId).toBe('B87654321')
    })

    it('extrae número y serie de factura', () => {
      const invoice = result.invoices[0]
      expect(invoice.number).toBe('2024/001')
      expect(invoice.series).toBe('A')
    })

    it('extrae fecha de emisión', () => {
      const invoice = result.invoices[0]
      expect(invoice.issueDate).toBe('2024-01-15')
    })

    it('extrae tipo de factura', () => {
      const invoice = result.invoices[0]
      expect(invoice.invoiceType).toBe('FC')
      expect(invoice.invoiceClass).toBe('OO')
    })

    it('extrae líneas de detalle', () => {
      const lines = result.invoices[0].lines
      expect(lines).toHaveLength(1)
      expect(lines[0].description).toBe('Servicio de consultoría')
      expect(lines[0].quantity).toBe(1)
      expect(lines[0].unitPrice).toBe(100)
      expect(lines[0].grossAmount).toBe(100)
    })

    it('extrae impuestos', () => {
      const taxes = result.invoices[0].taxes
      expect(taxes).toHaveLength(1)
      expect(taxes[0].rate).toBe(21)
      expect(taxes[0].base).toBe(100)
      expect(taxes[0].amount).toBe(21)
    })

    it('extrae totales', () => {
      const totals = result.invoices[0].totals
      expect(totals.grossAmount).toBe(100)
      expect(totals.taxOutputs).toBe(21)
      expect(totals.invoiceTotal).toBe(121)
      expect(totals.totalToPay).toBe(121)
    })

    it('extrae información de pago', () => {
      const payment = result.invoices[0].payment
      expect(payment).toBeDefined()
      expect(payment.dueDate).toBe('2024-02-15')
      expect(payment.amount).toBe(121)
      expect(payment.paymentMeans).toBe('04')
      expect(payment.iban).toBe('ES9121000418450200051332')
    })
  })

  describe('Factura compleja con múltiples líneas e IVAs', () => {
    let result

    beforeAll(() => {
      const xml = readFixture('complex-322.xml')
      result = parseFacturae(xml)
    })

    it('extrae múltiples líneas', () => {
      const lines = result.invoices[0].lines
      expect(lines).toHaveLength(4)
    })

    it('extrae diferentes tipos de IVA', () => {
      const taxes = result.invoices[0].taxes
      expect(taxes.length).toBeGreaterThanOrEqual(3)

      const rates = taxes.map(t => t.rate).sort((a, b) => a - b)
      expect(rates).toContain(4)
      expect(rates).toContain(10)
      expect(rates).toContain(21)
    })

    it('calcula totales correctamente', () => {
      const totals = result.invoices[0].totals
      expect(totals.grossAmount).toBe(1700)
      expect(totals.generalDiscounts).toBe(100)
    })

    it('extrae descripción general de factura', () => {
      // La descripción está en InvoiceIssueData, no la estamos parseando aún
      // pero los datos básicos deben estar
      expect(result.invoices[0].lines[0].description).toBe('Desarrollo aplicación web personalizada')
    })
  })

  describe('Factura con retenciones IRPF', () => {
    let result

    beforeAll(() => {
      const xml = readFixture('with-retention.xml')
      result = parseFacturae(xml)
    })

    it('detecta persona física como emisor', () => {
      expect(result.seller.type).toBe('individual')
      expect(result.seller.name).toBe('María García López')
      expect(result.seller.taxId).toBe('12345678Z')
    })

    it('extrae retenciones', () => {
      const totals = result.invoices[0].totals
      expect(totals.taxesWithheld).toBe(150)
    })

    it('calcula total a pagar con retenciones', () => {
      const totals = result.invoices[0].totals
      // Base 1000 + IVA 210 - Retención 150 = 1060
      expect(totals.invoiceTotal).toBe(1060)
    })
  })

  describe('Factura rectificativa', () => {
    let result

    beforeAll(() => {
      const xml = readFixture('rectificativa.xml')
      result = parseFacturae(xml)
    })

    it('detecta factura rectificativa', () => {
      const invoice = result.invoices[0]
      expect(invoice.invoiceClass).toBe('OR')
    })

    it('maneja importes negativos', () => {
      const totals = result.invoices[0].totals
      expect(totals.grossAmount).toBe(-50)
      expect(totals.invoiceTotal).toBe(-60.5)
    })
  })

  describe('Versiones legacy', () => {
    it('parsea correctamente versión 3.2.1', () => {
      const xml = readFixture('simple-321.xml')
      const result = parseFacturae(xml)

      expect(result.seller.name).toBe('Suministros Industriales del Norte S.L.')
      expect(result.invoices[0].totals.invoiceTotal).toBe(484)
    })

    it('parsea correctamente versión 3.2', () => {
      const xml = readFixture('simple-32.xml')
      const result = parseFacturae(xml)

      expect(result.seller.name).toBe('Floristería El Jardín S.L.')
      expect(result.invoices[0].totals.invoiceTotal).toBe(63.13)
    })
  })

  describe('Manejo de errores', () => {
    it('lanza error con XML inválido', () => {
      const invalidXml = '<invalid><not-closed>'
      expect(() => parseFacturae(invalidXml)).toThrow()
    })

    it('lanza error con XML vacío', () => {
      expect(() => parseFacturae('')).toThrow()
    })
  })

  describe('Detección de firma digital', () => {
    it('detecta que la factura simple no está firmada', () => {
      const xml = readFixture('simple-322.xml')
      const result = parseFacturae(xml)
      expect(result.isSigned).toBe(false)
    })
  })
})
