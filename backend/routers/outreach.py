# ==============================================================================
# ROUTER: OUTREACH & B2B EMAIL AUTOMATION
# API quản lý chiến dịch gửi email tự động, kiểm soát hạn mức & nhật ký
# ==============================================================================

import csv
import io
from typing import List, Optional
from datetime import datetime

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import OutreachLead, OutreachLog, get_db
from services.outreach_service import (
    get_outreach_stats,
    get_setting,
    set_setting,
    send_test_email,
    send_outreach_to_lead,
    start_outreach_worker,
)

log = structlog.get_logger(__name__)

router = APIRouter(prefix="/outreach", tags=["Outreach & B2B Automation"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class ToggleBotRequest(BaseModel):
    is_active: bool


class SettingsUpdateRequest(BaseModel):
    daily_limit: Optional[int] = None
    min_interval_seconds: Optional[int] = None
    max_interval_seconds: Optional[int] = None
    ignore_business_hours: Optional[bool] = None


class TestEmailRequest(BaseModel):
    to_email: str
    contact_name: Optional[str] = "Anh Lợi"
    company_name: Optional[str] = "Công ty Thử Nghiệm"
    industry: Optional[str] = "fnb"


class LeadCreateRequest(BaseModel):
    company_name: str
    contact_name: Optional[str] = None
    contact_title: Optional[str] = None
    email: str
    industry: str
    website: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None


class ImportLeadsRequest(BaseModel):
    leads: List[LeadCreateRequest]


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Lấy số liệu thống kê thời gian thực cho trang Admin Outreach."""
    return get_outreach_stats(db)


@router.post("/toggle")
async def toggle_bot(payload: ToggleBotRequest, db: Session = Depends(get_db)):
    """Bật / Tắt tiến trình tự động gửi email."""
    val_str = "true" if payload.is_active else "false"
    set_setting(db, "is_active", val_str)
    
    if payload.is_active:
        start_outreach_worker()

    log.info("Outreach bot toggled", is_active=payload.is_active)
    return {
        "success": True,
        "is_active": payload.is_active,
        "message": "Đã BẬT cỗ máy gửi email tự động" if payload.is_active else "Đã TẠM DỪNG cỗ máy gửi email",
    }


@router.post("/settings")
async def update_settings(payload: SettingsUpdateRequest, db: Session = Depends(get_db)):
    """Cập nhật các tham số an toàn (Hạn mức ngày, thời gian giãn cách...)."""
    if payload.daily_limit is not None:
        set_setting(db, "daily_limit", str(payload.daily_limit))
    if payload.min_interval_seconds is not None:
        set_setting(db, "min_interval", str(payload.min_interval_seconds))
    if payload.max_interval_seconds is not None:
        set_setting(db, "max_interval", str(payload.max_interval_seconds))
    if payload.ignore_business_hours is not None:
        set_setting(db, "ignore_business_hours", "true" if payload.ignore_business_hours else "false")

    return {
        "success": True,
        "message": "Đã cập nhật cấu hình gửi email an toàn",
        "stats": get_outreach_stats(db),
    }


@router.post("/send-test")
async def send_test(payload: TestEmailRequest):
    """Gửi email thử nghiệm ngay tới Founder để kiểm tra hiển thị & inbox."""
    res = send_test_email(
        to_email=payload.to_email,
        contact_name=payload.contact_name or "Anh Lợi",
        company_name=payload.company_name or "Công ty Thử Nghiệm",
        industry_key=payload.industry or "fnb",
    )
    if not res.get("success"):
        raise HTTPException(400, res.get("message", "Lỗi gửi email thử nghiệm"))
    return res


@router.get("/logs")
async def get_logs(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Lấy danh sách nhật ký gửi email (Lọc theo trạng thái, sắp xếp mới nhất)."""
    query = db.query(OutreachLog)
    if status:
        query = query.filter(OutreachLog.status == status.upper())

    total = query.count()
    items = query.order_by(desc(OutreachLog.sent_at)).offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": log_item.id,
                "lead_id": log_item.lead_id,
                "recipient_email": log_item.recipient_email,
                "recipient_name": log_item.recipient_name,
                "company_name": log_item.company_name,
                "industry": log_item.industry,
                "subject": log_item.subject,
                "email_body_preview": log_item.email_body_preview,
                "template_type": log_item.template_type,
                "status": log_item.status,
                "error_message": log_item.error_message,
                "sent_at": log_item.sent_at.isoformat() if log_item.sent_at else None,
            }
            for log_item in items
        ],
    }


@router.get("/logs/{log_id}")
async def get_log_detail(log_id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết 1 nhật ký kèm toàn bộ nội dung HTML đã gửi để xem trước."""
    log_item = db.query(OutreachLog).filter(OutreachLog.id == log_id).first()
    if not log_item:
        raise HTTPException(404, "Không tìm thấy nhật ký gửi email này")

    return {
        "id": log_item.id,
        "recipient_email": log_item.recipient_email,
        "recipient_name": log_item.recipient_name,
        "company_name": log_item.company_name,
        "industry": log_item.industry,
        "subject": log_item.subject,
        "email_body_preview": log_item.email_body_preview,
        "email_body_html": log_item.email_body_html,
        "template_type": log_item.template_type,
        "status": log_item.status,
        "error_message": log_item.error_message,
        "sent_at": log_item.sent_at.isoformat() if log_item.sent_at else None,
    }


@router.get("/leads")
async def get_leads(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    industry: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Lấy danh sách các công ty mục tiêu với bộ lọc ngành và từ khóa."""
    query = db.query(OutreachLead)
    if industry:
        query = query.filter(OutreachLead.industry == industry)
    if status:
        query = query.filter(OutreachLead.status == status.upper())
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            (OutreachLead.company_name.ilike(s)) |
            (OutreachLead.email.ilike(s)) |
            (OutreachLead.contact_name.ilike(s))
        )

    total = query.count()
    items = query.order_by(OutreachLead.id.asc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": lead.id,
                "company_name": lead.company_name,
                "contact_name": lead.contact_name,
                "contact_title": lead.contact_title,
                "email": lead.email,
                "industry": lead.industry,
                "website": lead.website,
                "phone": lead.phone,
                "status": lead.status,
                "sent_count": lead.sent_count,
                "last_sent_at": lead.last_sent_at.isoformat() if lead.last_sent_at else None,
                "notes": lead.notes,
                "created_at": lead.created_at.isoformat() if lead.created_at else None,
            }
            for lead in items
        ],
    }


@router.post("/leads")
async def create_lead(payload: LeadCreateRequest, db: Session = Depends(get_db)):
    """Thêm một doanh nghiệp mục tiêu mới vào danh sách."""
    clean_email = payload.email.strip().lower()
    existing = db.query(OutreachLead).filter(OutreachLead.email == clean_email).first()
    if existing:
        raise HTTPException(400, f"Email {clean_email} đã tồn tại trong danh sách")

    new_lead = OutreachLead(
        company_name=payload.company_name.strip(),
        contact_name=payload.contact_name.strip() if payload.contact_name else None,
        contact_title=payload.contact_title.strip() if payload.contact_title else None,
        email=clean_email,
        industry=payload.industry.strip(),
        website=payload.website.strip() if payload.website else None,
        phone=payload.phone.strip() if payload.phone else None,
        notes=payload.notes.strip() if payload.notes else None,
        status="PENDING",
        sent_count=0,
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return {"success": True, "lead_id": new_lead.id, "message": "Đã thêm doanh nghiệp thành công"}


@router.post("/leads/import")
async def import_leads(payload: ImportLeadsRequest, db: Session = Depends(get_db)):
    """Nạp hàng loạt doanh nghiệp vào danh sách mục tiêu."""
    count_added = 0
    count_skipped = 0

    for item in payload.leads:
        clean_email = item.email.strip().lower()
        if not clean_email or "@" not in clean_email:
            count_skipped += 1
            continue

        existing = db.query(OutreachLead).filter(OutreachLead.email == clean_email).first()
        if existing:
            count_skipped += 1
            continue

        lead = OutreachLead(
            company_name=item.company_name.strip(),
            contact_name=item.contact_name.strip() if item.contact_name else None,
            contact_title=item.contact_title.strip() if item.contact_title else None,
            email=clean_email,
            industry=item.industry.strip() or "general",
            website=item.website.strip() if item.website else None,
            phone=item.phone.strip() if item.phone else None,
            notes=item.notes.strip() if item.notes else None,
            status="PENDING",
            sent_count=0,
        )
        db.add(lead)
        count_added += 1

    db.commit()
    return {
        "success": True,
        "added": count_added,
        "skipped": count_skipped,
        "message": f"Đã nạp thành công {count_added} doanh nghiệp (bỏ qua {count_skipped} trùng/lỗi)",
    }


@router.post("/leads/{lead_id}/send-now")
async def send_lead_now(lead_id: int, db: Session = Depends(get_db)):
    """Gửi email thủ công ngay lập tức cho 1 lead cụ thể."""
    lead = db.query(OutreachLead).filter(OutreachLead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Không tìm thấy doanh nghiệp này")

    success = send_outreach_to_lead(db, lead)
    return {
        "success": success,
        "lead_id": lead.id,
        "message": "Đã gửi email thành công" if success else "Gửi email thất bại, vui lòng kiểm tra cấu hình Resend",
    }


@router.post("/leads/{lead_id}/reset")
async def reset_lead_status(lead_id: int, db: Session = Depends(get_db)):
    """Đặt lại trạng thái của lead về PENDING để có thể gửi lại."""
    lead = db.query(OutreachLead).filter(OutreachLead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Không tìm thấy doanh nghiệp này")

    lead.status = "PENDING"
    db.commit()
    return {"success": True, "message": "Đã đặt lại trạng thái về Chờ Gửi"}


@router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    """Xóa một doanh nghiệp khỏi danh sách."""
    lead = db.query(OutreachLead).filter(OutreachLead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Không tìm thấy doanh nghiệp này")

    db.delete(lead)
    db.commit()
    return {"success": True, "message": "Đã xóa doanh nghiệp khỏi danh sách"}
