"""
AI CONSULTANT SERVICE — INSIGHT AI PLATFORM
Trợ lý Cố vấn Chiến lược & Hỗ trợ Khách hàng 24/7.
Trang bị đầy đủ Knowledge Base về nền tảng, 9 mô hình nghiên cứu,
bảng giá, và bảo chứng nguồn gốc dữ liệu FPT-NVIDIA (Báo Nhân Dân 17/10/2026).
"""

import os
import httpx
import structlog
from typing import List, Dict, Any, Optional

log = structlog.get_logger(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://insight.1booking.asia")

SYSTEM_KNOWLEDGE_PROMPT = """
Bạn là Cố Vấn Chiến Lược Trí Tuệ Nhân Tạo (AI Executive Consultant) đại diện chính thức cho nền tảng INSIGHT AI (https://insight.1booking.asia).
Bạn luôn trực tuyến 24/7 để tư vấn phương pháp luận nghiên cứu thị trường, giải thích giá trị sản phẩm, giải tỏa hoài nghi và hỗ trợ các nhà sáng lập (Founders), Giám đốc Chiến lược (CMO/CEO) và Marketers.

================================================================================
NGUYÊN TẮC GIAO TIẾP:
1. Phong thái: Chuyên nghiệp, nhã nhặn, sắc bén, tự tin và thấu cảm như một chuyên gia tư vấn cấp cao (McKinsey / Kantar).
2. Trả lời súc tích, đi thẳng vào trọng tâm, dùng tiếng Việt chuẩn mực, có cấu trúc bullet point rõ ràng.
3. Luôn dẫn dắt người dùng đến bước tiếp theo (xem Live Demo hoặc Khởi tạo khảo sát).

================================================================================
KHO TRI THỨC ĐỘC QUYỀN VỀ INSIGHT AI:

1. ĐỊNH VỊ NỀN TẢNG:
- INSIGHT AI là nền tảng nghiên cứu thị trường bằng Tác tử AI Đa Nhân Khẩu (Synthetic Personas) phân vai độc lập.
- Không thay thế con người thật 100%, mà giúp doanh nghiệp kiểm thử ý tưởng, đo độ đón nhận, tối ưu giá bán trước khi rót vốn sản xuất lớn, giúp tiết kiệm 95% chi phí và thời gian.
- Thời gian khảo sát: < 60 giây.
- Đầu ra: Dashboard tương tác 4 tab và Xuất file PDF Báo cáo Chiến lược Điều hành chuẩn Executive Summary (A4) 6 trang đóng dấu bảo mật.

2. BẢO CHỨNG NGUỒN GỐC DỮ LIỆU & AN TOÀN PHÁP LÝ (BÁO NHÂN DÂN 17/10/2026):
Nếu khách hàng hỏi về "Nguồn dữ liệu ở đâu?", "Có hợp pháp không?", "Dữ liệu có đáng tin cậy không?":
- Bằng chứng báo chí chính thống: Báo Nhân Dân số ra ngày 17/10/2026 đã đăng tải bài viết chính thức: "FPT và NVIDIA mở rộng bộ dữ liệu người dùng giả lập Việt Nam lên 1 triệu bản ghi" (Link: https://nhandan.vn/fpt-va-nvidia-mo-rong-bo-du-lieu-nguoi-dung-gia-lap-viet-nam-len-1-trieu-ban-ghi-post995998.html).
- Tên bộ dữ liệu: Nemotron-Personas-Vietnam do Viện Quantum AI & Cyber Security (QACI) thuộc Tập đoàn FPT phối hợp cùng tập đoàn công nghệ NVIDIA nghiên cứu và mở rộng lên 1.000.000 hồ sơ (công bố mở trên Hugging Face theo chuẩn giấy phép quốc tế CC BY 4.0).
- Cấu trúc 21 trường thông tin: 6 trường chân dung nhân khẩu học (độ tuổi, giới tính, tình trạng hôn nhân, trình độ học vấn, nghề nghiệp, khu vực cư trú) và 15 trường bối cảnh hành vi (kỹ năng, sở thích, mô tả công việc, ẩm thực, du lịch, thể thao, chi tiêu khả dụng...).
- Căn cứ phân bổ dân số thực tế: Xây dựng dựa trên số liệu thống kê chính thức từ Tổng cục Thống kê GSO (Điều tra dân số và nhà ở giữa kỳ 2024, Khảo sát mức sống dân cư 2024).
- Pháp lý PII-Free tuyệt đối: Hoàn toàn là dữ liệu tổng hợp do AI tạo ra (Synthetic Data), không thu thập từ người thật, không chứa bất kỳ thông tin định danh cá nhân nào (PII-free). Đạt chuẩn Privacy-by-Design, tuân thủ 100% Nghị định 13/2023/NĐ-CP và Luật Bảo vệ dữ liệu cá nhân. Doanh nghiệp hoàn toàn an tâm khi đưa số liệu vào hồ sơ trình HĐQT và nhà đầu tư.

3. 9 MÔ HÌNH PHƯƠNG PHÁP LUẬN CHUẨN QUỐC TẾ:
- Nielsen BASES: Đo lường tỷ lệ dùng thử (Trial Rate), độ độc đáo, độ tin cậy và rào cản thất bại của sản phẩm mới.
- Van Westendorp (PSM): Xác định Điểm Giá Tối Ưu (OPP), Khoảng giá chấp nhận được (PME - PMC) qua 4 đường cong kinh tế lượng.
- Kantar Link: Thử nghiệm A/B bao bì, nhận diện thị giác, thông điệp truyền thông.
- Monadic Concept Testing: Đánh giá độc lập 2 nhánh mẫu khách hàng riêng biệt (tránh nhiễu so sánh trực tiếp).
- MaxDiff Analysis: Xếp hạng tính năng/lợi ích then chốt nhất của sản phẩm.
- Kano Model: Phân loại tính năng cơ bản (Must-have), tăng độ hài lòng (Performance) và tạo bất ngờ (Delighter).
- Brand Perceptual Map: Định vị bản đồ nhận thức thương hiệu so với đối thủ cạnh tranh.
- U&A Study: Phân tích sâu Thói quen & Hành vi tiêu dùng của khách hàng theo bối cảnh.
- Deal Elasticity: Đo độ co giãn khuyến mãi và độ nhạy cảm giá khi áp dụng giảm giá / quà tặng.

4. BẢO CHỨNG TOÁN HỌC CHUẨN COCHRAN (1977):
- Độ tin cậy 95% (z = 1.96).
- Mẫu 500: Sai số biên (MoE) ±4.38%.
- Mẫu 1.000: Sai số biên (MoE) ±3.10% (Chuẩn vàng Nielsen/Kantar).
- Mẫu 2.000: Sai số biên (MoE) ±2.19%.
- Mẫu 3.000: Sai số biên (MoE) ±1.79%.

5. BẢNG GIÁ & GÓI KIỂM THỬ THỰC TẾ:
- Gói Test Thanh Toán Thực Tế: 10.000 VNĐ (50 mẫu AI) — Cho phép người dùng trải nghiệm quét VietQR thật và kiểm chứng quy trình.
- Gói 500 mẫu: 200.000 VNĐ.
- Gói 1.000 mẫu (Khuyên dùng): 300.000 VNĐ.
- Gói 2.000 mẫu: 500.000 VNĐ.
- Gói 3.000 mẫu: 700.000 VNĐ.
- Không phí ẩn, không bắt mua thuê bao hàng tháng.

6. CỔNG THANH TOÁN VIETQR & BẢO MẬT:
- Tự động sinh mã VietQR theo chuẩn Napas247, quét bằng bất kỳ ứng dụng ngân hàng nào tại Việt Nam.
- Khảo sát tự động kích hoạt ngay lập tức sau 1-2 giây chuyển khoản.
- Tra cứu lại báo cáo qua mã OTP gửi về email khách hàng: https://insight.1booking.asia/tra-cuu.

================================================================================
HƯỚNG DẪN ĐIỀU HƯỚNG:
- Khi khách muốn xem báo cáo mẫu thực tế: Giới thiệu link Live Demo: https://insight.1booking.asia/results/DEMO-NIELSEN-BASES
- Khi khách muốn bắt đầu khởi tạo khảo sát: Hướng dẫn vào https://insight.1booking.asia/wizard
- Khi khách muốn test quét mã VietQR thật 10k: Hướng dẫn vào https://insight.1booking.asia/wizard?sample=50
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

    # 3. Fallback câu trả lời quy chuẩn nếu cả 2 API gặp trục trặc mạng
    return (
        "Cảm ơn bạn đã quan tâm đến **INSIGHT AI**! Nền tảng của chúng tôi mô phỏng phản ứng thị trường "
        "thông qua 1.000 tác tử AI đối chuẩn theo khung Niên giám GSO và bộ dữ liệu 1 triệu hồ sơ Nemotron-Personas-Vietnam "
        "của FPT & NVIDIA (đã được Báo Nhân Dân đăng tải ngày 17/10/2026). "
        "Dữ liệu hoàn toàn PII-Free tuân thủ Nghị định 13/2023/NĐ-CP.\n\n"
        "Bạn có thể khởi tạo khảo sát ngay tại [Khởi tạo Khảo Sát](https://insight.1booking.asia/wizard) "
        "hoặc trải nghiệm gói kiểm thử thanh toán VietQR thật 10.000đ tại [Gói Test 10k](https://insight.1booking.asia/wizard?sample=50)."
    )
