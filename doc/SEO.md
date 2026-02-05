# Plan de Acción SEO - FacturaView

> Fecha de auditoría: 2025-01-20
> Última actualización: 2026-02-04

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

## Distribución en Directorios y Plataformas

Registrar FacturaView en directorios de software para generar backlinks de calidad y tráfico directo.

### Prioridad Alta (Gratis, alto impacto)

| Plataforma | URL | Tipo | Estado |
|------------|-----|------|--------|
| AlternativeTo | https://alternativeto.net | Alternativas a software | [ ] Pendiente |
| Product Hunt | https://producthunt.com | Lanzamiento de productos | [ ] Pendiente |
| Hacker News | https://news.ycombinator.com | Show HN | [ ] Pendiente |

**Competidores a referenciar en AlternativeTo:**
- Facturae (app oficial del gobierno)
- Firma-e Visualizador (https://plataforma.firma-e.com/VisualizadorFacturae/)
- B2Brouter (https://www.b2brouter.net/es/facturae/)
- Visor VISDOC de la IGAE

### Prioridad Media

| Plataforma | URL | Tipo | Estado |
|------------|-----|------|--------|
| Peerlist | https://peerlist.io | Lanzamientos semanales | [ ] Pendiente |
| DevHunt | https://devhunt.org | Herramientas para devs | [ ] Pendiente |
| Indie Hackers | https://indiehackers.com | Comunidad makers | [ ] Pendiente |

### Prioridad Baja

| Plataforma | URL | Tipo | Estado |
|------------|-----|------|--------|
| BetaList | https://betalist.com | Productos nuevos | [ ] Pendiente |
| SaaSworthy | https://saasworthy.com | Reviews SaaS | [ ] Pendiente |
| Reddit r/SideProject | https://reddit.com/r/SideProject | Comunidad | [ ] Pendiente |

### Foros españoles de autónomos
- Foro de Infoautónomos
- Comunidades de Facebook de autónomos españoles
- Grupos de LinkedIn de facturación electrónica

---

## Mejoras Futuras (No prioritarias)

### Blog de Facturación Electrónica
**Impacto:** Alto | **Esfuerzo:** Medio-Alto

Crear contenido educativo que atraiga tráfico orgánico.

**Temas sugeridos:**
- "Cómo enviar facturas a FACe paso a paso"
- "Diferencias entre Facturae 3.2, 3.2.1 y 3.2.2"
- "Qué es la firma digital XAdES y por qué es obligatoria"
- "Herramientas gratuitas para facturación electrónica en España"

**Consideraciones:**
- Requiere mantenimiento continuo
- Podría necesitar un generador estático (Astro, 11ty) o CMS headless

### Otras mejoras
- **Validación oficial:** Integrar con VALIDe API o trust store de CAs españolas
- **SSR/Prerendering:** Considerar vite-plugin-ssr para mejor crawlabilidad
- **Hreflang:** Preparar para versiones en otros idiomas (bajo impacto, mercado español)

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
