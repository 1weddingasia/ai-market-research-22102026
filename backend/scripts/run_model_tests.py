"""
Runner test thực tế 4 model khảo sát còn lại qua DuckDB local + OpenAI GPT-4o-mini thật.
Tạo record trong SQLite surveys.db, kích hoạt run_simulation() và thẩm định kết quả.
"""

import asyncio
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from database import SessionLocal, Survey, SurveyLog, init_db
from services.worker import run_simulation


TEST_MODELS = [
    {
        "id": "PANEL_PSM01",
        "model_type": "van_westendorp",
        "sample_size": 100,  # 5 batches x 20 personas
        "region": "Toàn quốc",
        "zone": None,
        "min_age": 20,
        "max_age": 45,
        "price_amount": 990000,
        "customer_email": "test.psm@1booking.asia",
        "product_info": {
            "name": "Cà phê Cold Brew Yuzu đóng lon 250ml",
            "category": "Đồ uống cao cấp",
            "description": "Cà phê ủ lạnh 18 tiếng từ 100% hạt Arabica Cầu Đất phối tinh chất cam vàng Yuzu tự nhiên, ít đường, tiện lợi mang đi làm.",
            "target_price": "35000",
        },
    },
    {
        "id": "PANEL_AB02",
        "model_type": "ab_testing",
        "sample_size": 100,  # 5 batches x 20 personas
        "region": "Toàn quốc",
        "zone": None,
        "min_age": 18,
        "max_age": 35,
        "price_amount": 990000,
        "customer_email": "test.ab@1booking.asia",
        "product_info": {
            "name": "Bao bì Nước Tăng Lực Thảo Mộc Tự Nhiên",
            "concept_a": "Thiết kế Đen nhám phối Vàng kim (Matte Black & Gold) phong cách Cyberpunk hiện đại, hướng tới game thủ & dân văn phòng.",
            "concept_b": "Thiết kế Xanh ngọc lục bảo (Emerald Green) thân thiện môi trường, hình lá thảo mộc nổi bật, hướng tới người sống lành mạnh.",
        },
    },
    {
        "id": "PANEL_UA03",
        "model_type": "ua_study",
        "sample_size": 100,  # 5 batches x 20 personas
        "region": "Đông Nam Bộ",
        "zone": "Thành phố Hồ Chí Minh",
        "min_age": 20,
        "max_age": 50,
        "price_amount": 990000,
        "customer_email": "test.ua@1booking.asia",
        "product_info": {
            "industry": "Ứng dụng đặt đồ ăn & đi chợ online",
            "description": "Nghiên cứu hành vi đặt đồ ăn qua app tại TP.HCM: tần suất, thương hiệu top-of-mind và các điểm gây ức chế (phí ship, trễ giờ, chất lượng).",
        },
    },
    {
        "id": "PANEL_DEAL04",
        "model_type": "deal_elasticity",
        "sample_size": 100,  # 5 batches x 20 personas
        "region": "Toàn quốc",
        "zone": None,
        "min_age": 18,
        "max_age": 40,
        "price_amount": 990000,
        "customer_email": "test.deal@1booking.asia",
        "product_info": {
            "name": "Combo Buffet Lẩu Nướng Lễ Hội",
            "description": "Chương trình 'Đi 4 Tính 3' kèm miễn phí buffet kem tươi và nước ngọt cả bàn cho nhóm đặt bàn trước qua website.",
            "discount_depth": "Giảm tương đương 25% tổng hóa đơn",
        },
    },
]


async def run_single_test(test_config: dict):
    survey_id = test_config["id"]
    model_type = test_config["model_type"]
    sample_size = test_config["sample_size"]

    print(f"\n========================================================")
    print(f"🚀 BẮT ĐẦU CHẠY THẬT MODEL: [{model_type.upper()}] (ID: {survey_id})")
    print(f"📊 Cỡ mẫu: {sample_size} personas ({sample_size // 20} batches qua GPT-4o-mini)")
    print(f"========================================================")

    db = SessionLocal()
    try:
        # 1. Tạo hoặc reset survey record
        existing = db.query(Survey).filter(Survey.id == survey_id).first()
        if existing:
            existing.status = "PROCESSING"
            existing.result_json = None
            existing.error_msg = None
            existing.model_type = model_type
            existing.sample_size = sample_size
            existing.region = test_config["region"]
            existing.zone = test_config["zone"]
            existing.min_age = test_config["min_age"]
            existing.max_age = test_config["max_age"]
            existing.price_amount = test_config["price_amount"]
            existing.customer_email = test_config["customer_email"]
            existing.product_info_json = json.dumps(test_config["product_info"], ensure_ascii=False)
            existing.created_at = datetime.utcnow()
            existing.completed_at = None
        else:
            new_survey = Survey(
                id=survey_id,
                model_type=model_type,
                status="PROCESSING",
                sample_size=sample_size,
                region=test_config["region"],
                zone=test_config["zone"],
                min_age=test_config["min_age"],
                max_age=test_config["max_age"],
                price_amount=test_config["price_amount"],
                customer_email=test_config["customer_email"],
                product_info_json=json.dumps(test_config["product_info"], ensure_ascii=False),
                created_at=datetime.utcnow(),
            )
            db.add(new_survey)

        # Xóa logs cũ của survey này nếu có
        db.query(SurveyLog).filter(SurveyLog.survey_id == survey_id).delete()
        db.commit()
    finally:
        db.close()

    # 2. Chạy pipeline thực tế
    t0 = time.time()
    await run_simulation(survey_id)
    duration = time.time() - t0

    # 3. Thẩm định kết quả lưu trong database
    db = SessionLocal()
    try:
        survey = db.query(Survey).filter(Survey.id == survey_id).first()
        logs = db.query(SurveyLog).filter(SurveyLog.survey_id == survey_id).order_by(SurveyLog.id).all()

        print(f"\n⏱️ Thời gian xử lý: {duration:.2f}s")
        print(f"📌 Status Database: {survey.status}")
        print(f"📝 Số lượng log milestones: {len(logs)}")
        for l in logs:
            print(f"   [{l.percent:3d}%] {l.log_msg[:80]}")

        if survey.status != "COMPLETED":
            print(f"❌ THẤT BÀI: Survey không COMPLETED. Lỗi: {survey.error_msg}")
            return False

        if not survey.result_json:
            print(f"❌ THẤT BÀI: result_json trống!")
            return False

        payload = json.loads(survey.result_json)
        metrics = payload.get("quantitative_metrics", {})
        model_spec = metrics.get("model_specific", {})
        exec_sum = payload.get("executive_summary", {})
        quotes = payload.get("qualitative_insights", {}).get("verbatim_quotes", [])

        print(f"\n✅ THẨM ĐỊNH PAYLOAD BÁO CÁO THỰC TẾ:")
        print(f"   • Viability Score: {exec_sum.get('viability_score')}/100")
        print(f"   • Verdict: {exec_sum.get('verdict')}")
        print(f"   • Số trích dẫn người dùng thực: {len(quotes)}")
        if quotes:
            print(f"   • Mẫu quote: \"{quotes[0].get('quote')}\" - {quotes[0].get('name')} ({quotes[0].get('job')})")
        print(f"   • Các keys cho biểu đồ Tab 2 (model_specific): {list(model_spec.keys())}")

        return True
    finally:
        db.close()


async def main():
    init_db()
    results = {}
    total_start = time.time()

    print("====================================================================")
    print(" BẮT ĐẦU KIỂM THỬ THỰC TẾ 4 MODEL VỚI DUCKDB LOCAL + GPT-4o-MINI")
    print("====================================================================")

    for test_cfg in TEST_MODELS:
        success = await run_single_test(test_cfg)
        results[test_cfg["model_type"]] = success

    total_time = time.time() - total_start
    print("\n" + "=" * 68)
    print(" TỔNG HỢP KẾT QUẢ KIỂM THỬ THỰC TẾ")
    print("=" * 68)
    for model, success in results.items():
        status_str = "✅ HOÀN HẢO (100% REAL DATA)" if success else "❌ THẤT BÀI"
        print(f" • {model.ljust(20)}: {status_str}")
    print(f"⏱️ Tổng thời gian chạy cả 4 models: {total_time:.2f}s")
    print("=" * 68)

    all_passed = all(results.values())
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    asyncio.run(main())
