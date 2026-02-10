# FacturaView — Roadmap

> Visualizador de facturas electrónicas Facturae (XML) con validación de firmas digitales.
> Stack: Bun + Vite + Vanilla JS (frontend) / Python + FastAPI (backend)

---

## Estado Actual

- **242 tests** pasando (223 frontend + 19 backend)
- Desplegado en Railway (`www.facturaview.es`)
- SEO 100% implementado (Schema.org, robots.txt, sitemap.xml, páginas estáticas)
- PWA instalable con Service Worker

---

## Fase 0 — MVP Core ✅ COMPLETADA

- Parser Facturae (versiones 3.2, 3.2.1, 3.2.2)
- Visualización completa (emisor, receptor, líneas, impuestos, totales, pago)
- Exportación a PDF (jsPDF)
- Exportación a Excel (SheetJS)
- Dropzone con drag & drop
- Diseño responsive
- Formulario de contacto (Formspree)
- Auditoría de seguridad (XSS, inyección Excel, CSP headers)
- Analítica de eventos (Umami)
- PWA con Service Worker

---

## Fase 1 — Mejoras UX ✅ COMPLETADA

- Loading states (spinner durante procesamiento)
- Toasts estilizados (reemplazo de `alert()`)
- Copiar al portapapeles (NIF, IBAN, total)
- Mensajes de error amigables
- Modo oscuro con persistencia

---

## Fase 2 — Backend + Firma Digital ✅ COMPLETADA

- Backend Python/FastAPI con `uv`
- Validación de firmas XAdES (signxml + cryptography)
- Endpoint `POST /api/validate-signature`
- UI de estado de firma (válida/inválida/verificando)
- Datos del firmante y certificado
- Dockerfile unificado (multi-stage: Bun + Python)
- Deploy en Railway

---

## Fase 3 — Historial Local ✅ COMPLETADA

- Guardar facturas en localStorage (máx 50, 2 MB)
- Preferencias de guardado (preguntar/siempre/nunca)
- Sección de facturas recientes en Dropzone

---

## Fase 4 — Facturas en Lote ✅ COMPLETADA

- Soporte `Modality="L"` (lotes Facturae)
- Múltiples archivos XML simultáneos
- Navegación entre facturas (dropdown + botones)
- Exportación de lote a ZIP con PDFs individuales

---

## Fase 5 — Internacionalización ✅ COMPLETADA

- Español e Inglés con cambio dinámico
- Detección automática del idioma del navegador
- Persistencia en localStorage
- Páginas estáticas traducidas (FAQ, guía, about)

---

## Fase 6 — SEO ✅ COMPLETADA

- robots.txt y sitemap.xml
- Schema.org JSON-LD (WebApplication, FAQPage, Article, AboutPage)
- Páginas estáticas SEO (FAQ, guía Facturae, about)
- Meta tags Open Graph y Twitter Card
- Contenido `<noscript>` para Bingbot
- Headers de seguridad (CSP, X-Frame-Options, Referrer-Policy)

---

## Fase 7 — Exportación Excel Profesional ✅ COMPLETADA

- Endpoint `POST /api/export/excel` (openpyxl)
- 1 hoja con secciones diferenciadas visualmente
- Headers con fondo de color, bordes, formato moneda
- Auto-ajuste de ancho de columnas
- Text wrap en descripciones y direcciones
- Soporte ES/EN
- Fallback a SheetJS si backend no disponible

---

## Próximos Pasos

### Testing con usuarios reales
- [ ] Probar con facturas reales de autónomos y pymes
- [ ] Recoger feedback sobre usabilidad

### Backlinks y difusión
- [ ] Registrar en directorios de herramientas para autónomos
- [ ] Publicar en foros/comunidades relevantes

---

## Futuro

### Validación EU DSS (Digital Signature Services)
- Integración con estándar europeo para validación eIDAS completa
- Soporte XAdES-T, XAdES-XL, XAdES-A
- Informes de validación ETSI
- Validación contra EU Trust List

### Nuevos formatos
- [ ] Soporte UBL (formato europeo)
- [ ] Soporte VeriFactu (cuando se publique especificación)

### Mejoras generales
- [ ] API para integraciones
- [ ] Comparar dos facturas
- [ ] Blog con contenido SEO
- [ ] SSR/prerendering para mejorar indexación