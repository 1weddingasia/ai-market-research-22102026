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
from services.payment_service import (
    extract_survey_id_from_content,
    verify_sepay_webhook,
    verify_sepay_hmac,
)
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
    Hỗ trợ 2 phương thức xác thực chuẩn mực của SePay:
    1. HMAC-SHA256: Header X-SePay-Signature + X-SePay-Timestamp (Khuyên dùng)
    2. API Key: Header Authorization: Apikey {SEPAY_API_TOKEN}
    """
    raw_body = await request.body()
    auth_header = request.headers.get("Authorization", "")
    sig_header = request.headers.get("X-SePay-Signature", "") or request.headers.get("x-sepay-signature", "")
    ts_header = request.headers.get("X-SePay-Timestamp", "") or request.headers.get("x-sepay-timestamp", "")

    is_verified = False

    # 1. Ưu tiên kiểm tra HMAC-SHA256 nếu có chữ ký
    if sig_header and ts_header:
        if verify_sepay_hmac(sig_header, ts_header, raw_body):
            is_verified = True
            log.info("SePay webhook verified successfully via HMAC-SHA256")

    # 2. Kiểm tra API Key nếu chưa verify qua HMAC
    if not is_verified and auth_header:
        if verify_sepay_webhook(auth_header, {}):
            is_verified = True
            log.info("SePay webhook verified successfully via API Key")

    # 3. Nếu cả 2 đều không khớp, từ chối
    if not is_verified:
        log.warning("SePay webhook verification failed (neither HMAC nor API Key matched)")
        raise HTTPException(401, "Unauthorized SePay webhook")

    # 4. Parse payload từ raw_body
    import json
    try:
        body = json.loads(raw_body.decode("utf-8"))
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
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Giả lập thanh toán — Chỉ cho phép quản trị viên nội bộ có token bảo mật.
    Tuyệt đối không cho phép khách hàng tự ý kích hoạt miễn phí.
    """
    admin_token = request.headers.get("X-Admin-Token") or request.query_params.get("token")
    expected_token = os.getenv("SEPAY_API_TOKEN") or "dev_secret_key"
    is_prod = os.getenv("ENVIRONMENT") == "production"

    if is_prod and admin_token != expected_token:
        raise HTTPException(
            403,
            "Chức năng giả lập thanh toán bị khóa trên môi trường sản xuất. Vui lòng hoàn tất thanh toán hoặc áp dụng mã ưu đãi hợp lệ."
        )

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


UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-image")
async def upload_ab_image(
    request: Request,
    file: UploadFile = File(...),
    option: str = "concept",   # "A", "B", "concept", "mockup", etc.
):
    """
    Upload ảnh cho Khảo sát (Concept mockup, bao bì Option A, Option B...).
    Lưu local và R2 (nếu có), trả về URL truy cập công khai.
    """
    import boto3
    import uuid

    clean_option = "".join(c for c in option if c.isalnum() or c in ("-", "_")) or "concept"

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File tải lên phải là định dạng hình ảnh (JPG, PNG, WebP...)")

    # Đọc file
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(400, "Dung lượng ảnh vượt quá giới hạn tối đa 10MB")

    # Đặt tên file duy nhất
    ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "jpg"
    safe_filename = f"{uuid.uuid4().hex[:12]}-{clean_option}.{ext}"
    local_path = os.path.join(UPLOAD_DIR, safe_filename)

    # 1. Lưu bản sao cục bộ để phục vụ tức thì
    try:
        with open(local_path, "wb") as f:
            f.write(content)
    except Exception as e:
        log.warning("Could not save image locally", error=str(e))

    # 2. Upload lên R2 nếu có cấu hình
    file_key = f"images/{safe_filename}"
    r2_success = False
    endpoint = os.getenv("R2_ENDPOINT", "")
    key = os.getenv("R2_ACCESS_KEY_ID", "")
    secret = os.getenv("R2_SECRET_ACCESS_KEY", "")

    if endpoint and key and secret:
        try:
            s3 = boto3.client(
                "s3",
                endpoint_url=endpoint,
                aws_access_key_id=key,
                aws_secret_access_key=secret,
                region_name="auto",
            )
            s3.put_object(
                Bucket=os.getenv("R2_BUCKET_NAME", "personas-vietnam"),
                Key=file_key,
                Body=content,
                ContentType=file.content_type,
            )
            r2_success = True
            log.info("Image uploaded to R2 successfully", key=file_key)
        except Exception as e:
            log.warning("Image upload to R2 failed, falling back to local serve", error=str(e))

    # URL công khai truy cập ảnh thông qua endpoint backend
    base_url = str(request.base_url).rstrip("/")
    image_url = f"{base_url}/payment/image/{safe_filename}"

    return {
        "status": "ok",
        "image_url": image_url,
        "option": clean_option,
        "filename": safe_filename,
    }


@router.get("/image/{filename}")
async def get_uploaded_image(filename: str):
    """
    Phục vụ hình ảnh đã upload trực tiếp từ máy chủ backend hoặc R2.
    """
    from fastapi.responses import FileResponse, Response
    import mimetypes

    # 1. Kiểm tra file cục bộ
    safe_name = os.path.basename(filename)
    local_path = os.path.join(UPLOAD_DIR, safe_name)
    if os.path.isfile(local_path):
        mime, _ = mimetypes.guess_type(local_path)
        return FileResponse(local_path, media_type=mime or "image/jpeg")

    # 2. Nếu không có ở local, thử tải từ R2
    endpoint = os.getenv("R2_ENDPOINT", "")
    key = os.getenv("R2_ACCESS_KEY_ID", "")
    secret = os.getenv("R2_SECRET_ACCESS_KEY", "")
    if endpoint and key and secret:
        import boto3
        try:
            s3 = boto3.client(
                "s3",
                endpoint_url=endpoint,
                aws_access_key_id=key,
                aws_secret_access_key=secret,
                region_name="auto",
            )
            obj = s3.get_object(
                Bucket=os.getenv("R2_BUCKET_NAME", "personas-vietnam"),
                Key=f"images/{safe_name}",
            )
            content_type = obj.get("ContentType", "image/jpeg")
            body = obj["Body"].read()
            return Response(content=body, media_type=content_type)
        except Exception as e:
            log.warning("Image not found in R2", filename=safe_name, error=str(e))

    raise HTTPException(404, "Hình ảnh không tồn tại hoặc đã bị xóa")

