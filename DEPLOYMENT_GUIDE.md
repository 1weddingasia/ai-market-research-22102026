# 🚀 HƯỚNG DẪN TRIỂN KHAI PRODUCTION: HỆ THỐNG 4 MẢNH GHÉP (INSIGHT.1BOOKING.ASIA)

Tài liệu này tổng hợp toàn bộ quy trình chuẩn hóa và hướng dẫn triển khai hệ thống **AI Synthetic Market Research** lên môi trường Cloud Production.

---

## 🏗️ 1. SƠ ĐỒ KIẾN TRÚC 4 MẢNH GHÉP

| Mảnh ghép | Nền tảng | Vai trò & Trách nhiệm |
| :--- | :--- | :--- |
| **1. Mặt tiền (Frontend)** | **Vercel** | Giao diện Next.js, kết xuất Bản In Chiến Lược A4 Chuyên Sâu Đa Trang (`/results/[id]/print`), gán domain `insight.1booking.asia`. |
| **2. Bộ não xử lý (Backend API)** | **Render.com** | FastAPI (Python 3.11+), xử lý Webhook SePay, phân tầng Quota GSO, điều phối OpenAI GPT-4o-mini, xuất báo cáo PDF/HTML. |
| **3. Kho dữ liệu xã hội học** | **Cloudflare R2** | Lưu file `personas_vn_1m.parquet` (2.21 GB), DuckDB đọc phân tầng qua giao thức S3/httpfs. |
| **4. Cơ sở dữ liệu vận hành** | **Supabase PostgreSQL** | Lưu trữ đơn hàng (`surveys`), kết quả khảo sát 5 model (`result_json`) và luồng Live Telemetry (`survey_logs`). |

---

## 🗄️ 2. HƯỚNG DẪN SETUP SUPABASE POSTGRESQL

### Bước 1: Chạy SQL khởi tạo 2 bảng nghiệp vụ
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard) → Chọn dự án của bạn.
2. Vào mục **SQL Editor** ở thanh menu bên trái.
3. Mở file [backend/scripts/supabase_schema.sql](file:///c:/Users/Dell/Desktop/GITHUB%20CODE/Ứng%20dụng%20khảo%20sát%20thị%20trường%20bằng%20AI/backend/scripts/supabase_schema.sql), sao chép toàn bộ nội dung và dán vào SQL Editor.
4. Nhấn **Run** để khởi tạo:
   - Bảng `surveys`: Lưu mã đơn `PANELxxx`, cấu hình, thanh toán, và kết quả JSON 5 model.
   - Bảng `survey_logs`: Lưu tiến trình Live Telemetry SSE.
   - Các chỉ mục tối ưu truy vấn (Indexes) và chính sách bảo mật (RLS).

### Bước 2: Lấy chuỗi kết nối (Connection String)
1. Trong Supabase Dashboard → Vào **Project Settings** (biểu tượng bánh răng) → Chọn **Database**.
2. Cuộn xuống phần **Connection string** → Chọn tab **URI**.
3. Chọn chế độ:
   - **Transaction Pooler (Cổng 6543 - Khuyên dùng cho Render/Serverless)**:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require
     ```
   - Hoặc **Session / Direct Connection (Cổng 5432)**:
     ```text
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
     ```

### Bước 3: Cấu hình vào `backend/.env`
Mở file `backend/.env` và dán chuỗi kết nối vào dòng `DATABASE_URL`:
```ini
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

### Bước 4: Kiểm tra kết nối & Đồng bộ dữ liệu cũ
1. Mở terminal tại thư mục `backend` và chạy lệnh kiểm tra:
   ```bash
   python scripts/test_supabase_connection.py
   ```
   *(Hệ thống sẽ kết nối đến Supabase và xác nhận 2 bảng `surveys` và `survey_logs` đã sẵn sàng)*
2. Đồng bộ các đơn hàng đã kiểm thử từ file `surveys.db` cũ lên Supabase:
   ```bash
   python scripts/migrate_sqlite_to_supabase.py
   ```

---

## ☁️ 3. DEPLOY BACKEND LÊN RENDER.COM

### Cách 1: Sử dụng Render Blueprint tự động (Khuyên dùng)
Dự án đã có sẵn file `render.yaml` ở thư mục gốc.
1. Đăng nhập vào [Render.com](https://dashboard.render.com).
2. Nhấn **New +** → Chọn **Blueprint**.
3. Kết nối với GitHub Repository của dự án.
4. Render sẽ tự động nhận diện file `render.yaml` và tạo dịch vụ Web Service với đầy đủ cấu hình.

### Cách 2: Tạo thủ công Web Service trên Render
1. Nhấn **New +** → **Web Service** → Chọn GitHub Repo.
2. Cấu hình các thông số cơ bản:
   - **Name**: `insight-market-research-backend`
   - **Region**: `Singapore` (tối ưu độ trễ cho Việt Nam)
   - **Root Directory**: `backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Cấu hình **Environment Variables** (Biến môi trường trên Render - Copy trực tiếp từ file `backend/.env`):
   - `ENVIRONMENT`: `production`
   - `PYTHONUTF8`: `1`
   - `DATABASE_URL`: *(Dán chuỗi kết nối Supabase PostgreSQL từ file backend/.env)*
   - `OPENAI_API_KEY`: *(Dán OpenAI API Key từ file backend/.env)*
   - `SEPAY_API_TOKEN`: *(Dán SePay Token từ file backend/.env)*
   - `R2_ENDPOINT`: `https://d06760425346907098bfbc09e6cb3e4a.r2.cloudflarestorage.com`
   - `R2_ACCESS_KEY_ID`: *(Dán R2 Access Key từ file backend/.env)*
   - `R2_SECRET_ACCESS_KEY`: *(Dán R2 Secret Key từ file backend/.env)*
   - `R2_BUCKET_NAME`: `personas-vietnam`
   - `R2_FILE_KEY`: `personas_vn_1m.parquet`
   - `RESEND_API_KEY`: *(Dán Resend API Key từ file backend/.env)*
   - `EMAIL_FROM`: `hi@1booking.asia`
   - `FRONTEND_URL`: `https://insight.1booking.asia`
   - `CORS_ORIGINS`: `https://insight.1booking.asia,http://localhost:3000`
4. Nhấn **Deploy Web Service** và chờ Render hoàn tất build (Render sẽ cấp một URL dạng `https://[tên-dịch-vụ].onrender.com`).

---

## 🌐 4. DEPLOY FRONTEND LÊN VERCEL

1. Đăng nhập vào [Vercel.com](https://vercel.com) → Nhấn **Add New...** → **Project**.
2. Chọn GitHub Repository của dự án.
3. Trong phần **Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Nhấn Edit → Chọn thư mục `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Trong phần **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Điền URL Backend Render vừa tạo ở Phần 3 (Ví dụ: `https://insight-market-research-backend.onrender.com`).
5. Nhấn **Deploy**.
6. Sau khi deploy thành công:
   - Vào **Settings** → **Domains**.
   - Thêm Custom Domain: `insight.1booking.asia`.
   - Cấu hình bản ghi CNAME hoặc A record theo hướng dẫn của Vercel trên nhà cung cấp tên miền của bạn.

---

## 🎯 5. QUY TRÌNH KIỂM THỬ THÔNG SUỐT TOÀN DIỆN (END-TO-END)

1. Khách hàng truy cập `https://insight.1booking.asia` → Chọn 1 trong 5 Model khảo sát → Điền thông tin sản phẩm và email.
2. Hệ thống tạo đơn hàng mới: Mã đơn `PANELxxxxxx` được lưu tức thời vào Supabase với trạng thái `PENDING_PAYMENT`.
3. Khách quét mã VietQR chuyển khoản (SePay webhook tự động nhận diện nội dung `PANELxxxxxx`).
4. Webhook SePay gọi đến endpoint `POST /payment/webhook` trên Render:
   - Cập nhật trạng thái đơn trên Supabase thành `PROCESSING`.
   - Kích hoạt tiến trình ngầm: DuckDB bốc mẫu 1.000 hồ sơ từ Cloudflare R2, chia 50 batch xử lý song song qua OpenAI GPT-4o-mini.
   - Bắn dữ liệu SSE thời gian thực lên màn hình Live Telemetry `/processing/[id]`.
5. Sau ~60 giây:
   - Ma trận phân tích tính toán xong, lưu trọn vẹn kết quả vào cột `result_json` trên Supabase.
   - Tự động chuyển hướng khách hàng sang màn hình Báo cáo Executive Bản In Chiến Lược A4 Chuyên Sâu Đa Trang `/results/[id]` và `/results/[id]/print` để xuất file PDF A4 chuẩn quốc tế.
