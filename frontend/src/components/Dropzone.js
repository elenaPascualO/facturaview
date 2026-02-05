/**
 * Componente Dropzone - Área de subida de archivos
 */

import { createHistorySection } from './HistorySection.js'
import { t, getLang } from '../utils/i18n.js'

export function createDropzone(historyInvoices = []) {
  const currentLang = getLang()

  return `
    <div class="relative min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <!-- Botones de tema e idioma -->
      <div class="absolute top-4 right-4 flex items-center gap-2">
        <!-- Botón de idioma -->
        <button
          id="btn-lang"
          aria-label="${t('app.changeLang')}"
          title="${t('app.changeLang')}"
          class="px-2 py-1 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          ${currentLang === 'es' ? 'ES' : 'EN'}
        </button>
        <!-- Botón de tema -->
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

      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">${t('app.title')}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">${t('app.subtitle')}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">${t('app.tagline')}</p>
      </header>

      <div
        id="dropzone"
        role="button"
        tabindex="0"
        aria-label="${t('dropzone.dragHere')}"
        class="relative w-full max-w-xl border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-12 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <!-- Loading overlay -->
        <div id="loading-overlay" class="hidden absolute inset-0 bg-white/80 dark:bg-slate-900/80 rounded-xl flex items-center justify-center z-10">
          <div class="flex flex-col items-center gap-3">
            <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-gray-600 dark:text-gray-300">${t('dropzone.processing')}</p>
          </div>
        </div>

        <div class="text-5xl mb-4">📎</div>
        <p class="text-lg text-gray-700 dark:text-gray-200 mb-2">${t('dropzone.dragHere')}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">${t('dropzone.orClick')}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">${t('dropzone.formats')}</p>
        <input
          type="file"
          id="file-input"
          accept=".xml,.xsig"
          multiple
          class="hidden"
        />
      </div>

      <!-- Features info -->
      <div class="mt-6 max-w-xl text-center">
        <div class="flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1">
            <span>📄</span> ${t('features.pdfExcel')}
          </span>
          <span class="flex items-center gap-1">
            <span>🔐</span> ${t('features.verifySignatures')}
          </span>
          <span class="flex items-center gap-1">
            <span>✓</span> ${t('features.faceCompatible')}
          </span>
        </div>
        <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
          ${t('features.signatureDisclaimer')}
          <a href="https://valide.redsara.es/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">VALIDe</a>
          ${t('features.signatureDisclaimerLink')}
        </p>
      </div>

      <footer class="mt-6 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
          🔒 ${t('footer.privacy')}
        </p>
        <button
          id="btn-install"
          class="hidden block mx-auto mt-3 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
        >
          📲 ${t('footer.install')}
        </button>
        <button
          id="toggle-contact"
          class="block mx-auto mt-4 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
        >
          💬 ${t('footer.contact')}
        </button>

        <!-- Navigation links -->
        <nav class="mt-4 flex justify-center gap-4 text-sm">
          <a href="/faq.html" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">${t('nav.faq')}</a>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          <a href="/guia-facturae.html" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">${t('nav.guide')}</a>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          <a href="/about.html" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">${t('nav.about')}</a>
        </nav>

        <div id="contact-form-container" class="hidden mt-4 max-w-md mx-auto">
          <form
            id="contact-form"
            action="https://formspree.io/f/xpqqjpkw"
            method="POST"
            class="text-left space-y-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm"
          >
            <div>
              <label for="contact-email" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                ${t('contact.email')} <span class="text-gray-400 dark:text-gray-500">${t('contact.emailOptional')}</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                placeholder="${t('contact.emailPlaceholder')}"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="contact-message" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                ${t('contact.message')} <span class="text-red-400">${t('contact.required')}</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows="3"
                placeholder="${t('contact.messagePlaceholder')}"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
            <input type="hidden" name="_subject" value="Mensaje de FacturaView" />
            <div class="flex items-center gap-3">
              <button
                type="submit"
                class="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                ${t('contact.send')}
              </button>
              <span id="contact-status" class="text-xs"></span>
            </div>
          </form>
        </div>
      </footer>

      ${createHistorySection(historyInvoices)}
    </div>
  `
}
