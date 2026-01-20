/**
 * Tests de seguridad para las funciones de sanitización
 */

import { describe, it, expect } from 'vitest'
import { escapeHtml, sanitizeExcelValue, sanitizeFilename } from '../src/utils/sanitizers.js'

describe('escapeHtml', () => {
  it('escapa caracteres HTML peligrosos', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;')
  })

  it('escapa etiquetas img con onerror', () => {
    expect(escapeHtml('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;')
  })

  it('escapa comillas simples y dobles', () => {
    expect(escapeHtml("test'test\"test")).toBe("test&#x27;test&quot;test")
  })

  it('escapa ampersands', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar')
  })

  it('escapa barras', () => {
    expect(escapeHtml('path/to/file')).toBe('path&#x2F;to&#x2F;file')
  })

  it('maneja null y undefined', () => {
    expect(escapeHtml(null)).toBe('')
    expect(escapeHtml(undefined)).toBe('')
  })

  it('convierte números a string', () => {
    expect(escapeHtml(123)).toBe('123')
    expect(escapeHtml(0)).toBe('0')
  })

  it('mantiene texto seguro sin cambios', () => {
    expect(escapeHtml('Texto normal')).toBe('Texto normal')
    expect(escapeHtml('Número 12345')).toBe('Número 12345')
  })
})

describe('sanitizeExcelValue', () => {
  it('prefija fórmulas que empiezan con =', () => {
    expect(sanitizeExcelValue('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)")
    expect(sanitizeExcelValue('=1+1')).toBe("'=1+1")
  })

  it('prefija fórmulas que empiezan con +', () => {
    expect(sanitizeExcelValue('+cmd|calc')).toBe("'+cmd|calc")
  })

  it('prefija fórmulas que empiezan con -', () => {
    expect(sanitizeExcelValue('-100+200')).toBe("'-100+200")
  })

  it('prefija fórmulas que empiezan con @', () => {
    expect(sanitizeExcelValue('@SUM(A1)')).toBe("'@SUM(A1)")
  })

  it('prefija fórmulas que empiezan con tab', () => {
    expect(sanitizeExcelValue('\tcmd')).toBe("'\tcmd")
  })

  it('prefija fórmulas que empiezan con newline', () => {
    expect(sanitizeExcelValue('\rcmd')).toBe("'\rcmd")
    expect(sanitizeExcelValue('\ncmd')).toBe("'\ncmd")
  })

  it('maneja null y undefined', () => {
    expect(sanitizeExcelValue(null)).toBe('')
    expect(sanitizeExcelValue(undefined)).toBe('')
  })

  it('mantiene texto seguro sin cambios', () => {
    expect(sanitizeExcelValue('Texto normal')).toBe('Texto normal')
    expect(sanitizeExcelValue('123.45')).toBe('123.45')
    expect(sanitizeExcelValue('Factura A-001')).toBe('Factura A-001')
  })

  it('no modifica strings vacíos', () => {
    expect(sanitizeExcelValue('')).toBe('')
  })
})

describe('sanitizeFilename', () => {
  it('elimina caracteres no permitidos', () => {
    expect(sanitizeFilename('file<name>')).toBe('filename')
    expect(sanitizeFilename('file:name')).toBe('filename')
    expect(sanitizeFilename('file"name')).toBe('filename')
    expect(sanitizeFilename('file/name')).toBe('filename')
    expect(sanitizeFilename('file\\name')).toBe('filename')
    expect(sanitizeFilename('file|name')).toBe('filename')
    expect(sanitizeFilename('file?name')).toBe('filename')
    expect(sanitizeFilename('file*name')).toBe('filename')
  })

  it('reemplaza espacios con guiones', () => {
    expect(sanitizeFilename('my file name')).toBe('my-file-name')
    expect(sanitizeFilename('multiple   spaces')).toBe('multiple-spaces')
  })

  it('elimina caracteres de control', () => {
    expect(sanitizeFilename('file\x00name')).toBe('filename')
    expect(sanitizeFilename('file\x1fname')).toBe('filename')
  })

  it('limita longitud a 100 caracteres', () => {
    const longName = 'a'.repeat(150)
    expect(sanitizeFilename(longName).length).toBe(100)
  })

  it('devuelve "sin-numero" para valores vacíos', () => {
    expect(sanitizeFilename('')).toBe('sin-numero')
    expect(sanitizeFilename(null)).toBe('sin-numero')
    expect(sanitizeFilename(undefined)).toBe('sin-numero')
  })

  it('previene path traversal', () => {
    expect(sanitizeFilename('../../../etc/passwd')).toBe('......etcpasswd')
    // Two backslashes in source = one backslash removed = 4 dots (2 per ..\)
    expect(sanitizeFilename('..\\..\\windows\\system32')).toBe('....windowssystem32')
  })

  it('mantiene nombres de archivo seguros', () => {
    expect(sanitizeFilename('factura-2024-001')).toBe('factura-2024-001')
    expect(sanitizeFilename('A001')).toBe('A001')
  })

  it('maneja números', () => {
    expect(sanitizeFilename(12345)).toBe('12345')
  })
})
