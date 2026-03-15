# -------- Stage 1: Build frontend --------
FROM oven/bun:1 AS frontend-builder

WORKDIR /app/frontend

# Install deps (cacheable layer)
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY frontend/ .

# Build production assets
RUN bun run build


# -------- Stage 2: Python backend --------
FROM python:3.12-slim

WORKDIR /app

# System deps (for lxml, cryptography, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libxml2-dev \
    libxslt1-dev \
    libffi-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

# Install Python deps (cached layer)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy backend code
COPY backend/ backend/

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist frontend/dist

# Expose FastAPI port
EXPOSE 8000

# Run server (exec form)
CMD ["uv", "run", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]