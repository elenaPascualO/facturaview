/**
 * Componente Dropzone - Landing page con area de subida de archivos
 */

import { createHistorySection } from './HistorySection.js'
import { t, getLang } from '../utils/i18n.js'

/**
 * Crea el navbar sticky
 */
function createNavbar(currentLang) {
  return `
    <nav class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="/" class="text-xl font-bold text-gray-800 dark:text-gray-100">${t('app.title')}</a>
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

/**
 * Crea la seccion hero con value proposition + dropzone
 */
function createHeroSection() {
  return `
    <section class="bg-white dark:bg-slate-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div class="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <!-- Value proposition -->
          <div class="text-center md:text-left">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-4">
              ${t('hero.title')}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
              ${t('hero.subtitle')}
            </p>
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                ${t('hero.badgePrivacy')}
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                ${t('hero.badgeFree')}
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                ${t('hero.badgeNoInstall')}
              </span>
            </div>
          </div>

          <!-- Dropzone -->
          <div>
            <div
              id="dropzone"
              role="button"
              tabindex="0"
              aria-label="${t('dropzone.dragHere')}"
              class="relative w-full border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-10 sm:p-12 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          </div>
        </div>
      </div>
    </section>
  `
}

/**
 * Crea la seccion "Como funciona" con 3 pasos
 */
function createHowItWorksSection() {
  const steps = [
    {
      titleKey: 'howItWorks.step1.title',
      descKey: 'howItWorks.step1.description',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>',
      num: '1'
    },
    {
      titleKey: 'howItWorks.step2.title',
      descKey: 'howItWorks.step2.description',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
      num: '2'
    },
    {
      titleKey: 'howItWorks.step3.title',
      descKey: 'howItWorks.step3.description',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
      num: '3'
    }
  ]

  return `
    <section class="bg-gray-50 dark:bg-slate-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">${t('howItWorks.title')}</h2>
          <p class="text-gray-600 dark:text-gray-300">${t('howItWorks.subtitle')}</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          ${steps.map(step => `
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  ${step.icon}
                </svg>
              </div>
              <div class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-bold mb-3">${step.num}</div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">${t(step.titleKey)}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">${t(step.descKey)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `
}

/**
 * Crea la seccion de caracteristicas (grid 3x2)
 */
function createFeaturesSection() {
  const features = [
    {
      titleKey: 'feature.versions.title',
      descKey: 'feature.versions.description',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
      color: 'blue'
    },
    {
      titleKey: 'feature.exportPdf.title',
      descKey: 'feature.exportPdf.description',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>',
      color: 'red'
    },
    {
      titleKey: 'feature.signatures.title',
      descKey: 'feature.signatures.description',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>',
      color: 'green'
    },
    {
      titleKey: 'feature.face.title',
      descKey: 'feature.face.description',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>',
      color: 'amber'
    },
    {
      titleKey: 'feature.exportExcel.title',
      descKey: 'feature.exportExcel.description',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>',
      color: 'emerald'
    },
    {
      titleKey: 'feature.privacy.title',
      descKey: 'feature.privacy.description',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>',
      color: 'violet'
    }
  ]

  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
  }

  return `
    <section class="bg-white dark:bg-slate-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">${t('featureSection.title')}</h2>
          <p class="text-gray-600 dark:text-gray-300">${t('featureSection.subtitle')}</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${features.map(f => `
            <div class="p-6 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div class="w-10 h-10 rounded-lg ${colorMap[f.color]} flex items-center justify-center mb-4">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  ${f.icon}
                </svg>
              </div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">${t(f.titleKey)}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">${t(f.descKey)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `
}

/**
 * Crea la seccion del footer con 3 columnas
 */
function createFooterSection() {
  return `
    <footer class="bg-gray-900 dark:bg-slate-950 text-gray-300">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <!-- Columna 1: Marca -->
          <div>
            <h3 class="text-lg font-bold text-white mb-3">${t('app.title')}</h3>
            <p class="text-sm text-gray-400 mb-4">${t('footer.description')}</p>
            <p class="text-sm flex items-center gap-2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              ${t('footer.privacy')}
            </p>
            <button
              id="btn-install"
              class="hidden mt-3 text-sm text-blue-400 hover:text-blue-300 hover:underline"
            >
              ${t('footer.install')}
            </button>
          </div>

          <!-- Columna 2: Recursos -->
          <div>
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">${t('footer.linksTitle')}</h3>
            <nav class="flex flex-col gap-2 text-sm">
              <a href="/faq.html" class="text-gray-400 hover:text-white transition-colors">${t('nav.faq')}</a>
              <a href="/guia-facturae.html" class="text-gray-400 hover:text-white transition-colors">${t('nav.guide')}</a>
              <a href="/about.html" class="text-gray-400 hover:text-white transition-colors">${t('nav.about')}</a>
            </nav>
          </div>

          <!-- Columna 3: Contacto -->
          <div>
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">${t('footer.contactTitle')}</h3>
            <button
              id="toggle-contact"
              class="text-sm text-blue-400 hover:text-blue-300 hover:underline"
            >
              ${t('footer.contact')}
            </button>
            <div id="contact-form-container" class="hidden mt-4">
              <form
                id="contact-form"
                action="https://formspree.io/f/xpqqjpkw"
                method="POST"
                class="text-left space-y-3 p-4 bg-gray-800 dark:bg-slate-900 rounded-lg border border-gray-700 dark:border-slate-700"
              >
                <div>
                  <label for="contact-email" class="block text-xs text-gray-300 mb-1">
                    ${t('contact.email')} <span class="text-gray-500">${t('contact.emailOptional')}</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    placeholder="${t('contact.emailPlaceholder')}"
                    class="w-full px-3 py-2 border border-gray-600 rounded text-sm bg-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="contact-message" class="block text-xs text-gray-300 mb-1">
                    ${t('contact.message')} <span class="text-red-400">${t('contact.required')}</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows="3"
                    placeholder="${t('contact.messagePlaceholder')}"
                    class="w-full px-3 py-2 border border-gray-600 rounded text-sm bg-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="pt-8 border-t border-gray-800 dark:border-slate-800">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>
              ${t('features.signatureDisclaimer')}
              <a href="https://valide.redsara.es/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">VALIDe</a>
              ${t('features.signatureDisclaimerLink')}
            </p>
            <p>${t('footer.copyright')}</p>
          </div>
          <!-- Mobile nav links -->
          <nav class="sm:hidden mt-4 flex justify-center gap-4 text-sm">
            <a href="/faq.html" class="text-gray-400 hover:text-white transition-colors">${t('nav.faq')}</a>
            <a href="/guia-facturae.html" class="text-gray-400 hover:text-white transition-colors">${t('nav.guide')}</a>
            <a href="/about.html" class="text-gray-400 hover:text-white transition-colors">${t('nav.about')}</a>
          </nav>
        </div>
      </div>
    </footer>
  `
}

export function createDropzone(historyInvoices = []) {
  const currentLang = getLang()

  return `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      ${createNavbar(currentLang)}
      <main class="flex-1">
        ${createHeroSection()}
        ${createHowItWorksSection()}
        ${createFeaturesSection()}
        ${historyInvoices.length > 0 ? `
          <section class="bg-gray-50 dark:bg-slate-800">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
              ${createHistorySection(historyInvoices)}
            </div>
          </section>
        ` : ''}
      </main>
      ${createFooterSection()}
    </div>
  `
}
