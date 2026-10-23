"""
FastAPI Application Entry Point
AI Synthetic Market Research Platform — Backend
"""

import os
import sys
from contextlib import asynccontextmanager

# Fix Windows console encoding for Unicode/emoji in logs
if sys.platform == "win32":
    os.environ.setdefault("PYTHONUTF8", "1")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import structlog
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()

from database import init_db
from routers import export, payment, stream, survey

log = structlog.get_logger(__name__)

# ── Rate limiter ───────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown events."""
    # Khởi tạo database tables
    init_db()
    log.info("Database initialized")

    # Tạo thư mục PDFs nếu chưa có
    os.makedirs("./pdfs", exist_ok=True)
    log.info("PDF directory ready")

    log.info(
        "[START] AI Market Research Platform ready",
        environment=os.getenv("ENVIRONMENT", "development"),
        port=os.getenv("PORT", "8000"),
    )
    yield
    log.info("[STOP] Server shutting down")


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Synthetic Market Research API",
    description="Platform khảo sát thị trường giả lập — 1.000 AI personas trong 60 giây",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ───────────────────────────────────────────────────────────────────────
cors_origins_str = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,https://your-app.vercel.app"
)
cors_origins = [o.strip() for o in cors_origins_str.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(survey.router)
app.include_router(stream.router)
app.include_router(payment.router)
app.include_router(export.router)


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint cho Render/Railway."""
    return {
        "status": "ok",
        "service": "AI Market Research Platform",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development"),
    }


@app.get("/", tags=["System"])
async def root():
    return {"message": "AI Synthetic Market Research API", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    raw_port = os.getenv("PORT", "8000")
    try:
        port = int(raw_port)
    except (ValueError, TypeError):
        port = 8000
    log.info(f"Starting server on 0.0.0.0:{port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")
