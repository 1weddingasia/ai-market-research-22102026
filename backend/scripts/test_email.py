import os
import sys
from dotenv import load_dotenv

load_dotenv("backend/.env")
import resend

resend.api_key = os.getenv("RESEND_API_KEY")
email_from = os.getenv("EMAIL_FROM", "hi@1booking.asia")

print(f"Resend Key Prefix: {resend.api_key[:12] if resend.api_key else 'None'}")
print(f"Sender: {email_from}")

# Test recipient: leloi.1booking@gmail.com or onboarding test
recipient = "leloi.1booking@gmail.com"

try:
    resp = resend.Emails.send({
        "from": f"AI Market Research <{email_from}>",
        "to": [recipient],
        "subject": "🧪 [TEST XÁC THỰC RESEND] Kiểm định khả năng gửi email thực tế",
        "html": """
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
            <h2 style="color: #0A192F;">Xác Thực Hệ Thống Email Thành Công! ✅</h2>
            <p style="color: #334155; font-size: 14px;">
                Email này được gửi trực tiếp từ hệ thống <strong>insight.1booking.asia</strong> qua máy chủ Resend.
            </p>
            <p style="color: #475569; font-size: 13px;">
                Trạng thái: <strong>Sẵn sàng phục vụ khách hàng thật</strong>.<br>
                Thời gian: <strong>23/10/2026</strong>.
            </p>
        </div>
        """
    })
    print("EMAIL SENT SUCCESSFULLY! Resend Message ID:", repr(resp))
except Exception as e:
    print("EMAIL ERROR:", repr(str(e)))
