import sqlite3

con = sqlite3.connect("surveys.db")
cur = con.cursor()
cols = [r[1] for r in cur.execute("PRAGMA table_info(surveys)").fetchall()]
new_cols = [
    ("target_gender", "VARCHAR(20) DEFAULT 'all'"),
    ("target_income", "VARCHAR(50) DEFAULT 'all'"),
    ("target_marital_status", "VARCHAR(50) DEFAULT 'all'"),
    ("target_occupation", "VARCHAR(50) DEFAULT 'all'"),
    ("target_zone", "VARCHAR(50) DEFAULT 'all'"),
]
for col_name, col_type in new_cols:
    if col_name not in cols:
        cur.execute(f"ALTER TABLE surveys ADD COLUMN {col_name} {col_type}")
        print(f"Added column {col_name}")
con.commit()
print("DB Migration completed successfully!")
