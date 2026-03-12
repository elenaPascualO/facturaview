"""
FacturaView API - Validación de firmas digitales
"""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

try:
    # Production: running from root with 'backend.main:app'
    from backend.app.routes import signature_router, export_router
except ImportError:
    # Development: running from backend/ with 'main:app'
    from app.routes import signature_router, export_router

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
app.include_router(export_router)


@app.get("/health")
async def health_check():
    """Health check para Railway"""
    return {"status": "ok", "service": "facturaview-api"}


# Montar frontend estático (en producción)
# Debe ir al final para que las rutas API tengan prioridad
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"

# SPA fallback: serve index.html for unknown routes (not API)
if frontend_dist.exists():
    @app.exception_handler(404)
    async def spa_fallback(request: Request, exc):
        api_prefixes = ("/api/", "/health", "/docs", "/redoc", "/openapi.json")
        if not request.url.path.startswith(api_prefixes):
            return FileResponse(frontend_dist / "index.html")
        return JSONResponse({"detail": "Not Found"}, status_code=404)

    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")