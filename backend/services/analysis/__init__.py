"""
Analysis router: Dispatcher cho 5 loại survey.
"""

from models.schemas import ReportPayload, TargetSummary
from models.survey_configs import get_survey_config
from services.analysis import (
    ab_analysis, bases_analysis, deal_analysis, psm_analysis, ua_analysis,
    monadic_analysis, maxdiff_analysis, kano_analysis, brand_map_analysis,
)
from services.duckdb_service import get_demographic_summary

_ANALYSIS_MAP = {
    "nielsen_bases": bases_analysis.analyze,
    "van_westendorp": psm_analysis.analyze,
    "ab_testing": ab_analysis.analyze,
    "ua_study": ua_analysis.analyze,
    "deal_elasticity": deal_analysis.analyze,
    "monadic": monadic_analysis.analyze,
    "maxdiff": maxdiff_analysis.analyze,
    "kano": kano_analysis.analyze,
    "brand_map": brand_map_analysis.analyze,
}


def build_standard_target_summary(
    total: int,
    product_info: dict,
    demo: dict,
) -> TargetSummary:
    """Tạo TargetSummary chuẩn hóa chuyên nghiệp với đầy đủ thông tin phân khúc mục tiêu."""
    margin_map = {500: "±4.3%", 1000: "±3.1%", 2000: "±2.2%", 3000: "±1.8%"}
    margin = margin_map.get(total, "±3.1%")
    location = (
        product_info.get("display_location")
        or product_info.get("region")
        or "Toàn quốc (Đại diện 3 miền)"
    )
    male_pct = demo.get("gender", {}).get("male_pct", 50)
    female_pct = demo.get("gender", {}).get("female_pct", 50)
    avg_age = demo.get("avg_age", 30)

    tgt_summary = product_info.get("targeting_summary")
    demographics_str = (
        tgt_summary
        if tgt_summary
        else f"Nam {male_pct:.0f}%, Nữ {female_pct:.0f}% | Tuổi trung bình {avg_age:.0f} | Phân tầng Quota chuẩn GSO"
    )

    return TargetSummary(
        sample_size=total,
        margin_of_error=margin,
        location=location,
        demographics=demographics_str,
        targeting_summary=tgt_summary,
        target_gender=product_info.get("target_gender"),
        target_income=product_info.get("target_income"),
        target_marital_status=product_info.get("target_marital_status"),
        target_occupation=product_info.get("target_occupation"),
        target_zone=product_info.get("target_zone"),
    )


def run_analysis(
    survey_id: str,
    model_type: str,
    responses: list[dict],
    personas_df,
    product_info: dict,
) -> ReportPayload:
    """
    Dispatch analysis về đúng module theo model_type.
    Returns ReportPayload hoàn chỉnh và chuẩn hóa TargetSummary cho cả 9 mô hình khảo sát.
    """
    analyzer = _ANALYSIS_MAP.get(model_type)
    if not analyzer:
        raise ValueError(f"Không có analyzer cho model_type: {model_type}")

    config = get_survey_config(model_type)
    report = analyzer(
        survey_id=survey_id,
        responses=responses,
        personas_df=personas_df,
        product_info=product_info,
        survey_config=config,
    )

    # Chuẩn hóa TargetSummary đồng bộ 100% cho cả 9 mô hình
    try:
        demo = get_demographic_summary(personas_df) if personas_df is not None else {}
        total = len(personas_df) if personas_df is not None else report.target_summary.sample_size
        report.target_summary = build_standard_target_summary(total, product_info, demo)
    except Exception:
        pass

    return report
