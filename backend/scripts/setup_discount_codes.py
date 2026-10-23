"""
Script thiết lập bảng discount_codes và cập nhật schema surveys.
Hỗ trợ các mã giảm giá linh hoạt: OFF100 (100%), OFF50 (50%), OFF30 (30%).
Dữ liệu lưu trong CSDL Supabase/PostgreSQL, không hardcode trong mã nguồn.
"""

import os
import sys
from dotenv import load_dotenv

# Load backend/.env
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(env_path)

import sqlalchemy as sa

db_url = os.getenv("DATABASE_URL")
if not db_url:
    print("[ERROR] DATABASE_URL is not set!")
    sys.exit(1)

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

print(f"[INFO] Connecting to database...")
engine = sa.create_engine(db_url)

with engine.begin() as conn:
    # 1. Tạo bảng discount_codes nếu chưa có
    print("[INFO] Creating table discount_codes if not exists...")
    conn.execute(sa.text("""
        CREATE TABLE IF NOT EXISTS discount_codes (
            code VARCHAR(50) PRIMARY KEY,
            discount_percent INT NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            max_uses INT NULL,
            used_count INT NOT NULL DEFAULT 0,
            description VARCHAR(255) NULL,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    """))

    # 2. Thêm các cột giảm giá vào bảng surveys nếu chưa có
    print("[INFO] Adding discount columns to surveys table if not exist...")
    conn.execute(sa.text("""
        ALTER TABLE surveys ADD COLUMN IF NOT EXISTS original_price INT;
        ALTER TABLE surveys ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50);
        ALTER TABLE surveys ADD COLUMN IF NOT EXISTS discount_amount INT DEFAULT 0;
    """))

    # 3. Seed các mã giảm giá theo yêu cầu: OFF100, OFF50, OFF30
    print("[INFO] Seeding / updating discount codes...")
    seeds = [
        ("OFF100", 100, True, None, "Mã ưu đãi 100% kiểm thử nội bộ"),
        ("OFF50", 50, True, None, "Mã ưu đãi 50% dành cho khách hàng thân thiết"),
        ("OFF30", 30, True, None, "Mã ưu đãi 30% dành cho đối tác chiến lược"),
    ]

    for code, percent, active, max_u, desc in seeds:
        conn.execute(sa.text("""
            INSERT INTO discount_codes (code, discount_percent, is_active, max_uses, description)
            VALUES (:code, :percent, :active, :max_u, :desc)
            ON CONFLICT (code) DO UPDATE
            SET discount_percent = EXCLUDED.discount_percent,
                is_active = EXCLUDED.is_active,
                description = EXCLUDED.description;
        """), {"code": code, "percent": percent, "active": active, "max_u": max_u, "desc": desc})

    print("[SUCCESS] Discount codes initialized successfully:")
    res = conn.execute(sa.text("SELECT code, discount_percent, is_active, used_count, description FROM discount_codes;"))
    for row in res.fetchall():
        print(f"  - {row[0]}: Giảm {row[1]}% | Kích hoạt: {row[2]} | Lượt dùng: {row[3]} | {row[4]}")
