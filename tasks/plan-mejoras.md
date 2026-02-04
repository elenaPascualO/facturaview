# Plan de Implementación - FacturaView Mejoras

## Resumen
Implementar 7 funcionalidades nuevas para FacturaView, ordenadas por esfuerzo (bajo → alto). Incluye un backend en Python + FastAPI para validación completa de firmas digitales.

---

## Fase 1: Esfuerzo Bajo (Frontend)

### 1.1 Loading States
**Objetivo:** Mostrar indicadores de carga durante procesamiento y exportación.

**Archivos a modificar:**
- `src/components/Dropzone.js` - Añadir overlay de loading
- `src/main.js` - Mostrar/ocultar overlay en `handleFile()` (línea 115) y botones export (líneas 146-156)

**Implementación:**
1. Añadir HTML del overlay en Dropzone (spinner CSS con Tailwind `animate-spin`)
2. En `handleFile()`: mostrar overlay al inicio, ocultar en finally
3. En exports: `btn.disabled = true` + texto "Generando..." durante operación

---

### 1.2 Mejores Mensajes de Error
**Objetivo:** Reemplazar `alert()` con toasts estilizados.

**Archivos a crear:**
- `src/components/Toast.js` - Componente toast con `showToast(message, type)`

**Archivos a modificar:**
- `index.html` - Añadir `<div id="toast-container">`
- `src/main.js` - Reemplazar `alert()` en líneas 120 y 131

**Implementación:**
1. Crear Toast.js con funciones `showToast()` y auto-remove después de 5s
2. Estilos: `bg-red-500` error, `bg-green-600` success
3. **Seguridad:** Usar `escapeHtml()` en mensajes

---

### 1.3 Copiar al Portapapeles
**Objetivo:** Botones para copiar NIF, IBAN y total.

**Archivos a crear:**
- `src/utils/clipboard.js` - Función `copyToClipboard(text)`
- `tests/clipboard.test.js` - Tests

**Archivos a modificar:**
- `src/components/PartyCard.js` - Botón copiar junto a NIF (línea 27)
- `src/components/InvoiceView.js` - Botón copiar junto a IBAN (línea 110)
- `src/components/TotalsBox.js` - Botón copiar junto a total (línea 44)
- `src/main.js` - Event delegation para `.btn-copy`

**Implementación:**
1. Crear clipboard.js con `navigator.clipboard.writeText()` + fallback
2. Añadir botones con `data-copy="valor"` en componentes
3. Event delegation en main.js para manejar clicks
4. Feedback visual: icono cambia a ✓ por 2 segundos

---

## Fase 2: Esfuerzo Medio

### 2.1 Modo Oscuro (Frontend)
**Objetivo:** Toggle claro/oscuro con persistencia.

**Archivos a crear:**
- `src/utils/theme.js` - `initTheme()`, `toggleTheme()`, `getTheme()`

**Archivos a modificar:**
- `src/style.css` - Configuración dark mode Tailwind v4
- `src/main.js` - Inicializar tema, handler para toggle
- `src/components/Dropzone.js` - Clases `dark:` + botón toggle
- `src/components/InvoiceView.js` - Clases `dark:`
- `src/components/PartyCard.js` - Clases `dark:`
- `src/components/LinesTable.js` - Clases `dark:`
- `src/components/TotalsBox.js` - Clases `dark:`

**Mapeo de colores:**
| Light | Dark |
|-------|------|
| `bg-gray-50` | `dark:bg-slate-900` |
| `bg-white` | `dark:bg-slate-800` |
| `text-gray-800` | `dark:text-gray-100` |
| `text-gray-600` | `dark:text-gray-300` |
| `border-gray-200` | `dark:border-slate-700` |

**Implementación:**
1. Crear theme.js con localStorage persistencia
2. Añadir CSS en style.css para `color-scheme`
3. Llamar `initTheme()` antes de `renderApp()` en main.js
4. Añadir botón toggle (icono sol/luna) en header
5. Actualizar TODOS los componentes con variantes `dark:`

---

### 2.2 Backend + Validación de Firma Digital ⭐ NUEVO
**Objetivo:** Validar firmas XAdES con verificación completa (OCSP/CRL, cadena de confianza).

#### Backend (Python + FastAPI)

**Estructura del backend:**
```
backend/
├── main.py                 # Entry point FastAPI
├── requirements.txt        # Dependencias
├── app/
│   ├── __init__.py
│   ├── routes/
│   │   └── signature.py    # POST /api/validate-signature
│   ├── services/
│   │   └── validator.py    # Lógica de validación XAdES
│   └── models/
│       └── response.py     # Modelos Pydantic
├── tests/
│   └── test_signature.py   # Tests
└── Dockerfile              # Para Railway
```

**Dependencias (requirements.txt):**
```
fastapi>=0.109.0
uvicorn>=0.27.0
python-multipart>=0.0.6
signxml>=3.2.0
cryptography>=42.0.0
requests>=2.31.0            # Para OCSP/CRL
lxml>=5.1.0
pydantic>=2.5.0
pytest>=8.0.0
httpx>=0.26.0               # Para tests async
```

**Endpoint principal:**
```python
# backend/app/routes/signature.py
from fastapi import APIRouter, UploadFile, File
from ..services.validator import validate_xades_signature

router = APIRouter()

@router.post("/api/validate-signature")
async def validate_signature(file: UploadFile = File(...)):
    """
    Valida firma XAdES de una factura Facturae.

    Returns:
        - valid: bool - Si la firma es matemáticamente válida
        - signer: dict - Datos del firmante (nombre, NIF, organización)
        - certificate: dict - Datos del certificado (emisor, validez, serial)
        - chain_valid: bool - Si la cadena de confianza es válida
        - revoked: bool - Si el certificado está revocado (OCSP/CRL)
        - timestamp: str | null - Sello de tiempo si existe
    """
    xml_content = await file.read()
    result = validate_xades_signature(xml_content)
    return result
```

**Respuesta del endpoint:**
```json
{
  "valid": true,
  "signer": {
    "name": "EMPRESA EJEMPLO SL",
    "taxId": "B12345678",
    "organization": "EMPRESA EJEMPLO SL"
  },
  "certificate": {
    "issuer": "AC FNMT Usuarios",
    "serial": "1234567890",
    "valid_from": "2023-01-15T00:00:00Z",
    "valid_to": "2027-01-15T23:59:59Z"
  },
  "chain_valid": true,
  "revoked": false,
  "revocation_checked": true,
  "timestamp": "2024-01-20T10:30:00Z",
  "errors": []
}
```

**Deploy en Railway:**
```toml
# railway.toml (backend)
[build]
builder = "dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 30
```

#### Frontend (cambios mínimos)

**Archivos a crear:**
- `src/utils/signature.js` - Cliente para API de validación

**Archivos a modificar:**
- `src/main.js` - Llamar a validación después de parseo
- `src/components/InvoiceView.js` - Sección "Firma Digital"

**Variable de entorno:**
```env
# .env
VITE_SIGNATURE_API_URL=https://api.facturaview.es
```

**Cliente de validación:**
```javascript
// src/utils/signature.js
const API_URL = import.meta.env.VITE_SIGNATURE_API_URL

export async function validateSignature(xmlContent) {
  if (!API_URL) {
    return { valid: null, message: 'Validación no disponible' }
  }

  try {
    const formData = new FormData()
    formData.append('file', new Blob([xmlContent], { type: 'application/xml' }))

    const response = await fetch(`${API_URL}/api/validate-signature`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Error en validación')
    return await response.json()
  } catch (error) {
    return { valid: null, error: error.message }
  }
}
```

**UI de firma en InvoiceView:**
```javascript
// Añadir sección en InvoiceView.js
function createSignatureSection(signatureData) {
  if (!signatureData) return ''

  const statusIcon = signatureData.valid ? '✅' : signatureData.valid === false ? '❌' : '⚠️'
  const statusText = signatureData.valid ? 'Firma válida' :
                     signatureData.valid === false ? 'Firma inválida' : 'No verificada'

  return `
    <section class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        ${statusIcon} Firma Digital
      </h2>
      <div class="space-y-2 text-sm">
        <p><span class="text-gray-500">Estado:</span> ${escapeHtml(statusText)}</p>
        ${signatureData.signer ? `
          <p><span class="text-gray-500">Firmante:</span> ${escapeHtml(signatureData.signer.name)}</p>
          <p><span class="text-gray-500">NIF:</span> ${escapeHtml(signatureData.signer.taxId || 'N/A')}</p>
        ` : ''}
        ${signatureData.certificate ? `
          <p><span class="text-gray-500">Certificado:</span> ${escapeHtml(signatureData.certificate.issuer)}</p>
          <p><span class="text-gray-500">Válido hasta:</span> ${escapeHtml(signatureData.certificate.valid_to)}</p>
        ` : ''}
        ${signatureData.revoked === false ? `
          <p class="text-green-600 dark:text-green-400">✓ Certificado no revocado (OCSP verificado)</p>
        ` : ''}
      </div>
    </section>
  `
}
```

**Privacidad:** El XML se envía al backend solo para validación y **no se almacena**. Añadir nota en UI:
> "El archivo se envía temporalmente para validar la firma y se descarta inmediatamente."

---

### 2.3 Historial Local (Frontend)
**Objetivo:** Guardar facturas en localStorage con acceso rápido.

**Archivos a crear:**
- `src/utils/storage.js` - `saveInvoice()`, `getHistory()`, `getInvoice()`, `deleteInvoice()`, `clearHistory()`
- `tests/storage.test.js` - Tests

**Archivos a modificar:**
- `src/components/Dropzone.js` - Sección "Facturas recientes"
- `src/main.js` - Guardar después de parseo, handlers para historial

**Schema localStorage:**
```javascript
// key: 'facturaview-history'
[{
  id: 'uuid',
  savedAt: 'ISO date',
  metadata: { number, series, sellerName, buyerName, total, currency, issueDate, version },
  signatureValid: true | false | null,  // ⭐ Nuevo: resultado de validación
  data: { /* objeto completo */ }
}]
```

**Límites:** 50 facturas máximo, ~2 MB

**Implementación:**
1. Crear storage.js con todas las funciones
2. En Dropzone: mostrar lista de 5 facturas recientes
3. En main.js: `saveInvoice()` después de parseo exitoso
4. Añadir botón "Limpiar historial" con confirmación
5. **Seguridad:** Escapar todos los datos al renderizar

---

## Fase 3: Esfuerzo Alto

### 3.1 Múltiples Facturas en Lote
**Objetivo:** Procesar varios XMLs y exportar en lote.

**Dependencia nueva:**
```bash
bun add jszip
```

**Archivos a crear:**
- `src/components/InvoiceList.js` - Vista de lista de facturas
- `src/export/toBatchExcel.js` - Excel con todas las facturas
- `src/export/toBatchPdf.js` - ZIP de PDFs
- `tests/batch.test.js` - Tests

**Archivos a modificar:**
- `src/main.js` - Nuevo estado `currentInvoices[]`, `selectedInvoiceIndex`, `viewMode`
- `src/components/Dropzone.js` - Añadir `multiple` al input
- `src/components/InvoiceView.js` - Navegación Anterior/Siguiente

**Nuevo estado en main.js:**
```javascript
let currentInvoices = []
let selectedInvoiceIndex = 0
let viewMode = 'single' // 'single' | 'list'
```

**Implementación:**
1. Modificar Dropzone para aceptar múltiples archivos
2. Modificar `handleFile()` → `handleFiles()` con `Promise.all()`
3. Crear InvoiceList.js con grid de tarjetas resumen
4. Añadir navegación entre facturas en InvoiceView
5. Crear toBatchExcel.js (hoja resumen + detalle)
6. Crear toBatchPdf.js (ZIP con JSZip)
7. **Seguridad:** Sanitizar nombres de archivo en ZIP

---

## Orden de Implementación

```
FASE 1 (Frontend - Paralelo) ✅ COMPLETADO
─────────────────────────────
1. Loading states        ──┐
2. Mensajes de error     ──┼── ✅ Implementado
3. Copiar al portapapeles──┘
         │
         ▼
FASE 2 (Medio) ✅ COMPLETADO
─────────────────────────────
4. Modo oscuro ─────────────── ✅ Implementado
         │
         ▼
5. Backend + Validación firma ─ ✅ Implementado (Python + FastAPI + uv)
         │
         ▼
6. Historial local ─────────── ✅ Implementado (incluye estado de firma)
         │
         ▼
FASE 3 (Alto)
─────────────────────────────
7. Múltiples facturas ──────── (más complejo)
         │
         ▼
FASE 4 (Evolución)
─────────────────────────────
8. EU DSS ─────────────────── (validación oficial eIDAS)
         │
         ▼
FASE 5 (Backend existente)
─────────────────────────────
9. Excel Pro ──────────────── (openpyxl, estilos, gráficos)
```

---

## Arquitectura Final

```
┌─────────────────────────────────────────────────────────┐
│                 Frontend (Vite + JS)                    │
│                 https://www.facturaview.es              │
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │   Dropzone  │───▶│   Parser    │───▶│ InvoiceView │ │
│  └─────────────┘    └─────────────┘    └─────────────┘ │
│         │                  │                  │         │
│         ▼                  ▼                  ▼         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │  Historial  │    │  Signature  │    │   Export    │ │
│  │ (localStorage)   │   Client    │    │  PDF/Excel  │ │
│  └─────────────┘    └──────┬──────┘    └─────────────┘ │
└────────────────────────────┼────────────────────────────┘
                             │ POST /api/validate-signature
                             ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Python + FastAPI)                 │
│              https://api.facturaview.es                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  POST /api/validate-signature                   │   │
│  │  - Valida firma XAdES                           │   │
│  │  - Verifica cadena de confianza                 │   │
│  │  - Consulta OCSP/CRL                            │   │
│  │  - Devuelve JSON con resultado                  │   │
│  │  - NO almacena el XML                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  GET /health - Health check para Railway               │
└─────────────────────────────────────────────────────────┘
```

---

## Deploy

### Frontend (ya existente)
- Railway: `https://www.facturaview.es`
- Configuración actual funciona

### Backend (nuevo)
- Railway: nuevo servicio `https://api.facturaview.es`
- Dockerfile para build
- Variables de entorno: ninguna requerida inicialmente

**railway.toml (backend):**
```toml
[build]
builder = "dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 30
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
```

---

## Verificación

### Tests a ejecutar
```bash
# Frontend
bun run test:run

# Backend
cd backend && pytest
```

**Tests nuevos esperados:**
- `tests/clipboard.test.js` - Copiar al portapapeles
- `tests/storage.test.js` - localStorage
- `tests/batch.test.js` - Procesamiento en lote
- `backend/tests/test_signature.py` - Validación de firma

### Pruebas manuales
1. **Loading:** Subir archivo grande, verificar spinner
2. **Toasts:** Subir archivo inválido, verificar toast de error
3. **Copiar:** Click en botón copiar, pegar en otro lugar
4. **Dark mode:** Toggle tema, refrescar página (debe persistir)
5. **Firma:** Subir factura firmada, verificar sección de firma ⭐
6. **Historial:** Subir factura, refrescar, verificar que aparece en recientes
7. **Lote:** Subir 3 XMLs, verificar lista, exportar Excel y ZIP

### Build de producción
```bash
# Frontend
bun run build
bun run preview

# Backend
cd backend && uvicorn main:app --reload
```

---

## Archivos Críticos

| Archivo | Rol |
|---------|-----|
| `src/main.js` | Entry point frontend - se modifica en TODAS las fases |
| `src/utils/sanitizers.js` | Patrón de seguridad (`escapeHtml`) |
| `src/components/Dropzone.js` | Componente principal frontend |
| `backend/main.py` | Entry point backend |
| `backend/app/services/validator.py` | Lógica de validación XAdES |
| `tasks/todo.md` | Actualizar con progreso |

---

## Fase 4: Evolución Futura

### 4.1 Validación con EU DSS (Digital Signature Services)
**Objetivo:** Integrar el estándar europeo DSS para validación de firmas con máxima conformidad legal.

#### ¿Qué es DSS?
[DSS (Digital Signature Services)](https://ec.europa.eu/digital-building-blocks/wikis/display/DIGITAL/Digital+Signature+Service+-++DSS) es la librería oficial de la Comisión Europea para firmas digitales. Es el estándar de la industria usado por:
- FACe (portal de facturas del gobierno español)
- Portales de administración electrónica de la UE
- Validadores oficiales de firma electrónica

#### Ventajas sobre signxml
| Característica | signxml (Fase 2) | DSS (Fase 4) |
|----------------|------------------|--------------|
| XAdES-BES | ✅ | ✅ |
| XAdES-T, XAdES-XL, XAdES-A | ⚠️ Parcial | ✅ Completo |
| Validación contra EU Trust List | ❌ | ✅ |
| Informes de validación ETSI | ❌ | ✅ |
| Conformidad eIDAS | ⚠️ | ✅ |
| Soporte PAdES (PDF firmados) | ❌ | ✅ |
| Soporte CAdES | ❌ | ✅ |

#### Opciones de integración

**Opción A: DSS como microservicio Java (Recomendado)**
```
backend/
├── python-api/          # FastAPI actual
│   └── ...
└── dss-service/         # Nuevo servicio Java
    ├── Dockerfile
    ├── pom.xml
    └── src/
        └── main/java/
            └── DssValidationService.java
```

**Arquitectura:**
```
Frontend
    │
    ▼
Python API (FastAPI)
    │
    │ HTTP interno
    ▼
DSS Service (Java)
    │
    ├── Valida contra EU Trust List
    ├── Genera informes ETSI
    └── Soporta todos los formatos XAdES
```

**Opción B: DSS REST API oficial**
La UE ofrece una [demo pública](https://ec.europa.eu/digital-building-blocks/DSS/webapp-demo/validation) que se puede usar como referencia, aunque para producción se recomienda self-hosted.

**Opción C: Servicio externo (SaaS)**
Usar un validador DSS como servicio (ej: Validated ID, Docusign) para evitar mantener Java.

#### Implementación recomendada

**Dockerfile para DSS:**
```dockerfile
FROM eclipse-temurin:17-jre-alpine

# Descargar DSS standalone
RUN wget https://ec.europa.eu/digital-building-blocks/artifact/repository/esignaturedss/eu/europa/ec/joinup/sd-dss/dss-standalone-app/6.0/dss-standalone-app-6.0.jar -O /app/dss.jar

WORKDIR /app
EXPOSE 8080

CMD ["java", "-jar", "dss.jar"]
```

**Endpoint en Python que llama a DSS:**
```python
# backend/app/services/dss_validator.py
import httpx

DSS_URL = "http://dss-service:8080"

async def validate_with_dss(xml_content: bytes) -> dict:
    """
    Valida firma usando EU DSS.
    Retorna informe completo de validación ETSI.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{DSS_URL}/services/rest/validation/validateSignature",
            files={"file": ("invoice.xml", xml_content, "application/xml")},
            data={
                "signedDocument": xml_content,
                "policy": "ETSI_SIGNATURE_POLICY"
            }
        )
        return response.json()
```

**Respuesta DSS (ejemplo):**
```json
{
  "SimpleReport": {
    "signatureOrTimestamp": [{
      "indication": "TOTAL_PASSED",
      "subIndication": null,
      "signatureLevel": "XAdES-BASELINE-B",
      "signedBy": "EMPRESA EJEMPLO SL",
      "certificateChain": {
        "certificate": [
          {"qualifiedName": "EMPRESA EJEMPLO SL"},
          {"qualifiedName": "AC FNMT Usuarios"},
          {"qualifiedName": "AC Raíz FNMT-RCM"}
        ]
      }
    }],
    "validSignaturesCount": 1,
    "signaturesCount": 1
  },
  "DiagnosticData": { /* datos técnicos completos */ },
  "DetailedReport": { /* informe detallado ETSI */ }
}
```

#### Migración gradual

```
Fase 2 (Actual)                    Fase 4 (Evolución)
─────────────────                  ─────────────────
Python + signxml                   Python + DSS (Java)
     │                                   │
     ▼                                   ▼
Validación básica                  Validación completa
- Firma matemática ✅              - Todo lo anterior ✅
- Datos certificado ✅             - EU Trust List ✅
- OCSP/CRL ✅                      - Informes ETSI ✅
                                   - Conformidad eIDAS ✅
                                   - PAdES/CAdES ✅
```

#### Cuándo migrar a DSS
- Cuando necesites **conformidad legal estricta** (eIDAS)
- Cuando quieras validar **otros formatos** (PDF firmados, CAdES)
- Cuando usuarios pidan **informes de validación oficiales**
- Cuando quieras **certificarte** como validador de confianza

#### Coste estimado
- **Self-hosted en Railway:** ~$10-15/mes (servicio Java adicional)
- **VPS dedicado:** ~$20/mes (más control)
- **SaaS externo:** Variable según volumen

---

## Nota sobre Privacidad

Con la adición del backend, actualizar el mensaje de privacidad en la web:

**Antes:** "100% privado - tus archivos nunca salen de tu ordenador"

**Después:** "Tus archivos se procesan localmente. Solo las facturas firmadas se envían temporalmente a nuestro servidor para validar la firma digital y se descartan inmediatamente sin almacenarse."

---

## Fase 5: Exportación Excel Mejorada (Backend)

### 5.1 Generación de Excel con Python
**Objetivo:** Generar archivos Excel profesionales con mejor formato usando librerías Python.

#### ¿Por qué mejorar?
El frontend actual usa SheetJS que es limitado en formato:
- Sin estilos avanzados (bordes, colores de celda, fuentes)
- Sin fórmulas calculadas
- Sin gráficos
- Sin imágenes (logo empresa)

Con Python (openpyxl/xlsxwriter) podemos generar Excel "profesional".

#### Comparativa

| Característica | SheetJS (actual) | openpyxl (backend) |
|----------------|------------------|-------------------|
| Datos básicos | ✅ | ✅ |
| Estilos de celda | ❌ | ✅ |
| Bordes y colores | ❌ | ✅ |
| Fórmulas Excel | ⚠️ Limitado | ✅ |
| Gráficos | ❌ | ✅ |
| Imágenes/Logo | ❌ | ✅ |
| Formato condicional | ❌ | ✅ |
| Plantillas personalizadas | ❌ | ✅ |

#### Arquitectura

```
Frontend                          Backend
────────                          ───────
[Exportar Excel Pro] ──POST───▶  /api/export/excel
     │                                │
     │                                ▼
     │                           openpyxl genera:
     │                           - Header con logo
     │                           - Estilos corporativos
     │                           - Fórmulas de totales
     │                           - Formato moneda
     │                                │
     ◀────────────────────────────────┘
     Descarga .xlsx
```

#### Endpoint propuesto

```python
# backend/app/routes/export.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ..services.excel_generator import generate_professional_excel

router = APIRouter()

@router.post("/api/export/excel")
async def export_excel(invoice_data: dict):
    """
    Genera Excel profesional con formato avanzado.

    El JSON de la factura se envía, se genera el Excel
    y se devuelve como descarga. No se almacena nada.
    """
    excel_bytes = generate_professional_excel(invoice_data)

    return StreamingResponse(
        excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=factura.xlsx"}
    )
```

#### Funcionalidades del Excel Pro

1. **Hoja "Factura"**
   - Cabecera con datos de la factura (número, fecha, tipo)
   - Logo de FacturaView (opcional)
   - Secciones Emisor/Receptor con formato
   - Tabla de líneas con estilos alternados
   - Totales con fórmulas reales (`=SUM(...)`)
   - Formato de moneda según `InvoiceCurrencyCode`

2. **Hoja "Desglose Impuestos"**
   - Tabla con IVA por tipo
   - Retenciones IRPF
   - Gráfico circular de distribución de impuestos

3. **Hoja "Datos Técnicos"**
   - Versión Facturae
   - Estado de firma digital
   - Información de pago completa

#### Dependencias adicionales

```txt
# requirements.txt
openpyxl>=3.1.0      # Generación Excel con estilos
Pillow>=10.0.0       # Para insertar imágenes/logo
```

#### Consideraciones

**Privacidad:** Los datos de la factura (ya parseados en frontend) se envían al backend solo para generar el Excel. No se almacenan.

**Fallback:** Mantener la exportación actual de SheetJS como fallback si el backend no está disponible:

```javascript
// src/export/toExcel.js
export async function exportToExcel(invoice, usePro = true) {
  const apiUrl = import.meta.env.VITE_API_URL

  if (usePro && apiUrl) {
    try {
      // Intentar Excel Pro via backend
      const response = await fetch(`${apiUrl}/api/export/excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      })
      if (response.ok) {
        const blob = await response.blob()
        downloadBlob(blob, `factura-${invoice.number}.xlsx`)
        return
      }
    } catch {
      // Fallback a SheetJS
    }
  }

  // Exportación local con SheetJS
  exportToExcelLocal(invoice)
}
```

#### Cuándo implementar
- **Después de Fase 2.2** (backend ya desplegado)
- Reutiliza la infraestructura del backend de validación de firma
- Coste adicional: mínimo (solo añadir endpoint al backend existente)

#### UI opcional
Añadir toggle en la vista de factura:
```
[Descargar Excel]  [Descargar Excel Pro ✨]
```

O detectar automáticamente si el backend está disponible y usar la versión Pro por defecto.
