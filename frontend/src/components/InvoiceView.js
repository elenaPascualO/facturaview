/**
 * Componente InvoiceView - Vista de factura
 */

import { formatCurrency, formatDate } from '../utils/formatters.js'
import { escapeHtml } from '../utils/sanitizers.js'
import { createPartyCard } from './PartyCard.js'
import { createLinesTable } from './LinesTable.js'
import { createTotalsBox } from './TotalsBox.js'
import { createBatchHeader } from './BatchHeader.js'
import { createFileSelector } from './FileSelector.js'
import { createNavbar } from './Navbar.js'
import { isBatchInvoice } from '../parser/facturae.js'
import { t } from '../utils/i18n.js'

export function createInvoiceView(data, signatureData = null, invoiceIndex = 0, loadedFiles = [], currentFileIndex = 0) {
  const invoice = data.invoices[invoiceIndex]
  const isBatch = isBatchInvoice(data)
  const hasMultipleFiles = loadedFiles.length > 1

  return `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      ${createNavbar({ showBackButton: true })}
      <main role="main" class="flex-1 p-4 md:p-8">
        <div class="max-w-4xl mx-auto">
          <!-- Export buttons -->
          <div class="flex gap-2 flex-wrap mb-6">
            <button
              id="btn-pdf"
              aria-label="${t('invoice.downloadPdf')}"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              ${t('invoice.downloadPdf')}
            </button>
            <button
              id="btn-excel"
              aria-label="${t('invoice.downloadExcel')}"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              ${t('invoice.downloadExcel')}
            </button>
            ${isBatch ? `
              <button
                id="btn-export-all"
                aria-label="${t('invoice.exportAll')}"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                ${t('invoice.exportAll')}
              </button>
            ` : ''}
          </div>

          <!-- File selector (for multiple loaded files) -->
          ${hasMultipleFiles ? createFileSelector(loadedFiles, currentFileIndex) : ''}

          <!-- Batch header with navigation (only for batch invoices within a file) -->
          ${isBatch ? createBatchHeader(data, invoiceIndex) : ''}

          <!-- Info de factura -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
              ${t('invoice.title')} ${invoice.series ? escapeHtml(invoice.series) + '/' : ''}${escapeHtml(invoice.number)}
                </h2>
                <p class="text-gray-500 dark:text-gray-400">${escapeHtml(getInvoiceTypeLabel(invoice.invoiceType))} · ${escapeHtml(getInvoiceClassLabel(invoice.invoiceClass))}</p>
              </div>
              <div class="text-right">
                <p class="text-gray-600 dark:text-gray-300">${t('invoice.date')} <span class="font-medium">${escapeHtml(formatDate(invoice.issueDate))}</span></p>
                <p class="text-sm text-gray-400 dark:text-gray-500">${t('invoice.version')} ${escapeHtml(data.version)}</p>
                ${data.isSigned ? `<p class="text-sm text-green-600 dark:text-green-400">${t('invoice.signed')}</p>` : ''}
              </div>
            </div>
          </div>

          <!-- Emisor y Receptor -->
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            ${createPartyCard(t('party.seller'), data.seller)}
            ${createPartyCard(t('party.buyer'), data.buyer)}
          </div>

          <!-- Líneas de detalle -->
          ${createLinesTable(invoice.lines)}

          <!-- Impuestos y Totales -->
          ${createTotalsBox(invoice.taxes, invoice.totals)}

          <!-- Información de pago -->
          ${invoice.payment ? createPaymentInfo(invoice.payment) : ''}

          <!-- Firma digital -->
          <div id="signature-section">
            ${data.isSigned ? createSignatureSection(signatureData) : createNoSignatureSection()}
          </div>
        </div>
      </main>
    </div>
  `
}

function getInvoiceTypeLabel(type) {
  const key = `invoiceType.${type}`
  const translated = t(key)
  // Si la traducción es la misma que la clave, usar el fallback
  return translated !== key ? translated : t('invoiceType.default')
}

function getInvoiceClassLabel(invoiceClass) {
  const key = `invoiceClass.${invoiceClass}`
  const translated = t(key)
  return translated !== key ? translated : invoiceClass || ''
}

function createPaymentInfo(payment) {
  return `
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">${t('payment.title')}</h3>
      <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
        ${payment.dueDate ? `<p><span class="text-gray-500 dark:text-gray-400">${t('payment.dueDate')}</span> ${escapeHtml(formatDate(payment.dueDate))}</p>` : ''}
        ${payment.paymentMeans ? `<p><span class="text-gray-500 dark:text-gray-400">${t('payment.method')}</span> ${escapeHtml(getPaymentMeansLabel(payment.paymentMeans))}</p>` : ''}
        ${payment.iban ? `
          <p class="flex items-center gap-2">
            <span class="text-gray-500 dark:text-gray-400">${t('payment.iban')}</span>
            <span>${escapeHtml(payment.iban)}</span>
            <button
              class="btn-copy text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              data-copy="${escapeHtml(payment.iban)}"
              aria-label="${t('payment.copyIban')}"
              title="${t('payment.copyIban')}"
            >
              <svg class="w-4 h-4 copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <svg class="w-4 h-4 check-icon hidden text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
          </p>
        ` : ''}
        ${payment.bic ? `<p><span class="text-gray-500 dark:text-gray-400">${t('payment.bic')}</span> ${escapeHtml(payment.bic)}</p>` : ''}
      </div>
    </div>
  `
}

function getPaymentMeansLabel(code) {
  const key = `paymentMethod.${code}`
  const translated = t(key)
  return translated !== key ? translated : code
}

/**
 * Crea la sección de firma digital
 * @param {Object|null} signatureData - Datos de validación de firma
 */
export function createSignatureSection(signatureData) {
  // Si no hay datos, mostrar estado de carga
  if (!signatureData) {
    return `
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          🔐 ${t('signature.title')}
        </h3>
        <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm">${t('signature.validating')}</span>
        </div>
      </div>
    `
  }


  // Determinar estado
  const statusIcon = signatureData.valid === true ? '✅' :
                     signatureData.valid === false ? '❌' : '⚠️'
  const statusText = signatureData.valid === true ? t('signature.valid') :
                     signatureData.valid === false ? t('signature.invalid') : t('signature.notVerified')
  const statusColor = signatureData.valid === true ? 'text-green-600 dark:text-green-400' :
                      signatureData.valid === false ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'

  return `
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        🔐 ${t('signature.title')}
      </h3>

      <div class="space-y-3 text-sm">
        <!-- Estado -->
        <p class="flex items-center gap-2">
          <span class="text-gray-500 dark:text-gray-400">${t('signature.status')}</span>
          <span class="${statusColor} font-medium">${statusIcon} ${escapeHtml(statusText)}</span>
        </p>

        <!-- Tipo de firma -->
        ${signatureData.signature_type ? `
          <p>
            <span class="text-gray-500 dark:text-gray-400">${t('signature.type')}</span>
            <span class="text-gray-800 dark:text-gray-200">${escapeHtml(signatureData.signature_type)}</span>
          </p>
        ` : ''}

        <!-- Firmante -->
        ${signatureData.signer ? `
          <div class="pt-2 border-t border-gray-100 dark:border-slate-700">
            <p class="text-gray-500 dark:text-gray-400 mb-1">${t('signature.signer')}</p>
            ${signatureData.signer.name ? `
              <p class="text-gray-800 dark:text-gray-200 font-medium">${escapeHtml(signatureData.signer.name)}</p>
            ` : ''}
            ${signatureData.signer.tax_id ? `
              <p class="text-gray-600 dark:text-gray-300">${escapeHtml(signatureData.signer.tax_id)}</p>
            ` : ''}
            ${signatureData.signer.organization && signatureData.signer.organization !== signatureData.signer.name ? `
              <p class="text-gray-500 dark:text-gray-400 text-xs">${escapeHtml(signatureData.signer.organization)}</p>
            ` : ''}
          </div>
        ` : ''}

        <!-- Certificado -->
        ${signatureData.certificate ? `
          <div class="pt-2 border-t border-gray-100 dark:border-slate-700">
            <p class="text-gray-500 dark:text-gray-400 mb-1">${t('signature.certificate')}</p>
            ${signatureData.certificate.issuer ? `
              <p class="text-gray-800 dark:text-gray-200">${escapeHtml(signatureData.certificate.issuer)}</p>
            ` : ''}
            ${signatureData.certificate.valid_to ? `
              <p class="text-gray-500 dark:text-gray-400 text-xs">
                ${t('signature.validUntil')} ${escapeHtml(formatDate(signatureData.certificate.valid_to))}
                ${signatureData.certificate.is_expired ? `<span class="text-red-500"> ${t('signature.expired')}</span>` : ''}
              </p>
            ` : ''}
          </div>
        ` : ''}

        <!-- Estado de revocación -->
        ${signatureData.revocation_checked ? `
          <p class="${signatureData.revoked ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}">
            ${signatureData.revoked ? t('signature.revoked') : t('signature.notRevoked')}
          </p>
        ` : ''}

        <!-- Errores -->
        ${signatureData.errors && signatureData.errors.length > 0 ? `
          <div class="pt-2 border-t border-gray-100 dark:border-slate-700">
            <p class="text-red-600 dark:text-red-400 text-xs">
              ${signatureData.errors.map(err => escapeHtml(err)).join('<br>')}
            </p>
          </div>
        ` : ''}

        <!-- Warnings -->
        ${signatureData.warnings && signatureData.warnings.length > 0 ? `
          <p class="text-yellow-600 dark:text-yellow-400 text-xs">
            ${signatureData.warnings.map(w => escapeHtml(w)).join('<br>')}
          </p>
        ` : ''}
      </div>

      <!-- Nota de privacidad y disclaimer -->
      <div class="mt-4 text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p class="italic">
          ${t('signature.privacyNote')}
        </p>
        <p>
          ${t('signature.disclaimer')}
          <a href="https://valide.redsara.es/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">VALIDe</a>.
        </p>
      </div>
    </div>
  `
}

/**
 * Crea la sección informativa para facturas sin firma digital
 */
export function createNoSignatureSection() {
  return `
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        🔐 ${t('signature.title')}
      </h3>
      <div class="space-y-2 text-sm">
        <p class="flex items-center gap-2">
          <span class="text-yellow-600 dark:text-yellow-400">⚠️</span>
          <span class="text-gray-700 dark:text-gray-300">${t('signature.noSignature')}</span>
        </p>
        <p class="text-gray-500 dark:text-gray-400 text-xs">
          ${t('signature.faceRequirement')}
        </p>
      </div>
    </div>
  `
}
