'use client';

import { useWizard } from '@/lib/wizard-context';
import { formatVND, PRICING } from '@/lib/api';

const REGIONS = [
  { value: 'Toàn quốc', label: 'Toàn quốc (Đại diện 3 miền)' },
  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh (Đô thị loại đặc biệt)' },
  { value: 'Hà Nội', label: 'Hà Nội (Thủ đô & Vùng kinh tế Bắc Bộ)' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng & Duyên hải Miền Trung' },
  { value: 'Cần Thơ', label: 'Cần Thơ & Đồng bằng Sông Cửu Long' },
  { value: 'Hải Phòng', label: 'Hải Phòng & Vùng Đông Bắc' },
  { value: 'Miền Bắc', label: 'Khu vực Miền Bắc (Tổng hợp)' },
  { value: 'Miền Nam', label: 'Khu vực Miền Nam (Tổng hợp)' },
  { value: 'Miền Trung', label: 'Khu vực Miền Trung (Tổng hợp)' },
];

const SAMPLE_TIERS = [
  { size: 500, price: 200_000, moe: '±4.38%', label: '500 mẫu', sublabel: 'Cấp địa phương / Thử nghiệm nhanh' },
  { size: 1000, price: 300_000, moe: '±3.10%', label: '1.000 mẫu', sublabel: 'Chuẩn quốc tế (Đề xuất)', isRecommended: true },
  { size: 2000, price: 500_000, moe: '±2.19%', label: '2.000 mẫu', sublabel: 'Đại diện phân khúc sâu' },
  { size: 3000, price: 700_000, moe: '±1.79%', label: '3.000 mẫu', sublabel: 'Cỡ mẫu toàn quốc vững chắc' },
];

export default function Step2SampleConfig() {
  const { state, updateSampleConfig, setStep } = useWizard();

  const currentTier =
    SAMPLE_TIERS.find((t) => t.size === state.sampleSize) ||
    SAMPLE_TIERS[1];

  const currentPrice = PRICING[state.sampleSize] || currentTier.price;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    // Find closest tier
    const closest = SAMPLE_TIERS.reduce((prev, curr) =>
      Math.abs(curr.size - val) < Math.abs(prev.size - val) ? curr : prev
    );
    updateSampleConfig({ sampleSize: closest.size });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
          <span>✦ BƯỚC 02 / 04</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
          Cấu hình quy mô & Phạm vi mẫu
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
          Chọn địa bàn và số lượng người tiêu dùng mục tiêu. Hệ thống sẽ áp dụng thuật toán phân tầng thống kê tức thì.
        </p>
      </div>

      {/* Main 60 / 40 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column (60% ~ 7 cols): Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Region Dropdown - Stripe Style */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
              Khu vực địa lý khảo sát
            </label>
            <div className="relative">
              <select
                value={state.region}
                onChange={(e) => updateSampleConfig({ region: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 px-4 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Bộ lọc sẽ tự động đối sánh tọa độ và địa bàn sinh sống trong kho dữ liệu 1.000.000 người tiêu dùng Việt Nam.
            </p>
          </div>

          {/* Age Demographics */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-3">
              Độ tuổi người tiêu dùng mục tiêu
            </label>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Từ tuổi</span>
                <input
                  type="number"
                  min={18}
                  max={60}
                  value={state.minAge}
                  onChange={(e) => updateSampleConfig({ minAge: Math.max(18, parseInt(e.target.value, 10) || 18) })}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Đến tuổi</span>
                <input
                  type="number"
                  min={19}
                  max={70}
                  value={state.maxAge}
                  onChange={(e) => updateSampleConfig({ maxAge: Math.min(70, parseInt(e.target.value, 10) || 65) })}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 py-2 px-3 rounded-lg border border-slate-100">
              <span>Độ trải rộng nhân khẩu:</span>
              <span className="font-bold text-slate-900">{state.maxAge - state.minAge} tuổi (Thế hệ Gen Z, Millennial & Gen X)</span>
            </div>
          </div>

          {/* Sample Size Slider & Price Picker */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-500">
                  Quy mô mẫu khảo sát (N)
                </label>
                <span className="text-xs text-slate-400">Kéo thanh trượt hoặc chọn trực tiếp bên dưới</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-slate-900">
                  {state.sampleSize.toLocaleString('vi-VN')}
                </span>
                <span className="text-xs text-slate-500 ml-1">mẫu</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={500}
              max={3000}
              step={500}
              value={state.sampleSize}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />

            {/* Quick-Pick Pills with Price */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {SAMPLE_TIERS.map((tier) => {
                const isSelected = state.sampleSize === tier.size;
                return (
                  <button
                    key={tier.size}
                    type="button"
                    onClick={() => updateSampleConfig({ sampleSize: tier.size })}
                    className={`relative p-3 rounded-xl border text-left transition-all duration-150 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-400 text-slate-800'
                    }`}
                  >
                    {tier.isRecommended && (
                      <span className={`absolute -top-2.5 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        Đề xuất
                      </span>
                    )}
                    <div className="font-bold text-sm leading-tight">
                      {tier.label}
                    </div>
                    <div className={`text-xs mt-1 font-semibold ${isSelected ? 'text-amber-300' : 'text-amber-700'}`}>
                      {formatVND(tier.price)}
                    </div>
                    <div className={`text-[10px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      Sai số {tier.moe}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (40% ~ 5 cols): Statistical Confidence Panel */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm sticky top-8 space-y-6">
            {/* Panel Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                🏛️ HỘP BẢO CHỨNG HỌC THUẬT
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Statistical Confidence Panel
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Các thông số kỹ thuật đo lường theo chuẩn quốc tế ESOMAR & AAPOR.
              </p>
            </div>

            {/* Metrics List */}
            <div className="space-y-4">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Cỡ mẫu thực nghiệm
                </span>
                <div className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
                  N = {state.sampleSize.toLocaleString('vi-VN')} <span className="text-xs font-sans font-normal text-slate-500">người tiêu dùng</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Khoảng tin cậy (Confidence Interval)
                </span>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">
                  95% Confidence Interval (z = 1.96)
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Sai số biên dự tính (Margin of Error)
                </span>
                <div className="text-2xl font-serif font-bold text-amber-700 mt-0.5">
                  {currentTier.moe}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Đảm bảo độ lệch kết quả tối đa không vượt quá ngưỡng cho phép của nghiên cứu thị trường thực địa.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Phương pháp lấy mẫu
                </span>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  Stratified Random Sampling (Phân tầng theo tuổi, giới tính và thu nhập thực tế)
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Trích xuất ngẫu nhiên từ kho dữ liệu 1.000.000 hồ sơ người tiêu dùng Việt Nam, tự động cân bằng phương sai nhân khẩu học.
                </p>
              </div>
            </div>

            {/* Live Pricing Summary */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-900">Chi phí khảo sát:</span>
                <span className="text-xl font-bold font-serif text-amber-800">
                  {formatVND(currentPrice)}
                </span>
              </div>
              <p className="text-[10px] text-amber-700 mt-1">
                Đã bao gồm chi phí phân tích phân tầng dữ liệu, suy luận mô hình AI và xuất bản báo cáo PDF A4.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          ← Quay lại
        </button>

        <button
          type="button"
          onClick={() => setStep(3)}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 px-6 sm:px-8 rounded-lg shadow-sm hover:shadow transition-all duration-150"
        >
          <span>Tiếp tục sang Nhập thông tin</span>
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
