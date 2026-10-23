"""
Live End-to-End Production Verification Script
Tests the full lifecycle against https://insight-market-research-backend-production.up.railway.app
"""

import os
import sys
import time
import httpx
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

BASE_URL = "https://insight-market-research-backend-production.up.railway.app"
SEPAY_TOKEN = os.getenv("SEPAY_API_TOKEN", "")

print("=" * 70)
print("BẮT ĐẦU TỔNG THẨM ĐỊNH TOÀN DIỆN HỆ THỐNG PRODUCTION (LIVE E2E AUDIT)")
print("Backend Target:", BASE_URL)
print("=" * 70)

client = httpx.Client(timeout=30.0)

# 1. Health check & Config flags
print("\n[BƯỚC 1] KIỂM TRA SỨC KHỎE VÀ BIẾN MÔI TRƯỜNG...")
r_health = client.get(f"{BASE_URL}/health")
print("Status code:", r_health.status_code)
health_data = r_health.json()
print("Payload:", health_data)
assert r_health.status_code == 200, "Health check failed"
configs = health_data.get("config_check", {})
for k, v in configs.items():
    print(f"  - {k}: {'SẴN SÀNG (TRUE)' if v else 'CHƯA CÓ (FALSE)'}")
assert all(configs.values()), "Có biến môi trường chưa sẵn sàng!"

# 2. Survey Configs (9 Mô hình chuẩn hóa)
print("\n[BƯỚC 2] KIỂM TRA DANH MỤC 9 MÔ HÌNH PHƯƠNG PHÁP LUẬN...")
r_configs = client.get(f"{BASE_URL}/survey/configs")
assert r_configs.status_code == 200, "Get configs failed"
all_configs = r_configs.json().get("configs", [])
print(f"Tổng số mô hình đã tải: {len(all_configs)}")
for cfg in all_configs:
    q_count = len(cfg.get("questions", []))
    print(f"  • {cfg.get('id')}: {cfg.get('name')} — {q_count} câu hỏi chuẩn hóa ({cfg.get('framework')})")
assert len(all_configs) == 9, "Không đủ 9 mô hình!"

# 3. Tạo một đơn khảo sát thật (POST /survey/create)
print("\n[BƯỚC 3] TẠO ĐƠN KHẢO SÁT THẬT (POST /survey/create)...")
test_create_payload = {
    "model_type": "nielsen_bases",
    "region": "Toàn quốc",
    "zone": "TP. Hồ Chí Minh",
    "min_age": 20,
    "max_age": 45,
    "sample_size": 100,  # Test mẫu 100 personas để hoàn tất nhanh
    "product_info": {
        "product_name": "Cà Phê Hòa Tan Nấm Linh Chi Sâm Ngọc Linh",
        "description": "Dòng cà phê năng lượng thảo mộc cao cấp, kết hợp cà phê Robusta Đắk Lắk với chiết xuất Nấm Linh Chi và Sâm Ngọc Linh. Giúp tỉnh táo kéo dài suốt 8 tiếng mà không gây cồn cào tim đập nhanh.",
        "expected_price": "180.000đ/hộp 20 gói"
    },
    "customer_email": "tanloifmc@yahoo.com"
}

r_create = client.post(f"{BASE_URL}/survey/create", json=test_create_payload)
print("Create status:", r_create.status_code)
create_data = r_create.json()
survey_id = create_data.get("survey_id")
price_amount = create_data.get("price_amount")
qr_data = create_data.get("qr_data", {})
print(f"  → Mã đơn tạo thành công: #{survey_id}")
print(f"  → Giá tiền: {price_amount:,} VND")
print(f"  → Trạng thái ban đầu: {create_data.get('status')}")
print(f"  → Dữ liệu VietQR: Ngân hàng {qr_data.get('bankName')}, STK {qr_data.get('accountNumber')}, Nội dung: {qr_data.get('addInfo')}")
assert survey_id, "Không nhận được survey_id!"

# 4. Kiểm tra trạng thái đơn trước khi thanh toán
print("\n[BƯỚC 4] KIỂM TRA TRẠNG THÁI ĐƠN TRÊN SUPABASE (GET /survey/{id}/status)...")
r_status_pre = client.get(f"{BASE_URL}/survey/{survey_id}/status")
print("Status trước thanh toán:", r_status_pre.json())
assert r_status_pre.json().get("status") == "PENDING_PAYMENT", "Trạng thái phải là PENDING_PAYMENT"

# 5. Kích hoạt Webhook SePay thật (POST /payment/webhook)
print("\n[BƯỚC 5] MÔ PHỎNG SEPAY BẮN WEBHOOK XÁC NHẬN TIỀN VỀ...")
webhook_payload = {
    "id": int(time.time()),
    "gateway": "TPBank",
    "transactionDate": time.strftime("%Y-%m-%d %H:%M:%S"),
    "accountNumber": "00003554020",
    "subAccount": None,
    "code": None,
    "content": f"SURVEY {survey_id}",
    "transferType": "in",
    "transferAmount": float(price_amount),
    "accumulated": float(price_amount),
    "referenceCode": f"REF-{survey_id}",
    "description": f"Chuyen tien khao sat {survey_id}"
}

r_webhook = client.post(
    f"{BASE_URL}/payment/webhook",
    headers={"Authorization": f"Apikey {SEPAY_TOKEN}"},
    json=webhook_payload
)
print("Webhook response code:", r_webhook.status_code)
print("Webhook response body:", r_webhook.text)
assert r_webhook.status_code == 200, f"Webhook failed: {r_webhook.text}"
webhook_resp = r_webhook.json()
assert webhook_resp.get("status") == "ok", "Webhook không trả về status ok"

# 6. Theo dõi tiến trình xử lý
print("\n[BƯỚC 6] THEO DÕI TIẾN TRÌNH AI WORKER (DUCKDB → GPT-4o-MINI → DEEPSEEK REASONER)...")
max_wait = 90
start_time = time.time()
completed = False

while time.time() - start_time < max_wait:
    r_check = client.get(f"{BASE_URL}/survey/{survey_id}/status")
    curr_status = r_check.json().get("status")
    elapsed = int(time.time() - start_time)
    print(f"  [Giây {elapsed:02d}] Trạng thái hiện tại: {curr_status}")
    if curr_status == "COMPLETED":
        completed = True
        break
    elif curr_status == "FAILED":
        err_msg = r_check.json().get("error_msg")
        print(f"  ❌ Khảo sát thất bại với lỗi: {err_msg}")
        break
    time.sleep(3)

assert completed, "Khảo sát chưa hoàn tất trong thời gian quy định!"

# 7. Kiểm tra Báo cáo kết quả chi tiết
print("\n[BƯỚC 7] KIỂM TRA BÁO CÁO KẾT QUẢ CUỐI CÙNG (GET /survey/{id}/results)...")
r_results = client.get(f"{BASE_URL}/survey/{survey_id}/results")
assert r_results.status_code == 200, "Get results failed"
res_data = r_results.json()
exec_summary = res_data.get("executive_summary", {})
metrics = res_data.get("quantitative_metrics", {})
deepseek_audit = metrics.get("model_specific", {}).get("deepseek_audit", {})

print(f"  ✔ Điểm khả thi thị trường (Viability Score): {exec_summary.get('viability_score')}/100")
print(f"  ✔ Phán quyết điều hành (Verdict): {exec_summary.get('verdict')}")
print(f"  ✔ Thẩm định viên DeepSeek: {deepseek_audit.get('auditor_model')}")
print(f"  ✔ Số trích dẫn người tiêu dùng thực (VoC Verbatim): {len(res_data.get('qualitative_insights', {}).get('verbatim_quotes', []))} trích dẫn")
print(f"  ✔ Số khuyến nghị chiến lược C-Level: {len(res_data.get('actionable_recommendations', []))} đề xuất")

# 8. Kiểm tra Xuất Báo cáo PDF
print("\n[BƯỚC 8] KIỂM TRA KẾT XUẤT FILE BÁO CÁO PDF (GET /survey/{id}/pdf)...")
r_pdf = client.get(f"{BASE_URL}/survey/{survey_id}/pdf")
print("PDF Status code:", r_pdf.status_code)
print("PDF Content Type:", r_pdf.headers.get("content-type"))
print("PDF Size:", len(r_pdf.content), "bytes")
assert r_pdf.status_code == 200, "Tải PDF thất bại"
assert "application/pdf" in r_pdf.headers.get("content-type", ""), "Không phải định dạng PDF chuẩn"

print("\n" + "=" * 70)
print("🎉 KẾT QUẢ THẨM ĐỊNH: 100% CÁC KHÂU NGHIỆP VỤ ĐÃ THÔNG LUỒNG THẬT TRÊN CLOUD!")
print("=" * 70)
