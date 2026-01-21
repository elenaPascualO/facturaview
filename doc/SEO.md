# Plan de Acción SEO - FacturaView

> Fecha de auditoría: 2025-01-20
> Última actualización: 2026-01-20

## Estado Actual: 95% de madurez SEO ✅

### Lo que está bien
- Meta tags completos en `index.html` (title, description, OG, Twitter Card)
- Imagen OG correcta (1200x630px) en `public/og-image.png`
- Keywords relevantes para el nicho español
- Analytics privacy-first (Umami)
- Estructura semántica básica (headings jerárquicos)
- Headers de seguridad (CSP, X-Content-Type-Options, X-Frame-Options)
- ✅ robots.txt con referencia al sitemap
- ✅ sitemap.xml para indexación
- ✅ Datos estructurados Schema.org (WebApplication)
- ✅ manifest.json para PWA
- ✅ Accesibilidad mejorada (ARIA, scope, teclado)
- ✅ Preconnect para Umami

### Problemas Detectados (Resueltos)
| Problema | Prioridad | Estado |
|----------|-----------|--------|
| Sin robots.txt | P0 | ✅ Resuelto |
| Sin sitemap.xml | P0 | ✅ Resuelto |
| Sin datos estructurados (schema.org) | P1 | ✅ Resuelto |
| Sin manifest.json | P1 | ✅ Resuelto |
| Accesibilidad deficiente (sin ARIA) | P2 | ✅ Resuelto |
| Sin preconnect a recursos externos | P3 | ✅ Resuelto |

---

## Tareas Completadas

### P0 - Crítico

#### [x] Crear `public/robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://www.facturaview.es/sitemap.xml
```

#### [x] Crear `public/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.facturaview.es/</loc>
    <lastmod>2025-01-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

### P1 - Alto

#### [x] Añadir Schema.org JSON-LD en `index.html`
Insertar antes del cierre de `</head>`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "FacturaView",
  "description": "Visualizador de facturas electrónicas Facturae (XML) online y gratuito",
  "url": "https://www.facturaview.es",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "featureList": [
    "Visualizar facturas Facturae XML",
    "Exportar a PDF",
    "Exportar a Excel",
    "100% privado - procesamiento local"
  ]
}
</script>
```

#### [x] Crear `public/manifest.json`
```json
{
  "name": "FacturaView",
  "short_name": "FacturaView",
  "description": "Visualiza facturas Facturae online gratis",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

#### [x] Añadir link al manifest en `index.html`
Insertar en `<head>`:
```html
<link rel="manifest" href="/manifest.json">
```

---

### P2 - Medio (Accesibilidad)

#### [x] Mejorar `src/components/Dropzone.js`
Cambiar el div del dropzone:
```html
<!-- Antes -->
<div id="dropzone" class="...">

<!-- Después -->
<div
  id="dropzone"
  role="button"
  tabindex="0"
  aria-label="Área de subida de archivos: arrastra tu factura XML aquí o haz clic para seleccionar"
  class="..."
>
```

#### [x] Mejorar `src/components/InvoiceView.js`
- Envolver el contenido en `<main role="main">`
- Añadir `aria-label` a botones:
```html
<button aria-label="Descargar factura en formato PDF">PDF</button>
<button aria-label="Descargar factura en formato Excel">Excel</button>
<button aria-label="Cargar otra factura">Nueva factura</button>
```

#### [x] Mejorar `src/components/LinesTable.js`
Añadir `scope` a los headers de tabla:
```html
<th scope="col">Descripción</th>
<th scope="col">Cantidad</th>
<th scope="col">Precio</th>
<!-- etc -->
```

---

### P3 - Bajo

#### [x] Añadir preconnect en `index.html`
Insertar al inicio del `<head>`:
```html
<!-- Preconnect para performance -->
<link rel="preconnect" href="https://cloud.umami.is">
<link rel="dns-prefetch" href="https://cloud.umami.is">
```

---

## Verificación Post-Implementación

1. **Build test:**
   ```bash
   bun run build
   # Verificar que dist/index.html contiene todos los meta tags
   ```

2. **Validar archivos estáticos:**
   ```bash
   bun run dev
   # Acceder a http://localhost:5173/robots.txt
   # Acceder a http://localhost:5173/sitemap.xml
   # Acceder a http://localhost:5173/manifest.json
   ```

3. **Validar Schema.org:**
   - Ir a https://validator.schema.org/
   - Pegar el HTML de la página

4. **Validar manifest (PWA):**
   - Chrome DevTools > Application > Manifest
   - Debe mostrar los datos sin errores

5. **Test de accesibilidad:**
   - Navegar con Tab por toda la página
   - Verificar que hay focus visible en todos los elementos interactivos
   - Probar con lector de pantalla (VoiceOver en Mac: Cmd+F5)

6. **Lighthouse audit:**
   - Chrome DevTools > Lighthouse
   - Ejecutar auditoría de SEO + Accessibility
   - Objetivo: 90+ en ambas categorías

7. **Validar OG tags:**
   - https://developers.facebook.com/tools/debug/
   - https://cards-dev.twitter.com/validator
   - Pegar URL de producción

---

## Archivos a Crear/Modificar

| Archivo | Acción | Prioridad |
|---------|--------|-----------|
| `public/robots.txt` | Crear | P0 |
| `public/sitemap.xml` | Crear | P0 |
| `index.html` | Editar | P1 |
| `public/manifest.json` | Crear | P1 |
| `src/components/Dropzone.js` | Editar | P2 |
| `src/components/InvoiceView.js` | Editar | P2 |
| `src/components/LinesTable.js` | Editar | P2 |

---

## Mejoras Futuras (No prioritarias)

- **SSR/Prerendering:** Considerar vite-plugin-ssr o similar para mejor crawlabilidad
- **Múltiples páginas:** Añadir /about, /faq con contenido indexable
- **Hreflang:** Preparar para versiones en otros idiomas
- **Blog:** Crear contenido sobre facturación electrónica para atraer tráfico orgánico
- **PWA completa:** Service worker para funcionamiento offline