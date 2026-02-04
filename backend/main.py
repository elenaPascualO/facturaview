"""
FacturaView API - Validación de firmas digitales
"""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

try:
    # Production: running from root with 'backend.main:app'
    from backend.app.routes import signature_router
except ImportError:
    # Development: running from backend/ with 'main:app'
    from app.routes import signature_router

app = FastAPI(
    title="FacturaView API",
    description="API de validación de firmas digitales para facturas Facturae",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS - permitir frontend en desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Dev
        "http://localhost:4173",  # Preview
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Registrar rutas API
app.include_router(signature_router)


@app.get("/health")
async def health_check():
    """Health check para Railway"""
    return {"status": "ok", "service": "facturaview-api"}


# Montar frontend estático (en producción)
# Debe ir al final para que las rutas API tengan prioridad
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"

if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")