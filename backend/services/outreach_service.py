# ==============================================================================
# OUTREACH SERVICE - B2B COLD EMAIL AUTOMATION & AUDIT LOGS
# Tự động hóa tiếp cận doanh nghiệp an toàn, chống spam, kèm nhật ký chi tiết
# ==============================================================================

import asyncio
import os
import random
from datetime import datetime, time
import pytz
import resend
import structlog
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import OutreachLead, OutreachLog, OutreachSetting, SessionLocal

log = structlog.get_logger(__name__)

# Cấu hình môi trường
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "hi@1booking.asia")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://insight.1booking.asia")

VN_TZ = pytz.timezone("Asia/Ho_Chi_Minh")

# Cấu hình mặc định
DEFAULT_DAILY_LIMIT = 50
DEFAULT_MIN_INTERVAL = 180  # 3 phút
DEFAULT_MAX_INTERVAL = 480  # 8 phút

# Danh mục Case Studies theo Ngành làm Mồi Hút (Lead Magnet)
INDUSTRY_TEMPLATES = {
    "fnb": {
        "industry_name": "Thực phẩm & Đồ uống (F&B / FMCG)",
        "report_title": "Trà Kombucha Men Xoài Cát Chu Đồng Tháp (Nielsen BASES)",
        "report_path": "/results/DEMO-NIELSEN-BASES",
        "sample_size": "1.000 Personas",
        "key_metric": "Ý định mua Top-2-Box 73.4% · Điểm khả thi 78/100 (Strong Go)",
        "pain_point": "Kiểm chứng mức độ độc đáo của hương vị mới, định vị nguyên liệu bản địa và rào cản giá trước khi vào kệ siêu thị & chuỗi cửa hàng tiện lợi.",
    },
    "coffee": {
        "industry_name": "Cà phê & Đồ uống đặc sản",
        "report_title": "Cà phê phin giấy hòa tan LangBiang Roasters (Van Westendorp PSM)",
        "report_path": "/results/DEMO-VAN-WESTENDORP",
        "sample_size": "1.000 Personas",
        "key_metric": "Điểm giá tối ưu 185.000đ/hộp · Khoảng giá chấp nhận 150.000đ - 220.000đ",
        "pain_point": "Xác định điểm giá tối ưu (OPP) và đo lường độ co giãn nhu cầu để bảo toàn giá trị thương hiệu cho phân khúc cà phê cao cấp.",
    },
    "confectionery": {
        "industry_name": "Bánh kẹo & Quà tặng lễ hội",
        "report_title": "Hộp Quà Bánh Quy Hoàng Gia Delica Crown (A/B Testing Bao Bì)",
        "report_path": "/results/DEMO-AB-TESTING",
        "sample_size": "1.000 Personas",
        "key_metric": "Phương án B thắng áp đảo 61.4% về độ sang trọng & ý định mua quà biếu",
        "pain_point": "Thẩm định độ bắt mắt bao bì và thông điệp quà tặng mùa Tết đối đầu trực diện giữa 2 thiết kế trước khi in hàng loạt.",
    },
    "cosmetics": {
        "industry_name": "Mỹ phẩm, Skincare & Chăm sóc cá nhân",
        "report_title": "Serum Phục Hồi Thảo Dược Bản Địa Cocona Botanica (Brand Perceptual Map)",
        "report_path": "/results/DEMO-BRAND-MAP",
        "sample_size": "1.000 Personas",
        "key_metric": "Khai thác khoảng trống thị trường (White-space) ngách Dược mỹ phẩm thuần chay",
        "pain_point": "Bản đồ hóa tọa độ định vị cạnh tranh, giải quyết rào cản nghi ngại về hiệu quả thực tế của mỹ phẩm thiên nhiên nội địa.",
    },
    "home_appliances": {
        "industry_name": "Thiết bị gia dụng & Đồ bếp thông minh",
        "report_title": "Nồi Chiên Không Dầu Hơi Nước ElmaTech Euro (Mô hình R&D Kano)",
        "report_path": "/results/DEMO-KANO",
        "sample_size": "1.000 Personas",
        "key_metric": "Phân tầng tính năng R&D: Tự động vệ sinh hơi nước là vũ khí đột phá (Attractive)",
        "pain_point": "Xác định chính xác tính năng bắt buộc và tính năng khách sẵn sàng trả thêm tiền, tránh lãng phí chi phí sản xuất linh kiện thừa.",
    },
    "food_nutrition": {
        "industry_name": "Thực phẩm dinh dưỡng & Chế biến sẵn",
        "report_title": "Nước Hầm Xương Cô Đặc VinaBroth Foods (Monadic Split-sample)",
        "report_path": "/results/DEMO-MONADIC",
        "sample_size": "1.000 Personas",
        "key_metric": "Ý niệm dinh dưỡng tự nhiên đạt Lift +18.4% so với nước dùng đóng gói thông thường",
        "pain_point": "Đo lường niềm tin người tiêu dùng đối với nguyên liệu hầm xương truyền thống và mức độ sẵn sàng thay thế hạt nêm.",
    },
    "general": {
        "industry_name": "Doanh nghiệp Tiêu dùng & Bán lẻ",
        "report_title": "Bộ Báo Cáo Nghiên Cứu Thị Trường AI Thực Nghiệm (Thư Viện 12+ Ngành)",
        "report_path": "/thu-vien",
        "sample_size": "1.000 Personas",
        "key_metric": "Chuẩn phân tầng GSO · Cochran 95% (±3.10%) · 9 Mô hình ESOMAR quốc tế",
        "pain_point": "Khảo sát ý kiến 1.000 người tiêu dùng mục tiêu trong 60 giây với chi phí chỉ bằng 1/100 phương pháp truyền thống.",
    },
}


def _get_resend_client():
    api_key = os.getenv("RESEND_API_KEY", "")
    if not api_key:
        return None
    resend.api_key = api_key
    return resend


def get_setting(db: Session, key: str, default: str) -> str:
    setting = db.query(OutreachSetting).filter(OutreachSetting.key == key).first()
    if setting:
        return setting.value
    return default


def set_setting(db: Session, key: str, value: str):
    setting = db.query(OutreachSetting).filter(OutreachSetting.key == key).first()
    if setting:
        setting.value = value
        setting.updated_at = datetime.utcnow()
    else:
        setting = OutreachSetting(key=key, value=value, updated_at=datetime.utcnow())
        db.add(setting)
    db.commit()


def check_and_reset_daily_quota(db: Session):
    """Kiểm tra nếu sang ngày mới theo giờ Việt Nam thì reset bộ đếm."""
    now_vn = datetime.now(VN_TZ)
    today_str = now_vn.strftime("%Y-%m-%d")
    last_reset = get_setting(db, "last_reset_date", "")

    if last_reset != today_str:
        set_setting(db, "last_reset_date", today_str)
        set_setting(db, "sent_today", "0")
        log.info("Reset outreach daily quota for new date", date=today_str)


def is_within_business_hours() -> bool:
    """
    Kiểm tra xem hiện tại có nằm trong giờ hành chính vàng (giờ Việt Nam) không:
    - Sáng: 08:30 - 11:30
    - Chiều: 13:30 - 17:30
    - Thứ 2 đến Thứ 6 (Monday=0, Sunday=6)
    """
    now_vn = datetime.now(VN_TZ)
    # 0 = Monday, 6 = Sunday
    if now_vn.weekday() >= 5:  # Thứ 7 hoặc Chủ Nhật
        return False

    current_time = now_vn.time()
    morning_start = time(8, 30)
    morning_end = time(11, 30)
    afternoon_start = time(13, 30)
    afternoon_end = time(17, 30)

    is_morning = morning_start <= current_time <= morning_end
    is_afternoon = afternoon_start <= current_time <= afternoon_end

    return is_morning or is_afternoon


def build_email_content(
    company_name: str,
    contact_name: str,
    contact_title: str,
    industry_key: str,
) -> dict:
    """Tạo tiêu đề và nội dung email HTML chuyên nghiệp, ấm áp, cá nhân hóa cao."""
    tpl = INDUSTRY_TEMPLATES.get(industry_key) or INDUSTRY_TEMPLATES["general"]

    name_display = contact_name.strip() if contact_name else "Quý Lãnh Đạo"
    title_display = f" - {contact_title.strip()}" if contact_title else ""
    comp_display = company_name.strip() if company_name else "Quý Doanh Nghiệp"

    report_url = f"{FRONTEND_URL}{tpl['report_path']}"
    library_url = f"{FRONTEND_URL}/thu-vien"
    wizard_url = f"{FRONTEND_URL}/wizard"

    subject = f"Gửi {name_display} ({comp_display}) | Dữ liệu nghiên cứu thị trường {tpl['industry_name']}"

    html = f"""
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.65;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 30px 10px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
                        
                        <!-- Top Header Bar -->
                        <tr>
                            <td style="background-color: #0A192F; padding: 28px 32px; border-bottom: 3px solid #D4AF37;">
                                <div style="display: inline-block; padding: 3px 10px; background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 12px; color: #D4AF37; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
                                    Tài Liệu Nghiên Cứu Chuyên Ngành
                                </div>
                                <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 6px 0; line-height: 1.35;">
                                    Báo Cáo Nghiên Cứu Hành Vi & Thị Trường AI
                                </h1>
                                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                    Phát hành bởi Nền tảng Nghiên cứu Thị trường AI (INSIGHT AI)
                                </p>
                            </td>
                        </tr>

                        <!-- Main Body -->
                        <tr>
                            <td style="padding: 32px 32px 24px 32px;">
                                <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin: 0 0 16px 0;">
                                    Kính gửi {name_display}{title_display} tại {comp_display},
                                </p>

                                <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
                                    Em là đại diện từ đội ngũ phát triển Nền tảng Nghiên cứu Thị trường AI (<strong>INSIGHT AI</strong>). Được biết <strong>{comp_display}</strong> đang không ngừng sáng tạo và phát triển mạnh mẽ trong lĩnh vực {tpl['industry_name']}, em xin phép gửi tới anh/chị bức thư ngắn này để chia sẻ một bộ dữ liệu nghiên cứu thị trường thực tế mà đội ngũ chúng em vừa công bố.
                                </p>

                                <!-- Case Study Highlight Card -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin: 20px 0 24px 0;">
                                    <tr>
                                        <td style="padding: 20px 24px;">
                                            <div style="font-size: 11px; text-transform: uppercase; color: #b45309; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px;">
                                                📊 Báo Cáo Mẫu Thực Nghiệm (N = {tpl['sample_size']})
                                            </div>
                                            <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
                                                {tpl['report_title']}
                                            </div>
                                            <div style="font-size: 13px; color: #475569; margin-bottom: 12px; line-height: 1.5;">
                                                ✦ <strong>Chỉ số nổi bật:</strong> {tpl['key_metric']}<br>
                                                ✦ <strong>Vấn đề giải quyết:</strong> {tpl['pain_point']}
                                            </div>
                                            <a href="{report_url}" style="display: inline-block; background-color: #0A192F; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 8px;">
                                                Xem Báo Cáo Trực Tuyến & Tải Bản In A4 &rarr;
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
                                    Khác với các phương pháp khảo sát truyền thống thường mất từ 4-6 tuần và tốn kém hàng chục triệu đồng, hệ thống của chúng em mô phỏng phản ứng của <strong>1.000 Tác tử AI Đa Nhân Khẩu</strong> được phân tầng chuẩn hóa theo Niên giám Thống kê Việt Nam (GSO), cho ra kết quả chi tiết, chỉ số định giá và khuyến nghị chiến lược chỉ trong <strong>60 giây</strong>.
                                </p>

                                <!-- Special Gift Offer -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #fefce8 0%, #fffbeb 100%); border: 1px dashed #d97706; border-radius: 12px; margin: 20px 0 24px 0;">
                                    <tr>
                                        <td style="padding: 18px 22px;">
                                            <div style="font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 4px;">
                                                🎁 Quà Tặng Trải Nghiệm Dành Riêng Cho {comp_display}
                                            </div>
                                            <p style="font-size: 13px; color: #78350f; margin: 0 0 10px 0; line-height: 1.5;">
                                                Để giúp {comp_display} trải nghiệm thực tế mức độ sắc bén của dữ liệu trên chính sản phẩm hay ý tưởng mới của công ty, Insight AI xin gửi tặng anh/chị <strong>01 Suất Khảo Sát Thẩm Định Miễn Phí</strong> (Quy mô 500 mẫu đại diện).
                                            </p>
                                            <div style="font-size: 12px; color: #451a03; background: #ffffff; padding: 8px 12px; border-radius: 6px; display: inline-block; border: 1px solid #fde68a; font-family: monospace; font-weight: bold;">
                                                Mã ưu đãi: OFF100 (Giảm 100% chi phí khảo sát)
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <p style="font-size: 14px; color: #334155; margin: 0 0 20px 0;">
                                    Anh/chị có thể kích hoạt ngay suất trải nghiệm hoặc tham khảo thêm 12 báo cáo mẫu thuộc các ngành nghề khác tại:
                                </p>

                                <div style="text-align: center; margin: 24px 0;">
                                    <a href="{library_url}" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 24px; border-radius: 10px; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);">
                                        Khám Phá Thư Viện Báo Cáo 12+ Ngành Nghề &rarr;
                                    </a>
                                </div>

                                <p style="font-size: 14px; color: #334155; margin: 0 0 6px 0;">
                                    Kính chúc {comp_display} và anh/chị luôn gặt hái nhiều thắng lợi mới trong năm 2026!
                                </p>
                            </td>
                        </tr>

                        <!-- Professional Signature -->
                        <tr>
                            <td style="padding: 20px 32px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0;">
                                <div style="font-size: 13px; font-weight: 700; color: #0f172a;">
                                    Ban Phát Triển Đối Tác Doanh Nghiệp | INSIGHT AI
                                </div>
                                <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
                                    Nền tảng Nghiên cứu Thị trường bằng Tác tử AI Đa Nhân Khẩu (Synthetic Personas)<br>
                                    Website: <a href="{FRONTEND_URL}" style="color: #0284c7; text-decoration: none;">insight.1booking.asia</a> · Hotline/Zalo: 0908 970 096 · Email: hi@1booking.asia
                                </div>
                            </td>
                        </tr>

                        <!-- Unsubscribe / Compliance Notice -->
                        <tr>
                            <td style="padding: 16px 32px; background-color: #ffffff; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.4;">
                                Bức thư này được gửi tới {comp_display} nhằm mục đích chia sẻ tài liệu học thuật và nghiên cứu thị trường chuyên ngành.<br>
                                Nếu anh/chị không có nhu cầu nhận các bản tin nghiên cứu tiếp theo, vui lòng phản hồi email này với nội dung "Từ chối" hoặc bấm vào đây để được tự động loại khỏi danh sách.
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    body_preview = f"Kính gửi {name_display} tại {comp_display}. Đội ngũ INSIGHT AI xin gửi tặng anh/chị Báo cáo nghiên cứu thị trường: {tpl['report_title']} quy mô {tpl['sample_size']}..."

    return {
        "subject": subject,
        "html": html,
        "body_preview": body_preview,
    }


def send_test_email(to_email: str, contact_name: str, company_name: str, industry_key: str = "fnb") -> dict:
    """Gửi email kiểm tra thử nghiệm ngay lập tức tới email của Founder."""
    if not to_email or "@" not in to_email:
        return {"success": False, "message": "Email người nhận không hợp lệ"}

    client = _get_resend_client()
    if not client:
        return {"success": False, "message": "Chưa cấu hình RESEND_API_KEY"}

    email_data = build_email_content(
        company_name=company_name or "Công ty Thử Nghiệm",
        contact_name=contact_name or "Anh Lợi",
        contact_title="Sáng lập / CEO",
        industry_key=industry_key,
    )

    try:
        response = client.Emails.send({
            "from": f"INSIGHT AI <{EMAIL_FROM}>",
            "to": to_email,
            "subject": f"[BẢN XEM TRƯỚC] {email_data['subject']}",
            "html": email_data["html"],
        })

        # Ghi log test vào DB
        db = SessionLocal()
        try:
            log_entry = OutreachLog(
                recipient_email=to_email,
                recipient_name=contact_name or "Anh Lợi",
                company_name=company_name or "Công ty Thử Nghiệm",
                industry=industry_key,
                subject=f"[TEST] {email_data['subject']}",
                email_body_preview=email_data["body_preview"],
                email_body_html=email_data["html"],
                template_type="test_preview",
                status="SUCCESS",
                sent_at=datetime.utcnow(),
            )
            db.add(log_entry)
            db.commit()
        finally:
            db.close()

        log.info("Test outreach email sent successfully", to=to_email)
        return {
            "success": True,
            "message": f"Đã gửi email thử nghiệm thành công tới {to_email}",
            "resend_id": getattr(response, "id", str(response)),
        }
    except Exception as e:
        log.error("Failed to send test outreach email", error=str(e))
        return {"success": False, "message": f"Lỗi gửi email: {str(e)}"}


def send_outreach_to_lead(db: Session, lead: OutreachLead) -> bool:
    """Gửi email thật cho 1 lead và cập nhật nhật ký & trạng thái lead."""
    client = _get_resend_client()
    if not client:
        log.warning("RESEND_API_KEY missing, skipping send")
        return False

    email_data = build_email_content(
        company_name=lead.company_name,
        contact_name=lead.contact_name or "",
        contact_title=lead.contact_title or "",
        industry_key=lead.industry or "general",
    )

    success = False
    error_msg = None

    try:
        response = client.Emails.send({
            "from": f"INSIGHT AI <{EMAIL_FROM}>",
            "to": lead.email,
            "subject": email_data["subject"],
            "html": email_data["html"],
        })
        success = True
        log.info("Outreach email sent successfully", lead_id=lead.id, email=lead.email, company=lead.company_name)
    except Exception as e:
        error_msg = str(e)
        log.error("Failed to send outreach email", lead_id=lead.id, email=lead.email, error=error_msg)

    # Cập nhật Lead
    if success:
        lead.status = "SENT"
        lead.sent_count = (lead.sent_count or 0) + 1
        lead.last_sent_at = datetime.utcnow()
    else:
        lead.status = "FAILED"
        lead.notes = f"Lỗi gửi: {error_msg}"

    # Ghi log chi tiết
    log_entry = OutreachLog(
        lead_id=lead.id,
        recipient_email=lead.email,
        recipient_name=lead.contact_name,
        company_name=lead.company_name,
        industry=lead.industry,
        subject=email_data["subject"],
        email_body_preview=email_data["body_preview"],
        email_body_html=email_data["html"],
        template_type="cold_outreach",
        status="SUCCESS" if success else "FAILED",
        error_message=error_msg,
        sent_at=datetime.utcnow(),
    )
    db.add(log_entry)

    # Tăng bộ đếm sent_today nếu thành công
    if success:
        current_sent = int(get_setting(db, "sent_today", "0"))
        set_setting(db, "sent_today", str(current_sent + 1))

    db.commit()
    return success


def get_outreach_stats(db: Session) -> dict:
    """Thống kê toàn diện cho giao diện Admin Outreach."""
    check_and_reset_daily_quota(db)

    is_active = get_setting(db, "is_active", "false").lower() == "true"
    daily_limit = int(get_setting(db, "daily_limit", str(DEFAULT_DAILY_LIMIT)))
    sent_today = int(get_setting(db, "sent_today", "0"))
    min_interval = int(get_setting(db, "min_interval", str(DEFAULT_MIN_INTERVAL)))
    max_interval = int(get_setting(db, "max_interval", str(DEFAULT_MAX_INTERVAL)))
    next_send_time = get_setting(db, "next_send_time", "")

    total_leads = db.query(func.count(OutreachLead.id)).scalar() or 0
    pending_leads = db.query(func.count(OutreachLead.id)).filter(OutreachLead.status == "PENDING").scalar() or 0
    sent_leads = db.query(func.count(OutreachLead.id)).filter(OutreachLead.status == "SENT").scalar() or 0
    failed_leads = db.query(func.count(OutreachLead.id)).filter(OutreachLead.status == "FAILED").scalar() or 0

    total_logs = db.query(func.count(OutreachLog.id)).scalar() or 0

    return {
        "is_active": is_active,
        "daily_limit": daily_limit,
        "sent_today": sent_today,
        "remaining_today": max(0, daily_limit - sent_today),
        "min_interval_seconds": min_interval,
        "max_interval_seconds": max_interval,
        "next_send_time": next_send_time,
        "is_business_hours": is_within_business_hours(),
        "total_leads": total_leads,
        "pending_leads": pending_leads,
        "sent_leads": sent_leads,
        "failed_leads": failed_leads,
        "total_logs": total_logs,
    }


# ── Background Worker Loop ────────────────────────────────────────────────────

_worker_task = None

async def outreach_worker_loop():
    """
    Tiến trình chạy ngầm gửi email tự động an toàn:
    1. Kiểm tra trạng thái is_active
    2. Kiểm tra giờ làm việc & hạn mức 50 email/ngày
    3. Lấy 1 lead chờ gửi
    4. Gửi qua Resend API và ghi nhật ký
    5. Nghỉ ngẫu nhiên 3 - 8 phút trước khi lặp tiếp
    """
    log.info("Outreach background worker loop started")
    while True:
        try:
            db = SessionLocal()
            try:
                check_and_reset_daily_quota(db)
                is_active = get_setting(db, "is_active", "false").lower() == "true"
                daily_limit = int(get_setting(db, "daily_limit", str(DEFAULT_DAILY_LIMIT)))
                sent_today = int(get_setting(db, "sent_today", "0"))
                min_interval = int(get_setting(db, "min_interval", str(DEFAULT_MIN_INTERVAL)))
                max_interval = int(get_setting(db, "max_interval", str(DEFAULT_MAX_INTERVAL)))

                if not is_active:
                    # Bot đang tắt, nghỉ 15 giây rồi kiểm tra lại
                    await asyncio.sleep(15)
                    continue

                if sent_today >= daily_limit:
                    # Đã đạt hạn mức 50 email/ngày, nghỉ 60 giây
                    log.info("Daily outreach limit reached", sent=sent_today, limit=daily_limit)
                    await asyncio.sleep(60)
                    continue

                # Kiểm tra giờ hành chính
                ignore_hours = get_setting(db, "ignore_business_hours", "false").lower() == "true"
                if not ignore_hours and not is_within_business_hours():
                    log.info("Outside business hours, outreach sleeping...")
                    await asyncio.sleep(60)
                    continue

                # Lấy 1 lead đang chờ
                lead = db.query(OutreachLead).filter(
                    OutreachLead.status == "PENDING"
                ).order_by(OutreachLead.id.asc()).first()

                if not lead:
                    # Hết lead chờ gửi
                    log.info("No pending leads found")
                    await asyncio.sleep(30)
                    continue

                # Gửi email an toàn
                log.info("Sending outreach email", lead_id=lead.id, company=lead.company_name)
                send_outreach_to_lead(db, lead)

                # Tính toán thời gian giãn cách ngẫu nhiên 3 - 8 phút (180 - 480 giây)
                sleep_seconds = random.randint(min_interval, max_interval)
                next_time_vn = datetime.now(VN_TZ).timestamp() + sleep_seconds
                next_time_str = datetime.fromtimestamp(next_time_vn, VN_TZ).strftime("%H:%M:%S")
                set_setting(db, "next_send_time", next_time_str)

                log.info("Outreach sleeping safely before next email", seconds=sleep_seconds, next_time=next_time_str)
            finally:
                db.close()

            await asyncio.sleep(sleep_seconds)

        except asyncio.CancelledError:
            log.info("Outreach background worker loop cancelled")
            break
        except Exception as e:
            log.error("Error in outreach worker loop", error=str(e))
            await asyncio.sleep(30)


def start_outreach_worker():
    """Khởi động worker ngầm nếu chưa chạy."""
    global _worker_task
    if _worker_task is None or _worker_task.done():
        _worker_task = asyncio.create_task(outreach_worker_loop())
        log.info("Outreach background worker task launched")
