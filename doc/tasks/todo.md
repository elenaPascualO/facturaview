# FacturaView - Plan de Tareas

> Última actualización: 2026-02-10

## Fase actual: DISTRIBUCIÓN Y TRACCIÓN

El MVP está completo (242 tests, 7 fases de desarrollo terminadas). No se debe escribir código nuevo hasta tener señales reales de usuarios. El foco es 100% distribución, contenido SEO y medición.

---

## Sprint 1: Distribución Inmediata (Semana del 10 feb 2026)

Objetivo: poner FacturaView delante de usuarios potenciales lo antes posible.

### Directorios de software
- [ ] **AlternativeTo** — Registrar como alternativa a: Facturae (app gobierno), Firma-e Visualizador, B2Brouter, Visor VISDOC de la IGAE
  - Destacar: gratis, sin registro, sin Java, online, privado
- [ ] **Product Hunt** — Preparar lanzamiento (título, tagline, descripción, capturas)
  - Tagline sugerida: "View and export Spanish e-invoices (Facturae XML) — no Java, no signup, 100% private"
  - Programar para un martes o miércoles (mejores días)

### Comunidades tech
- [ ] **Hacker News** — Post "Show HN: FacturaView — View Spanish e-invoices without Java or signup"
  - Incluir contexto: en España las facturas electrónicas son XML, el visor oficial requiere Java
- [ ] **Reddit r/SideProject** — Post breve mostrando el proyecto
- [ ] **Reddit r/spain o r/es** — Post en español explicando la herramienta
- [ ] **Indie Hackers** — Publicar en comunidad como proyecto side

### Comunidades de autónomos (España)
- [ ] **Foro de Infoautónomos** — Post genuino: "He creado una herramienta gratuita para abrir facturas Facturae sin instalar Java"
- [ ] **Grupos de Facebook** — Buscar 2-3 grupos de autónomos españoles y compartir
- [ ] **LinkedIn** — Post personal + compartir en grupos de facturación electrónica / autónomos España
- [ ] **Forocoches/Burbuja** (subforo autónomos) — Si existe subforo relevante

### Directorios secundarios
- [ ] Peerlist
- [ ] DevHunt
- [ ] BetaList

---

## Sprint 2: Contenido SEO (Semanas del 17-24 feb 2026)

Objetivo: capturar tráfico orgánico de búsquedas de cola larga que hacen los autónomos.

### Artículos blog (páginas HTML estáticas en `/blog/`)

Cada artículo debe tener:
- Schema.org tipo `Article`
- Meta tags OG y Twitter Card
- Enlaces internos a la app y entre artículos
- Actualizar `sitemap.xml` con cada URL nueva

#### Artículo 1: "Cómo abrir un archivo XML de factura electrónica sin instalar nada"
- [ ] Escribir contenido (enfoque práctico, paso a paso)
- [ ] Keywords: "abrir xml factura electronica", "leer factura xml online"
- [ ] Incluir capturas de pantalla de FacturaView

#### Artículo 2: "Qué es el formato Facturae y por qué lo usa la administración pública"
- [ ] Escribir contenido (explicativo, contexto legal)
- [ ] Keywords: "formato facturae", "facturae que es", "factura electronica administracion publica"
- [ ] Enlazar a guía oficial y a la app

#### Artículo 3: "Facturae vs VeriFActu: qué cambia en 2027 para autónomos y pymes"
- [ ] Escribir contenido (informativo, actualidad)
- [ ] Keywords: "verifactu autonomos", "factura electronica obligatoria 2027"
- [ ] Fechas confirmadas: 1 ene 2027 empresas, 1 jul 2027 autónomos
- [ ] Este artículo se posiciona con antelación para capturar búsquedas futuras

#### Artículo 4: "Convertir factura Facturae XML a PDF gratis"
- [ ] Escribir contenido (tutorial directo)
- [ ] Keywords: "facturae a pdf", "convertir xml factura a pdf", "facturae pdf gratis"
- [ ] CTA claro hacia la app

### Infraestructura blog
- [ ] Crear directorio `frontend/public/blog/` con páginas HTML estáticas
- [ ] Crear plantilla HTML base (header, footer, navegación, Schema.org)
- [ ] Actualizar `sitemap.xml` con URLs del blog
- [ ] Enlazar blog desde la app (footer o navegación)

---

## Sprint 3: Medición y Decisiones (Marzo 2026)

Objetivo: analizar datos y decidir siguientes pasos basándose en evidencia.

### Métricas a revisar (4-6 semanas después de distribución)
- [ ] **Google Search Console** — Impresiones, clics, keywords que generan tráfico
- [ ] **Bing Webmaster Tools** — Estado de indexación, crawling
- [ ] **Umami** — Eventos `file-uploaded`, `export-pdf`, `export-excel`, `contact-sent`
- [ ] **Umami** — Visitantes únicos, páginas vistas, fuentes de tráfico
- [ ] **Formspree** — Mensajes recibidos (feedback directo de usuarios)

### Decisiones pendientes de datos
- [ ] Decidir si crear más contenido SEO (si hay señales de tráfico orgánico)
- [ ] Decidir si añadir funcionalidad (si hay feedback de usuarios pidiendo algo concreto)
- [ ] Evaluar si los directorios/comunidades generaron tráfico significativo
- [ ] Decidir estrategia VeriFactu (si hay interés en el artículo)

---

## Parking Lot (NO hacer hasta tener tracción)

Estas tareas están aparcadas intencionalmente. Solo se activan si hay demanda real.

### Producto
- [ ] Soporte UBL (formato europeo) — No hay demanda hasta que la UE lo fuerce
- [ ] Soporte VeriFactu — Esperar a que se acerque julio 2027 y haya especificación final
- [ ] EU DSS / validación eIDAS — Solo si usuarios piden validación oficial
- [ ] API para integraciones — Solo si hay demanda B2B
- [ ] Comparar dos facturas — Nice to have, no prioritario
- [ ] SSR/prerendering — Solo si SEO orgánico no funciona con el setup actual

### Monetización (no antes de tener usuarios recurrentes)
- [ ] Donaciones / "Invítame a un café"
- [ ] Límite de facturas/día para no registrados
- [ ] Plan Pro: lotes, API, sin límites

---

## Historial completado

### MVP (Fase 0) - ✅ Enero 2026
- Parser Facturae (3.2, 3.2.1, 3.2.2), UI completa, exportación PDF/Excel
- Drag & drop, responsive, formulario contacto, 223 tests
- Seguridad (XSS, CSP, sanitización), Umami, PWA

### Mejoras UX (Fase 1) - ✅ Febrero 2026
- Loading states, toasts, copiar portapapeles, errores amigables, modo oscuro

### Backend + Firma Digital (Fase 2) - ✅ Febrero 2026
- Python/FastAPI, validación XAdES, Dockerfile unificado, Railway

### Historial Local (Fase 3) - ✅ Febrero 2026
- localStorage (50 facturas, 2 MB), preferencias de guardado

### Facturas en Lote (Fase 4) - ✅ Febrero 2026
- Modality="L", múltiples archivos XML, exportación ZIP

### Internacionalización (Fase 5) - ✅ Febrero 2026
- Español/Inglés, detección automática, cambio dinámico

### SEO (Fase 6) - ✅ Febrero 2026
- robots.txt, sitemap.xml, Schema.org, páginas estáticas, noscript, dominio

### Excel Profesional (Fase 7) - ✅ Febrero 2026
- Backend openpyxl, diseño profesional, fallback SheetJS
