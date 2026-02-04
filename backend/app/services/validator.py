"""
Servicio de validación de firmas XAdES para Facturae
"""

from datetime import datetime, timezone
from typing import Optional
import re

from lxml import etree
from cryptography import x509
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa, ec
from cryptography.x509.oid import NameOID
import requests

from ..models.response import SignatureResponse, SignerInfo, CertificateInfo


# Namespaces comunes en Facturae firmadas
NAMESPACES = {
    "ds": "http://www.w3.org/2000/09/xmldsig#",
    "xades": "http://uri.etsi.org/01903/v1.3.2#",
    "fe": "http://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2.xml",
}


def validate_xades_signature(xml_content: bytes) -> SignatureResponse:
    """
    Valida una firma XAdES en un documento XML.

    Args:
        xml_content: Contenido del archivo XML en bytes

    Returns:
        SignatureResponse con los resultados de la validación
    """
    errors: list[str] = []
    warnings: list[str] = []

    try:
        # Parsear XML
        try:
            doc = etree.fromstring(xml_content)
        except etree.XMLSyntaxError as e:
            return SignatureResponse(
                valid=False,
                errors=[f"XML inválido: {str(e)}"]
            )

        # Buscar elemento Signature
        signature = doc.find(".//ds:Signature", namespaces=NAMESPACES)
        if signature is None:
            return SignatureResponse(
                valid=None,
                errors=["No se encontró firma digital en el documento"],
                warnings=["El documento no está firmado"]
            )

        # Extraer certificado
        cert_b64 = signature.findtext(".//ds:X509Certificate", namespaces=NAMESPACES)
        if not cert_b64:
            return SignatureResponse(
                valid=False,
                errors=["No se encontró certificado X509 en la firma"]
            )

        # Decodificar y parsear certificado
        try:
            import base64
            cert_der = base64.b64decode(cert_b64)
            cert = x509.load_der_x509_certificate(cert_der)
        except Exception as e:
            return SignatureResponse(
                valid=False,
                errors=[f"Error al parsear certificado: {str(e)}"]
            )

        # Extraer información del certificado
        cert_info = extract_certificate_info(cert)
        signer_info = extract_signer_info(cert)

        # Verificar validez temporal del certificado
        now = datetime.now(timezone.utc)
        if cert.not_valid_before_utc > now:
            errors.append("El certificado aún no es válido")
            cert_info.is_expired = True
        elif cert.not_valid_after_utc < now:
            errors.append("El certificado ha expirado")
            cert_info.is_expired = True

        # Detectar tipo de firma XAdES
        signature_type = detect_xades_type(signature)

        # Verificar firma matemáticamente
        signature_valid = verify_signature_value(doc, signature, cert)

        if not signature_valid:
            errors.append("La firma digital no es válida matemáticamente")

        # Intentar verificar revocación (OCSP)
        revoked = None
        revocation_checked = False
        try:
            revoked, revocation_checked = check_revocation_status(cert)
            if revoked:
                errors.append("El certificado ha sido revocado")
        except Exception as e:
            warnings.append(f"No se pudo verificar revocación: {str(e)}")

        # Extraer timestamp si existe
        timestamp = extract_timestamp(signature)

        # Determinar validez final
        is_valid = signature_valid and not cert_info.is_expired and not revoked

        return SignatureResponse(
            valid=is_valid,
            signer=signer_info,
            certificate=cert_info,
            chain_valid=None,  # Requiere trust store completo
            revoked=revoked,
            revocation_checked=revocation_checked,
            timestamp=timestamp,
            signature_type=signature_type,
            errors=errors,
            warnings=warnings
        )

    except Exception as e:
        return SignatureResponse(
            valid=False,
            errors=[f"Error inesperado: {str(e)}"]
        )


def extract_certificate_info(cert: x509.Certificate) -> CertificateInfo:
    """Extrae información del certificado X509"""
    try:
        issuer = cert.issuer.get_attributes_for_oid(NameOID.COMMON_NAME)
        issuer_name = issuer[0].value if issuer else str(cert.issuer)

        subject = cert.subject.get_attributes_for_oid(NameOID.COMMON_NAME)
        subject_name = subject[0].value if subject else str(cert.subject)

        return CertificateInfo(
            issuer=issuer_name,
            subject=subject_name,
            serial=str(cert.serial_number),
            valid_from=cert.not_valid_before_utc,
            valid_to=cert.not_valid_after_utc,
            is_expired=False
        )
    except Exception:
        return CertificateInfo()


def extract_signer_info(cert: x509.Certificate) -> SignerInfo:
    """Extrae información del firmante del certificado"""
    try:
        # Nombre común
        cn = cert.subject.get_attributes_for_oid(NameOID.COMMON_NAME)
        name = cn[0].value if cn else None

        # Organización
        org = cert.subject.get_attributes_for_oid(NameOID.ORGANIZATION_NAME)
        organization = org[0].value if org else None

        # NIF/CIF - buscar en varios campos
        tax_id = None
        serial_number = cert.subject.get_attributes_for_oid(NameOID.SERIAL_NUMBER)
        if serial_number:
            # El serialNumber suele contener el NIF en certificados españoles
            sn = serial_number[0].value
            # Extraer NIF (formato: IDCES-12345678A o similar)
            nif_match = re.search(r"[A-Z]?\d{7,8}[A-Z]", sn)
            if nif_match:
                tax_id = nif_match.group()
            else:
                tax_id = sn

        # Email
        email = None
        try:
            san = cert.extensions.get_extension_for_oid(x509.oid.ExtensionOID.SUBJECT_ALTERNATIVE_NAME)
            for name_entry in san.value:
                if isinstance(name_entry, x509.RFC822Name):
                    email = name_entry.value
                    break
        except x509.ExtensionNotFound:
            pass

        return SignerInfo(
            name=name,
            tax_id=tax_id,
            organization=organization,
            email=email
        )
    except Exception:
        return SignerInfo()


def detect_xades_type(signature: etree._Element) -> Optional[str]:
    """Detecta el tipo de firma XAdES"""
    # Buscar elementos XAdES
    qualifying_props = signature.find(".//xades:QualifyingProperties", namespaces=NAMESPACES)
    if qualifying_props is None:
        return "XMLDSig"  # Firma básica sin XAdES

    # Buscar timestamp
    signature_timestamp = signature.find(".//xades:SignatureTimeStamp", namespaces=NAMESPACES)

    # Buscar referencias de validación
    complete_cert_refs = signature.find(".//xades:CompleteCertificateRefs", namespaces=NAMESPACES)
    complete_revoc_refs = signature.find(".//xades:CompleteRevocationRefs", namespaces=NAMESPACES)

    if complete_cert_refs is not None and complete_revoc_refs is not None:
        if signature_timestamp is not None:
            return "XAdES-XL"
        return "XAdES-C"
    elif signature_timestamp is not None:
        return "XAdES-T"
    else:
        return "XAdES-BES"


def verify_signature_value(
    doc: etree._Element,
    signature: etree._Element,
    cert: x509.Certificate
) -> bool:
    """
    Verifica la firma digital matemáticamente.

    Nota: Esta es una verificación simplificada.
    Para producción, usar signxml o librería similar.
    """
    try:
        # Obtener SignatureValue
        sig_value_b64 = signature.findtext(".//ds:SignatureValue", namespaces=NAMESPACES)
        if not sig_value_b64:
            return False

        import base64
        signature_bytes = base64.b64decode(sig_value_b64.replace("\n", "").replace(" ", ""))

        # Obtener SignedInfo (lo que se firma)
        signed_info = signature.find(".//ds:SignedInfo", namespaces=NAMESPACES)
        if signed_info is None:
            return False

        # Canonicalizar SignedInfo
        signed_info_c14n = etree.tostring(signed_info, method="c14n", exclusive=True)

        # Obtener clave pública
        public_key = cert.public_key()

        # Determinar algoritmo de firma
        sig_method = signature.find(".//ds:SignatureMethod", namespaces=NAMESPACES)
        algorithm = sig_method.get("Algorithm") if sig_method is not None else ""

        # Verificar según tipo de clave
        try:
            if isinstance(public_key, rsa.RSAPublicKey):
                # RSA con PKCS1v15
                if "sha256" in algorithm.lower():
                    hash_alg = hashes.SHA256()
                elif "sha512" in algorithm.lower():
                    hash_alg = hashes.SHA512()
                else:
                    hash_alg = hashes.SHA1()

                public_key.verify(
                    signature_bytes,
                    signed_info_c14n,
                    padding.PKCS1v15(),
                    hash_alg
                )
                return True
            elif isinstance(public_key, ec.EllipticCurvePublicKey):
                # ECDSA
                if "sha256" in algorithm.lower():
                    hash_alg = hashes.SHA256()
                elif "sha512" in algorithm.lower():
                    hash_alg = hashes.SHA512()
                else:
                    hash_alg = hashes.SHA1()

                public_key.verify(
                    signature_bytes,
                    signed_info_c14n,
                    ec.ECDSA(hash_alg)
                )
                return True
            else:
                # Tipo de clave no soportado
                return False
        except Exception:
            return False

    except Exception:
        return False


def check_revocation_status(cert: x509.Certificate) -> tuple[Optional[bool], bool]:
    """
    Verifica el estado de revocación del certificado via OCSP.

    Returns:
        Tuple de (revoked: bool | None, checked: bool)
    """
    try:
        # Buscar URL de OCSP en el certificado
        try:
            aia = cert.extensions.get_extension_for_oid(
                x509.oid.ExtensionOID.AUTHORITY_INFORMATION_ACCESS
            )
            ocsp_url = None
            for access in aia.value:
                if access.access_method == x509.oid.AuthorityInformationAccessOID.OCSP:
                    ocsp_url = access.access_location.value
                    break

            if not ocsp_url:
                return None, False

            # Por simplicidad, no implementamos la petición OCSP completa aquí
            # En producción, usar una librería como ocspbuilder
            return None, False

        except x509.ExtensionNotFound:
            return None, False

    except Exception:
        return None, False


def extract_timestamp(signature: etree._Element) -> Optional[datetime]:
    """Extrae el timestamp de la firma si existe"""
    try:
        # Buscar SigningTime en XAdES
        signing_time = signature.findtext(
            ".//xades:SigningTime",
            namespaces=NAMESPACES
        )
        if signing_time:
            return datetime.fromisoformat(signing_time.replace("Z", "+00:00"))

        # Buscar en SignatureTimeStamp
        timestamp = signature.find(".//xades:SignatureTimeStamp", namespaces=NAMESPACES)
        if timestamp is not None:
            encapsulated = timestamp.findtext(".//xades:EncapsulatedTimeStamp", namespaces=NAMESPACES)
            if encapsulated:
                # El timestamp está en formato ASN.1, necesitaría parsing adicional
                pass

        return None
    except Exception:
        return None