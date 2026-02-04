/**
 * Utilidad de internacionalización (i18n) para FacturaView
 */

import { translations } from '../i18n/translations.js'

const STORAGE_KEY = 'facturaview-lang'
const SUPPORTED_LANGS = ['es', 'en']
const DEFAULT_LANG = 'es'

// Idioma actual en memoria (para evitar lecturas repetidas de localStorage)
let currentLang = null

/**
 * Detecta el idioma preferido del navegador
 * @returns {'es' | 'en'} - Idioma detectado o 'es' por defecto
 */
function detectBrowserLang() {
  try {
    const browserLang = navigator.language || navigator.userLanguage || ''
    const langCode = browserLang.split('-')[0].toLowerCase()

    if (SUPPORTED_LANGS.includes(langCode)) {
      return langCode
    }
  } catch (e) {
    // En caso de error, usar idioma por defecto
  }
  return DEFAULT_LANG
}

/**
 * Obtener idioma actual
 * @returns {'es' | 'en'} - Idioma actual
 */
export function getLang() {
  // Si ya tenemos el idioma en memoria, usarlo
  if (currentLang) {
    return currentLang
  }

  // Primero verificar localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      currentLang = stored
      return stored
    }
  } catch (e) {
    // localStorage no disponible
  }

  // Si no hay preferencia guardada, detectar del navegador
  currentLang = detectBrowserLang()
  return currentLang
}

/**
 * Establecer idioma
 * @param {'es' | 'en'} lang - Idioma a establecer
 */
export function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return

  currentLang = lang

  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch (e) {
    // localStorage no disponible
  }

  // Actualizar atributo lang del documento
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang
  }

  // Disparar evento para que los componentes puedan reaccionar
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }))
  }
}

/**
 * Alternar entre idiomas ES/EN
 * @returns {'es' | 'en'} - Nuevo idioma
 */
export function toggleLang() {
  const current = getLang()
  const newLang = current === 'es' ? 'en' : 'es'
  setLang(newLang)
  return newLang
}

/**
 * Inicializar idioma al cargar la página
 * Debe llamarse antes de renderizar la app
 */
export function initLang() {
  const lang = getLang()

  // Actualizar atributo lang del documento
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang
  }

  return lang
}

/**
 * Obtener traducción para una clave
 * @param {string} key - Clave de traducción (ej: 'app.title')
 * @param {Object} params - Parámetros para interpolación (opcional)
 * @returns {string} - Texto traducido
 *
 * @example
 * t('app.title') // "FacturaView"
 * t('totals.vatRate', { rate: 21 }) // "IVA 21%"
 */
export function t(key, params = {}) {
  const lang = getLang()
  const dict = translations[lang] || translations[DEFAULT_LANG]

  let text = dict[key]

  // Si no existe la traducción, intentar con el idioma por defecto
  if (text === undefined && lang !== DEFAULT_LANG) {
    text = translations[DEFAULT_LANG][key]
  }

  // Si todavía no existe, devolver la clave
  if (text === undefined) {
    console.warn(`[i18n] Missing translation: ${key}`)
    return key
  }

  // Interpolación de parámetros: reemplaza {param} con el valor
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(param => {
      const regex = new RegExp(`\\{${param}\\}`, 'g')
      text = text.replace(regex, String(params[param]))
    })
  }

  return text
}

/**
 * Obtener todos los idiomas soportados
 * @returns {string[]} - Lista de códigos de idioma
 */
export function getSupportedLangs() {
  return [...SUPPORTED_LANGS]
}

/**
 * Verificar si un idioma está soportado
 * @param {string} lang - Código de idioma
 * @returns {boolean}
 */
export function isLangSupported(lang) {
  return SUPPORTED_LANGS.includes(lang)
}
