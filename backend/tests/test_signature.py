"""
Tests para el endpoint de validación de firma
"""

import pytest
from httpx import AsyncClient, ASGITransport

try:
    # Running from root: uv run pytest
    from backend.main import app
except ImportError:
    # Running from backend/: cd backend && uv run pytest
    from main import app


@pytest.fixture
def unsigned_xml():
    """Factura sin firma"""
    return b"""<?xml version="1.0" encoding="UTF-8"?>
<fe:Facturae xmlns:fe="http://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2.xml">
    <FileHeader>
        <SchemaVersion>3.2.2</SchemaVersion>
        <Modality>I</Modality>
        <InvoiceIssuerType>EM</InvoiceIssuerType>
    </FileHeader>
    <Parties>
        <SellerParty>
            <TaxIdentification>
                <PersonTypeCode>J</PersonTypeCode>
                <TaxIdentificationNumber>A12345678</TaxIdentificationNumber>
            </TaxIdentification>
        </SellerParty>
    </Parties>
    <Invoices>
        <Invoice>
            <InvoiceHeader>
                <InvoiceNumber>001</InvoiceNumber>
                <InvoiceDocumentType>FC</InvoiceDocumentType>
                <InvoiceClass>OO</InvoiceClass>
            </InvoiceHeader>
        </Invoice>
    </Invoices>
</fe:Facturae>"""


@pytest.fixture
def invalid_xml():
    """XML malformado"""
    return b"<invalid><not-closed>"


@pytest.fixture
def not_xml():
    """Archivo que no es XML"""
    return b"This is just plain text, not XML"


@pytest.mark.asyncio
async def test_health_check():
    """Test del endpoint de health"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test del endpoint raíz - sirve frontend si está buildeado, 404 si no"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")

    # Si frontend/dist existe, sirve index.html (200)
    # Si no existe, devuelve 404
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_validate_unsigned_xml(unsigned_xml):
    """Test con XML sin firma"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/validate-signature",
            files={"file": ("factura.xml", unsigned_xml, "application/xml")}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is None  # No hay firma que validar
    assert "No se encontró firma" in data["errors"][0]


@pytest.mark.asyncio
async def test_validate_invalid_xml(invalid_xml):
    """Test con XML malformado"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/validate-signature",
            files={"file": ("factura.xml", invalid_xml, "application/xml")}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False
    assert any("XML inválido" in err for err in data["errors"])


@pytest.mark.asyncio
async def test_reject_non_xml_extension():
    """Test que rechaza archivos sin extensión XML"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/validate-signature",
            files={"file": ("factura.txt", b"content", "text/plain")}
        )

    assert response.status_code == 400
    assert "Formato no soportado" in response.json()["detail"]


@pytest.mark.asyncio
async def test_reject_large_file():
    """Test que rechaza archivos mayores a 10MB"""
    large_content = b"x" * (11 * 1024 * 1024)  # 11 MB

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/validate-signature",
            files={"file": ("factura.xml", large_content, "application/xml")}
        )

    assert response.status_code == 400
    assert "demasiado grande" in response.json()["detail"]


@pytest.mark.asyncio
async def test_accept_xsig_extension(unsigned_xml):
    """Test que acepta archivos .xsig"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/validate-signature",
            files={"file": ("factura.xsig", unsigned_xml, "application/xml")}
        )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_no_file_provided():
    """Test sin archivo"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/validate-signature")

    assert response.status_code == 422  # Validation error


# =============================================================================
# Tests con factura firmada oficial del gobierno (@firma)
# =============================================================================

@pytest.fixture
def signed_government_xml():
    """
    Factura firmada oficial del repositorio del gobierno español.
    Fuente: https://github.com/ctt-gob-es/clienteafirma
    Versión: Facturae 3.2
    Firma: XAdES-EPES con certificado de prueba MITyC
    """
    from pathlib import Path

    # Buscar el fixture en la ruta correcta
    fixture_path = Path(__file__).parent.parent.parent / "frontend" / "tests" / "fixtures" / "signed-sample-32.xsig.xml"

    if not fixture_path.exists():
        pytest.skip(f"Fixture no encontrado: {fixture_path}")

    return fixture_path.read_bytes()


@pytest.mark.asyncio
async def test_validate_signed_government_invoice(signed_government_xml):
    """
    Test con factura firmada oficial del gobierno.

    Esta factura tiene una firma XAdES-EPES válida generada con
    certificado de prueba del Ministerio (MITyC DNIe Pruebas).
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/validate-signature",
            files={"file": ("signed-sample-32.xsig.xml", signed_government_xml, "application/xml")}
        )

    assert response.status_code == 200
    data = response.json()

    # Debe detectar que hay firma
    assert data["signer"] is not None, "Debe detectar información del firmante"
    assert data["certificate"] is not None, "Debe detectar información del certificado"

    # Verificar datos del firmante (certificado de prueba MITyC)
    assert data["signer"]["name"] is not None
    # El certificado es de "Usuario 54" o similar del MITyC

    # Verificar datos del certificado
    assert data["certificate"]["issuer"] is not None
    assert data["certificate"]["serial"] is not None

    # El tipo de firma debe ser XMLDSig o alguna variante XAdES
    assert data["signature_type"] in ["XMLDSig", "XAdES", "XAdES-BES", "XAdES-EPES", "XAdES-T"]


@pytest.mark.asyncio
async def test_signed_government_invoice_extracts_certificate_details(signed_government_xml):
    """
    Verifica que se extraen correctamente los detalles del certificado
    de la factura firmada del gobierno.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/validate-signature",
            files={"file": ("signed-sample-32.xsig.xml", signed_government_xml, "application/xml")}
        )

    assert response.status_code == 200
    data = response.json()

    # El certificado de prueba del MITyC tiene estos datos
    cert = data["certificate"]
    assert cert is not None

    # Verificar que se extraen las fechas de validez
    assert cert["valid_from"] is not None
    assert cert["valid_to"] is not None

    # El certificado de prueba está expirado (era de 2009-2010)
    assert cert["is_expired"] is True, "El certificado de prueba del gobierno está expirado"


@pytest.mark.asyncio
async def test_signed_government_invoice_has_signature_info(signed_government_xml):
    """
    Verifica que se detecta la firma aunque el certificado esté expirado.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/validate-signature",
            files={"file": ("signed-sample-32.xsig.xml", signed_government_xml, "application/xml")}
        )

    assert response.status_code == 200
    data = response.json()

    # Aunque la validación completa puede fallar (certificado expirado),
    # debe detectar que hay una firma y extraer la información
    assert "errors" in data

    # La firma existe, aunque pueda no ser válida por expiración
    signer = data["signer"]
    assert signer is not None

    # Debe tener algún nombre del firmante
    assert signer["name"] is not None and len(signer["name"]) > 0