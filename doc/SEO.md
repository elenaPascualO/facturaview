# Plan de Acción SEO - FacturaView

> Fecha de auditoría: 2025-01-20
> Última actualización: 2026-02-10

## Estado Actual: 100% de madurez SEO ✅

---

## Resumen de lo Implementado

### SEO Técnico ✅
- Meta tags completos (title, description, OG, Twitter Card)
- Imagen OG correcta (1200x630px)
- Keywords relevantes para el nicho español
- robots.txt y sitemap.xml
- Schema.org (WebApplication, FAQPage, Article, AboutPage)
- manifest.json para PWA
- Accesibilidad (ARIA, scope, teclado)
- Headers de seguridad (CSP, X-Content-Type-Options, X-Frame-Options)
- Contenido noscript para bots

### Configuración de Dominio ✅
- Canonical URL: `https://www.facturaview.es/`
- Redirección 301: `facturaview.es` → `www.facturaview.es`
- DNS: `www.facturaview.es` CNAME → Railway

### Páginas Estáticas SEO (Febrero 2026) ✅

| Página | Descripción | Schema.org | Keywords |
|--------|-------------|------------|----------|
| `/faq.html` | Preguntas frecuentes | FAQPage | "facturae preguntas", "cómo abrir xml factura" |
| `/guia-facturae.html` | Guía del formato | TechArticle | "formato facturae", "facturae 3.2.2" |
| `/about.html` | Sobre FacturaView | AboutPage | "visualizador facturae gratis" |

---

## Plan de Distribución (Febrero 2026) — PRIORIDAD MÁXIMA

> El SEO técnico está completo. El cuello de botella es la distribución: poner FacturaView delante de usuarios reales. Ver `doc/tasks/todo.md` para el plan de tareas detallado.

### Estrategia

1. **Directorios de software** — Backlinks de calidad + tráfico directo
2. **Comunidades de autónomos** — Usuarios objetivo directos
3. **Comunidades tech** — Visibilidad general + backlinks
4. **Contenido SEO (blog)** — Tráfico orgánico de cola larga

### Directorios de software

| Plataforma | URL | Tipo | Prioridad | Estado |
|------------|-----|------|-----------|--------|
| AlternativeTo | https://alternativeto.net | Alternativas a software | Alta | [ ] Pendiente |
| Product Hunt | https://producthunt.com | Lanzamiento de productos | Alta | [ ] Pendiente |
| Hacker News | https://news.ycombinator.com | Show HN | Alta | [ ] Pendiente |
| Peerlist | https://peerlist.io | Lanzamientos semanales | Media | [ ] Pendiente |
| DevHunt | https://devhunt.org | Herramientas para devs | Media | [ ] Pendiente |
| Indie Hackers | https://indiehackers.com | Comunidad makers | Media | [ ] Pendiente |
| BetaList | https://betalist.com | Productos nuevos | Baja | [ ] Pendiente |
| SaaSworthy | https://saasworthy.com | Reviews SaaS | Baja | [ ] Pendiente |

**Competidores a referenciar en AlternativeTo:**
- Facturae (app oficial del gobierno — requiere Java)
- Firma-e Visualizador (https://plataforma.firma-e.com/VisualizadorFacturae/)
- B2Brouter (https://www.b2brouter.net/es/facturae/)
- Visor VISDOC de la IGAE

**Mensaje clave para AlternativeTo:** "Free, online, no-install viewer for Spanish Facturae e-invoices. No Java required. 100% private — files never leave your browser."

### Comunidades de autónomos españoles

| Canal | Enfoque | Estado |
|-------|---------|--------|
| Foro de Infoautónomos | Post genuino compartiendo herramienta gratuita | [ ] Pendiente |
| Grupos Facebook autónomos | Buscar 2-3 grupos activos y compartir | [ ] Pendiente |
| LinkedIn (post personal) | Post explicando el problema y la solución | [ ] Pendiente |
| LinkedIn (grupos) | Grupos de facturación electrónica / autónomos España | [ ] Pendiente |

**Tono:** No vender. Compartir de forma genuina: "He creado esta herramienta gratuita para abrir facturas Facturae sin instalar Java ni software de pago."

### Comunidades tech

| Canal | Formato | Estado |
|-------|---------|--------|
| Reddit r/SideProject | Post breve mostrando el proyecto | [ ] Pendiente |
| Reddit r/spain o r/es | Post en español explicando la herramienta | [ ] Pendiente |
| Hacker News | "Show HN: FacturaView — View Spanish e-invoices without Java or signup" | [ ] Pendiente |

---

## Blog de Contenido SEO

**Impacto:** Alto | **Esfuerzo:** Medio
**Formato:** Páginas HTML estáticas en `frontend/public/blog/` (sin CMS ni framework adicional)

### Artículos planificados

| # | Título | Keywords objetivo | Prioridad |
|---|--------|-------------------|-----------|
| 1 | "Cómo abrir un archivo XML de factura electrónica sin instalar nada" | "abrir xml factura electronica", "leer factura xml online" | Alta |
| 2 | "Qué es el formato Facturae y por qué lo usa la administración pública" | "formato facturae", "facturae que es" | Alta |
| 3 | "Facturae vs VeriFActu: qué cambia en 2027 para autónomos y pymes" | "verifactu autonomos", "factura electronica obligatoria 2027" | Alta |
| 4 | "Convertir factura Facturae XML a PDF gratis" | "facturae a pdf", "convertir xml factura a pdf" | Alta |

### Requisitos por artículo
- Schema.org tipo `Article` con `datePublished` y `dateModified`
- Meta tags OG y Twitter Card
- Enlaces internos a la app y entre artículos
- CTA claro hacia FacturaView
- Actualizar `sitemap.xml` con cada URL nueva

### Contexto VeriFActu (para artículo 3)
- **Empresas (Impuesto de Sociedades):** obligatorio desde 1 de enero de 2027
- **Autónomos y personas físicas:** obligatorio desde 1 de julio de 2027
- Fechas retrasadas por Hacienda en diciembre de 2025 (originalmente iban a ser 2026)
- Publicar este artículo con antelación para posicionarse antes de que aumente la demanda de búsquedas

---

## Mejoras Futuras (No prioritarias)

### Otras mejoras SEO
- **SSR/Prerendering:** Considerar solo si el tráfico orgánico no funciona con el setup actual
- **Hreflang:** Bajo impacto, mercado principalmente español

---

## Validación de Firma Digital - Keywords

| Keyword | Volumen | Dificultad |
|---------|---------|------------|
| "validar firma facturae" | Bajo | Baja |
| "verificar firma digital factura" | Bajo | Baja |
| "comprobar firma xades" | Muy bajo | Muy baja |
| "facturae firma electronica" | Bajo | Baja |

---

## Verificación

### Herramientas de validación
- **Schema.org:** https://validator.schema.org/
- **OG tags:** https://developers.facebook.com/tools/debug/
- **Twitter Card:** https://cards-dev.twitter.com/validator
- **Lighthouse:** Chrome DevTools > Lighthouse (objetivo: 90+ SEO)

### Completado
- [x] Enviar sitemap actualizado a Google Search Console (con las 4 URLs)
- [x] Enviar sitemap actualizado a Bing Webmaster Tools
