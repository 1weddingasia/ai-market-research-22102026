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
          Chọn địa bàn và quy mô tác tử AI mô phỏng mục tiêu. Hệ thống sẽ áp dụng thuật toán phân tầng đối chuẩn theo Niên giám Thống kê GSO tức thì.
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
              Bộ lọc sẽ tự động đối sánh tọa độ và địa bàn sinh sống trong kho 1.000.000 chân dung tiêu dùng tổng hợp (Synthetic Personas).
            </p>
          </div>

          {/* Age Demographics */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-3">
              Độ tuổi mục tiêu của tác tử AI phân vai
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

          {/* Advanced Audience Targeting Card */}
          <div className="bg-white border border-amber-200/80 rounded-xl p-6 shadow-sm space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-900">
                  ✦ BỘ LỌC ĐỐI TƯỢNG MỤC TIÊU CHUYÊN SÂU (ADVANCED TARGETING)
                </span>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                DuckDB 1M Personas
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Thu hẹp tệp tác tử AI theo đúng khách hàng mục tiêu của sản phẩm. Tác tử AI sẽ nhập vai theo đúng mức thu nhập, gia đình và nghề nghiệp đã chọn.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Target Gender */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  1. Giới tính mục tiêu
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg">
                  {[
                    { id: 'all', label: 'Cả hai' },
                    { id: 'female', label: 'Chỉ Nữ' },
                    { id: 'male', label: 'Chỉ Nam' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => updateSampleConfig({ targetGender: g.id })}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-all ${
                        (state.targetGender || 'all') === g.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Target Income */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  2. Phân khúc thu nhập
                </label>
                <select
                  value={state.targetIncome || 'all'}
                  onChange={(e) => updateSampleConfig({ targetIncome: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white"
                >
                  <option value="all">Toàn bộ phân khúc (Đại diện tự nhiên)</option>
                  <option value="AB">Trung & Thượng lưu A-B (&gt;15 triệu/tháng)</option>
                  <option value="A">Cao cấp Hạng A (&gt;25 triệu/tháng)</option>
                  <option value="CD">Bình dân & Phổ thông C-D (&lt;15 triệu/tháng)</option>
                </select>
              </div>

              {/* 3. Target Marital Status */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  3. Tình trạng hôn nhân / Gia đình
                </label>
                <select
                  value={state.targetMaritalStatus || 'all'}
                  onChange={(e) => updateSampleConfig({ targetMaritalStatus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white"
                >
                  <option value="all">Tất cả tình trạng (Độc thân & Có gia đình)</option>
                  <option value="married">Đã kết hôn / Gia đình &amp; Có con</option>
                  <option value="single">Độc thân / Chưa lập gia đình</option>
                </select>
              </div>

              {/* 4. Target Occupation */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  4. Nhóm nghề nghiệp ưu tiên
                </label>
                <select
                  value={state.targetOccupation || 'all'}
                  onChange={(e) => updateSampleConfig({ targetOccupation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white"
                >
                  <option value="all">Đa dạng mọi ngành nghề (Đối chuẩn cơ cấu GSO)</option>
                  <option value="office">Dân văn phòng &amp; Trí thức (IT, tài chính, chuyên viên)</option>
                  <option value="business">Kinh doanh &amp; Thương mại (Chủ quán, tiểu thương)</option>
                  <option value="worker">Công nhân &amp; Sản xuất (Kỹ thuật viên, vận hành)</option>
                </select>
              </div>

              {/* 5. Target Zone (Môi trường sống) */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  5. Môi trường địa bàn sinh sống
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'Tự nhiên theo địa bàn' },
                    { id: 'urban', label: 'Chỉ Đô Thị (Thành phố)' },
                    { id: 'rural', label: 'Chỉ Nông Thôn' },
                  ].map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => updateSampleConfig({ targetZone: z.id })}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        (state.targetZone || 'all') === z.id
                          ? 'border-amber-500 bg-amber-50/80 text-amber-900 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Targeting Portrait Box */}
            <div className="bg-amber-500/10 border border-amber-300/60 rounded-xl p-3.5 flex items-start gap-3 mt-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 font-bold text-sm">
                🎯
              </div>
              <div className="text-xs">
                <div className="font-bold text-amber-950 uppercase tracking-wide text-[10px]">
                  Chân dung mẫu tác tử AI trích xuất mục tiêu:
                </div>
                <div className="font-bold text-slate-900 mt-0.5 text-xs sm:text-sm">
                  {state.sampleSize.toLocaleString('vi-VN')} Tác tử AI {state.targetGender === 'female' ? 'Nữ giới' : state.targetGender === 'male' ? 'Nam giới' : 'Đại diện Nam & Nữ'} | Tuổi {state.minAge}-{state.maxAge} | {state.region} {state.targetZone === 'urban' ? '(Đô Thị)' : state.targetZone === 'rural' ? '(Nông Thôn)' : ''} {state.targetIncome && state.targetIncome !== 'all' ? `| Thu nhập ${state.targetIncome === 'AB' ? 'Trung & Thượng lưu A-B' : state.targetIncome === 'A' ? 'Cao cấp Hạng A' : 'Phổ thông C-D'}` : ''} {state.targetMaritalStatus && state.targetMaritalStatus !== 'all' ? `| ${state.targetMaritalStatus === 'married' ? 'Đã kết hôn / Gia đình' : 'Độc thân'}` : ''} {state.targetOccupation && state.targetOccupation !== 'all' ? `| ${state.targetOccupation === 'office' ? 'Văn phòng & Trí thức' : state.targetOccupation === 'business' ? 'Kinh doanh & Tiểu thương' : 'Công nhân & Sản xuất'}` : ''}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Đảm bảo tác tử AI bóc tách đúng hành vi mua sắm và phản hồi đúng bối cảnh thực tế.
                </div>
              </div>
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
                    <div className={`text-xs mt-1 font-medium ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                      Sai số {tier.moe}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (40% ~ 5 cols): Statistical Sampling Precision Panel */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm sticky top-8 space-y-6">
            {/* Panel Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                🏛️ THÔNG SỐ KIỂM ĐỊNH MẪU PHÂN TẦNG
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Statistical Sampling Precision Panel
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Quy chuẩn độ chuẩn xác thống kê chọn mẫu ngẫu nhiên theo tiêu chuẩn Cochran & ESOMAR.
              </p>
            </div>

            {/* Metrics List */}
            <div className="space-y-4">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Quy mô mẫu mô phỏng (Sample Size)
                </span>
                <div className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
                  N = {state.sampleSize.toLocaleString('vi-VN')} <span className="text-xs font-sans font-normal text-slate-500">Synthetic Personas</span>
                </div>
                <span className="text-[11px] text-slate-500">Mô phỏng đa tác tử độc lập (Multi-Agent Panel)</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Khoảng tin cậy thống kê (Confidence Level)
                </span>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">
                  95% Confidence Interval (z = 1.96)
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ngưỡng ý nghĩa thống kê chuẩn quốc tế cho phân bổ xác suất chọn mẫu.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Sai số chọn mẫu biên (Margin of Sampling Error)
                </span>
                <div className="text-2xl font-serif font-bold text-amber-700 mt-0.5">
                  {currentTier.moe}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Đo lường độ lệch biên tối đa về mặt xác suất thống kê đối với quy mô mẫu được chọn.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Phương pháp phân tầng & Cơ sở đối chuẩn 2 tầng khoa học
                </span>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  Stratified Random Sampling · Đối chuẩn Niên giám Thống kê GSO 6 vùng kinh tế
                </div>
                
                {/* 2 Tầng Khoa Học Chuẩn Mực */}
                <div className="space-y-1.5 pt-1 text-[11px] leading-relaxed">
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <strong className="text-slate-800 font-mono text-[10px] uppercase block">🏛️ Tầng 1: Khung nhân khẩu học (Cơ cấu dân số)</strong>
                    <p className="text-slate-600 mt-0.5">
                      Khung mẫu phân tầng nhân khẩu học được chuẩn hóa và đối chuẩn (benchmark) theo Niên giám Thống kê của Tổng cục Thống kê Việt Nam (GSO), đảm bảo cơ cấu độ tuổi, giới tính, vùng miền và phân tầng thu nhập phản ánh sát thực tế dân số.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <strong className="text-slate-800 font-mono text-[10px] uppercase block">🛒 Tầng 2: Hành vi tiêu dùng & Tâm lý mua sắm</strong>
                    <p className="text-slate-600 mt-0.5">
                      Mô hình hành vi tiêu dùng được tổng hợp từ dữ liệu thói quen thương mại điện tử, mức chi tiêu khả dụng và văn hóa bán lẻ bản địa tại Việt Nam.
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-1 leading-normal italic">
                  * Mô phỏng vận hành trên 1.000.000 chân dung tổng hợp (Synthetic Personas), tuân thủ nghiêm ngặt nguyên tắc Privacy-by-Design, ẩn danh 100%, không chứa thông tin định danh cá nhân (PII-free) theo Nghị định 13/2023/NĐ-CP.
                </p>
              </div>

              {/* Target Audience Quota */}
              <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                  Bộ lọc phân khúc mục tiêu (Target Quota)
                </span>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  {state.targetGender === 'female' ? 'Nữ giới' : state.targetGender === 'male' ? 'Nam giới' : 'Nam & Nữ'} · Tuổi {state.minAge}-{state.maxAge} · {state.region} {state.targetZone === 'urban' ? '(Đô Thị)' : state.targetZone === 'rural' ? '(Nông Thôn)' : ''}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {state.targetIncome && state.targetIncome !== 'all' ? `Thu nhập: ${state.targetIncome} · ` : ''}
                  {state.targetMaritalStatus && state.targetMaritalStatus !== 'all' ? `Hôn nhân: ${state.targetMaritalStatus === 'married' ? 'Có gia đình' : 'Độc thân'} · ` : ''}
                  {state.targetOccupation && state.targetOccupation !== 'all' ? `Ngành: ${state.targetOccupation}` : 'Đa ngành'}
                </div>
              </div>

              {/* Academic Positioning Box */}
              <div className="bg-slate-100/90 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <span>💡</span> Định vị phương pháp luận (Methodology Fit):
                </span>
                <p className="leading-relaxed text-slate-600">
                  Nền tảng AI Synthetic Panel đóng vai trò là công cụ <strong>Sàng lọc & Giả lập thị trường tốc độ cao (Pre-market Simulation)</strong>, giúp ban điều hành loại bỏ rủi ro và tối ưu mức giá trước khi rót vốn sản xuất đại trà.
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
          className="btn-outline text-xs sm:text-sm py-2.5 px-5"
        >
          ← Quay lại
        </button>

        <button
          type="button"
          onClick={() => setStep(3)}
          className="btn-primary text-sm sm:text-base py-3.5 px-8 shadow-md"
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
