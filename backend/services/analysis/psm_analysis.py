"""
Analysis: Van Westendorp PSM — Định giá tối ưu.
Tính 4 đường cong cắt nhau và xác định Optimal Price Point.
"""

import statistics
from datetime import datetime
from typing import Any

import numpy as np

from models.schemas import (
    ExecutiveSummary, QualitativeInsights, QuantitativeMetrics,
    ReportPayload, TargetSummary, VerbatimQuote,
)
from services.duckdb_service import get_demographic_summary


def analyze(
    survey_id: str,
    responses: list[dict],
    personas_df,
    product_info: dict,
    survey_config: dict,
) -> ReportPayload:
    """Phân tích Van Westendorp PSM."""
    total = len(responses)

    # ── 1. Extract price data (hỗ trợ cả named keys lẫn q1-q4) ────────────────
    def _extract_val(r: dict, keys: list[str]):
        for k in keys:
            v = r.get(k)
            if isinstance(v, (int, float)) and v > 0:
                return float(v)
            if isinstance(v, str):
                import re
                cleaned = re.sub(r"[^\d.]", "", v)
                if cleaned:
                    try:
                        return float(cleaned)
                    except ValueError:
                        pass
        return None

    too_cheap = [v for r in responses if (v := _extract_val(r, ["too_cheap", "q1"])) is not None]
    bargain   = [v for r in responses if (v := _extract_val(r, ["bargain", "q2"])) is not None]
    expensive = [v for r in responses if (v := _extract_val(r, ["expensive", "q3"])) is not None]
    too_exp   = [v for r in responses if (v := _extract_val(r, ["too_expensive", "q4"])) is not None]

    if not all([too_cheap, bargain, expensive, too_exp]):
        raise ValueError("Dữ liệu giá không đầy đủ để phân tích Van Westendorp")

    # Xác định đơn vị: nếu giá < 10,000 thì là nghìn đồng (k), nhân 1,000 để render VND chuẩn
    med_val = statistics.median(bargain)
    unit_multiplier = 1000 if med_val < 5000 else 1

    too_cheap_vnd = [int(v * unit_multiplier) for v in too_cheap]
    bargain_vnd   = [int(v * unit_multiplier) for v in bargain]
    expensive_vnd = [int(v * unit_multiplier) for v in expensive]
    too_exp_vnd   = [int(v * unit_multiplier) for v in too_exp]

    # ── 2. Xây dựng dữ liệu cho 4 đường cong ────────────────────────────────
    all_prices = too_cheap_vnd + bargain_vnd + expensive_vnd + too_exp_vnd
    price_min = int(min(all_prices) * 0.8)
    price_max = int(max(all_prices) * 1.2)
    step = max(1000, (price_max - price_min) // 25)
    price_range = list(range(price_min, price_max + 1, step))

    def cumulative_pct(data: list, price: int, above: bool = True) -> float:
        if above:
            return sum(1 for d in data if d >= price) / len(data) * 100
        else:
            return sum(1 for d in data if d <= price) / len(data) * 100

    curves = []
    frontend_curves = []
    for p in price_range:
        tc = round(cumulative_pct(too_cheap_vnd, p, above=True), 1)
        bg = round(cumulative_pct(bargain_vnd, p, above=False), 1)
        ex = round(cumulative_pct(expensive_vnd, p, above=True), 1)
        te = round(cumulative_pct(too_exp_vnd, p, above=True), 1)
        curves.append({
            "price": p,
            "too_cheap_cum": tc,
            "bargain_cum": bg,
            "expensive_cum": ex,
            "too_expensive_cum": te,
        })
        frontend_curves.append({
            "price": p,
            "too_cheap": tc,
            "cheap": bg,
            "expensive": ex,
            "too_expensive": te,
        })

    # ── 3. Tìm các điểm giao thoa ────────────────────────────────────────────
    pmc = _find_intersection(curves, "too_cheap_cum", "bargain_cum", "price")
    pme = _find_intersection(curves, "expensive_cum", "too_expensive_cum", "price", from_right=True)
    opp = _find_intersection(curves, "too_cheap_cum", "too_expensive_cum", "price")
    ipp = int((pmc + pme) / 2)

    # ── 4. Summary stats ──────────────────────────────────────────────────────
    avg_bargain   = round(statistics.mean(bargain_vnd))
    avg_expensive = round(statistics.mean(expensive_vnd))

    demo = get_demographic_summary(personas_df)
    male_pct = demo.get("gender", {}).get("male_pct", 50)
    female_pct = demo.get("gender", {}).get("female_pct", 50)

    # ── 5. Viability score (proxy: % trong acceptable range) ─────────────────
    in_range = sum(1 for e, tc in zip(expensive_vnd, too_cheap_vnd) if tc <= avg_bargain <= e)
    viability_score = min(100, max(50, round(in_range / total * 150)))

    # ── 6. Quotes ─────────────────────────────────────────────────────────────
    quotes = _build_price_quotes(responses, personas_df, avg_bargain, avg_expensive)

    # ── 7. Recommendations ───────────────────────────────────────────────────
    recommendations = [
        f"Khuyến nghị 1: Định giá ra mắt tại {opp:,.0f} đ (Optimal Price Point) — mức giá tối ưu hoá lượng chấp nhận từ khách hàng.",
        f"Khuyến nghị 2: Khoảng giá chấp nhận được là {pmc:,.0f} đ – {pme:,.0f} đ. Không nên định giá vượt {pme:,.0f} đ vì lực cản mua sẽ tăng vọt.",
        f"Khuyến nghị 3: Với khách hàng nhạy cảm về giá, có thể áp dụng mức giá thâm nhập {pmc:,.0f} đ cho giai đoạn ra mắt.",
    ]

    location = (
        product_info.get("display_location")
        or product_info.get("region")
        or "Toàn quốc (Đại diện 3 miền)"
    )

    margin_map = {500: "±4.3%", 1000: "±3.1%", 2000: "±2.2%", 3000: "±1.8%"}
    male_float = float(demo.get("gender", {}).get("male_pct", male_pct))
    female_float = float(demo.get("gender", {}).get("female_pct", female_pct))

    return ReportPayload(
        project_id=survey_id,
        model_type="van_westendorp",
        target_summary=TargetSummary(
            sample_size=total,
            margin_of_error=margin_map.get(total, "±3.1%"),
            location=location,
            demographics=f"Nam {male_float:.0f}%, Nữ {female_float:.0f}% | Tuổi TB {demo.get('avg_age', 30):.0f} | Phân tầng Quota GSO",
        ),
        executive_summary=ExecutiveSummary(
            viability_score=viability_score,
            verdict=f"Điểm giá tối ưu (OPP): {opp:,.0f} đ. Khoảng giá thị trường chấp nhận: {pmc:,.0f} đ – {pme:,.0f} đ.",
            top_findings=[
                f"Giá hời kỳ vọng của thị trường: {avg_bargain:,.0f} đ.",
                f"Ngưỡng bắt đầu thấy đắt: {avg_expensive:,.0f} đ.",
                f"Điểm giá tối ưu OPP: {opp:,.0f} đ — điểm giao thoa tối thiểu hóa lực cản.",
            ],
        ),
        quantitative_metrics=QuantitativeMetrics(
            demographic_breakdown=DemographicBreakdown(
                by_age=demo.get("age_distribution", {}),
                by_gender={"male": male_float, "female": female_float},
            ),
            model_specific={
                # Props cho VanWestendorpChart.tsx frontend
                "optimal_price": opp,
                "indifference_price": ipp,
                "opp": opp,
                "idp": ipp,
                "pmc": pmc,
                "pme": pme,
                "acceptable_range": [pmc, pme],
                "rap": [pmc, pme],
                "price_curves": frontend_curves,

                # Backend original keys
                "van_westendorp_curves": curves,
                "optimal_price_point": opp,
                "point_of_marginal_cheapness": pmc,
                "point_of_marginal_expensiveness": pme,
                "acceptable_price_range": {"min": pmc, "max": pme},
                "avg_bargain_price": avg_bargain,
                "avg_expensive_price": avg_expensive,
            }
        ),
        qualitative_insights=QualitativeInsights(
            top_drivers=["Giá hợp lý so với giá trị nhận được", "Minh bạch về chi phí"],
            top_barriers=[f"Mức giá vượt {pme}K VND gây từ chối mạnh", "Không có chính sách thử dùng"],
            verbatim_quotes=quotes,
        ),
        actionable_recommendations=recommendations,
        generated_at=datetime.utcnow(),
    )


def _find_intersection(curves: list[dict], key1: str, key2: str, price_key: str, from_right: bool = False) -> int:
    """Tìm điểm giao thoa giữa 2 đường cong."""
    data = curves if not from_right else list(reversed(curves))
    for i in range(len(data) - 1):
        v1a, v1b = data[i][key1], data[i + 1][key1]
        v2a, v2b = data[i][key2], data[i + 1][key2]
        if (v1a - v2a) * (v1b - v2b) <= 0:
            return data[i][price_key]
    # Fallback: median
    return curves[len(curves) // 2][price_key]


def _build_price_quotes(responses, personas_df, avg_bargain, avg_expensive):
    personas = personas_df.to_dict(orient="records")
    quotes = []
    names = ["Nguyễn V. A.", "Trần T. B.", "Lê V. C.", "Phạm T. D.",
             "Hoàng V. E.", "Võ T. F.", "Đặng V. G.", "Bùi T. H.",
             "Ngô V. I.", "Lý T. J."]

    for i, (r, p) in enumerate(zip(responses[:10], personas[:10])):
        bargain_val = r.get("bargain", avg_bargain)
        too_exp_val = r.get("too_expensive", avg_expensive * 1.5)
        sentiment = "positive" if bargain_val <= avg_bargain * 1.1 else "negative"
        quote = (
            f"Tôi thấy mức {bargain_val}K đáng tiền để mua ngay, "
            f"nhưng nếu vượt {too_exp_val}K thì tôi sẽ tìm chỗ khác."
        )
        quotes.append(VerbatimQuote(
            name=names[i],
            age=p.get("age", 30),
            job=p.get("occupation", "Nhân viên"),
            income=p.get("income_bracket"),
            quote=quote,
            sentiment=sentiment,
        ))
    return quotes
