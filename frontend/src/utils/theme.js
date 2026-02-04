/**
 * Utilidad para gestión del tema claro/oscuro
 */

const STORAGE_KEY = 'facturaview-theme'
const DARK_CLASS = 'dark'

/**
 * Obtener tema actual
 * @returns {'light' | 'dark'} - Tema actual
 */
export function getTheme() {
  // Primero verificar localStorage
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') {
    return stored
  }

  // Si no hay preferencia guardada, usar preferencia del sistema
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

/**
 * Aplicar tema al documento
 * @param {'light' | 'dark'} theme - Tema a aplicar
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add(DARK_CLASS)
  } else {
    document.documentElement.classList.remove(DARK_CLASS)
  }
}

/**
 * Inicializar tema al cargar la página
 * Debe llamarse antes de renderizar la app
 */
export function initTheme() {
  const theme = getTheme()
  applyTheme(theme)

  // Escuchar cambios en preferencia del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Solo aplicar si no hay preferencia guardada
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
}

/**
 * Alternar entre tema claro y oscuro
 * @returns {'light' | 'dark'} - Nuevo tema aplicado
 */
export function toggleTheme() {
  const current = getTheme()
  const newTheme = current === 'dark' ? 'light' : 'dark'

  localStorage.setItem(STORAGE_KEY, newTheme)
  applyTheme(newTheme)

  return newTheme
}

/**
 * Establecer tema específico
 * @param {'light' | 'dark'} theme - Tema a establecer
 */
export function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return

  localStorage.setItem(STORAGE_KEY, theme)
  applyTheme(theme)
}