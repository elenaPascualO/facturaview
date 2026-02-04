# Plan de Mejoras SEO - FacturaView

> Fecha: 2026-02-04
> Estado: ✅ Completado

## Contexto

Con el SEO técnico al 100%, estas mejoras buscan **aumentar el tráfico orgánico** mediante contenido indexable adicional.

---

## Mejoras Propuestas (Ordenadas por Impacto/Esfuerzo)

### 1. Páginas Estáticas (/about, /faq, /guia)
**Impacto:** Alto | **Esfuerzo:** Bajo

Crear páginas HTML estáticas con contenido útil y palabras clave relevantes.

**Páginas sugeridas:**
- `/faq` - Preguntas frecuentes sobre Facturae, FACe, firmas digitales
- `/guia-facturae` - Guía completa sobre el formato Facturae
- `/about` - Sobre FacturaView, quién lo hace, por qué es gratis

**Beneficios:**
- Contenido indexable por Google (la app SPA actual depende de JavaScript)
- Captura long-tail keywords: "qué es facturae", "cómo abrir xml factura", etc.
- Mejora autoridad del dominio

**Implementación:**
- Crear archivos HTML estáticos en `frontend/public/`
- O usar rutas en Vite con contenido pre-renderizado

---

### 2. Blog/Artículos sobre Facturación Electrónica
**Impacto:** Alto | **Esfuerzo:** Medio-Alto

Crear contenido educativo que atraiga tráfico orgánico.

**Temas sugeridos:**
- "Cómo enviar facturas a FACe paso a paso"
- "Diferencias entre Facturae 3.2, 3.2.1 y 3.2.2"
- "Qué es la firma digital XAdES y por qué es obligatoria"
- "Herramientas gratuitas para facturación electrónica en España"

**Beneficios:**
- Alto potencial de tráfico orgánico
- Establece autoridad en el nicho
- Genera backlinks naturales

**Consideraciones:**
- Requiere mantenimiento continuo
- Podría necesitar un generador estático (Astro, 11ty) o CMS headless

---

### 3. SSR/Prerendering para la App Principal
**Impacto:** Medio | **Esfuerzo:** Alto

Hacer que el contenido de la SPA sea crawleable sin JavaScript.

**Opciones:**
- `vite-plugin-ssr` o `vike` para SSR
- Prerendering estático de la página principal
- Mantener el contenido `<noscript>` actual (ya existe, es suficiente para SEO básico)

**Estado actual:**
El `<noscript>` en `index.html` ya proporciona contenido para bots. Esta mejora tiene menor prioridad dado que la funcionalidad principal requiere JavaScript.

---

### 4. Hreflang para Internacionalización
**Impacto:** Bajo (mercado español) | **Esfuerzo:** Medio

Preparar la app para versiones en otros idiomas.

**Consideraciones:**
- El mercado objetivo es España (Facturae es formato español)
- Podría ser útil para Latinoamérica en el futuro
- Requiere traducir toda la interfaz

**Recomendación:** Posponer hasta que haya demanda real de otros mercados.

---

## Recomendación

**Empezar por las páginas estáticas (opción 1):**

1. Es la mejora con mejor ratio impacto/esfuerzo
2. No requiere cambios en la arquitectura
3. Resultados medibles en semanas
4. Prepara el terreno para un blog futuro

**Propuesta de implementación mínima:**

```
frontend/public/
├── faq.html          # Preguntas frecuentes
├── guia-facturae.html # Guía del formato
└── about.html        # Sobre nosotros
```

Cada página debe:
- Tener meta tags propios (title, description, canonical)
- Enlazar a la app principal
- Incluir Schema.org apropiado (FAQPage, Article)
- Mantener el mismo estilo visual (Tailwind CSS inline o link)

---

## Plan de Implementación: Páginas Estáticas

### Páginas a Crear

#### 1. `/faq` - Preguntas Frecuentes
**Keywords objetivo:** "facturae preguntas", "cómo abrir xml factura", "qué es face"

Contenido sugerido:
- ¿Qué es una factura electrónica Facturae?
- ¿Qué versiones de Facturae existen?
- ¿Es obligatorio usar Facturae?
- ¿Qué es FACe?
- ¿Cómo abro un archivo XML de factura?
- ¿Qué es la firma digital XAdES?
- ¿Es seguro subir mi factura a FacturaView?
- ¿FacturaView valida la firma oficialmente?

Schema.org: `FAQPage`

#### 2. `/guia-facturae` - Guía del Formato
**Keywords objetivo:** "formato facturae", "estructura xml factura", "facturae 3.2.2"

Contenido sugerido:
- Introducción al formato Facturae
- Historia y versiones (3.2, 3.2.1, 3.2.2)
- Estructura del XML
- Campos obligatorios vs opcionales
- Tipos de factura (completa, simplificada, rectificativa)
- Firma digital: tipos y requisitos
- Envío a FACe

Schema.org: `Article` o `TechArticle`

#### 3. `/about` - Sobre FacturaView
**Keywords objetivo:** "visualizador facturae gratis", "herramienta factura electronica"

Contenido sugerido:
- ¿Qué es FacturaView?
- ¿Por qué es gratis?
- Privacidad: procesamiento local
- Funcionalidades principales
- Limitaciones (validación técnica vs oficial)
- Contacto

Schema.org: `AboutPage`

---

### Archivos a Crear

```
frontend/public/
├── faq.html
├── guia-facturae.html
└── about.html
```

### Requisitos Técnicos

Cada página debe incluir:
- [x] Meta tags: title, description, canonical único
- [x] Open Graph y Twitter Card
- [x] Schema.org JSON-LD apropiado
- [x] Link a la app principal (/)
- [x] Navegación consistente (header/footer)
- [x] Estilos Tailwind (inline o CDN)
- [x] Google Analytics/Umami

### Actualizar sitemap.xml

Añadir las nuevas URLs:
```xml
<url>
  <loc>https://www.facturaview.es/faq</loc>
  <lastmod>2026-02-04</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
<!-- ... -->
```

---

## Verificación

1. [x] Validar HTML con W3C Validator
2. [x] Validar Schema.org con validator.schema.org
3. [x] Probar meta tags con Facebook/Twitter debuggers
4. [x] Verificar que las páginas cargan sin JavaScript
5. [x] Comprobar enlaces internos funcionan
6. [x] Lighthouse SEO score > 90
7. [ ] Enviar sitemap actualizado a Google Search Console
