#!/usr/bin/env python3
"""
Script para firmar facturas Facturae de prueba con un certificado autofirmado.

La firma generada es técnicamente válida (verificable matemáticamente),
aunque el certificado no sea de una CA oficial.

Uso:
    cd facturaview
    uv run python scripts/sign_fixtures.py
"""

import os
from pathlib import Path
from datetime import datetime, timedelta
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from lxml import etree
from signxml import XMLSigner, methods

# Configuración
FIXTURES_DIR = Path(__file__).parent.parent / "frontend" / "tests" / "fixtures"
CERTS_DIR = Path(__file__).parent / "certs"

# Archivos a firmar (solo los que no están ya firmados)
FILES_TO_SIGN = [
    "simple-322.xml",
    "simple-321.xml",
]


def generate_test_certificate():
    """Genera un par de claves RSA y un certificado X.509 autofirmado."""
    print("Generando certificado de prueba...")

    # Generar clave privada RSA
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )

    # Datos del certificado (empresa ficticia de prueba)
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "ES"),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Madrid"),
        x509.NameAttribute(NameOID.LOCALITY_NAME, "Madrid"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Empresa de Prueba SL"),
        x509.NameAttribute(NameOID.ORGANIZATIONAL_UNIT_NAME, "Departamento de Facturación"),
        x509.NameAttribute(NameOID.COMMON_NAME, "Certificado de Prueba FacturaView"),
        x509.NameAttribute(NameOID.SERIAL_NUMBER, "B12345678"),  # NIF ficticio
    ])

    # Crear certificado
    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(private_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.utcnow())
        .not_valid_after(datetime.utcnow() + timedelta(days=365))
        .add_extension(
            x509.BasicConstraints(ca=False, path_length=None),
            critical=True,
        )
        .add_extension(
            x509.KeyUsage(
                digital_signature=True,
                content_commitment=True,  # Non-repudiation
                key_encipherment=False,
                data_encipherment=False,
                key_agreement=False,
                key_cert_sign=False,
                crl_sign=False,
                encipher_only=False,
                decipher_only=False,
            ),
            critical=True,
        )
        .sign(private_key, hashes.SHA256())
    )

    return private_key, cert


def sign_facturae(xml_path: Path, private_key, cert) -> bytes:
    """Firma un archivo Facturae con XAdES-EPES."""
    print(f"  Firmando {xml_path.name}...")

    # Leer XML
    with open(xml_path, "rb") as f:
        xml_content = f.read()

    # Parsear XML
    root = etree.fromstring(xml_content)

    # Crear firmador XAdES
    signer = XMLSigner(
        method=methods.enveloped,
        signature_algorithm="rsa-sha256",
        digest_algorithm="sha256",
        c14n_algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    )

    # Serializar clave y certificado
    key_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )

    cert_pem = cert.public_bytes(serialization.Encoding.PEM)

    # Firmar
    signed_root = signer.sign(
        root,
        key=key_pem,
        cert=cert_pem,
    )

    # Serializar resultado
    return etree.tostring(
        signed_root,
        xml_declaration=True,
        encoding="UTF-8",
        pretty_print=True,
    )


def main():
    print("=" * 60)
    print("Firmador de facturas Facturae para pruebas")
    print("=" * 60)
    print()

    # Crear directorio de certificados si no existe
    CERTS_DIR.mkdir(parents=True, exist_ok=True)

    # Generar certificado de prueba
    private_key, cert = generate_test_certificate()

    # Guardar certificado para referencia
    cert_path = CERTS_DIR / "test_cert.pem"
    with open(cert_path, "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))
    print(f"Certificado guardado en: {cert_path}")
    print()

    # Firmar cada archivo
    print("Firmando facturas:")
    for filename in FILES_TO_SIGN:
        xml_path = FIXTURES_DIR / filename
        if not xml_path.exists():
            print(f"  ⚠️  {filename} no encontrado, saltando...")
            continue

        try:
            signed_xml = sign_facturae(xml_path, private_key, cert)

            # Guardar archivo firmado
            output_name = xml_path.stem + "-signed.xsig.xml"
            output_path = FIXTURES_DIR / output_name
            with open(output_path, "wb") as f:
                f.write(signed_xml)

            print(f"  ✅ {output_name} creado ({len(signed_xml):,} bytes)")
        except Exception as e:
            print(f"  ❌ Error firmando {filename}: {e}")

    print()
    print("=" * 60)
    print("Completado!")
    print()
    print("Nota: Estas firmas son técnicamente válidas pero usan un")
    print("certificado autofirmado (no de una CA oficial).")
    print("Son útiles para probar la validación técnica de firmas.")
    print("=" * 60)


if __name__ == "__main__":
    main()
