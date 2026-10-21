"""
Router: Stream — GET /survey/{id}/stream (SSE realtime logs)
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database import Survey, get_db
from services.worker import stream_events

router = APIRouter(prefix="/survey", tags=["Stream"])


@router.get("/{survey_id}/stream")
async def survey_stream(
    survey_id: str,
    db: Session = Depends(get_db),
):
    """
    Server-Sent Events endpoint.
    Frontend kết nối bằng EventSource API.

    Events format:
        data: {"percent": 35, "log": "DuckDB đã trích xuất..."}\n\n
        data: {"percent": 100, "log": "Hoàn tất!", "status": "COMPLETED"}\n\n
    """
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(404, f"Survey {survey_id} không tìm thấy")

    if survey.status == "PENDING_PAYMENT":
        # Vẫn chờ thanh toán — stream sẽ replay logs (trống) và chờ
        pass

    return StreamingResponse(
        stream_events(survey_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",    # Tắt Nginx buffering
            "Connection": "keep-alive",
        },
    )
