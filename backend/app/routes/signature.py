"""
Rutas de validación de firma digital
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.validator import validate_xades_signature
from ..models.response import SignatureResponse

router = APIRouter(tags=["signature"])


@router.post("/api/validate-signature", response_model=SignatureResponse)
async def validate_signature(file: UploadFile = File(...)):
    """
    Valida la firma XAdES de una factura Facturae.

    Recibe un archivo XML firmado y devuelve información sobre:
    - Validez matemática de la firma
    - Datos del firmante (nombre, NIF, organización)
    - Datos del certificado (emisor, validez, serial)
    - Estado de revocación (OCSP/CRL cuando es posible)

    El archivo se procesa en memoria y NO se almacena.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No se proporcionó archivo")

    # Validar extensión
    if not file.filename.lower().endswith((".xml", ".xsig")):
        raise HTTPException(
            status_code=400,
            detail="Formato no soportado. Solo se aceptan archivos .xml o .xsig"
        )

    # Leer contenido
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error leyendo archivo: {str(e)}")

    # Validar tamaño (máx 10 MB)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Archivo demasiado grande (máx 10 MB)")

    # Validar firma
    result = validate_xades_signature(content)

    return result