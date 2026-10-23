"""
Router: Export — GET /survey/{id}/pdf
Tự động detect WeasyPrint: trả PDF hoặc HTML printable.
"""

import json
from pathlib import Path

import structlog
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy.orm import Session

from database import Survey, get_db
from services.pdf_service import generate_pdf, WEASYPRINT_AVAILABLE

log = structlog.get_logger(__name__)

router = APIRouter(prefix="/survey", tags=["Export"])


@router.get("/{survey_id}/pdf")
async def download_pdf(
    survey_id: str,
    refresh: bool = False,
    download: bool = False,
    db: Session = Depends(get_db),
):
    """
    Trả về file báo cáo.
    - WeasyPrint có sẵn → PDF (application/pdf)
    - WeasyPrint không có → HTML printable (text/html)
    PDF/HTML được cache sau lần đầu generate.
    """
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey and survey_id.upper().startswith("DEMO"):
        from models.demo_data import get_demo_report_payload
        demo_payload = get_demo_report_payload(survey_id)
        file_path_str = await generate_pdf(
            survey_id=survey_id,
            report_data=demo_payload,
        )
        file_path = Path(file_path_str)
        if download:
            return FileResponse(
                path=str(file_path),
                media_type="application/pdf" if file_path.suffix == ".pdf" else "text/html",
                filename=f"bao-cao-{survey_id}.{file_path.suffix[1:]}",
                content_disposition_type="attachment",
            )
        elif file_path.suffix == ".pdf":
            return FileResponse(
                path=str(file_path),
                media_type="application/pdf",
                filename=f"bao-cao-{survey_id}.pdf",
            )
        else:
            return HTMLResponse(content=file_path.read_text(encoding="utf-8"))

    if not survey:
        raise HTTPException(404, "Survey không tìm thấy")

    if survey.status != "COMPLETED":
        raise HTTPException(425, "Báo cáo chưa sẵn sàng — đang xử lý")

    # Kiểm tra cache (nếu không yêu cầu refresh)
    if survey.pdf_path and not refresh:
        cached = Path(survey.pdf_path)
        if cached.exists():
            if cached.suffix == ".pdf":
                return FileResponse(
                    path=str(cached),
                    media_type="application/pdf",
                    filename=f"bao-cao-{survey_id}.pdf",
                )
            elif download:
                return FileResponse(
                    path=str(cached),
                    media_type="text/html",
                    filename=f"bao-cao-{survey_id}.html",
                    content_disposition_type="attachment",
                )
            else:
                return HTMLResponse(content=cached.read_text(encoding="utf-8"))

    # Sinh file mới
    try:
        result_data = json.loads(survey.result_json)
        if "product_info" not in result_data and survey.product_info_json:
            try:
                result_data["product_info"] = json.loads(survey.product_info_json)
            except Exception:
                pass

        file_path   = await generate_pdf(survey_id=survey_id, report_data=result_data)

        survey.pdf_path = file_path
        db.commit()

        p = Path(file_path)
        if p.suffix == ".pdf":
            return FileResponse(
                path=file_path,
                media_type="application/pdf",
                filename=f"bao-cao-{survey_id}.pdf",
            )
        elif download:
            return FileResponse(
                path=file_path,
                media_type="text/html",
                filename=f"bao-cao-{survey_id}.html",
                content_disposition_type="attachment",
            )
        else:
            # HTML mode — trả về HTML với nút Print
            html = p.read_text(encoding="utf-8")
            print_script = """<script>
              window.addEventListener('load', function(){
                document.title = 'Bao cao AI Market Research';
                if(!window._printed){ window._printed=true; window.print(); }
              });
            </script>"""
            return HTMLResponse(content=html.replace("</body>", print_script + "</body>"))

    except Exception as e:
        log.error("Report generation failed", error=str(e), survey_id=survey_id)
        raise HTTPException(500, f"Không thể tạo báo cáo: {e}")
