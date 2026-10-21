'use client';

import { useWizard } from '@/lib/wizard-context';

const STEPS = [
  { num: 1, stepCode: 'BƯỚC 01', label: 'Phương pháp' },
  { num: 2, stepCode: 'BƯỚC 02', label: 'Cấu hình mẫu' },
  { num: 3, stepCode: 'BƯỚC 03', label: 'Thông tin SP' },
  { num: 4, stepCode: 'BƯỚC 04', label: 'Thanh toán' },
  { num: 5, stepCode: 'BƯỚC 05', label: 'AI Giả lập' },
];

export default function WizardStepper() {
  const { state } = useWizard();
  const current = state.currentStep;

  return (
    <div className="w-full bg-white border-b border-slate-200 py-5 px-4 sm:px-8 mb-8 shadow-sm rounded-xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        {/* Continuous Connecting Line */}
        <div className="absolute top-5 left-8 right-8 h-[2px] bg-slate-200 -z-0" />

        {/* Progress Line */}
        <div
          className="absolute top-5 left-8 h-[2px] bg-amber-600 -z-0 transition-all duration-500"
          style={{
            width: `calc(${((Math.min(current, 5) - 1) / (STEPS.length - 1)) * 100}% - 48px)`,
          }}
        />

        {STEPS.map((step) => {
          const done = current > step.num;
          const active = current === step.num;

          return (
            <div key={step.num} className="flex flex-col items-center relative z-10 flex-1">
              {/* Stepper Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                  done
                    ? 'bg-emerald-600 text-white'
                    : active
                    ? 'bg-slate-900 text-amber-400 ring-4 ring-amber-100 scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {done ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.num}</span>
                )}
              </div>

              {/* 2-line Label */}
              <div className="mt-2 text-center flex flex-col items-center">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    active ? 'text-amber-700' : done ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {step.stepCode}
                </span>
                <span
                  className={`text-xs mt-0.5 whitespace-nowrap ${
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
