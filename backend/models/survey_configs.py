# -*- coding: utf-8 -*-
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
                "label": "Lực hấp dẫn thị giác & Nổi bật trên kệ hàng",
                "text": "Phương án nào bắt mắt, thu hút ánh nhìn và nổi bật hơn khi đặt cạnh các đối thủ trên kệ trưng bày?",
                "type": "choice_ab",
                "metric": "visual_stopping_power",
            },
            {
                "id": "q3",
                "label": "Cảm nhận chất lượng & Độ tin cậy",
                "text": "Phương án nào mang lại cảm giác cao cấp, chỉn chu và đáng tin cậy hơn cho bạn?",
                "type": "choice_ab",
                "metric": "brand_trust",
            },
            {
                "id": "q4",
                "label": "Động lực cốt lõi thúc đẩy lựa chọn",
                "text": "Yếu tố quyết định nào khiến bạn chọn phương án này thay vì phương án kia? (Bao bì, thông điệp, màu sắc, hay tính thực dụng?)",
                "type": "choice_reason",
                "metric": "choice_driver",
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
            {
                "id": "q4",
                "label": "Chuyển đổi thương hiệu (Brand Switching)",
                "text": "Nếu đang dùng quen một thương hiệu khác, mức ưu đãi này có đủ lớn để bạn sẵn sàng chuyển sang dùng thử sản phẩm này không?",
                "type": "scale_1_5",
                "metric": "brand_switching_rate",
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

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 6: Monadic Concept Testing — Thử nghiệm ý tưởng độc lập (Split-Sample)
    # ═══════════════════════════════════════════════════════════════════════════
    "monadic": {
        "id": "monadic",
        "name": "Thử Nghiệm Ý Tưởng Độc Lập (Monadic Testing)",
        "short_name": "Monadic Concept",
        "framework": "Monadic Testing",
        "icon": "🧪",
        "description": "Chia tách mẫu độc lập (Split-Sample) để đánh giá 2 concept sản phẩm hoàn toàn khách quan, tránh thiên vị so sánh trực tiếp.",
        "use_case": "Mỗi nhóm người tiêu dùng chỉ nhìn thấy duy nhất 1 phương án (A hoặc B). Đo lường tỷ lệ mua thử độc lập và chênh lệch Lift %.",
        "questions": [
            {
                "id": "q1",
                "label": "Ý định mua (Purchase Intent)",
                "text": "Trên thang đo 5 điểm, mức độ sẵn sàng mua sản phẩm này của bạn là gì? (1: Chắc chắn không mua -> 5: Chắc chắn mua)",
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
                "label": "Động lực & Rào cản",
                "text": "Điều gì khiến bạn thích nhất và rào cản ngăn bạn chọn mua?",
                "type": "open_text",
                "metric": "barrier_reason",
            },
        ],
        "output_metrics": [
            "top2box_concept_a",
            "top2box_concept_b",
            "lift_percentage",
            "uniqueness_comparison",
            "value_for_money_comparison",
            "winner_concept",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo phương pháp Monadic Testing. "
            "Mỗi persona chỉ được xem duy nhất concept được giao (Concept A hoặc Concept B) và không biết sự tồn tại của concept kia. "
            "Hãy đánh giá chân thực theo thu nhập, lối sống và thói quen thực tế của hồ sơ người dùng."
        ),
        "response_format": {
            "id": "string (persona id)",
            "concept_assigned": "\"A\" or \"B\"",
            "q1_intent": "int 1-5 (1: Chắc chắn không mua -> 5: Chắc chắn mua)",
            "q2_uniqueness": "int 1-5 (1: Bình thường -> 5: Rất mới lạ độc đáo)",
            "q3_relevance": "int 1-5 (1: Không liên quan -> 5: Rất cấp thiết)",
            "q4_value": "\"Đắt\" | \"Hợp lý\" | \"Rẻ\"",
            "q5_reason": "string (lý do cụ thể)",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 7: MaxDiff — Xếp hạng thuộc tính Best-Worst Scaling
    # ═══════════════════════════════════════════════════════════════════════════
    "maxdiff": {
        "id": "maxdiff",
        "name": "Xếp Hạng Thuộc Tính & Thông Điệp (MaxDiff)",
        "short_name": "MaxDiff Scaling",
        "framework": "Best-Worst Scaling",
        "icon": "⚡",
        "description": "Xếp hạng mức độ ưu tiên của 6-10 tính năng hoặc thông điệp bán hàng (Claims) mà không bị hiện tượng đánh giá đồng đều 5 sao.",
        "use_case": "Tìm ra tính năng cốt lõi bắt buộc phải có, thông điệp truyền thông tạo đột phá và những tính năng khách hàng hoàn toàn thờ ơ.",
        "questions": [
            {
                "id": "q1",
                "label": "Thuộc tính Thích Nhất (Best)",
                "text": "Trong 4 thuộc tính hiển thị, yếu tố nào bạn THÍCH NHẤT hoặc quan trọng nhất với bạn?",
                "type": "best_attribute",
                "metric": "best_choice",
            },
            {
                "id": "q2",
                "label": "Thuộc tính Ít Quan Tâm Nhất (Worst)",
                "text": "Trong 4 thuộc tính hiển thị, yếu tố nào bạn ÍT QUAN TÂM NHẤT hoặc kém hấp dẫn nhất?",
                "type": "worst_attribute",
                "metric": "worst_choice",
            },
            {
                "id": "q3",
                "label": "Tác động tới quyết định chi tiền",
                "text": "Sự hiện diện của thuộc tính quan trọng nhất có đủ sức khiến bạn quyết định chi tiền mua sản phẩm này ngay không?",
                "type": "scale_1_5",
                "metric": "purchase_intent_impact",
            },
            {
                "id": "q4",
                "label": "Lý do lựa chọn & Góp ý thực địa",
                "text": "Tại sao yếu tố bạn chọn lại là quan trọng nhất và yếu tố nào hoàn toàn dư thừa đối với bạn?",
                "type": "open_text",
                "metric": "driver_reason",
            },
        ],
        "output_metrics": [
            "maxdiff_scores",
            "attribute_rankings",
            "must_have_claims",
            "low_priority_claims",
            "utility_spread",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo phương pháp MaxDiff (Best-Worst Scaling). "
            "Với mỗi nhóm 4 thuộc tính ngẫu nhiên, hãy chọn ra đúng 1 yếu tố THÍCH NHẤT (Best) và đúng 1 yếu tố ÍT QUAN TÂM NHẤT (Worst)."
        ),
        "response_format": {
            "id": "string (persona id)",
            "shown_attributes": ["attr1", "attr2", "attr3", "attr4"],
            "best": "string (tên thuộc tính thích nhất)",
            "worst": "string (tên thuộc tính ít quan tâm nhất)",
            "reason": "string (lý do chọn)",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 8: Kano Model — Phân loại tính năng cho đội ngũ R&D
    # ═══════════════════════════════════════════════════════════════════════════
    "kano": {
        "id": "kano",
        "name": "Phân Loại Tính Năng R&D (Kano Model)",
        "short_name": "Kano Prioritization",
        "framework": "Kano Model",
        "icon": "🎯",
        "description": "Phân loại tính năng thành Bắt buộc (Must-be), Càng nhiều càng tốt (One-dimensional) và Bất ngờ thú vị (Attractive) để tối ưu chi phí phát triển.",
        "use_case": "Định hướng lộ trình tính năng (Product Roadmap) cho đội ngũ kỹ thuật và R&D dựa trên mức độ thỏa mãn và bất mãn của khách hàng.",
        "questions": [
            {
                "id": "q1",
                "label": "Câu hỏi Chức năng (Functional)",
                "text": "Nếu sản phẩm CÓ tính năng này, bạn cảm thấy thế nào? (1: Thích, 2: Mặc nhiên phải có, 3: Bình thường, 4: Chấp nhận được, 5: Không thích)",
                "type": "kano_scale",
                "metric": "functional_score",
            },
            {
                "id": "q2",
                "label": "Câu hỏi Phi chức năng (Dysfunctional)",
                "text": "Nếu sản phẩm KHÔNG CÓ tính năng này, bạn cảm thấy thế nào? (1: Thích, 2: Mặc nhiên phải có, 3: Bình thường, 4: Chấp nhận được, 5: Không thích)",
                "type": "kano_scale",
                "metric": "dysfunctional_score",
            },
            {
                "id": "q3",
                "label": "Mức độ ảnh hưởng quyết định chọn mua",
                "text": "Tính năng này đóng vai trò quan trọng ở mức nào khi bạn cân nhắc mua sản phẩm? (Thang 1 đến 5)",
                "type": "scale_1_5",
                "metric": "importance_rating",
            },
            {
                "id": "q4",
                "label": "Kỳ vọng hoàn thiện từ người dùng",
                "text": "Bạn mong muốn tính năng này được thiết kế hoặc cải tiến thế nào để mang lại trải nghiệm tốt nhất?",
                "type": "open_text",
                "metric": "feature_feedback",
            },
        ],
        "output_metrics": [
            "kano_grid_coordinates",
            "satisfaction_index_better",
            "dissatisfaction_index_worse",
            "feature_classifications",
            "rd_priority_order",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng hành vi người tiêu dùng Việt Nam theo phương pháp Kano. "
            "Với mỗi tính năng, hãy trả lời trung thực cả 2 câu hỏi: khi CÓ tính năng và khi KHÔNG CÓ tính năng."
        ),
        "response_format": {
            "id": "string (persona id)",
            "features_evaluation": [
                {
                    "feature": "string (tên tính năng)",
                    "functional": "int 1-5 (1: Thích, 2: Mặc nhiên, 3: Bình thường, 4: Chấp nhận, 5: Không thích)",
                    "dysfunctional": "int 1-5 (1: Thích, 2: Mặc nhiên, 3: Bình thường, 4: Chấp nhận, 5: Không thích)",
                }
            ],
            "reason": "string (đánh giá tổng quan về bộ tính năng)",
        },
    },

    # ═══════════════════════════════════════════════════════════════════════════
    # GÓI 9: Brand Perceptual Mapping — Bản đồ định vị thương hiệu
    # ═══════════════════════════════════════════════════════════════════════════
    "brand_map": {
        "id": "brand_map",
        "name": "Bản Đồ Định Vị Thương Hiệu (Perceptual Map)",
        "short_name": "Perceptual Mapping",
        "framework": "Brand Perceptual Map",
        "icon": "🗺️",
        "description": "Định vị thương hiệu của bạn và đối thủ cạnh tranh trên không gian 2 chiều để phát hiện khoảng trống thị trường (White-space Opportunity).",
        "use_case": "Biết rõ thương hiệu của mình đang đứng ở đâu trong tâm trí khách hàng về Giá cả và Đột phá sáng tạo, tìm đại dương xanh.",
        "questions": [
            {
                "id": "q1",
                "label": "Điểm nhận thức Trục X (Phân khúc giá)",
                "text": "Chấm điểm từ 1 đến 10 cho thương hiệu về mức giá (1: Siêu bình dân/Rẻ -> 10: Siêu cao cấp/Sang trọng).",
                "type": "scale_1_10",
                "metric": "axis_x_score",
            },
            {
                "id": "q2",
                "label": "Điểm nhận thức Trục Y (Đổi mới sáng tạo)",
                "text": "Chấm điểm từ 1 đến 10 cho thương hiệu về độ đổi mới sáng tạo (1: Rất truyền thống/Cũ kỹ -> 10: Rất đột phá/Hiện đại).",
                "type": "scale_1_10",
                "metric": "axis_y_score",
            },
            {
                "id": "q3",
                "label": "Mức độ liên tưởng thương hiệu",
                "text": "Thương hiệu nào trong phân khúc này tạo ấn tượng sâu đậm nhất với bạn và vì sao?",
                "type": "open_text",
                "metric": "brand_preference",
            },
            {
                "id": "q4",
                "label": "Khoảng trống thị trường chưa ai chiếm giữ",
                "text": "Bạn cảm thấy thị trường hiện tại đang thiếu vắng dòng sản phẩm/dịch vụ như thế nào?",
                "type": "open_text",
                "metric": "whitespace_need",
            },
        ],
        "output_metrics": [
            "brand_coordinates",
            "whitespace_quadrants",
            "quadrant_analysis",
            "competitive_clustering",
            "repositioning_strategy",
        ],
        "llm_instruction": (
            "Bạn là bộ máy mô phỏng nhận thức thương hiệu của người tiêu dùng Việt Nam. "
            "Với danh sách thương hiệu được cung cấp, hãy chấm điểm khách quan từ 1 đến 10 trên Trục X và Trục Y."
        ),
        "response_format": {
            "id": "string (persona id)",
            "ratings": [
                {
                    "brand": "string (tên thương hiệu)",
                    "score_x": "float 1.0-10.0",
                    "score_y": "float 1.0-10.0",
                }
            ],
            "brand_preference": "string (thương hiệu ấn tượng nhất và lý do)",
        },
    },
}


def get_survey_config(model_type: str) -> dict:
    # Lấy config của một model. Raise ValueError nếu không tồn tại.
    config = SURVEY_CONFIGS.get(model_type)
    if not config:
        raise ValueError(
            f"Model type '{model_type}' khong hop le. "
            f"Chon 1 trong: {list(SURVEY_CONFIGS.keys())}"
        )
    return config


def get_all_configs_summary() -> list[dict]:
    # Trả về danh sách rút gọn cho API hiển thị trên Step 1.
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
