import './style.css'
import { createDropzone } from './components/Dropzone.js'
import { createInvoiceView } from './components/InvoiceView.js'
import { parseFacturae } from './parser/facturae.js'
import { validateFile } from './utils/validators.js'
import { track, events } from './utils/tracking.js'
import { showToast } from './components/Toast.js'
import { copyToClipboard } from './utils/clipboard.js'
import { getFriendlyErrorMessage } from './utils/errors.js'
import { initTheme, toggleTheme, getTheme } from './utils/theme.js'
import { initLang, toggleLang, getLang, t } from './utils/i18n.js'
import { validateSignature } from './utils/signature.js'
import {
  getHistory,
  getInvoice,
  saveInvoice,
  clearHistory,
  shouldAskToSave,
  shouldAutoSave,
  setSavePreference,
  findExistingInvoice
} from './utils/storage.js'
import { showSavePrompt } from './components/SavePrompt.js'
import { createClearHistoryModal } from './components/HistorySection.js'

const app = document.querySelector('#app')

// Estado de la aplicación
let currentInvoice = null
let currentXmlContent = null
let signatureData = null
let deferredInstallPrompt = null

// Capturar evento de instalación PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredInstallPrompt = e
  showInstallButton()
})

// Ocultar botón si ya está instalada
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null
  hideInstallButton()
})

function showInstallButton() {
  const btn = document.getElementById('btn-install')
  if (btn) btn.classList.remove('hidden')
}

function hideInstallButton() {
  const btn = document.getElementById('btn-install')
  if (btn) btn.classList.add('hidden')
}

// Mostrar/ocultar loading overlay
function showLoading() {
  const overlay = document.getElementById('loading-overlay')
  if (overlay) overlay.classList.remove('hidden')
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay')
  if (overlay) overlay.classList.add('hidden')
}

// Renderizar vista inicial
function renderApp() {
  if (currentInvoice) {
    app.innerHTML = createInvoiceView(currentInvoice, signatureData)
    setupInvoiceViewEvents()
  } else {
    const history = getHistory()
    app.innerHTML = createDropzone(history)
    setupDropzoneEvents()
  }
}

// Configurar eventos del dropzone
function setupDropzoneEvents() {
  const dropzone = document.getElementById('dropzone')
  const fileInput = document.getElementById('file-input')

  dropzone.addEventListener('click', () => fileInput.click())

  // Soporte de teclado para accesibilidad
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInput.click()
    }
  })

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropzone.classList.add('border-blue-500', 'bg-blue-50')
  })

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-blue-500', 'bg-blue-50')
  })

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropzone.classList.remove('border-blue-500', 'bg-blue-50')
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  })

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  })

  // Botón de instalación PWA
  setupInstallButton()

  // Eventos del formulario de contacto
  setupContactForm()

  // Configurar toggle de tema
  setupThemeToggle()

  // Configurar toggle de idioma
  setupLangToggle()

  // Configurar eventos del historial
  setupHistoryEvents()
}

// Configurar eventos del historial
function setupHistoryEvents() {
  // Click en tarjetas de historial (event delegation)
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.history-card')
    if (!card) return

    const invoiceId = card.dataset.invoiceId
    if (invoiceId) {
      loadFromHistory(invoiceId)
    }
  })

  // Botón limpiar historial
  const clearBtn = document.getElementById('btn-clear-history')
  if (clearBtn) {
    clearBtn.addEventListener('click', showClearHistoryModal)
  }
}

// Cargar factura desde el historial
async function loadFromHistory(id) {
  const saved = getInvoice(id)
  if (!saved) {
    showToast(t('toast.invoiceNotFound'), 'error')
    return
  }

  showLoading()
  try {
    // Usar los datos guardados directamente
    currentInvoice = saved.data
    currentXmlContent = saved.xmlContent
    signatureData = saved.signatureValid !== null
      ? { valid: saved.signatureValid }
      : null

    renderApp()

    // Si estaba firmada, re-validar en background para datos actualizados
    if (currentInvoice.isSigned && currentXmlContent) {
      validateSignatureAsync(currentXmlContent)
    }
  } finally {
    hideLoading()
  }
}

// Mostrar modal de confirmación para limpiar historial
function showClearHistoryModal() {
  const modalHtml = createClearHistoryModal()
  const modalWrapper = document.createElement('div')
  modalWrapper.innerHTML = modalHtml
  document.body.appendChild(modalWrapper.firstElementChild)

  const modal = document.getElementById('clear-history-modal')
  const btnConfirm = document.getElementById('btn-confirm-clear')
  const btnCancel = document.getElementById('btn-cancel-clear')

  function cleanup() {
    modal?.remove()
  }

  btnConfirm?.addEventListener('click', () => {
    clearHistory()
    cleanup()
    showToast(t('toast.historyCleared'), 'success')
    renderApp()
  })

  btnCancel?.addEventListener('click', cleanup)

  // Cerrar con Escape
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      cleanup()
      document.removeEventListener('keydown', handleKeydown)
    }
  }
  document.addEventListener('keydown', handleKeydown)

  // Cerrar al hacer click fuera
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) cleanup()
  })
}

// Configurar botón de instalación PWA
function setupInstallButton() {
  const installBtn = document.getElementById('btn-install')
  if (!installBtn) return

  // Mostrar si ya tenemos el prompt guardado
  if (deferredInstallPrompt) {
    installBtn.classList.remove('hidden')
  }

  installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return

    deferredInstallPrompt.prompt()
    const { outcome } = await deferredInstallPrompt.userChoice

    if (outcome === 'accepted') {
      deferredInstallPrompt = null
      hideInstallButton()
    }
  })
}

// Procesar archivo XML
async function handleFile(file) {
  // Validar archivo (extensión y tamaño)
  const validation = validateFile(file)
  if (!validation.valid) {
    track(events.FILE_ERROR, { reason: 'validation', error: validation.error })
    showToast(validation.error, 'error')
    return
  }

  showLoading()
  try {
    const text = await file.text()
    currentXmlContent = text
    currentInvoice = parseFacturae(text)
    signatureData = null // Reset
    track(events.FILE_UPLOADED, { version: currentInvoice.version })
    renderApp()

    // Si está firmada, validar firma en background
    if (currentInvoice.isSigned) {
      validateSignatureAsync(text)
    }

    // Manejar guardado en historial
    handleSaveToHistory(currentInvoice, text)
  } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error)
    track(events.FILE_ERROR, { reason: 'parse', error: error.message })
    showToast(friendlyMessage, 'error')
    console.error('[FacturaView] Error técnico:', error)
  } finally {
    hideLoading()
  }
}

// Manejar guardado en historial
async function handleSaveToHistory(invoice, xmlContent) {
  // Si ya está guardada, no hacer nada
  if (findExistingInvoice(invoice)) {
    return
  }

  // Según preferencia del usuario
  if (shouldAutoSave()) {
    // Guardar automáticamente
    const result = saveInvoice(invoice, xmlContent, signatureData)
    if (result.success) {
      showToast(t('toast.invoiceSaved'), 'success')
    }
  } else if (shouldAskToSave()) {
    // Mostrar prompt
    const { save, remember } = await showSavePrompt(document.body)

    if (remember) {
      setSavePreference(save ? 'always' : 'never')
    }

    if (save) {
      const result = saveInvoice(invoice, xmlContent, signatureData)
      if (result.success) {
        showToast(t('toast.invoiceSaved'), 'success')
      } else {
        showToast(result.error || t('toast.saveError'), 'error')
      }
    }
  }
  // Si preference es 'never', no hacer nada
}

// Configurar eventos de la vista de factura
function setupInvoiceViewEvents() {
  const backBtn = document.getElementById('btn-back')
  const pdfBtn = document.getElementById('btn-pdf')
  const excelBtn = document.getElementById('btn-excel')

  backBtn?.addEventListener('click', () => {
    currentInvoice = null
    currentXmlContent = null
    signatureData = null
    renderApp()
  })

  pdfBtn?.addEventListener('click', async () => {
    const originalText = pdfBtn.textContent
    pdfBtn.disabled = true
    pdfBtn.textContent = t('invoice.generating')
    try {
      track(events.EXPORT_PDF, { version: currentInvoice.version })
      const { exportToPdf } = await import('./export/toPdf.js')
      exportToPdf(currentInvoice)
    } finally {
      pdfBtn.disabled = false
      pdfBtn.textContent = originalText
    }
  })

  excelBtn?.addEventListener('click', async () => {
    const originalText = excelBtn.textContent
    excelBtn.disabled = true
    excelBtn.textContent = t('invoice.generating')
    try {
      track(events.EXPORT_EXCEL, { version: currentInvoice.version })
      const { exportToExcel } = await import('./export/toExcel.js')
      exportToExcel(currentInvoice)
    } finally {
      excelBtn.disabled = false
      excelBtn.textContent = originalText
    }
  })

  // Event delegation para botones de copiar
  setupCopyButtons()

  // Configurar toggle de tema
  setupThemeToggle()

  // Configurar toggle de idioma
  setupLangToggle()
}

// Configurar formulario de contacto
function setupContactForm() {
  const toggleBtn = document.getElementById('toggle-contact')
  const container = document.getElementById('contact-form-container')
  const form = document.getElementById('contact-form')

  if (!toggleBtn || !container || !form) return

  // Configurar la URL de Formspree desde variable de entorno
  const formspreeId = import.meta.env.VITE_FORMSPREE_ID
  if (formspreeId) {
    form.action = `https://formspree.io/f/${formspreeId}`
  }

  toggleBtn.addEventListener('click', () => {
    container.classList.toggle('hidden')
  })

  // Envío asíncrono con feedback al usuario
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const message = document.getElementById('contact-message').value.trim()
    const status = document.getElementById('contact-status')
    const submitBtn = form.querySelector('button[type="submit"]')

    if (!message) {
      status.textContent = t('contact.messageRequired')
      status.className = 'text-xs text-red-500'
      return
    }

    submitBtn.disabled = true
    submitBtn.textContent = t('contact.sending')
    status.textContent = ''

    try {
      const formData = new FormData(form)
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })

      if (response.ok) {
        track(events.CONTACT_SENT)
        status.textContent = t('contact.sent')
        status.className = 'text-xs text-green-600'
        form.reset()
        setTimeout(() => {
          status.textContent = ''
          container.classList.add('hidden')
        }, 2000)
      } else {
        throw new Error('Error del servidor')
      }
    } catch (error) {
      status.textContent = t('contact.error')
      status.className = 'text-xs text-red-500'
      console.error('Error:', error)
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = t('contact.send')
    }
  })
}

// Configurar botón de tema
function setupThemeToggle() {
  const themeBtn = document.getElementById('btn-theme')
  if (!themeBtn) return

  // Actualizar icono según tema actual
  updateThemeIcon(themeBtn)

  themeBtn.addEventListener('click', () => {
    toggleTheme()
    updateThemeIcon(themeBtn)
  })
}

function updateThemeIcon(btn) {
  const theme = getTheme()
  const sunIcon = btn.querySelector('.icon-sun')
  const moonIcon = btn.querySelector('.icon-moon')

  if (theme === 'dark') {
    sunIcon?.classList.remove('hidden')
    moonIcon?.classList.add('hidden')
  } else {
    sunIcon?.classList.add('hidden')
    moonIcon?.classList.remove('hidden')
  }
}

// Configurar botón de idioma
function setupLangToggle() {
  const langBtn = document.getElementById('btn-lang')
  if (!langBtn) return

  langBtn.addEventListener('click', () => {
    toggleLang()
    // Re-renderizar la app para aplicar el nuevo idioma
    renderApp()
  })
}

// Validar firma en background
async function validateSignatureAsync(xmlContent) {
  try {
    signatureData = await validateSignature(xmlContent)
    // Re-renderizar solo la sección de firma
    updateSignatureSection()
  } catch (error) {
    console.error('[FacturaView] Error validando firma:', error)
  }
}

// Actualizar sección de firma sin re-renderizar todo
function updateSignatureSection() {
  const container = document.getElementById('signature-section')
  if (!container || !signatureData) return

  // Importar dinámicamente para evitar dependencia circular
  import('./components/InvoiceView.js').then(({ createSignatureSection }) => {
    if (createSignatureSection) {
      container.innerHTML = createSignatureSection(signatureData)
    }
  })
}

// Configurar botones de copiar (event delegation)
function setupCopyButtons() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-copy')
    if (!btn) return

    const textToCopy = btn.dataset.copy
    if (!textToCopy) return

    const success = await copyToClipboard(textToCopy)

    if (success) {
      // Mostrar feedback visual
      const copyIcon = btn.querySelector('.copy-icon')
      const checkIcon = btn.querySelector('.check-icon')

      if (copyIcon && checkIcon) {
        copyIcon.classList.add('hidden')
        checkIcon.classList.remove('hidden')

        setTimeout(() => {
          copyIcon.classList.remove('hidden')
          checkIcon.classList.add('hidden')
        }, 2000)
      }
    } else {
      showToast(t('toast.copyError'), 'error')
    }
  })
}

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {
    // SW registration failed, app works fine without it
  })
}

// Inicializar tema antes de renderizar (evita flash)
initTheme()

// Inicializar idioma antes de renderizar
initLang()

// Iniciar aplicación
renderApp()
