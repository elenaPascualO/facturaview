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
async def test_root_endpoint_without_static_files():
    """Test del endpoint raíz sin archivos estáticos (dev/test mode)"""
    # En desarrollo/test, el frontend no está buildeado, así que / devuelve 404
    # En producción, / sirve el index.html del frontend
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")

    # Sin frontend/dist, no hay handler para /
    assert response.status_code == 404


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