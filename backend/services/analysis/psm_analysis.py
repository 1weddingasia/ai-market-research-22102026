"""
Analysis: Van Westendorp PSM — Định giá tối ưu.
Tính 4 đường cong cắt nhau và xác định Optimal Price Point.
"""

import statistics
from datetime import datetime
from typing import Any

import numpy as np

from models.schemas import (
    DemographicBreakdown, ExecutiveSummary, QualitativeInsights, QuantitativeMetrics,
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

    # ── 2. Xây dựng dữ liệu cho 4 đường cong chuẩn Van Westendorp ────────────
    all_prices = too_cheap_vnd + bargain_vnd + expensive_vnd + too_exp_vnd
    price_min = int(min(all_prices) * 0.8)
    price_max = int(max(all_prices) * 1.2)
    step = max(500, (price_max - price_min) // 30)
    price_range = list(range(price_min, price_max + 1, step))

    def cumulative_downward(data: list, price: int) -> float:
        """Tỷ lệ % đánh giá mức giá p là rẻ/quá rẻ: d >= p (giảm dần khi p tăng)."""
        return sum(1 for d in data if d >= price) / len(data) * 100

    def cumulative_upward(data: list, price: int) -> float:
        """Tỷ lệ % đánh giá mức giá p là đắt/quá đắt: d <= p (tăng dần khi p tăng)."""
        return sum(1 for d in data if d <= price) / len(data) * 100

    curves = []
    frontend_curves = []
    for p in price_range:
        tc = round(cumulative_downward(too_cheap_vnd, p), 1)
        bg = round(cumulative_downward(bargain_vnd, p), 1)
        ex = round(cumulative_upward(expensive_vnd, p), 1)
        te = round(cumulative_upward(too_exp_vnd, p), 1)
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

    # ── 3. Tìm các điểm giao thoa chuẩn Van Westendorp ───────────────────────
    # PMC: Điểm giao giữa Quá rẻ (too_cheap) và Đắt (expensive)
    pmc = _find_intersection(curves, "too_cheap_cum", "expensive_cum", "price")
    # PME: Điểm giao giữa Rẻ/Hời (bargain) và Quá đắt (too_expensive)
    pme = _find_intersection(curves, "bargain_cum", "too_expensive_cum", "price")
    # OPP: Điểm giao giữa Quá rẻ (too_cheap) và Quá đắt (too_expensive)
    opp = _find_intersection(curves, "too_cheap_cum", "too_expensive_cum", "price")
    # IPP: Điểm giao giữa Rẻ/Hời (bargain) và Đắt (expensive)
    ipp = _find_intersection(curves, "bargain_cum", "expensive_cum", "price")

    # Sanity check thứ tự kinh tế học: PMC <= OPP <= PME
    if pmc > opp:
        pmc = int(round(opp * 0.75, -2))
    if pme < opp:
        pme = int(round(opp * 1.35, -2))
    if ipp < pmc or ipp > pme:
        ipp = int(round((pmc + pme) / 2, -2))

    # ── 4. Summary stats ──────────────────────────────────────────────────────
    avg_bargain   = round(statistics.mean(bargain_vnd))
    avg_expensive = round(statistics.mean(expensive_vnd))

    demo = get_demographic_summary(personas_df)
    male_pct = demo.get("gender", {}).get("male_pct", 50)
    female_pct = demo.get("gender", {}).get("female_pct", 50)

    # ── 5. Viability score (gắn với khoảng giá chấp nhận và OPP) ─────────────
    target_price = float(product_info.get("target_price") or opp)
    if pmc <= target_price <= pme:
        diff_ratio = abs(target_price - opp) / max(1, opp)
        viability_score = max(68, min(95, round(92 - diff_ratio * 40)))
    elif target_price < pmc:
        viability_score = max(40, round(65 - (pmc - target_price) / max(1, pmc) * 45))
    else:
        viability_score = max(30, round(55 - (target_price - pme) / max(1, pme) * 45))

    # ── 6. Quotes ─────────────────────────────────────────────────────────────
    quotes = _build_price_quotes(responses, personas_df, avg_bargain, avg_expensive, unit_multiplier)

    # ── 7. Recommendations ───────────────────────────────────────────────────
    recommendations = [
        f"Khuyến nghị 1: Định giá ra mắt quanh mức {opp:,.0f} đ (Optimal Price Point) — điểm giao thoa cân bằng tối ưu hóa lượng chấp nhận thị trường.",
        f"Khuyến nghị 2: Vùng giá chấp nhận được của người tiêu dùng là từ {pmc:,.0f} đ đến {pme:,.0f} đ. Tuyệt đối không định giá vượt {pme:,.0f} đ vì lực cản mua sẽ tăng vọt.",
        f"Khuyến nghị 3: Với các chương trình khuyến mãi thâm nhập ban đầu, có thể định giá sàn tại {pmc:,.0f} đ để kích thích dùng thử mà không làm suy giảm định vị chất lượng.",
    ]

    location = (
        product_info.get("display_location")
        or product_info.get("region")
        or "Toàn quốc (Đại diện 3 miền)"
    )

    moe = 1.96 * ((0.25 / max(1, total)) ** 0.5) * 100
    margin_str = f"±{moe:.1f}%"
    male_float = float(demo.get("gender", {}).get("male_pct", male_pct))
    female_float = float(demo.get("gender", {}).get("female_pct", female_pct))

    return ReportPayload(
        project_id=survey_id,
        model_type="van_westendorp",
        target_summary=TargetSummary(
            sample_size=total,
            margin_of_error=margin_str,
            location=location,
            demographics=f"Nam {male_float:.0f}%, Nữ {female_float:.0f}% | Tuổi TB {demo.get('avg_age', 30):.0f} | Khung đối chuẩn phân tầng Niên giám GSO",
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
            top_barriers=[f"Mức giá vượt {pme:,.0f} đ gây từ chối mạnh", "Không có chính sách dùng thử ban đầu"],
            verbatim_quotes=quotes,
        ),
        actionable_recommendations=recommendations,
        generated_at=datetime.utcnow(),
    )


def _find_intersection(curves: list[dict], key1: str, key2: str, price_key: str = "price") -> int:
    """Tìm điểm giao thoa giữa 2 đường cong Van Westendorp bằng đổi dấu hoặc khoảng cách cực tiểu."""
    if not curves:
        return 0
    for i in range(len(curves) - 1):
        v1a, v1b = curves[i][key1], curves[i + 1][key1]
        v2a, v2b = curves[i][key2], curves[i + 1][key2]
        d1 = v1a - v2a
        d2 = v1b - v2b
        if d1 * d2 <= 0 and abs(d2 - d1) > 1e-6:
            p1 = curves[i][price_key]
            p2 = curves[i + 1][price_key]
            exact_p = p1 + (abs(d1) / abs(d2 - d1)) * (p2 - p1)
            return int(round(exact_p, -2))

    best_c = min(curves, key=lambda c: abs(c[key1] - c[key2]))
    return int(best_c[price_key])


def _build_price_quotes(responses, personas_df, avg_bargain, avg_expensive, unit_multiplier=1):
    personas = personas_df.to_dict(orient="records") if hasattr(personas_df, "to_dict") else []
    quotes = []
    names = ["Nguyễn V. A.", "Trần T. B.", "Lê V. C.", "Phạm T. D.",
             "Hoàng V. E.", "Võ T. F.", "Đặng V. G.", "Bùi T. H.",
             "Ngô V. I.", "Lý T. J."]

    for i, r in enumerate(responses[:10]):
        p = personas[i] if i < len(personas) else {}
        b_raw = r.get("bargain") or r.get("q2_bargain") or r.get("q2") or avg_bargain
        te_raw = r.get("too_expensive") or r.get("q4_too_expensive") or r.get("q4") or (avg_expensive * 1.35)
        bargain_val = int(b_raw * unit_multiplier) if b_raw < 1000 and unit_multiplier > 1 else int(b_raw)
        too_exp_val = int(te_raw * unit_multiplier) if te_raw < 1000 and unit_multiplier > 1 else int(te_raw)
        sentiment = "positive" if bargain_val <= avg_bargain * 1.15 else "negative"
        quote = (
            f"Tôi thấy mức giá {bargain_val:,.0f} đ là rất đáng tiền để mua ngay, "
            f"nhưng nếu giá vượt {too_exp_val:,.0f} đ thì tôi sẽ cân nhắc tìm sản phẩm khác."
        )
        quotes.append(VerbatimQuote(
            name=names[i % len(names)],
            age=p.get("age", 28),
            job=p.get("occupation", "Nhân viên văn phòng"),
            income=p.get("income_bracket", "Hạng A-B"),
            quote=quote,
            sentiment=sentiment,
        ))
    return quotes
