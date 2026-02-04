# FacturaView

Visualizador de facturas electrónicas Facturae (XML) con validación de firmas digitales.

## Descripción

Web app que permite a autónomos y pymes españoles visualizar, entender y exportar facturas electrónicas en formato Facturae sin instalar software ni Java. El parseo y visualización se procesan localmente en el navegador. Las facturas firmadas pueden validarse opcionalmente mediante un backend.

## Stack Técnico

### Frontend
- **Runtime:** Bun
- **Build:** Vite 7.x
- **Frontend:** Vanilla JS (ES Modules)
- **Estilos:** Tailwind CSS v4
- **PDF:** jsPDF (generación directa, sin html2canvas)
- **Excel:** SheetJS (xlsx)
- **Testing:** Vitest + jsdom
- **Deploy:** Railway

### Backend (Validación de firmas)
- **Runtime:** Python 3.11+
- **Framework:** FastAPI
- **Package Manager:** uv
- **Validación XAdES:** signxml + cryptography
- **Testing:** pytest + httpx
- **Deploy:** Railway (Dockerfile)

## Estructura del Proyecto

```
facturaview/
├── frontend/                     # Código frontend (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vitest.config.js
│   ├── bun.lock
│   ├── .env.example              # Variables de entorno (Formspree ID)
│   ├── src/
│   │   ├── main.js               # Entry point
│   │   ├── style.css             # Tailwind CSS
│   │   ├── parser/
│   │   │   └── facturae.js       # Parser XML (todas las versiones)
│   │   ├── components/
│   │   │   ├── Dropzone.js       # Área de subida drag & drop
│   │   │   ├── InvoiceView.js    # Vista completa de factura
│   │   │   ├── PartyCard.js      # Tarjeta emisor/receptor
│   │   │   ├── LinesTable.js     # Tabla de líneas de detalle
│   │   │   ├── TotalsBox.js      # Caja de impuestos y totales
│   │   │   ├── HistorySection.js # Sección de facturas recientes
│   │   │   └── SavePrompt.js     # Modal para guardar en historial
│   │   ├── export/
│   │   │   ├── toPdf.js          # Exportar a PDF (jsPDF directo)
│   │   │   └── toExcel.js        # Exportar a Excel (xlsx)
│   │   └── utils/
│   │       ├── formatters.js     # Formateo moneda, fechas, NIF
│   │       ├── sanitizers.js     # Funciones de sanitización (XSS, Excel, filenames)
│   │       ├── tracking.js       # Tracking de eventos con Umami
│   │       ├── validators.js     # Validación de archivos (extensión, tamaño)
│   │       ├── errors.js         # Errores amigables para el usuario
│   │       ├── theme.js          # Gestión tema claro/oscuro
│   │       ├── clipboard.js      # Copiar al portapapeles
│   │       ├── signature.js      # Cliente API de validación de firmas
│   │       └── storage.js        # Historial local de facturas (localStorage)
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── og-image.png          # Imagen Open Graph (1200x630)
│   │   ├── og-image.svg          # Fuente de la imagen OG
│   │   ├── robots.txt            # Configuración para bots/crawlers
│   │   ├── sitemap.xml           # Mapa del sitio para SEO
│   │   ├── manifest.json         # PWA manifest
│   │   └── sw.js                 # Service Worker para PWA
│   └── tests/
│       ├── parser.test.js        # Tests del parser (30 tests)
│       ├── export.test.js        # Tests de exportación (13 tests)
│       ├── security.test.js      # Tests de seguridad (25 tests)
│       ├── validators.test.js    # Tests de validación de archivos (27 tests)
│       ├── errors.test.js        # Tests de errores amigables (23 tests)
│       ├── clipboard.test.js     # Tests de clipboard (7 tests)
│       ├── storage.test.js       # Tests de historial local (42 tests)
│       └── fixtures/             # Archivos XML de prueba
│           ├── simple-322.xml    # Factura simple v3.2.2
│           ├── complex-322.xml   # Factura compleja (4 líneas, 3 IVAs)
│           ├── simple-321.xml    # Factura v3.2.1
│           ├── simple-32.xml     # Factura v3.2 (legacy)
│           ├── with-retention.xml # Con retención IRPF 15%
│           └── rectificativa.xml # Factura rectificativa (negativos)
├── backend/                      # API de validación de firmas (FastAPI)
│   ├── __init__.py
│   ├── main.py                   # Entry point FastAPI + StaticFiles
│   ├── app/
│   │   ├── routes/
│   │   │   └── signature.py      # POST /api/validate-signature
│   │   ├── services/
│   │   │   └── validator.py      # Lógica de validación XAdES
│   │   └── models/
│   │       └── response.py       # Modelos Pydantic
│   └── tests/
│       └── test_signature.py     # Tests del backend (8 tests)
├── pyproject.toml                # Dependencias Python (uv)
├── uv.lock                       # Lock file Python
├── Dockerfile                    # Build unificado (frontend + backend)
├── railway.json                  # Config Railway
├── CLAUDE.md
├── tasks/
│   └── todo.md                   # Plan de tareas
└── doc/
    ├── FACTURAVIEW_SPEC.md       # Especificación completa
    └── SEO.md                    # Plan de acción SEO
```

## Versiones Facturae Soportadas

| Versión | Estado | Notas |
|---------|--------|-------|
| 3.2.2   | ✅ Completo | Obligatoria para FACe |
| 3.2.1   | ✅ Completo | Común en sector privado |
| 3.2     | ✅ Completo | Legacy, administración pública |

## Comandos

### Frontend
```bash
cd frontend
bun install          # Instalar dependencias
bun run dev          # Servidor de desarrollo (http://localhost:5173)
bun run build        # Build de producción (genera frontend/dist/)
bun run preview      # Preview del build
bun run test         # Tests en modo watch
bun run test:run     # Ejecutar tests una vez (167 tests)
```

### Backend
```bash
# Desde la raíz del proyecto
uv sync              # Instalar dependencias
uv sync --extra dev  # Instalar con dev dependencies
uv run uvicorn backend.main:app --reload  # Servidor desarrollo (http://localhost:8000)
uv run pytest -v     # Ejecutar tests (8 tests)
```

### Desarrollo conjunto
```bash
# Terminal 1: Backend (desde raíz)
uv run uvicorn backend.main:app --reload --port 8000

# Terminal 2: Frontend (desde frontend/)
cd frontend && bun run dev
# El frontend usa proxy para /api y /health → http://localhost:8000
```

### Docker
```bash
docker build -t facturaview .
docker run -p 8000:8000 facturaview
# Visitar http://localhost:8000
```

## Funcionalidades MVP

- [x] Subir archivo XML (drag & drop + selector)
- [x] Detectar versión Facturae (3.2, 3.2.1, 3.2.2)
- [x] Mostrar datos legibles (emisor, receptor, líneas, IVA, totales)
- [x] Información de pago (IBAN, vencimiento, forma de pago)
- [x] Descargar como PDF
- [x] Descargar como Excel (3 hojas: General, Líneas, Impuestos)
- [x] 100% privado (todo en navegador)
- [x] Responsive (móvil)
- [x] Tests automatizados (167 tests)
- [x] Formulario de contacto (Formspree)
- [x] Protección contra XSS, inyección Excel y path traversal
- [x] Analítica de eventos (Umami)
- [x] PWA instalable (Service Worker + manifest)
- [x] Historial local de facturas (localStorage)

## Tipos de Factura Soportados

- **FC** - Factura completa
- **FA** - Factura simplificada
- **AF** - Autofactura
- **OO** - Original
- **OR** - Rectificativa (importes negativos)
- **CO** - Copia

## Principios de Desarrollo

1. **Privacidad:** El parseo y visualización de facturas se hace 100% en el navegador
2. **Backend opcional:** La validación de firmas digitales usa el backend de forma opcional
3. **Simplicidad:** Código mínimo y dependencias mínimas
4. **Accesibilidad:** Debe funcionar en móvil y desktop, con soporte ARIA y navegación por teclado

## Guías Generales

1. **Planificar primero:** Analizar el problema, leer archivos relevantes y escribir un plan en `tasks/todo.md`
2. **Verificar el plan:** Consultar con el usuario antes de comenzar la implementación
3. **Seguir el progreso:** Marcar las tareas como completadas conforme se avanza
4. **Explicar los cambios:** Proporcionar explicaciones de alto nivel sobre lo que se modificó
5. **Mantenerlo simple:** Cada cambio debe ser lo más simple posible, impactando el mínimo código
6. **Mantener la documentación:** Siempre sincronizar la documentación con los cambios en el código
7. **Crear tests si es posible** Si la funcionalidad es testable, crear tests de las funciones implementadas.

## Notas Técnicas

### Exportación PDF
Se usa jsPDF directamente (sin html2canvas) porque Tailwind CSS v4 usa colores `oklch` que html2canvas no soporta. El PDF se genera programáticamente con todas las secciones de la factura. Usa la moneda del documento (`InvoiceCurrencyCode`) en lugar de asumir EUR.

### Exportación Excel
Genera 3 hojas (General, Líneas, Impuestos) con anchos de columna optimizados. Incluye información de pago y usa la moneda del documento.

### Parser XML
El parser usa `DOMParser` nativo del navegador. Detecta automáticamente la versión del esquema y extrae:
- Emisor/Receptor (empresa o persona física)
- Direcciones
- Líneas de detalle con IVA por línea
- Impuestos agregados (múltiples tipos de IVA)
- Retenciones IRPF
- Información de pago (IBAN, BIC, vencimiento)

### Formulario de Contacto
Formulario colapsable en el Dropzone que envía mensajes via Formspree. Configuración:
- Crear cuenta gratuita en https://formspree.io
- Copiar `.env.example` a `.env`
- Configurar `VITE_FORMSPREE_ID` con tu Form ID

### Validación de Firmas Digitales
El cliente de validación (`utils/signature.js`) usa URLs relativas por defecto, lo que permite que funcione automáticamente cuando frontend y backend están en el mismo servidor (Railway, Docker).

- **Facturas sin firma:** Muestra mensaje informativo indicando que la factura no está firmada y que FACe requiere firma digital
- **Facturas con firma:** Muestra spinner "Validando..." y luego el resultado (válida/inválida/error de conexión)
- **Variable de entorno:** `VITE_SIGNATURE_API_URL` solo es necesaria si el backend está en un dominio diferente

### Seguridad
- **XSS Prevention:** Todos los datos del XML se escapan con `escapeHtml()` antes de renderizar
- **Excel Formula Injection:** Los valores de texto en Excel se sanitizan con `sanitizeExcelValue()`
- **Filename Sanitization:** Los nombres de archivo PDF/Excel se sanitizan con `sanitizeFilename()`
- **File Validation:** Validación de extensión (.xml, .xsig) y tamaño máximo (10 MB)
- **CSP Headers:** Content-Security-Policy configurado en index.html
- **Clickjacking Protection:** `X-Frame-Options: DENY` configurado via HTTP headers en `serve.json`
- **Route Blocking:** Rutas sensibles bloqueadas con 404 real (`.git/`, `.env`, `.aws/`, `wp-admin/`, `*.php`, etc.) configurado en `public/serve.json`
- **Security Headers:** `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy` en todas las respuestas
- **No Secrets in Client:** El formulario usa Formspree (diseñado para uso público)

### Analítica (Umami)
Tracking de eventos con Umami para entender el uso de la aplicación:
- **file-uploaded:** Archivo subido correctamente (incluye versión Facturae)
- **file-error:** Error al subir/parsear archivo (incluye razón y mensaje)
- **export-pdf:** Exportación a PDF (incluye versión)
- **export-excel:** Exportación a Excel (incluye versión)
- **contact-sent:** Formulario de contacto enviado

El módulo `utils/tracking.js` proporciona un wrapper que verifica si Umami está disponible antes de trackear.

### PWA (Progressive Web App)
La app es instalable como PWA en móviles y desktop:
- **Service Worker:** `public/sw.js` cachea assets estáticos y permite uso offline
- **Manifest:** `public/manifest.json` con iconos 192x192 y 512x512
- **Estrategia de cache:** Network-first para HTML, cache-first para assets
- **Versionado:** Cambiar `CACHE_NAME` en sw.js para forzar actualización del cache

### Historial Local de Facturas
El historial permite guardar facturas localmente en el navegador para acceso rapido:

- **Almacenamiento:** localStorage con clave `facturaview-history`
- **Limites:** Maximo 50 facturas, 2 MB de almacenamiento total
- **Privacidad:** Los datos nunca salen del dispositivo del usuario
- **Preferencias de guardado:**
  - `ask` (por defecto): Pregunta al usuario si desea guardar cada factura
  - `always`: Guarda automaticamente todas las facturas
  - `never`: No guarda ni pregunta
- **Datos guardados:** Metadata (numero, emisor, total), datos parseados, XML original, estado de firma
- **Funciones principales:** `getHistory()`, `saveInvoice()`, `deleteInvoice()`, `clearHistory()`

El componente `HistorySection.js` muestra las ultimas 5 facturas en el Dropzone. El componente `SavePrompt.js` muestra el modal de confirmacion con opcion de recordar preferencia.

### SEO y Accesibilidad
- **robots.txt y sitemap.xml:** En `public/` para indexación
- **Schema.org JSON-LD:** Datos estructurados WebApplication en index.html
- **ARIA:** Labels en botones y dropzone, `role="main"` en vista de factura
- **Teclado:** Soporte Enter/Space en dropzone, focus visible
- **Tablas accesibles:** `scope="col"` en headers de tabla

## Documentación

- Especificación completa: `doc/FACTURAVIEW_SPEC.md`
- Plan de SEO: `doc/SEO.md`
- Esquema XSD Facturae: https://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2.xml
- Documentación oficial: https://www.facturae.gob.es/formato/Paginas/version-3-2.aspx