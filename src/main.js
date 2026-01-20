import './style.css'
import { createDropzone } from './components/Dropzone.js'
import { createInvoiceView } from './components/InvoiceView.js'
import { parseFacturae } from './parser/facturae.js'
import { sendToDiscord } from './utils/discord.js'

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
  try {
    const text = await file.text()
    currentInvoice = parseFacturae(text)
    renderApp()
  } catch (error) {
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
    const { exportToPdf } = await import('./export/toPdf.js')
    exportToPdf(currentInvoice)
  })

  excelBtn?.addEventListener('click', async () => {
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

  toggleBtn.addEventListener('click', () => {
    container.classList.toggle('hidden')
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('contact-email').value.trim()
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
      await sendToDiscord(email, message)
      status.textContent = '✓ Enviado'
      status.className = 'text-xs text-green-600'
      form.reset()
      setTimeout(() => {
        status.textContent = ''
        container.classList.add('hidden')
      }, 2000)
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
