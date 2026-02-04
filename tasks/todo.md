# FacturaView - Plan de Implementación

## MVP (Fase 0) - ✅ COMPLETADO

### Setup y Configuración
- [x] Setup proyecto (Bun + Vite + Vanilla JS)
- [x] Configurar Tailwind CSS v4
- [x] Configurar Vitest para tests

### Parser Facturae
- [x] Parser Facturae básico
- [x] Soporte versión 3.2.2
- [x] Soporte versión 3.2.1
- [x] Soporte versión 3.2
- [x] Parseo de emisor (empresa y persona física)
- [x] Parseo de receptor
- [x] Parseo de líneas de detalle
- [x] Parseo de impuestos (múltiples tipos de IVA)
- [x] Parseo de retenciones IRPF
- [x] Parseo de información de pago (IBAN, BIC)
- [x] Detección de factura firmada
- [x] Soporte facturas rectificativas (importes negativos)

### UI/UX
- [x] Dropzone con drag & drop
- [x] Vista completa de factura
- [x] Tarjetas emisor/receptor
- [x] Tabla de líneas de detalle
- [x] Desglose de impuestos y totales
- [x] Información de pago
- [x] Diseño responsive (móvil)
- [x] Formulario de contacto (Formspree)

### Exportación
- [x] Exportar a PDF (jsPDF directo)
- [x] Exportar a Excel (3 hojas: General, Líneas, Impuestos)

### Testing
- [x] Tests del parser (30 tests)
- [x] Tests de exportación (13 tests)
- [x] Tests de seguridad (25 tests)
- [x] Tests de validación de archivos (27 tests)
- [x] Tests de errores amigables (23 tests)
- [x] Tests de clipboard (7 tests)
- [x] Tests de historial local (42 tests)
- [x] Tests de internacionalización (37 tests)
- [x] Fixtures de prueba (6 archivos XML)

**Total: 204 tests pasando**

### Seguridad (Auditoría completada)
- [x] Reemplazar Discord webhook con Formspree
- [x] Prevención XSS en todos los componentes UI
- [x] Sanitización de fórmulas Excel
- [x] Sanitización de nombres de archivo
- [x] Validación de archivos (extensión y tamaño)
- [x] Headers CSP en index.html
- [x] Eliminada dependencia html2canvas no usada
- [x] Bloqueo de rutas sensibles con 404 real (`.git/`, `.env`, `.aws/`, `wp-admin/`, `*.php`, etc.)
- [x] Headers de seguridad adicionales (`X-XSS-Protection`, `Referrer-Policy`)

### Analítica y PWA (Enero 2026)
- [x] Tracking de eventos con Umami (file-uploaded, export-pdf, export-excel, contact-sent)
- [x] PWA completa con iconos PNG (192x192, 512x512, apple-touch-icon)
- [x] Meta tags iOS para instalación en móvil
- [x] Service Worker (`public/sw.js`) para cache y uso offline
- [x] Botón "Instalar app" en footer (solo visible si instalable)

---

## Mejoras UX (Febrero 2026) - ✅ COMPLETADO

### Fase 1: Esfuerzo Bajo
- [x] Loading states (spinner durante procesamiento, "Generando..." en botones)
- [x] Toasts estilizados en lugar de `alert()` (`src/components/Toast.js`)
- [x] Copiar al portapapeles (NIF, IBAN, total) con feedback visual
- [x] Tests de clipboard (7 tests nuevos)
- [x] Mensajes de error amigables (`src/utils/errors.js`)
  - Mapeo de errores técnicos a mensajes en español
  - Detección automática de tipo de error (XML inválido, no Facturae, sin facturas, etc.)
  - Tests de errores (23 tests nuevos)

### Fase 2.1: Modo Oscuro
- [x] Utilidad de tema (`src/utils/theme.js`)
  - `initTheme()`, `toggleTheme()`, `getTheme()`
  - Persistencia en localStorage
  - Respeta preferencia del sistema
- [x] Dark mode en Tailwind v4 (`src/style.css`)
- [x] Botón toggle sol/luna en header
- [x] Todos los componentes actualizados con clases `dark:`
  - Dropzone, InvoiceView, PartyCard, LinesTable, TotalsBox

### Fase 2.2: Backend + Validación de Firma Digital
- [x] Backend Python/FastAPI (`backend/`)
  - `main.py` - Entry point con CORS configurado
  - `app/routes/signature.py` - POST /api/validate-signature
  - `app/services/validator.py` - Validación XAdES con signxml
  - `app/models/response.py` - Modelos Pydantic
  - `tests/test_signature.py` - 8 tests pasando
- [x] Gestión de dependencias con `uv`
- [x] Dockerfile para Railway
- [x] Cliente frontend (`src/utils/signature.js`)
  - URLs relativas por defecto (funciona automáticamente en Railway/Docker)
  - `VITE_SIGNATURE_API_URL` solo necesaria si backend en dominio diferente
- [x] Sección de firma en InvoiceView con:
  - Estado de validación (válida/inválida/verificando)
  - Datos del firmante (nombre, NIF, organización)
  - Datos del certificado (emisor, validez)
  - Estado de revocación (OCSP cuando disponible)
  - Nota de privacidad
  - Mensaje informativo para facturas sin firma (nota sobre requisito FACe)

**Tests frontend: 167 pasando**
**Tests backend: 8 pasando**

### Fase 2.3: Reorganización y Deploy Unificado (Febrero 2026) - ✅ COMPLETADO
- [x] Reorganizar estructura del proyecto
  - Mover código frontend a `frontend/`
  - Backend en `backend/` con `__init__.py`
  - `pyproject.toml` y `uv.lock` en raíz
- [x] Dockerfile unificado (multi-stage: Bun + Python)
- [x] Backend sirve archivos estáticos de `frontend/dist`
- [x] `railway.json` para deploy unificado
- [x] Proxy en vite.config.js para `/api` y `/health`
- [x] Fix dark mode CSS (`@variant` en lugar de `@custom-variant` para Tailwind v4)

---

## Próximos Pasos (Prioridad Alta)

- [x] Deploy en Railway (configuración completada en `railway.toml`)
- [x] Meta tags SEO y Open Graph image
- [x] Mejorar manejo de errores (mensajes más descriptivos) - Toasts implementados
- [x] Añadir loading state durante parseo - Spinner implementado
- [ ] Probar con facturas reales de usuarios

### SEO Completado (ver `doc/SEO.md`)
- [x] Crear `public/robots.txt`
- [x] Crear `public/sitemap.xml`
- [x] Añadir Schema.org JSON-LD
- [x] Crear `public/manifest.json` (PWA)
- [x] Mejorar accesibilidad (ARIA labels, teclado, scope en tablas)

### Páginas Estáticas SEO (Febrero 2026)
- [x] Crear `public/faq.html` - Preguntas frecuentes (Schema: FAQPage)
- [x] Crear `public/guia-facturae.html` - Guía del formato (Schema: Article)
- [x] Crear `public/about.html` - Sobre FacturaView (Schema: AboutPage)
- [x] Actualizar sitemap.xml con las nuevas URLs

### Configuración Dominio (Enero 2026)
- [x] Cambiar canonical URL a `www.facturaview.es`
- [x] Solicitar reindexación en Google Search Console
- [x] **Redirección 301 `facturaview.es` → `www.facturaview.es`**
  - ✅ Configurado via servicio "microhosting" de Nominalia (gratuito)
  - ⚠️ **Nota:** Si cambias de registrador de dominio o el microhosting deja de ser gratuito, configurar la redirección en Railway como alternativa

---

## Bing Indexing Fix (Enero 2026)

El sitio fue descubierto por Bing el 20 Jan 2026 pero no ha sido rastreado.
Causa principal: contenido renderizado 100% con JavaScript (SPA).

### Paso 1: Añadir contenido estático de fallback
- [x] Añadir `<noscript>` con contenido HTML básico en index.html
- [x] Incluir H1, descripción y lista de funcionalidades
- [x] Esto da a Bingbot contenido visible sin ejecutar JS

### Paso 2: Verificación Bing Webmaster Tools
- [x] ~~Obtener código de verificación~~ (no necesario, importado desde Google Search Console)
- [x] ~~Añadir meta tag `msvalidate.01`~~ (no necesario)
- [x] Verificar propiedad del sitio (automático via GSC)

### Paso 3: Enviar sitemap manualmente
- [x] ~~Ir a Bing Webmaster Tools > Sitemaps~~ (ya importado desde GSC)
- [x] ~~Enviar sitemap~~ (enviado 20/01/2026)
- [x] Confirmar que se procesa correctamente (Status: Success, 1 URL discovered)

### Paso 4: Solicitar indexación
- [ ] Usar "Request indexing" en URL Inspection
- [ ] Opcional: usar API de URL Submission para indexación más rápida

### Paso 5: Backlinks (mejora autoridad)
- [ ] Registrar en directorios de herramientas para autónomos españoles
- [ ] Publicar en foros/comunidades relevantes (ej: foroautonomos.es)
- [ ] Considerar guest post en blogs de facturación/contabilidad

### Verificación final
- [ ] Esperar 1-2 semanas y revisar estado en Bing Webmaster Tools
- [ ] Verificar que la página aparece en búsqueda: `site:facturaview.es`

---

## Nice to Have (Fase 1)

- [ ] Validar firma digital (mostrar detalles del certificado) - Ver `plan-mejoras.md` Fase 2.2
- [x] Detectar y mostrar errores específicos en XML malformado - Completado febrero 2026
- [x] Modo oscuro - Completado febrero 2026
- [ ] Múltiples facturas en lote (Modality="L") - Ver `plan-mejoras.md` Fase 3.1
- [x] Copiar datos al portapapeles (botón copiar) - Completado febrero 2026
- [x] Historial local (localStorage) - Completado febrero 2026
- [x] Selector de idioma (ES/EN) - Completado febrero 2026

---

## Futuro (Fase 2+)

- [ ] Soporte UBL (formato europeo)
- [ ] Soporte VeriFactu (cuando se publique especificación)
- [ ] API para integraciones
- [ ] Comparar dos facturas
- [x] PWA completa (Service Worker + botón instalar) - Completado enero 2026

---

## Fixtures de Test Disponibles

| Archivo | Versión | Descripción |
|---------|---------|-------------|
| `simple-322.xml` | 3.2.2 | Factura básica empresa a empresa |
| `complex-322.xml` | 3.2.2 | 4 líneas, 3 tipos IVA (4%, 10%, 21%) |
| `simple-321.xml` | 3.2.1 | Suministros industriales |
| `simple-32.xml` | 3.2 | Factura legacy (floristería) |
| `with-retention.xml` | 3.2.2 | Autónomo con IRPF 15% |
| `rectificativa.xml` | 3.2.2 | Factura rectificativa (negativos) |