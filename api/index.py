import sys
import os

# Add root directory and backend directory to sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)
sys.path.insert(0, os.path.join(ROOT_DIR, "backend"))

try:
    from backend.app.main import app as _fastapi_app
except ImportError:
    from app.main import app as _fastapi_app

class VercelPathMiddleware:
    """
    ASGI middleware for Vercel Serverless Functions.
    Restores original request path from Vercel internal headers or strips
    /api/index.py rewriting prefixes so FastAPI routes always match correctly.
    """
    def __init__(self, asgi_app):
        self.asgi_app = asgi_app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            headers_dict = dict(scope.get("headers", []))
            
            # 1. Try Vercel's x-matched-path header (contains original client request URL)
            matched_path = headers_dict.get(b"x-matched-path") or headers_dict.get(b"x-forwarded-uri")
            if matched_path:
                try:
                    orig = matched_path.decode("utf-8").split("?")[0]
                    if orig and not orig.endswith(".py"):
                        scope["path"] = orig
                        scope["raw_path"] = orig.encode("utf-8")
                except Exception:
                    pass
            
            # 2. If path is still /api/index.py or /api/index, strip that prefix
            path = scope.get("path", "")
            for prefix in ["/api/index.py", "/api/index"]:
                if path == prefix:
                    scope["path"] = "/"
                    scope["raw_path"] = b"/"
                    break
                elif path.startswith(prefix + "/"):
                    new_path = path[len(prefix):]
                    scope["path"] = new_path
                    scope["raw_path"] = new_path.encode("utf-8")
                    break

        await self.asgi_app(scope, receive, send)

app = VercelPathMiddleware(_fastapi_app)
