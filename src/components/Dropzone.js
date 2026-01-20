/**
 * Componente Dropzone - Área de subida de archivos
 */

export function createDropzone() {
  return `
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">📄 FacturaView</h1>
        <p class="text-lg text-gray-600">Visualiza tus facturas electrónicas Facturae</p>
        <p class="text-sm text-gray-500">Sin instalar nada. 100% privado.</p>
      </header>

      <div
        id="dropzone"
        class="w-full max-w-xl border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50"
      >
        <div class="text-5xl mb-4">📎</div>
        <p class="text-lg text-gray-700 mb-2">Arrastra tu archivo XML aquí</p>
        <p class="text-sm text-gray-500 mb-4">o haz clic para seleccionar</p>
        <p class="text-xs text-gray-400">Formatos: Facturae 3.2, 3.2.1, 3.2.2</p>
        <input
          type="file"
          id="file-input"
          accept=".xml,.xsig"
          class="hidden"
        />
      </div>

      <footer class="mt-8 text-center">
        <p class="text-sm text-gray-500 flex items-center justify-center gap-2">
          🔒 Tu archivo no sale de tu navegador
        </p>
        <button
          id="toggle-contact"
          class="mt-4 text-sm text-blue-500 hover:text-blue-600 hover:underline"
        >
          💬 Contacto / Sugerencias
        </button>

        <div id="contact-form-container" class="hidden mt-4 max-w-md mx-auto">
          <form
            id="contact-form"
            action="https://formspree.io/f/xpqqjpkw"
            method="POST"
            class="text-left space-y-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div>
              <label for="contact-email" class="block text-xs text-gray-600 mb-1">
                Email <span class="text-gray-400">(opcional)</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                placeholder="tu@email.com"
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="contact-message" class="block text-xs text-gray-600 mb-1">
                Mensaje <span class="text-red-400">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows="3"
                placeholder="Escribe tu mensaje..."
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
    </div>
  `
}
