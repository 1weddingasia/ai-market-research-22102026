'use client';

import { useEffect, useState } from 'react';
import { api, type SurveyConfig } from '@/lib/api';
import { useWizard } from '@/lib/wizard-context';

const CERTIFICATIONS: Record<string, string> = {
  nielsen_bases: 'CHỨNG THỰC NIELSEN BASES',
  van_westendorp: 'PHƯƠNG PHÁP VAN WESTENDORP PSM',
  ab_testing: 'CHUẨN KANTAR TNS SPLIT TEST',
  ua_study: 'CHUẨN U&A IPSOS TOÀN DIỆN',
  deal_elasticity: 'PRICE SENSITIVITY & ELASTICITY',
};

const DELIVERABLES: Record<string, string[]> = {
  nielsen_bases: [
    'Dự báo tỷ lệ đón nhận sản phẩm (Viability Score)',
    'Đo lường độ độc đáo & nhu cầu thực tế',
    'Nhận diện rào cản tiêu dùng chính',
  ],
  van_westendorp: [
    'Khoảng giá chấp nhận được (Acceptable Range)',
    'Điểm giá tối ưu doanh thu (Optimal Price Point)',
    'Đường cong nhạy cảm giá 4 ngưỡng',
  ],
  ab_testing: [
    'Xác định Concept / Bao bì chiến thắng (Win-rate)',
    'Chỉ số ưu tiên người tiêu dùng theo phân khúc',
    'Lý do định tính vì sao khách hàng chọn',
  ],
  ua_study: [
    'Bản đồ tần suất sử dụng sản phẩm thực tế',
    'Khoảng trống thị trường chưa ai khai thác',
    'Định vị thái độ thương hiệu so với đối thủ',
  ],
  deal_elasticity: [
    'Độ nhạy cảm chương trình khuyến mãi/combo Tết',
    'Dự báo nguy cơ tự ăn thịt sản phẩm (Cannibalization)',
    'Mức chiết khấu tối ưu không làm giảm giá trị thương hiệu',
  ],
};

export default function Step1ModelSelect() {
  const { state, updateModel, setStep } = useWizard();
  const [configs, setConfigs] = useState<SurveyConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState<SurveyConfig | null>(null);

  useEffect(() => {
    api.getSurveyConfigs()
      .then((c) => setConfigs(c))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (cfg: SurveyConfig) => {
    updateModel(cfg.id, cfg.name, cfg.framework);
  };

  const handleContinue = () => {
    if (!state.selectedModel && configs.length > 0) {
      handleSelect(configs[0]);
    }
    setStep(2);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-medium">Đang tải danh mục phương pháp nghiên cứu chuẩn quốc tế...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
          <span>✦ BƯỚC 01 / 04</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
          Chọn phương pháp nghiên cứu
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
          Bảo trợ bởi mô hình <span className="font-semibold text-slate-900">1.000.000 hồ sơ người tiêu dùng Việt Nam</span> — Chuẩn phương pháp luận McKinsey, Nielsen, Kantar.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {configs.map((cfg) => {
          const selected = state.selectedModel === cfg.id;
          const cert = CERTIFICATIONS[cfg.id] || cfg.framework;
          const deliverables = DELIVERABLES[cfg.id] || [];

          return (
            <div
              key={cfg.id}
              onClick={() => handleSelect(cfg)}
              className={`group bg-white rounded-xl border p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer relative ${
                selected
                  ? 'border-slate-900 ring-2 ring-slate-900 shadow-md bg-slate-50/40'
                  : 'border-slate-200 hover:border-slate-400 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <div>
                {/* Header with Icon + Academic Badge */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl text-slate-800 group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
                    {cfg.icon || '📊'}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-right uppercase tracking-wider">
                    {cert}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  {cfg.name}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-xs mt-2 leading-relaxed min-h-[36px]">
                  {cfg.description}
                </p>

                {/* Deliverables Checklist */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                    Bạn sẽ nhận được
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Preview link & selection indicator */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalConfig(cfg);
                  }}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Xem bộ 10 câu hỏi ↗</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {selected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      Đã chọn
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 group-hover:text-slate-700">Chọn gói</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Academic Commitment Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base shrink-0">
            ⚖️
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Cam kết học thuật:</strong> Mọi khảo sát đảm bảo cỡ mẫu N ≥ 500, khoảng tin cậy 95%, sai số biên (MoE) ≤ ±4.3%. Dữ liệu người tiêu dùng được phân bổ tự động theo phương pháp Stratified Quota chuẩn Tổng cục Thống kê.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 px-8 rounded-lg shadow-sm hover:shadow transition-all duration-150"
        >
          <span>Tiếp tục sang Cấu hình mẫu</span>
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Modal Preview 10 Questions */}
      {modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  {CERTIFICATIONS[modalConfig.id] || modalConfig.framework}
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Bộ 10 câu hỏi chuẩn hóa: {modalConfig.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalConfig(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 divide-y divide-slate-100">
              <p className="text-xs text-slate-500 pb-2">
                Các câu hỏi dưới đây được hệ thống AI kích hoạt độc lập tới từng hồ sơ người tiêu dùng thực tế. Thang đo tâm lý học được thiết kế tương đương bộ câu hỏi khảo sát thực địa của Kantar và Nielsen.
              </p>
              {modalConfig.questions && modalConfig.questions.length > 0 ? (
                modalConfig.questions.map((q, idx) => (
                  <div key={q.id || idx} className="pt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-900">{q.label}</span>
                      <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded ml-auto">
                        {q.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 pl-7">{q.text}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Đang đồng bộ câu hỏi từ thư viện chuẩn hóa...
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Chuẩn đo lường Likert 5 điểm & Van Westendorp 4 câu</span>
              <button
                type="button"
                onClick={() => {
                  handleSelect(modalConfig);
                  setModalConfig(null);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm"
              >
                Chọn phương pháp này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
