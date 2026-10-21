import sqlite3
import sys

sys.stdout.reconfigure(encoding="utf-8")
con = sqlite3.connect("backend/surveys.db")
cur = con.cursor()

print("--- ALL SURVEYS ---")
rows = cur.execute("""
    SELECT id, model_type, status, sample_size, price_amount, 
           length(result_json), pdf_path, customer_email, created_at, completed_at
    FROM surveys
""").fetchall()

for r in rows:
    print(r)
