import { describe, it, expect, beforeEach } from 'vitest'
import {
  ErrorCodes,
  FacturaeError,
  getFriendlyErrorMessage,
  detectErrorCode
} from '../src/utils/errors.js'
import { setLang } from '../src/utils/i18n.js'

// Set language to Spanish for all tests
beforeEach(() => {
  setLang('es')
})

describe('FacturaeError', () => {
  it('should create error with code and friendly message', () => {
    const error = new FacturaeError(ErrorCodes.NO_INVOICES)

    expect(error.code).toBe(ErrorCodes.NO_INVOICES)
    expect(error.message).toContain('no contiene ninguna factura')
    expect(error.friendlyMessage).toContain('no contiene ninguna factura')
  })

  it('should store technical message', () => {
    const error = new FacturaeError(ErrorCodes.XML_MALFORMED, 'Line 42: unexpected token')

    expect(error.technicalMessage).toBe('Line 42: unexpected token')
  })

  it('should be instanceof Error', () => {
    const error = new FacturaeError(ErrorCodes.UNKNOWN)

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('FacturaeError')
  })
})

describe('getFriendlyErrorMessage', () => {
  it('should return friendly message for FacturaeError', () => {
    const error = new FacturaeError(ErrorCodes.NOT_FACTURAE)
    const message = getFriendlyErrorMessage(error)

    expect(message).toContain('factura electrónica Facturae')
  })

  it('should detect XML_MALFORMED from error message', () => {
    const error = new Error('parsererror: unexpected token at line 5')
    const message = getFriendlyErrorMessage(error)

    expect(message).toContain('XML válido')
  })

  it('should detect NO_INVOICES from "undefined is not an object (evaluating invoice.series)"', () => {
    const error = new Error("undefined is not an object (evaluating 'invoice.series')")
    const message = getFriendlyErrorMessage(error)

    expect(message).toContain('no contiene ninguna factura')
  })

  it('should detect NO_INVOICES from "Cannot read property of undefined (reading invoice)"', () => {
    const error = new Error("Cannot read properties of undefined (reading 'invoice')")
    const message = getFriendlyErrorMessage(error)

    expect(message).toContain('no contiene ninguna factura')
  })

  it('should detect NO_INVOICES from "invoices[0] is undefined"', () => {
    const error = new Error("invoices[0] is undefined")
    const message = getFriendlyErrorMessage(error)

    expect(message).toContain('no contiene ninguna factura')
  })

  it('should return generic message for unknown error', () => {
    const error = new Error('Something completely random happened')
    const message = getFriendlyErrorMessage(error)

    expect(message).toContain('error inesperado')
  })

  it('should handle string errors', () => {
    const message = getFriendlyErrorMessage('XML inválido: parse error')

    expect(message).toContain('XML válido')
  })

  it('should detect UNSUPPORTED_VERSION', () => {
    const error = new Error('Unsupported SchemaVersion 2.0')
    const message = getFriendlyErrorMessage(error)

    expect(message).toContain('versión')
  })
})

describe('detectErrorCode', () => {
  it('should return code from FacturaeError', () => {
    const error = new FacturaeError(ErrorCodes.MISSING_SELLER)
    const code = detectErrorCode(error)

    expect(code).toBe(ErrorCodes.MISSING_SELLER)
  })

  it('should detect XML_MALFORMED code', () => {
    const error = new Error('parsererror')
    const code = detectErrorCode(error)

    expect(code).toBe(ErrorCodes.XML_MALFORMED)
  })

  it('should detect NO_INVOICES code', () => {
    const error = new Error("undefined is not an object (evaluating 'invoice.series')")
    const code = detectErrorCode(error)

    expect(code).toBe(ErrorCodes.NO_INVOICES)
  })

  it('should return UNKNOWN for unrecognized errors', () => {
    const error = new Error('Random error')
    const code = detectErrorCode(error)

    expect(code).toBe(ErrorCodes.UNKNOWN)
  })
})

describe('Error messages are user-friendly', () => {
  const allCodes = Object.values(ErrorCodes)

  allCodes.forEach(code => {
    it(`should have friendly message for ${code}`, () => {
      const error = new FacturaeError(code)

      // Should not contain technical terms
      expect(error.friendlyMessage).not.toMatch(/undefined|null|TypeError|ReferenceError/)
      // Should be in Spanish
      expect(error.friendlyMessage).toMatch(/[áéíóúñ]|factura|archivo|versión/i)
    })
  })
})
