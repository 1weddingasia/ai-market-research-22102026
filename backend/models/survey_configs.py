"""
T1.3: Survey Configs — 5 bộ cấu hình phương pháp luận khảo sát.

Mỗi config định nghĩa:
- Tên gói + mô tả
- Câu hỏi tiêu chuẩn gửi tới AI personas
- Prompt template cho LLM
- Output metrics cần tính toán
- Model type identifier
"""

from typing import Any

SURVEY_CONFIGS: dict[str, dict[str, Any]] = {

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 1: Nielsen BASES — Kiểm định ý tưởng sản phẩm
    # ═══════════════════════════════════════════════════════════════════════════
    "nielsen_bases": {
        "id": "nielsen_bases",
        "name": "Kiểm định Ý tưởng Sản phẩm",
        "short_name": "Concept Testing",
        "framework": "Nielsen BASES",
        "icon": "💡",
        "description": "Đánh giá tiềm năng thương mại của ý tưởng/sản phẩm mới trước khi đầu tư sản xuất.",
        "use_case": "Phù hợp khi bạn có ý tưởng sản phẩm và muốn biết thị trường có đón nhận không.",
        "questions": [
            {
                "id": "q1",
                "label": "Độ liên quan (Relevance)",
                "text": "Ý tưởng này có giải quyết vấn đề có thật trong cuộc sống của bạn không?",
                "type": "scale_1_5",
                "metric": "relevance_score",
            },
            {
                "id": "q2",
                "label": "Độ độc đáo (Uniqueness)",
                "text": "So với những gì đang có trên thị trường, bạn thấy ý tưởng này mới lạ ở mức nào?",
                "type": "scale_1_5",
                "metric": "uniqueness_score",
            },
            {
                "id": "q3",
                "label": "Ý định mua (Purchase Intent)",
                "text": "Với mức giá này, bạn có sẵn sàng chi tiền mua dùng thử không?",
                "type": "scale_1_5",
                "metric": "purchase_intent",
            },
            {
                "id": "q4",
                "label": "Tiếng nói khách hàng",
                "text": "Điều gì khiến bạn do dự nhất khi quyết định mua sản phẩm này?",
                "type": "open_text",
                "metric": "barrier_reason",
            },
        ],
        "output_metrics": [
            "bases_viability_score",
            "bases_matrix_position",
            "top2box_purchase_intent",
            "relevance_score",
            "uniqueness_score",
            "flop_risk_index",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo chuẩn Nielsen BASES. "
            "Đọc kỹ ý tưởng sản phẩm sau và hồ sơ 20 người dùng. "
            "Mỗi người hãy đưa ra phản hồi độc lập dựa trên thu nhập, lối sống và thói quen thực tế của họ. "
            "KHÔNG dùng nhận định chung chung. Hãy cụ thể theo hoàn cảnh từng người."
        ),
        "response_format": {
            "id": "string (persona id)",
            "q1": "int 1-5",
            "q2": "int 1-5",
            "q3": "int 1-5",
            "q4": "string (lý do ngắn gọn, tiếng Việt, chân thực)",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 2: Van Westendorp PSM — Đo độ nhạy cảm về giá
    # ═══════════════════════════════════════════════════════════════════════════
    "van_westendorp": {
        "id": "van_westendorp",
        "name": "Định giá Tối ưu",
        "short_name": "Price Sensitivity",
        "framework": "Van Westendorp PSM",
        "icon": "💰",
        "description": "Tìm mức giá bán tối ưu mang lại doanh thu cao nhất, tránh cắt giá sai chỗ.",
        "use_case": "Phù hợp khi bạn đang lưỡng lự giữa nhiều mức giá và muốn biết thị trường chấp nhận bao nhiêu.",
        "questions": [
            {
                "id": "q1",
                "label": "Giá quá rẻ",
                "text": "Mức giá nào khiến bạn thấy quá rẻ đến mức nghi ngờ về chất lượng?",
                "type": "price_input",
                "metric": "too_cheap_price",
            },
            {
                "id": "q2",
                "label": "Giá hời",
                "text": "Mức giá nào bạn cảm thấy là một món hời (rất đáng tiền để mua ngay)?",
                "type": "price_input",
                "metric": "bargain_price",
            },
            {
                "id": "q3",
                "label": "Bắt đầu đắt",
                "text": "Mức giá nào bắt đầu thấy đắt, nhưng vẫn có thể chấp nhận mua?",
                "type": "price_input",
                "metric": "expensive_price",
            },
            {
                "id": "q4",
                "label": "Quá đắt",
                "text": "Mức giá nào là quá đắt, chắc chắn bạn sẽ bỏ đi không mua?",
                "type": "price_input",
                "metric": "too_expensive_price",
            },
        ],
        "output_metrics": [
            "optimal_price_point",
            "acceptable_price_range",
            "point_of_marginal_cheapness",
            "point_of_marginal_expensiveness",
            "van_westendorp_curves",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo phương pháp Van Westendorp PSM. "
            "Đọc kỹ mô tả sản phẩm/dịch vụ sau và hồ sơ 20 người dùng. "
            "Với mỗi người, hãy đưa ra 4 ngưỡng giá DỰA TRÊN mức thu nhập thực tế của họ. "
            "Người có thu nhập A (>25tr) sẽ có ngưỡng giá khác người có thu nhập C (5-10tr). "
            "Trả về số tiền đơn vị nghìn đồng (VND/1000). VD: 350 nghĩa là 350.000đ."
        ),
        "response_format": {
            "id": "string (persona id)",
            "too_cheap": "int (nghìn đồng)",
            "bargain": "int (nghìn đồng)",
            "expensive": "int (nghìn đồng)",
            "too_expensive": "int (nghìn đồng)",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 3: Kantar Link — A/B Testing bao bì & thông điệp
    # ═══════════════════════════════════════════════════════════════════════════
    "ab_testing": {
        "id": "ab_testing",
        "name": "Thử nghiệm A/B Bao bì & Thông điệp",
        "short_name": "Creative Testing",
        "framework": "Kantar Link",
        "icon": "🎨",
        "description": "So sánh 2 phương án thiết kế, thông điệp hoặc bao bì để chọn ra phương án tối ưu.",
        "use_case": "Phù hợp khi bạn có 2 phương án thiết kế và muốn biết người tiêu dùng thích cái nào hơn.",
        "questions": [
            {
                "id": "q1",
                "label": "Sức hút dừng mắt (Stopping Power)",
                "text": "Phương án nào thu hút sự chú ý của bạn đầu tiên trong 3 giây?",
                "type": "choice_ab",
                "metric": "stopping_power",
            },
            {
                "id": "q2",
                "label": "Cảm xúc thương hiệu",
                "text": "Phương án nào tạo cho bạn cảm giác cao cấp và đáng tin cậy hơn?",
                "type": "choice_ab_with_reason",
                "metric": "brand_trust",
            },
            {
                "id": "q3",
                "label": "Thúc đẩy hành động (Persuasion)",
                "text": "Phương án nào kích thích bạn muốn bấm vào xem chi tiết hoặc mua hơn?",
                "type": "choice_ab",
                "metric": "persuasion_score",
            },
        ],
        "output_metrics": [
            "stopping_power_winner",
            "brand_trust_winner",
            "persuasion_winner",
            "overall_winner",
            "win_rate_by_demographic",
            "qualitative_reasons",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo chuẩn Kantar Link. "
            "Đọc kỹ mô tả 2 phương án A và B. Với mỗi người trong 20 hồ sơ, "
            "hãy chọn dựa trên cảm nhận thẩm mỹ và giá trị phù hợp với nghề nghiệp/lối sống của họ. "
            "Người làm văn phòng thành phố có thể ưu tiên tính hiện đại, "
            "người nội trợ có thể ưu tiên tính quen thuộc và thân thiện."
        ),
        "response_format": {
            "id": "string (persona id)",
            "q1": "\"A\" or \"B\"",
            "q2_choice": "\"A\" or \"B\"",
            "q2_reason": "string (lý do ngắn, tiếng Việt)",
            "q3": "\"A\" or \"B\"",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 4: U&A Study — Khảo sát thói quen & thái độ ngành hàng
    # ═══════════════════════════════════════════════════════════════════════════
    "ua_study": {
        "id": "ua_study",
        "name": "Nghiên cứu Thói quen & Thái độ",
        "short_name": "Usage & Attitudes",
        "framework": "U&A Study",
        "icon": "🔍",
        "description": "Hiểu toàn cảnh thị trường, tìm khoảng trống chưa ai khai thác trong ngành hàng.",
        "use_case": "Phù hợp khi bạn muốn nhập cuộc một ngành mới và cần hiểu đối thủ + nỗi đau của khách hàng.",
        "questions": [
            {
                "id": "q1",
                "label": "Tần suất sử dụng",
                "text": "Bạn sử dụng các sản phẩm/dịch vụ thuộc ngành này bao lâu một lần?",
                "type": "frequency",
                "metric": "usage_frequency",
            },
            {
                "id": "q2",
                "label": "Thương hiệu thống trị",
                "text": "Khi nhắc đến ngành này, thương hiệu đầu tiên xuất hiện trong đầu bạn là gì?",
                "type": "open_text",
                "metric": "top_of_mind_brand",
            },
            {
                "id": "q3",
                "label": "Nỗi đau lớn nhất",
                "text": "Điều gì khiến bạn ức chế hoặc thất vọng nhất ở các dịch vụ hiện có trên thị trường?",
                "type": "open_text",
                "metric": "pain_point",
            },
        ],
        "output_metrics": [
            "usage_frequency_distribution",
            "brand_awareness_ranking",
            "top_pain_points",
            "opportunity_matrix",
            "unmet_needs_map",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo chuẩn U&A Study. "
            "Đọc kỹ ngành hàng cần nghiên cứu. Với mỗi người trong 20 hồ sơ, "
            "hãy trả lời dựa trên thói quen và bối cảnh cuộc sống thực của họ. "
            "Nỗi đau phải cụ thể và chân thực, không dùng câu chung chung như 'chất lượng không tốt'. "
            "Hãy nói rõ đau ở điểm nào: giao hàng chậm, staff thô lỗ, app bị lỗi, hết hàng thường xuyên..."
        ),
        "response_format": {
            "id": "string (persona id)",
            "frequency": "\"daily\" | \"weekly\" | \"monthly\" | \"rarely\"",
            "top_brand": "string (tên thương hiệu)",
            "pain_point": "string (nỗi đau cụ thể, tiếng Việt)",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 5: Deal Elasticity — Khảo sát combo ưu đãi & lễ Tết
    # ═══════════════════════════════════════════════════════════════════════════
    "deal_elasticity": {
        "id": "deal_elasticity",
        "name": "Đánh giá Chương trình Ưu đãi & Combo Tết",
        "short_name": "Deal Testing",
        "framework": "Deal Elasticity Model",
        "icon": "🎁",
        "description": "Đo sức bật của chương trình ưu đãi, tránh cắt giá vô ích mà khách vẫn thờ ơ.",
        "use_case": "Phù hợp khi bạn đang lên kế hoạch khuyến mãi, combo Tết hoặc chương trình loyalty.",
        "questions": [
            {
                "id": "q1",
                "label": "Sức hút chuyển đổi (Switching Trigger)",
                "text": "Ưu đãi này có đủ hấp dẫn để bạn chuyển từ chỗ quen sang trải nghiệm chỗ này không?",
                "type": "scale_1_5",
                "metric": "switching_intent",
            },
            {
                "id": "q2",
                "label": "Giá trị cảm nhận",
                "text": "Bạn thấy quà tặng/giảm giá này có thực chất hay chỉ là nâng giá rồi giảm?",
                "type": "open_text_with_score",
                "metric": "perceived_value",
            },
            {
                "id": "q3",
                "label": "Rào cản áp dụng",
                "text": "Điều kiện áp dụng nào trong chương trình này khiến bạn thấy phiền phức nhất?",
                "type": "open_text",
                "metric": "friction_barrier",
            },
        ],
        "output_metrics": [
            "switching_intent_rate",
            "perceived_value_score",
            "friction_barriers_ranking",
            "deal_effectiveness_index",
            "fomo_trigger_score",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo mô hình Deal Elasticity. "
            "Đọc kỹ chương trình ưu đãi/combo. Với mỗi người trong 20 hồ sơ, "
            "hãy đánh giá theo đúng thói quen tiêu dùng, mức thu nhập và mức độ nhạy cảm về giá của họ. "
            "Người thu nhập thấp (C, D) sẽ quan tâm nhiều hơn đến giá trị tiết kiệm được. "
            "Người thu nhập cao (A, B) sẽ quan tâm đến trải nghiệm và sự tiện lợi hơn là giảm giá."
        ),
        "response_format": {
            "id": "string (persona id)",
            "q1": "int 1-5",
            "q2_score": "int 1-5 (1=chiêu trò, 5=rất thực chất)",
            "q2_reason": "string (lý do ngắn, tiếng Việt)",
            "q3": "string (rào cản cụ thể hoặc 'Không có rào cản')",
        },
    },
}


def get_survey_config(model_type: str) -> dict:
    """Lấy config của một model. Raise ValueError nếu không tồn tại."""
    config = SURVEY_CONFIGS.get(model_type)
    if not config:
        raise ValueError(
            f"Model type '{model_type}' không hợp lệ. "
            f"Chọn 1 trong: {list(SURVEY_CONFIGS.keys())}"
        )
    return config


def get_all_configs_summary() -> list[dict]:
    """Trả về danh sách rút gọn cho API hiển thị trên Step 1."""
    return [
        {
            "id": cfg["id"],
            "name": cfg["name"],
            "short_name": cfg["short_name"],
            "framework": cfg["framework"],
            "icon": cfg["icon"],
            "description": cfg["description"],
            "use_case": cfg["use_case"],
            "questions": cfg["questions"],
        }
        for cfg in SURVEY_CONFIGS.values()
    ]
