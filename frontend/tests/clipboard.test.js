import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { copyToClipboard } from '../src/utils/clipboard.js'

describe('copyToClipboard', () => {
  let originalClipboard

  beforeEach(() => {
    originalClipboard = navigator.clipboard
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true
    })
  })

  it('should return false for empty text', async () => {
    const result = await copyToClipboard('')
    expect(result).toBe(false)
  })

  it('should return false for null', async () => {
    const result = await copyToClipboard(null)
    expect(result).toBe(false)
  })

  it('should return false for undefined', async () => {
    const result = await copyToClipboard(undefined)
    expect(result).toBe(false)
  })

  it('should use modern clipboard API when available', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true
    })

    const result = await copyToClipboard('test text')

    expect(writeTextMock).toHaveBeenCalledWith('test text')
    expect(result).toBe(true)
  })

  it('should fallback to execCommand when clipboard API fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('Failed')) },
      writable: true,
      configurable: true
    })

    // Mock execCommand
    const execCommandMock = vi.fn().mockReturnValue(true)
    document.execCommand = execCommandMock

    const result = await copyToClipboard('test text')

    expect(execCommandMock).toHaveBeenCalledWith('copy')
    expect(result).toBe(true)
  })

  it('should fallback to execCommand when clipboard API not available', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true
    })

    const execCommandMock = vi.fn().mockReturnValue(true)
    document.execCommand = execCommandMock

    const result = await copyToClipboard('test text')

    expect(execCommandMock).toHaveBeenCalledWith('copy')
    expect(result).toBe(true)
  })

  it('should return false when both methods fail', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true
    })

    document.execCommand = vi.fn().mockImplementation(() => {
      throw new Error('Not supported')
    })

    const result = await copyToClipboard('test text')
    expect(result).toBe(false)
  })
})