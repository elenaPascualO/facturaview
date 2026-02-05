"""
Rutas de exportación de facturas
"""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Any

from ..services.excel_generator import generate_excel


router = APIRouter(tags=["export"])


class ExportExcelRequest(BaseModel):
    """Request body para exportar a Excel"""

    data: dict[str, Any]
    invoice_index: int = 0
    lang: str = "es"
    filename: str | None = None


@router.post("/api/export/excel")
async def export_to_excel(request: ExportExcelRequest):
    """
    Genera un archivo Excel con diseño profesional para una factura.

    Recibe los datos parseados de la factura y devuelve el archivo Excel.

    - **data**: Datos de la factura (formato del parser frontend)
    - **invoice_index**: Índice de la factura en lotes (default: 0)
    - **lang**: Idioma ('es' o 'en', default: 'es')
    - **filename**: Nombre del archivo (opcional)
    """
    # Validar datos mínimos
    if not request.data:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos")

    invoices = request.data.get("invoices", [])
    if not invoices:
        raise HTTPException(status_code=400, detail="No hay facturas en los datos")

    if request.invoice_index >= len(invoices):
        raise HTTPException(
            status_code=400,
            detail=f"Índice de factura inválido: {request.invoice_index}"
        )

    # Validar idioma
    lang = request.lang if request.lang in ("es", "en") else "es"

    try:
        excel_bytes = generate_excel(request.data, request.invoice_index, lang)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generando Excel: {str(e)}"
        )

    # Nombre del archivo
    invoice = invoices[request.invoice_index]
    if request.filename:
        filename = request.filename
    else:
        series = invoice.get("series", "")
        number = invoice.get("number", "")
        invoice_num = f"{series}{series and '-' or ''}{number}" if (series or number) else "factura"
        filename = f"factura-{invoice_num}.xlsx"

    # Sanitizar nombre de archivo
    filename = "".join(c for c in filename if c.isalnum() or c in ".-_").strip()
    if not filename.endswith(".xlsx"):
        filename += ".xlsx"

    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )
