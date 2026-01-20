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
      </footer>
    </div>
  `
}
