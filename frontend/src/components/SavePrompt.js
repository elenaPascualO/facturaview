/**
 * Componente SavePrompt - Modal para preguntar si guardar factura
 */

import { t } from '../utils/i18n.js'

/**
 * Crea el modal de guardar factura
 * @returns {string} HTML del modal
 */
export function createSavePrompt() {
  return `
    <div id="save-prompt-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="save-prompt-title">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-sm w-full p-6">
        <h3 id="save-prompt-title" class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          ${t('savePrompt.title')}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          ${t('savePrompt.message')}
        </p>

        <!-- Checkbox recordar -->
        <label class="flex items-center gap-2 mb-5 cursor-pointer">
          <input
            type="checkbox"
            id="save-prompt-remember"
            class="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 dark:bg-slate-700"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">${t('savePrompt.remember')}</span>
        </label>

        <!-- Botones -->
        <div class="flex justify-end gap-3 mb-4">
          <button
            id="btn-save-no"
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ${t('savePrompt.no')}
          </button>
          <button
            id="btn-save-yes"
            class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            ${t('savePrompt.yes')}
          </button>
        </div>

        <!-- Nota de privacidad -->
        <p class="text-xs text-gray-400 dark:text-gray-500 flex items-start gap-1 pt-3 border-t border-gray-100 dark:border-slate-700">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span>${t('savePrompt.privacyNote')}</span>
        </p>
      </div>
    </div>
  `
}

/**
 * Muestra el modal de guardar factura y retorna una promesa con la elección
 * @param {HTMLElement} container - Elemento donde insertar el modal
 * @returns {Promise<{save: boolean, remember: boolean}>}
 */
export function showSavePrompt(container) {
  return new Promise((resolve) => {
    // Insertar modal
    const modalHtml = createSavePrompt()
    const modalWrapper = document.createElement('div')
    modalWrapper.innerHTML = modalHtml
    container.appendChild(modalWrapper.firstElementChild)

    const modal = document.getElementById('save-prompt-modal')
    const btnYes = document.getElementById('btn-save-yes')
    const btnNo = document.getElementById('btn-save-no')
    const checkbox = document.getElementById('save-prompt-remember')

    function cleanup() {
      modal?.remove()
    }

    function handleYes() {
      const remember = checkbox?.checked || false
      cleanup()
      resolve({ save: true, remember })
    }

    function handleNo() {
      const remember = checkbox?.checked || false
      cleanup()
      resolve({ save: false, remember })
    }

    // Cerrar con Escape
    function handleKeydown(e) {
      if (e.key === 'Escape') {
        cleanup()
        document.removeEventListener('keydown', handleKeydown)
        resolve({ save: false, remember: false })
      }
    }

    // Cerrar al hacer click fuera
    function handleBackdropClick(e) {
      if (e.target === modal) {
        cleanup()
        resolve({ save: false, remember: false })
      }
    }

    btnYes?.addEventListener('click', handleYes)
    btnNo?.addEventListener('click', handleNo)
    modal?.addEventListener('click', handleBackdropClick)
    document.addEventListener('keydown', handleKeydown)

    // Focus en botón principal
    btnYes?.focus()
  })
}
