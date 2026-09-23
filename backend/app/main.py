import os
import re
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from .database import init_db
from .import_questions import import_questions_to_db
from .routers import contestant_router, admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context to safely initialize the SQLite database and verify 50 questions."""
    init_db()
    try:
        imported_count = import_questions_to_db(force=False)
        print(f"[CTF Platform] Database initialized. Verified {imported_count} authoritative questions in SQLite.")
    except Exception as e:
        print(f"[CTF Platform] Note during question import check: {e}")
    yield
    print("[CTF Platform] Shutting down backend.")

app = FastAPI(
    title="Cybersecurity CTF Quiz Platform API",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    redoc_url=None,
    redirect_slashes=False,
    lifespan=lifespan
)

# ── CORS ────────────────────────────────────────────────────────────────────
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Enforces standard security headers across all API endpoints."""
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Cache-Control"] = "no-store, max-age=0"
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to sanitize internal errors.
    Prevents leakage of tracebacks, database paths, SQL query details, or secrets.
    """
    if isinstance(exc, HTTPException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    import logging
    logging.exception("Unhandled server exception occurred: %s", str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# ── Register API Routers under both /api and root ───────────────────────────
# This ensures full compatibility whether Vercel strips /api or keeps it intact
app.include_router(contestant_router, prefix="/api")
app.include_router(contestant_router, prefix="")

app.include_router(admin_router, prefix="/api/admin")
app.include_router(admin_router, prefix="/admin")

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    """System health check endpoint."""
    return {"status": "ok", "platform": "Cybersecurity CTF Quiz Platform API", "version": "1.0.0"}

@app.get("/debug")
@app.get("/api/debug")
def debug_info(request: Request):
    """Debug endpoint to inspect incoming path and scope."""
    return {
        "url": str(request.url),
        "path": request.url.path,
        "root_path": request.scope.get("root_path", ""),
        "scope_path": request.scope.get("path", "")
    }
