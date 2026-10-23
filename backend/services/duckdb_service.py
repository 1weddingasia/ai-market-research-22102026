"""
T0.6: DuckDB Service — Kết nối Cloudflare R2 và lấy mẫu phân tầng.

Được dùng bởi: background worker trong routers/stream.py
"""

import os
import time
from pathlib import Path
from typing import Optional

import duckdb
import pandas as pd
import structlog

log = structlog.get_logger(__name__)

# ─── Singleton connection ──────────────────────────────────────────────────────
_con: Optional[duckdb.DuckDBPyConnection] = None


def _resolve_local_parquet_path() -> Optional[str]:
    """
    Ưu tiên tìm file personas_vn_1m.parquet ở local disk (tốc độ ~0.05s).
    Kiểm tra:
    1. Biến môi trường LOCAL_PARQUET_PATH
    2. Thư mục backend/personas_vn_1m.parquet
    3. Thư mục hiện tại cwd/personas_vn_1m.parquet
    4. Thư mục cwd/backend/personas_vn_1m.parquet
    Trả về đường dẫn chuẩn hóa (forward slashes) nếu tồn tại, ngược lại None.
    """
    env_path = os.getenv("LOCAL_PARQUET_PATH", "").strip()
    candidates = []
    if env_path:
        candidates.append(Path(env_path))

    backend_dir = Path(__file__).resolve().parent.parent
    candidates.append(backend_dir / "personas_vn_1m.parquet")
    candidates.append(Path.cwd() / "personas_vn_1m.parquet")
    candidates.append(Path.cwd() / "backend" / "personas_vn_1m.parquet")

    for cand in candidates:
        try:
            if cand.is_file() and cand.stat().st_size > 100_000_000:
                return cand.resolve().as_posix()
        except OSError:
            continue

    return None


def _get_connection() -> duckdb.DuckDBPyConnection:
    """Trả về DuckDB connection — ưu tiên local file (~0.05s), chỉ fallback R2 khi thiếu file local."""
    global _con
    if _con is not None:
        return _con

    local_file = _resolve_local_parquet_path()
    con = duckdb.connect()

    # --- ƯU TIÊN 1: LOCAL MODE nếu file tồn tại ---
    if local_file:
        log.info("duckdb_local_mode_active", path=local_file, priority="local_disk_first")
        _con = con
        return _con

    # --- FALLBACK: R2 MODE qua httpfs ---
    endpoint = os.getenv("R2_ENDPOINT", "").replace("https://", "").rstrip("/")
    key      = os.getenv("R2_ACCESS_KEY_ID", "")
    secret   = os.getenv("R2_SECRET_ACCESS_KEY", "")

    if not all([endpoint, key, secret]):
        raise RuntimeError(
            "Không tìm thấy file Parquet local và thiếu thông tin R2 credentials. "
            "Cần có file personas_vn_1m.parquet tại backend/ hoặc cấu hình R2 trong .env"
        )

    log.info("duckdb_fallback_to_cloudflare_r2", endpoint=endpoint)
    con.execute("INSTALL httpfs; LOAD httpfs;")
    con.execute("SET s3_use_ssl = true;")
    con.execute(f"SET s3_endpoint = '{endpoint}';")
    con.execute(f"SET s3_access_key_id = '{key}';")
    con.execute(f"SET s3_secret_access_key = '{secret}';")
    con.execute("SET s3_region = 'auto';")
    con.execute("SET s3_url_style = 'path';")

    _con = con
    log.info("duckdb_connected_to_r2", endpoint=endpoint)
    return _con


def _get_parquet_path() -> str:
    """Trả về đường dẫn Parquet — ưu tiên local, fallback sang s3://..."""
    local_file = _resolve_local_parquet_path()
    if local_file:
        return local_file
    bucket = os.getenv("R2_BUCKET_NAME", "personas-vietnam")
    key    = os.getenv("R2_FILE_KEY", "personas_vn_1m.parquet")
    return f"s3://{bucket}/{key}"


def get_stratified_sample(
    sample_size: int = 1000,
    region: Optional[str] = None,
    zone: Optional[str] = None,
    min_age: int = 18,
    max_age: int = 65,
    gender: Optional[str] = None,
    income_bracket: Optional[str] = None,
    target_gender: Optional[str] = "all",
    target_income: Optional[str] = "all",
    target_marital_status: Optional[str] = "all",
    target_occupation: Optional[str] = "all",
    target_zone: Optional[str] = "all",
    seed: int = 42,
) -> pd.DataFrame:
    """
    Lấy mẫu ngẫu nhiên phân tầng từ Parquet file với 6 bộ lọc đối tượng mục tiêu chuyên sâu:
    - Khu vực & Tỉnh thành (region, zone)
    - Dải tuổi (min_age, max_age)
    - Giới tính (target_gender: all, female, male)
    - Mức thu nhập (target_income: all, AB, A, CD)
    - Môi trường sống (target_zone: all, urban, rural)
    - Tình trạng hôn nhân (target_marital_status: all, married, single)
    - Nhóm nghề nghiệp (target_occupation: all, office, business, worker)
    """
    con = _get_connection()
    parquet = _get_parquet_path()

    # ── Chuẩn hóa và xây dựng các điều kiện WHERE ─────────────────────────────
    conditions = [f"age BETWEEN {min_age} AND {max_age}"]

    # 1. Khu vực vùng miền
    if region:
        conditions.append(f"region = '{region}'")

    # 2. Môi trường sống / Tỉnh thành
    eff_zone = None
    if target_zone == "urban":
        eff_zone = "Đô Thị"
    elif target_zone == "rural":
        eff_zone = "Nông Thôn"
    elif zone:
        eff_zone = zone

    if eff_zone:
        conditions.append(f"zone = '{eff_zone}'")

    # 3. Giới tính
    eff_gender = None
    if target_gender in ("female", "male"):
        eff_gender = target_gender
    elif gender:
        eff_gender = gender

    if eff_gender:
        conditions.append(f"gender = '{eff_gender}'")

    # 4. Thu nhập
    if target_income == "AB":
        conditions.append("income_bracket IN ('A', 'B')")
    elif target_income == "A":
        conditions.append("income_bracket = 'A'")
    elif target_income == "CD":
        conditions.append("income_bracket IN ('C', 'D')")
    elif income_bracket:
        conditions.append(f"income_bracket = '{income_bracket}'")

    # 5. Tình trạng hôn nhân
    if target_marital_status == "married":
        conditions.append("marital_status = 'Đã kết hôn'")
    elif target_marital_status == "single":
        conditions.append("marital_status = 'Độc thân'")

    # 6. Nhóm nghề nghiệp
    if target_occupation == "office":
        conditions.append("(occupation ILIKE '%văn phòng%' OR occupation ILIKE '%lập trình%' OR occupation ILIKE '%kế toán%' OR occupation ILIKE '%chuyên viên%' OR occupation ILIKE '%kỹ sư%')")
    elif target_occupation == "business":
        conditions.append("(occupation ILIKE '%kinh doanh%' OR occupation ILIKE '%chủ quán%' OR occupation ILIKE '%tiểu thương%' OR occupation ILIKE '%bán lẻ%')")
    elif target_occupation == "worker":
        conditions.append("(occupation ILIKE '%công nhân%' OR occupation ILIKE '%lao động%' OR occupation ILIKE '%kỹ thuật viên%' OR occupation ILIKE '%tài xế%')")

    where_clause = " AND ".join(conditions)

    cols = """
        age,
        gender,
        occupation,
        income_bracket,
        region,
        zone,
        marital_status,
        culinary_persona,
        lifestyle
    """

    query = f"""
    SELECT {cols}
    FROM (
        SELECT {cols}
        FROM '{parquet}'
        WHERE {where_clause}
    )
    USING SAMPLE {sample_size} (reservoir, {seed});
    """

    log.info(
        "DuckDB targeting sampling",
        sample_size=sample_size,
        region=region,
        zone=eff_zone,
        min_age=min_age,
        max_age=max_age,
        target_gender=target_gender,
        target_income=target_income,
        target_marital_status=target_marital_status,
        target_occupation=target_occupation,
    )

    start = time.perf_counter()
    try:
        df = con.execute(query).df()
        elapsed = time.perf_counter() - start

        # ── Fallback an toàn nhiều cấp độ nếu kết hợp bộ lọc quá hẹp ─────────
        if len(df) == 0:
            log.warning("duckdb_filter_zero_rows_relaxing_level_1", region=region, zone=eff_zone)
            # Level 1: Nới lỏng nghề nghiệp và hôn nhân, giữ lại tuổi, khu vực, giới tính, thu nhập
            fb1_conds = [f"age BETWEEN {min_age} AND {max_age}"]
            if region:
                fb1_conds.append(f"region = '{region}'")
            if eff_zone:
                fb1_conds.append(f"zone = '{eff_zone}'")
            if eff_gender:
                fb1_conds.append(f"gender = '{eff_gender}'")
            if target_income in ("AB", "A", "CD"):
                if target_income == "AB":
                    fb1_conds.append("income_bracket IN ('A', 'B')")
                elif target_income == "A":
                    fb1_conds.append("income_bracket = 'A'")
                elif target_income == "CD":
                    fb1_conds.append("income_bracket IN ('C', 'D')")
            
            fb1_where = " AND ".join(fb1_conds)
            fb1_query = f"""
            SELECT {cols}
            FROM (SELECT {cols} FROM '{parquet}' WHERE {fb1_where})
            USING SAMPLE {sample_size} (reservoir, {seed});
            """
            df = con.execute(fb1_query).df()

            if len(df) == 0:
                log.warning("duckdb_filter_zero_rows_relaxing_level_2", region=region)
                # Level 2: Giữ tuổi và khu vực
                fb2_conds = [f"age BETWEEN {min_age} AND {max_age}"]
                if region:
                    fb2_conds.append(f"region = '{region}'")
                fb2_where = " AND ".join(fb2_conds)
                fb2_query = f"""
                SELECT {cols}
                FROM (SELECT {cols} FROM '{parquet}' WHERE {fb2_where})
                USING SAMPLE {sample_size} (reservoir, {seed});
                """
                df = con.execute(fb2_query).df()

            if len(df) == 0:
                log.warning("duckdb_filter_zero_rows_relaxing_level_3")
                # Level 3: Toàn quốc theo tuổi
                nat_query = f"""
                SELECT {cols}
                FROM (SELECT {cols} FROM '{parquet}' WHERE age BETWEEN {min_age} AND {max_age})
                USING SAMPLE {sample_size} (reservoir, {seed});
                """
                df = con.execute(nat_query).df()

            if len(df) == 0:
                raise ValueError(
                    f"Không tìm thấy dữ liệu trong Parquet cho dải tuổi {min_age}-{max_age}."
                )

        if len(df) < sample_size:
            log.warning(
                "Mẫu lọc ít hơn yêu cầu do tiêu chí rất hẹp",
                requested=sample_size,
                got=len(df),
                region=region,
                zone=eff_zone,
            )

        log.info(
            "DuckDB targeting sample done",
            rows=len(df),
            elapsed_ms=round(elapsed * 1000, 1),
        )
        return df

    except Exception as e:
        elapsed = time.perf_counter() - start
        log.error("DuckDB query failed", error=str(e), elapsed_ms=round(elapsed * 1000, 1))
        raise


def get_demographic_summary(df: pd.DataFrame) -> dict:
    """
    Tạo summary nhân khẩu học từ DataFrame mẫu.
    Dùng để hiển thị trong log terminal và báo cáo.
    """
    total = len(df)
    if total == 0:
        return {}

    # Gender distribution
    gender_counts = df["gender"].value_counts(normalize=True) * 100

    # Age groups
    age_bins = [18, 24, 34, 44, 54, 100]
    age_labels = ["18-24", "25-34", "35-44", "45-54", "55+"]
    df["age_group"] = pd.cut(df["age"], bins=age_bins, labels=age_labels, right=True)
    age_dist = df["age_group"].value_counts(normalize=True).sort_index() * 100

    # Income distribution
    income_dist = df["income_bracket"].value_counts(normalize=True) * 100

    # Marital status distribution
    marital_dist = df["marital_status"].value_counts(normalize=True) * 100 if "marital_status" in df.columns else {}

    # Top occupations
    top_occupations = df["occupation"].value_counts().head(5).to_dict() if "occupation" in df.columns else {}

    # Location summary
    top_zone = df["zone"].value_counts().head(3).to_dict() if "zone" in df.columns else {}

    return {
        "total": total,
        "gender": {
            "male_pct": round(gender_counts.get("male", 0), 1),
            "female_pct": round(gender_counts.get("female", 0), 1),
        },
        "age_distribution": {
            label: round(age_dist.get(label, 0), 1) for label in age_labels
        },
        "income_distribution": income_dist.to_dict(),
        "marital_distribution": marital_dist.to_dict() if hasattr(marital_dist, "to_dict") else marital_dist,
        "top_occupations": top_occupations,
        "top_zones": top_zone,
        "avg_age": round(df["age"].mean(), 1),
    }


def get_total_count() -> int:
    """Đếm tổng số personas trong dataset — dùng cho health check."""
    try:
        con = _get_connection()
        parquet = _get_parquet_path()
        result = con.execute(f"SELECT COUNT(*) FROM '{parquet}'").fetchone()
        return result[0] if result else 0
    except Exception:
        return 0
