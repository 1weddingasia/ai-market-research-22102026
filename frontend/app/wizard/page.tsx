'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import WizardStepper from '@/components/WizardStepper';
import Step1ModelSelect from '@/components/Step1ModelSelect';
import Step2SampleConfig from '@/components/Step2SampleConfig';
import Step3ProductInfo from '@/components/Step3ProductInfo';
import Step4Payment from '@/components/Step4Payment';
import { useWizard } from '@/lib/wizard-context';
import { DEFAULT_SURVEY_CONFIGS } from '@/lib/survey-configs';

function QueryParamHandler() {
  const searchParams = useSearchParams();
  const { updateSampleConfig, updateModel, state } = useWizard();

  useEffect(() => {
    const sampleParam = searchParams.get('sample');
    if (sampleParam) {
      const parsed = parseInt(sampleParam, 10);
      if ([500, 1000, 2000, 3000].includes(parsed)) {
        updateSampleConfig({ sampleSize: parsed });
      }
    }

    const modelParam = searchParams.get('model');
    if (modelParam && !state.selectedModel) {
      const found = DEFAULT_SURVEY_CONFIGS.find((c) => c.id === modelParam);
      if (found) {
        updateModel(found.id, found.name, found.framework);
      }
    }
  }, [searchParams, updateSampleConfig, updateModel, state.selectedModel]);

  return null;
}

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
      <Suspense fallback={null}>
        <QueryParamHandler />
      </Suspense>

      {/* Editorial Trust Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400">🔬</span> 1.000.000 Chân dung người tiêu dùng tổng hợp (Synthetic Personas)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400">📊</span> 9 phương pháp chuẩn quốc tế (Nielsen, Kantar, Van Westendorp, MaxDiff, Kano...)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400">⚡</span> Mô phỏng tức thì bằng AI trong 60 giây
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">🔒</span> Bảo mật dữ liệu & Báo cáo đóng dấu doanh nghiệp
          </span>
        </div>
      </div>

      {/* Executive Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-10 py-3 sm:py-4 shadow-xs sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo có Link quay lại trang chủ */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-slate-900 group-hover:bg-amber-600 transition-colors flex items-center justify-center shadow-xs">
              <span className="text-amber-400 group-hover:text-white font-serif font-bold text-xs sm:text-sm tracking-tighter transition-colors">AI</span>
            </div>
            <div>
              <div className="font-serif font-bold text-slate-900 group-hover:text-amber-700 text-sm sm:text-base leading-tight transition-colors">
                AI Market Research
              </div>
              <div className="hidden sm:block text-[11px] text-slate-500 font-medium">
                Executive Intelligence Platform · Vietnam Synthetic Panel
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2.5 sm:px-3 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              ← <span className="hidden xs:inline">Về</span> trang chủ
            </Link>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Phân tầng GSO
            </span>
            <span className="hidden sm:inline-flex text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Chuẩn ESOMAR v2.0
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
            Hệ thống vận hành bởi Cụm AI Synthetic Personas Việt Nam · Phân tầng thống kê GSO · Cổng thanh toán VietQR tự động
          </div>
          <div className="text-slate-400">
            © 2026 AI Market Research Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
