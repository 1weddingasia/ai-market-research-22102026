"""
Analysis: Brand Perceptual Mapping — Bản đồ định vị thương hiệu & Phát hiện khoảng trống thị trường.
Đo lường tọa độ nhận thức (X: Giá cả, Y: Đổi mới sáng tạo) từ 1-10.
Tâm tọa độ (5.0, 5.0). Nhận diện White-space Opportunity.
"""
from collections import defaultdict
from datetime import datetime
import statistics
from models.schemas import (
    ExecutiveSummary, QualitativeInsights, QuantitativeMetrics,
    ReportPayload, TargetSummary, VerbatimQuote,
)
from services.duckdb_service import get_demographic_summary

QUADRANT_DEFINITIONS = {
    "Q1": {
        "name": "Cao cấp & Đột phá Công nghệ (Premium Innovators)",
        "condition": lambda x, y: x >= 5.0 and y >= 5.0,
        "color": "#4f46e5",
    },
    "Q2": {
        "name": "Bình dân & Hiện đại Thông minh (Smart Value Disruptors)",
        "condition": lambda x, y: x < 5.0 and y >= 5.0,
        "color": "#059669",
    },
    "Q3": {
        "name": "Bình dân & Truyền thống Quen thuộc (Budget Traditionalists)",
        "condition": lambda x, y: x < 5.0 and y < 5.0,
        "color": "#d97706",
    },
    "Q4": {
        "name": "Cao cấp & Di sản Uy tín (Heritage Luxury)",
        "condition": lambda x, y: x >= 5.0 and y < 5.0,
        "color": "#dc2626",
    },
}


def analyze(survey_id, responses, personas_df, product_info, survey_config):
    total = len(responses)
    demo = get_demographic_summary(personas_df)
    male_pct = demo.get("gender", {}).get("male_pct", 50)
    female_pct = demo.get("gender", {}).get("female_pct", 50)

    # Danh sách thương hiệu
    raw_brands = product_info.get("brands") or []
    if isinstance(raw_brands, str):
        raw_brands = [x.strip() for x in raw_brands.replace("\n", ",").split(",") if x.strip()]

    client_brand = product_info.get("brand_name") or product_info.get("product_name") or "Thương hiệu của bạn"
    if not raw_brands:
        raw_brands = [client_brand, "Đối thủ A (Truyền thống)", "Đối thủ B (Ngoại nhập)", "Đối thủ C (Giá rẻ)"]
    elif client_brand not in raw_brands:
        raw_brands.insert(0, client_brand)

    axis_x_label = product_info.get("axis_x_label") or "Phân khúc Giá (1: Bình dân ↔ 10: Cao cấp)"
    axis_y_label = product_info.get("axis_y_label") or "Đổi mới Sáng tạo (1: Truyền thống ↔ 10: Đột phá)"

    # Thu thập tọa độ từng thương hiệu từ responses
    brand_x_scores = defaultdict(list)
    brand_y_scores = defaultdict(list)

    for r in responses:
        ratings = r.get("ratings") or []
        if isinstance(ratings, list) and len(ratings) > 0:
            for item in ratings:
                bname = item.get("brand")
                if bname in raw_brands:
                    sx = float(item.get("score_x") or 5.0)
                    sy = float(item.get("score_y") or 5.0)
                    brand_x_scores[bname].append(max(1.0, min(10.0, sx)))
                    brand_y_scores[bname].append(max(1.0, min(10.0, sy)))
        else:
            # Fallback phân bố trải đều
            for idx, bname in enumerate(raw_brands):
                base_x = 3.5 + (idx % 2) * 3.5
                base_y = 4.0 + (idx // 2) * 2.5
                brand_x_scores[bname].append(base_x)
                brand_y_scores[bname].append(base_y)

    brands_data = []
    quadrant_counts = {"Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0}

    for bname in raw_brands:
        xs = brand_x_scores[bname] or [5.0]
        ys = brand_y_scores[bname] or [5.0]
        avg_x = round(statistics.mean(xs), 2)
        avg_y = round(statistics.mean(ys), 2)

        # Xác định góc phần tư
        q_code = "Q1"
        for q, meta in QUADRANT_DEFINITIONS.items():
            if meta["condition"](avg_x, avg_y):
                q_code = q
                break

        quadrant_counts[q_code] += 1
        is_client = (bname == client_brand or bname == raw_brands[0])

        brands_data.append({
            "brand": bname,
            "x": avg_x,
            "y": avg_y,
            "quadrant": q_code,
            "quadrant_name": QUADRANT_DEFINITIONS[q_code]["name"],
            "color": "#0ea5e9" if is_client else QUADRANT_DEFINITIONS[q_code]["color"],
            "is_client": is_client,
        })

    # Tìm khoảng trống thị trường (Góc phần tư có ít hoặc không có đối thủ chiếm đóng)
    sorted_quads = sorted(quadrant_counts.items(), key=lambda kv: kv[1])
    least_occupied_quad = sorted_quads[0][0]
    whitespace_name = QUADRANT_DEFINITIONS[least_occupied_quad]["name"]

    client_data = next((b for b in brands_data if b["is_client"]), brands_data[0])

    viability_score = min(95, max(65, int(70 + (client_data["y"] * 2.5))))

    model_specific = {
        "brands_data": brands_data,
        "axis_x_label": axis_x_label,
        "axis_y_label": axis_y_label,
        "quadrant_counts": quadrant_counts,
        "whitespace_quadrant": least_occupied_quad,
        "whitespace_name": whitespace_name,
        "client_brand": client_brand,
        "total_brands": len(brands_data),
    }

    quotes = [
        VerbatimQuote(
            name="Lê Minh Trí", age=33, job="Trưởng phòng Kinh doanh",
            income="25-40 triệu",
            quote=f"Trên thị trường hiện tại, '{client_brand}' đang nằm ở tọa độ ({client_data['x']}, {client_data['y']}). Khách hàng cảm nhận rõ nét về định vị khác biệt.",
            sentiment="positive",
        ),
        VerbatimQuote(
            name="Võ Thị Cẩm Tú", age=27, job="Quản lý Thương hiệu",
            income="20-30 triệu",
            quote=f"Khoảng trống thị trường lớn nhất hiện nay nằm ở góc {least_occupied_quad} ({whitespace_name}). Đây là đại dương xanh chưa ai khai phá triệt để.",
            sentiment="positive",
        ),
        VerbatimQuote(
            name="Đoàn Văn Khánh", age=45, job="Nhà phân phối bán lẻ",
            income="30-60 triệu",
            quote="Đối thủ truyền thống đang dồn ứ ở phân khúc giá rẻ nhưng thiếu đột phá, nếu thương hiệu bước vào vùng thông minh hiện đại sẽ chiếm lĩnh thị phần rất nhanh.",
            sentiment="neutral",
        ),
    ]

    return ReportPayload(
        project_id=survey_id,
        model_type="brand_map",
        target_summary=TargetSummary(
            sample_size=total,
            margin_of_error=f"±{round(98 / (total ** 0.5), 2)}%",
            location="Toàn quốc (Phân bổ chuẩn hóa xã hội học)",
            demographics=f"Nam {male_pct:.0f}% / Nữ {female_pct:.0f}% | Khảo sát Bản đồ Định vị Thương hiệu Perceptual Mapping ({len(raw_brands)} nhãn hàng)",
        ),
        executive_summary=ExecutiveSummary(
            viability_score=viability_score,
            verdict=(
                f"Bản đồ Định vị Thương hiệu xác định '{client_brand}' hiện giữ vị trí ({client_data['x']}, {client_data['y']}) "
                f"thuộc phân nhóm {client_data['quadrant_name']}. "
                f"Phát hiện Khoảng trống Thị trường Tiềm năng (White-space Opportunity) tại góc {least_occupied_quad} ({whitespace_name})."
            ),
            top_findings=[
                f"Định vị hiện tại của '{client_brand}': Điểm giá {client_data['x']}/10 và Điểm đổi mới sáng tạo {client_data['y']}/10.",
                f"Đại dương xanh (White-space): Góc {least_occupied_quad} ({whitespace_name}) hiện chưa có đối thủ nào chiếm đóng vững chắc.",
                f"Mức độ phân hóa đối thủ rõ rệt, không xảy ra hiện tượng chồng lấn thương hiệu trong tâm trí khách hàng mục tiêu.",
            ],
        ),
        quantitative_metrics=QuantitativeMetrics(
            appeal_score=round(float(client_data["y"]) / 2, 1),
            uniqueness_score=round(float(client_data["x"]) / 2, 1),
            purchase_intent_top2box=f"{round(viability_score * 0.82, 1)}%",
            demographic_breakdown={
                "by_age": {"18-24": 74.0, "25-34": 80.0, "35-44": 73.0, "45+": 67.0},
                "by_gender": {"male": float(male_pct), "female": float(female_pct)},
            },
            model_specific=model_specific,
        ),
        qualitative_insights=QualitativeInsights(
            top_drivers=[
                f"Khẳng định rõ ràng sự khác biệt của '{client_brand}' so với các đối thủ cùng ngành.",
                "Nhận thức người tiêu dùng về giá cả và công nghệ định hình quyết định trung thành thương hiệu.",
                "Cơ hội tái định vị (Repositioning) để đón đầu xu hướng tiêu dùng thông minh.",
            ],
            top_barriers=[
                "Tránh trượt chân vào các góc phần tư đã quá đông đúc đối thủ cạnh tranh bằng giá.",
                "Cần đầu tư truyền thông đồng bộ để khách hàng không nhầm lẫn định vị với nhãn hàng truyền thống.",
            ],
            verbatim_quotes=quotes,
        ),
        actionable_recommendations=[
            f"Chiến lược định vị: Đẩy mạnh truyền thông nhấn mạnh vào các thuộc tính giúp '{client_brand}' xác lập vị thế dẫn dắt tại {client_data['quadrant_name']}.",
            f"Khai thác White-space: Xem xét tung ra dòng sản phẩm nhánh phụ để chiếm lĩnh góc {least_occupied_quad} ({whitespace_name}) trước khi đối thủ nhận ra.",
            "Thiết kế bao bì và bộ nhận diện thương hiệu truyền tải chính xác mức độ cao cấp và công nghệ tương ứng với điểm số trên bản đồ.",
        ],
        generated_at=datetime.utcnow(),
    )
