# FacturaView — Visualizador de Facturae

## Resumen Ejecutivo

**Problema:** Los autónomos y pymes españoles reciben facturas electrónicas en formato XML (Facturae) que no pueden leer sin instalar software obsoleto del gobierno (requiere Java).

**Solución:** Web app moderna que permite visualizar, entender y exportar facturas Facturae sin instalación.

**Ventaja competitiva:** 100% online, sin Java, sin registro, móvil-friendly.

---

## Viabilidad Técnica

### ¿Se puede hacer sin backend?

**Sí, 100% frontend.** Razones:

| Funcionalidad | Solución frontend |
|---------------|-------------------|
| Parsear XML | `DOMParser` nativo de JS |
| Mostrar datos | React / Vanilla JS |
| Generar PDF | `jsPDF` + `html2canvas` |
| Generar Excel | `SheetJS (xlsx)` |
| Validar estructura | Comparar contra esquema XSD en JS |

**No se envía nada al servidor.** El archivo se procesa localmente en el navegador del usuario.

### Stack recomendado (mínimo)

```
Runtime:  Bun (más rápido que npm/node)
Build:    Vite
Frontend: Vanilla JS (o React si prefieres)
Styling:  Tailwind CSS (CDN para velocidad)
PDF:      jsPDF + html2canvas
Excel:    SheetJS (xlsx)
Deploy:   Vercel / Netlify / GitHub Pages (gratis)
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
- [x] **Tests automatizados** (40 tests con Vitest)

### Nice to Have (Fase 1)

- [x] Detectar firma digital (muestra si está firmada)
- [ ] Validar firma digital (verificar certificado)
- [ ] Detectar errores en XML malformado (mensajes descriptivos)
- [ ] Modo oscuro
- [ ] Múltiples facturas en lote (Modality="L")
- [ ] Copiar datos al portapapeles
- [ ] Historial local (localStorage)

### Futuro (Fase 2+)

- [ ] Soporte UBL (formato europeo)
- [ ] Soporte VeriFactu (cuando se publique especificación)
- [ ] API para integraciones
- [ ] Comparar dos facturas
- [ ] PWA (instalable como app)

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
├── index.html
├── src/
│   ├── main.js              # Entry point
│   ├── parser/
│   │   ├── facturae.js      # Parser principal
│   │   ├── v322.js          # Específico 3.2.2
│   │   ├── v321.js          # Específico 3.2.1
│   │   └── v32.js           # Específico 3.2
│   ├── components/
│   │   ├── Dropzone.js      # Área de subida
│   │   ├── InvoiceView.js   # Vista de factura
│   │   ├── PartyCard.js     # Tarjeta emisor/receptor
│   │   ├── LinesTable.js    # Tabla de líneas
│   │   └── TotalsBox.js     # Caja de totales
│   ├── export/
│   │   ├── toPdf.js         # Exportar a PDF
│   │   └── toExcel.js       # Exportar a Excel
│   ├── utils/
│   │   └── formatters.js    # Formateo de moneda, fechas, etc.
│   └── styles/
│       └── main.css
├── public/
│   └── favicon.ico
├── package.json
├── bun.lockb                # Lockfile de Bun
├── vite.config.js
└── README.md
```

---

## Dependencias (mínimas)

```json
{
  "dependencies": {
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

**Instalación con Bun:**

```bash
bun add jspdf html2canvas xlsx
```

**Total:** ~3 dependencias de producción. Muy ligero.

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

## Plan de Lanzamiento

### Setup inicial (Bun + Vite)

```bash
# Crear proyecto
bun create vite . --template vanilla

# Instalar dependencias
bun install
bun add jspdf html2canvas xlsx

# Arrancar servidor desarrollo
bun run dev

# Build para producción
bun run build
```

### Semana 1
- [ ] Setup proyecto (Bun + Vite + Vanilla JS)
- [ ] Parser Facturae básico (3.2.2)
- [ ] UI de subida de archivo
- [ ] Vista básica de factura

### Semana 2
- [ ] Soporte versiones 3.2.1 y 3.2
- [ ] Exportar a PDF
- [ ] Exportar a Excel
- [ ] Pulir UI responsive
- [ ] Deploy en Vercel/Netlify

### Semana 3
- [ ] Landing page con SEO
- [ ] FAQ
- [ ] Publicar en foros españoles (forocoches, mediavida, etc.)
- [ ] Compartir en comunidades de autónomos

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

**¿Backend necesario?** No para el MVP.

**¿Tiempo estimado?** 1-2 semanas.

**¿Stack recomendado?** 
- Bun + Vite + Vanilla JS + Vercel

**Comandos clave:**
```bash
bun run dev      # Desarrollo
bun run build    # Producción  
bun run preview  # Preview del build
```

**Ventaja clave:** Eres más rápido que el gobierno. Siempre.
