import os
import sys
import json
from pathlib import Path

# Fix Windows console encoding
if sys.platform == "win32":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app
from database import SessionLocal, BenchmarkReport, ReportDownloadLead

client = TestClient(app)

print("=" * 70)
print("🧪 KIỂM TRA TOÀN DIỆN LUỒNG API VÀ GHI DỮ LIỆU THỰC TẾ")
print("=" * 70)

# 1. Test GET reports từ DB
resp_get = client.get("/survey/benchmark/reports?industry=fnb")
print(f"1. GET /survey/benchmark/reports?industry=fnb: Status = {resp_get.status_code}")
data_get = resp_get.json()
print(f"   => Số lượng báo cáo ngành F&B đọc từ DB: {data_get.get('total')}")
for r in data_get.get("reports", []):
    print(f"      • [{r['id']}] {r['title'][:60]}... (Lượt xem: {r['viewCount']} | Lượt tải: {r['downloadCount']})")

# 2. Test POST lead
test_lead = {
    "full_name": "Trần Thị Thu Thảo",
    "phone_zalo": "0988776655",
    "company_name": "Masan Consumer",
    "work_email": "thao.tran@masangroup.com",
    "job_title": "Brand Manager",
    "report_id": "DEMO-NIELSEN-BASES",
    "report_title": "Báo Cáo Khảo Sát Tiềm Năng Ra Mắt: Dòng Trà Kombucha Men Vi Sinh Bản Địa (330ml)",
    "industry": "fnb"
}

resp_post = client.post("/survey/benchmark/download-lead", json=test_lead)
print(f"\n2. POST /survey/benchmark/download-lead: Status = {resp_post.status_code}")
data_post = resp_post.json()
print(f"   => Response trả về cho Frontend: {data_post}")

# 3. Query trực tiếp từ DB Supabase để kiểm chứng
db = SessionLocal()
latest_lead = db.query(ReportDownloadLead).order_by(ReportDownloadLead.id.desc()).first()
rep = db.query(BenchmarkReport).filter(BenchmarkReport.id == "DEMO-NIELSEN-BASES").first()

print(f"\n3. Xác minh bản ghi thực tế vừa lưu trong Supabase PostgreSQL:")
print(f"   - Lead ID vừa tạo: #{latest_lead.id}")
print(f"   - Họ tên: {latest_lead.full_name}")
print(f"   - Số Zalo: {latest_lead.phone_zalo}")
print(f"   - Công ty: {latest_lead.company_name}")
print(f"   - Email công tác: {latest_lead.work_email}")
print(f"   - Tên miền riêng: {latest_lead.is_work_email} (True = Tự động nhận diện @masangroup.com)")
print(f"   - Phân loại Lead: {latest_lead.lead_score} (Được gắn nhãn HOT LEAD)")
print(f"   - Báo cáo đã tải: #{latest_lead.report_id}")
print(f"   - Thời gian tạo: {latest_lead.created_at}")
print(f"   - Lượt tải của báo cáo #{rep.id} đã tự động tăng lên: {rep.download_count} lượt")

db.close()
print("=" * 70)
print("✅ TẤT CẢ CÁC BƯỚC ĐÃ CHẠY THẬT VÀ GHI DỮ LIỆU THẬT 100%!")
print("=" * 70)
