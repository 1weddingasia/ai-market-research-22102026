"""
Script Thực Thi Khảo Sát Ngành Thật Sự (Authentic Industry Benchmark Survey Runner)
Chạy pipeline hoàn chỉnh từ DuckDB (personas_vn_1m.parquet) -> LLM Multi-Persona -> Analysis Engine -> DeepSeek Audit -> Supabase -> Telegram.
"""

import asyncio
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

# Fix Windows console encoding for Unicode/emoji
if sys.platform == "win32":
    os.environ.setdefault("PYTHONUTF8", "1")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Ensure backend root is on sys.path and load .env
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv(backend_dir / ".env")

from database import init_db, SessionLocal, Survey, BenchmarkReport
from services.worker import run_simulation
from services.telegram_service import send_telegram_message

# Danh mục 6 Khảo sát Ngành Chuẩn Quốc Tế phục vụ Doanh Nghiệp
BENCHMARK_TOPICS = [
    {
        "index": 1,
        "id": "BM-FNB-2026-PSM",
        "slug": "fnb-do-uong-it-duong-psm-2026",
        "title": "Báo Cáo Đo Lường Ngưỡng Giá Chấp Nhận & Xu Hướng: Đồ Uống Ít Đường & Thảo Mộc Bản Địa (Quý 1/2026)",
        "industry": "fnb",
        "industry_label": "F&B · Đồ Uống Tự Nhiên",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "van_westendorp",
        "model_label": "Van Westendorp PSM",
        "sample_size": 200,  # 10 batches x 20 personas đại diện phân tầng
        "region": "Toàn quốc",
        "zone": "urban",
        "min_age": 20,
        "max_age": 45,
        "target_gender": "all",
        "target_income": "AB",
        "target_marital_status": "all",
        "target_occupation": "office",
        "target_zone": "urban",
        "product_info": {
            "name": "Nước Thảo Mộc Bản Địa Lên Men Ít Đường (Lon Sleek 330ml)",
            "category": "F&B · Đồ uống tốt cho sức khỏe",
            "description": "Dòng nước giải khát thảo mộc lên men tự nhiên (trà hoa vàng phối hoa atiso đỏ và cỏ ngọt), lượng calo < 25 kcal/lon, không chất bảo quản, đóng lon sleek hiện đại.",
            "target_price": "28000",
            "competitors": "Nước ngọt có gas truyền thống (10.000đ - 12.000đ), Trà đóng chai RTD (12.000đ - 15.000đ), Kombucha nhập khẩu (50.000đ - 65.000đ)",
        },
        "tags": ["F&B", "Ít đường", "Thảo mộc", "Định giá PSM", "Quý 1/2026"],
    },
    {
        "index": 2,
        "id": "BM-FMCG-2026-BASES",
        "slug": "thuc-pham-dong-goi-bases-2026",
        "title": "Báo Cáo Kiểm Định Khả Thi Ra Mắt: Gia Vị Bản Địa & Thực Phẩm Chế Biến Sẵn Tiện Lợi (Quý 1/2026)",
        "industry": "fmcg",
        "industry_label": "Thực Phẩm Đóng Gói · FMCG",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "nielsen_bases",
        "model_label": "Nielsen BASES",
        "sample_size": 200,
        "region": "Toàn quốc",
        "zone": None,
        "min_age": 25,
        "max_age": 55,
        "target_gender": "female",
        "target_income": "all",
        "target_marital_status": "married",
        "target_occupation": "all",
        "target_zone": "all",
        "product_info": {
            "name": "Sốt Nấu Hoàn Chỉnh Vị Thảo Mộc Bản Địa Tiện Lợi (Gói 120g)",
            "category": "Gia vị & Thực phẩm chế biến sẵn",
            "description": "Gói sốt hoàn chỉnh chiết xuất từ tiêu rừng Tây Bắc và mật mía Nghệ An, chuẩn hóa khẩu vị gia đình trong 10 phút nấu, không chất điều vị nhân tạo.",
            "target_price": "32000",
        },
        "tags": ["FMCG", "Gia vị bản địa", "Nielsen BASES", "Nấu ăn tiện lợi", "Quý 1/2026"],
    },
    {
        "index": 3,
        "id": "BM-BEAUTY-2026-MAP",
        "slug": "duoc-my-pham-genz-map-2026",
        "title": "Báo Cáo Bản Đồ Nhận Thức Định Vị Thương Hiệu: Ngành Dược Mỹ Phẩm Sạch Cho Gen Z (Quý 1/2026)",
        "industry": "cosmetics",
        "industry_label": "Mỹ Phẩm & Chăm Sóc Da",
        "period_type": "quarterly",
        "period_label": "Quý 1/2026",
        "model_type": "brand_perceptual_map",
        "model_label": "Brand Perceptual Map",
        "sample_size": 200,
        "region": "Đông Nam Bộ",
        "zone": "urban",
        "min_age": 18,
        "max_age": 32,
        "target_gender": "female",
        "target_income": "all",
        "target_marital_status": "single",
        "target_occupation": "all",
        "target_zone": "urban",
        "product_info": {
            "name": "Serum Phục Hồi Rau Má Rừng & B5 Bản Địa",
            "category": "Dược mỹ phẩm chăm sóc da mặt",
            "description": "Tinh chất phục hồi da mụn nhạy cảm chiết xuất rau má rừng hữu cơ Đắk Lắk kết hợp 5% Vitamin B5, bao bì tối giản tái chế, bán qua TikTok Shop và Shopee.",
            "brands": "La Roche-Posay, Cocoon, Klairs, The Ordinary, Nhãn hàng Khảo sát",
        },
        "tags": ["Dược mỹ phẩm", "Gen Z", "Brand Map", "Thị phần nhận thức", "Quý 1/2026"],
    },
    {
        "index": 4,
        "id": "BM-TECH-2026-KANO",
        "slug": "gia-dung-thong-minh-kano-2026",
        "title": "Báo Cáo Phân Tích Tính Năng Cốt Lõi vs Kỳ Vọng Vượt Trội: Thiết Bị Gia Dụng Thông Minh (2026)",
        "industry": "smart_home",
        "industry_label": "Gia Dụng & Smarthome",
        "period_type": "yearly",
        "period_label": "Năm 2026",
        "model_type": "kano",
        "model_label": "Kano Model",
        "sample_size": 200,
        "region": "Toàn quốc",
        "zone": "urban",
        "min_age": 26,
        "max_age": 48,
        "target_gender": "all",
        "target_income": "AB",
        "target_marital_status": "married",
        "target_occupation": "office",
        "target_zone": "urban",
        "product_info": {
            "name": "Nồi Chiên Không Dầu Hơi Nước Kết Nối App Điều Khiển Giọng Nói Tiếng Việt",
            "category": "Thiết bị nhà bếp thông minh",
            "description": "Nồi chiên kết hợp hấp hơi nước đa tầng, tự động điều chỉnh nhiệt qua cảm biến thực phẩm, điều khiển qua smartphone và nhận lệnh giọng nói tiếng Việt.",
        },
        "tags": ["Gia dụng", "Smarthome", "Kano Model", "Tính năng vượt trội", "Năm 2026"],
    },
    {
        "index": 5,
        "id": "BM-GIFT-2026-DEAL",
        "slug": "banh-keo-qua-bieu-deal-2026",
        "title": "Báo Cáo Đo Lường Độ Nhạy Khuyến Mại & Chính Sách Chiết Khấu: Quà Tặng Doanh Nghiệp B2B (2026)",
        "industry": "confectionery",
        "industry_label": "Bánh Kẹo · Quà Tặng B2B",
        "period_type": "yearly",
        "period_label": "Năm 2026",
        "model_type": "concept_deal",
        "model_label": "Deal Elasticity",
        "sample_size": 200,
        "region": "Toàn quốc",
        "zone": "urban",
        "min_age": 28,
        "max_age": 55,
        "target_gender": "all",
        "target_income": "A",
        "target_marital_status": "all",
        "target_occupation": "business",
        "target_zone": "urban",
        "product_info": {
            "name": "Hộp Quà Bánh Thảo Dược & Hạt Đặc Sản Thượng Hạng Thiết Kế Riêng Doanh Nghiệp",
            "category": "Quà tặng B2B Mùa Vụ",
            "description": "Set quà cao cấp gồm bánh quy hạt điều Bình Phước, hạt sen sấy Huế và trà cổ thụ Tà Xùa đóng hộp sơn mài in logo doanh nghiệp theo yêu cầu.",
            "target_price": "850000",
        },
        "tags": ["B2B Gifting", "Bánh kẹo mùa vụ", "Chiết khấu tối ưu", "Deal Elasticity", "Năm 2026"],
    },
    {
        "index": 6,
        "id": "BM-EDTECH-2026-MAXDIFF",
        "slug": "edtech-ky-nang-so-maxdiff-2026",
        "title": "Báo Cáo Xếp Hạng Ưu Tiên Quyết Định Lựa Chọn Khóa Học Kỹ Năng Số Thực Chiến (2026)",
        "industry": "edtech",
        "industry_label": "EdTech & Đào Tạo Số",
        "period_type": "yearly",
        "period_label": "Năm 2026",
        "model_type": "maxdiff",
        "model_label": "MaxDiff Scaling",
        "sample_size": 200,
        "region": "Toàn quốc",
        "zone": "urban",
        "min_age": 22,
        "max_age": 40,
        "target_gender": "all",
        "target_income": "all",
        "target_marital_status": "all",
        "target_occupation": "office",
        "target_zone": "urban",
        "product_info": {
            "name": "Chương Trình Đào Tạo Ứng Dụng AI & Phân Tích Dữ Liệu Thực Chiến Dành Cho Người Đi Làm",
            "category": "Đào tạo kỹ năng số",
            "description": "Khóa đào tạo 8 tuần kèm 1:1 bởi chuyên gia từ các tập đoàn công nghệ, cấp chứng chỉ quốc tế và bảo đảm kết nối dự án thực tế.",
        },
        "tags": ["EdTech", "Kỹ năng AI", "MaxDiff", "Độ ưu tiên", "Năm 2026"],
    },
]


async def execute_benchmark_survey(topic_config: dict) -> bool:
    """Khởi tạo và thực thi một khảo sát ngành thật sự."""
    survey_id = topic_config["id"]
    model_type = topic_config["model_type"]
    sample_size = topic_config["sample_size"]
    print(f"\n{'='*70}")
    print(f"🚀 BẮT ĐẦU CHẠY KHẢO SÁT NGÀNH: [{survey_id}]")
    print(f"📌 Tiêu đề: {topic_config['title']}")
    print(f"📐 Mô hình: {topic_config['model_label']} ({model_type})")
    print(f"👥 Quy mô mẫu: N = {sample_size:,} tác tử AI phân tầng theo Niên giám GSO")
    print(f"{'='*70}\n")

    db = SessionLocal()
    try:
        # 1. Tạo hoặc cập nhật Survey record
        survey = db.query(Survey).filter(Survey.id == survey_id).first()
        if not survey:
            survey = Survey(
                id=survey_id,
                model_type=model_type,
                sample_size=sample_size,
                region=topic_config.get("region", "Toàn quốc"),
                zone=topic_config.get("zone"),
                min_age=topic_config["min_age"],
                max_age=topic_config["max_age"],
                price_amount=1990000,
                status="PROCESSING",
                paid_at=datetime.utcnow(),
                customer_email="benchmark@1booking.asia",
                product_info_json=json.dumps(topic_config["product_info"], ensure_ascii=False),
                target_gender=topic_config.get("target_gender", "all"),
                target_income=topic_config.get("target_income", "all"),
                target_marital_status=topic_config.get("target_marital_status", "all"),
                target_occupation=topic_config.get("target_occupation", "all"),
                target_zone=topic_config.get("target_zone", "all"),
            )
            db.add(survey)
            db.commit()
            print(f"[DB] Đã khởi tạo Survey record: {survey_id}")
        else:
            survey.status = "PROCESSING"
            survey.model_type = model_type
            survey.sample_size = sample_size
            survey.product_info_json = json.dumps(topic_config["product_info"], ensure_ascii=False)
            survey.target_gender = topic_config.get("target_gender", "all")
            survey.target_income = topic_config.get("target_income", "all")
            survey.target_marital_status = topic_config.get("target_marital_status", "all")
            survey.target_occupation = topic_config.get("target_occupation", "all")
            survey.target_zone = topic_config.get("target_zone", "all")
            db.commit()
            print(f"[DB] Đã cập nhật Survey record sang PROCESSING: {survey_id}")

        # 2. Thực thi pipeline nền chính thức
        start_time = time.time()
        print(f"⏳ Đang thực thi simulation & phân tích chuyên sâu cho {survey_id}...")
        await run_simulation(survey_id)
        elapsed = time.time() - start_time
        print(f"✅ Hoàn tất pipeline khảo sát sau {elapsed:.1f} giây!")

        # 3. Kiểm tra kết quả trong DB
        db.refresh(survey)
        if survey.status != "COMPLETED" or not survey.result_json:
            print(f"❌ Khảo sát không đạt trạng thái COMPLETED! Status={survey.status}")
            return False

        report_data = json.loads(survey.result_json)
        exec_sum = report_data.get("executive_summary", {})
        quant = report_data.get("quantitative_metrics", {})
        viability = exec_sum.get("viability_score", 75)
        verdict = exec_sum.get("verdict", "HOÀN TẤT PHÂN TÍCH")

        print(f"📊 Kết quả: Viability Score = {viability} | Nhận định: {verdict[:80]}...")

        # 4. Lưu/Cập nhật vào bảng benchmark_reports trên Supabase
        findings_list = [
            f"Mẫu nghiên cứu gồm {survey.sample_size:,} tác tử AI đối chuẩn phân tầng theo Niên giám GSO.",
            f"Chỉ số khả thi đạt {viability}/100, xác lập cơ sở chiến lược ra quyết định đầu tư.",
            f"Khuyến nghị cốt lõi: {report_data.get('actionable_recommendations', ['Đang cập nhật'])[0][:120]}...",
        ]
        bm = db.query(BenchmarkReport).filter(BenchmarkReport.id == survey_id).first()
        if not bm:
            bm = BenchmarkReport(
                id=survey_id,
                slug=topic_config["slug"],
                title=topic_config["title"],
                industry=topic_config["industry"],
                industry_label=topic_config["industry_label"],
                period_type=topic_config["period_type"],
                period_label=topic_config["period_label"],
                model_type=topic_config["model_type"],
                model_label=topic_config["model_label"],
                company_name="Insight AI Industry Research Group",
                product_name=topic_config["product_info"].get("name", topic_config["title"]),
                sample_size=survey.sample_size,
                score_or_verdict=f"{viability}/100 · {verdict.split('.')[0][:30]}",
                score_number=viability,
                score_color="text-emerald-700 bg-emerald-50 border-emerald-300" if viability >= 70 else "text-amber-800 bg-amber-50 border-amber-300",
                summary=exec_sum.get("problem_statement") or exec_sum.get("methodology_note") or topic_config["title"],
                findings_json=json.dumps(findings_list, ensure_ascii=False),
                tags_json=json.dumps(topic_config.get("tags", []), ensure_ascii=False),
                full_report_json=survey.result_json,
            )
            db.add(bm)
        else:
            bm.score_or_verdict = f"{viability}/100 · {verdict.split('.')[0][:30]}"
            bm.score_number = viability
            bm.summary = exec_sum.get("problem_statement") or bm.summary
            bm.findings_json = json.dumps(findings_list, ensure_ascii=False)
            bm.full_report_json = survey.result_json

        db.commit()
        print(f"🎯 Đã đồng bộ vào bảng benchmark_reports trên Supabase: {survey_id}")

        # 5. Gửi thông báo Telegram
        msg = (
            f"🚀 *BÁO CÁO NGHIÊN CỨU NGÀNH ĐÃ CHẠY XONG THẬT SỰ!*\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"📋 *Chủ đề*: {topic_config['title']}\n"
            f"📐 *Mô hình*: {topic_config['model_label']}\n"
            f"👥 *Quy mô mẫu*: N={survey.sample_size:,} tác tử AI\n"
            f"🎯 *Chỉ số Viability*: *{viability}/100*\n"
            f"⏱️ *Thời gian chạy*: {elapsed:.1f}s\n\n"
            f"🔗 *Xem trực tiếp*: https://insight.1booking.asia/results/{survey_id}\n"
            f"📄 *Bản in A4 / PDF*: https://insight.1booking.asia/results/{survey_id}/print"
        )
        await send_telegram_message(msg)
        print(f"📲 Đã gửi thông báo Telegram đến Admin!")

        return True

    except Exception as e:
        print(f"❌ Lỗi thực thi khảo sát {survey_id}: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()


async def main():
    import argparse
    parser = argparse.ArgumentParser(description="Chạy khảo sát ngành thật sự")
    parser.add_argument("--topic", type=int, default=1, help="Số thứ tự chủ đề (1-6) hoặc 0 để chạy tất cả")
    args = parser.parse_args()

    init_db()

    if args.topic == 0:
        print(f"🌟 BẮT ĐẦU CHẠY TOÀN BỘ 6 BÁO CÁO NGÀNH THẬT SỰ...")
        success_count = 0
        for item in BENCHMARK_TOPICS:
            ok = await execute_benchmark_survey(item)
            if ok:
                success_count += 1
            await asyncio.sleep(2)
        print(f"\n🎉 HOÀN TẤT {success_count}/{len(BENCHMARK_TOPICS)} KHẢO SÁT NGÀNH!")
    else:
        topic_idx = args.topic - 1
        if 0 <= topic_idx < len(BENCHMARK_TOPICS):
            await execute_benchmark_survey(BENCHMARK_TOPICS[topic_idx])
        else:
            print(f"Chỉ số topic không hợp lệ. Vui lòng chọn từ 1 đến 6.")


if __name__ == "__main__":
    asyncio.run(main())
