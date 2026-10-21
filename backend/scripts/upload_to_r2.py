"""
T0: Script upload file Parquet từ HuggingFace lên Cloudflare R2
Chạy 1 lần duy nhất trước khi khởi động server.

Cách dùng:
    python scripts/upload_to_r2.py

Yêu cầu: Đã điền đầy đủ R2_* trong file .env
"""

import os
import sys
import time
from pathlib import Path

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download
from tqdm import tqdm

# Load .env từ thư mục backend
load_dotenv(Path(__file__).parent.parent / ".env")

# ─── Config ────────────────────────────────────────────────────────────────────
HF_REPO_ID   = "nvidia/Nemotron-Personas-Vietnam"
HF_FILENAME  = "data/train-00000-of-00001.parquet"
HF_REPO_TYPE = "dataset"

R2_ENDPOINT  = os.getenv("R2_ENDPOINT")
R2_KEY       = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET    = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET    = os.getenv("R2_BUCKET_NAME", "personas-vietnam")
R2_FILE_KEY  = os.getenv("R2_FILE_KEY", "personas_vn_1m.parquet")


def validate_env() -> None:
    """Kiểm tra đủ credentials trước khi bắt đầu."""
    missing = []
    for var in ["R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"]:
        if not os.getenv(var):
            missing.append(var)
    if missing:
        print(f"❌ Thiếu biến môi trường: {', '.join(missing)}")
        print("   → Hãy copy .env.example thành .env và điền credentials R2.")
        sys.exit(1)


def get_r2_client():
    """Tạo boto3 client kết nối Cloudflare R2."""
    return boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_KEY,
        aws_secret_access_key=R2_SECRET,
        region_name="auto",
    )


def file_exists_on_r2(s3_client) -> bool:
    """Kiểm tra file đã tồn tại trên R2 chưa để tránh upload lại."""
    try:
        s3_client.head_object(Bucket=R2_BUCKET, Key=R2_FILE_KEY)
        return True
    except ClientError as e:
        if e.response["Error"]["Code"] == "404":
            return False
        raise


class ProgressCallback:
    """Hiển thị tiến độ upload với tqdm."""

    def __init__(self, filename: str, file_size: int):
        self._bar = tqdm(
            total=file_size,
            unit="B",
            unit_scale=True,
            unit_divisor=1024,
            desc=f"Uploading {filename}",
            ncols=80,
        )

    def __call__(self, bytes_transferred: int):
        self._bar.update(bytes_transferred)

    def close(self):
        self._bar.close()


def download_from_huggingface() -> str:
    """Tải file Parquet từ HuggingFace Hub về cache cục bộ."""
    print("\n📥 Bước 1: Tải dữ liệu từ HuggingFace Hub...")
    print(f"   Repo: {HF_REPO_ID}")
    print(f"   File: {HF_FILENAME}")
    print("   Kích thước ước tính: ~2.5 GB — hãy kiên nhẫn...\n")

    try:
        local_path = hf_hub_download(
            repo_id=HF_REPO_ID,
            filename=HF_FILENAME,
            repo_type=HF_REPO_TYPE,
        )
        file_size_gb = os.path.getsize(local_path) / (1024**3)
        print(f"\n✅ Tải xong! File lưu tại: {local_path}")
        print(f"   Kích thước thực tế: {file_size_gb:.2f} GB")
        return local_path
    except Exception as e:
        print(f"\n❌ Lỗi khi tải từ HuggingFace: {e}")
        print("   → Kiểm tra kết nối internet hoặc token HuggingFace nếu repo private.")
        sys.exit(1)


def upload_to_r2(local_path: str, s3_client) -> None:
    """Upload file lên Cloudflare R2 với progress bar."""
    file_size = os.path.getsize(local_path)
    callback = ProgressCallback(R2_FILE_KEY, file_size)

    print(f"\n📤 Bước 2: Upload lên Cloudflare R2...")
    print(f"   Bucket: {R2_BUCKET}")
    print(f"   Key: {R2_FILE_KEY}")
    print(f"   Endpoint: {R2_ENDPOINT}\n")

    start = time.time()
    try:
        s3_client.upload_file(
            local_path,
            R2_BUCKET,
            R2_FILE_KEY,
            Callback=callback,
            ExtraArgs={"ContentType": "application/octet-stream"},
        )
        callback.close()
        elapsed = time.time() - start
        speed_mbps = (file_size / (1024**2)) / elapsed
        print(f"\n✅ Upload hoàn tất! Thời gian: {elapsed:.0f}s | Tốc độ: {speed_mbps:.1f} MB/s")
    except NoCredentialsError:
        callback.close()
        print("\n❌ Credentials R2 không hợp lệ. Kiểm tra lại .env")
        sys.exit(1)
    except ClientError as e:
        callback.close()
        print(f"\n❌ Lỗi R2: {e}")
        sys.exit(1)


def verify_upload(s3_client) -> None:
    """Kiểm tra file trên R2 sau upload."""
    print("\n🔍 Bước 3: Xác minh file trên R2...")
    try:
        response = s3_client.head_object(Bucket=R2_BUCKET, Key=R2_FILE_KEY)
        size_gb = response["ContentLength"] / (1024**3)
        print(f"   ✅ File confirmed: {R2_FILE_KEY}")
        print(f"   Kích thước: {size_gb:.2f} GB")
        print(f"   Last modified: {response['LastModified']}")
    except ClientError:
        print("   ❌ Không tìm thấy file trên R2 sau upload!")
        sys.exit(1)


def main():
    print("=" * 60)
    print("  AI MARKET RESEARCH — Data Upload Script")
    print("  HuggingFace → Cloudflare R2")
    print("=" * 60)

    # 1. Validate credentials
    validate_env()

    # 2. Kết nối R2
    s3_client = get_r2_client()

    # 3. Kiểm tra file đã có chưa
    if file_exists_on_r2(s3_client):
        print(f"\n⚠️  File '{R2_FILE_KEY}' đã tồn tại trên R2.")
        answer = input("   Upload lại? (y/N): ").strip().lower()
        if answer != "y":
            print("   Bỏ qua. File đã sẵn sàng để dùng.")
            return

    # 4. Download từ HuggingFace
    local_path = download_from_huggingface()

    # 5. Upload lên R2
    upload_to_r2(local_path, s3_client)

    # 6. Verify
    verify_upload(s3_client)

    print("\n" + "=" * 60)
    print("  🎉 HOÀN TẤT! Dữ liệu đã sẵn sàng trên Cloudflare R2.")
    print("  Bước tiếp theo: chạy scripts/verify_schema.py")
    print("=" * 60)


if __name__ == "__main__":
    main()
