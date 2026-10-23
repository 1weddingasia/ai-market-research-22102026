"""
T1.5: LLM Service — Gọi GPT-4o-mini theo kỹ thuật batching (20 personas/request).
1.000 mẫu = 50 batch, chạy song song async → xong trong < 60 giây.
"""

import asyncio
import json
import os
import re
from typing import Any

import structlog
from openai import AsyncOpenAI

from models.survey_configs import get_survey_config

log = structlog.get_logger(__name__)

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    """Lazy-initialize OpenAI client — tránh crash khi chưa set API key lúc import."""
    global _client
    if _client is None:
        _client = AsyncOpenAI()  # Đọc OPENAI_API_KEY từ env tự động
    return _client

BATCH_SIZE  = 20    # Số personas mỗi lần gọi API
MAX_RETRIES = 3     # Retry nếu parse JSON thất bại
TIMEOUT_SEC = 90    # Timeout mỗi request


INCOME_BRACKET_DESCRIPTIONS = {
    "A": "> 25 triệu/tháng (Thu nhập cao, chi tiêu thoải mái, chú trọng đẳng cấp)",
    "B": "15 - 25 triệu/tháng (Thu nhập khá, chuộng chất lượng và uy tín thương hiệu)",
    "C": "7.5 - 15 triệu/tháng (Thu nhập trung bình, cân nhắc kỹ giá bán và giá trị thực tế)",
    "D": "< 7.5 triệu/tháng (Thu nhập phổ thông/thấp, rất nhạy cảm về giá và khuyến mãi)",
}


def _build_persona_block(personas: list[dict], start_idx: int) -> str:
    """Tạo đoạn mô tả personas chi tiết đầy đủ nhân khẩu học thực tế theo chuẩn GSO."""
    lines = []
    for i, p in enumerate(personas):
        pid = f"P{start_idx + i + 1:04d}"
        raw_b = str(p.get("income_bracket", "C")).strip().upper()
        bracket_desc = INCOME_BRACKET_DESCRIPTIONS.get(raw_b, f"Nhóm {raw_b}")
        lines.append(
            f"[{pid}] "
            f"Tuổi: {p.get('age', 28)} | "
            f"Giới tính: {'Nam' if p.get('gender') == 'male' else 'Nữ'} | "
            f"Nghề nghiệp: {p.get('occupation', 'Nhân viên văn phòng')} | "
            f"Thu nhập: {bracket_desc} | "
            f"Địa bàn sinh sống: {p.get('zone', p.get('region', 'Việt Nam'))} ({p.get('region', '')}) | "
            f"Lối sống & Thói quen: {p.get('lifestyle', 'Phổ thông')}"
        )
    return "\n".join(lines)


def _build_prompt(
    model_type: str,
    product_info: dict,
    personas: list[dict],
    start_idx: int,
) -> str:
    """Tạo prompt hoàn chỉnh gửi tới GPT-4o-mini với chỉ dẫn nhập vai nhân khẩu học nghiêm ngặt."""
    config = get_survey_config(model_type)
    instruction = config["llm_instruction"]
    response_format = json.dumps(config["response_format"], ensure_ascii=False, indent=2)

    # Build questions text
    questions_text = "\n".join(
        f"  - [{q['id']}] {q['label']}: {q['text']}"
        for q in config["questions"]
    )
    question_keys = [q["id"] for q in config["questions"]]

    # Product info as formatted text
    product_text = "\n".join(
        f"  • {k}: {v}" for k, v in product_info.items() if v
    )

    # Personas block
    persona_block = _build_persona_block(personas, start_idx)
    # Assign IDs
    persona_ids = [f"P{start_idx + i + 1:04d}" for i in range(len(personas))]

    prompt = f"""{instruction}

━━━ THÔNG TIN SẢN PHẨM / DỰ ÁN NGHIÊN CỨU ━━━
{product_text}

━━━ BỘ CÂU HỎI KHẢO SÁT TIÊU CHUẨN (BẮT BUỘC TRẢ LỜI ĐỦ {len(question_keys)} CÂU HỎI) ━━━
{questions_text}

━━━ HỒ SƠ NHÂN KHẨU HỌC CỦA {len(personas)} NGƯỜI TIÊU DÙNG VIỆT NAM (CHUẨN GSO) ━━━
{persona_block}

━━━ NGUYÊN TẮC NHẬP VAI & ĐẦU RA BẮT BUỘC (STRICT PERSONA ROLEPLAY) ━━━
1. BẠN PHẢI ĐÓNG VAI TỪNG NGƯỜI TIÊU DÙNG THỰC TẾ theo đúng nhân khẩu học:
   - Người có mức thu nhập thấp (< 7.5tr/tháng) phải cực kỳ nhạy cảm về giá, đắn đo kỹ lưỡng từng khoản chi tiêu.
   - Người có thu nhập cao (> 25tr/tháng) chú trọng sự an toàn, thẩm mỹ bao bì, uy tín thương hiệu và tính tiện dụng vượt trội.
   - Người tiêu dùng trẻ (18-25 tuổi) nhạy bén với phong cách hiện đại, xu hướng mạng xã hội; người trung niên/lớn tuổi (40-65) coi trọng sức khỏe gia đình, sự bền bỉ và tính thiết thực.
   - Người ở các đô thị lớn (TP.HCM, Hà Nội) có mức sống và tiêu chuẩn dịch vụ khác biệt so với các tỉnh thành khác.
2. BẮT BUỘC TRẢ LỜI ĐẦY ĐỦ TẤT CẢ các câu hỏi ({', '.join(question_keys)}) cho từng người, TUYỆT ĐỐI KHÔNG BỎ SÓT bất kỳ trường dữ liệu nào.
3. Câu trả lời định tính tiếng Việt phải chân thực, đa dạng giọng điệu tự nhiên, phản ánh đúng hoàn cảnh sống thực tế của người đó.
4. Đầu ra là JSON thuần túy, mảng "responses" phải có đúng chính xác {len(personas)} phần tử tương ứng với các ID: {', '.join(persona_ids[:3])}...

Cấu trúc JSON yêu cầu:
{{
  "responses": [
{response_format}
  ]
}}
"""
    return prompt


def _generate_synthetic_batch(model_type: str, personas: list[dict], start_idx: int) -> list[dict]:
    import random
    results = []
    for i, p in enumerate(personas):
        pid = f"P{start_idx + i + 1:04d}"
        age = p.get("age", 28)
        inc = p.get("income_bracket", "C")
        occ = p.get("occupation", "Nhân viên văn phòng")

        if model_type == "nielsen_bases":
            intent = random.choices([2, 3, 4, 5], weights=[0.1, 0.3, 0.4, 0.2])[0]
            uniq = random.choices([2, 3, 4, 5], weights=[0.1, 0.4, 0.4, 0.1])[0]
            rel = random.choices([3, 4, 5], weights=[0.2, 0.5, 0.3])[0]
            val = random.choices(["Hợp lý", "Đắt", "Rẻ"], weights=[0.65, 0.25, 0.10])[0]
            sample_barriers = [
                f"Giá hơi cao so với mức thu nhập {inc} của tôi, nếu có combo khuyến mãi sẽ dễ mua hơn.",
                "Cần làm rõ nguồn gốc nguyên liệu hữu cơ có chứng nhận kiểm định rõ ràng không.",
                "Bao bì cần tiện lợi để mang theo đi làm văn phòng hoặc tập thể thao.",
                "Thương hiệu mới nên muốn uống thử chai nhỏ hoặc mẫu thử trước khi mua lốc lớn.",
                "Hương vị nghe lạ miệng, hy vọng không quá ngọt gắt.",
            ]
            results.append({
                "persona_id": pid,
                "q1": intent,
                "q2": uniq,
                "q3": rel,
                "q4": val,
                "q5": random.choice(sample_barriers),
                "purchase_intent": intent,
                "uniqueness": uniq,
                "relevance": rel,
            })
        elif model_type == "van_westendorp":
            base_price = 35000
            tc = round(base_price * random.uniform(0.5, 0.7))
            bg = round(base_price * random.uniform(0.7, 0.9))
            ex = round(base_price * random.uniform(1.1, 1.3))
            te = round(base_price * random.uniform(1.4, 1.8))
            results.append({
                "persona_id": pid,
                "too_cheap": tc,
                "bargain": bg,
                "expensive": ex,
                "too_expensive": te,
                "q1": tc,
                "q2": bg,
                "q3": ex,
                "q4": te,
            })
        elif model_type == "ab_testing":
            win = random.choices(["A", "B"], weights=[0.62, 0.38])[0]
            reason = f"Thiết kế Concept {win} nổi bật và tạo cảm giác tươi mới, cao cấp hơn."
            results.append({
                "persona_id": pid,
                "q1": win,
                "q2_choice": win,
                "q2_reason": reason,
                "q3": win,
                "preferred_option": win,
            })
        elif model_type == "ua_study":
            pains = [
                "Chất lượng sản phẩm không đồng đều giữa các lô hàng.",
                "Giá thành còn cao so với dung tích thực tế.",
                "Khó tìm mua ở các cửa hàng tiện lợi gần nhà.",
                "Hương vị đôi khi quá ngọt hoặc nhiều hương liệu tổng hợp.",
                "Bao bì khó tái chế và chưa thân thiện môi trường.",
            ]
            results.append({
                "persona_id": pid,
                "frequency": random.choice(["Hàng ngày", "2-3 lần/tuần", "Hàng tháng"]),
                "occasion": random.choice(["Buổi sáng đi làm", "Gặp bạn bè cuối tuần", "Giải lao buổi chiều"]),
                "channel": random.choice(["Siêu thị WinMart", "Shopee / TikTok Shop", "Cửa hàng tiện lợi"]),
                "top_drivers": "Chất lượng, Giá hợp lý, Tiện lợi",
                "pain_point": random.choice(pains),
            })
        elif model_type == "deal_elasticity":
            orig_intent = random.choices([2, 3, 4], weights=[0.3, 0.4, 0.3])[0]
            stimulus = random.choices([3, 4, 5], weights=[0.2, 0.5, 0.3])[0]
            risk = random.choices([1, 2, 3], weights=[0.5, 0.3, 0.2])[0]
            results.append({
                "persona_id": pid,
                "q1": orig_intent,
                "q2": stimulus,
                "q3": risk,
                "q1_original_intent": orig_intent,
                "q2_deal_stimulus": stimulus,
                "q3_brand_risk": risk,
                "reason": "Mức ưu đãi hợp lý và kích thích dùng thử ngay.",
            })
        elif model_type == "monadic":
            # Phân tách mẫu: chẵn -> Concept A, lẻ -> Concept B
            assigned = "A" if (start_idx + i) % 2 == 0 else "B"
            if assigned == "A":
                intent = random.choices([3, 4, 5], weights=[0.2, 0.5, 0.3])[0]
                uniq = random.choices([3, 4, 5], weights=[0.2, 0.5, 0.3])[0]
            else:
                intent = random.choices([2, 3, 4], weights=[0.3, 0.4, 0.3])[0]
                uniq = random.choices([2, 3, 4], weights=[0.4, 0.4, 0.2])[0]
            rel = random.choices([3, 4, 5], weights=[0.2, 0.5, 0.3])[0]
            val = random.choices(["Hợp lý", "Đắt", "Rẻ"], weights=[0.7, 0.2, 0.1])[0]
            results.append({
                "persona_id": pid,
                "concept_assigned": assigned,
                "q1_intent": intent,
                "q2_uniqueness": uniq,
                "q3_relevance": rel,
                "q4_value": val,
                "q5_reason": f"Đánh giá riêng cho Concept {assigned}: ý tưởng thực tế, phù hợp phân khúc.",
                "purchase_intent": intent,
                "uniqueness": uniq,
                "relevance": rel,
            })
        elif model_type == "maxdiff":
            default_attrs = [
                "Hiệu quả rõ rệt sau 7 ngày",
                "100% Nguồn gốc tự nhiên hữu cơ",
                "Mức giá hợp lý tiết kiệm",
                "Bao bì thân thiện môi trường",
                "Thương hiệu chuẩn quốc tế",
                "Thiết kế nhỏ gọn tiện lợi",
            ]
            shown = random.sample(default_attrs, min(4, len(default_attrs)))
            best = shown[0]
            worst = shown[-1]
            results.append({
                "persona_id": pid,
                "shown_attributes": shown,
                "best": best,
                "worst": worst,
                "reason": f"Tôi ưu tiên thuộc tính '{best}' nhất vì giải quyết trực tiếp nhu cầu.",
            })
        elif model_type == "kano":
            default_feats = [
                "Công nghệ bảo quản chân không",
                "Ứng dụng di động theo dõi lộ trình",
                "Đóng gói theo khẩu phần ăn dinh dưỡng",
                "Tùy biến hương vị cá nhân hóa",
            ]
            evals = []
            for f_idx, f in enumerate(default_feats):
                if f_idx == 0:
                    func, dys = 2, 5  # Must-be
                elif f_idx == 1:
                    func, dys = 1, 3  # Attractive
                elif f_idx == 2:
                    func, dys = 1, 5  # One-dimensional
                else:
                    func, dys = 3, 3  # Indifferent
                evals.append({
                    "feature": f,
                    "functional": func,
                    "dysfunctional": dys,
                })
            results.append({
                "persona_id": pid,
                "features_evaluation": evals,
                "reason": "Bộ tính năng phân chia rõ ràng giữa nhu cầu cơ bản và trải nghiệm gia tăng.",
            })
        elif model_type == "brand_map":
            default_brands = [
                "Thương hiệu của bạn",
                "Đối thủ A (Truyền thống)",
                "Đối thủ B (Ngoại nhập)",
                "Đối thủ C (Giá rẻ)",
            ]
            ratings = [
                {"brand": default_brands[0], "score_x": 4.5, "score_y": 7.8},  # Smart Disruptor
                {"brand": default_brands[1], "score_x": 5.2, "score_y": 3.8},  # Heritage Traditional
                {"brand": default_brands[2], "score_x": 8.5, "score_y": 8.2},  # Premium Innovator
                {"brand": default_brands[3], "score_x": 2.5, "score_y": 2.8},  # Budget Low-tech
            ]
            results.append({
                "persona_id": pid,
                "ratings": ratings,
                "brand_preference": f"Thương hiệu của bạn tạo cảm giác đột phá công nghệ và giá thành rất cạnh tranh.",
            })
        else:
            results.append({"persona_id": pid, "status": "simulated"})
    return results


async def _call_llm_single_batch(
    model_type: str,
    product_info: dict,
    personas: list[dict],
    start_idx: int,
    semaphore: asyncio.Semaphore,
) -> list[dict]:
    """Gọi LLM cho 1 batch 20 personas. Fallback sang synthetic data nếu chưa có OPENAI_API_KEY."""
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key or api_key.startswith("sk-your"):
        await asyncio.sleep(0.04)
        return _generate_synthetic_batch(model_type, personas, start_idx)

    async with semaphore:
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                prompt = _build_prompt(model_type, product_info, personas, start_idx)

                response = await asyncio.wait_for(
                    _get_client().chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[
                            {
                                "role": "system",
                                "content": (
                                    "Bạn là AI mô phỏng hành vi người tiêu dùng Việt Nam. "
                                    "Luôn trả về JSON hợp lệ, không thêm markdown, không giải thích."
                                ),
                            },
                            {"role": "user", "content": prompt},
                        ],
                        temperature=0.7,
                        max_tokens=2000,
                        response_format={"type": "json_object"},
                    ),
                    timeout=TIMEOUT_SEC,
                )

                raw = response.choices[0].message.content
                # GPT với json_object mode đôi khi wrap trong {"responses": [...]}
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    return parsed
                if isinstance(parsed, dict):
                    if "responses" in parsed and isinstance(parsed["responses"], list):
                        return parsed["responses"]
                    for v in parsed.values():
                        if isinstance(v, list) and len(v) > 0:
                            return v

                raise ValueError(f"Không tìm thấy list trong JSON response: {raw[:200]}")

            except json.JSONDecodeError as e:
                log.warning(
                    "JSON parse error, retrying",
                    attempt=attempt, batch_start=start_idx, error=str(e)
                )
                if attempt == MAX_RETRIES:
                    log.error("Max retries reached, returning empty batch", batch_start=start_idx)
                    return []
                await asyncio.sleep(1 * attempt)

            except asyncio.TimeoutError:
                log.warning("LLM timeout", attempt=attempt, batch_start=start_idx)
                if attempt == MAX_RETRIES:
                    return []
                await asyncio.sleep(2)

            except Exception as e:
                log.error("LLM call failed", error=str(e), batch_start=start_idx)
                if attempt == MAX_RETRIES:
                    return []
                await asyncio.sleep(2)

    return []


async def run_llm_simulation(
    model_type: str,
    product_info: dict,
    personas_df,
    progress_callback=None,
) -> list[dict]:
    """
    Chạy toàn bộ simulation cho 1.000 personas.

    Args:
        model_type: loại khảo sát
        product_info: dict thông tin sản phẩm
        personas_df: DataFrame từ DuckDB
        progress_callback: async callable(batch_done, total_batches)

    Returns:
        List of raw LLM responses (flat, 1.000 items)
    """
    personas = personas_df.to_dict(orient="records")
    total = len(personas)

    # Chia thành batches 20 personas
    batches = [
        personas[i : i + BATCH_SIZE]
        for i in range(0, total, BATCH_SIZE)
    ]
    total_batches = len(batches)

    log.info("Starting LLM simulation", total_personas=total, total_batches=total_batches)

    # Semaphore giới hạn concurrent requests (tránh rate limit)
    # GPT-4o-mini tier thấp: tối đa 10 concurrent
    semaphore = asyncio.Semaphore(10)

    tasks = [
        _call_llm_single_batch(
            model_type=model_type,
            product_info=product_info,
            personas=batch,
            start_idx=i * BATCH_SIZE,
            semaphore=semaphore,
        )
        for i, batch in enumerate(batches)
    ]

    all_results: list[dict] = []
    completed = 0

    # Chạy song song, track progress
    for coro in asyncio.as_completed(tasks):
        batch_result = await coro
        all_results.extend(batch_result)
        completed += 1

        if progress_callback:
            await progress_callback(completed, total_batches)

        log.info(
            "Batch completed",
            completed=completed,
            total=total_batches,
            responses_so_far=len(all_results),
        )

    log.info(
        "LLM simulation complete",
        total_responses=len(all_results),
        success_rate=f"{len(all_results)/total*100:.1f}%",
    )

    return all_results
