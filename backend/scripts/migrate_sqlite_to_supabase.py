"""
Script: Đồng bộ dữ liệu từ SQLite (surveys.db) sang Supabase PostgreSQL.
Chạy: python scripts/migrate_sqlite_to_supabase.py
"""

import os
import sys
import sqlite3
from pathlib import Path
from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).parent.parent))
load_dotenv()

from database import engine, DATABASE_URL, init_db
from sqlalchemy import text

def migrate():
    print("=" * 70)
    print("ĐỒNG BỘ DỮ LIỆU TỪ SQLITE (surveys.db) SANG SUPABASE POSTGRESQL")
    print("=" * 70)
    
    if "sqlite" in DATABASE_URL:
        print("[THÔNG BÁO]: DATABASE_URL hiện tại đang là SQLite cục bộ.")
        print("Vui lòng dán chuỗi kết nối Supabase vào DATABASE_URL trong backend/.env trước khi chạy di chuyển dữ liệu.")
        return

    sqlite_db_path = Path(__file__).parent.parent / "surveys.db"
    if not sqlite_db_path.exists():
        print(f"[CẢNH BÁO]: Không tìm thấy file {sqlite_db_path}.")
        return

    # 1. Đảm bảo bảng trên Supabase đã tồn tại
    init_db()

    # 2. Đọc dữ liệu từ SQLite
    conn_lite = sqlite3.connect(str(sqlite_db_path))
    conn_lite.row_factory = sqlite3.Row
    cur_lite = conn_lite.cursor()

    cur_lite.execute("SELECT * FROM surveys")
    surveys = cur_lite.fetchall()
    print(f"-> Tìm thấy {len(surveys)} đơn hàng trong SQLite cần chuyển giao...")

    cur_lite.execute("SELECT * FROM survey_logs")
    logs = cur_lite.fetchall()
    print(f"-> Tìm thấy {len(logs)} bản ghi log telemetry trong SQLite...")

    # 3. Nạp surveys vào Supabase PostgreSQL
    valid_survey_ids = set()
    with engine.begin() as pg_conn:
        migrated_surveys = 0
        for s in surveys:
            d = dict(s)
            stmt = text("""
                INSERT INTO surveys (
                    id, model_type, status, region, zone, min_age, max_age,
                    sample_size, product_info_json, price_amount, result_json,
                    pdf_path, sepay_transaction_id, paid_at, customer_email,
                    created_at, completed_at, error_msg
                ) VALUES (
                    :id, :model_type, :status, :region, :zone, :min_age, :max_age,
                    :sample_size, :product_info_json, :price_amount, :result_json,
                    :pdf_path, :sepay_transaction_id, :paid_at, :customer_email,
                    :created_at, :completed_at, :error_msg
                )
                ON CONFLICT (id) DO UPDATE SET
                    status = EXCLUDED.status,
                    result_json = EXCLUDED.result_json,
                    pdf_path = EXCLUDED.pdf_path,
                    completed_at = EXCLUDED.completed_at;
            """)
            pg_conn.execute(stmt, d)
            valid_survey_ids.add(d["id"])
            migrated_surveys += 1

        print(f"[THÀNH CÔNG]: Đã đồng bộ {migrated_surveys} đơn hàng lên Supabase.")

    # 4. Nạp survey_logs (chỉ nạp các log có survey_id tồn tại)
    with engine.begin() as pg_conn:
        migrated_logs = 0
        for l in logs:
            ld = dict(l)
            if ld["survey_id"] not in valid_survey_ids:
                continue
            ld.pop("id", None)  # để Supabase tự sinh BIGSERIAL
            stmt_log = text("""
                INSERT INTO survey_logs (survey_id, percent, log_msg, status, created_at)
                VALUES (:survey_id, :percent, :log_msg, :status, :created_at)
            """)
            pg_conn.execute(stmt_log, ld)
            migrated_logs += 1

        print(f"[THÀNH CÔNG]: Đã đồng bộ {migrated_logs} bản ghi telemetry logs lên Supabase.")

    conn_lite.close()
    print("\n[HOÀN TẤT ĐỒNG BỘ 100%] Toàn bộ dữ liệu đã được lưu trữ vĩnh viễn trên Supabase Cloud!")

if __name__ == "__main__":
    migrate()
