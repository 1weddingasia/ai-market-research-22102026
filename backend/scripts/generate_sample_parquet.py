"""
Generate a realistic local sample Parquet of Vietnamese personas for DuckDB sampling.
Contains 5,000 realistic synthetic personas based on GSO demographic distribution.
"""

import os
import random
import pandas as pd

REGIONS_AND_ZONES = [
    ("Đông Nam Bộ", "TP. Hồ Chí Minh", 0.35),
    ("Đồng bằng sông Hồng", "Hà Nội", 0.25),
    ("Duyên hải Miền Trung", "Đà Nẵng", 0.10),
    ("Đồng bằng Sông Cửu Long", "Cần Thơ", 0.10),
    ("Đồng bằng sông Hồng", "Hải Phòng", 0.08),
    ("Đông Nam Bộ", "Bình Dương", 0.07),
    ("Duyên hải Miền Trung", "Khánh Hòa", 0.05),
]

OCCUPATIONS = [
    "Nhân viên văn phòng", "Quản lý kinh doanh", "Kỹ sư công nghệ", 
    "Chuyên viên marketing", "Chủ cửa hàng / Tự do", "Kế toán / Tài chính",
    "Giáo viên / Giảng viên", "Sinh viên năm cuối", "Bác sĩ / Dược sĩ"
]

INCOME_BRACKETS = [
    ("A", "Trên 35 triệu"),
    ("B", "20 - 35 triệu"),
    ("C", "12 - 20 triệu"),
    ("D", "7 - 12 triệu"),
]

CULINARY_PERSONAS = [
    "Thực khách sành điệu & Quan tâm sức khỏe (Healthy Foodie)",
    "Người tiêu dùng tiện lợi & Thích trải nghiệm mới (Trendy Convenience)",
    "Người mua sắm truyền thống & Tiết kiệm chi tiêu (Value Shopper)",
    "Gia đình hiện đại & Ưu tiên nguồn gốc hữu cơ (Modern Family Care)"
]

LIFESTYLES = [
    "Quan tâm lối sống xanh, thường xuyên tập gym/yoga và ăn uống healthy.",
    "Bận rộn công việc công sở, ưu tiên các sản phẩm tiện lợi, giao hàng nhanh.",
    "Thích tụ tập bạn bè vào dịp cuối tuần, chi tiêu thoải mái cho đồ uống và trải nghiệm.",
    "Tiết kiệm thông minh, luôn so sánh giá và canh các chương trình khuyến mãi/combo."
]

def generate_sample(n=5000):
    rows = []
    for _ in range(n):
        # Pick region based on weight
        reg, zone, _ = random.choices(
            REGIONS_AND_ZONES,
            weights=[w for _, _, w in REGIONS_AND_ZONES]
        )[0]
        
        age = random.randint(18, 65)
        gender = random.choice(["male", "female"])
        occupation = random.choice(OCCUPATIONS)
        inc_code, inc_text = random.choice(INCOME_BRACKETS)
        culinary = random.choice(CULINARY_PERSONAS)
        lifestyle = random.choice(LIFESTYLES)
        
        rows.append({
            "age": age,
            "gender": gender,
            "occupation": occupation,
            "income_bracket": inc_code,
            "region": reg,
            "zone": zone,
            "culinary_persona": culinary,
            "lifestyle": lifestyle,
        })
    
    df = pd.DataFrame(rows)
    target_path = os.path.join(os.path.dirname(__file__), "..", "personas_vn_sample.parquet")
    df.to_parquet(target_path, index=False)
    print(f"✅ Generated {len(df)} personas to {os.path.abspath(target_path)}")

if __name__ == "__main__":
    generate_sample(5000)
