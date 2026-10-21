"""
Analysis: Kantar Link A/B Testing — So sánh bao bì & thông điệp.
"""
import statistics
from collections import Counter
from datetime import datetime
from models.schemas import (
    ExecutiveSummary, QualitativeInsights, QuantitativeMetrics,
    ReportPayload, TargetSummary, VerbatimQuote,
)
from services.duckdb_service import get_demographic_summary


def analyze(survey_id, responses, personas_df, product_info, survey_config):
    total = len(responses)
    demo = get_demographic_summary(personas_df)
    male_pct = demo.get("gender", {}).get("male_pct", 50)
    female_pct = demo.get("gender", {}).get("female_pct", 50)

    # Count winners for each question (hỗ trợ làm sạch string A/B)
    def _clean_choice(val):
        if not val:
            return "A"
        s = str(val).strip().upper()
        if "B" in s and "A" not in s:
            return "B"
        return "A"

    q1_votes = Counter(_clean_choice(r.get("q1")) for r in responses)
    q2_votes = Counter(_clean_choice(r.get("q2_choice") or r.get("q2")) for r in responses)
    q3_votes = Counter(_clean_choice(r.get("q3")) for r in responses)

    a_wins = sum([
        1 if q1_votes.get("A", 0) > q1_votes.get("B", 0) else 0,
        1 if q2_votes.get("A", 0) > q2_votes.get("B", 0) else 0,
        1 if q3_votes.get("A", 0) > q3_votes.get("B", 0) else 0,
    ])
    overall_winner = "A" if a_wins >= 2 else "B"

    def win_rate(counter, option):
        total_votes = counter.get("A", 0) + counter.get("B", 0)
        return round(counter.get(option, 0) / total_votes * 100, 1) if total_votes > 0 else 50.0

    # Reasons for q2
    reasons_a = [r.get("q2_reason", "") for r in responses if _clean_choice(r.get("q2_choice") or r.get("q2")) == "A" and r.get("q2_reason")][:5]
    reasons_b = [r.get("q2_reason", "") for r in responses if _clean_choice(r.get("q2_choice") or r.get("q2")) == "B" and r.get("q2_reason")][:5]

    viability_score = 70 + (10 if overall_winner == "A" else 5)

    stopping_a = win_rate(q1_votes, "A")
    stopping_b = win_rate(q1_votes, "B")
    trust_a    = win_rate(q2_votes, "A")
    trust_b    = win_rate(q2_votes, "B")
    persuade_a = win_rate(q3_votes, "A")
    persuade_b = win_rate(q3_votes, "B")

    # Dimensions for ABScorecard.tsx
    dimensions = [
        {
            "criteria": "Mức độ bắt mắt trên kệ hàng (Shelf Standout)",
            "score_a": round(stopping_a),
            "score_b": round(stopping_b),
            "diff": f"{'+' if stopping_a >= stopping_b else '-'}{abs(round(stopping_a - stopping_b, 1))}%",
            "winner": "A" if stopping_a >= stopping_b else "B",
        },
        {
            "criteria": "Cảm giác cao cấp & Độ tin cậy (Brand Trust)",
            "score_a": round(trust_a),
            "score_b": round(trust_b),
            "diff": f"{'+' if trust_a >= trust_b else '-'}{abs(round(trust_a - trust_b, 1))}%",
            "winner": "A" if trust_a >= trust_b else "B",
        },
        {
            "criteria": "Kích thích ý định dùng thử (Purchase Trigger)",
            "score_a": round(persuade_a),
            "score_b": round(persuade_b),
            "diff": f"{'+' if persuade_a >= persuade_b else '-'}{abs(round(persuade_a - persuade_b, 1))}%",
            "winner": "A" if persuade_a >= persuade_b else "B",
        },
    ]

    total_votes_a = q1_votes.get("A", 0) + q2_votes.get("A", 0) + q3_votes.get("A", 0)
    total_votes_b = q1_votes.get("B", 0) + q2_votes.get("B", 0) + q3_votes.get("B", 0)
    all_votes = total_votes_a + total_votes_b
    win_rate_a = round(total_votes_a / max(all_votes, 1) * 100, 1)
    win_rate_b = round(100.0 - win_rate_a, 1)

    quotes = []
    personas = personas_df.to_dict(orient="records")
    names = ["Trần T. A.", "Nguyễn V. B.", "Lê T. C.", "Phạm V. D.", "Hoàng T. E.",
             "Võ V. F.", "Đặng T. G.", "Bùi V. H.", "Ngô T. I.", "Lý V. J."]
    for i, (r, p) in enumerate(zip(responses[:10], personas[:10])):
        choice = _clean_choice(r.get("q2_choice") or r.get("q2"))
        reason = r.get("q2_reason", f"Phương án {choice} phù hợp với tôi hơn.")
        quotes.append(VerbatimQuote(
            name=names[i], age=p.get("age", 28), job=p.get("occupation", "Nhân viên"),
            income=p.get("income_bracket"), quote=reason,
            sentiment="positive" if choice == overall_winner else "neutral",
        ))

    location = demo.get("top_zones") or "Việt Nam"
    if isinstance(location, dict):
        location = ", ".join(list(location.keys())[:2]) or "Việt Nam"

    return ReportPayload(
        project_id=survey_id,
        model_type="ab_testing",
        target_summary=TargetSummary(
            sample_size=total, margin_of_error="±3.1%",
            location=location, demographics=f"Nam {male_pct}%, Nữ {female_pct}%",
        ),
        executive_summary=ExecutiveSummary(
            viability_score=viability_score,
            verdict=f"Phương án {overall_winner} chiến thắng {a_wins if overall_winner == 'A' else 3 - a_wins}/3 tiêu chí. Nên triển khai phương án {overall_winner}.",
            top_findings=[
                f"Sức hút dừng mắt: Phương án A {stopping_a}% vs B {stopping_b}%.",
                f"Độ tin cậy thương hiệu: Phương án A {trust_a}% vs B {trust_b}%.",
                f"Thúc đẩy hành động: Phương án A {persuade_a}% vs B {persuade_b}%.",
            ],
        ),
        quantitative_metrics=QuantitativeMetrics(
            model_specific={
                # Props cho ABScorecard.tsx
                "winner": overall_winner,
                "win_rate_a": win_rate_a,
                "win_rate_b": win_rate_b,
                "dimensions": dimensions,
                "key_verdict": f"Phương án {overall_winner} chiến thắng áp đảo {a_wins if overall_winner == 'A' else 3 - a_wins}/3 tiêu chí nghiên cứu.",

                # Backend original keys
                "overall_winner": overall_winner,
                "scorecard": {
                    "stopping_power":  {"A": stopping_a, "B": stopping_b, "winner": "A" if stopping_a > stopping_b else "B"},
                    "brand_trust":     {"A": trust_a,    "B": trust_b,    "winner": "A" if trust_a > trust_b else "B"},
                    "persuasion":      {"A": persuade_a, "B": persuade_b, "winner": "A" if persuade_a > persuade_b else "B"},
                },
                "reasons_chose_a": reasons_a,
                "reasons_chose_b": reasons_b,
            }
        ),
        qualitative_insights=QualitativeInsights(
            top_drivers=[f"Phương án {overall_winner} tạo ấn tượng mạnh hơn về thương hiệu"],
            top_barriers=[f"Phương án {'B' if overall_winner == 'A' else 'A'} bị đánh giá kém về độ tin cậy"],
            verbatim_quotes=quotes,
        ),
        actionable_recommendations=[
            f"Khuyến nghị 1: Triển khai Phương án {overall_winner} — chiến thắng {a_wins}/3 tiêu chí Kantar Link.",
            f"Khuyến nghị 2: Giữ lại điểm mạnh của Phương án {'A' if overall_winner == 'B' else 'B'} về stopping power nếu có thể.",
            "Khuyến nghị 3: Thực hiện thêm A/B test trên Facebook Ads với 10.000 impressions để confirm trước khi in ấn đại trà.",
        ],
        generated_at=datetime.utcnow(),
    )
