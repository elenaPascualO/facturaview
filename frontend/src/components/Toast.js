/**
 * Componente Toast - Notificaciones estilizadas
 */

import { escapeHtml } from '../utils/sanitizers.js'

/**
 * Mostrar toast de notificación
 * @param {string} message - Mensaje a mostrar
 * @param {'success' | 'error'} type - Tipo de toast
 */
export function showToast(message, type = 'error') {
  const container = document.getElementById('toast-container')
  if (!container) return

  const toast = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-500'

  toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0`
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '✕'}</span>
    <span>${escapeHtml(message)}</span>
  `

  container.appendChild(toast)

  // Animar entrada
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0')
  })

  // Auto-remove después de 5s
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0')
    setTimeout(() => toast.remove(), 300)
  }, 5000)
}