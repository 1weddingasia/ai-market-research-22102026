"""
T4.3: Payment Service — SePay webhook verify + VietQR generation.
"""

import hashlib
import hmac
import os
import random
import string
from datetime import datetime

import httpx
import structlog

from services.region_mapping import get_price

log = structlog.get_logger(__name__)

SEPAY_API_TOKEN    = os.getenv("SEPAY_API_TOKEN", "")
BANK_ACCOUNT_NUMBER = os.getenv("BANK_ACCOUNT_NUMBER", "")
BANK_SHORT_NAME     = os.getenv("BANK_SHORT_NAME", "VCB")
ACCOUNT_NAME        = os.getenv("ACCOUNT_NAME", "CONG TY")
VIETQR_API         = "https://api.vietqr.io/v2/generate"


def generate_survey_id() -> str:
    """Tạo mã đơn hàng dạng PANEL + 6 số ngẫu nhiên. VD: PANEL892314"""
    digits = "".join(random.choices(string.digits, k=6))
    return f"PANEL{digits}"


def calculate_price(sample_size: int) -> int:
    """Trả về giá VND theo số mẫu."""
    return get_price(sample_size)


async def generate_vietqr(
    survey_id: str,
    amount: int,
    description: str = None,
) -> dict:
    """
    Gọi VietQR API để tạo mã QR thanh toán.

    Returns:
        {
            "qrCode": "data:image/png;base64,...",
            "qrDataURL": "...",
            "bankName": "...",
            "accountNumber": "...",
            "accountName": "...",
            "amount": 300000,
            "addInfo": "PANEL892314"
        }
    """
    add_info = description or survey_id  # Nội dung chuyển khoản = mã survey

    payload = {
        "accountNo": BANK_ACCOUNT_NUMBER,
        "accountName": ACCOUNT_NAME,
        "acqId": _get_bank_bin(BANK_SHORT_NAME),
        "amount": amount,
        "addInfo": add_info,
        "format": "text",
        "template": "compact2",
    }

    headers = {
        "x-client-id": os.getenv("VIETQR_CLIENT_ID", ""),
        "x-api-key":   os.getenv("VIETQR_API_KEY", ""),
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(VIETQR_API, json=payload, headers=headers)
            data = resp.json()

            if data.get("code") == "00":
                qr_data = data.get("data", {})
                return {
                    "qrCode": qr_data.get("qrCode", ""),
                    "qrDataURL": qr_data.get("qrDataURL", ""),
                    "bankName": BANK_SHORT_NAME,
                    "accountNumber": BANK_ACCOUNT_NUMBER,
                    "accountName": ACCOUNT_NAME,
                    "amount": amount,
                    "addInfo": add_info,
                }
            else:
                log.error("VietQR API error", response=data)
                # Fallback: trả về data đủ để frontend tự tạo QR text
                return _fallback_qr_data(survey_id, amount, add_info)

    except Exception as e:
        log.error("VietQR API exception", error=str(e))
        return _fallback_qr_data(survey_id, amount, add_info)


def _fallback_qr_data(survey_id: str, amount: int, add_info: str) -> dict:
    """Fallback khi VietQR API fail — vẫn trả đủ thông tin để hiển thị manual."""
    return {
        "qrCode": "",
        "qrDataURL": "",
        "bankName": BANK_SHORT_NAME,
        "accountNumber": BANK_ACCOUNT_NUMBER,
        "accountName": ACCOUNT_NAME,
        "amount": amount,
        "addInfo": add_info,
        "fallback": True,
    }


def verify_sepay_hmac(
    signature: str,
    timestamp: str,
    raw_body: bytes,
) -> bool:
    """
    Xác minh chữ ký HMAC-SHA256 từ SePay theo tài liệu chính thức.
    Headers:
        X-SePay-Signature: sha256={computed_hash}
        X-SePay-Timestamp: {unix_timestamp}
    Message: {timestamp}.{raw_body}
    """
    secret = os.getenv("SEPAY_WEBHOOK_SECRET", "").strip()
    if not secret:
        log.warning("SEPAY_WEBHOOK_SECRET is not configured in environment variables")
        return False

    if not signature or not timestamp:
        return False

    try:
        # Tái tạo message: {timestamp}.{raw_body}
        message = f"{timestamp}.".encode("utf-8") + raw_body
        computed_hash = hmac.new(
            secret.encode("utf-8"),
            msg=message,
            digestmod=hashlib.sha256
        ).hexdigest()

        expected_sig1 = f"sha256={computed_hash}"
        expected_sig2 = computed_hash

        if hmac.compare_digest(expected_sig1, signature) or hmac.compare_digest(expected_sig2, signature):
            return True

        log.warning("SePay HMAC signature mismatch")
        return False
    except Exception as e:
        log.error("SePay HMAC verification exception", error=str(e))
        return False


def verify_sepay_webhook(
    token: str,
    payload: dict,
) -> bool:
    """
    Xác thực webhook từ SePay bằng API Key.
    SePay có thể gửi header Authorization dưới dạng:
    - 'Apikey {SEPAY_API_TOKEN}'
    - 'Bearer {SEPAY_API_TOKEN}'
    - hoặc token thuần
    """
    expected_token = os.getenv("SEPAY_API_TOKEN", "").strip()
    if not expected_token:
        log.warning("SEPAY_API_TOKEN is not configured in environment variables")
        return False

    clean_token = token.strip()
    expected_apikey = f"Apikey {expected_token}"
    expected_bearer = f"Bearer {expected_token}"

    # Kiểm tra khớp chính xác
    if clean_token in (expected_apikey, expected_bearer, expected_token):
        return True

    # Kiểm tra không phân biệt hoa thường
    if clean_token.lower() in (expected_apikey.lower(), expected_bearer.lower(), expected_token.lower()):
        return True

    # Trích xuất phần đuôi token sau 'Apikey ' hoặc 'Bearer '
    parts = clean_token.split(maxsplit=1)
    if len(parts) == 2 and parts[1].strip() == expected_token:
        return True

    log.warning("SePay webhook token mismatch", received=clean_token[:20] if clean_token else "empty")
    return False


def extract_survey_id_from_content(content: str) -> str | None:
    """
    Trích xuất survey_id từ nội dung chuyển khoản.
    Hỗ trợ:
    - PANEL892314 (chuẩn)
    - PANEL 892314 (ngân hàng chèn khoảng trắng)
    - PANEL_xxx (mã test)
    """
    import re
    if not content:
        return None
    # 1. Tìm PANEL + 6 số (hỗ trợ có hoặc không có khoảng trắng)
    match_digits = re.search(r"PANEL\s*(\d{6})", content.upper())
    if match_digits:
        return f"PANEL{match_digits.group(1)}"

    # 2. Tìm dạng tổng quát PANEL + alphanumeric / underscore
    match_general = re.search(r"PANEL[A-Z0-9_]{3,12}", content.upper())
    if match_general:
        return match_general.group(0)

    return None


def _get_bank_bin(short_name: str) -> str:
    """Mapping tên ngắn ngân hàng → BIN code cho VietQR API."""
    bank_bins = {
        "VCB": "970436",    # Vietcombank
        "TCB": "970407",    # Techcombank
        "MBB": "970422",    # MB Bank
        "MB": "970422",     # MB Bank alias
        "ACB": "970416",    # ACB
        "VPB": "970432",    # VPBank
        "BIDV": "970418",   # BIDV
        "VTB": "970415",    # Vietinbank
        "STB": "970403",    # Sacombank
        "TPB": "970423",    # TPBank
        "TPBANK": "970423", # TPBank alias
        "MSB": "970426",    # MSB
        "OCB": "970448",    # OCB
        "SHB": "970443",    # SHB
        "HDB": "970437",    # HDBank
        "VIB": "970441",    # VIB
        "MOMO": "422589",   # MoMo (nếu dùng)
    }
    return bank_bins.get(short_name.upper(), "970423" if "TPB" in short_name.upper() else "970436")
