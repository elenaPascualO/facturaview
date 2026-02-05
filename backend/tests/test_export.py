"""
Tests para el endpoint de exportación a Excel
"""

import pytest
from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)

# Datos de factura de ejemplo
SAMPLE_INVOICE_DATA = {
    "version": "3.2.2",
    "fileHeader": {
        "currencyCode": "EUR",
    },
    "seller": {
        "name": "Empresa Emisora S.L.",
        "taxId": "B12345678",
        "address": {
            "street": "Calle Principal 123",
            "postCode": "28001",
            "town": "Madrid",
            "province": "Madrid",
        },
    },
    "buyer": {
        "name": "Cliente Receptor S.A.",
        "taxId": "A87654321",
        "address": {
            "street": "Avenida Secundaria 456",
            "postCode": "08001",
            "town": "Barcelona",
            "province": "Barcelona",
        },
    },
    "invoices": [
        {
            "series": "2024",
            "number": "001",
            "issueDate": "2024-01-15",
            "lines": [
                {
                    "description": "Servicio de consultoría",
                    "quantity": 10,
                    "unitPrice": 100.00,
                    "taxRate": 21,
                    "grossAmount": 1000.00,
                },
                {
                    "description": "Desarrollo de software",
                    "quantity": 5,
                    "unitPrice": 200.00,
                    "taxRate": 21,
                    "grossAmount": 1000.00,
                },
            ],
            "taxes": [
                {
                    "type": "01",
                    "rate": 21,
                    "base": 2000.00,
                    "amount": 420.00,
                },
            ],
            "totals": {
                "grossAmount": 2000.00,
                "taxOutputs": 420.00,
                "taxesWithheld": 0,
                "invoiceTotal": 2420.00,
                "totalToPay": 2420.00,
            },
            "payment": {
                "paymentMeans": "04",
                "dueDate": "2024-02-15",
                "iban": "ES12 3456 7890 1234 5678 9012",
                "bic": "ABCDESMMXXX",
            },
        }
    ],
}


def test_export_excel_success():
    """Test exportación exitosa a Excel"""
    response = client.post(
        "/api/export/excel",
        json={"data": SAMPLE_INVOICE_DATA},
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    assert "attachment" in response.headers["content-disposition"]
    assert ".xlsx" in response.headers["content-disposition"]
    assert len(response.content) > 0


def test_export_excel_with_lang_en():
    """Test exportación en inglés"""
    response = client.post(
        "/api/export/excel",
        json={"data": SAMPLE_INVOICE_DATA, "lang": "en"},
    )

    assert response.status_code == 200
    assert len(response.content) > 0


def test_export_excel_custom_filename():
    """Test exportación con nombre de archivo personalizado"""
    response = client.post(
        "/api/export/excel",
        json={"data": SAMPLE_INVOICE_DATA, "filename": "mi-factura.xlsx"},
    )

    assert response.status_code == 200
    assert "mi-factura.xlsx" in response.headers["content-disposition"]


def test_export_excel_no_data():
    """Test error cuando no hay datos"""
    response = client.post(
        "/api/export/excel",
        json={"data": {}},
    )

    assert response.status_code == 400
    # Empty dict returns "No hay facturas" because invoices list is empty
    assert response.json()["detail"] in ["No hay facturas en los datos", "No se proporcionaron datos"]


def test_export_excel_no_invoices():
    """Test error cuando no hay facturas en los datos"""
    response = client.post(
        "/api/export/excel",
        json={"data": {"version": "3.2.2", "invoices": []}},
    )

    assert response.status_code == 400


def test_export_excel_invalid_invoice_index():
    """Test error con índice de factura inválido"""
    response = client.post(
        "/api/export/excel",
        json={"data": SAMPLE_INVOICE_DATA, "invoice_index": 99},
    )

    assert response.status_code == 400
    assert "Índice de factura inválido" in response.json()["detail"]


def test_export_excel_with_retention():
    """Test exportación con retenciones IRPF"""
    data_with_retention = {
        **SAMPLE_INVOICE_DATA,
        "invoices": [
            {
                **SAMPLE_INVOICE_DATA["invoices"][0],
                "totals": {
                    "grossAmount": 2000.00,
                    "taxOutputs": 420.00,
                    "taxesWithheld": 300.00,
                    "invoiceTotal": 2120.00,
                    "totalToPay": 2120.00,
                },
            }
        ],
    }

    response = client.post(
        "/api/export/excel",
        json={"data": data_with_retention},
    )

    assert response.status_code == 200
    assert len(response.content) > 0


def test_export_excel_minimal_data():
    """Test exportación con datos mínimos"""
    minimal_data = {
        "version": "3.2.2",
        "invoices": [
            {
                "number": "001",
                "issueDate": "2024-01-15",
                "lines": [],
                "taxes": [],
                "totals": {
                    "totalToPay": 0,
                },
            }
        ],
    }

    response = client.post(
        "/api/export/excel",
        json={"data": minimal_data},
    )

    assert response.status_code == 200
