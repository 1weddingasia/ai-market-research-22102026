-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA — AI SYNTHETIC MARKET RESEARCH PLATFORM
-- File: backend/scripts/supabase_schema.sql
-- Dự án: insight.1booking.asia | Khảo sát thị trường bằng AI
-- ==============================================================================

-- 1. BẢNG surveys: Lưu trữ thông tin đơn hàng, cấu hình và kết quả khảo sát 5 model
CREATE TABLE IF NOT EXISTS public.surveys (
    id VARCHAR(20) PRIMARY KEY,                  -- Ví dụ: 'PANEL131336'
    model_type VARCHAR(50) NOT NULL,             -- 'nielsen_bases', 'van_westendorp', 'ab_testing', 'ua_study', 'deal_elasticity'
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT', -- 'PENDING_PAYMENT', 'PROCESSING', 'COMPLETED', 'FAILED'
    region VARCHAR(100),                         -- 'Toàn quốc', 'Đông Nam Bộ', ...
    zone VARCHAR(100),                           -- Tỉnh/Thành hoặc 'Đô Thị', 'Nông Thôn'
    min_age INTEGER DEFAULT 18,
    max_age INTEGER DEFAULT 65,
    sample_size INTEGER DEFAULT 1000,
    product_info_json TEXT,                      -- Thông tin sản phẩm / concept (JSON)
    price_amount INTEGER NOT NULL DEFAULT 499000,-- Số tiền thanh toán (VND)
    result_json TEXT,                            -- Kết quả khảo sát toàn diện 5 model (JSON)
    pdf_path VARCHAR(500),                       -- Đường dẫn file PDF/HTML kết xuất
    sepay_transaction_id VARCHAR(100) UNIQUE,    -- Mã giao dịch ngân hàng qua SePay
    paid_at TIMESTAMPTZ,                         -- Thời điểm nhận tiền thật
    customer_email VARCHAR(200),                 -- Email nhận báo cáo
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,                    -- Thời điểm hoàn thành N=1.000 mẫu
    error_msg TEXT                               -- Lỗi kỹ thuật (nếu có)
);

-- 2. BẢNG survey_logs: Lưu tiến trình thời gian thực phục vụ Live Telemetry SSE
CREATE TABLE IF NOT EXISTS public.survey_logs (
    id BIGSERIAL PRIMARY KEY,
    survey_id VARCHAR(20) NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    percent INTEGER NOT NULL DEFAULT 0,          -- 0 -> 100%
    log_msg TEXT NOT NULL,                       -- Dòng log telemetry [DUCKDB], [BATCH], etc.
    status VARCHAR(30),                          -- 'PROCESSING', 'COMPLETED', 'FAILED'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. TẠO CÁC CHỈ MỤC TỐI ƯU TỐC ĐỘ TRUY VẤN (INDEXES)
CREATE INDEX IF NOT EXISTS idx_surveys_customer_email ON public.surveys(customer_email);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON public.surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON public.surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_logs_survey_id ON public.survey_logs(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_logs_created_at ON public.survey_logs(created_at ASC);

-- 4. BẬT BẢO MẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_logs ENABLE ROW LEVEL SECURITY;

-- Policy cho phép kết nối Backend (qua DATABASE_URL postgresql) thao tác không bị chặn:
DROP POLICY IF EXISTS "backend_all_surveys" ON public.surveys;
CREATE POLICY "backend_all_surveys" ON public.surveys FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "backend_all_survey_logs" ON public.survey_logs;
CREATE POLICY "backend_all_survey_logs" ON public.survey_logs FOR ALL USING (true) WITH CHECK (true);
