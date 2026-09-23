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
    imported_count = import_questions_to_db(force=False)
    print(f"[CTF Platform] Database initialized. Verified {imported_count} authoritative questions in SQLite.")
    yield
    print("[CTF Platform] Shutting down backend.")

app = FastAPI(
    title="Cybersecurity CTF Quiz Platform API",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    redoc_url=None,
    lifespan=lifespan
)

# ── CORS ────────────────────────────────────────────────────────────────────
_STATIC_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://quiz-cxh-cy.vercel.app",
    "https://quiz-cxh-admin.vercel.app",
    "https://quiz-cxh.vercel.app",
]

_extra = os.environ.get("ALLOWED_ORIGINS_EXTRA", "")
_EXTRA_ORIGINS = [o.strip() for o in _extra.split(",") if o.strip()]

ALLOWED_ORIGINS = _STATIC_ORIGINS + _EXTRA_ORIGINS

class FlexibleCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "")
        is_allowed = (
            origin in ALLOWED_ORIGINS
            or origin.endswith(".vercel.app")
            or re.match(r"^https://[a-zA-Z0-9\-_.]+\.vercel\.app$", origin)
            or not origin
        )

        req_headers = request.headers.get("access-control-request-headers", "Authorization, Content-Type, X-Tab-ID")

        if request.method == "OPTIONS" and is_allowed:
            response = Response()
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = req_headers
            response.headers["Access-Control-Max-Age"] = "86400"
            return response

        response = await call_next(request)

        if is_allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = req_headers

        return response

app.add_middleware(FlexibleCORSMiddleware)

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
