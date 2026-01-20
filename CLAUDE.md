# FacturaView

Visualizador de facturas electrónicas Facturae (XML) 100% frontend.

## Descripción

Web app que permite a autónomos y pymes españoles visualizar, entender y exportar facturas electrónicas en formato Facturae sin instalar software ni Java. Todo se procesa localmente en el navegador.

## Stack Técnico

- **Runtime:** Bun
- **Build:** Vite 7.x
- **Frontend:** Vanilla JS (ES Modules)
- **Estilos:** Tailwind CSS v4
- **PDF:** jsPDF (generación directa, sin html2canvas)
- **Excel:** SheetJS (xlsx)
- **Testing:** Vitest + jsdom
- **Deploy:** Railway (configurado) / Vercel / Netlify / GitHub Pages

## Estructura del Proyecto

```
facturaview/
├── index.html
├── vite.config.js
├── vitest.config.js
├── package.json
├── .env.example              # Variables de entorno (Formspree ID)
├── CLAUDE.md
├── src/
│   ├── main.js                 # Entry point
│   ├── style.css               # Tailwind CSS
│   ├── parser/
│   │   └── facturae.js         # Parser XML (todas las versiones)
│   ├── components/
│   │   ├── Dropzone.js         # Área de subida drag & drop
│   │   ├── InvoiceView.js      # Vista completa de factura
│   │   ├── PartyCard.js        # Tarjeta emisor/receptor
│   │   ├── LinesTable.js       # Tabla de líneas de detalle
│   │   └── TotalsBox.js        # Caja de impuestos y totales
│   ├── export/
│   │   ├── toPdf.js            # Exportar a PDF (jsPDF directo)
│   │   └── toExcel.js          # Exportar a Excel (xlsx)
│   └── utils/
│       ├── formatters.js       # Formateo moneda, fechas, NIF
│       ├── sanitizers.js       # Funciones de sanitización (XSS, Excel, filenames)
│       └── validators.js       # Validación de archivos (extensión, tamaño)
├── tests/
│   ├── parser.test.js          # Tests del parser (27 tests)
│   ├── export.test.js          # Tests de exportación (13 tests)
│   ├── security.test.js        # Tests de seguridad (25 tests)
│   ├── validators.test.js      # Tests de validación de archivos (27 tests)
│   └── fixtures/               # Archivos XML de prueba
│       ├── simple-322.xml      # Factura simple v3.2.2
│       ├── complex-322.xml     # Factura compleja (4 líneas, 3 IVAs)
│       ├── simple-321.xml      # Factura v3.2.1
│       ├── simple-32.xml       # Factura v3.2 (legacy)
│       ├── with-retention.xml  # Con retención IRPF 15%
│       └── rectificativa.xml   # Factura rectificativa (negativos)
├── tasks/
│   └── todo.md                 # Plan de tareas
├── doc/
│   ├── FACTURAVIEW_SPEC.md     # Especificación completa
│   └── SEO.md                  # Plan de acción SEO
└── public/
    ├── favicon.svg
    ├── og-image.png            # Imagen Open Graph (1200x630)
    └── og-image.svg            # Fuente de la imagen OG
```

## Versiones Facturae Soportadas

| Versión | Estado | Notas |
|---------|--------|-------|
| 3.2.2   | ✅ Completo | Obligatoria para FACe |
| 3.2.1   | ✅ Completo | Común en sector privado |
| 3.2     | ✅ Completo | Legacy, administración pública |

## Comandos

```bash
bun install          # Instalar dependencias
bun run dev          # Servidor de desarrollo (http://localhost:5173)
bun run build        # Build de producción
bun run preview      # Preview del build
bun run test         # Tests en modo watch
bun run test:run     # Ejecutar tests una vez
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
- [x] Tests automatizados (92 tests)
- [x] Formulario de contacto (Formspree)
- [x] Protección contra XSS, inyección Excel y path traversal

## Tipos de Factura Soportados

- **FC** - Factura completa
- **FA** - Factura simplificada
- **AF** - Autofactura
- **OO** - Original
- **OR** - Rectificativa (importes negativos)
- **CO** - Copia

## Principios de Desarrollo

1. **Sin backend:** Todo se procesa en el navegador del usuario
2. **Privacidad:** Los archivos nunca salen del dispositivo del usuario
3. **Simplicidad:** Código mínimo y dependencias mínimas
4. **Accesibilidad:** Debe funcionar en móvil y desktop

## Guías Generales

1. **Planificar primero:** Analizar el problema, leer archivos relevantes y escribir un plan en `tasks/todo.md`
2. **Verificar el plan:** Consultar con el usuario antes de comenzar la implementación
3. **Seguir el progreso:** Marcar las tareas como completadas conforme se avanza
4. **Explicar los cambios:** Proporcionar explicaciones de alto nivel sobre lo que se modificó
5. **Mantenerlo simple:** Cada cambio debe ser lo más simple posible, impactando el mínimo código
6. **Mantener la documentación:** Siempre sincronizar la documentación con los cambios en el código

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

### Seguridad
- **XSS Prevention:** Todos los datos del XML se escapan con `escapeHtml()` antes de renderizar
- **Excel Formula Injection:** Los valores de texto en Excel se sanitizan con `sanitizeExcelValue()`
- **Filename Sanitization:** Los nombres de archivo PDF/Excel se sanitizan con `sanitizeFilename()`
- **File Validation:** Validación de extensión (.xml, .xsig) y tamaño máximo (10 MB)
- **CSP Headers:** Content-Security-Policy configurado en index.html
- **No Secrets in Client:** El formulario usa Formspree (diseñado para uso público)

## Documentación

- Especificación completa: `doc/FACTURAVIEW_SPEC.md`
- Plan de SEO: `doc/SEO.md`
- Esquema XSD Facturae: https://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2.xml
- Documentación oficial: https://www.facturae.gob.es/formato/Paginas/version-3-2.aspx