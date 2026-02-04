"""
Modelos Pydantic para respuestas de la API
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SignerInfo(BaseModel):
    """Información del firmante"""
    name: Optional[str] = None
    tax_id: Optional[str] = None
    organization: Optional[str] = None
    email: Optional[str] = None


class CertificateInfo(BaseModel):
    """Información del certificado"""
    issuer: Optional[str] = None
    subject: Optional[str] = None
    serial: Optional[str] = None
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    is_expired: bool = False


class SignatureResponse(BaseModel):
    """Respuesta de validación de firma"""
    valid: Optional[bool] = None
    signer: Optional[SignerInfo] = None
    certificate: Optional[CertificateInfo] = None
    chain_valid: Optional[bool] = None
    revoked: Optional[bool] = None
    revocation_checked: bool = False
    timestamp: Optional[datetime] = None
    signature_type: Optional[str] = None  # XAdES-BES, XAdES-T, etc.
    errors: list[str] = []
    warnings: list[str] = []