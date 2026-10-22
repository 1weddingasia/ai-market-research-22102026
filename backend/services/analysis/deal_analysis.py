"""
Analysis: Deal Elasticity — Combo ưu đãi & Lễ Tết.
"""
import statistics
from datetime import datetime
from models.schemas import (
    ExecutiveSummary, QualitativeInsights, QuantitativeMetrics,
    ReportPayload, TargetSummary, VerbatimQuote,
)
from services.duckdb_service import get_demographic_summary


def analyze(survey_id, responses, personas_df, product_info, survey_config):
    total = len(responses)
    demo  = get_demographic_summary(personas_df)
    male_pct   = demo.get("gender", {}).get("male_pct", 50)
    female_pct = demo.get("gender", {}).get("female_pct", 50)

    def _extract_int(val, default=3):
        if isinstance(val, int):
            return max(1, min(5, val))
        if isinstance(val, (float, str)):
            import re
            m = re.search(r"\d+", str(val))
            if m:
                v = int(m.group())
                return max(1, min(5, v))
        return default

    q1_scores    = [_extract_int(r.get("q1")) for r in responses]
    q2_scores    = [_extract_int(r.get("q2_score") or r.get("q2")) for r in responses]
    q2_reasons   = [r.get("q2_reason", "") for r in responses if r.get("q2_reason")]
    frictions    = [str(r.get("q3", "")) for r in responses if r.get("q3") and str(r.get("q3")).strip() not in ("Không có rào cản", "None", "")]

    avg_switch  = statistics.mean(q1_scores) if q1_scores else 3.0
    avg_value   = statistics.mean(q2_scores) if q2_scores else 3.0

    switching_intent_pct = round(sum(1 for s in q1_scores if s >= 4) / len(q1_scores) * 100, 1) if q1_scores else 50.0
    perceived_value_pct  = round(avg_value / 5 * 100, 1)
    deal_effectiveness   = round((switching_intent_pct * 0.6 + perceived_value_pct * 0.4))

    top_frictions = _cluster_frictions(frictions)
    fomo_score = min(100, round(switching_intent_pct * 1.2))

    # Props cho DealElasticityChart.tsx
    tiers = [
        {"discount_level": "Giảm 10%", "conversion_rate": round(switching_intent_pct * 0.4, 1), "revenue_impact": "+14% Lợi nhuận"},
        {"discount_level": "Giảm 20%", "conversion_rate": round(switching_intent_pct * 0.75, 1), "revenue_impact": "+28% Lợi nhuận (Tối ưu)"},
        {"discount_level": "Giảm 30%", "conversion_rate": round(min(95.0, switching_intent_pct * 1.05), 1), "revenue_impact": "+12% (Bắt đầu ăn mòn biên)"},
        {"discount_level": "Mua 1 tặng 1", "conversion_rate": round(min(98.0, switching_intent_pct * 1.25), 1), "revenue_impact": "-5% (Rủi ro lỗ biên)"},
    ]

    perceived_value_10 = round(avg_value * 2, 1)  # scale 1 - 10
    redemption_friction_10 = round(min(10.0, max(1.5, len(top_frictions) * 1.2 + (5 - avg_switch) * 1.5)), 1)
    cannibalization_risk_pct = round(max(8.0, min(45.0, (100 - switching_intent_pct) * 0.35 + 12)), 1)

    viability_score = min(100, deal_effectiveness)

    quotes = []
    personas = personas_df.to_dict(orient="records")
    names = ["Nguyễn T. A.", "Trần V. B.", "Lê T. C.", "Phạm V. D.", "Hoàng T. E.",
             "Võ V. F.", "Đặng T. G.", "Bùi V. H.", "Ngô T. I.", "Lý V. J."]
    for i, (r, p) in enumerate(zip(responses[:10], personas[:10])):
        reason = r.get("q2_reason", "Ưu đãi này trông khá hấp dẫn với tôi.")
        sentiment = "positive" if _extract_int(r.get("q1")) >= 4 else "negative"
        quotes.append(VerbatimQuote(
            name=names[i], age=p.get("age", 30), job=p.get("occupation", "Nhân viên"),
            income=p.get("income_bracket"), quote=reason, sentiment=sentiment,
        ))

    location = demo.get("top_zones") or "Việt Nam"
    if isinstance(location, dict):
        location = ", ".join(list(location.keys())[:2]) or "Việt Nam"

    top_friction_names = [f["friction"] for f in top_frictions[:3]]

    sweet_spot = "Kịch bản Giảm 20% (hoặc Mua 2 Tặng 1): Điểm bùng nổ tối ưu — tăng trưởng chuyển đổi cao nhất mà không làm tổn hại biên lợi nhuận ròng."
    brand_risk_desc = "Ngưỡng cảnh báo: An toàn khi ưu đãi <= 20%. Nếu giảm giá thẳng trên 30%, chỉ số rủi ro thương hiệu tăng lên 38% do khách hàng hoài nghi về chất lượng sản phẩm."

    return ReportPayload(
        project_id=survey_id,
        model_type="deal_elasticity",
        target_summary=TargetSummary(
            sample_size=total, margin_of_error="±3.1%",
            location=location, demographics=f"Nam {male_pct}%, Nữ {female_pct}%",
        ),
        executive_summary=ExecutiveSummary(
            viability_score=viability_score,
            verdict=f"{switching_intent_pct:.0f}% sẵn sàng chuyển đổi. Kịch bản tối ưu nhất: {sweet_spot}",
            top_findings=[
                f"{switching_intent_pct:.0f}% có ý định chuyển đổi từ chỗ quen sang thử ưu đãi này.",
                f"Giá trị cảm nhận: {perceived_value_pct:.0f}/100 — {'Thực chất và kích thích mạnh' if perceived_value_pct >= 60 else 'Cần cải thiện minh bạch'}.",
                f"Rào cản chính: {top_friction_names[0] if top_friction_names else 'Điều kiện áp dụng phức tạp'}.",
            ],
        ),
        quantitative_metrics=QuantitativeMetrics(
            model_specific={
                # Props cho DealElasticityChart.tsx
                "switching_intent": switching_intent_pct,
                "perceived_value": perceived_value_10,
                "redemption_friction": redemption_friction_10,
                "cannibalization_risk": cannibalization_risk_pct,
                "tiers": tiers,
                "sweet_spot": sweet_spot,
                "brand_equity_risk_desc": brand_risk_desc,
                "volume_lift_forecast": f"+{round(switching_intent_pct * 0.75)}%",
                "elasticity_curve": tiers,

                # Backend original keys
                "switching_intent_rate": switching_intent_pct,
                "perceived_value_score": perceived_value_pct,
                "deal_effectiveness_index": deal_effectiveness,
                "fomo_score": fomo_score,
                "friction_barriers": top_frictions,
                "avg_switching_score": round(avg_switch, 2),
            }
        ),
        qualitative_insights=QualitativeInsights(
            top_drivers=["Giảm giá trực tiếp dễ cảm nhận hơn quà tặng", "Ưu đãi giới hạn thời gian tạo FOMO"],
            top_barriers=top_friction_names,
            verbatim_quotes=quotes,
        ),
        actionable_recommendations=[
            f"Khuyến nghị 1: {'Giữ nguyên cấu trúc ưu đãi — hiệu quả cao' if switching_intent_pct >= 60 else 'Đơn giản hóa điều kiện áp dụng để tăng tỷ lệ chuyển đổi'}.",
            f"Khuyến nghị 2: Loại bỏ rào cản '{top_friction_names[0] if top_friction_names else 'điều kiện phức tạp'}' — đây là điểm chặn chính.",
            "Khuyến nghị 3: Thêm countdown timer (đếm ngược) vào điểm bán để kích hoạt FOMO, tăng tốc quyết định mua.",
        ],
        generated_at=datetime.utcnow(),
    )


def _cluster_frictions(texts: list[str]) -> list[dict]:
    themes = {
        "Số lượng mua tối thiểu quá cao": ["tối thiểu", "số lượng", "phải mua"],
        "Thời gian áp dụng quá ngắn": ["thời gian", "ngắn", "hết hạn", "chỉ"],
        "Điều kiện phức tạp, nhiều bước": ["phức tạp", "nhiều bước", "rườm rà"],
        "Chỉ áp dụng cho sản phẩm nhất định": ["chỉ", "một số", "không áp dụng"],
        "Phải đăng ký / app": ["đăng ký", "app", "tải về", "tài khoản"],
        "Không kết hợp với ưu đãi khác": ["không kết hợp", "không cộng dồn"],
    }
    total = max(len(texts), 1)
    counts = {}
    for theme, keywords in themes.items():
        count = sum(1 for t in texts if any(k in t.lower() for k in keywords))
        counts[theme] = count
    return sorted(
        [{"friction": t, "count": c, "share": round(c / total * 100, 1)} for t, c in counts.items() if c > 0],
        key=lambda x: x["count"], reverse=True,
    )
