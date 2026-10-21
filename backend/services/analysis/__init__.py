"""
Analysis router: Dispatcher cho 5 loại survey.
"""

from models.schemas import ReportPayload
from models.survey_configs import get_survey_config
from services.analysis import (
    ab_analysis, bases_analysis, deal_analysis, psm_analysis, ua_analysis,
)

_ANALYSIS_MAP = {
    "nielsen_bases": bases_analysis.analyze,
    "van_westendorp": psm_analysis.analyze,
    "ab_testing": ab_analysis.analyze,
    "ua_study": ua_analysis.analyze,
    "deal_elasticity": deal_analysis.analyze,
}


def run_analysis(
    survey_id: str,
    model_type: str,
    responses: list[dict],
    personas_df,
    product_info: dict,
) -> ReportPayload:
    """
    Dispatch analysis về đúng module theo model_type.
    Returns ReportPayload hoàn chỉnh.
    """
    analyzer = _ANALYSIS_MAP.get(model_type)
    if not analyzer:
        raise ValueError(f"Không có analyzer cho model_type: {model_type}")

    config = get_survey_config(model_type)
    return analyzer(
        survey_id=survey_id,
        responses=responses,
        personas_df=personas_df,
        product_info=product_info,
        survey_config=config,
    )
