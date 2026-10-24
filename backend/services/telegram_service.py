# ==============================================================================
# TELEGRAM BOT SERVICE — INSIGHT AI PLATFORM
# Bot: @Insightbookingasia_bot (t.me/Insightbookingasia_bot)
# DÀNH RIÊNG CHO: Ban Điều Hành & Quản Trị Viên Hệ Thống (Anh Lợi - Chat ID: 584207194)
# ==============================================================================

import os
import json
import httpx
import structlog
from typing import Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import func

log = structlog.get_logger(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8726193525:AAH3nEgwlg_B_0ZiWmY6kiOT-_bxyH9nKRE")
TELEGRAM_ADMIN_CHAT_ID = os.getenv("TELEGRAM_ADMIN_CHAT_ID", "584207194")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://insight.1booking.asia")
TELEGRAM_API_BASE = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


async def send_telegram_message(
    text: str,
    chat_id: Optional[str] = None,
    reply_markup: Optional[dict] = None,
    parse_mode: str = "HTML",
) -> bool:
    """Gửi tin nhắn Telegram qua HTTP Bot API trực tiếp tới Quản trị viên."""
    target_chat_id = chat_id or os.getenv("TELEGRAM_ADMIN_CHAT_ID", "584207194")
    if not target_chat_id or not TELEGRAM_BOT_TOKEN:
        log.warning("Telegram target_chat_id or token not configured", target_chat_id=target_chat_id)
        return False

    url = f"{TELEGRAM_API_BASE}/sendMessage"
    payload: dict[str, Any] = {
        "chat_id": str(target_chat_id).strip(),
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
    """Bắn thông báo đơn hàng khảo sát mới được tạo trên hệ thống tới anh Lợi."""
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
                {"text": "🌐 Trang Quản Trị", "url": FRONTEND_URL},
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
        f"💰 <b>[THANH TOÁN THÀNH CÔNG — VIETQR]</b>\n\n"
        f"• Mã khảo sát: <code>{survey_id}</code>\n"
        f"• Dự án: <b>{product_name}</b>\n"
        f"• Số tiền ghi nhận: <b>{amount:,} VNĐ</b>\n"
        f"• Mã giao dịch: <code>{transaction_id}</code>\n"
        f"• Trạng thái: 🚀 <b>Đang kích hoạt Cụm AI Synthetic Personas</b>\n\n"
        f"Hệ thống đang chạy phỏng vấn 1.000 tác tử AI song song..."
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
    CHỈ DÀNH RIÊNG CHO QUẢN TRỊ VIÊN (ANH LỢI - 584207194).
    Tất cả các tài khoản khác nhắn vào Bot sẽ bị từ chối truy cập để bảo mật hệ thống.
    """
    message = update.get("message") or update.get("edited_message")
    if not message:
        return {"status": "ignored", "reason": "no_message"}

    chat_id = str(message.get("chat", {}).get("id"))
    from_user = message.get("from", {})
    first_name = from_user.get("first_name", "Anh Lợi")
    text = (message.get("text") or "").strip()

    log.info("Telegram message received", chat_id=chat_id, text=text, user=first_name)

    if not text:
        return {"status": "ignored", "reason": "empty_text"}

    admin_chat_id = str(os.getenv("TELEGRAM_ADMIN_CHAT_ID", "584207194")).strip()

    # =========================================================================
    # LỚP BẢO MẬT: Chặn mọi người ngoài, CHỈ CHO ANH LỢI SỬ DỤNG
    # =========================================================================
    if chat_id != admin_chat_id:
        deny_msg = (
            "⛔ <b>TRUY CẬP BỊ TỪ CHỐI</b>\n\n"
            "Đây là Bot điều hành nội bộ của Ban Quản Trị INSIGHT AI. Bot không phục vụ khách hàng công cộng.\n"
            f"Vui lòng truy cập nền tảng chính thức tại: <a href='{FRONTEND_URL}'>{FRONTEND_URL}</a>"
        )
        await send_telegram_message(deny_msg, chat_id=chat_id)
        return {"status": "forbidden", "reason": "unauthorized_user"}

    # =========================================================================
    # CÁC LỆNH DÀNH RIÊNG CHO ANH LỢI
    # =========================================================================

    # 1. Lệnh /start: Bảng điều khiển Quản trị viên
    if text.startswith("/start"):
        reply = (
            f"Xin chào <b>anh Lợi</b>! 👑\n\n"
            f"Chào mừng anh đến với <b>Trung Tâm Điều Hành & Giám Sát Nội Bộ INSIGHT AI</b>.\n\n"
            f"🆔 <b>Admin Chat ID:</b> <code>{chat_id}</code> (Đã kích hoạt bảo mật độc quyền)\n\n"
            f"📌 <b>Các tính năng điều hành nhanh:</b>\n"
            f"• <code>/stats</code> — Xem doanh thu & số lượng khảo sát hệ thống\n"
            f"• <code>/recent</code> — Danh sách 5 đơn khảo sát mới nhất\n"
            f"• <code>/demo</code> — Danh sách 9 ca khảo sát mẫu thực tế\n"
            f"• Gửi bất kỳ <b>Mã đơn hàng</b> nào (VD: <code>PANELxxxxxx</code>) để xem chi tiết hồ sơ & link tải PDF A4\n\n"
            f"Bấm các nút dưới đây để thao tác nhanh:"
        )
        inline_keyboard = {
            "inline_keyboard": [
                [
                    {"text": "🌐 Nền Tảng Insight AI", "url": FRONTEND_URL},
                    {"text": "🚀 Tạo Khảo Sát Mới", "url": f"{FRONTEND_URL}/wizard"},
                ],
                [
                    {"text": "📊 Nielsen BASES (Demo)", "url": f"{FRONTEND_URL}/results/DEMO-NIELSEN-BASES"},
                    {"text": "💎 Van Westendorp (Demo)", "url": f"{FRONTEND_URL}/results/DEMO-VAN-WESTENDORP"},
                ]
            ]
        }
        await send_telegram_message(reply, chat_id=chat_id, reply_markup=inline_keyboard)
        return {"status": "ok", "action": "admin_welcome"}

    # 2. Lệnh /stats: Báo cáo thống kê kinh doanh & vận hành
    if text.startswith("/stats"):
        if not db:
            from database import SessionLocal
            db_session = SessionLocal()
        else:
            db_session = db

        try:
            from database import Survey
            total_count = db_session.query(Survey).count()
            completed_count = db_session.query(Survey).filter(Survey.status == "COMPLETED").count()
            processing_count = db_session.query(Survey).filter(Survey.status == "PROCESSING").count()
            pending_count = db_session.query(Survey).filter(Survey.status == "PENDING_PAYMENT").count()
            
            # Tính tổng doanh thu từ các đơn đã thanh toán hoặc hoàn tất
            revenue_sum = (
                db_session.query(func.sum(Survey.price_amount))
                .filter(Survey.status.in_(["PROCESSING", "COMPLETED"]))
                .scalar() or 0
            )

            reply = (
                f"📊 <b>BÁO CÁO TỔNG QUAN HỆ THỐNG INSIGHT AI</b>\n\n"
                f"💰 <b>Tổng doanh thu ghi nhận:</b> <code>{revenue_sum:,} VNĐ</code>\n"
                f"📋 <b>Tổng số khảo sát khởi tạo:</b> <b>{total_count}</b>\n"
                f"• ✅ Hoàn tất báo cáo: <b>{completed_count}</b>\n"
                f"• 🚀 Đang chạy mô phỏng AI: <b>{processing_count}</b>\n"
                f"• ⏳ Chờ thanh toán VietQR: <b>{pending_count}</b>\n\n"
                f"<i>(Dữ liệu được cập nhật theo thời gian thực từ Supabase)</i>"
            )
        except Exception as err:
            log.error("Failed to fetch admin stats", error=str(err))
            reply = f"⚠️ Không thể trích xuất số liệu thống kê: {str(err)}"
        finally:
            if not db and 'db_session' in locals():
                db_session.close()

        await send_telegram_message(reply, chat_id=chat_id)
        return {"status": "ok", "action": "stats"}

    # 3. Lệnh /recent: 5 đơn hàng mới nhất
    if text.startswith("/recent"):
        if not db:
            from database import SessionLocal
            db_session = SessionLocal()
        else:
            db_session = db

        try:
            from database import Survey
            recents = db_session.query(Survey).order_by(Survey.created_at.desc()).limit(5).all()
            if not recents:
                reply = "📋 Hệ thống hiện chưa có đơn khảo sát nào."
            else:
                lines = ["📋 <b>5 ĐƠN KHẢO SÁT GẦN NHẤT:</b>\n"]
                for idx, s in enumerate(recents, 1):
                    p_name = "Khảo sát"
                    if s.product_info_json:
                        try:
                            p_name = json.loads(s.product_info_json).get("product_name", s.id)
                        except Exception:
                            p_name = s.id
                    status_emoji = {
                        "PENDING_PAYMENT": "⏳ Chờ CK",
                        "PROCESSING": "🚀 Đang chạy AI",
                        "COMPLETED": "✅ Hoàn tất",
                        "FAILED": "❌ Thất bại",
                    }.get(s.status, s.status)
                    created_str = s.created_at.strftime("%d/%m %H:%M") if s.created_at else "N/A"
                    lines.append(
                        f"<b>{idx}. <code>{s.id}</code></b> — {status_emoji}\n"
                        f"   • Dự án: {p_name}\n"
                        f"   • Tiền: {s.price_amount:,}đ | Tạo: {created_str}"
                    )
                reply = "\n\n".join(lines)
        except Exception as err:
            log.error("Failed to fetch recent surveys", error=str(err))
            reply = f"⚠️ Không thể trích xuất danh sách gần nhất: {str(err)}"
        finally:
            if not db and 'db_session' in locals():
                db_session.close()

        await send_telegram_message(reply, chat_id=chat_id)
        return {"status": "ok", "action": "recent"}

    # 4. Lệnh /demo: Xem 9 ca mẫu
    if text.startswith("/demo"):
        reply = (
            f"🏛️ <b>DANH SÁCH 9 BÁO CÁO KHẢO SÁT MẪU THỰC TẾ:</b>\n\n"
            f"1. <b>Nielsen BASES:</b> Trà Kombucha Xoài Cát Chu (N=1.000)\n"
            f"2. <b>Van Westendorp:</b> Sữa Hạt Macca Yến Mạch (N=1.000)\n"
            f"3. <b>Kantar Brand:</b> Cà Phê Hòa Tan Nấm Linh Chi (N=1.000)\n"
            f"4. <b>Mô hình 5 Khía Cạnh:</b> Bánh Trung Thu Ít Đường (N=1.000)\n"
            f"5. <b>Đo Lường Độ Nhạy Giá:</b> Nước Ép Tươi Hữu Cơ (N=1.000)\n"
            f"6. <b>Kiểm Thử Bao Bì A/B:</b> Hộp Quà Tết Đông Trùng (N=1.000)\n"
            f"7. <b>U&A Tiêu Dùng:</b> Thói Quen Ăn Sáng Gia Đình (N=1.000)\n"
            f"8. <b>Độ Co Giãn Khuyến Mãi:</b> Combo Chăm Sóc Da (N=1.000)\n\n"
            f"<i>Bấm nút bên dưới để mở nhanh trên trình duyệt:</i>"
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
                    {"text": "🌐 Mở Toàn Bộ 9 Ca Trên Web", "url": FRONTEND_URL},
                ]
            ]
        }
        await send_telegram_message(reply, chat_id=chat_id, reply_markup=inline_keyboard)
        return {"status": "ok", "action": "demo"}

    # 5. Lệnh /help: Hướng dẫn quản trị
    if text.startswith("/help"):
        reply = (
            f"📖 <b>HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN (ANH LỢI)</b>\n\n"
            f"• <code>/stats</code>: Thống kê số lượng khảo sát & tổng doanh thu\n"
            f"• <code>/recent</code>: Xem 5 đơn hàng mới nhất trên hệ thống\n"
            f"• <code>/demo</code>: Xem danh sách 9 báo cáo mẫu trực tuyến\n"
            f"• <b>Tra cứu đơn hàng:</b> Nhập trực tiếp mã đơn (VD: <code>PANEL892314</code>) để xem toàn bộ thông tin chi tiết và link xem bản in A4 PDF.\n\n"
            f"🔒 <i>Lưu ý: Bot đã được khóa bảo mật độc quyền với Chat ID của anh. Người ngoài nhắn tin vào Bot sẽ tự động bị từ chối truy cập.</i>"
        )
        await send_telegram_message(reply, chat_id=chat_id)
        return {"status": "ok", "action": "help"}

    # 6. Tra cứu mã khảo sát bất kỳ (PANELxxxxxx hoặc DEMO-xxxx)
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

    # Tra cứu trong Database
    if not db:
        from database import SessionLocal
        db_session = SessionLocal()
    else:
        db_session = db

    try:
        from database import Survey
        survey = db_session.query(Survey).filter(Survey.id == clean_code).first()
        if survey:
            p_name = survey.id
            if survey.product_info_json:
                try:
                    p_name = json.loads(survey.product_info_json).get("product_name", survey.id)
                except Exception:
                    p_name = survey.id
            status_vn = {
                "PENDING_PAYMENT": "⏳ Chờ thanh toán VietQR",
                "PROCESSING": "🚀 Đang mô phỏng tác tử AI",
                "COMPLETED": "✅ Đã hoàn tất báo cáo",
                "FAILED": "❌ Thất bại",
            }.get(survey.status, survey.status)

            created_date = survey.created_at.strftime("%d/%m/%Y %H:%M") if survey.created_at else "N/A"
            paid_date = survey.paid_at.strftime("%d/%m/%Y %H:%M") if survey.paid_at else "Chưa thanh toán"

            reply = (
                f"📋 <b>HỒ SƠ KHẢO SÁT CHI TIẾT [{clean_code}]</b>\n\n"
                f"• Dự án: <b>{p_name}</b>\n"
                f"• Trạng thái: <b>{status_vn}</b>\n"
                f"• Quy mô mẫu: <b>N = {survey.sample_size:,} Personas</b>\n"
                f"• Giá trị thanh toán: <b>{survey.price_amount:,} VNĐ</b>\n"
                f"• Email khách hàng: <code>{survey.customer_email or 'Không cung cấp'}</code>\n"
                f"• Thời gian tạo: <code>{created_date}</code>\n"
                f"• Thời gian thanh toán: <code>{paid_date}</code>\n"
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
    except Exception as err:
        log.error("Failed to query survey", error=str(err))
    finally:
        if not db and 'db_session' in locals():
            db_session.close()

    # Không tìm thấy
    reply = (
        f"❓ Không tìm thấy hồ sơ khảo sát có mã <code>{clean_code}</code>.\n\n"
        f"Anh vui lòng kiểm tra lại mã đơn hàng (định dạng <code>PANELxxxxxx</code>) hoặc gõ <code>/recent</code> để xem 5 đơn gần nhất."
    )
    inline_keyboard = {
        "inline_keyboard": [
            [
                {"text": "🔍 Xem Báo Cáo Demo", "url": f"{FRONTEND_URL}/results/DEMO-NIELSEN-BASES"},
                {"text": "🌐 Mở Trang Quản Trị", "url": FRONTEND_URL},
            ]
        ]
    }
    await send_telegram_message(reply, chat_id=chat_id, reply_markup=inline_keyboard)
    return {"status": "ok", "action": "not_found"}


async def setup_telegram_commands() -> bool:
    """Đăng ký Menu lệnh chính thức cho Bot trên Telegram dành cho Admin."""
    if not TELEGRAM_BOT_TOKEN:
        return False
    url = f"{TELEGRAM_API_BASE}/setMyCommands"
    payload = {
        "commands": [
            {"command": "start", "description": "Bảng điều khiển Quản trị viên"},
            {"command": "stats", "description": "Thống kê số lượng & Doanh thu"},
            {"command": "recent", "description": "Xem 5 đơn khảo sát gần nhất"},
            {"command": "demo", "description": "Xem 9 báo cáo khảo sát mẫu"},
            {"command": "help", "description": "Hướng dẫn quản trị"},
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
