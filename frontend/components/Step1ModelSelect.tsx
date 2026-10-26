'use client';

import { useEffect, useState } from 'react';
import { api, type SurveyConfig } from '@/lib/api';
import { useWizard } from '@/lib/wizard-context';
import { DEFAULT_SURVEY_CONFIGS } from '@/lib/survey-configs';

const CERTIFICATIONS: Record<string, string> = {
  nielsen_bases: 'CHỨNG THỰC NIELSEN BASES',
  van_westendorp: 'PHƯƠNG PHÁP VAN WESTENDORP PSM',
  ab_testing: 'CHUẨN KANTAR TNS SPLIT TEST',
  ua_study: 'CHUẨN U&A IPSOS TOÀN DIỆN',
  deal_elasticity: 'PRICE SENSITIVITY & ELASTICITY',
  monadic: 'MONADIC TESTING SPLIT-SAMPLE',
  maxdiff: 'MAXDIFF BEST-WORST SCALING',
  kano: 'MÔ HÌNH KANO PRODUCT ROADMAP',
  brand_map: 'BẢN ĐỒ ĐỊNH VỊ PERCEPTUAL MAP',
};

const MODEL_DEMO_LINKS: Record<string, { id: string; label: string }> = {
  nielsen_bases: { id: 'DEMO-NIELSEN-BASES', label: 'Demo Nielsen BASES' },
  van_westendorp: { id: 'DEMO-VAN-WESTENDORP', label: 'Demo Van Westendorp' },
  ab_testing: { id: 'DEMO-AB-TESTING', label: 'Demo Kantar A/B' },
  monadic: { id: 'DEMO-MONADIC', label: 'Demo Monadic Testing' },
  maxdiff: { id: 'DEMO-MAXDIFF', label: 'Demo MaxDiff Scaling' },
  kano: { id: 'DEMO-KANO', label: 'Demo Kano Model' },
  brand_map: { id: 'DEMO-BRAND-MAP', label: 'Demo Brand Perceptual Map' },
  ua_study: { id: 'DEMO-UA-STUDY', label: 'Demo U&A Study' },
  deal_elasticity: { id: 'DEMO-DEAL-ELASTICITY', label: 'Demo Deal Elasticity' },
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
  monadic: [
    'Thử nghiệm mù độc lập 2 nhánh mẫu (Split-Sample)',
    'Đo lường mức tăng trưởng ý định mua (Lift %)',
    'So sánh đa chiều: Độc đáo, Cấp thiết & Giá trị',
  ],
  maxdiff: [
    'Xếp hạng khoa học độ ưu tiên tính năng/claims',
    'Phân tầng Core Must-Haves vs Low Priority',
    'Chỉ số tiện ích MaxDiff Score loại bỏ điểm ảo 5 sao',
  ],
  kano: [
    'Ma trận phân loại tính năng 4 góc phần tư',
    'Hệ số làm hài lòng (CS+) & giảm bất mãn (CS-)',
    'Tối ưu lộ trình R&D và cắt giảm tính năng dư thừa',
  ],
  brand_map: [
    'Tọa độ nhận thức thương hiệu so với đối thủ (X, Y)',
    'Phát hiện khoảng trống thị trường (White-space)',
    'Chiến lược tái định vị chiếm lĩnh đại dương xanh',
  ],
};

export default function Step1ModelSelect() {
  const { state, updateModel, setStep } = useWizard();
  const [configs, setConfigs] = useState<SurveyConfig[]>(DEFAULT_SURVEY_CONFIGS);
  const [modalConfig, setModalConfig] = useState<SurveyConfig | null>(null);

  useEffect(() => {
    // Nếu chưa có model nào được chọn, mặc định chọn nielsen_bases
    if (!state.selectedModel) {
      const defaultCfg = configs[0] || DEFAULT_SURVEY_CONFIGS[0];
      updateModel(defaultCfg.id, defaultCfg.name, defaultCfg.framework);
    }
    // Cập nhật thêm từ API nếu backend có thêm configs
    api.getSurveyConfigs()
      .then((c) => {
        if (c && c.length > 0) setConfigs(c);
      })
      .catch(() => {});
  }, [state.selectedModel, updateModel]);

  const handleSelect = (cfg: SurveyConfig) => {
    updateModel(cfg.id, cfg.name, cfg.framework);
  };

  const handleContinue = () => {
    if (!state.selectedModel && configs.length > 0) {
      handleSelect(configs[0]);
    }
    setStep(2);
  };

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
          Bảo trợ bởi mô hình <span className="font-semibold text-slate-900">1.000.000 chân dung người tiêu dùng tổng hợp (Synthetic Personas)</span> — Chuẩn phương pháp luận McKinsey, Nielsen, Kantar.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {configs.map((cfg) => {
          const selected = state.selectedModel === cfg.id;
          const cert = CERTIFICATIONS[cfg.id] || cfg.framework;
          const deliverables = DELIVERABLES[cfg.id] || [];
          const demoInfo = MODEL_DEMO_LINKS[cfg.id] || { id: 'DEMO-NIELSEN-BASES', label: 'Báo Cáo Mẫu' };

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
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-right uppercase tracking-wider">
                    {cert}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  {cfg.name}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm mt-2 leading-relaxed min-h-[42px]">
                  {cfg.description}
                </p>

                {/* Deliverables Checklist */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">
                    Bạn sẽ nhận được:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Live Demo Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                <a
                  href={`/results/${demoInfo.id}?tab=quantitative`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-2xs hover:shadow-xs group/btn"
                  title="Mở xem ngay biểu đồ & ma trận tương tác của mô hình này trong 5 giây"
                >
                  <span className="text-amber-700 text-sm">📊</span>
                  <span className="truncate">Xem Biểu Đồ (Live)</span>
                  <span className="font-mono text-[10px] text-amber-700 font-semibold group-hover/btn:translate-x-0.5 transition-transform">↗</span>
                </a>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/survey/${demoInfo.id}/pdf?download=true`}
                  download={`Bao-Cao-Nghien-Cuu-Thi-Truong-${demoInfo.id.replace('DEMO-', '')}.pdf`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all shrink-0"
                  title="Tải trực tiếp file PDF chính thức chuẩn A4"
                >
                  <span>📥</span>
                  <span>Tải PDF</span>
                </a>
              </div>

              {/* Card Footer: Preview link & selection indicator */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
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
                  <span>Xem {cfg.questions?.length ? `bộ ${cfg.questions.length} câu hỏi` : 'câu hỏi chuẩn hóa'} ↗</span>
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
            <strong className="text-slate-900">Cam kết học thuật:</strong> Mọi khảo sát đảm bảo cỡ mẫu N ≥ 500 tác tử AI, khoảng tin cậy 95%, sai số biên (MoE) ≤ ±4.3%. Khung mẫu phân tầng nhân khẩu học được chuẩn hóa và đối chuẩn (benchmark) theo Niên giám Thống kê của Tổng cục Thống kê (GSO), đảm bảo cơ cấu độ tuổi, giới tính và thu nhập phản ánh sát thực tế dân số Việt Nam.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleContinue}
          className="btn-primary w-full sm:w-auto text-sm sm:text-base py-3.5 px-8 shadow-md"
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
                  Bộ câu hỏi chuẩn hóa ({modalConfig.questions?.length || 4} câu): {modalConfig.name}
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
                Các câu hỏi dưới đây được hệ thống kích hoạt độc lập tới từng tác tử AI phân vai theo khung mẫu phân tầng đối chuẩn Niên giám GSO. Thang đo tâm lý học được thiết kế chuẩn hóa theo bộ khung phương pháp luận của Kantar và Nielsen.
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
