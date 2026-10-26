"""
Database setup: SQLAlchemy + SQLite (async).
Auto-tạo tables khi khởi động server.
"""

from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Integer, String, Text, create_engine
)
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import StaticPool

import os
from pathlib import Path
from dotenv import load_dotenv

_backend_env = Path(__file__).resolve().parent / ".env"
if _backend_env.exists():
    load_dotenv(dotenv_path=_backend_env)
else:
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./surveys.db")

# Chuẩn hóa URL cho Supabase / PostgreSQL (SQLAlchemy yêu cầu postgresql:// thay vì postgres://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    # Supabase PostgreSQL / Cloud Postgres
    connect_args = {}
    if "sslmode" not in DATABASE_URL and "localhost" not in DATABASE_URL and "127.0.0.1" not in DATABASE_URL:
        connect_args["sslmode"] = "require"

    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        pool_recycle=300,
    )
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


# ─── ORM Models ───────────────────────────────────────────────────────────────

class Survey(Base):
    __tablename__ = "surveys"

    id           = Column(String(20), primary_key=True)   # e.g. "PANEL892"
    model_type   = Column(String(50), nullable=False)      # "nielsen_bases" | ...
    status       = Column(String(30), nullable=False, default="PENDING_PAYMENT")
    # PENDING_PAYMENT → PROCESSING → COMPLETED → FAILED

    # Config
    region                = Column(String(100), nullable=True)
    zone                  = Column(String(100), nullable=True)
    min_age               = Column(Integer, default=18)
    max_age               = Column(Integer, default=65)
    sample_size           = Column(Integer, default=1000)
    target_gender         = Column(String(20), nullable=True, default="all")
    target_income         = Column(String(50), nullable=True, default="all")
    target_marital_status = Column(String(50), nullable=True, default="all")
    target_occupation     = Column(String(50), nullable=True, default="all")
    target_zone           = Column(String(50), nullable=True, default="all")
    product_info_json     = Column(Text, nullable=True)   # JSON string
    price_amount          = Column(Integer, nullable=False)  # VND (Số tiền thực tế cần thanh toán)
    original_price        = Column(Integer, nullable=True)   # VND (Số tiền gốc trước giảm giá)
    discount_code         = Column(String(50), nullable=True) # Mã giảm giá đã áp dụng
    discount_amount       = Column(Integer, default=0)       # Số tiền được giảm

    # Kết quả
    result_json = Column(Text, nullable=True)   # Full report JSON
    pdf_path    = Column(String(500), nullable=True)

    # SePay
    sepay_transaction_id = Column(String(100), nullable=True, unique=True)
    paid_at = Column(DateTime, nullable=True)

    # Email
    customer_email = Column(String(200), nullable=True)

    created_at   = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error_msg    = Column(Text, nullable=True)


class DiscountCode(Base):
    __tablename__ = "discount_codes"

    code             = Column(String(50), primary_key=True)   # "OFF100", "OFF50", "OFF30"
    discount_percent = Column(Integer, nullable=False)        # 100, 50, 30
    is_active        = Column(Boolean, default=True)
    max_uses         = Column(Integer, nullable=True)          # NULL = không giới hạn
    used_count       = Column(Integer, default=0)
    description      = Column(String(255), nullable=True)
    created_at       = Column(DateTime, default=datetime.utcnow)


class SurveyLog(Base):
    __tablename__ = "survey_logs"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    survey_id  = Column(String(20), nullable=False, index=True)
    percent    = Column(Integer, nullable=False)
    log_msg    = Column(Text, nullable=False)
    status     = Column(String(20), nullable=True)   # None | "COMPLETED" | "FAILED"
    created_at = Column(DateTime, default=datetime.utcnow)


# ─── B2B Outreach & Automated Cold Email Models ───────────────────────────────

class OutreachLead(Base):
    __tablename__ = "outreach_leads"

    id              = Column(Integer, primary_key=True, autoincrement=True)
    company_name    = Column(String(200), nullable=False)
    contact_name    = Column(String(100), nullable=True)     # Tên người liên hệ (vd: Anh Nam, Chị Hương)
    contact_title   = Column(String(100), nullable=True)     # Chức danh (vd: Giám đốc R&D, Brand Manager, Founder)
    email           = Column(String(200), nullable=False, index=True)
    industry        = Column(String(100), nullable=False, index=True) # fnb, cosmetics, confectionery, etc.
    website         = Column(String(200), nullable=True)
    phone           = Column(String(50), nullable=True)
    status          = Column(String(20), default="PENDING", index=True) # PENDING, SENT, FAILED, UNSUBSCRIBED
    suggested_model = Column(String(50), nullable=True, default="nielsen_bases")
    sample_report_id= Column(String(50), nullable=True, default="DEMO-NIELSEN-BASES")
    sent_count      = Column(Integer, default=0)
    last_sent_at    = Column(DateTime, nullable=True)
    notes           = Column(Text, nullable=True)
    created_at      = Column(DateTime, default=datetime.utcnow)


class OutreachLog(Base):
    __tablename__ = "outreach_logs"

    id                 = Column(Integer, primary_key=True, autoincrement=True)
    lead_id            = Column(Integer, nullable=True, index=True)
    recipient_email    = Column(String(200), nullable=False)
    recipient_name     = Column(String(100), nullable=True)
    company_name       = Column(String(200), nullable=True)
    industry           = Column(String(100), nullable=True)
    subject            = Column(String(300), nullable=False)
    email_body_preview = Column(Text, nullable=True)
    email_body_html    = Column(Text, nullable=True)
    template_type      = Column(String(50), default="sample_report")
    status             = Column(String(20), nullable=False) # "SUCCESS", "FAILED"
    error_message      = Column(Text, nullable=True)
    sent_at            = Column(DateTime, default=datetime.utcnow, index=True)


class OutreachSetting(Base):
    __tablename__ = "outreach_settings"

    key        = Column(String(50), primary_key=True)
    value      = Column(String(255), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ─── Multi-Industry Benchmark Intelligence & Gated Lead Capture ────────────────

class BenchmarkReport(Base):
    """
    Bảng lưu trữ Báo Cáo Đối Sánh Ngành Hàng Kỳ (Industry Benchmarks) đa ngành.
    Hỗ trợ xuất bản theo Tuần/Tháng/Quý/Năm mà không cần sửa code hay build lại web.
    """
    __tablename__ = "benchmark_reports"

    id               = Column(String(100), primary_key=True)   # e.g. "DEMO-NIELSEN-BASES", "BENCHMARK-2026-Q1-FNB"
    title            = Column(String(300), nullable=False)     # Tên hiển thị báo cáo
    slug             = Column(String(200), unique=True, index=True, nullable=False)
    industry         = Column(String(50), nullable=False, index=True) # fnb, cosmetics, appliances, nutrition, lifestyle...
    industry_label   = Column(String(100), nullable=False)
    period_type      = Column(String(30), default="quarterly") # monthly | quarterly | annual | case_study
    period_label     = Column(String(50), default="Quý 1/2026", index=True)
    model_type       = Column(String(50), nullable=False, index=True) # nielsen_bases, van_westendorp, kano, maxdiff...
    model_label      = Column(String(100), nullable=False)
    company_name     = Column(String(200), nullable=False)
    product_name     = Column(String(300), nullable=False)
    sample_size      = Column(Integer, default=1000)
    score_or_verdict = Column(String(100), nullable=True)
    score_number     = Column(Integer, nullable=True)
    score_color      = Column(String(100), nullable=True)
    summary          = Column(Text, nullable=True)
    findings_json    = Column(Text, nullable=True)   # JSON string list
    tags_json        = Column(Text, nullable=True)   # JSON string list
    full_report_json = Column(Text, nullable=False)  # Bản in chiến lược A4 chuyên sâu đa trang (độ dài linh hoạt theo dữ liệu)
    view_count       = Column(Integer, default=0)
    download_count   = Column(Integer, default=0)
    is_published     = Column(Boolean, default=True, index=True)
    created_at       = Column(DateTime, default=datetime.utcnow)
    updated_at       = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ReportDownloadLead(Base):
    """
    Bảng lưu trữ hồ sơ Lead Doanh Nghiệp (B2B) khi tải Bản In Chiến Lược A4.
    Kích hoạt Telegram Bot thông báo tức thì cho Ban Quản Trị.
    """
    __tablename__ = "report_download_leads"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    full_name        = Column(String(100), nullable=False)
    phone_zalo       = Column(String(50), nullable=False, index=True)
    company_name     = Column(String(200), nullable=False)
    work_email       = Column(String(200), nullable=True, index=True)   # Tùy chọn để tối đa hóa conversion
    job_title        = Column(String(100), nullable=True)              # Tùy chọn
    report_id        = Column(String(100), nullable=False, index=True)
    report_title     = Column(String(300), nullable=True)
    industry         = Column(String(50), nullable=True)
    is_work_email    = Column(Boolean, default=False)                  # True nếu tên miền công ty riêng
    lead_score       = Column(String(20), default="WARM")              # 'HOT' (domain công ty) | 'WARM' (gmail/zalo)
    notes            = Column(Text, nullable=True)
    contacted_status = Column(String(30), default="NEW")               # NEW, CONTACTED, PROPOSAL_SENT, CONVERTED
    created_at       = Column(DateTime, default=datetime.utcnow, index=True)


# ─── Helpers ───────────────────────────────────────────────────────────────────

def get_db():
    """FastAPI dependency: yields DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Tạo tất cả tables. Gọi khi startup."""
    Base.metadata.create_all(bind=engine)
