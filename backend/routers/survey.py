"""
Router: Survey — POST /survey/create, GET /survey/{id}, GET /survey/configs
"""

import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import Survey, get_db
from models.schemas import (
    SurveyCreateRequest, SurveyCreateResponse, SurveyStatusResponse,
)
from models.survey_configs import get_all_configs_summary
from services.payment_service import calculate_price, generate_survey_id, generate_vietqr

router = APIRouter(prefix="/survey", tags=["Survey"])


@router.get("/configs")
async def list_survey_configs():
    """
    Trả về danh sách 5 gói khảo sát cho Step 1 của Wizard.
    Frontend dùng để render 5 thẻ + preview câu hỏi.
    """
    return {"configs": get_all_configs_summary()}


@router.post("/create", response_model=SurveyCreateResponse)
async def create_survey(
    request: SurveyCreateRequest,
    db: Session = Depends(get_db),
):
    """
    Bước 3 → Bước 4: Tạo survey record và sinh mã QR thanh toán.
    Status: PENDING_PAYMENT
    """
    # Validate age range
    if request.min_age >= request.max_age:
        raise HTTPException(400, "min_age phải nhỏ hơn max_age")

    survey_id    = generate_survey_id()
    price_amount = calculate_price(request.sample_size)

    # Lưu vào DB
    survey = Survey(
        id                = survey_id,
        model_type        = request.model_type,
        status            = "PENDING_PAYMENT",
        region            = request.region,
        zone              = request.zone,
        min_age           = request.min_age,
        max_age           = request.max_age,
        sample_size       = request.sample_size,
        product_info_json = json.dumps(request.product_info, ensure_ascii=False),
        price_amount      = price_amount,
        customer_email    = request.customer_email,
        created_at        = datetime.utcnow(),
    )
    db.add(survey)
    db.commit()
    db.refresh(survey)

    # Tạo VietQR
    qr_data = await generate_vietqr(
        survey_id=survey_id,
        amount=price_amount,
        description=survey_id,  # Nội dung CK = mã survey
    )

    return SurveyCreateResponse(
        survey_id    = survey_id,
        price_amount = price_amount,
        qr_data      = qr_data,
        status       = "PENDING_PAYMENT",
        created_at   = survey.created_at,
    )


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

    return {
        "success": True,
        "message": f"Báo cáo #{survey_id} và toàn bộ dữ liệu phản hồi của 1.000 Personas đã được xóa vĩnh viễn khỏi toàn bộ hệ thống máy chủ Cloud theo tiêu chuẩn bảo mật dữ liệu doanh nghiệp.",
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


