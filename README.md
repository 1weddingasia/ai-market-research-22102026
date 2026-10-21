# 🧪 AI Market Research Platform — Hướng dẫn chạy dự án

## 📁 Cấu trúc dự án

```
├── backend/              # FastAPI Python backend
│   ├── main.py           # Entry point
│   ├── database.py       # SQLAlchemy + SQLite
│   ├── models/           # Pydantic schemas + Survey configs
│   ├── routers/          # API endpoints
│   ├── services/         # Business logic
│   │   ├── analysis/     # 5 analysis modules
│   │   ├── duckdb_service.py
│   │   ├── llm_service.py
│   │   ├── payment_service.py
│   │   ├── pdf_service.py
│   │   ├── region_mapping.py
│   │   └── worker.py     # Background + SSE
│   ├── scripts/          # Upload R2, verify schema
│   └── templates/        # PDF HTML template
│
└── frontend/             # Next.js 15 frontend
    ├── app/
    │   ├── wizard/       # Wizard 4 bước
    │   ├── processing/[id]  # SSE terminal
    │   └── results/[id]  # Dashboard báo cáo
    ├── components/       # Step1-4 components
    └── lib/              # API client + wizard context
```

---

## 🚀 Bước 1: Setup Backend

### 1.1. Cài Python dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 1.2. Tạo file .env

```bash
copy .env.example .env
```

Điền các giá trị vào `.env`:

```env
# Cloudflare R2
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<your_key>
R2_SECRET_ACCESS_KEY=<your_secret>
R2_BUCKET_NAME=personas-vietnam

# OpenAI
OPENAI_API_KEY=sk-...

# SePay (thanh toán)
SEPAY_API_TOKEN=<your_token>
BANK_ACCOUNT_NUMBER=<số_tài_khoản>
BANK_SHORT_NAME=VCB        # hoặc TCB, MBB...
ACCOUNT_NAME=TEN_CONG_TY

# VietQR (optional - để generate QR đẹp)
VIETQR_CLIENT_ID=<id>
VIETQR_API_KEY=<key>

# Resend email
RESEND_API_KEY=re_...
EMAIL_FROM=insight@1booking.asia

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 1.3. Upload dataset lên R2 (chỉ cần làm 1 lần)

```bash
python scripts/upload_to_r2.py
```

### 1.4. Verify kết nối R2

```bash
python scripts/verify_schema.py
```

### 1.5. Chạy backend

```bash
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

---

## 🎨 Bước 2: Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở: http://localhost:3000

---

## 💳 Bước 3: Cấu hình SePay Webhook

1. Đăng nhập SePay → Webhook Settings
2. Thêm URL: `https://your-domain.com/payment/webhook`
3. Chọn event: **Chuyển khoản đến** (transferIn)
4. API Token: copy vào `SEPAY_API_TOKEN` trong `.env`

---

## 🧪 Bước 4: Test luồng hoàn chỉnh

1. Mở `http://localhost:3000/wizard`
2. Chọn gói → Cấu hình mẫu → Nhập thông tin sản phẩm
3. Nhận mã QR → Chuyển khoản test
4. Xem terminal SSE chạy → Dashboard kết quả

---

## 📊 Bảng giá

| Số mẫu | Giá | Sai số |
|--------|-----|--------|
| 500    | 200.000đ | ±4.3% |
| 1.000  | 300.000đ | ±3.1% |
| 2.000  | 500.000đ | ±2.2% |
| 3.000  | 700.000đ | ±1.8% |

---

## 🗂 API Endpoints

| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/survey/configs` | Danh sách 5 gói khảo sát |
| POST | `/survey/create` | Tạo survey + nhận QR |
| GET | `/survey/{id}/status` | Check trạng thái |
| GET | `/survey/{id}/stream` | SSE realtime logs |
| GET | `/survey/{id}/results` | Kết quả JSON đầy đủ |
| GET | `/survey/{id}/pdf` | Tải PDF báo cáo |
| POST | `/payment/webhook` | SePay webhook |
| POST | `/payment/upload-image` | Upload ảnh A/B |
| GET | `/health` | Health check |
