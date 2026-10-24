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
from routers import export, payment, stream, survey, telegram

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

# ── Routers (Direct & /api alias for universal proxy/webhook compatibility) ──
app.include_router(survey.router)
app.include_router(stream.router)
app.include_router(payment.router)
app.include_router(export.router)
app.include_router(telegram.router)

app.include_router(survey.router, prefix="/api")
app.include_router(stream.router, prefix="/api")
app.include_router(payment.router, prefix="/api")
app.include_router(export.router, prefix="/api")
app.include_router(telegram.router, prefix="/api")


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint cho Render/Railway kèm trạng thái cấu hình."""
    return {
        "status": "ok",
        "service": "AI Market Research Platform",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "config_check": {
            "database_url": bool(os.getenv("DATABASE_URL")),
            "openai_api_key": bool(os.getenv("OPENAI_API_KEY")),
            "deepseek_api_key": bool(os.getenv("DEEPSEEK_API_KEY")),
            "sepay_api_token": bool(os.getenv("SEPAY_API_TOKEN")),
            "r2_configured": bool(os.getenv("R2_ACCESS_KEY_ID") and os.getenv("R2_SECRET_ACCESS_KEY")),
            "resend_api_key": bool(os.getenv("RESEND_API_KEY")),
            "telegram_bot_token": bool(os.getenv("TELEGRAM_BOT_TOKEN")),
        },
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
