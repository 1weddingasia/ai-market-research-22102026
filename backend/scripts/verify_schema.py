"""
T0.4: Script kiểm tra schema thực tế của file Parquet trên R2.
Phải chạy script này SAU KHI upload_to_r2.py hoàn tất.

Output: in ra tên cột, kiểu dữ liệu, và sample values
để coder xác nhận đúng tên trước khi viết DuckDB queries.

Cách dùng:
    python scripts/verify_schema.py
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

import duckdb


def get_r2_url() -> str:
    endpoint = os.getenv("R2_ENDPOINT", "").rstrip("/")
    bucket   = os.getenv("R2_BUCKET_NAME", "personas-vietnam")
    key      = os.getenv("R2_FILE_KEY", "personas_vn_1m.parquet")
    # DuckDB dùng path dạng s3://bucket/key với custom endpoint
    return f"s3://{bucket}/{key}"


def setup_duckdb_r2(con: duckdb.DuckDBPyConnection) -> None:
    """Cấu hình DuckDB kết nối Cloudflare R2 qua httpfs."""
    endpoint = os.getenv("R2_ENDPOINT", "").replace("https://", "").rstrip("/")
    key      = os.getenv("R2_ACCESS_KEY_ID", "")
    secret   = os.getenv("R2_SECRET_ACCESS_KEY", "")

    con.execute("INSTALL httpfs; LOAD httpfs;")
    con.execute("SET s3_use_ssl = true;")
    con.execute(f"SET s3_endpoint = '{endpoint}';")
    con.execute(f"SET s3_access_key_id = '{key}';")
    con.execute(f"SET s3_secret_access_key = '{secret}';")
    # Cloudflare R2 không cần region
    con.execute("SET s3_region = 'auto';")
    # Tắt URL signing style mặc định (R2 dùng path style)
    con.execute("SET s3_url_style = 'path';")


def main():
    print("=" * 60)
    print("  VERIFY SCHEMA — Parquet on Cloudflare R2")
    print("=" * 60)

    # Validate env
    for var in ["R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"]:
        if not os.getenv(var):
            print(f"❌ Thiếu biến môi trường: {var}")
            sys.exit(1)

    con = duckdb.connect()
    setup_duckdb_r2(con)

    parquet_path = get_r2_url()
    print(f"\n📂 Đọc file: {parquet_path}\n")

    # ── 1. Đếm tổng số dòng ───────────────────────────────────────────────────
    print("1️⃣  Đếm tổng số dòng...")
    count = con.execute(f"SELECT COUNT(*) FROM '{parquet_path}'").fetchone()[0]
    print(f"   → Tổng: {count:,} personas\n")

    # ── 2. Xem schema (tên cột + kiểu) ───────────────────────────────────────
    print("2️⃣  Schema (tên cột và kiểu dữ liệu):")
    schema = con.execute(
        f"DESCRIBE SELECT * FROM '{parquet_path}' LIMIT 1"
    ).fetchall()
    col_names = []
    for col_name, col_type, *_ in schema:
        col_names.append(col_name)
        print(f"   {col_name:30s} {col_type}")

    # ── 3. Xem 5 dòng đầu ────────────────────────────────────────────────────
    print("\n3️⃣  5 dòng đầu tiên:")
    sample = con.execute(
        f"SELECT * FROM '{parquet_path}' LIMIT 5"
    ).df()
    print(sample.to_string(max_cols=10))

    # ── 4. Distinct values của các cột quan trọng ─────────────────────────────
    important_cols = ["region", "zone", "gender", "income_bracket", "age"]
    print("\n4️⃣  Distinct values của các cột quan trọng:")
    for col in important_cols:
        if col not in col_names:
            print(f"\n   ⚠️  Cột '{col}' KHÔNG TỒN TẠI trong dataset!")
            print(f"      → Cần update region_mapping.py với tên cột đúng")
            continue
        try:
            vals = con.execute(
                f"SELECT DISTINCT {col} FROM '{parquet_path}' ORDER BY {col} LIMIT 30"
            ).fetchall()
            vals_str = ", ".join(str(v[0]) for v in vals)
            print(f"\n   📌 {col}:")
            print(f"      {vals_str}")
        except Exception as e:
            print(f"\n   ❌ Lỗi đọc cột {col}: {e}")

    # ── 5. Test query stratified sample ───────────────────────────────────────
    print("\n5️⃣  Test query lấy 100 mẫu ngẫu nhiên (benchmark tốc độ):")
    import time
    start = time.time()
    try:
        result = con.execute(
            f"""
            SELECT age, gender, occupation, income_bracket, region
            FROM '{parquet_path}'
            USING SAMPLE 100 (reservoir, 42)
            """
        ).df()
        elapsed = time.time() - start
        print(f"   ✅ Lấy được {len(result)} dòng trong {elapsed:.3f}s")
        print(f"   Sample:\n{result.head(3).to_string()}")
    except Exception as e:
        print(f"   ❌ Query thất bại: {e}")
        print("   → Kiểm tra lại R2 credentials và tên file")

    print("\n" + "=" * 60)
    print("  ✅ Verify hoàn tất!")
    print("  → Kiểm tra output bên trên và cập nhật")
    print("     services/region_mapping.py với tên cột đúng.")
    print("=" * 60)


if __name__ == "__main__":
    main()
