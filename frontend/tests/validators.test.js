/**
 * Tests de validación de archivos
 */

import { describe, it, expect } from 'vitest'
import {
  validateFileExtension,
  validateFileSize,
  validateFile,
  MAX_FILE_SIZE,
  ALLOWED_EXTENSIONS
} from '../src/utils/validators.js'

describe('validateFileExtension', () => {
  it('acepta archivos .xml', () => {
    expect(validateFileExtension('factura.xml')).toEqual({ valid: true })
    expect(validateFileExtension('FACTURA.XML')).toEqual({ valid: true })
    expect(validateFileExtension('test.Xml')).toEqual({ valid: true })
  })

  it('acepta archivos .xsig', () => {
    expect(validateFileExtension('factura.xsig')).toEqual({ valid: true })
    expect(validateFileExtension('FACTURA.XSIG')).toEqual({ valid: true })
    expect(validateFileExtension('test.XsIg')).toEqual({ valid: true })
  })

  it('rechaza archivos con extensiones no permitidas', () => {
    const result = validateFileExtension('factura.pdf')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Formato no soportado')
  })

  it('rechaza archivos .txt', () => {
    const result = validateFileExtension('factura.txt')
    expect(result.valid).toBe(false)
  })

  it('rechaza archivos .html', () => {
    const result = validateFileExtension('factura.html')
    expect(result.valid).toBe(false)
  })

  it('rechaza archivos .exe', () => {
    const result = validateFileExtension('malware.exe')
    expect(result.valid).toBe(false)
  })

  it('rechaza archivos sin extensión', () => {
    const result = validateFileExtension('factura')
    expect(result.valid).toBe(false)
  })

  it('rechaza archivos con extensión parcial', () => {
    expect(validateFileExtension('archivo.xm').valid).toBe(false)
    expect(validateFileExtension('archivo.xmlx').valid).toBe(false)
    expect(validateFileExtension('archivo.xsi').valid).toBe(false)
  })

  it('maneja nombres vacíos', () => {
    const result = validateFileExtension('')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('inválido')
  })

  it('maneja null y undefined', () => {
    expect(validateFileExtension(null).valid).toBe(false)
    expect(validateFileExtension(undefined).valid).toBe(false)
  })

  it('rechaza archivos con doble extensión peligrosa', () => {
    // Aunque terminen en .xml, es importante que funcione correctamente
    expect(validateFileExtension('virus.exe.xml')).toEqual({ valid: true })
    // Si no termina en extensión válida, rechazar
    expect(validateFileExtension('factura.xml.exe').valid).toBe(false)
  })
})

describe('validateFileSize', () => {
  it('acepta archivos pequeños', () => {
    expect(validateFileSize(1024)).toEqual({ valid: true }) // 1 KB
    expect(validateFileSize(1024 * 1024)).toEqual({ valid: true }) // 1 MB
    expect(validateFileSize(5 * 1024 * 1024)).toEqual({ valid: true }) // 5 MB
  })

  it('acepta archivos en el límite exacto', () => {
    expect(validateFileSize(MAX_FILE_SIZE)).toEqual({ valid: true }) // 10 MB exactos
  })

  it('acepta archivos vacíos (0 bytes)', () => {
    expect(validateFileSize(0)).toEqual({ valid: true })
  })

  it('rechaza archivos que exceden el límite', () => {
    const result = validateFileSize(MAX_FILE_SIZE + 1)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('demasiado grande')
    expect(result.error).toContain('10 MB')
  })

  it('rechaza archivos muy grandes', () => {
    const result = validateFileSize(100 * 1024 * 1024) // 100 MB
    expect(result.valid).toBe(false)
  })

  it('rechaza tamaños negativos', () => {
    const result = validateFileSize(-1)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('inválido')
  })

  it('rechaza valores no numéricos', () => {
    expect(validateFileSize('1024').valid).toBe(false)
    expect(validateFileSize(null).valid).toBe(false)
    expect(validateFileSize(undefined).valid).toBe(false)
  })

  it('el límite máximo es 10 MB', () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024)
  })
})

describe('validateFile', () => {
  it('acepta archivo XML válido con tamaño correcto', () => {
    const file = { name: 'factura.xml', size: 1024 }
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('acepta archivo XSIG válido', () => {
    const file = { name: 'factura.xsig', size: 2048 }
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('rechaza archivo con extensión inválida', () => {
    const file = { name: 'factura.pdf', size: 1024 }
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Formato no soportado')
  })

  it('rechaza archivo demasiado grande', () => {
    const file = { name: 'factura.xml', size: 15 * 1024 * 1024 }
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('demasiado grande')
  })

  it('rechaza si no se proporciona archivo', () => {
    expect(validateFile(null).valid).toBe(false)
    expect(validateFile(undefined).valid).toBe(false)
  })

  it('valida extensión antes que tamaño', () => {
    // Archivo con ambos problemas: extensión inválida y muy grande
    const file = { name: 'factura.pdf', size: 15 * 1024 * 1024 }
    const result = validateFile(file)
    // Debe mostrar error de extensión primero
    expect(result.error).toContain('Formato no soportado')
  })
})

describe('Constantes exportadas', () => {
  it('MAX_FILE_SIZE es 10 MB', () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024)
  })

  it('ALLOWED_EXTENSIONS incluye .xml y .xsig', () => {
    expect(ALLOWED_EXTENSIONS).toContain('.xml')
    expect(ALLOWED_EXTENSIONS).toContain('.xsig')
    expect(ALLOWED_EXTENSIONS.length).toBe(2)
  })
})
