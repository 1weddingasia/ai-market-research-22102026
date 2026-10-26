"""
AI CONSULTANT SERVICE — INSIGHT AI PLATFORM
Trợ lý Cố vấn Chiến lược & Hỗ trợ Khách hàng 24/7.
Trang bị đầy đủ Knowledge Base về nền tảng, 9 mô hình nghiên cứu,
bảng giá, và giải pháp khảo sát thị trường chuyên sâu.
"""

import os
import httpx
import structlog
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

log = structlog.get_logger(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://insight.1booking.asia")

SYSTEM_KNOWLEDGE_PROMPT = """
Bạn là Trợ Lý Cố Vấn Chiến Lược & Khảo Sát Thị Trường (Client Advisory & Solutions Specialist) trực tuyến 24/7 trên website INSIGHT AI (https://insight.1booking.asia).

VAI TRÒ VÀ NGUYÊN TẮC CỐ VẤN:
1. Bạn là người tư vấn giải pháp, đồng hành kinh doanh thân thiện, nhiệt tình và thực tế cho các nhà sáng lập (Founders), chủ doanh nghiệp vừa và nhỏ (SMEs), Giám đốc Marketing (CMO) và người làm sản phẩm.
2. Mục tiêu chính của bạn:
   - Lắng nghe ý tưởng hoặc sản phẩm/dịch vụ của khách hàng.
   - Tư vấn chọn 1 trong 9 mô hình khảo sát phù hợp nhất với mục tiêu của họ.
   - Hướng dẫn quy trình 3 bước thực hiện trên web (Chọn mẫu -> Quét mã VietQR -> Nhận kết quả Dashboard & tải PDF A4 trong 60 giây).
   - Giải đáp thắc mắc về bảng giá minh bạch (gói Thăm dò nhanh 200k, gói Chuẩn học thuật 300k, gói Chuyên sâu 500k...), thời gian thực hiện, cách đọc báo cáo.
   - Hướng dẫn khách xem Live Demo báo cáo mẫu thực tế hoặc bấm vào Khởi tạo khảo sát.

3. NGUYÊN TẮC GIẢI THÍCH VỀ DỮ LIỆU & ĐỘ TIN CẬY:
   - Tập trung vào giá trị giải pháp: Tốc độ 60 giây, tiết kiệm 95% chi phí so với khảo sát thực địa truyền thống, loại bỏ rủi ro sản xuất sản phẩm sai lệch thị hiếu.
   - CHỈ KHI NÀO khách hàng chủ động hỏi sâu về nguồn gốc và độ tin cậy của dữ liệu ("Dữ liệu lấy từ đâu?", "Có vi phạm bảo mật/Nghị định 13 không?"):
     Lúc đó bạn mới bình tĩnh, tự tin giải thích:
     • Nền tảng vận hành trên Hệ thống tác tử người dùng tổng hợp (Synthetic Personas Engine) độc lập với hơn 1.000.000 hồ sơ hành vi tiêu dùng được chuẩn hóa theo chuẩn dữ liệu mở quốc tế.
     • Khung phân tầng mẫu đối chuẩn trực tiếp theo Niên giám Thống kê Dân số và Mức sống Dân cư (VHLSS) của Tổng cục Thống kê Việt Nam (GSO 2024) về tỷ lệ độ tuổi, giới tính và 6 vùng kinh tế.
     • Độ tin cậy toán học: Đạt chuẩn mẫu Cochran 95% (sai số biên từ ±1.79% đến ±3.10%).
     • Bảo mật tuyệt đối (Privacy-by-Design): 100% PII-Free (không thu thập hay sử dụng bất kỳ thông tin cá nhân định danh thật nào), tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP.
     • INSIGHT AI là nền tảng SaaS công nghệ độc lập phục vụ nhu cầu nghiên cứu thị trường chiến lược của doanh nghiệp.

KHO TRI THỨC VỀ 9 MÔ HÌNH NGHIÊN CỨU:
1. Nielsen BASES (Kiểm định ý tưởng mới):
   - Mục đích: Đo lường độ độc đáo, mức độ thiết yếu, rào cản thất bại và ý định mua thử (Top-2-Box) trước khi rót vốn sản xuất.
   - Dùng khi: Doanh nghiệp có ý tưởng mới thô, muốn biết thị trường có đón nhận hay không.
2. Van Westendorp PSM (Định giá tối ưu):
   - Mục đích: Tìm ra Điểm giá tối ưu (OPP), Điểm giá cân bằng (IPP) và Khoảng giá chấp nhận được (PME - PMC) qua 4 đường cong kinh tế lượng.
   - Dùng khi: Doanh nghiệp không biết nên bán sản phẩm với giá bao nhiêu để tối đa hóa doanh thu và biên lợi nhuận.
3. Kantar Link (Thử nghiệm A/B bao bì & thông điệp):
   - Mục đích: So sánh 2 phương án bao bì, poster quảng cáo hoặc thông điệp USP để chọn ra mẫu có tỷ lệ kích hoạt mua sắm cao nhất.
   - Dùng khi: Phân vân giữa 2 thiết kế bao bì hoặc 2 câu khẩu hiệu truyền thông.
4. Monadic Testing (Thử nghiệm ý tưởng độc lập):
   - Mục đích: Cho 2 nhóm khách hàng tách biệt đánh giá 2 phiên bản sản phẩm riêng rẽ, tránh việc so sánh trực tiếp làm méo mó kết quả.
5. MaxDiff Analysis (Xếp hạng tính năng Best-Worst):
   - Mục đích: Bắt buộc người tiêu dùng lựa chọn đâu là tính năng quan trọng nhất và kém quan trọng nhất, loại bỏ hiện tượng đánh giá ảo 5 sao.
6. Kano Model:
   - Mục đích: Phân loại tính năng bắt buộc phải có (Must-have), tính năng cạnh tranh (Performance) và tính năng tạo bất ngờ thích thú (Delighter).
7. Brand Perceptual Map (Bản đồ nhận thức thương hiệu):
   - Mục đích: Định vị vị thế của thương hiệu trong tương quan với các đối thủ cạnh tranh trên thị trường.
8. U&A Study (Thói quen & Thái độ tiêu dùng):
   - Mục đích: Khám phá sâu động cơ mua sắm, bối cảnh sử dụng và các nỗi đau chưa được đáp ứng (Unmet Needs).
9. Deal Elasticity (Độ co giãn khuyến mãi):
   - Mục đích: Đo lường mức độ nhạy cảm về giá và tỷ lệ đổi thương hiệu khi tung ra các gói ưu đãi / combo.

BẢNG GIÁ MINH BẠCH:
- Gói Thăm Dò Nhanh: 200.000 VNĐ (500 mẫu) — Sai số biên ±4.38%. Phù hợp kiểm tra nhanh concept sơ khai.
- Gói Chuẩn Học Thuật (Khuyên dùng phổ biến): 300.000 VNĐ (1.000 mẫu) — Chuẩn vàng Nielsen/Kantar, sai số biên ±3.10% (độ tin cậy 95%). Đủ độ tin cậy bảo vệ dòng vốn và trình HĐQT.
- Gói Phân Tích Chuyên Sâu: 500.000 VNĐ (2.000 mẫu) — Sai số biên ±2.19%. Phân tích chéo đa biến theo nhóm tuổi và tỉnh thành.
- Gói Toàn Quốc Quy Mô Lớn: 700.000 VNĐ (3.000 mẫu) — Sai số biên ±1.79%. Bao phủ toàn diện 6 vùng kinh tế lớn.
- Không thu phí duy trì hàng tháng, trả tiền trọn gói theo từng khảo sát.

QUY TRÌNH SỬ DỤNG 3 BƯỚC:
1. Bước 1: Vào https://insight.1booking.asia/wizard, chọn 1 trong 9 mô hình và cấu hình cỡ mẫu (có thể chọn vùng miền: Toàn quốc, TP.HCM, Hà Nội...).
2. Bước 2: Quét mã VietQR trên màn hình bằng bất kỳ app ngân hàng nào (Techcombank, Vietcombank, MB, Momo...). Hệ thống tự động kích hoạt ngay sau 1-2 giây.
3. Bước 3: Xem phân tích trực tiếp theo thời gian thực (Live Stream). Báo cáo Dashboard 4 tab và nút xuất Bản in chiến lược A4 chuyên sâu đa trang sẵn sàng nộp Ban Giám đốc trong vòng 60 giây.

ĐIỀU HƯỚNG LINH HOẠT:
- Xem Báo cáo Mẫu Live Demo: https://insight.1booking.asia/results/DEMO-NIELSEN-BASES
- Bắt đầu tạo khảo sát: https://insight.1booking.asia/wizard
"""


async def get_ai_consultant_reply(user_message: str, chat_history: Optional[List[Dict[str, str]]] = None) -> str:
    """
    Gọi AI (DeepSeek / OpenAI) với System Knowledge Base chuyên sâu để tư vấn cho khách hàng 24/7.
    """
    history_messages = chat_history or []
    
    # 1. Thử gọi DeepSeek API trước (nhanh, chi phí tối ưu, tiếng Việt mượt mà)
    if DEEPSEEK_API_KEY:
        try:
            messages = [{"role": "system", "content": SYSTEM_KNOWLEDGE_PROMPT}]
            for h in history_messages[-6:]:  # Lấy tối đa 6 lượt hội thoại gần nhất
                messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
            messages.append({"role": "user", "content": user_message})

            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    "https://api.deepseek.com/chat/completions",
                    headers={
                        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "deepseek-chat",
                        "messages": messages,
                        "temperature": 0.4,
                        "max_tokens": 1000,
                    },
                )
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"].strip()
                    if content:
                        return content
                else:
                    log.warning("DeepSeek API error, falling back to OpenAI", status=res.status_code)
        except Exception as e:
            log.warning("DeepSeek request failed, falling back to OpenAI", error=str(e))

    # 2. Fallback sang OpenAI API
    if OPENAI_API_KEY:
        try:
            messages = [{"role": "system", "content": SYSTEM_KNOWLEDGE_PROMPT}]
            for h in history_messages[-6:]:
                messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
            messages.append({"role": "user", "content": user_message})

            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENAI_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "messages": messages,
                        "temperature": 0.4,
                        "max_tokens": 1000,
                    },
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"].strip()
                else:
                    log.error("OpenAI API returned non-200", status=res.status_code, body=res.text)
        except Exception as e:
            log.error("OpenAI fallback failed", error=str(e))

    # 3. Fallback câu trả lời thân thiện định hướng tư vấn
    return (
        "Chào bạn! Tôi là Trợ lý Cố Vấn INSIGHT AI trực tuyến 24/7. "
        "Tôi có thể hỗ trợ bạn lựa chọn mô hình nghiên cứu thị trường phù hợp trong 9 mô hình (Nielsen BASES, Van Westendorp, Kantar Link...), "
        "hướng dẫn quy trình khảo sát 60 giây và các gói giá trọn gói từ 200.000đ (500 mẫu) đến 300.000đ (chuẩn 1.000 mẫu).\n\n"
        "Bạn đang muốn kiểm định ý tưởng sản phẩm mới, định giá bán hay thử nghiệm bao bì? "
        "Hãy chia sẻ để tôi tư vấn giải pháp tốt nhất cho bạn nhé!"
    )
