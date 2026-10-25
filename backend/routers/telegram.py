# ==============================================================================
# TELEGRAM BOT ROUTER — INSIGHT AI PLATFORM
# Webhook endpoint: /api/telegram/webhook
# ==============================================================================

import os
import structlog
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services.telegram_service import (
    handle_telegram_webhook,
    setup_telegram_commands,
    send_telegram_message,
    TELEGRAM_BOT_TOKEN,
    FRONTEND_URL,
)

log = structlog.get_logger(__name__)
router = APIRouter(prefix="/telegram", tags=["Telegram Bot"])


@router.post("/webhook")
async def telegram_webhook(request: Request, db: Session = Depends(get_db)):
    """Webhook nhận tin nhắn và tương tác từ Telegram Bot."""
    try:
        data = await request.json()
    except Exception as e:
        log.error("Invalid JSON from Telegram webhook", error=str(e))
        return {"status": "error", "message": "Invalid JSON"}

    res = await handle_telegram_webhook(data, db=db)
    return res


@router.get("/setup-commands")
async def setup_commands():
    """Khởi tạo menu lệnh cho Telegram Bot."""
    ok = await setup_telegram_commands()
    return {"status": "ok" if ok else "failed", "menu_registered": ok}


@router.api_route("/test-alert", methods=["GET", "POST"])
async def send_test_alert(chat_id: str = None):
    """Bắn tin nhắn test alert tới Admin Chat ID."""
    text = (
        "🔔 <b>[INSIGHT AI BOT TEST ALERT]</b>\n\n"
        "Hệ thống thông báo Telegram Bot đã kết nối thành công với máy chủ <b>insight.1booking.asia</b>!\n"
        "Bạn sẽ nhận được thông báo thời gian thực khi có khách tạo đơn, thanh toán SePay thành công, và khi báo cáo hoàn tất."
    )
    ok = await send_telegram_message(text, chat_id=chat_id)
    return {"status": "ok" if ok else "failed", "sent": ok}
