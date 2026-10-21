'use client';

import { useState } from 'react';
import { api, formatVND, PRICING } from '@/lib/api';
import { useWizard } from '@/lib/wizard-context';

interface FieldConfig {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  hint?: string;
}

const FIELDS_MAP: Record<string, FieldConfig[]> = {
  nielsen_bases: [
    {
      id: 'product_name',
      label: 'Tên sản phẩm / ý tưởng kiểm định',
      placeholder: 'VD: Nước giải khát Kombucha men xoài Cát Chu 330ml',
      required: true,
    },
    {
      id: 'category',
      label: 'Ngành hàng kinh doanh',
      placeholder: 'VD: Thực phẩm & Đồ uống (FMCG / F&B)',
      required: true,
    },
    {
      id: 'description',
      label: 'Mô tả chi tiết USP & Vấn đề giải quyết',
      placeholder: 'Mô tả điểm độc đáo, nguyên liệu tự nhiên, lợi ích sức khỏe và nhóm đối tượng người dùng...',
      required: true,
      type: 'textarea',
      hint: 'Mô tả càng chi tiết và trung thực, hệ thống AI Persona phản hồi càng chính xác và giá trị.',
    },
    {
      id: 'expected_price',
      label: 'Mức giá dự kiến đưa ra thị trường',
      placeholder: 'VD: 32.000đ / lon hoặc 180.000đ / lốc 6 lon',
      required: true,
    },
  ],
  van_westendorp: [
    {
      id: 'product_name',
      label: 'Tên sản phẩm / gói dịch vụ định giá',
      placeholder: 'VD: Khóa học Tiếng Anh Giao Tiếp 1-kèm-1 qua AI (3 tháng)',
      required: true,
    },
    {
      id: 'description',
      label: 'Mô tả tính năng & Giá trị cốt lõi mang lại',
      placeholder: 'Liệt kê các quyền lợi, thời lượng, công cụ hỗ trợ và cam kết đầu ra...',
      required: true,
      type: 'textarea',
    },
    {
      id: 'price_range_min',
      label: 'Mức giá sàn dự kiến (VND)',
      placeholder: 'VD: 500000',
      type: 'number',
      required: true,
    },
    {
      id: 'price_range_max',
      label: 'Mức giá trần dự kiến (VND)',
      placeholder: 'VD: 2500000',
      type: 'number',
      required: true,
    },
  ],
  ab_testing: [
    {
      id: 'brand_name',
      label: 'Tên thương hiệu & Dòng sản phẩm',
      placeholder: 'VD: Sữa Chua Uống Men Sống Vinamilk Probi',
      required: true,
    },
    {
      id: 'test_objective',
      label: 'Mục tiêu thử nghiệm so sánh',
      placeholder: 'VD: Chọn concept bao bì Tết: Sắc Đỏ Truyền Thống vs Sắc Vàng Thịnh Vượng',
      required: true,
    },
    {
      id: 'option_a_description',
      label: 'Phương án A (Concept A)',
      placeholder: 'Mô tả bao bì, thông điệp truyền thông, tông màu và cảm xúc truyền tải của Phương án A...',
      required: true,
      type: 'textarea',
    },
    {
      id: 'option_b_description',
      label: 'Phương án B (Concept B)',
      placeholder: 'Mô tả bao bì, thông điệp truyền thông, tông màu và cảm xúc truyền tải của Phương án B...',
      required: true,
      type: 'textarea',
    },
  ],
  ua_study: [
    {
      id: 'industry',
      label: 'Ngành hàng & Thị trường khảo sát',
      placeholder: 'VD: Dịch vụ gọi xe công nghệ & Giao đồ ăn nhanh tại Việt Nam',
      required: true,
    },
    {
      id: 'key_competitors',
      label: 'Danh sách các đối thủ cạnh tranh chính',
      placeholder: 'VD: Grab, Xanh SM, Be, ShopeeFood',
      required: true,
    },
    {
      id: 'research_focus',
      label: 'Trọng tâm tìm hiểu thói quen & thái độ',
      placeholder: 'VD: Tần suất đặt xe trong tuần, rào cản về giá cước giờ cao điểm, yếu tố quyết định chuyển app...',
      required: true,
      type: 'textarea',
    },
  ],
  deal_elasticity: [
    {
      id: 'deal_description',
      label: 'Mô tả chương trình ưu đãi / Combo Tết',
      placeholder: 'VD: Combo Tết Đoàn Viên: Mua 3 Hộp Bánh Tặng 1 Bình Trà Cao Cấp, Giảm 20% khi mua trước 20 tháng Chạp...',
      required: true,
      type: 'textarea',
    },
    {
      id: 'original_price',
      label: 'Giá trị gốc của combo/sản phẩm (VND)',
      placeholder: 'VD: 450000',
      type: 'number',
      required: true,
    },
    {
      id: 'discounted_price',
      label: 'Giá bán thực tế sau khuyến mãi (VND)',
      placeholder: 'VD: 360000',
      type: 'number',
      required: true,
    },
  ],
};

export default function Step3ProductInfo() {
  const { state, updateProductInfo, updatePayment, setStep } = useWizard();
  const [formData, setFormData] = useState<Record<string, string>>(state.productInfo);
  const [email, setEmail] = useState(state.customerEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentModelKey = state.selectedModel || 'nielsen_bases';
  const fields = FIELDS_MAP[currentModelKey] || FIELDS_MAP.nielsen_bases;
  const currentPrice = PRICING[state.sampleSize] || 300_000;

  const handleChange = (id: string, val: string) => {
    setFormData((prev) => ({ ...prev, [id]: val }));
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    const missing = fields.filter((f) => f.required && !formData[f.id]?.trim());
    if (missing.length > 0) {
      setError(`Vui lòng nhập đầy đủ: ${missing.map((f) => f.label).join(', ')}`);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ để nhận bản báo cáo chiến lược PDF A4.');
      return;
    }

    setLoading(true);
    try {
      updateProductInfo(formData, email);

      const result = await api.createSurvey({
        model_type: state.selectedModel || 'nielsen_bases',
        region: state.region,
        min_age: state.minAge,
        max_age: state.maxAge,
        sample_size: state.sampleSize,
        product_info: formData,
        customer_email: email.trim(),
      });

      updatePayment(result.survey_id, result.price_amount, result.qr_data);
      setStep(4);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo khảo sát. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
          <span>✦ BƯỚC 03 / 04</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
          Thông tin sản phẩm & Khảo sát
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
          Cung cấp dữ kiện sản phẩm để cụm AI nạp bối cảnh và giả lập phản hồi của người tiêu dùng.
        </p>
      </div>

      {/* Summary Tag */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Phương pháp:</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-800 font-medium">
            {state.modelName || 'Kiểm định Ý tưởng Sản phẩm (BASES)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Mẫu:</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-800 font-medium">
            N = {state.sampleSize.toLocaleString('vi-VN')} ({state.region})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Kinh phí:</span>
          <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-bold">
            {formatVND(currentPrice)}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6 mb-8">
        {fields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.hint && (
                <span className="text-[11px] text-amber-700 font-medium italic">
                  {field.hint}
                </span>
              )}
            </div>

            {field.type === 'textarea' ? (
              <textarea
                rows={4}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-white border border-slate-300 rounded-lg p-3.5 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3.5 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
            )}
          </div>
        ))}

        {/* Email for PDF Delivery */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Email nhận Báo cáo Chiến lược PDF A4 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="giamdoc.marketing@congty.com"
            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3.5 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-400"
          />
          <p className="text-[11px] text-slate-500">
            Hệ thống sẽ tự động gửi trọn bộ file báo cáo PDF đóng dấu bảo mật ngay sau khi hoàn tất tính toán.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          ← Quay lại Cấu hình mẫu
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 px-8 rounded-lg shadow-sm hover:shadow transition-all duration-150 disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang khởi tạo hồ sơ...</span>
            </>
          ) : (
            <>
              <span>Xác nhận & Chuyển sang Thanh toán</span>
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
