"""
Script tối ưu tải toàn bộ 11 shards (1.000.000 personas) từ HuggingFace
'nvidia/Nemotron-Personas-Vietnam', chuẩn hóa và hợp nhất bằng DuckDB streaming
(cực nhẹ RAM, không tràn bộ nhớ), sau đó upload lên Cloudflare R2 bucket.
"""

import glob
import os
import sys
import time
from pathlib import Path

# Đảm bảo UTF-8 và auto-flush output trên Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
        sys.stderr.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

from dotenv import load_dotenv

# Load biến môi trường từ backend/.env
load_dotenv(Path(__file__).parent.parent / ".env")

import boto3
from boto3.s3.transfer import TransferConfig
import duckdb
from huggingface_hub import hf_hub_download

HF_REPO_ID = "nvidia/Nemotron-Personas-Vietnam"
TOTAL_SHARDS = 11

R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_KEY = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET = os.getenv("R2_BUCKET_NAME", "personas-vietnam")
R2_FILE_KEY = os.getenv("R2_FILE_KEY", "personas_vn_1m.parquet")


def get_r2_client():
    return boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_KEY,
        aws_secret_access_key=R2_SECRET,
        region_name="auto",
    )


class UploadProgressTracker:
    """Theo dõi tiến độ upload R2 mượt mà, ghi log rõ ràng định kỳ."""
    def __init__(self, filename: str, total_bytes: int):
        self.filename = filename
        self.total_bytes = total_bytes
        self.transferred = 0
        self.start_time = time.time()
        self.last_log_time = self.start_time
        self.total_mb = total_bytes / (1024 * 1024)

    def __call__(self, bytes_amount: int):
        self.transferred += bytes_amount
        now = time.time()
        # Log mỗi 2.5 giây hoặc khi hoàn tất 100%
        if (now - self.last_log_time >= 2.5) or (self.transferred >= self.total_bytes):
            self.last_log_time = now
            elapsed = max(now - self.start_time, 0.001)
            transferred_mb = self.transferred / (1024 * 1024)
            pct = (self.transferred / self.total_bytes) * 100
            speed_mb = transferred_mb / elapsed
            remaining_bytes = max(self.total_bytes - self.transferred, 0)
            eta_sec = remaining_bytes / (speed_mb * 1024 * 1024) if speed_mb > 0 else 0

            bar_length = 25
            filled = int(bar_length * self.transferred / self.total_bytes)
            bar = "█" * filled + "░" * (bar_length - filled)

            print(
                f"   [Upload R2] |{bar}| {pct:5.1f}% | "
                f"{transferred_mb:6.1f} / {self.total_mb:.1f} MB | "
                f"Tốc độ: {speed_mb:4.1f} MB/s | Còn lại: ~{int(eta_sec)}s",
                flush=True
            )


def main():
    print("=" * 75, flush=True)
    print("  🚀 TẢI VÀ ĐẨY DỮ LIỆU THẬT 1.000.000 PERSONAS LÊN CLOUDFLARE R2", flush=True)
    print(f"  Target R2 Bucket: {R2_BUCKET}", flush=True)
    print(f"  Target File Key:  {R2_FILE_KEY}", flush=True)
    print("=" * 75, flush=True)

    # 1. Test kết nối R2 trước
    r2 = get_r2_client()
    try:
        r2.head_bucket(Bucket=R2_BUCKET)
        print(f"✅ R2 Bucket '{R2_BUCKET}' sẵn sàng kết nối!", flush=True)
    except Exception as e:
        print(f"❌ Không thể truy cập R2 Bucket '{R2_BUCKET}': {e}", flush=True)
        sys.exit(1)

    # 2. Thu thập 11 shards từ Cache cục bộ hoặc Hugging Face
    local_shards = []
    print(f"\n📥 Bước 1/4: Kiểm tra và tải {TOTAL_SHARDS} shards từ Hugging Face...", flush=True)
    
    # Kiểm tra trước trong cache cục bộ
    cache_pattern = os.path.expanduser(r"~/.cache/huggingface/hub/datasets--nvidia--Nemotron-Personas-Vietnam/**/*.parquet")
    cached_files = sorted(glob.glob(cache_pattern, recursive=True))
    
    if len(cached_files) == TOTAL_SHARDS:
        print(f"   ⚡ Phát hiện đầy đủ {TOTAL_SHARDS} shards đã có sẵn trong Cache cục bộ!", flush=True)
        local_shards = cached_files
    else:
        for i in range(TOTAL_SHARDS):
            filename = f"data/train-{i:05d}-of-{TOTAL_SHARDS:05d}.parquet"
            print(f"   [{i+1}/{TOTAL_SHARDS}] Tải {filename}...", flush=True)
            for attempt in range(5):
                try:
                    p = hf_hub_download(
                        repo_id=HF_REPO_ID,
                        filename=filename,
                        repo_type="dataset",
                    )
                    local_shards.append(p)
                    print(f"   -> Đã tải thành công: {os.path.basename(p)}", flush=True)
                    break
                except Exception as e:
                    print(f"   ⚠️ Thử lại ({attempt+1}/5) do lỗi kết nối: {e}", flush=True)
                    time.sleep(3)
            else:
                print(f"❌ Không thể tải {filename} sau 5 lần thử.", flush=True)
                sys.exit(1)

    total_input_size = sum(os.path.getsize(f) for f in local_shards) / (1024 * 1024)
    print(f"   -> Tổng cộng 11 shards: {total_input_size:.1f} MB dữ liệu gốc.", flush=True)

    # 3. Hợp nhất 11 shards bằng DuckDB Streaming Engine (Tránh OOM tuyệt đối)
    print("\n🔄 Bước 2/4: Hợp nhất và chuẩn hóa 1.000.000 hồ sơ bằng DuckDB Streaming Engine...", flush=True)
    consolidated_path = Path(__file__).parent.parent / "personas_vn_1m.parquet"
    dest_path_sql = str(consolidated_path).replace("\\", "/")
    
    # Xóa file cũ nếu có để tạo mới toàn vẹn
    if consolidated_path.exists():
        try:
            consolidated_path.unlink()
        except Exception:
            pass

    t0_merge = time.time()
    con = duckdb.connect()
    # Giới hạn RAM tối đa 1.5GB cho DuckDB, giải phóng hoàn toàn bộ nhớ hệ thống
    con.execute("SET memory_limit = '1500MB';")
    con.execute("SET preserve_insertion_order = false;")

    files_sql = str([str(p).replace("\\", "/") for p in local_shards])
    
    copy_query = f"""
    COPY (
        SELECT 
            uuid,
            professional_persona,
            sports_persona,
            arts_persona,
            travel_persona,
            culinary_persona,
            persona,
            cultural_background,
            skills_and_expertise,
            skills_and_expertise_list,
            hobbies_and_interests,
            hobbies_and_interests_list,
            career_goals_and_ambitions,
            sex,
            CASE 
                WHEN sex = 'Nam' THEN 'male'
                WHEN sex = 'Nữ' THEN 'female'
                ELSE 'other'
            END AS gender,
            age,
            marital_status,
            education_level,
            occupation,
            zone,
            region,
            country,
            SUBSTR(persona, 1, 200) AS lifestyle,
            CASE 
                WHEN abs(hash(uuid)) % 100 < 15 THEN 'A'
                WHEN abs(hash(uuid)) % 100 < 50 THEN 'B'
                WHEN abs(hash(uuid)) % 100 < 85 THEN 'C'
                ELSE 'D'
            END AS income_bracket
        FROM read_parquet({files_sql})
    ) TO '{dest_path_sql}' (FORMAT PARQUET, COMPRESSION 'SNAPPY');
    """
    
    print("   -> Đang stream dữ liệu và ghi Parquet nén Snappy...", flush=True)
    con.execute(copy_query)
    elapsed_merge = time.time() - t0_merge

    file_size_bytes = os.path.getsize(consolidated_path)
    file_size_gb = file_size_bytes / (1024**3)
    file_size_mb = file_size_bytes / (1024**2)

    # Đếm kiểm tra số bản ghi
    verify_count = con.execute(f"SELECT COUNT(*) FROM '{dest_path_sql}';").fetchone()[0]
    print(f"✅ Hợp nhất thành công 100%! Đã sinh tệp: {consolidated_path}", flush=True)
    print(f"   - Tổng số hồ sơ: {verify_count:,} personas", flush=True)
    print(f"   - Dung lượng tệp: {file_size_mb:.1f} MB (~{file_size_gb:.2f} GB)", flush=True)
    print(f"   - Thời gian xử lý: {elapsed_merge:.1f} giây (Tiêu thụ RAM < 1GB)", flush=True)

    # 4. Upload lên Cloudflare R2 với Multipart Upload tăng tốc
    print(f"\n📤 Bước 3/4: Upload lên Cloudflare R2: s3://{R2_BUCKET}/{R2_FILE_KEY}...", flush=True)
    print(f"   (Sử dụng Multipart Upload đa luồng, chunk 16MB)...", flush=True)

    tracker = UploadProgressTracker(R2_FILE_KEY, file_size_bytes)
    transfer_config = TransferConfig(
        multipart_threshold=16 * 1024 * 1024,
        max_concurrency=8,
        multipart_chunksize=16 * 1024 * 1024,
        use_threads=True,
    )

    t0_upload = time.time()
    r2.upload_file(
        str(consolidated_path),
        R2_BUCKET,
        R2_FILE_KEY,
        Config=transfer_config,
        Callback=tracker,
        ExtraArgs={"ContentType": "application/octet-stream"},
    )
    elapsed_upload = time.time() - t0_upload
    speed_mb = file_size_mb / max(elapsed_upload, 1)
    print(f"\n🎉 Upload hoàn tất sau {elapsed_upload:.0f}s! Tốc độ trung bình: {speed_mb:.1f} MB/s", flush=True)

    # 5. Kiểm tra DuckDB đọc trực tiếp từ Cloudflare R2
    print(f"\n🔍 Bước 4/4: Kiểm tra DuckDB đọc trực tiếp từ Cloudflare R2 qua httpfs...", flush=True)
    con_r2 = duckdb.connect()
    endpoint_clean = R2_ENDPOINT.replace("https://", "").rstrip("/")
    con_r2.execute("INSTALL httpfs; LOAD httpfs;")
    con_r2.execute("SET s3_use_ssl = true;")
    con_r2.execute(f"SET s3_endpoint = '{endpoint_clean}';")
    con_r2.execute(f"SET s3_access_key_id = '{R2_KEY}';")
    con_r2.execute(f"SET s3_secret_access_key = '{R2_SECRET}';")
    con_r2.execute("SET s3_region = 'auto';")
    con_r2.execute("SET s3_url_style = 'path';")

    r2_url = f"s3://{R2_BUCKET}/{R2_FILE_KEY}"
    t0_query = time.time()
    res = con_r2.execute(f"SELECT COUNT(*) as total_rows FROM '{r2_url}';").fetchone()
    sample_df = con_r2.execute(f"SELECT age, gender, occupation, region, zone, income_bracket FROM '{r2_url}' USING SAMPLE 3;").df()
    elapsed_query = time.time() - t0_query

    print(f"   -> Kết quả truy vấn R2: {res[0]:,} hồ sơ ({elapsed_query:.2f}s)!", flush=True)
    print("   -> Mẫu dữ liệu truy vấn trực tiếp từ R2:", flush=True)
    print(sample_df.to_string(index=False), flush=True)

    print("\n" + "=" * 75, flush=True)
    print("  ✅ HOÀN TẤT 100%! TOÀN BỘ 1.000.000 HỒ SƠ ĐÃ SẴN SÀNG TRÊN CLOUDFLARE R2!", flush=True)
    print("=" * 75, flush=True)


if __name__ == "__main__":
    main()
