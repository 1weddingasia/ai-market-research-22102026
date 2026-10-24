# ==============================================================================
# DATASET SERVICE — XỬ LÝ VÀ TRÍCH XÚT DỮ LIỆU KHẢO SÁT LỊCH SỬ (CSV / EXCEL)
# Mục đích: Phân tích file khảo sát cũ của doanh nghiệp để AI học phong cách
# phản hồi và rào cản đặc thù của ngành hàng (Few-Shot Domain Tuning).
# ==============================================================================

import os
import io
import structlog
import pandas as pd
from typing import Optional, Dict, Any, List

log = structlog.get_logger(__name__)


def parse_and_extract_survey_dataset(
    file_bytes: bytes,
    filename: str,
    max_sample_rows: int = 500,
) -> Dict[str, Any]:
    """
    Đọc file CSV hoặc Excel khảo sát cũ, trích xuất cấu trúc và các mẫu phản hồi tiêu biểu.
    """
    ext = os.path.splitext(filename)[1].lower()
    df: Optional[pd.DataFrame] = None

    # 1. Đọc file theo định dạng
    try:
        if ext in [".xlsx", ".xls"]:
            df = pd.read_excel(io.BytesIO(file_bytes))
        elif ext == ".csv":
            # Thử nhiều bảng mã phổ biến tại VN
            for encoding in ["utf-8", "utf-8-sig", "latin1", "cp1258"]:
                try:
                    df = pd.read_csv(io.BytesIO(file_bytes), encoding=encoding)
                    break
                except UnicodeDecodeError:
                    continue
            if df is None:
                raise ValueError("Không thể giải mã file CSV với các chuẩn bảng mã thông dụng (UTF-8, UTF-8-SIG).")
        else:
            raise ValueError(f"Định dạng file {ext} không được hỗ trợ. Vui lòng tải file .CSV hoặc .XLSX / .XLS.")
    except Exception as read_err:
        log.error("Failed to read dataset file", filename=filename, error=str(read_err))
        raise ValueError(f"Lỗi khi đọc file {filename}: {str(read_err)}")

    if df is None or df.empty:
        raise ValueError("File dữ liệu trống hoặc không có dòng dữ liệu hợp lệ.")

    # 2. Làm sạch dữ liệu cơ bản
    total_raw_rows = len(df)
    df = df.dropna(how="all")  # Loại bỏ các dòng trống hoàn toàn
    valid_rows = len(df)

    columns = [str(col).strip() for col in df.columns if not str(col).startswith("Unnamed")]
    if not columns:
        columns = [f"Cột {i+1}" for i in range(len(df.columns))]

    # 3. Tìm các cột chứa phản hồi định tính hoặc câu hỏi khảo sát
    text_columns = []
    numeric_columns = []
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            numeric_columns.append(str(col).strip())
        else:
            # Kiểm tra xem có phải cột chứa văn bản dài (nhận xét, lý do) không
            sample_vals = df[col].dropna().astype(str).tolist()[:20]
            avg_len = sum(len(s) for s in sample_vals) / max(len(sample_vals), 1)
            if avg_len >= 8:  # Cột có câu nhận xét hoặc lý do
                text_columns.append(str(col).strip())

    # 4. Trích xuất các mẫu phản hồi tiêu biểu (snippets)
    snippets: List[str] = []
    if text_columns:
        primary_text_col = text_columns[0]
        sample_rows = df[primary_text_col].dropna().astype(str).tolist()[:15]
        for s in sample_rows:
            clean_s = s.strip()
            if len(clean_s) >= 10 and clean_s not in snippets:
                snippets.append(clean_s)

    # 5. Tạo bản tóm tắt ngữ cảnh học tập cho AI (Few-shot context prompt)
    # Giới hạn tối đa 500 dòng mẫu
    sample_df = df.head(min(valid_rows, max_sample_rows))
    context_lines = [
        f"Bộ dữ liệu khảo sát gốc: {filename}",
        f"Quy mô dữ liệu lịch sử: {valid_rows:,} phản hồi thực tế từ thị trường.",
        f"Các trường thông tin ghi nhận: {', '.join(columns[:10])}",
    ]

    if snippets:
        context_lines.append("Một số trích dẫn thực tế tiêu biểu từ khảo sát trước đó của ngành hàng:")
        for idx, snip in enumerate(snippets[:8], 1):
            context_lines.append(f'  {idx}. "{snip}"')

    dataset_context_text = "\n".join(context_lines)

    log.info(
        "Historical survey dataset parsed successfully",
        filename=filename,
        valid_rows=valid_rows,
        columns_count=len(columns),
        text_cols_count=len(text_columns),
    )

    return {
        "status": "ok",
        "filename": filename,
        "total_rows": valid_rows,
        "total_raw_rows": total_raw_rows,
        "columns": columns[:15],
        "text_columns": text_columns[:5],
        "extracted_snippets": snippets[:6],
        "dataset_context": dataset_context_text,
    }
