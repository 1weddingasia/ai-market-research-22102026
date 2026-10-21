"""
Router: Payment — POST /payment/webhook (SePay), POST /payment/upload-image
"""

import asyncio
import os

import structlog
from fastapi import APIRouter, Depends, Header, HTTPException, Request, UploadFile, File
from sqlalchemy.orm import Session

from database import Survey, get_db
from models.schemas import SepayWebhookPayload
from services.payment_service import extract_survey_id_from_content, verify_sepay_webhook
from services.worker import run_simulation

log = structlog.get_logger(__name__)

router = APIRouter(prefix="/payment", tags=["Payment"])


@router.post("/webhook")
async def sepay_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Endpoint nhận webhook từ SePay khi có giao dịch chuyển khoản.
    SePay gọi vào đây ngay sau khi xác nhận tiền về tài khoản.

    Headers:
        Authorization: Apikey {SEPAY_API_TOKEN}
    """
    # 1. Verify token
    auth_header = request.headers.get("Authorization", "")
    if not verify_sepay_webhook(auth_header, {}):
        log.warning("Invalid SePay webhook token")
        raise HTTPException(401, "Unauthorized")

    # 2. Parse payload
    try:
        body = await request.json()
        payload = SepayWebhookPayload(**body)
    except Exception as e:
        log.error("Webhook payload parse error", error=str(e))
        raise HTTPException(400, f"Invalid payload: {e}")

    log.info(
        "SePay webhook received",
        amount=payload.transferAmount,
        content=payload.content,
        transfer_type=payload.transferType,
    )

    # 3. Chỉ xử lý giao dịch tiền VÀO (in)
    if payload.transferType != "in":
        return {"status": "ignored", "reason": "not_incoming"}

    # 4. Trích xuất survey_id từ nội dung chuyển khoản
    survey_id = extract_survey_id_from_content(payload.content or "")
    if not survey_id:
        # Thử từ field description
        survey_id = extract_survey_id_from_content(payload.description or "")

    if not survey_id:
        log.warning("Cannot extract survey_id from content", content=payload.content)
        return {"status": "ignored", "reason": "no_survey_id"}

    # 5. Tìm survey trong DB
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        log.warning("Survey not found", survey_id=survey_id)
        return {"status": "ignored", "reason": "survey_not_found"}

    # 6. Idempotency: nếu đã xử lý webhook này rồi thì bỏ qua
    if survey.status not in ("PENDING_PAYMENT",):
        log.info("Survey already processed", survey_id=survey_id, status=survey.status)
        return {"status": "already_processed"}

    # 7. Verify số tiền
    expected_amount = survey.price_amount
    received_amount = int(payload.transferAmount)
    if received_amount < expected_amount:
        log.warning(
            "Insufficient payment",
            survey_id=survey_id,
            expected=expected_amount,
            received=received_amount,
        )
        # Vẫn xử lý nếu thiếu < 1000đ (tolerance cho phí chuyển khoản)
        if (expected_amount - received_amount) > 1000:
            return {"status": "insufficient_payment"}

    # 8. Mark survey as PROCESSING
    from datetime import datetime
    survey.status               = "PROCESSING"
    survey.sepay_transaction_id = str(payload.id)
    survey.paid_at              = datetime.utcnow()
    db.commit()

    log.info("Payment confirmed, starting simulation", survey_id=survey_id)

    # 9. Trigger background worker (không block response)
    asyncio.create_task(run_simulation(survey_id))

    return {"status": "ok", "survey_id": survey_id, "message": "Simulation started"}


@router.post("/simulate/{survey_id}")
async def simulate_payment(
    survey_id: str,
    db: Session = Depends(get_db),
):
    """
    Giả lập thanh toán thành công cho khảo sát (dành cho kiểm thử / demo).
    """
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(404, "Survey not found")

    from datetime import datetime
    survey.status = "PROCESSING"
    survey.sepay_transaction_id = "SIMULATED_TEST"
    survey.paid_at = datetime.utcnow()
    db.commit()

    log.info("Simulated payment confirmed, starting simulation", survey_id=survey_id)
    asyncio.create_task(run_simulation(survey_id))

    return {"status": "ok", "survey_id": survey_id, "message": "Simulation started"}


@router.post("/upload-image")
async def upload_ab_image(
    file: UploadFile = File(...),
    option: str = "A",   # "A" hoặc "B"
):
    """
    Upload ảnh cho Model 3 (A/B Testing).
    Lưu lên R2 subfolder images/ và trả về URL.
    """
    import boto3
    import uuid

    if option not in ("A", "B"):
        raise HTTPException(400, "option phải là 'A' hoặc 'B'")

    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File phải là ảnh (image/*)")

    # Đọc file
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(400, "File quá lớn (max 10MB)")

    # Upload lên R2
    file_key = f"images/{uuid.uuid4()}-option{option}.{file.filename.split('.')[-1]}"
    try:
        s3 = boto3.client(
            "s3",
            endpoint_url=os.getenv("R2_ENDPOINT"),
            aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
            region_name="auto",
        )
        s3.put_object(
            Bucket=os.getenv("R2_BUCKET_NAME", "personas-vietnam"),
            Key=file_key,
            Body=content,
            ContentType=file.content_type,
        )

        endpoint = os.getenv("R2_ENDPOINT", "").rstrip("/")
        bucket   = os.getenv("R2_BUCKET_NAME", "personas-vietnam")
        image_url = f"{endpoint}/{bucket}/{file_key}"

        return {"image_url": image_url, "option": option}

    except Exception as e:
        log.error("Image upload failed", error=str(e))
        raise HTTPException(500, f"Upload thất bại: {e}")
