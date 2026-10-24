# ==============================================================================
# TELEGRAM BOT SERVICE — INSIGHT AI PLATFORM
# Bot: @Insightbookingasia_bot (t.me/Insightbookingasia_bot)
# Chức năng:
# 1. Bắn thông báo thời gian thực về Đơn hàng mới, Thanh toán SePay, Báo cáo hoàn tất.
# 2. Tra cứu kết quả khảo sát tự động qua mã PANELxxxxxx hoặc DEMO-xxxx.
# ==============================================================================

import os
import httpx
import structlog
from typing import Optional, Any
from sqlalchemy.orm import Session

log = structlog.get_logger(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8726193525:AAH3nEgwlg_B_0ZiWmY6kiOT-_bxyH9nKRE")
TELEGRAM_ADMIN_CHAT_ID = os.getenv("TELEGRAM_ADMIN_CHAT_ID", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://insight.1booking.asia")
TELEGRAM_API_BASE = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


async def send_telegram_message(
    text: str,
    chat_id: Optional[str] = None,
    reply_markup: Optional[dict] = None,
    parse_mode: str = "HTML",
) -> bool:
    """Gửi tin nhắn Telegram qua HTTP Bot API."""
    target_chat_id = chat_id or os.getenv("TELEGRAM_ADMIN_CHAT_ID", "")
    if not target_chat_id or not TELEGRAM_BOT_TOKEN:
        log.warning("Telegram target_chat_id or token not configured", target_chat_id=target_chat_id)
        return False

    url = f"{TELEGRAM_API_BASE}/sendMessage"
    payload: dict[str, Any] = {
        "chat_id": target_chat_id,
        "text": text,
        "parse_mode": parse_mode,
        "disable_web_page_preview": False,
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            data = resp.json()
            if not data.get("ok"):
                log.error("Telegram API sendMessage error", response=data)
                return False
            return True
    except Exception as e:
        log.error("Failed to send Telegram message", error=str(e))
        return False


async def notify_new_survey(
    survey_id: str,
    product_name: str,
    category: str,
    sample_size: int,
    price_amount: int,
    location: str,
    customer_email: Optional[str] = None,
) -> bool:
    """Bắn thông báo đơn hàng khảo sát mới được tạo trên hệ thống."""
    text = (
        f"🔔 <b>[ĐƠN HÀNG KHẢO SÁT MỚI]</b>\n\n"
        f"• Mã khảo sát: <code>{survey_id}</code>\n"
        f"• Dự án: <b>{product_name}</b>\n"
        f"• Ngành hàng: <b>{category}</b>\n"
        f"• Cỡ mẫu đối chuẩn: <b>N = {sample_size:,} Personas</b>\n"
        f"• Địa bàn: <b>{location}</b>\n"
        f"• Giá trị thanh toán: <b>{price_amount:,} VNĐ</b>\n"
        f"• Email khách hàng: <code>{customer_email or 'Không cung cấp'}</code>\n"
        f"• Trạng thái: ⏳ <i>Đang chờ quét mã VietQR</i>\n\n"
        f"🔗 <a href='{FRONTEND_URL}/processing/{survey_id}'>Theo dõi tiến trình khảo sát</a>"
    )
    inline_keyboard = {
        "inline_keyboard": [
            [
                {"text": "⚡ Mở Tiến Trình", "url": f"{FRONTEND_URL}/processing/{survey_id}"},
                {"text": "🌐 Trang Chủ", "url": FRONTEND_URL},
            ]
        ]
    }
    return await send_telegram_message(text, reply_markup=inline_keyboard)


async def notify_payment_received(
    survey_id: str,
    product_name: str,
    amount: int,
    transaction_id: str,
) -> bool:
    """Bắn thông báo nhận tiền SePay thành công và bắt đầu chạy AI simulation."""
    text = (
        f"💰 <b>[THANH TOÁN THÀNH CÔNG — SEPAY]</b>\n\n"
        f"• Mã khảo sát: <code>{survey_id}</code>\n"
        f"• Dự án: <b>{product_name}</b>\n"
        f"• Số tiền ghi nhận: <b>{amount:,} VNĐ</b>\n"
        f"• Giao dịch SePay ID: <code>{transaction_id}</code>\n"
        f"• Trạng thái: 🚀 <b>Đang kích hoạt Cụm AI Synthetic Personas</b>\n\n"
        f"Hệ thống đang phỏng vấn song song và phân tích kinh tế lượng..."
    )
    inline_keyboard = {
        "inline_keyboard": [
            [
                {"text": "📊 Xem Trực Tiếp Tiến Trình", "url": f"{FRONTEND_URL}/processing/{survey_id}"}
            ]
        ]
    }
    return await send_telegram_message(text, reply_markup=inline_keyboard)


async def notify_survey_completed(
    survey_id: str,
    product_name: str,
    model_type: str,
    sample_size: int,
    viability_score: int,
    verdict: str,
) -> bool:
    """Bắn thông báo khi báo cáo nghiên cứu hoàn tất đầy đủ."""
    score_badge = "🟢 Strong Go" if viability_score >= 70 else "🟡 Cân nhắc / Tối ưu" if viability_score >= 50 else "🔴 Rủi ro cao"
    text = (
        f"🎉 <b>[BÁO CÁO NGHIÊN CỨU HOÀN TẤT]</b>\n\n"
        f"• Mã khảo sát: <code>{survey_id}</code>\n"
        f"• Dự án: <b>{product_name}</b>\n"
        f"• Phương pháp: <b>{model_type.replace('_', ' ').upper()}</b>\n"
        f"• Cỡ mẫu: <b>N = {sample_size:,} Personas</b>\n"
        f"• Điểm khả thi: <b>{viability_score}/100</b> ({score_badge})\n"
        f"• Kết luận: <i>{verdict}</i>\n\n"
        f"Báo cáo 6 trang A4 và dữ liệu 4 tab đã sẵn sàng:"
    )
    inline_keyboard = {
        "inline_keyboard": [
            [
                {"text": "📊 Báo Cáo Trực Tuyến (4 Tab)", "url": f"{FRONTEND_URL}/results/{survey_id}"},
            ],
            [
                {"text": "🖨️ Bản In A4 PDF Chiến Lược (6 Trang)", "url": f"{FRONTEND_URL}/results/{survey_id}/print"},
            ]
        ]
    }
    return await send_telegram_message(text, reply_markup=inline_keyboard)


async def handle_telegram_webhook(update: dict, db: Optional[Session] = None) -> dict:
    """
    Xử lý webhook message từ Telegram Bot.
    Hỗ trợ lệnh /start, /help, /demo, và tra cứu mã khảo sát bất kỳ.
    """
    message = update.get("message") or update.get("edited_message")
    if not message:
        return {"status": "ignored", "reason": "no_message"}

    chat_id = str(message.get("chat", {}).get("id"))
    from_user = message.get("from", {})
    username = from_user.get("username") or from_user.get("first_name", "bạn")
    text = (message.get("text") or "").strip()

    log.info("Telegram message received", chat_id=chat_id, text=text, user=username)

    if not text:
        return {"status": "ignored", "reason": "empty_text"}

    # 1. Lệnh /start
    if text.startswith("/start"):
        reply = (
            f"Xin chào <b>{username}</b>! 👋\n\n"
            f"Chào mừng bạn đến với <b>INSIGHT AI Platform</b> — Nền tảng nghiên cứu thị trường bằng Tác tử AI Đa Nhân Khẩu (Synthetic Personas).\n\n"
            f"🆔 <b>Chat ID của bạn:</b> <code>{chat_id}</code>\n"
            f"<i>(Hãy cấu hình ID này vào TELEGRAM_ADMIN_CHAT_ID trên server để nhận thông báo đơn hàng và thanh toán tự động)</i>\n\n"
            f"📌 <b>Bạn có thể làm gì với Bot này?</b>\n"
            f"• Gửi bất kỳ <b>Mã khảo sát</b> nào (Ví dụ: <code>DEMO-NIELSEN-BASES</code>, <code>DEMO-VAN-WESTENDORP</code>, hoặc mã đơn của bạn <code>PANELxxxxxx</code>) để nhận ngay kết quả tóm tắt.\n"
            f"• Nhận thông báo tự động mỗi khi có khách hàng tạo đơn hoặc hoàn tất thanh toán VietQR.\n\n"
            f"Bấm các nút dưới đây để khám phá ngay:"
        )
        inline_keyboard = {
            "inline_keyboard": [
                [
                    {"text": "🌐 Truy Cập Nền Tảng Insight AI", "url": FRONTEND_URL},
                    {"text": "🚀 Tạo Khảo Sát Mới", "url": f"{FRONTEND_URL}/wizard"},
                ],
                [
                    {"text": "📊 Xem Demo Ý Tưởng (Nielsen)", "url": f"{FRONTEND_URL}/results/DEMO-NIELSEN-BASES"},
                    {"text": "💎 Xem Demo Giá (Van Westendorp)", "url": f"{FRONTEND_URL}/results/DEMO-VAN-WESTENDORP"},
                ]
            ]
        }
        await send_telegram_message(reply, chat_id=chat_id, reply_markup=inline_keyboard)
        return {"status": "ok", "action": "welcome"}

    # 2. Lệnh /help
    if text.startswith("/help"):
        reply = (
            f"📖 <b>HƯỚNG DẪN SỬ DỤNG BOT INSIGHT AI</b>\n\n"
            f"1. <b>Tra cứu khảo sát:</b> Gửi mã đơn (VD: <code>PANEL892314</code> hoặc <code>DEMO-NIELSEN-BASES</code>).\n"
            f"2. <b>Cấu hình Admin Alert:</b> Chat ID của bạn là <code>{chat_id}</code>. Nhập ID này vào biến môi trường <code>TELEGRAM_ADMIN_CHAT_ID</code> trong file <code>backend/.env</code>.\n"
            f"3. <b>Các kênh hỗ trợ:</b>\n"
            f"• Website: <a href='{FRONTEND_URL}'>{FRONTEND_URL}</a>\n"
            f"• Email: hi@1booking.asia\n"
        )
        await send_telegram_message(reply, chat_id=chat_id)
        return {"status": "ok", "action": "help"}

    # 3. Lệnh /demo
    if text.startswith("/demo"):
        reply = (
            f"🏛️ <b>DANH SÁCH BÁO CÁO KHẢO SÁT MẪU THỰC TẾ:</b>\n\n"
            f"1. <b>Nielsen BASES:</b> Trà Kombucha Xoài Cát Chu (N=1.000)\n"
            f"2. <b>Van Westendorp:</b> Sữa Hạt Macca Yến Mạch (N=1.000)\n"
            f"3. <b>Kantar Brand:</b> Cà Phê Hòa Tan Nấm Linh Chi (N=1.000)\n"
            f"4. <b>Mô hình 5 Khía Cạnh:</b> Bánh Trung Thu Ít Đường (N=1.000)\n"
            f"5. <b>Đo Lường Độ Nhạy Giá:</b> Nước Ép Tươi Hữu Cơ (N=1.000)\n"
            f"6. <b>Kiểm Thử Bao Bì A/B:</b> Hộp Quà Tết Đông Trùng (N=1.000)\n"
            f"7. <b>U&A Tiêu Dùng:</b> Thói Quen Ăn Sáng Gia Đình (N=1.000)\n"
            f"8. <b>Độ Co Giãn Khuyến Mãi:</b> Combo Chăm Sóc Da (N=1.000)\n\n"
            f"<i>Bấm vào liên kết dưới để xem báo cáo tương ứng:</i>"
        )
        inline_keyboard = {
            "inline_keyboard": [
                [
                    {"text": "1. Nielsen BASES", "url": f"{FRONTEND_URL}/results/DEMO-NIELSEN-BASES"},
                    {"text": "2. Van Westendorp", "url": f"{FRONTEND_URL}/results/DEMO-VAN-WESTENDORP"},
                ],
                [
                    {"text": "3. Kantar Brand", "url": f"{FRONTEND_URL}/results/DEMO-KANTAR-BRAND"},
                    {"text": "4. Thử Nghiệm A/B", "url": f"{FRONTEND_URL}/results/DEMO-AB-TESTING"},
                ],
                [
                    {"text": "🌐 Mở Toàn Bộ Trên Web", "url": FRONTEND_URL},
                ]
            ]
        }
        await send_telegram_message(reply, chat_id=chat_id, reply_markup=inline_keyboard)
        return {"status": "ok", "action": "demo"}

    # 4. Tra cứu mã khảo sát (PANELxxxxxx hoặc DEMO-xxxx)
    clean_code = text.strip().upper()
    
    # Kiểm tra nếu là Demo
    from models.demo_data import get_demo_report
    demo_rep = get_demo_report(clean_code)
    if demo_rep:
        p_name = demo_rep.product_name or "Dự án Khảo Sát Mẫu"
        v_score = demo_rep.executive_summary.viability_score
        verdict = demo_rep.executive_summary.verdict
        reply = (
            f"🎯 <b>KẾT QUẢ KHẢO SÁT MẪU [{clean_code}]</b>\n\n"
            f"• Tên sản phẩm: <b>{p_name}</b>\n"
            f"• Mô hình nghiên cứu: <b>{demo_rep.model_type.upper()}</b>\n"
            f"• Quy mô mẫu: <b>N = {demo_rep.target_summary.sample_size:,} Personas</b>\n"
            f"• Khung đối chuẩn: <b>Niên giám Thống kê GSO</b>\n"
            f"• Điểm khả thi: <b>{v_score} / 100</b>\n"
            f"• Nhận định: <i>{verdict}</i>\n"
        )
        inline_keyboard = {
            "inline_keyboard": [
                [
                    {"text": "📊 Xem Báo Cáo 4 Tab", "url": f"{FRONTEND_URL}/results/{clean_code}"},
                    {"text": "🖨️ Bản In PDF A4 (6 Trang)", "url": f"{FRONTEND_URL}/results/{clean_code}/print"},
                ]
            ]
        }
        await send_telegram_message(reply, chat_id=chat_id, reply_markup=inline_keyboard)
        return {"status": "ok", "action": "demo_found"}

    # Nếu không phải demo, tìm trong Database nếu có db session
    if db:
        from database import Survey
        survey = db.query(Survey).filter(Survey.id == clean_code).first()
        if survey:
            p_info = {}
            import json
            if survey.product_info_json:
                try:
                    p_info = json.loads(survey.product_info_json)
                except Exception:
                    p_info = {}
            p_name = p_info.get("product_name", survey.product_name or clean_code)
            status_vn = {
                "PENDING_PAYMENT": "⏳ Chờ thanh toán VietQR",
                "PROCESSING": "🚀 Đang mô phỏng tác tử AI",
                "COMPLETED": "✅ Đã hoàn tất báo cáo",
                "FAILED": "❌ Thất bại",
            }.get(survey.status, survey.status)

            reply = (
                f"📋 <b>HỒ SƠ KHẢO SÁT [{clean_code}]</b>\n\n"
                f"• Dự án: <b>{p_name}</b>\n"
                f"• Trạng thái: <b>{status_vn}</b>\n"
                f"• Quy mô mẫu: <b>N = {survey.sample_size:,} Personas</b>\n"
                f"• Giá trị thanh toán: <b>{survey.price_amount:,} VNĐ</b>\n"
                f"• Ngày khởi tạo: <b>{survey.created_at.strftime('%d/%m/%Y %H:%M') if survey.created_at else 'N/A'}</b>\n"
            )
            buttons = []
            if survey.status == "COMPLETED":
                buttons.append([
                    {"text": "📊 Xem Báo Cáo Trên Web", "url": f"{FRONTEND_URL}/results/{clean_code}"},
                    {"text": "🖨️ Bản In A4 PDF (6 Trang)", "url": f"{FRONTEND_URL}/results/{clean_code}/print"},
                ])
            else:
                buttons.append([
                    {"text": "⚡ Mở Tiến Trình Trực Tiếp", "url": f"{FRONTEND_URL}/processing/{clean_code}"}
                ])
            inline_keyboard = {"inline_keyboard": buttons}
            await send_telegram_message(reply, chat_id=chat_id, reply_markup=inline_keyboard)
            return {"status": "ok", "action": "survey_found"}

    # Không tìm thấy
    reply = (
        f"❓ Không tìm thấy hồ sơ khảo sát có mã <code>{clean_code}</code>.\n\n"
        f"Vui lòng kiểm tra lại mã đơn hàng (định dạng <code>PANELxxxxxx</code>) hoặc gõ <code>/demo</code> để xem các hồ sơ khảo sát mẫu thực tế."
    )
    inline_keyboard = {
        "inline_keyboard": [
            [
                {"text": "🔍 Xem Báo Cáo Demo", "url": f"{FRONTEND_URL}/results/DEMO-NIELSEN-BASES"},
                {"text": "🚀 Tạo Khảo Sát Mới", "url": f"{FRONTEND_URL}/wizard"},
            ]
        ]
    }
    await send_telegram_message(reply, chat_id=chat_id, reply_markup=inline_keyboard)
    return {"status": "ok", "action": "not_found"}


async def setup_telegram_commands() -> bool:
    """Đăng ký Menu lệnh chính thức cho Bot trên Telegram."""
    if not TELEGRAM_BOT_TOKEN:
        return False
    url = f"{TELEGRAM_API_BASE}/setMyCommands"
    payload = {
        "commands": [
            {"command": "start", "description": "Khởi động bot & Lấy Chat ID"},
            {"command": "demo", "description": "Xem 9 báo cáo khảo sát mẫu"},
            {"command": "help", "description": "Hướng dẫn tra cứu khảo sát"},
        ]
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            data = resp.json()
            return bool(data.get("ok"))
    except Exception as e:
        log.error("Failed to set Telegram commands", error=str(e))
        return False
