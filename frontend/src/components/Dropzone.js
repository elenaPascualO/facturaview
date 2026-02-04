/**
 * Componente Dropzone - Área de subida de archivos
 */

import { createHistorySection } from './HistorySection.js'

export function createDropzone(historyInvoices = []) {
  return `
    <div class="relative min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <!-- Botón de tema -->
      <button
        id="btn-theme"
        aria-label="Cambiar tema"
        title="Cambiar tema"
        class="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <svg class="w-5 h-5 icon-sun hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <svg class="w-5 h-5 icon-moon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      </button>

      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">FacturaView</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Visualiza y verifica tus facturas electrónicas Facturae</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Sin instalar nada. 100% privado.</p>
      </header>

      <div
        id="dropzone"
        role="button"
        tabindex="0"
        aria-label="Área de subida de archivos: arrastra tu factura XML aquí o haz clic para seleccionar"
        class="relative w-full max-w-xl border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-12 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <!-- Loading overlay -->
        <div id="loading-overlay" class="hidden absolute inset-0 bg-white/80 dark:bg-slate-900/80 rounded-xl flex items-center justify-center z-10">
          <div class="flex flex-col items-center gap-3">
            <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-gray-600 dark:text-gray-300">Procesando factura...</p>
          </div>
        </div>

        <div class="text-5xl mb-4">📎</div>
        <p class="text-lg text-gray-700 dark:text-gray-200 mb-2">Arrastra tu archivo XML aquí</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">o haz clic para seleccionar</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">Formatos: Facturae 3.2, 3.2.1, 3.2.2</p>
        <input
          type="file"
          id="file-input"
          accept=".xml,.xsig"
          class="hidden"
        />
      </div>

      <!-- Features info -->
      <div class="mt-6 max-w-xl text-center">
        <div class="flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1">
            <span>📄</span> PDF y Excel
          </span>
          <span class="flex items-center gap-1">
            <span>🔐</span> Verifica firmas XAdES
          </span>
          <span class="flex items-center gap-1">
            <span>✓</span> FACe compatible
          </span>
        </div>
        <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
          La verificacion de firma es tecnica, no oficial.
          <a href="https://valide.redsara.es/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">VALIDe</a>
          ofrece validacion con efectos legales.
        </p>
      </div>

      <footer class="mt-6 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
          🔒 Tu archivo no sale de tu navegador
        </p>
        <button
          id="btn-install"
          class="hidden block mx-auto mt-3 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
        >
          📲 Instalar app
        </button>
        <button
          id="toggle-contact"
          class="block mx-auto mt-4 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
        >
          💬 Contacto / Sugerencias
        </button>

        <!-- Navigation links -->
        <nav class="mt-4 flex justify-center gap-4 text-sm">
          <a href="/faq.html" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">FAQ</a>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          <a href="/guia-facturae.html" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Guia Facturae</a>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          <a href="/about.html" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">Sobre nosotros</a>
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
                Email <span class="text-gray-400 dark:text-gray-500">(opcional)</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                placeholder="tu@email.com"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="contact-message" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                Mensaje <span class="text-red-400">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows="3"
                placeholder="Escribe tu mensaje..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
            <input type="hidden" name="_subject" value="Mensaje de FacturaView" />
            <div class="flex items-center gap-3">
              <button
                type="submit"
                class="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                Enviar
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