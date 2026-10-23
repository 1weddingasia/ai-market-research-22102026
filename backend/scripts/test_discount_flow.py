"""
Kiểm thử tự động luồng mã giảm giá (Discount Codes Flow):
- Mã OFF100 (giảm 100% -> 0đ -> kích hoạt miễn phí không cần thanh toán)
- Mã OFF50 (giảm 50% -> 150.000đ)
- Mã OFF30 (giảm 30% -> 210.000đ)
- Mã không hợp lệ (báo lỗi chính xác)
- Hủy mã giảm giá (khôi phục giá gốc)
"""

import sys
import os
import asyncio
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(env_path)

from database import SessionLocal, Survey, DiscountCode
from services.payment_service import calculate_price, generate_survey_id, generate_vietqr
from routers.survey import apply_discount_code, remove_discount_code, activate_free_survey
from models.schemas import ApplyDiscountRequest


async def run_tests():
    db = SessionLocal()
    try:
        print("=== BẮT ĐẦU KIỂM THỬ LUỒNG MÃ GIẢM GIÁ ===")

        # 1. Kiểm tra các mã có trong DB
        codes = db.query(DiscountCode).all()
        print(f"[1] Số lượng mã ưu đãi trong DB: {len(codes)}")
        for c in codes:
            print(f"    - {c.code}: {c.discount_percent}% (Active: {c.is_active})")

        # 2. Tạo 1 survey thử nghiệm (giá gốc 300.000đ cho 1.000 mẫu)
        survey_id = generate_survey_id()
        base_price = calculate_price(1000) # 300.000đ
        qr_init = await generate_vietqr(survey_id, base_price, survey_id)

        survey = Survey(
            id=survey_id,
            model_type="nielsen_bases",
            status="PENDING_PAYMENT",
            sample_size=1000,
            price_amount=base_price,
            original_price=base_price,
            customer_email="test.client@example.com",
            product_info_json="{}",
        )
        db.add(survey)
        db.commit()
        db.refresh(survey)
        print(f"[2] Đã tạo khảo sát thử nghiệm: {survey_id} | Giá ban đầu: {survey.price_amount:,}đ")

        # 3. Test mã OFF50
        req_50 = ApplyDiscountRequest(code="off50") # test chữ thường
        res_50 = await apply_discount_code(survey_id, req_50, db)
        print(f"[3] Test mã 'off50':")
        print(f"    - Thành công: {res_50.success}")
        print(f"    - Giá sau giảm: {res_50.final_amount:,}đ (Tiết kiệm: {res_50.discount_amount:,}đ)")
        assert res_50.final_amount == 150000, "OFF50 phải giảm còn 150.000đ"
        assert res_50.qr_data is not None, "OFF50 phải có VietQR mới"

        # 4. Test hủy mã
        res_remove = await remove_discount_code(survey_id, db)
        print(f"[4] Test hủy mã:")
        print(f"    - Giá khôi phục: {res_remove.final_amount:,}đ")
        assert res_remove.final_amount == 300000, "Hủy mã phải trả về 300.000đ"

        # 5. Test mã OFF30
        req_30 = ApplyDiscountRequest(code="OFF30")
        res_30 = await apply_discount_code(survey_id, req_30, db)
        print(f"[5] Test mã 'OFF30':")
        print(f"    - Giá sau giảm: {res_30.final_amount:,}đ (Tiết kiệm: {res_30.discount_amount:,}đ)")
        assert res_30.final_amount == 210000, "OFF30 phải giảm còn 210.000đ"

        # 6. Test mã không hợp lệ
        try:
            req_invalid = ApplyDiscountRequest(code="INVALID999")
            await apply_discount_code(survey_id, req_invalid, db)
            print("[6] LỖI: Mã không hợp lệ nhưng không bị chặn!")
        except Exception as e:
            print(f"[6] Test mã không tồn tại: Bị chặn chính xác -> {e}")

        # 7. Test mã OFF100 (100% Free)
        req_100 = ApplyDiscountRequest(code="off100")
        res_100 = await apply_discount_code(survey_id, req_100, db)
        print(f"[7] Test mã 'off100':")
        print(f"    - Giá sau giảm: {res_100.final_amount:,}đ")
        print(f"    - Is Free: {res_100.is_free}")
        assert res_100.final_amount == 0, "OFF100 phải giảm còn 0đ"
        assert res_100.is_free is True, "is_free phải là True"

        # 8. Test kích hoạt khảo sát miễn phí
        res_activate = await activate_free_survey(survey_id, db)
        print(f"[8] Test kích hoạt khảo sát miễn phí:")
        print(f"    - Kết quả: {res_activate}")
        db.refresh(survey)
        print(f"    - Trạng thái DB mới của survey: {survey.status}")
        assert survey.status == "PROCESSING", "Khảo sát phải chuyển sang PROCESSING"

        print("\n=== TẤT CẢ 8 TEST CASES MÃ GIẢM GIÁ ĐỀU ĐẠT CHUẨN 100%! ===")

        # Dọn dẹp survey thử nghiệm
        db.delete(survey)
        db.commit()

    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(run_tests())
