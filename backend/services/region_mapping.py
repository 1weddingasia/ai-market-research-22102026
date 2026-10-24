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
    50:   10_000,    # 10.000đ (Gói kiểm thử thực tế / Test VietQR)
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


# ─── Display Labels Map ────────────────────────────────────────────────────────
REGION_DISPLAY_NAMES: dict[str, str] = {
    "TP. Hồ Chí Minh": "TP. Hồ Chí Minh (Đô thị loại đặc biệt)",
    "Thành phố Hồ Chí Minh": "TP. Hồ Chí Minh (Đô thị loại đặc biệt)",
    "Hồ Chí Minh": "TP. Hồ Chí Minh (Đô thị loại đặc biệt)",
    "Hà Nội": "Hà Nội (Thủ đô & Vùng kinh tế Bắc Bộ)",
    "Thành phố Hà Nội": "Hà Nội (Thủ đô & Vùng kinh tế Bắc Bộ)",
    "Đà Nẵng": "Đà Nẵng & Duyên hải Miền Trung",
    "Cần Thơ": "Cần Thơ & Đồng bằng Sông Cửu Long",
    "Hải Phòng": "Hải Phòng & Vùng Đông Bắc",
    "Miền Bắc": "Khu vực Miền Bắc (Phân bổ chuẩn GSO)",
    "Miền Nam": "Khu vực Miền Nam (Phân bổ chuẩn GSO)",
    "Miền Trung": "Khu vực Miền Trung (Phân bổ chuẩn GSO)",
    "Tây Nam Bộ": "Khu vực Đồng bằng sông Cửu Long",
    "Đông Nam Bộ": "Khu vực Đông Nam Bộ",
    "Đồng bằng sông Hồng": "Khu vực Đồng bằng sông Hồng",
    "Đồng bằng sông Cửu Long": "Khu vực Đồng bằng sông Cửu Long",
    "Bắc Trung Bộ và Duyên hải miền Trung": "Khu vực Miền Trung & Duyên hải",
    "Trung du và miền núi phía Bắc": "Khu vực Trung du & Miền núi phía Bắc",
    "Tây Nguyên": "Khu vực Tây Nguyên",
    "Toàn quốc": "Toàn quốc (Đại diện 3 miền)",
}


def resolve_sampling_filters(
    ui_region: Optional[str],
    ui_zone: Optional[str] = None
) -> tuple[Optional[str], Optional[str], str]:
    """
    Chuẩn hóa bộ lọc địa lý cho DuckDB và tên hiển thị uy tín trong báo cáo.

    Returns:
        tuple(region_filter, zone_filter, display_location)
        - region_filter: Tên cột 'region' trong Parquet ('Đông Nam Bộ', 'Đồng bằng sông Hồng', ...) hoặc None (toàn quốc)
        - zone_filter: Tên cột 'zone' ('Đô Thị' hoặc 'Nông Thôn') hoặc None (không lọc theo zone)
        - display_location: Tên hiển thị chuẩn xác, trang trọng cho báo cáo
    """
    raw_input = (ui_region or "").strip()
    zone_input = (ui_zone or "").strip() if ui_zone else None

    # Mặc định toàn quốc
    if not raw_input or raw_input.lower() in ("toàn quốc", "vietnam", "việt nam", "national", "none"):
        if zone_input in ("Đô Thị", "Nông Thôn"):
            return None, zone_input, f"Toàn quốc (Phân khúc {zone_input})"
        return None, None, "Toàn quốc (Đại diện 3 miền)"

    # Trường hợp là Thành phố lớn trực thuộc Trung ương -> Lọc Đô Thị + Region tương ứng
    city_to_filters = {
        "TP. Hồ Chí Minh": ("Đông Nam Bộ", "Đô Thị", "TP. Hồ Chí Minh (Đô thị loại đặc biệt)"),
        "Thành phố Hồ Chí Minh": ("Đông Nam Bộ", "Đô Thị", "TP. Hồ Chí Minh (Đô thị loại đặc biệt)"),
        "Hồ Chí Minh": ("Đông Nam Bộ", "Đô Thị", "TP. Hồ Chí Minh (Đô thị loại đặc biệt)"),
        "Hà Nội": ("Đồng bằng sông Hồng", "Đô Thị", "Hà Nội (Thủ đô & Vùng kinh tế Bắc Bộ)"),
        "Thành phố Hà Nội": ("Đồng bằng sông Hồng", "Đô Thị", "Hà Nội (Thủ đô & Vùng kinh tế Bắc Bộ)"),
        "Đà Nẵng": ("Bắc Trung Bộ và Duyên hải miền Trung", "Đô Thị", "Đà Nẵng & Duyên hải Miền Trung"),
        "Hải Phòng": ("Đồng bằng sông Hồng", "Đô Thị", "Hải Phòng & Vùng Đông Bắc"),
        "Cần Thơ": ("Đồng bằng sông Cửu Long", "Đô Thị", "Cần Thơ & Đồng bằng Sông Cửu Long"),
        "Bình Dương": ("Đông Nam Bộ", "Đô Thị", "Bình Dương (Đô thị Công nghiệp)"),
        "Đồng Nai": ("Đông Nam Bộ", "Đô Thị", "Đồng Nai (Vùng kinh tế Đông Nam Bộ)"),
    }

    if raw_input in city_to_filters:
        r, z, disp = city_to_filters[raw_input]
        return r, z, disp

    # Trường hợp là Vùng miền / Nhóm vùng
    region_val = REGION_MAP.get(raw_input)
    if region_val:
        zone_val = get_province_filter(zone_input) if zone_input else None
        disp = REGION_DISPLAY_NAMES.get(raw_input, f"Khu vực {raw_input}")
        return region_val, zone_val, disp

    # Fallback kiểm tra trong PROVINCE_TO_REGION
    if raw_input in PROVINCE_TO_REGION:
        r = PROVINCE_TO_REGION[raw_input]
        z = PROVINCE_MAP.get(raw_input, "Đô Thị")
        disp = REGION_DISPLAY_NAMES.get(raw_input, f"Khu vực {raw_input}")
        return r, z, disp

    # Nếu không khớp danh sách định sẵn, giữ nguyên nhãn người dùng nhập
    return None, None, raw_input or "Toàn quốc (Đại diện 3 miền)"


def get_region_filter(ui_region: Optional[str], ui_province: Optional[str] = None) -> Optional[str]:
    """Trả về giá trị thực trong dataset cho cột region."""
    r, _, _ = resolve_sampling_filters(ui_region, ui_province)
    return r


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

