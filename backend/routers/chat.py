"""
CHAT ROUTER — INSIGHT AI PLATFORM
API endpoint phục vụ Live Chatbot AI Consultant 24/7 trên Website.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import structlog

from services.ai_consultant import get_ai_consultant_reply

log = structlog.get_logger(__name__)

router = APIRouter(prefix="/chat", tags=["AI Consultant 24/7"])


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' hoặc 'assistant'")
    content: str = Field(..., description="Nội dung tin nhắn")


class ChatConsultantRequest(BaseModel):
    message: str = Field(..., description="Câu hỏi của người dùng")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Lịch sử hội thoại trước đó")


class ChatConsultantResponse(BaseModel):
    reply: str
    status: str = "success"


@router.post("/ask", response_model=ChatConsultantResponse)
async def ask_consultant(req: ChatConsultantRequest):
    """
    Tiếp nhận câu hỏi từ khách hàng trên Website 24/7 và trả lời tư vấn bằng AI
    dựa trên Knowledge Base độc quyền của INSIGHT AI (GSO, chuẩn Cochran 95%, 9 mô hình nghiên cứu).
    """
    msg = (req.message or "").strip()
    if not msg:
        raise HTTPException(400, "Vui lòng nhập nội dung câu hỏi")

    try:
        history_list = [{"role": h.role, "content": h.content} for h in (req.history or [])]
        reply_text = await get_ai_consultant_reply(user_message=msg, chat_history=history_list)
        return ChatConsultantResponse(reply=reply_text, status="success")
    except Exception as e:
        log.error("AI Consultant ask error", error=str(e))
        return ChatConsultantResponse(
            reply="Hệ thống Cố vấn AI đang xử lý lượng yêu cầu lớn. Bạn có thể xem ngay Báo cáo mẫu thực tế tại https://insight.1booking.asia/results/DEMO-NIELSEN-BASES hoặc bấm Khởi tạo khảo sát tại https://insight.1booking.asia/wizard",
            status="fallback"
        )
