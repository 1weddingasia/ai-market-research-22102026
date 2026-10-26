# ==============================================================================
# EMAIL SERVICE - RESEND API INTEGRATION
# Gửi email hoàn tất báo cáo & Mã OTP tra cứu bảo mật
# ==============================================================================

import os
import resend
import structlog
from typing import Optional

log = structlog.get_logger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "hi@1booking.asia")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://insight.1booking.asia")


def _get_resend_client():
    api_key = os.getenv("RESEND_API_KEY", "")
    if not api_key:
        return None
    resend.api_key = api_key
    return resend


def send_survey_completed_email(
    survey_id: str,
    customer_email: str,
    product_name: str,
    model_type: str,
    sample_size: int,
    viability_score: int,
    verdict: str,
) -> bool:
    """
    Gửi email thông báo hoàn tất khảo sát theo tiêu chuẩn chuyên nghiệp.
    Tiêu đề: [Báo Cáo Nghiên Cứu Thị Trường] - Mã PANELXXXXXX - [Tên Sản Phẩm]
    """
    if not customer_email or "@" not in customer_email:
        return False

    client = _get_resend_client()
    if not client:
        log.warning("RESEND_API_KEY is not configured, skipping survey completion email")
        return False

    results_url = f"{FRONTEND_URL}/results/{survey_id}"
    print_url = f"{FRONTEND_URL}/results/{survey_id}/print"
    model_title = model_type.replace("_", " ").upper()

    subject = f"[Báo Cáo Nghiên Cứu Thị Trường] - Mã {survey_id} - {product_name}"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                        <!-- Header Banner -->
                        <tr>
                            <td style="background-color: #0A192F; padding: 36px 32px; text-align: left; border-bottom: 3px solid #D4AF37;">
                                <div style="display: inline-block; padding: 4px 12px; background: rgba(212, 175, 55, 0.2); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 20px; color: #D4AF37; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                    Executive Intelligence Report
                                </div>
                                <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 8px 0; line-height: 1.3;">
                                    Báo Cáo Nghiên Cứu Thị Trường AI
                                </h1>
                                <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                                    Mã hồ sơ: <span style="color: #D4AF37; font-weight: bold;">#{survey_id}</span> · Dự án: <span style="color: #ffffff; font-weight: bold;">{product_name}</span>
                                </p>
                            </td>
                        </tr>

                        <!-- Body Content -->
                        <tr>
                            <td style="padding: 32px 32px 24px 32px;">
                                <p style="font-size: 15px; color: #1e293b; line-height: 1.6; margin: 0 0 20px 0;">
                                    Kính gửi Quý Doanh nghiệp,
                                </p>
                                <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
                                    Khảo sát thị trường bằng tác tử AI mô phỏng với quy mô <strong>N = {sample_size:,} Personas</strong> đã hoàn tất phân tích toàn diện. Dưới đây là tóm tắt kết quả sơ bộ:
                                </p>

                                <!-- Key Stats Box -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                                    <tr>
                                        <td width="50%" style="padding: 16px 20px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                                            <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Điểm Khả Thi</div>
                                            <div style="font-size: 26px; font-weight: 900; color: #059669; margin-top: 4px;">{viability_score}<span style="font-size: 14px; color: #94a3b8; font-weight: normal;"> / 100</span></div>
                                        </td>
                                        <td width="50%" style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                                            <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Quy Mô Mẫu</div>
                                            <div style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px;">N = {sample_size:,}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 16px 20px;">
                                            <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Phương Pháp Luận</div>
                                            <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 4px;">{model_title} (Độ tin cậy 95%)</div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Executive Verdict -->
                                <div style="background-color: #fefce8; border-left: 4px solid #ca8a04; border-radius: 4px; padding: 14px 16px; margin-bottom: 28px;">
                                    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #854d0e; margin-bottom: 4px;">
                                        Nhận Định Điều Hành:
                                    </div>
                                    <div style="font-size: 13px; color: #713f12; line-height: 1.5; font-style: italic;">
                                        "{verdict}"
                                    </div>
                                </div>

                                <!-- CTA Buttons -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                                    <tr>
                                        <td align="center">
                                            <a href="{results_url}" target="_blank" style="display: block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);">
                                                Xem Báo Cáo Trực Tuyến & Phân Tích →
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding-top: 12px;">
                                            <a href="{print_url}" target="_blank" style="color: #b45309; text-decoration: none; font-size: 12px; font-weight: bold;">
                                                📄 Xem & Xuất Bản In Chiến Lược A4 Chuyên Sâu
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Enterprise Privacy Notice -->
                                <div style="border-top: 1px dashed #cbd5e1; padding-top: 16px; font-size: 12px; color: #64748b; line-height: 1.5;">
                                    🔒 <strong>Cam Kết Bảo Mật Doanh Nghiệp:</strong> Dữ liệu nghiên cứu và phản hồi của personas thuộc quyền sở hữu 100% của Quý Doanh nghiệp. Quý vị có toàn quyền xóa vĩnh viễn báo cáo này khỏi toàn bộ máy chủ bất kỳ lúc nào tại giao diện xem kết quả.
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="font-size: 11px; color: #94a3b8; margin: 0 0 6px 0;">
                                    © 2026 AI Market Research Platform · insight.1booking.asia
                                </p>
                                <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                                    Nền tảng nghiên cứu thị trường bằng Tác tử AI phân vai theo nhân khẩu học Việt Nam (Synthetic Personas)
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    try:
        from_address = os.getenv("EMAIL_FROM", "hi@1booking.asia")
        res = client.Emails.send({
            "from": f"AI Market Research <{from_address}>",
            "to": [customer_email],
            "subject": subject,
            "html": html_content,
        })
        log.info("Survey completed email sent successfully via Resend", survey_id=survey_id, to=customer_email, resend_id=getattr(res, "id", None))
        return True
    except Exception as e:
        log.warning("Failed to send survey completed email via Resend", survey_id=survey_id, error=str(e))
        return False


def send_lookup_otp_email(
    to_email: str,
    otp_code: str,
) -> bool:
    """
    Gửi mã OTP 6 số bảo mật để tra cứu báo cáo.
    """
    if not to_email or "@" not in to_email:
        return False

    client = _get_resend_client()
    if not client:
        log.warning("RESEND_API_KEY is not configured, skipping OTP email")
        return False

    subject = f"[insight.1booking.asia] Mã xác thực tra cứu báo cáo: {otp_code}"

    frontend_url = os.getenv("FRONTEND_URL", "https://insight.1booking.asia").rstrip("/")
    direct_access_url = f"{frontend_url}/tra-cuu?email={to_email}&otp={otp_code}"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>{subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
                        <tr>
                            <td style="background-color: #0A192F; padding: 28px 24px; text-align: center; border-bottom: 2px solid #D4AF37;">
                                <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">
                                    Xác Thực Tra Cứu Báo Cáo
                                </h2>
                                <p style="color: #94a3b8; font-size: 12px; margin: 6px 0 0 0;">
                                    AI Market Research Platform · insight.1booking.asia
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 32px 28px; text-align: center;">
                                <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0 0 20px 0;">
                                    Bạn vừa yêu cầu tra cứu danh sách các báo cáo nghiên cứu thị trường đã thực hiện với địa chỉ email: <strong style="color: #0A192F;">{to_email}</strong>.
                                </p>

                                <!-- 1-CLICK DIRECT ACCESS BUTTON -->
                                <div style="margin: 10px 0 24px 0;">
                                    <a href="{direct_access_url}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #0A192F; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
                                        👉 Nhấn Vào Đây Để Mở Báo Cáo Trực Tiếp
                                    </a>
                                </div>

                                <p style="font-size: 13px; color: #64748b; margin: 0 0 10px 0;">
                                    Hoặc bạn có thể nhập thủ công mã xác thực một lần (OTP):
                                </p>
                                <div style="display: inline-block; background-color: #f8fafc; border: 2px dashed #D4AF37; border-radius: 10px; padding: 12px 32px; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0A192F; margin-bottom: 18px;">
                                    {otp_code}
                                </div>
                                <p style="font-size: 12px; color: #dc2626; margin: 0 0 20px 0; font-weight: 600;">
                                    Mã này có hiệu lực trong vòng 10 phút. Tuyệt đối không chia sẻ mã này cho người khác.
                                </p>

                                <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 20px;">
                                    <p style="font-size: 11px; color: #94a3b8; line-height: 1.5; margin: 0 0 8px 0;">
                                        Đường dẫn truy cập trực tiếp: <br>
                                        <a href="{direct_access_url}" style="color: #2563eb; word-break: break-all; font-size: 11px;">{direct_access_url}</a>
                                    </p>
                                    <p style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin: 0;">
                                        Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email. Toàn bộ hồ sơ khảo sát được bảo vệ theo chuẩn mã hóa AES-256 đám mây.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    try:
        from_address = os.getenv("EMAIL_FROM", "hi@1booking.asia")
        res = client.Emails.send({
            "from": f"AI Market Research <{from_address}>",
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        })
        log.info("Lookup OTP email sent successfully via Resend", to=to_email, resend_id=getattr(res, "id", None))
        return True
    except Exception as e:
        log.warning("Failed to send lookup OTP email via Resend", to=to_email, error=str(e))
        return False
