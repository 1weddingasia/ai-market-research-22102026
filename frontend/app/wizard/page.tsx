'use client';

import WizardStepper from '@/components/WizardStepper';
import Step1ModelSelect from '@/components/Step1ModelSelect';
import Step2SampleConfig from '@/components/Step2SampleConfig';
import Step3ProductInfo from '@/components/Step3ProductInfo';
import Step4Payment from '@/components/Step4Payment';
import { useWizard } from '@/lib/wizard-context';

function StepContent() {
  const { state } = useWizard();
  switch (state.currentStep) {
    case 1:
      return <Step1ModelSelect />;
    case 2:
      return <Step2SampleConfig />;
    case 3:
      return <Step3ProductInfo />;
    case 4:
      return <Step4Payment />;
    default:
      return <Step1ModelSelect />;
  }
}

export default function WizardPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Editorial Trust Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400">🔬</span> N = 1.000.000 hồ sơ người tiêu dùng Việt Nam
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400">📊</span> 5 phương pháp chuẩn quốc tế (Nielsen, Kantar, Van Westendorp)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400">⚡</span> Xử lý DuckDB & AI trong 60 giây
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">🔒</span> Bảo mật dữ liệu & Báo cáo đóng dấu doanh nghiệp
          </span>
        </div>
      </div>

      {/* Executive Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 shadow-xs sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
              <span className="text-amber-400 font-serif font-bold text-sm tracking-tighter">AI</span>
            </div>
            <div>
              <div className="font-serif font-bold text-slate-900 text-base leading-tight">
                AI Market Research
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Executive Intelligence Platform · Vietnam Synthetic Panel
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              DuckDB Online
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Chuẩn Quốc Tế EIDS v2.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Wizard Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full py-8 px-4 sm:px-6">
        <WizardStepper />
        <StepContent />
      </div>

      {/* Academic Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 px-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Hệ thống vận hành bởi Cụm AI Personas Việt Nam · DuckDB Engine · Cổng thanh toán tự động SePay
          </div>
          <div className="text-slate-400">
            © 2026 AI Market Research Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
