import duckdb
import sys

sys.stdout.reconfigure(encoding='utf-8')

con = duckdb.connect()
parquet = "personas_vn_1m.parquet"

print("=== 1. TỔNG SỐ BẢN GHI ===")
total = con.execute(f"SELECT count(*) FROM '{parquet}'").fetchone()[0]
print(f"Total rows: {total:,}")

print("\n=== 2. CẤU TRÚC CÁC CỘT (SCHEMA) ===")
desc = con.execute(f"DESCRIBE SELECT * FROM '{parquet}'").fetchall()
for col in desc:
    print(f"- {col[0]:<20} (Kiểu dữ liệu: {col[1]})")

print("\n=== 3. PHÂN BỐ VÙNG MIỀN (REGION) ===")
regions = con.execute(f"SELECT region, count(*) as cnt, round(count(*)*100.0/{total}, 1) as pct FROM '{parquet}' GROUP BY region ORDER BY cnt DESC").fetchall()
for r in regions:
    print(f"  * {r[0]}: {r[1]:,} hồ sơ ({r[2]}%)")

print("\n=== 4. PHÂN BỐ KHU VỰC (ZONE) ===")
zones = con.execute(f"SELECT zone, count(*) as cnt, round(count(*)*100.0/{total}, 1) as pct FROM '{parquet}' GROUP BY zone ORDER BY cnt DESC").fetchall()
for z in zones:
    print(f"  * {z[0]}: {z[1]:,} hồ sơ ({z[2]}%)")

print("\n=== 5. PHÂN BỐ ĐỘ TUỔI ===")
age_stats = con.execute(f"SELECT min(age), max(age), avg(age) FROM '{parquet}'").fetchone()
print(f"  * Tuổi nhỏ nhất: {age_stats[0]}, Lớn nhất: {age_stats[1]}, Trung bình: {age_stats[2]:.1f}")

print("\n=== 6. PHÂN BỐ THU NHẬP (INCOME BRACKET) ===")
incomes = con.execute(f"SELECT income_bracket, count(*) as cnt, round(count(*)*100.0/{total}, 1) as pct FROM '{parquet}' GROUP BY income_bracket ORDER BY income_bracket").fetchall()
for inc in incomes:
    print(f"  * Nhóm {inc[0]}: {inc[1]:,} hồ sơ ({inc[2]}%)")

print("\n=== 7. VÍ DỤ 1 BẢN GHI PERSONA HOÀN CHỈNH ===")
sample = con.execute(f"SELECT * FROM '{parquet}' LIMIT 1").df().to_dict(orient="records")[0]
for k, v in sample.items():
    print(f"  * {k}: {v}")
