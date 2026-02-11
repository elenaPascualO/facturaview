# FacturaView

Visualizador web moderno de facturas electrónicas en formato Facturae. Alternativa gratuita, rápida y privada al software oficial del gobierno español.

**[www.facturaview.es](https://www.facturaview.es)**

## Qué es

FacturaView permite abrir, visualizar y exportar facturas electrónicas Facturae (XML) directamente desde el navegador, sin instalar software ni enviar datos a ningún servidor. Soporta todas las versiones del formato (3.2, 3.2.1, 3.2.2).

## Funcionalidades

- **Visualización completa**: emisor, receptor, líneas de detalle, impuestos, totales y datos de pago
- **Exportación a PDF y Excel**: descarga profesional con estilos
- **Facturas por lotes**: soporte para ficheros con múltiples facturas y exportación batch a ZIP
- **Validación de firma digital**: verificación de firmas XAdES a través del backend
- **Historial local**: últimas facturas almacenadas en el navegador (máx. 50)
- **Carga múltiple**: sube varios archivos y navega entre ellos
- **Copiar al portapapeles**: campos clave con un clic
- **Bilingüe**: español e inglés
- **Modo oscuro**: con persistencia
- **PWA instalable**: funciona offline

## Stack tecnológico

| Componente | Tecnología |
|---|---|
| Frontend | Vanilla JS + Vite + Tailwind CSS (runtime: Bun) |
| Backend | Python + FastAPI (runtime: uv) |
| PDF | jsPDF |
| Excel | openpyxl (backend) / SheetJS (fallback) |
| Firma digital | signxml + cryptography |
| Tests | Vitest (223) + pytest (19) |
| Despliegue | Docker + Railway |

## Inicio rápido

### Requisitos previos

- [Bun](https://bun.sh/) (frontend)
- Python 3.11+ y [uv](https://github.com/astral-sh/uv) (backend)

### Frontend

```bash
cd frontend
bun install
bun run dev          # http://localhost:5173
bun run test:run     # 223 tests
```

### Backend

```bash
uv sync
uv run uvicorn backend.main:app --reload    # http://localhost:8000
uv run pytest -v                             # 19 tests
```

El frontend en desarrollo redirige las llamadas `/api` al backend en `localhost:8000`.

### Docker

```bash
docker build -t facturaview .
docker run -p 8000:8000 facturaview
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_FORMSPREE_ID` | ID del formulario de contacto (Formspree) |
| `VITE_SIGNATURE_API_URL` | URL del backend (solo si está en dominio distinto) |

## Privacidad

Todo el parseo y visualización de facturas ocurre 100% en el navegador. Ningún dato de factura sale del dispositivo del usuario. El backend solo se usa opcionalmente para validación de firma digital y generación de Excel profesional.

## Licencia

Todos los derechos reservados.
