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
    seed: int = 42,
) -> pd.DataFrame:
    """
    Lấy mẫu ngẫu nhiên phân tầng từ Parquet file trên R2.

    Args:
        sample_size: Số mẫu cần lấy (500, 1000, 2000, 3000)
        region: Vùng địa lý (e.g. "Đông Nam Bộ") — None = toàn quốc
        zone: Tỉnh/thành cụ thể — None = không lọc tỉnh
        min_age: Tuổi nhỏ nhất
        max_age: Tuổi lớn nhất
        gender: "male" | "female" | None = không lọc
        income_bracket: "A" | "B" | "C" | "D" | None = không lọc
        seed: Random seed để reproducible

    Returns:
        DataFrame với các cột: age, gender, occupation, income_bracket,
                                region, zone, culinary_persona, lifestyle
    """
    con = _get_connection()
    parquet = _get_parquet_path()

    # ── Build WHERE clause ────────────────────────────────────────────────────
    conditions = [f"age BETWEEN {min_age} AND {max_age}"]

    if region:
        conditions.append(f"region = '{region}'")
    if zone:
        conditions.append(f"zone = '{zone}'")
    if gender:
        conditions.append(f"gender = '{gender}'")
    if income_bracket:
        conditions.append(f"income_bracket = '{income_bracket}'")

    where_clause = " AND ".join(conditions)

    query = f"""
    SELECT
        age,
        gender,
        occupation,
        income_bracket,
        region,
        zone,
        culinary_persona,
        lifestyle
    FROM (
        SELECT
            age,
            gender,
            occupation,
            income_bracket,
            region,
            zone,
            culinary_persona,
            lifestyle
        FROM '{parquet}'
        WHERE {where_clause}
    )
    USING SAMPLE {sample_size} (reservoir, {seed});
    """

    log.info(
        "DuckDB sampling",
        sample_size=sample_size,
        region=region,
        zone=zone,
        min_age=min_age,
        max_age=max_age,
    )

    start = time.perf_counter()
    try:
        df = con.execute(query).df()
        elapsed = time.perf_counter() - start

        if len(df) == 0:
            log.warning("duckdb_filter_zero_rows_relaxing", region=region, zone=zone)
            fallback_conditions = [f"age BETWEEN {min_age} AND {max_age}"]
            if region:
                fallback_conditions.append(f"region = '{region}'")
            fallback_where = " AND ".join(fallback_conditions)
            fallback_query = f"""
            SELECT age, gender, occupation, income_bracket, region, zone, culinary_persona, lifestyle
            FROM (SELECT age, gender, occupation, income_bracket, region, zone, culinary_persona, lifestyle FROM '{parquet}' WHERE {fallback_where})
            USING SAMPLE {sample_size} (reservoir, {seed});
            """
            df = con.execute(fallback_query).df()

            if len(df) == 0:
                nat_query = f"""
                SELECT age, gender, occupation, income_bracket, region, zone, culinary_persona, lifestyle
                FROM (SELECT age, gender, occupation, income_bracket, region, zone, culinary_persona, lifestyle FROM '{parquet}' WHERE age BETWEEN {min_age} AND {max_age})
                USING SAMPLE {sample_size} (reservoir, {seed});
                """
                df = con.execute(nat_query).df()

            if len(df) == 0:
                raise ValueError(
                    f"Không tìm thấy dữ liệu trong Parquet cho dải tuổi {min_age}-{max_age}."
                )

        # Nếu dữ liệu lọc ít hơn yêu cầu, log warning nhưng vẫn trả về
        if len(df) < sample_size:
            log.warning(
                "Mẫu ít hơn yêu cầu — filter quá hẹp",
                requested=sample_size,
                got=len(df),
                region=region,
                zone=zone,
            )

        log.info(
            "DuckDB sample done",
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
