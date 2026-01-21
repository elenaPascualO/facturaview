import './style.css'
import { createDropzone } from './components/Dropzone.js'
import { createInvoiceView } from './components/InvoiceView.js'
import { parseFacturae } from './parser/facturae.js'
import { validateFile } from './utils/validators.js'
import { track, events } from './utils/tracking.js'

const app = document.querySelector('#app')

// Estado de la aplicación
let currentInvoice = null

// Renderizar vista inicial
function renderApp() {
  if (currentInvoice) {
    app.innerHTML = createInvoiceView(currentInvoice)
    setupInvoiceViewEvents()
  } else {
    app.innerHTML = createDropzone()
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

  // Eventos del formulario de contacto
  setupContactForm()
}

// Procesar archivo XML
async function handleFile(file) {
  // Validar archivo (extensión y tamaño)
  const validation = validateFile(file)
  if (!validation.valid) {
    track(events.FILE_ERROR, { reason: 'validation', error: validation.error })
    alert(validation.error)
    return
  }

  try {
    const text = await file.text()
    currentInvoice = parseFacturae(text)
    track(events.FILE_UPLOADED, { version: currentInvoice.version })
    renderApp()
  } catch (error) {
    track(events.FILE_ERROR, { reason: 'parse', error: error.message })
    alert('Error al procesar el archivo: ' + error.message)
  }
}

// Configurar eventos de la vista de factura
function setupInvoiceViewEvents() {
  const backBtn = document.getElementById('btn-back')
  const pdfBtn = document.getElementById('btn-pdf')
  const excelBtn = document.getElementById('btn-excel')

  backBtn?.addEventListener('click', () => {
    currentInvoice = null
    renderApp()
  })

  pdfBtn?.addEventListener('click', async () => {
    track(events.EXPORT_PDF, { version: currentInvoice.version })
    const { exportToPdf } = await import('./export/toPdf.js')
    exportToPdf(currentInvoice)
  })

  excelBtn?.addEventListener('click', async () => {
    track(events.EXPORT_EXCEL, { version: currentInvoice.version })
    const { exportToExcel } = await import('./export/toExcel.js')
    exportToExcel(currentInvoice)
  })
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
      status.textContent = 'El mensaje es obligatorio'
      status.className = 'text-xs text-red-500'
      return
    }

    submitBtn.disabled = true
    submitBtn.textContent = 'Enviando...'
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
        status.textContent = '✓ Enviado'
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
      status.textContent = 'Error al enviar'
      status.className = 'text-xs text-red-500'
      console.error('Error:', error)
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = 'Enviar'
    }
  })
}

// Iniciar aplicación
renderApp()
