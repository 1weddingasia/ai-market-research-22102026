"""
T1.3: Survey Configs — 5 bộ cấu hình phương pháp luận khảo sát.

Mỗi config định nghĩa:
- Tên gói + mô tả
- Câu hỏi tiêu chuẩn gửi tới AI personas
- Prompt template cho LLM
- Output metrics cần tính toán
- Model type identifier
"""

SURVEY_CONFIGS: dict[str, dict[str, Any]] = {
    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 1: Nielsen BASES — Kiểm định ý tưởng sản phẩm mới
    # ═══════════════════════════════════════════════════════════════════════════
    "nielsen_bases": {
        "id": "nielsen_bases",
        "name": "Kiểm định Ý tưởng Sản phẩm Mới",
        "short_name": "Concept Testing",
        "framework": "Nielsen BASES",
        "icon": "💡",
        "description": "Đánh giá khả năng sống sót và tiềm năng thương mại của ý tưởng sản phẩm mới trước khi đầu tư.",
        "use_case": "Khách hàng có muốn mua sản phẩm mới này không? Ý tưởng này có khả năng sống sót ngoài thị trường không?",
        "questions": [
            {
                "id": "q1",
                "label": "Ý định mua (Purchase Intent)",
                "text": "Trên thang đo 5 điểm, mức độ sẵn sàng mua sản phẩm này của bạn là gì? (1: Chắc chắn không mua, 2: Có thể không, 3: Lưỡng lự, 4: Có thể mua, 5: Chắc chắn mua)",
                "type": "scale_1_5",
                "metric": "purchase_intent",
            },
            {
                "id": "q2",
                "label": "Mức độ độc đáo (Uniqueness)",
                "text": "Sản phẩm này mới lạ và khác biệt thế nào so với những thứ bạn đang dùng? (Thang 1 đến 5)",
                "type": "scale_1_5",
                "metric": "uniqueness_score",
            },
            {
                "id": "q3",
                "label": "Mức độ liên quan (Relevance)",
                "text": "Sản phẩm có giải quyết đúng vấn đề cấp thiết của bạn không? (Thang 1 đến 5)",
                "type": "scale_1_5",
                "metric": "relevance_score",
            },
            {
                "id": "q4",
                "label": "Độ đáng giá (Value for Money)",
                "text": "Với mức giá này, sản phẩm là đắt, rẻ hay hợp lý?",
                "type": "choice_value",
                "metric": "value_for_money",
            },
            {
                "id": "q5",
                "label": "Phản hồi định tính & Rào cản",
                "text": "Điều gì khiến bạn thích nhất? Rào cản lớn nhất ngăn bạn mua là gì?",
                "type": "open_text",
                "metric": "barrier_reason",
            },
        ],
        "output_metrics": [
            "top2box_purchase_intent",
            "bases_matrix_position",
            "trial_rate_forecast",
            "barrier_map",
            "bases_viability_score",
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
            "q1": "int 1-5 (1: Chắc chắn không mua -> 5: Chắc chắn mua)",
            "q2": "int 1-5 (1: Bình thường -> 5: Rất mới lạ độc đáo)",
            "q3": "int 1-5 (1: Không liên quan -> 5: Rất cấp thiết)",
            "q4": "\"Đắt\" | \"Hợp lý\" | \"Rẻ\"",
            "q5": "string (lý do thích nhất và rào cản ngăn mua, tiếng Việt)",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 2: Van Westendorp PSM — Khảo sát độ nhạy cảm về giá
    # ═══════════════════════════════════════════════════════════════════════════
    "van_westendorp": {
        "id": "van_westendorp",
        "name": "Khảo Sát Độ Nhạy Cảm Về Giá",
        "short_name": "Price Sensitivity",
        "framework": "Van Westendorp PSM",
        "icon": "💰",
        "description": "Bán giá bao nhiêu là chuẩn nhất? Khách hàng bắt đầu chê đắt ở mức nào và nghi ngờ chất lượng ở mức nào?",
        "use_case": "Tìm điểm giá tối ưu OPP, điểm hòa nhập IDP và khoảng giá thị trường chấp nhận được RAP.",
        "questions": [
            {
                "id": "q1",
                "label": "Quá rẻ (Too Cheap)",
                "text": "Mức giá nào khiến bạn cảm thấy sản phẩm này rẻ đến mức nghi ngờ về chất lượng và không dám mua?",
                "type": "price_input",
                "metric": "too_cheap_price",
            },
            {
                "id": "q2",
                "label": "Món hời / Hợp lý (Bargain / Cheap)",
                "text": "Mức giá nào bạn cảm thấy là một món hời, bỏ tiền mua ngay mà không cần đắn đo?",
                "type": "price_input",
                "metric": "bargain_price",
            },
            {
                "id": "q3",
                "label": "Bắt đầu đắt (Expensive)",
                "text": "Mức giá nào bắt đầu đắt, bạn vẫn có thể mua nhưng phải cân nhắc suy nghĩ kỹ?",
                "type": "price_input",
                "metric": "expensive_price",
            },
            {
                "id": "q4",
                "label": "Quá đắt (Too Expensive)",
                "text": "Mức giá nào vượt quá khả năng chi trả của bạn, đắt đến mức bạn bỏ đi không mua?",
                "type": "price_input",
                "metric": "too_expensive_price",
            },
        ],
        "output_metrics": [
            "van_westendorp_curves",
            "optimal_price_point",
            "indifference_price_point",
            "acceptable_price_range",
            "point_of_marginal_cheapness",
            "point_of_marginal_expensiveness",
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
    # GÓI 3: Kantar A/B Testing — So sánh đối đầu 2 phương án
    # ═══════════════════════════════════════════════════════════════════════════
    "ab_testing": {
        "id": "ab_testing",
        "name": "So Sánh Đối Đầu 2 Phương Án (A/B Testing)",
        "short_name": "Creative Testing",
        "framework": "Kantar Link",
        "icon": "🎨",
        "description": "Giữa 2 mẫu bao bì, 2 câu slogan hoặc 2 concept sản phẩm thì phương án nào có tỷ lệ chuyển đổi cao hơn?",
        "use_case": "So sánh tỷ lệ chiến thắng Win Rate, phân rã theo nhân khẩu học và phân tích ưu nhược điểm đối đầu.",
        "questions": [
            {
                "id": "q1",
                "label": "Lựa chọn trực diện",
                "text": "Giữa A và B, bạn sẽ chọn mua sản phẩm nào khi đứng trước quầy kệ?",
                "type": "choice_ab",
                "metric": "direct_choice",
            },
            {
                "id": "q2",
                "label": "Động lực lựa chọn",
                "text": "Yếu tố quyết định nào khiến bạn chọn phương án này thay vì phương án kia? (Bao bì bắt mắt hơn, cảm giác cao cấp hơn, thông điệp dễ hiểu hơn...)",
                "type": "choice_reason",
                "metric": "choice_driver",
            },
            {
                "id": "q3",
                "label": "Đánh giá thuộc tính",
                "text": "Chấm điểm từng phương án theo các tiêu chí: Thẩm mỹ, Độ tin cậy, Cảm giác hiện đại, Dễ nhớ.",
                "type": "attribute_scorecard",
                "metric": "attribute_ratings",
            },
        ],
        "output_metrics": [
            "win_rate_percentage",
            "demographic_breakdown",
            "head_to_head_pros_cons",
            "attribute_scorecard",
            "overall_winner",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo chuẩn Kantar Link A/B Testing. "
            "Đọc kỹ mô tả 2 phương án A và B và bối cảnh so sánh. Với mỗi người trong 20 hồ sơ, "
            "hãy chọn mua giữa A hoặc B khi đứng trước quầy kệ, giải thích động lực lựa chọn và chấm điểm thuộc tính."
        ),
        "response_format": {
            "id": "string (persona id)",
            "q1": "\"A\" or \"B\"",
            "q2_choice": "\"A\" or \"B\"",
            "q2_reason": "string (yếu tố quyết định chọn phương án này)",
            "q3_a_score": "int 1-5 (điểm tổng thể phương án A)",
            "q3_b_score": "int 1-5 (điểm tổng thể phương án B)",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 4: U&A Study — Thói quen & Thái độ tiêu dùng (Usage & Attitude)
    # ═══════════════════════════════════════════════════════════════════════════
    "ua_study": {
        "id": "ua_study",
        "name": "Nghiên cứu Thói quen & Thái độ (U&A Study)",
        "short_name": "Usage & Attitudes",
        "framework": "U&A Study",
        "icon": "🔍",
        "description": "Khách hàng đang dùng những sản phẩm gì trong ngành hàng này? Họ mua ở đâu, dùng khi nào và đang bức xúc điều gì chưa được giải quyết?",
        "use_case": "Biểu đồ phễu hành vi, bản đồ dịp sử dụng, bảng xếp hạng tiêu chí mua hàng và khoảng trống thị trường.",
        "questions": [
            {
                "id": "q1",
                "label": "Tần suất sử dụng (Usage Frequency)",
                "text": "Bạn dùng sản phẩm trong ngành này bao lâu một lần? (Hàng ngày, 2-3 lần/tuần, hàng tháng...)",
                "type": "frequency",
                "metric": "usage_frequency",
            },
            {
                "id": "q2",
                "label": "Dịp sử dụng (Occasions)",
                "text": "Bạn thường sử dụng vào thời điểm hoặc hoàn cảnh nào? (Buổi sáng đi làm, khi gặp bạn bè, lúc thư giãn buổi tối...)",
                "type": "open_text",
                "metric": "consumption_occasions",
            },
            {
                "id": "q3",
                "label": "Kênh mua sắm (Purchase Channels)",
                "text": "Bạn chủ yếu mua sản phẩm này ở đâu? (Siêu thị, cửa hàng tiện lợi, sàn Shopee/TikTok Shop...)",
                "type": "open_text",
                "metric": "purchase_channels",
            },
            {
                "id": "q4",
                "label": "Tiêu chí ưu tiên (Key Purchase Drivers)",
                "text": "3 yếu tố quan trọng nhất khi bạn chọn một thương hiệu trong ngành này là gì?",
                "type": "open_text",
                "metric": "key_purchase_drivers",
            },
            {
                "id": "q5",
                "label": "Nỗi đau chưa được giải quyết (Unmet Needs)",
                "text": "Điều gì ở các sản phẩm hiện có trên thị trường khiến bạn khó chịu hoặc thất vọng nhất?",
                "type": "open_text",
                "metric": "unmet_needs",
            },
        ],
        "output_metrics": [
            "consumer_funnel",
            "occasion_map",
            "key_purchase_drivers_ranking",
            "market_whitespace_unmet_needs",
            "opportunity_matrix",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo chuẩn U&A Study (Usage & Attitude). "
            "Đọc kỹ ngành hàng và đối tượng mục tiêu. Với mỗi người trong 20 hồ sơ, "
            "hãy trả lời cụ thể về tần suất sử dụng, dịp tiêu dùng, kênh mua sắm, tiêu chí chọn mua và nỗi đau chưa được giải quyết."
        ),
        "response_format": {
            "id": "string (persona id)",
            "frequency": "\"Hàng ngày\" | \"2-3 lần/tuần\" | \"Hàng tháng\" | \"Hiếm khi\"",
            "occasion": "string (dịp sử dụng chính)",
            "channel": "string (kênh mua sắm chủ yếu)",
            "top_drivers": "string (3 yếu tố quan trọng nhất)",
            "pain_point": "string (nỗi đau hoặc thất vọng lớn nhất)",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 5: Deal Elasticity — Độ co giãn khuyến mãi
    # ═══════════════════════════════════════════════════════════════════════════
    "deal_elasticity": {
        "id": "deal_elasticity",
        "name": "Đo Lường Độ Co Giãn Khuyến Mãi (Deal Elasticity)",
        "short_name": "Deal Testing",
        "framework": "Deal Elasticity Model",
        "icon": "🎁",
        "description": "Nên tung chương trình khuyến mãi nào để bùng nổ doanh số mà không bị lỗ và không làm mất giá trị thương hiệu?",
        "use_case": "Đường cong co giãn khuyến mãi (Volume Lift), điểm bùng nổ tối ưu (Sweet Spot) và chỉ số rủi ro thương hiệu.",
        "questions": [
            {
                "id": "q1",
                "label": "Phản ứng với giá gốc",
                "text": "Với giá niêm yết ban đầu, bạn có sẵn sàng mua không?",
                "type": "scale_1_5",
                "metric": "original_price_intent",
            },
            {
                "id": "q2",
                "label": "Độ kích thích của từng deal",
                "text": "Với từng mức ưu đãi (Deal 1, Deal 2, Deal 3), mức độ thôi thúc bạn chốt đơn ngay lập tức thay đổi như thế nào?",
                "type": "scale_1_5",
                "metric": "deal_stimulus",
            },
            {
                "id": "q3",
                "label": "Nhận thức giá trị thương hiệu",
                "text": "Chương trình giảm giá sâu này có khiến bạn cảm thấy sản phẩm bị mất giá, sắp hết hạn hay kém chất lượng không?",
                "type": "brand_equity_assessment",
                "metric": "brand_equity_risk",
            },
        ],
        "output_metrics": [
            "deal_elasticity_curve",
            "sweet_spot_promotion",
            "brand_equity_risk_index",
            "volume_lift_forecast",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo mô hình Deal Elasticity. "
            "Đọc kỹ mức giá gốc và các kịch bản khuyến mãi. Với mỗi người trong 20 hồ sơ, "
            "hãy đánh giá mức độ sẵn sàng mua ở giá gốc, độ kích thích chốt đơn ở từng deal và nhận thức về giá trị thương hiệu."
        ),
        "response_format": {
            "id": "string (persona id)",
            "q1_original_intent": "int 1-5 (1: Chắc chắn không mua -> 5: Chắc chắn mua)",
            "q2_deal_stimulus": "int 1-5 (1: Không kích thích -> 5: Chốt đơn ngay)",
            "q3_brand_risk": "int 1-5 (1: Không ảnh hưởng uy tín -> 5: Nghi ngờ hàng kém chất lượng)",
            "reason": "string (nhận xét về chương trình ưu đãi, tiếng Việt)",
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
