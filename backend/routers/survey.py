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


@router.get("/history")
async def get_survey_history(
    email: str,
    db: Session = Depends(get_db),
):
    """
    Lấy danh sách toàn bộ báo cáo khảo sát của doanh nghiệp theo email.
    Giúp doanh nghiệp xem lại hồ sơ mọi lần chạy.
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

