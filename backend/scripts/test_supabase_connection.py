"""
Script: Kiểm tra kết nối Supabase PostgreSQL và tự động khởi tạo bảng.
Chạy: python scripts/test_supabase_connection.py
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Thêm thư mục backend vào sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

load_dotenv()

from database import engine, DATABASE_URL, init_db, Survey, SurveyLog
from sqlalchemy import text, inspect

def main():
    print("=" * 70)
    print("KIỂM TRA KẾT NỐI DATABASE (SUPABASE POSTGRESQL / SQLITE)")
    print("=" * 70)
    
    masked_url = DATABASE_URL
    if "@" in DATABASE_URL:
        prefix, rest = DATABASE_URL.split("@", 1)
        protocol = prefix.split("://")[0]
        masked_url = f"{protocol}://****:****@{rest}"
    
    print(f"URL: {masked_url}")
    
    if "sqlite" in DATABASE_URL:
        print("\n[CHẾ ĐỘ]: SQLite Cục bộ (Local Fallback)")
        print("-> Để chuyển sang Supabase, hãy dán chuỗi kết nối PostgreSQL vào biến DATABASE_URL trong backend/.env")
    else:
        print("\n[CHẾ ĐỘ]: Cloud PostgreSQL / Supabase")
        
    try:
        with engine.connect() as conn:
            if "sqlite" in DATABASE_URL:
                result = conn.execute(text("SELECT sqlite_version();")).fetchone()
                print("\n[KẾT NỐI THÀNH CÔNG!]")
                print(f"Phiên bản SQLite: {result[0]}")
            else:
                result = conn.execute(text("SELECT version();")).fetchone()
                print("\n[KẾT NỐI THÀNH CÔNG!]")
                print(f"Phiên bản PostgreSQL: {result[0]}")
            
            # Kiểm tra bảng
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            print(f"\nCác bảng hiện có trong database: {tables}")
            
            if "surveys" not in tables or "survey_logs" not in tables:
                print("-> Đang tự động khởi tạo bảng 'surveys' và 'survey_logs'...")
                init_db()
                tables_after = inspect(engine).get_table_names()
                print(f"[HOÀN TẤT] Danh sách bảng sau khởi tạo: {tables_after}")
            else:
                print("[CHUẨN XÁC] Cả 2 bảng 'surveys' và 'survey_logs' đã sẵn sàng trên Supabase!")
                
    except Exception as e:
        print(f"\n[LỖI KẾT NỐI]: {e}")
        print("\nLưu ý:")
        print("1. Kiểm tra mật khẩu tài khoản Supabase (nếu có ký tự đặc biệt như @, #, !, cần URL encode).")
        print("2. Sử dụng Connection string dạng URI (chế độ Transaction Pooler 6543 hoặc Session 5432).")
        print("3. Đảm bảo IP của bạn không bị chặn trong Network Restrictions của Supabase.")
        sys.exit(1)

if __name__ == "__main__":
    main()
