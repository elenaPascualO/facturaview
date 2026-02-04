# FacturaView — Visualizador de Facturae

## Resumen Ejecutivo

**Problema:** Los autónomos y pymes españoles reciben facturas electrónicas en formato XML (Facturae) que no pueden leer sin instalar software obsoleto del gobierno (requiere Java).

**Solución:** Web app moderna que permite visualizar, entender y exportar facturas Facturae sin instalación, con validación opcional de firmas digitales.

**Ventaja competitiva:** 100% online, sin Java, sin registro, móvil-friendly, modo oscuro, validación de firma XAdES.

---

## Viabilidad Técnica

### ¿Se puede hacer sin backend?

**Mayormente sí, 100% frontend.** Razones:

| Funcionalidad | Solución |
|---------------|----------|
| Parsear XML | `DOMParser` nativo de JS (frontend) |
| Mostrar datos | Vanilla JS (frontend) |
| Generar PDF | `jsPDF` (frontend) |
| Generar Excel | `SheetJS (xlsx)` (frontend) |
| Validar estructura | Comparar contra esquema XSD en JS (frontend) |
| **Validar firma digital** | Backend Python (signxml + cryptography) |

**El parseo y visualización son 100% locales.** Para validación de firmas XAdES, se usa un backend opcional que no almacena datos.

### Stack técnico

```
# Frontend
Runtime:  Bun (más rápido que npm/node)
Build:    Vite 7.x
Frontend: Vanilla JS (ES Modules)
Styling:  Tailwind CSS v4 (con modo oscuro)
PDF:      jsPDF (generación directa, sin html2canvas)
Excel:    SheetJS (xlsx)
Testing:  Vitest + jsdom (125 tests)
Deploy:   Railway

# Backend (validación de firmas)
Runtime:  Python 3.11+
Framework: FastAPI
Packages: uv
Crypto:   signxml + cryptography + lxml
Testing:  pytest + httpx (8 tests)
Deploy:   Railway (Dockerfile)
```

**Tiempo estimado MVP:** 1-2 semanas

---

## Formato Facturae — Lo que necesitas saber

### Versiones soportadas (por orden de uso)

| Versión | Estado | Prioridad |
|---------|--------|-----------|
| 3.2.2 | Actual (obligatoria FACe) | P0 |
| 3.2.1 | Común | P0 |
| 3.2 | Legacy pero usada | P1 |

### Estructura básica del XML

```xml
<fe:Facturae xmlns:fe="http://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2">
  <FileHeader>
    <SchemaVersion>3.2.2</SchemaVersion>
    <Modality>I</Modality>  <!-- I=Individual, L=Lote -->
    <InvoiceIssuerType>EM</InvoiceIssuerType>  <!-- EM=Emisor, RE=Receptor, TE=Tercero -->
    <Batch>
      <BatchIdentifier>...</BatchIdentifier>
      <InvoicesCount>1</InvoicesCount>
      <TotalInvoicesAmount><TotalAmount>121.00</TotalAmount></TotalInvoicesAmount>
      <TotalOutstandingAmount><TotalAmount>121.00</TotalAmount></TotalOutstandingAmount>
      <TotalExecutableAmount><TotalAmount>121.00</TotalAmount></TotalExecutableAmount>
      <InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
    </Batch>
  </FileHeader>
  
  <Parties>
    <SellerParty><!-- Emisor de la factura --></SellerParty>
    <BuyerParty><!-- Receptor de la factura --></BuyerParty>
  </Parties>
  
  <Invoices>
    <Invoice>
      <InvoiceHeader>...</InvoiceHeader>
      <InvoiceIssueData>...</InvoiceIssueData>
      <TaxesOutputs>...</TaxesOutputs>  <!-- IVA repercutido -->
      <TaxesWithheld>...</TaxesWithheld>  <!-- Retenciones -->
      <InvoiceTotals>...</InvoiceTotals>
      <Items>
        <InvoiceLine>...</InvoiceLine>
      </Items>
      <PaymentDetails>...</PaymentDetails>
    </Invoice>
  </Invoices>
  
  <ds:Signature><!-- Firma digital XAdES --></ds:Signature>
</fe:Facturae>
```

### Campos clave a extraer y mostrar

#### Datos del Emisor (SellerParty)
```
- TaxIdentification.PersonTypeCode (F=Física, J=Jurídica)
- TaxIdentification.ResidenceTypeCode (R=Residente, E=Extranjero, U=UE)
- TaxIdentification.TaxIdentificationNumber (NIF/CIF)
- LegalEntity.CorporateName (Razón social) 
- Individual.Name + FirstSurname + SecondSurname (Si persona física)
- Address (Dirección completa)
```

#### Datos del Receptor (BuyerParty)
```
- Mismos campos que emisor
```

#### Datos de la Factura
```
- InvoiceNumber (Número de factura)
- InvoiceSeriesCode (Serie)
- InvoiceDocumentType (FC=Completa, FA=Simplificada, AF=Autofactura)
- InvoiceClass (OO=Original, OR=Rectificativa, CO=Copia)
- IssueDate (Fecha emisión)
- OperationDate (Fecha operación, si difiere)
```

#### Líneas de detalle (Items/InvoiceLine)
```
- ItemDescription (Descripción)
- Quantity (Cantidad)
- UnitOfMeasure (Unidad)
- UnitPriceWithoutTax (Precio unitario sin IVA)
- TotalCost (Coste total línea)
- GrossAmount (Importe bruto)
- TaxesOutputs (IVA de la línea)
```

#### Totales
```
- TotalGrossAmount (Base imponible total)
- TotalTaxOutputs (Total IVA)
- TotalTaxesWithheld (Total retenciones)
- InvoiceTotal (Total factura)
- TotalOutstandingAmount (Pendiente de pago)
- TotalExecutableAmount (Total a pagar)
```

#### Información de pago (PaymentDetails)
```
- PaymentMeans (01=Efectivo, 02=Cheque, 04=Transferencia, etc.)
- PaymentDueDate (Fecha vencimiento)
- IBAN
- BIC
```

---

## Funcionalidades MVP (Fase 0) - ✅ COMPLETADO

### Must Have

- [x] **Subir archivo XML** (drag & drop + selector)
- [x] **Detectar versión** Facturae (3.2, 3.2.1, 3.2.2)
- [x] **Mostrar datos en formato legible:**
  - Emisor (nombre, NIF, dirección)
  - Receptor (nombre, NIF, dirección)
  - Número y fecha de factura
  - Líneas de detalle (tabla)
  - Desglose de IVA (múltiples tipos)
  - Retenciones IRPF
  - Totales
  - Información de pago (IBAN, vencimiento)
- [x] **Descargar como PDF** (generado con jsPDF)
- [x] **Descargar como Excel** (3 hojas: General, Líneas, Impuestos)
- [x] **100% privado** (todo en navegador, nada al servidor)
- [x] **Responsive** (funciona en móvil)
- [x] **Tests automatizados** (125 tests con Vitest)
- [x] **Formulario de contacto** (Formspree)
- [x] **Seguridad** (XSS, inyección Excel, CSP headers, bloqueo rutas sensibles)
- [x] **Analítica de eventos** (Umami tracking)
- [x] **PWA instalable** (Service Worker, iconos PNG, botón "Instalar app")

### UX Improvements (Fase 1) - ✅ COMPLETADO

- [x] **Loading states** (spinner durante procesamiento)
- [x] **Toasts** (notificaciones estilizadas en lugar de alert())
- [x] **Copiar al portapapeles** (NIF, IBAN, total)
- [x] **Mensajes de error amigables** (mapeo de errores técnicos)
- [x] **Modo oscuro** (toggle con persistencia, respeta preferencia del sistema)

### Backend + Validación de Firma (Fase 2) - ✅ COMPLETADO

- [x] **Detectar firma digital** (muestra si está firmada)
- [x] **Validar firma digital** (backend Python/FastAPI)
  - Verificación matemática de firma XAdES
  - Extracción de datos del firmante y certificado
  - Verificación de expiración del certificado
  - Consulta OCSP cuando disponible
- [x] **API REST** (`POST /api/validate-signature`)
- [x] **8 tests** de backend

### Nice to Have (Fase 3)

- [ ] Múltiples facturas en lote (Modality="L")
- [ ] Historial local (localStorage)

### Futuro (Fase 2+)

- [ ] Soporte UBL (formato europeo)
- [ ] Soporte VeriFactu (cuando se publique especificación)
- [ ] API para integraciones
- [ ] Comparar dos facturas
- [x] PWA completa (Service Worker + botón instalar) - Completado

---

## Diseño UI/UX

### Pantalla principal

```
┌─────────────────────────────────────────────────────────┐
│  📄 FacturaView                              [ES] [EN]  │
│                                                         │
│  Visualiza tus facturas electrónicas Facturae          │
│  Sin instalar nada. 100% privado.                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │     📎 Arrastra tu archivo XML aquí            │   │
│  │                                                 │   │
│  │     o haz clic para seleccionar               │   │
│  │                                                 │   │
│  │     Formatos: Facturae 3.2, 3.2.1, 3.2.2      │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🔒 Tu archivo no sale de tu navegador                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Pantalla de visualización

```
┌─────────────────────────────────────────────────────────┐
│  📄 FacturaView          [Descargar PDF] [Descargar XLS]│
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ FACTURA Nº: 2024/001         Fecha: 15/01/2024 │   │
│  │ Serie: A                      Versión: 3.2.2   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ EMISOR              │  │ RECEPTOR            │      │
│  │ Empresa ABC S.L.    │  │ Juan García López   │      │
│  │ B12345678           │  │ 12345678A           │      │
│  │ C/ Mayor 1, Madrid  │  │ Av. Principal 5     │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                         │
│  DETALLE                                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Descripción          │ Cant │ Precio │ Total  │   │
│  │ Servicio consultoría │  10h │  50,00 │ 500,00 │   │
│  │ Desplazamiento       │   1  │  30,00 │  30,00 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  IMPUESTOS                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Base imponible      │                   530,00 │   │
│  │ IVA 21%             │                   111,30 │   │
│  │ TOTAL               │                   641,30 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [← Cargar otra factura]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Estructura del Proyecto

```
facturaview/
├── frontend/                    # Código frontend (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vitest.config.js
│   ├── bun.lock
│   ├── .env.example             # Variables de entorno (Formspree ID)
│   ├── src/
│   │   ├── main.js              # Entry point
│   │   ├── style.css            # Tailwind CSS
│   │   ├── parser/
│   │   │   └── facturae.js      # Parser XML (todas las versiones)
│   │   ├── components/
│   │   │   ├── Dropzone.js      # Área de subida drag & drop
│   │   │   ├── InvoiceView.js   # Vista completa de factura
│   │   │   ├── PartyCard.js     # Tarjeta emisor/receptor
│   │   │   ├── LinesTable.js    # Tabla de líneas de detalle
│   │   │   ├── TotalsBox.js     # Caja de impuestos y totales
│   │   │   └── Toast.js         # Notificaciones toast
│   │   ├── export/
│   │   │   ├── toPdf.js         # Exportar a PDF (jsPDF)
│   │   │   └── toExcel.js       # Exportar a Excel (xlsx)
│   │   └── utils/
│   │       ├── formatters.js    # Formateo moneda, fechas, NIF
│   │       ├── sanitizers.js    # Sanitización (XSS, Excel, filenames)
│   │       ├── tracking.js      # Tracking de eventos con Umami
│   │       ├── validators.js    # Validación de archivos
│   │       ├── errors.js        # Errores amigables
│   │       ├── theme.js         # Gestión tema claro/oscuro
│   │       ├── clipboard.js     # Copiar al portapapeles
│   │       └── signature.js     # Cliente API de validación de firmas
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── og-image.png
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   ├── manifest.json
│   │   └── sw.js                # Service Worker para PWA
│   └── tests/
│       ├── parser.test.js       # Tests del parser (30 tests)
│       ├── export.test.js       # Tests de exportación (13 tests)
│       ├── security.test.js     # Tests de seguridad (25 tests)
│       ├── validators.test.js   # Tests de validación (27 tests)
│       ├── errors.test.js       # Tests de errores (23 tests)
│       ├── clipboard.test.js    # Tests de clipboard (7 tests)
│       └── fixtures/            # Archivos XML de prueba
├── backend/                     # API de validación de firmas (FastAPI)
│   ├── __init__.py
│   ├── main.py                  # Entry point FastAPI + StaticFiles
│   ├── app/
│   │   ├── routes/
│   │   │   └── signature.py     # POST /api/validate-signature
│   │   ├── services/
│   │   │   └── validator.py     # Lógica de validación XAdES
│   │   └── models/
│   │       └── response.py      # Modelos Pydantic
│   └── tests/
│       └── test_signature.py    # Tests del backend (8 tests)
├── pyproject.toml               # Dependencias Python (uv)
├── uv.lock                      # Lock file Python
├── Dockerfile                   # Build unificado (frontend + backend)
├── railway.json                 # Config Railway
├── CLAUDE.md
├── tasks/
│   └── todo.md
└── doc/
    ├── FACTURAVIEW_SPEC.md
    └── SEO.md
```

---

## Dependencias (actuales)

```json
{
  "dependencies": {
    "jspdf": "^4.0.0",
    "xlsx": "^0.18.5",
    "serve": "^14.2.5"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.18",
    "jsdom": "^27.4.0",
    "tailwindcss": "^4.1.18",
    "vite": "^7.2.4",
    "vitest": "^4.0.17"
  }
}
```

**Instalación con Bun:**

```bash
bun install
```

**Total:** 3 dependencias de producción + 5 de desarrollo.

---

## Código de ejemplo: Parser Facturae

```javascript
// parser/facturae.js

export function parseFacturae(xmlString) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "text/xml");
  
  // Detectar errores de parseo
  const parseError = xml.querySelector("parsererror");
  if (parseError) {
    throw new Error("XML inválido: " + parseError.textContent);
  }
  
  // Detectar versión
  const version = getTextContent(xml, "SchemaVersion");
  
  // Extraer datos principales
  return {
    version,
    fileHeader: parseFileHeader(xml),
    seller: parseParty(xml, "SellerParty"),
    buyer: parseParty(xml, "BuyerParty"),
    invoices: parseInvoices(xml),
    isSigned: xml.querySelector("Signature") !== null
  };
}

function getTextContent(xml, tagName) {
  const el = xml.getElementsByTagName(tagName)[0];
  return el ? el.textContent.trim() : null;
}

function parseParty(xml, partyType) {
  const party = xml.getElementsByTagName(partyType)[0];
  if (!party) return null;
  
  const isLegalEntity = party.querySelector("LegalEntity") !== null;
  
  return {
    type: isLegalEntity ? "legal" : "individual",
    taxId: getTextContent(party, "TaxIdentificationNumber"),
    personType: getTextContent(party, "PersonTypeCode"), // F o J
    name: isLegalEntity 
      ? getTextContent(party, "CorporateName")
      : [
          getTextContent(party, "Name"),
          getTextContent(party, "FirstSurname"),
          getTextContent(party, "SecondSurname")
        ].filter(Boolean).join(" "),
    address: parseAddress(party)
  };
}

function parseAddress(partyEl) {
  const addr = partyEl.querySelector("AddressInSpain, OverseasAddress");
  if (!addr) return null;
  
  return {
    street: getTextContent(addr, "Address"),
    postCode: getTextContent(addr, "PostCode"),
    town: getTextContent(addr, "Town"),
    province: getTextContent(addr, "Province"),
    country: getTextContent(addr, "CountryCode") || "ESP"
  };
}

function parseInvoices(xml) {
  const invoices = xml.getElementsByTagName("Invoice");
  return Array.from(invoices).map(inv => ({
    number: getTextContent(inv, "InvoiceNumber"),
    series: getTextContent(inv, "InvoiceSeriesCode"),
    issueDate: getTextContent(inv, "IssueDate"),
    invoiceType: getTextContent(inv, "InvoiceDocumentType"),
    lines: parseLines(inv),
    taxes: parseTaxes(inv),
    totals: parseTotals(inv),
    payment: parsePayment(inv)
  }));
}

function parseLines(invoiceEl) {
  const lines = invoiceEl.getElementsByTagName("InvoiceLine");
  return Array.from(lines).map(line => ({
    description: getTextContent(line, "ItemDescription"),
    quantity: parseFloat(getTextContent(line, "Quantity")) || 0,
    unitPrice: parseFloat(getTextContent(line, "UnitPriceWithoutTax")) || 0,
    totalAmount: parseFloat(getTextContent(line, "TotalCost")) || 0,
    taxRate: parseFloat(getTextContent(line, "TaxRate")) || 0
  }));
}

function parseTotals(invoiceEl) {
  const totals = invoiceEl.querySelector("InvoiceTotals");
  if (!totals) return null;
  
  return {
    grossAmount: parseFloat(getTextContent(totals, "TotalGrossAmount")) || 0,
    taxOutputs: parseFloat(getTextContent(totals, "TotalTaxOutputs")) || 0,
    taxesWithheld: parseFloat(getTextContent(totals, "TotalTaxesWithheld")) || 0,
    invoiceTotal: parseFloat(getTextContent(totals, "InvoiceTotal")) || 0,
    totalToPay: parseFloat(getTextContent(totals, "TotalExecutableAmount")) || 0
  };
}

// ... más funciones de parseo
```

---

## SEO y Landing

### Keywords objetivo

| Keyword | Volumen estimado | Dificultad |
|---------|------------------|------------|
| "visualizar facturae" | Bajo | Muy baja |
| "abrir xml factura electronica" | Medio | Baja |
| "facturae a pdf" | Bajo | Muy baja |
| "leer factura electronica online" | Medio | Media |
| "visor facturae online" | Bajo | Muy baja |

### Meta tags sugeridos

```html
<title>FacturaView - Visualiza facturas Facturae online gratis</title>
<meta name="description" content="Abre y visualiza tus facturas electrónicas Facturae (XML) sin instalar nada. Exporta a PDF y Excel. 100% gratis y privado.">
<meta name="keywords" content="facturae, factura electronica, xml, visualizador, visor, pdf, excel, gratis, online">
```

---

## Plan de Lanzamiento - ✅ MVP COMPLETADO

### Setup inicial (Bun + Vite)

```bash
# Instalar dependencias
bun install

# Arrancar servidor desarrollo
bun run dev

# Build para producción
bun run build

# Ejecutar tests
bun run test:run
```

### Desarrollo - ✅ COMPLETADO
- [x] Setup proyecto (Bun + Vite + Vanilla JS)
- [x] Configurar Tailwind CSS v4
- [x] Configurar Vitest para tests
- [x] Parser Facturae (3.2, 3.2.1, 3.2.2)
- [x] UI de subida de archivo (drag & drop)
- [x] Vista completa de factura
- [x] Exportar a PDF (jsPDF directo)
- [x] Exportar a Excel (3 hojas)
- [x] Diseño responsive
- [x] 133 tests automatizados (125 frontend + 8 backend)
- [x] Deploy en Railway (configurado)
- [x] Formulario de contacto (Formspree)
- [x] Auditoría de seguridad (XSS, Excel injection, CSP)
- [x] Analítica de eventos (Umami)
- [x] PWA instalable (iconos PNG, meta tags iOS)

### SEO y Accesibilidad - ✅ COMPLETADO
- [x] robots.txt y sitemap.xml
- [x] Schema.org JSON-LD (WebApplication)
- [x] PWA manifest.json
- [x] Accesibilidad ARIA (labels, roles, scope)
- [x] Navegación por teclado

### Próximos Pasos
- [ ] Probar con facturas reales de usuarios
- [ ] FAQ
- [ ] Publicar en comunidades de autónomos

---

## Monetización (Futuro)

| Fase | Modelo |
|------|--------|
| MVP | 100% gratis (captar usuarios) |
| Fase 1 | Donaciones / "Invítame a un café" |
| Fase 2 | Límite de facturas/día para no registrados |
| Fase 3 | Plan Pro: lotes, API, sin límites |

---

## Recursos

- [Esquema XSD Facturae 3.2.2](https://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2.xml)
- [Documentación campos Facturae](https://www.facturae.gob.es/formato/Versiones/Esquema_castellano_v3_2_x_06_06_2017_unificado.pdf)
- [Códigos de países, monedas, impuestos](https://www.facturae.gob.es/formato/Paginas/formato.aspx)

---

## Conclusión

**Estado:** MVP+ completado con 133 tests pasando (125 frontend + 8 backend).

**¿Backend necesario?** Solo para validación de firmas digitales. El resto es 100% frontend.

**Stack actual:**
- Frontend: Bun + Vite 7.x + Vanilla JS + Tailwind CSS v4 + Railway
- Backend: Python 3.11 + FastAPI + uv + signxml + Railway

**Comandos clave:**
```bash
# Frontend (desde frontend/)
cd frontend
bun run dev       # Desarrollo (http://localhost:5173)
bun run build     # Producción (genera frontend/dist/)
bun run test:run  # Ejecutar tests (125 tests)

# Backend (desde raíz)
uv sync           # Instalar dependencias
uv run uvicorn backend.main:app --reload  # Desarrollo (http://localhost:8000)
uv run pytest -v  # Ejecutar tests (8 tests)

# Docker (simula producción)
docker build -t facturaview .
docker run -p 8000:8000 facturaview
# Visitar http://localhost:8000
```

**Ventaja clave:** Eres más rápido que el gobierno. Siempre.
