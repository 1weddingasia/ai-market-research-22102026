import os
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from dotenv import load_dotenv
load_dotenv("backend/.env")

# Add backend to path
sys.path.insert(0, os.path.abspath("backend"))

from services.email_service import send_survey_completed_email

recipient = "tanloifmc@yahoo.com"
survey_id = "DEMO-NIELSEN-BASES"
product_name = "Trà Kombucha Lên Men Men Xoài Cát Chu Tự Nhiên (330ml)"
model_type = "nielsen_bases"
sample_size = 1000
viability_score = 78
verdict = "STRONG GO (ĐỦ ĐIỀU KIỆN RA MẮT TOÀN QUỐC) — Điểm ý định mua thử vượt 73.4%."

print(f"Sending sample survey completed email to {recipient}...")
res = send_survey_completed_email(
    survey_id=survey_id,
    customer_email=recipient,
    product_name=product_name,
    model_type=model_type,
    sample_size=sample_size,
    viability_score=viability_score,
    verdict=verdict,
)

print("Result of send_survey_completed_email:", res)
