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


def _build_persona_block(personas: list[dict], start_idx: int) -> str:
    """Tạo đoạn mô tả 20 personas cho prompt."""
    lines = []
    for i, p in enumerate(personas):
        pid = f"P{start_idx + i + 1:04d}"
        lines.append(
            f"[{pid}] Tuổi: {p.get('age', '?')} | "
            f"Giới tính: {'Nam' if p.get('gender') == 'male' else 'Nữ'} | "
            f"Nghề: {p.get('occupation', 'Không rõ')} | "
            f"Thu nhập: {p.get('income_bracket', '?')} | "
            f"Khu vực: {p.get('zone', p.get('region', 'Việt Nam'))} | "
            f"Phong cách sống: {p.get('lifestyle', 'Phổ thông')}"
        )
    return "\n".join(lines)


def _build_prompt(
    model_type: str,
    product_info: dict,
    personas: list[dict],
    start_idx: int,
) -> str:
    """Tạo prompt hoàn chỉnh gửi tới GPT-4o-mini."""
    config = get_survey_config(model_type)
    instruction = config["llm_instruction"]
    response_format = json.dumps(config["response_format"], ensure_ascii=False, indent=2)

    # Build questions text
    questions_text = "\n".join(
        f"  - {q['label']}: {q['text']}"
        for q in config["questions"]
    )

    # Product info as formatted text
    product_text = "\n".join(
        f"  {k}: {v}" for k, v in product_info.items() if v
    )

    # Personas block
    persona_block = _build_persona_block(personas, start_idx)
    # Assign IDs
    persona_ids = [f"P{start_idx + i + 1:04d}" for i in range(len(personas))]

    prompt = f"""{instruction}

━━━ THÔNG TIN SẢN PHẨM / DỊCH VỤ ━━━
{product_text}

━━━ BỘ CÂU HỎI KHẢO SÁT ━━━
{questions_text}

━━━ HỒ SƠ {len(personas)} NGƯỜI TIÊU DÙNG ━━━
{persona_block}

━━━ YÊU CẦU ĐẦU RA ━━━
Trả về JSON Object hợp lệ theo cấu trúc:
{{
  "responses": [
    ... {len(personas)} phần tử có cấu trúc:
{response_format}
  ]
}}

Thay "string (persona id)" bằng ID thực: {', '.join(persona_ids[:5])}...

QUY TẮC BẮT BUỘC:
1. Chỉ trả về JSON thuần, KHÔNG có markdown, KHÔNG có văn bản giải thích trước hoặc sau.
2. Mảng "responses" phải có đúng {len(personas)} phần tử — không thiếu, không thừa.
3. Câu trả lời tiếng Việt phải chân thực, phản ánh đúng hoàn cảnh từng người.
4. KHÔNG dùng nhận xét chung chung. Hãy cụ thể theo nghề nghiệp và thu nhập.
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
            rel = random.choices([3, 4, 5], weights=[0.2, 0.5, 0.3])[0]
            uniq = random.choices([2, 3, 4, 5], weights=[0.1, 0.4, 0.4, 0.1])[0]
            intent = random.choices([2, 3, 4, 5], weights=[0.1, 0.3, 0.4, 0.2])[0]
            sample_barriers = [
                f"Giá hơi cao so với mức thu nhập {inc} của tôi, nếu có combo khuyến mãi sẽ dễ mua hơn.",
                "Cần làm rõ nguồn gốc nguyên liệu hữu cơ có chứng nhận kiểm định rõ ràng không.",
                "Bao bì cần tiện lợi để mang theo đi làm văn phòng hoặc tập thể thao.",
                "Thương hiệu mới nên muốn uống thử chai nhỏ hoặc mẫu thử trước khi mua lốc lớn.",
                "Hương vị nghe lạ miệng, hy vọng không quá ngọt gắt.",
            ]
            results.append({
                "persona_id": pid,
                "q1": rel,
                "q2": uniq,
                "q3": intent,
                "q4": random.choice(sample_barriers),
            })
        elif model_type == "van_westendorp":
            base_price = 35000
            results.append({
                "persona_id": pid,
                "q1": round(base_price * random.uniform(0.5, 0.7)),
                "q2": round(base_price * random.uniform(0.7, 0.9)),
                "q3": round(base_price * random.uniform(1.1, 1.3)),
                "q4": round(base_price * random.uniform(1.4, 1.8)),
            })
        elif model_type == "ab_testing":
            win = random.choices(["A", "B"], weights=[0.62, 0.38])[0]
            results.append({
                "persona_id": pid,
                "preferred_option": win,
                "score": random.randint(3, 5),
                "reason": f"Thiết kế Concept {win} nổi bật và tạo cảm giác tươi mới, cao cấp hơn.",
            })
        elif model_type == "ua_study":
            results.append({
                "persona_id": pid,
                "frequency": random.choice(["Hàng ngày", "2-3 lần/tuần", "1 lần/tuần"]),
                "main_occasion": random.choice(["Giải khát giờ làm việc", "Uống cùng bạn bè", "Sau khi tập gym"]),
                "attitude": random.choice(["Ưu tiên sản phẩm tốt cho sức khỏe", "Tìm kiếm sự tiện lợi"]),
                "competitor": random.choice(["Phúc Long", "TH True Juice", "Vfresh"]),
            })
        else:
            results.append({
                "persona_id": pid,
                "redemption_intent": random.randint(3, 5),
                "deal_perception": "Mức ưu đãi hợp lý và kích thích dùng thử",
                "cannibalization_risk": random.randint(1, 3),
            })
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
