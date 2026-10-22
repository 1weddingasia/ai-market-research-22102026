'use client';

import { useWizard } from '@/lib/wizard-context';

const STEPS = [
  { num: 1, stepCode: 'BƯỚC 01', label: 'Phương pháp' },
  { num: 2, stepCode: 'BƯỚC 02', label: 'Cấu hình mẫu' },
  { num: 3, stepCode: 'BƯỚC 03', label: 'Thông tin SP' },
  { num: 4, stepCode: 'BƯỚC 04', label: 'Thanh toán' },
  { num: 5, stepCode: 'BƯỚC 05', label: 'Khảo sát AI' },
];

export default function WizardStepper() {
  const { state } = useWizard();
  const current = state.currentStep;
  const activeStep = STEPS.find((s) => s.num === current) || STEPS[0];

  return (
    <div className="w-full bg-white border border-slate-200 py-3.5 sm:py-5 px-3 sm:px-8 mb-6 sm:mb-8 shadow-xs rounded-2xl">
      {/* Mobile Top Indicator */}
      <div className="flex sm:hidden items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
        <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          {activeStep.stepCode}
        </span>
        <span className="font-bold text-slate-800">
          {activeStep.label}
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          {Math.min(current, 5)} / 5
        </span>
      </div>

      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        {/* Continuous Connecting Line */}
        <div className="absolute top-4 sm:top-5 left-4 sm:left-8 right-4 sm:right-8 h-[2px] bg-slate-200 -z-0" />

        {/* Progress Line */}
        <div
          className="absolute top-4 sm:top-5 left-4 sm:left-8 h-[2px] bg-amber-600 -z-0 transition-all duration-500"
          style={{
            width: `calc(${((Math.min(current, 5) - 1) / (STEPS.length - 1)) * 100}% - 24px)`,
          }}
        />

        {STEPS.map((step) => {
          const done = current > step.num;
          const active = current === step.num;

          return (
            <div key={step.num} className="flex flex-col items-center relative z-10 flex-1">
              {/* Stepper Circle */}
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-xs ${
                  done
                    ? 'bg-emerald-600 text-white'
                    : active
                    ? 'bg-slate-900 text-amber-400 ring-2 sm:ring-4 ring-amber-200 scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.num}</span>
                )}
              </div>

              {/* 2-line Label */}
              <div className="mt-1.5 sm:mt-2 text-center flex flex-col items-center">
                <span
                  className={`hidden sm:inline text-[9px] sm:text-[10px] uppercase font-bold tracking-wider ${
                    active ? 'text-amber-700' : done ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {step.stepCode}
                </span>
                <span
                  className={`text-[10px] sm:text-xs mt-0.5 leading-tight ${
                    active
                      ? 'font-bold text-slate-900'
                      : done
                      ? 'font-medium text-slate-700'
                      : 'font-normal text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
