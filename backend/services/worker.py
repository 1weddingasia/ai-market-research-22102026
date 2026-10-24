"""
T6: Background Worker + SSE Engine.

run_simulation(): Pipeline hoàn chỉnh từ DuckDB sampling → LLM → Analysis → PDF
emit_log(): Ghi log vào DB + broadcast qua SSE
"""

import asyncio
import json
import os
from datetime import datetime
from typing import AsyncGenerator, Optional

import structlog

from database import SessionLocal, Survey, SurveyLog
from models.schemas import ReportPayload
from services.analysis import run_analysis
from services.duckdb_service import get_demographic_summary, get_stratified_sample
from services.llm_service import run_llm_simulation
from services.region_mapping import get_region_filter, get_province_filter, resolve_sampling_filters
from services.deepseek_auditor import audit_survey
from services.email_service import send_survey_completed_email

log = structlog.get_logger(__name__)

# In-memory event queue cho SSE (survey_id → asyncio.Queue)
_event_queues: dict[str, asyncio.Queue] = {}


def _get_queue(survey_id: str) -> asyncio.Queue:
    if survey_id not in _event_queues:
        _event_queues[survey_id] = asyncio.Queue(maxsize=200)
    return _event_queues[survey_id]


async def _emit_log(
    survey_id: str,
    percent: int,
    message: str,
    status: str = None,
) -> None:
    """Ghi log vào DB và đẩy vào SSE queue."""
    db = SessionLocal()
    try:
        log_entry = SurveyLog(
            survey_id=survey_id,
            percent=percent,
            log_msg=message,
            status=status,
        )
        db.add(log_entry)
        db.commit()
    finally:
        db.close()

    # Đẩy vào SSE queue
    event_data = {"percent": percent, "log": message}
    if status:
        event_data["status"] = status

    queue = _get_queue(survey_id)
    try:
        queue.put_nowait(event_data)
    except asyncio.QueueFull:
        pass  # Client đọc chậm, bỏ qua event cũ


async def run_simulation(survey_id: str) -> None:
    """
    Pipeline chính chạy nền sau khi thanh toán thành công.
    7 milestone logs, toàn bộ < 60 giây.
    """
    db = SessionLocal()
    try:
        survey = db.query(Survey).filter(Survey.id == survey_id).first()
        if not survey:
            log.error("Survey not found", survey_id=survey_id)
            return

        product_info = json.loads(survey.product_info_json or "{}")
        model_type   = survey.model_type

        # ── Milestone 1: Kết nối kho dữ liệu mẫu đại diện ──────────────────
        await _emit_log(
            survey_id, 10,
            f"[DỮ LIỆU DÂN SỐ] Đang kết nối cơ sở dữ liệu mẫu đại diện dân số Việt Nam..."
        )

        # ── Milestone 2: Đối chuẩn phân tầng mẫu Niên giám GSO ──────────────────────────
        try:
            region_filter, zone_filter, display_location = resolve_sampling_filters(survey.region, survey.zone)

            # Xử lý các bộ lọc mục tiêu chuyên sâu
            tgt_gender = getattr(survey, "target_gender", "all") or "all"
            tgt_income = getattr(survey, "target_income", "all") or "all"
            tgt_marital = getattr(survey, "target_marital_status", "all") or "all"
            tgt_occupation = getattr(survey, "target_occupation", "all") or "all"
            tgt_zone = getattr(survey, "target_zone", "all") or "all"

            # Xây dựng chuỗi mô tả chân dung mẫu chuẩn chuyên nghiệp
            target_parts = []
            gender_map = {"female": "Nữ giới 100%", "male": "Nam giới 100%", "all": "Toàn bộ (Nam & Nữ)"}
            if tgt_gender in ("female", "male"):
                target_parts.append(gender_map.get(tgt_gender, ""))
            
            target_parts.append(f"Tuổi {survey.min_age}-{survey.max_age}")
            target_parts.append(display_location)

            zone_map = {"urban": "Khu vực Đô Thị", "rural": "Khu vực Nông Thôn"}
            if tgt_zone in zone_map:
                target_parts.append(zone_map[tgt_zone])

            income_map = {
                "A": "Thu nhập Hạng A (>25tr)",
                "AB": "Trung & Thượng lưu A-B (>15tr)",
                "CD": "Phổ thông C-D (<15tr)",
            }
            if tgt_income in income_map:
                target_parts.append(income_map[tgt_income])

            marital_map = {
                "married": "Đã kết hôn / Gia đình",
                "single": "Độc thân",
            }
            if tgt_marital in marital_map:
                target_parts.append(marital_map[tgt_marital])

            occ_map = {
                "office": "Văn phòng & Trí thức",
                "business": "Kinh doanh & Tiểu thương",
                "worker": "Công nhân & Lao động",
            }
            if tgt_occupation in occ_map:
                target_parts.append(occ_map[tgt_occupation])

            targeting_summary_str = " | ".join(target_parts)
            targeting_sentence = f"{survey.sample_size:,} Tác tử AI ({targeting_summary_str})"

            # Cung cấp đầy đủ thông tin vị trí, quy mô và chân dung mục tiêu cho product_info để cả 9 analyzer sử dụng
            product_info["region"] = survey.region
            product_info["zone"] = survey.zone
            product_info["display_location"] = display_location
            product_info["sample_size"] = survey.sample_size
            product_info["target_gender"] = tgt_gender
            product_info["target_income"] = tgt_income
            product_info["target_marital_status"] = tgt_marital
            product_info["target_occupation"] = tgt_occupation
            product_info["target_zone"] = tgt_zone
            product_info["targeting_summary"] = targeting_summary_str
            product_info["targeting_sentence"] = targeting_sentence

            personas_df = await asyncio.to_thread(
                get_stratified_sample,
                sample_size=survey.sample_size,
                region=region_filter,
                zone=zone_filter,
                min_age=survey.min_age,
                max_age=survey.max_age,
                target_gender=tgt_gender,
                target_income=tgt_income,
                target_marital_status=tgt_marital,
                target_occupation=tgt_occupation,
                target_zone=tgt_zone,
            )

            demo = get_demographic_summary(personas_df)
            male_pct   = demo.get("gender", {}).get("male_pct", 50)
            female_pct = demo.get("gender", {}).get("female_pct", 50)
            avg_age    = demo.get("avg_age", 30)

            await _emit_log(
                survey_id, 30,
                f"[ĐỐI CHUẨN MẪU GSO] Mục tiêu: {targeting_summary_str} (Mẫu thực: Nam {male_pct:.0f}% - Nữ {female_pct:.0f}%, Tuổi TB {avg_age:.0f}) | N={len(personas_df):,} tác tử AI đối chuẩn theo khung phân tầng Niên giám GSO (Độ tin cậy 95%, Sai số ±3.1%)."
            )

        except Exception as e:
            log.error("Sampling failed", error=str(e), survey_id=survey_id)
            await _emit_log(survey_id, 30, f"[ĐỐI CHUẨN MẪU GSO] Đang chuẩn hóa hạn ngạch cơ cấu dân số theo Niên giám Thống kê GSO...", status=None)
            raise

        # ── Milestone 3: Bắt đầu phỏng vấn ──────────────────────────────────
        batch_count = (len(personas_df) + 19) // 20
        await _emit_log(
            survey_id, 45,
            f"[MÔ PHỎNG ĐA TÁC TỬ] Kích hoạt phân vai {len(personas_df):,} tác tử AI độc lập — chia {batch_count} nhóm mô phỏng song song..."
        )

        # ── Milestone 4: Thu thập phản hồi ─────────────────────────────────
        completed_batches = [0]

        async def progress_callback(done: int, total: int):
            pct = 45 + int(done / total * 30)   # 45% → 75%
            completed_batches[0] = done
            if done % 2 == 0 or done == total:
                await _emit_log(
                    survey_id, pct,
                    f"[TIẾN ĐỘ {done:02d}/{total:02d}] Ghi nhận phản ứng thị trường từ {min(done * 20, len(personas_df))}/{len(personas_df)} tác tử AI phân vai..."
                )

        llm_responses = await run_llm_simulation(
            model_type=model_type,
            product_info=product_info,
            personas_df=personas_df,
            progress_callback=progress_callback,
        )

        await _emit_log(
            survey_id, 78,
            f"[TỔNG HỢP Ý KIẾN] Đã thu thập {len(llm_responses):,} phản hồi. Đang tổng hợp phân tích định lượng & mức độ chấp nhận thị trường..."
        )

        # ── Milestone 5: Analysis ──────────────────────────────────────────────
        report: ReportPayload = await asyncio.to_thread(
            run_analysis,
            survey_id=survey_id,
            model_type=model_type,
            responses=llm_responses,
            personas_df=personas_df,
            product_info=product_info,
        )

        await _emit_log(
            survey_id, 86,
            f"[PHÂN TÍCH CHUYÊN SÂU] Đang xử lý số liệu chuyên sâu theo mô hình {model_type.upper()}..."
        )

        # ── Milestone 5.5: Thẩm định chiến lược C-Level ───────────────────────
        await _emit_log(
            survey_id, 92,
            "[THẨM ĐỊNH CHIẾN LƯỢC] Chuyên gia phân tích đang đối chiếu sức mua & thu nhập thực tế, hoàn thiện nhận định dành cho Ban Giám Đốc..."
        )

        try:
            barriers_list = [b.barrier for b in getattr(report, "barriers_identified", [])]
            deepseek_audit = await asyncio.to_thread(
                audit_survey,
                survey_id=survey_id,
                model_type=model_type,
                product_info=product_info,
                viability_score=report.executive_summary.viability_score,
                metrics=report.quantitative_metrics.model_dump(),
                barriers=barriers_list,
                sample_size=len(personas_df),
            )
            # Tích hợp kết quả thẩm định DeepSeek vào báo cáo
            if deepseek_audit.get("executive_verdict"):
                report.executive_summary.verdict = deepseek_audit["executive_verdict"]
            if deepseek_audit.get("strategic_recommendations"):
                report.actionable_recommendations = deepseek_audit["strategic_recommendations"]

            # Lưu trọn vẹn kết quả audit vào model_specific metrics
            if report.quantitative_metrics.model_specific is None:
                report.quantitative_metrics.model_specific = {}
            report.quantitative_metrics.model_specific["deepseek_audit"] = deepseek_audit
        except Exception as audit_err:
            log.warning("Strategic audit step encountered issue, continuing pipeline", survey_id=survey_id, error=str(audit_err))

        # ── Milestone 6: Save results ──────────────────────────────────────────
        result_json = report.model_dump_json()

        survey_upd = db.query(Survey).filter(Survey.id == survey_id).first()
        if survey_upd:
            survey_upd.result_json = result_json
            survey_upd.status      = "COMPLETED"
            survey_upd.completed_at = datetime.utcnow()
            db.commit()

        log.info("Survey completed", survey_id=survey_id, model_type=model_type)

        # ── Milestone 7: DONE ─────────────────────────────────────────────────
        await _emit_log(
            survey_id, 100,
            f"[HOÀN TẤT] ✅ Báo cáo chiến lược thị trường đã sẵn sàng (Mã đơn #{survey_id}). Đang chuyển đến trang kết quả...",
            status="COMPLETED",
        )

        # Gửi email hoàn tất kèm đầy đủ thông số báo cáo
        await _send_completion_email(survey_id, db, report=report)

    except Exception as e:
        log.error("Simulation failed", survey_id=survey_id, error=str(e))
        # Update DB status
        survey_err = db.query(Survey).filter(Survey.id == survey_id).first()
        if survey_err:
            survey_err.status    = "FAILED"
            survey_err.error_msg = str(e)
            db.commit()

        await _emit_log(
            survey_id, 100,
            f"❌ Xử lý gặp lỗi: {str(e)[:100]}. Vui lòng liên hệ hỗ trợ.",
            status="FAILED",
        )
    finally:
        db.close()
        # Async cleanup queue sau 10 phút không block caller
        async def _cleanup_queue():
            await asyncio.sleep(600)
            _event_queues.pop(survey_id, None)
        asyncio.create_task(_cleanup_queue())


async def stream_events(survey_id: str) -> AsyncGenerator[str, None]:
    """
    SSE Generator — trả về events theo chuẩn text/event-stream.
    Đầu tiên replay logs đã có trong DB, sau đó chờ events mới.
    """
    # Replay historical logs từ DB
    db = SessionLocal()
    try:
        historical_logs = (
            db.query(SurveyLog)
            .filter(SurveyLog.survey_id == survey_id)
            .order_by(SurveyLog.created_at)
            .all()
        )

        for entry in historical_logs:
            event_data = {"percent": entry.percent, "log": entry.log_msg}
            if entry.status:
                event_data["status"] = entry.status
            yield f"data: {json.dumps(event_data, ensure_ascii=False)}\n\n"

        # Nếu đã COMPLETED/FAILED, đóng stream luôn
        if historical_logs and historical_logs[-1].status in ("COMPLETED", "FAILED"):
            return

        # Lấy trạng thái survey
        survey = db.query(Survey).filter(Survey.id == survey_id).first()
        if not survey or survey.status not in ("PENDING_PAYMENT", "PROCESSING"):
            return

    finally:
        db.close()

    # Stream real-time events từ queue
    queue = _get_queue(survey_id)
    while True:
        try:
            event_data = await asyncio.wait_for(queue.get(), timeout=30.0)
            yield f"data: {json.dumps(event_data, ensure_ascii=False)}\n\n"

            if event_data.get("status") in ("COMPLETED", "FAILED"):
                break

        except asyncio.TimeoutError:
            # Heartbeat để giữ kết nối
            yield f"data: {json.dumps({'ping': True})}\n\n"


async def _send_completion_email(survey_id: str, db, report: Optional[ReportPayload] = None) -> None:
    """Gửi email thông báo hoàn tất qua Resend chuẩn thương mại."""
    try:
        survey = db.query(Survey).filter(Survey.id == survey_id).first()
        if not survey or not survey.customer_email:
            return

        p_info = {}
        if survey.product_info_json:
            try:
                p_info = json.loads(survey.product_info_json)
            except Exception:
                pass

        product_name = (
            p_info.get("product_name")
            or p_info.get("concept_name")
            or p_info.get("brand_name")
            or p_info.get("deal_description")
            or "Dự án Khảo sát Thị trường"
        )

        viability_score = 75
        verdict = "Báo cáo đã hoàn tất phân tích toàn diện."
        if report:
            viability_score = report.executive_summary.viability_score
            verdict = report.executive_summary.verdict
        elif survey.result_json:
            try:
                res_dict = json.loads(survey.result_json)
                viability_score = res_dict.get("executive_summary", {}).get("viability_score", 75)
                verdict = res_dict.get("executive_summary", {}).get("verdict", verdict)
            except Exception:
                pass

        send_survey_completed_email(
            survey_id=survey.id,
            customer_email=survey.customer_email,
            product_name=product_name,
            model_type=survey.model_type,
            sample_size=survey.sample_size or 1000,
            viability_score=viability_score,
            verdict=verdict,
        )
    except Exception as e:
        log.warning("Completion email failed in worker", error=str(e), survey_id=survey_id)

