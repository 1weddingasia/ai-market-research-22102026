"""
T5: PDF Service — Sinh báo cáo PDF A4 chuẩn in ấn với trang bìa đen-vàng.
Dùng WeasyPrint + Jinja2 template.
"""

import os
import tempfile
from datetime import datetime
from pathlib import Path

import structlog
from jinja2 import Environment, FileSystemLoader

log = structlog.get_logger(__name__)

TEMPLATE_DIR = Path(__file__).parent.parent / "templates"
PDF_OUTPUT_DIR = Path("./pdfs")
PDF_OUTPUT_DIR.mkdir(exist_ok=True)

MODEL_TYPE_LABELS = {
    "nielsen_bases":   "Nielsen BASES — Kiểm định Ý tưởng Sản phẩm",
    "van_westendorp":  "Van Westendorp PSM — Định giá Tối ưu",
    "ab_testing":      "Kantar Link — Thử nghiệm A/B Bao bì & Thông điệp",
    "ua_study":        "U&A Study — Thói quen & Thái độ Ngành hàng",
    "deal_elasticity": "Deal Elasticity — Đánh giá Chương trình Ưu đãi",
    "monadic":         "Monadic Testing — Thử nghiệm Khái niệm Độc lập",
    "maxdiff":         "MaxDiff Scaling — Xếp hạng Thuộc tính & Thông điệp",
    "kano":            "Kano Model — Phân loại Tính năng R&D",
    "brand_map":       "Brand Perceptual Mapping — Bản đồ Định vị Thương hiệu",
}


WEASYPRINT_AVAILABLE = False
try:
    from weasyprint import HTML as _WP_HTML   # type: ignore
    WEASYPRINT_AVAILABLE = True
except Exception:
    pass


async def generate_pdf(survey_id: str, report_data: dict) -> str:
    """
    Sinh file từ report_data.
    - Nếu WeasyPrint có sẵn (Linux/deploy): xuất PDF.
    - Nếu không (Windows dev): xuất HTML có thể in → trả về đường dẫn .html.
    """
    html_content = _render_html(survey_id, report_data)

    if WEASYPRINT_AVAILABLE:
        pdf_path = PDF_OUTPUT_DIR / f"{survey_id}.pdf"
        _WP_HTML(string=html_content, base_url=str(TEMPLATE_DIR)).write_pdf(str(pdf_path))
        log.info("PDF generated (WeasyPrint)", survey_id=survey_id, path=str(pdf_path))
        return str(pdf_path)

    # Fallback: lưu HTML — browser có thể in ra PDF
    html_path = PDF_OUTPUT_DIR / f"{survey_id}.html"
    html_path.write_text(html_content, encoding="utf-8")
    log.info("HTML report generated (WeasyPrint not available)", survey_id=survey_id, path=str(html_path))
    return str(html_path)


def _render_html(survey_id: str, data: dict) -> str:
    """Render HTML từ Jinja2 template."""
    env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))
    env.globals["enumerate"] = enumerate
    template = env.get_template("report_template.html")

    model_type = data.get("model_type", "nielsen_bases")

    ctx = {
        "survey_id":         survey_id,
        "model_type":        model_type,
        "model_label":       MODEL_TYPE_LABELS.get(model_type, model_type),
        "generated_at":      datetime.now().strftime("%d/%m/%Y %H:%M"),
        "product":           data.get("product_info", {}),
        "target":            data.get("target_summary", {}),
        "executive":         data.get("executive_summary", {}),
        "metrics":           data.get("quantitative_metrics", {}),
        "insights":          data.get("qualitative_insights", {}),
        "recommendations":   data.get("actionable_recommendations", []),
    }

    return template.render(**ctx)
