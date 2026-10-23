import asyncio
import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import Survey, DiscountCode, get_db
from models.schemas import (
    SurveyCreateRequest, SurveyCreateResponse, SurveyStatusResponse,
    ApplyDiscountRequest, ApplyDiscountResponse,
)
from models.survey_configs import get_all_configs_summary
from services.payment_service import calculate_price, generate_survey_id, generate_vietqr
from services.worker import run_simulation

router = APIRouter(prefix="/survey", tags=["Survey"])


@router.get("/configs")
async def list_survey_configs():
    """
    Trả về danh sách 9 gói khảo sát chuyên sâu cho Step 1 của Wizard.
    Frontend dùng để render 9 thẻ + preview câu hỏi.
    """
    return {"configs": get_all_configs_summary()}


@router.post("/create", response_model=SurveyCreateResponse)
async def create_survey(
    request: SurveyCreateRequest,
    db: Session = Depends(get_db),
):
    """
    Bước 3 → Bước 4: Tạo survey record và sinh mã QR thanh toán.
    Hỗ trợ mã giảm giá tùy chọn (OFF100, OFF50, OFF30...).
    Status: PENDING_PAYMENT
    """
    # Validate age range
    if request.min_age >= request.max_age:
        raise HTTPException(400, "min_age phải nhỏ hơn max_age")

    survey_id      = generate_survey_id()
    original_price = calculate_price(request.sample_size)
    price_amount   = original_price
    discount_amount = 0
    applied_code   = None

    # Kiểm tra mã giảm giá nếu có gửi kèm từ request
    if request.discount_code:
        clean_code = request.discount_code.strip().upper()
        discount = db.query(DiscountCode).filter(
            func.upper(DiscountCode.code) == clean_code,
            DiscountCode.is_active == True,
        ).first()
        if discount:
            discount_amount = int(original_price * (discount.discount_percent / 100))
            price_amount = max(0, original_price - discount_amount)
            applied_code = discount.code

    # Lưu vào DB
    survey = Survey(
        id                    = survey_id,
        model_type            = request.model_type,
        status                = "PENDING_PAYMENT",
        region                = request.region,
        zone                  = request.zone,
        min_age               = request.min_age,
        max_age               = request.max_age,
        sample_size           = request.sample_size,
        target_gender         = request.target_gender or "all",
        target_income         = request.target_income or "all",
        target_marital_status = request.target_marital_status or "all",
        target_occupation     = request.target_occupation or "all",
        target_zone           = request.target_zone or "all",
        product_info_json     = json.dumps(request.product_info, ensure_ascii=False),
        price_amount          = price_amount,
        original_price        = original_price,
        discount_code         = applied_code,
        discount_amount       = discount_amount,
        customer_email        = request.customer_email,
        created_at            = datetime.utcnow(),
    )
    db.add(survey)
    db.commit()
    db.refresh(survey)

    is_free = (price_amount == 0)
    qr_data = None
    if not is_free:
        # Tạo VietQR nếu cần thanh toán
        qr_data = await generate_vietqr(
            survey_id=survey_id,
            amount=price_amount,
            description=survey_id,  # Nội dung CK = mã survey
        )

    return SurveyCreateResponse(
        survey_id       = survey_id,
        price_amount    = price_amount,
        original_price  = original_price,
        discount_code   = applied_code,
        discount_amount = discount_amount,
        qr_data         = qr_data,
        status          = "PENDING_PAYMENT",
        is_free         = is_free,
        created_at      = survey.created_at,
    )


@router.post("/{survey_id}/apply-discount", response_model=ApplyDiscountResponse)
async def apply_discount_code(
    survey_id: str,
    payload: ApplyDiscountRequest,
    db: Session = Depends(get_db),
):
    """
    Áp dụng mã giảm giá cho khảo sát tại Bước 4 (Thanh toán).
    Dữ liệu mã lấy từ CSDL (OFF100, OFF50, OFF30...), không hardcode.
    """
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(404, f"Khảo sát {survey_id} không tìm thấy")

    if survey.status != "PENDING_PAYMENT":
        raise HTTPException(400, "Không thể áp dụng mã ưu đãi cho khảo sát đã thanh toán hoặc đang xử lý")

    clean_code = payload.code.strip().upper()
    discount = db.query(DiscountCode).filter(
        func.upper(DiscountCode.code) == clean_code,
        DiscountCode.is_active == True,
    ).first()

    if not discount:
        raise HTTPException(400, "Mã ưu đãi không hợp lệ hoặc đã hết hạn")

    if discount.max_uses is not None and discount.used_count >= discount.max_uses:
        raise HTTPException(400, "Mã ưu đãi đã vượt quá số lượt sử dụng tối đa")

    # Xác định giá gốc (nếu trước đó đã lưu original_price thì dùng, ngược lại dùng price_amount)
    original_price = survey.original_price or survey.price_amount
    discount_amount = int(original_price * (discount.discount_percent / 100))
    final_amount = max(0, original_price - discount_amount)
    is_free = (final_amount == 0)

    # Cập nhật survey record
    survey.original_price  = original_price
    survey.discount_code   = discount.code
    survey.discount_amount = discount_amount
    survey.price_amount    = final_amount
    db.commit()

    # Sinh mã QR mới tương ứng với số tiền sau giảm
    qr_data = None
    if not is_free:
        qr_data = await generate_vietqr(
            survey_id=survey_id,
            amount=final_amount,
            description=survey_id,
        )

    msg = (
        f"Áp dụng thành công mã {discount.code}: Giảm 100% (-{discount_amount:,.0f}đ). Bạn có thể kích hoạt khảo sát ngay mà không cần chuyển khoản!"
        if is_free
        else f"Áp dụng thành công mã {discount.code}: Giảm {discount.discount_percent}% (-{discount_amount:,.0f}đ). Đã cập nhật mã VietQR mới."
    )

    return ApplyDiscountResponse(
        success=True,
        survey_id=survey_id,
        discount_code=discount.code,
        discount_percent=discount.discount_percent,
        original_price=original_price,
        discount_amount=discount_amount,
        final_amount=final_amount,
        qr_data=qr_data,
        is_free=is_free,
        message=msg,
    )


@router.post("/{survey_id}/remove-discount", response_model=ApplyDiscountResponse)
async def remove_discount_code(
    survey_id: str,
    db: Session = Depends(get_db),
):
    """Hủy áp dụng mã giảm giá và khôi phục giá gốc."""
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(404, f"Khảo sát {survey_id} không tìm thấy")

    if survey.status != "PENDING_PAYMENT":
        raise HTTPException(400, "Không thể hủy mã ưu đãi cho khảo sát đã thanh toán")

    original_price = survey.original_price or survey.price_amount
    survey.price_amount    = original_price
    survey.discount_code   = None
    survey.discount_amount = 0
    db.commit()

    qr_data = await generate_vietqr(
        survey_id=survey_id,
        amount=original_price,
        description=survey_id,
    )

    return ApplyDiscountResponse(
        success=True,
        survey_id=survey_id,
        discount_code="",
        discount_percent=0,
        original_price=original_price,
        discount_amount=0,
        final_amount=original_price,
        qr_data=qr_data,
        is_free=False,
        message="Đã hủy mã ưu đãi, khôi phục giá gốc thành công",
    )


@router.post("/{survey_id}/activate-free")
async def activate_free_survey(
    survey_id: str,
    db: Session = Depends(get_db),
):
    """
    Kích hoạt khảo sát miễn phí 100% (sau khi áp dụng mã như OFF100).
    Tự động chuyển status sang PROCESSING và kích hoạt worker phân tích ngầm.
    """
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(404, f"Khảo sát {survey_id} không tìm thấy")

    if survey.status != "PENDING_PAYMENT":
        return {"status": survey.status, "message": "Khảo sát đã được kích hoạt trước đó"}

    if survey.price_amount > 0:
        raise HTTPException(400, f"Khảo sát này yêu cầu thanh toán {survey.price_amount:,}đ")

    survey.status = "PROCESSING"
    survey.paid_at = datetime.utcnow()
    survey.sepay_transaction_id = f"FREE_{survey.discount_code or 'PROMO'}_{survey_id}"

    # Tăng lượt dùng của mã giảm giá
    if survey.discount_code:
        discount = db.query(DiscountCode).filter(DiscountCode.code == survey.discount_code).first()
        if discount:
            discount.used_count += 1

    db.commit()

    # Kích hoạt worker mô phỏng ngầm
    asyncio.create_task(run_simulation(survey_id))

    return {
        "status": "ok",
        "survey_id": survey_id,
        "message": "Khảo sát miễn phí 100% đã được kích hoạt thành công! Đang tiến hành mô phỏng...",
    }


@router.get("/{survey_id}/status", response_model=SurveyStatusResponse)
async def get_survey_status(
    survey_id: str,
    db: Session = Depends(get_db),
):
    """Polling endpoint — Frontend dùng để check trạng thái sau khi quét QR."""
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(404, f"Survey {survey_id} không tìm thấy")

    return SurveyStatusResponse(
        survey_id    = survey.id,
        status       = survey.status,
        model_type   = survey.model_type,
        sample_size  = survey.sample_size,
        created_at   = survey.created_at,
        completed_at = survey.completed_at,
        error_msg    = survey.error_msg,
    )


@router.get("/{survey_id}/results")
async def get_survey_results(
    survey_id: str,
    db: Session = Depends(get_db),
):
    """Trả về JSON report đầy đủ cho Dashboard sau khi simulation hoàn tất."""
    if survey_id.upper().startswith("DEMO"):
        from models.demo_data import get_demo_report_payload
        return get_demo_report_payload(survey_id)

    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(404, f"Survey {survey_id} không tìm thấy")

    if survey.status != "COMPLETED":
        raise HTTPException(
            425,  # Too Early
            f"Survey {survey_id} chưa hoàn tất. Status: {survey.status}"
        )

    if not survey.result_json:
        raise HTTPException(500, "Kết quả không có dữ liệu")

    res = json.loads(survey.result_json)
    if "product_info" not in res and survey.product_info_json:
        try:
            res["product_info"] = json.loads(survey.product_info_json)
        except Exception:
            pass
    return res


from pydantic import BaseModel
import random
import time
import os
from database import SurveyLog
from services.email_service import send_lookup_otp_email

# In-memory OTP store (email -> {"otp": str, "expires_at": float})
_OTP_STORE: dict[str, dict] = {}


class OtpRequest(BaseModel):
    email: str


class OtpVerify(BaseModel):
    email: str
    otp: str


class DeleteSurveyRequest(BaseModel):
    email: str


@router.post("/lookup/request-otp")
async def request_lookup_otp(payload: OtpRequest, db: Session = Depends(get_db)):
    """
    Gửi mã OTP 6 số qua email để khách hàng tra cứu toàn bộ báo cáo đã thực hiện.
    Không bắt buộc đăng ký tài khoản.
    """
    email = payload.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(400, "Vui lòng nhập địa chỉ email hợp lệ.")

    # Kiểm tra xem email có báo cáo nào không
    count = db.query(Survey).filter(Survey.customer_email == email).count()
    if count == 0:
        raise HTTPException(
            404,
            f"Chưa tìm thấy báo cáo nào được khởi tạo với địa chỉ email '{email}'. Vui lòng kiểm tra lại email bạn đã nhập khi tạo khảo sát."
        )

    # Sinh mã OTP 6 số
    otp = f"{random.randint(100000, 999999)}"
    _OTP_STORE[email] = {
        "otp": otp,
        "expires_at": time.time() + 600,  # 10 phút
    }

    # Gửi email qua Resend
    send_lookup_otp_email(to_email=email, otp_code=otp)

    return {
        "success": True,
        "message": f"Mã xác thực 6 số đã được gửi tới email '{email}'. Mã có hiệu lực trong 10 phút.",
        "email": email,
        "total_surveys": count,
    }


@router.post("/lookup/verify-otp")
async def verify_lookup_otp(payload: OtpVerify, db: Session = Depends(get_db)):
    """
    Xác thực mã OTP và trả về danh sách toàn bộ báo cáo của email.
    """
    email = payload.email.strip().lower()
    otp = payload.otp.strip()

    stored = _OTP_STORE.get(email)
    if not stored:
        raise HTTPException(400, "Yêu cầu OTP đã hết hạn hoặc chưa được khởi tạo. Vui lòng gửi lại mã mới.")

    if time.time() > stored["expires_at"]:
        _OTP_STORE.pop(email, None)
        raise HTTPException(400, "Mã xác thực OTP đã hết hạn (quá 10 phút). Vui lòng yêu cầu mã mới.")

    if stored["otp"] != otp:
        raise HTTPException(400, "Mã xác thực OTP không chính xác. Vui lòng kiểm tra lại trong email.")

    # OTP hợp lệ -> Xóa mã đã dùng và lấy danh sách surveys
    _OTP_STORE.pop(email, None)

    surveys = (
        db.query(Survey)
        .filter(Survey.customer_email == email)
        .order_by(Survey.created_at.desc())
        .all()
    )

    result_list = []
    for s in surveys:
        p_info = {}
        if s.product_info_json:
            try:
                p_info = json.loads(s.product_info_json)
            except Exception:
                pass

        product_name = (
            p_info.get("product_name")
            or p_info.get("concept_name")
            or p_info.get("brand_name")
            or p_info.get("deal_description")
            or "Dự án Nghiên Cứu Thị Trường"
        )

        viability_score = None
        verdict = None
        if s.result_json:
            try:
                r_json = json.loads(s.result_json)
                viability_score = r_json.get("executive_summary", {}).get("viability_score")
                verdict = r_json.get("executive_summary", {}).get("verdict")
            except Exception:
                pass

        result_list.append({
            "survey_id": s.id,
            "product_name": product_name,
            "model_type": s.model_type,
            "status": s.status,
            "sample_size": s.sample_size,
            "price_amount": s.price_amount,
            "viability_score": viability_score,
            "verdict": verdict,
            "created_at": s.created_at,
            "completed_at": s.completed_at,
            "results_url": f"/results/{s.id}" if s.status == "COMPLETED" else None,
            "print_url": f"/results/{s.id}/print" if s.status == "COMPLETED" else None,
        })

    return {
        "success": True,
        "email": email,
        "total": len(result_list),
        "surveys": result_list,
    }


@router.post("/{survey_id}/delete")
@router.delete("/{survey_id}")
async def delete_survey_permanently(
    survey_id: str,
    payload: DeleteSurveyRequest,
    db: Session = Depends(get_db),
):
    """
    Xóa vĩnh viễn báo cáo và toàn bộ dữ liệu liên quan (Data Destruction).
    Đảm bảo quyền riêng tư và bí mật kinh doanh cấp doanh nghiệp.
    Bắt buộc xác thực đúng email đã tạo khảo sát.
    """
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(404, f"Không tìm thấy khảo sát với mã #{survey_id}")

    if not survey.customer_email or survey.customer_email.strip().lower() != payload.email.strip().lower():
        raise HTTPException(
            403,
            "Email xác nhận không khớp với email tạo báo cáo này. Để bảo vệ dữ liệu khách hàng, vui lòng nhập chính xác email đã sử dụng."
        )

    # 1. Xóa logs
    db.query(SurveyLog).filter(SurveyLog.survey_id == survey_id).delete()

    # 2. Xóa bản ghi survey
    db.delete(survey)
    db.commit()

    # 3. Xóa PDF tĩnh nếu có
    pdf_path = f"static/pdfs/{survey_id}.pdf"
    if os.path.exists(pdf_path):
        try:
            os.remove(pdf_path)
        except Exception:
            pass

    sample_size = survey.sample_size or 1000
    return {
        "success": True,
        "message": f"Duy nhất báo cáo #{survey_id} và toàn bộ dữ liệu phản hồi của {sample_size:,} Personas đã được xóa vĩnh viễn khỏi toàn bộ hệ thống máy chủ Cloud theo tiêu chuẩn bảo mật dữ liệu doanh nghiệp. Toàn bộ các báo cáo khác của bạn trên hệ thống (nếu có) vẫn được giữ nguyên vẹn 100%.",
        "survey_id": survey_id,
    }


@router.get("/history")
async def get_survey_history(
    email: str,
    db: Session = Depends(get_db),
):
    """
    Lấy danh sách toàn bộ báo cáo khảo sát của doanh nghiệp theo email.
    """
    if not email:
        raise HTTPException(400, "Vui lòng cung cấp email doanh nghiệp")

    surveys = (
        db.query(Survey)
        .filter(Survey.customer_email == email.strip().lower())
        .order_by(Survey.created_at.desc())
        .all()
    )
    return {
        "email": email,
        "total": len(surveys),
        "surveys": [
            {
                "survey_id": s.id,
                "model_type": s.model_type,
                "status": s.status,
                "sample_size": s.sample_size,
                "region": s.region or s.zone or "Toàn quốc",
                "price_amount": s.price_amount,
                "created_at": s.created_at,
                "completed_at": s.completed_at,
                "results_url": f"/results/{s.id}" if s.status == "COMPLETED" else None,
                "pdf_url": f"/survey/{s.id}/pdf" if s.status == "COMPLETED" else None,
            }
            for s in surveys
        ],
    }


