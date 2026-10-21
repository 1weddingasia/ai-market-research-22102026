"""
T0.5: Region mapping — Map tên UI → tên thực trong dataset Parquet.

⚠️  QUAN TRỌNG: Sau khi chạy verify_schema.py, update file này
với tên đúng của các region trong dataset thực tế.

Hiện tại: Điền các giá trị phổ biến theo đặc tả CTO.
Sau khi verify: So sánh với output của verify_schema.py
và update REGION_MAP + ZONE_MAP cho khớp chính xác.
"""

from typing import Optional

# ─── Region mapping (UI label → dataset value) ────────────────────────────────
# Key: Tên hiển thị trên UI
# Value: Giá trị thực trong cột 'region' của Parquet
# → CẦN UPDATE sau khi chạy verify_schema.py
REGION_MAP: dict[str, str] = {
    # Toàn quốc (không lọc region)
    "Toàn quốc": None,

    # Miền / Vùng kinh tế thực tế theo GSO trong Nemotron Dataset
    "Đông Nam Bộ": "Đông Nam Bộ",
    "Đồng bằng sông Hồng": "Đồng bằng sông Hồng",
    "Đồng bằng sông Cửu Long": "Đồng bằng sông Cửu Long",
    "Bắc Trung Bộ và Duyên hải miền Trung": "Bắc Trung Bộ và Duyên hải miền Trung",
    "Trung du và miền núi phía Bắc": "Trung du và miền núi phía Bắc",
    "Tây Nguyên": "Tây Nguyên",

    # Nhóm gộp vùng
    "Miền Bắc": "Đồng bằng sông Hồng",
    "Miền Trung": "Bắc Trung Bộ và Duyên hải miền Trung",
    "Miền Nam": "Đông Nam Bộ",
    "Tây Nam Bộ": "Đồng bằng sông Cửu Long",
}

# ─── Province/Zone mapping ─────────────────────────────────────────────────────
# Dataset Parquet thực tế chứa 2 giá trị trong cột 'zone': 'Đô Thị' và 'Nông Thôn'
# Cột 'region' chứa 6 vùng kinh tế: 'Đông Nam Bộ', 'Đồng bằng sông Hồng', ...
PROVINCE_TO_REGION: dict[str, str] = {
    "TP. Hồ Chí Minh": "Đông Nam Bộ",
    "Thành phố Hồ Chí Minh": "Đông Nam Bộ",
    "Hồ Chí Minh": "Đông Nam Bộ",
    "Hà Nội": "Đồng bằng sông Hồng",
    "Thành phố Hà Nội": "Đồng bằng sông Hồng",
    "Đà Nẵng": "Bắc Trung Bộ và Duyên hải miền Trung",
    "Hải Phòng": "Đồng bằng sông Hồng",
    "Cần Thơ": "Đồng bằng sông Cửu Long",
    "Bình Dương": "Đông Nam Bộ",
    "Đồng Nai": "Đông Nam Bộ",
    "Long An": "Đồng bằng sông Cửu Long",
    "Khánh Hòa": "Bắc Trung Bộ và Duyên hải miền Trung",
    "Quảng Nam": "Bắc Trung Bộ và Duyên hải miền Trung",
}

PROVINCE_MAP: dict[str, str] = {
    "TP. Hồ Chí Minh": "Đô Thị",
    "Thành phố Hồ Chí Minh": "Đô Thị",
    "Hà Nội": "Đô Thị",
    "Thành phố Hà Nội": "Đô Thị",
    "Đà Nẵng": "Đô Thị",
    "Hải Phòng": "Đô Thị",
    "Cần Thơ": "Đô Thị",
    "Bình Dương": "Đô Thị",
    "Đồng Nai": "Đô Thị",
    "Đô Thị": "Đô Thị",
    "Nông Thôn": "Nông Thôn",
}

# ─── Gender mapping ────────────────────────────────────────────────────────────
GENDER_MAP: dict[str, str] = {
    "Nam": "male",
    "Nữ": "female",
    "Tất cả": None,
}

# ─── Income bracket mapping ───────────────────────────────────────────────────
INCOME_MAP: dict[str, str] = {
    "Dưới 5 triệu (D)": "D",
    "5-10 triệu (C)": "C",
    "10-25 triệu (B)": "B",
    "Trên 25 triệu (A)": "A",
    "Tất cả": None,
}

# ─── Sample size → Price mapping ──────────────────────────────────────────────
PRICING: dict[int, int] = {
    500:  200_000,   # 200.000đ
    1000: 300_000,   # 300.000đ (gói khuyên dùng)
    2000: 500_000,   # 500.000đ
    3000: 700_000,   # 700.000đ
}

# ─── Region → sample size recommendation ──────────────────────────────────────
SAMPLE_RECOMMENDATIONS: dict[str, dict] = {
    "district": {
        "sample": 500,
        "margin_of_error": "±4.3%",
        "description": "Phù hợp khảo sát quán ăn, cơ sở địa phương",
    },
    "province": {
        "sample": 1000,
        "margin_of_error": "±3.1%",
        "description": "Chuẩn vàng nghiên cứu thị trường cấp tỉnh",
    },
    "national": {
        "sample": 2000,
        "margin_of_error": "±2.2%",
        "description": "Đại diện toàn quốc, phù hợp sản phẩm tung thị trường quốc gia",
    },
}


def get_region_filter(ui_region: Optional[str], ui_province: Optional[str] = None) -> Optional[str]:
    """Trả về giá trị thực trong dataset cho cột region."""
    if ui_region and ui_region in REGION_MAP and REGION_MAP[ui_region]:
        return REGION_MAP[ui_region]
    if ui_province and ui_province in PROVINCE_TO_REGION:
        return PROVINCE_TO_REGION[ui_province]
    return REGION_MAP.get(ui_region) if ui_region else None


def get_province_filter(ui_province: Optional[str]) -> Optional[str]:
    """Trả về 'Đô Thị' hoặc 'Nông Thôn' cho cột zone."""
    if not ui_province:
        return None
    if ui_province in ("Đô Thị", "Nông Thôn"):
        return ui_province
    return PROVINCE_MAP.get(ui_province, "Đô Thị")


def get_price(sample_size: int) -> int:
    """Trả về giá tiền VND theo số lượng mẫu."""
    return PRICING.get(sample_size, 300_000)


def get_sample_recommendation(scope: str) -> dict:
    """scope: 'district' | 'province' | 'national'"""
    return SAMPLE_RECOMMENDATIONS.get(scope, SAMPLE_RECOMMENDATIONS["province"])
