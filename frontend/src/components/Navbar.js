/**
 * Componente Navbar - Barra de navegación compartida
 */

import { t, getLang } from '../utils/i18n.js'

/**
 * Crea el navbar sticky
 * @param {Object} options
 * @param {boolean} options.showBackButton - Muestra botón de volver al inicio
 */
export function createNavbar({ showBackButton = false } = {}) {
  const currentLang = getLang()

  return `
    <nav class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-2">
          ${showBackButton ? `
            <button
              id="btn-back"
              aria-label="${t('nav.home')}"
              title="${t('nav.home')}"
              class="p-1.5 -ml-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
          ` : ''}
          <a href="/" class="text-xl font-bold text-gray-800 dark:text-gray-100">${t('app.title')}</a>
        </div>
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-4 text-sm">
            <a href="/faq.html" class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">${t('nav.faq')}</a>
            <a href="/guia-facturae.html" class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">${t('nav.guide')}</a>
            <a href="/about.html" class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">${t('nav.about')}</a>
          </div>
          <button
            id="btn-lang"
            aria-label="${t('app.changeLang')}"
            title="${t('app.changeLang')}"
            class="px-2 py-1 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            ${currentLang === 'es' ? 'ES' : 'EN'}
          </button>
          <button
            id="btn-theme"
            aria-label="${t('app.changeTheme')}"
            title="${t('app.changeTheme')}"
            class="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg class="w-5 h-5 icon-sun hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg class="w-5 h-5 icon-moon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  `
}
