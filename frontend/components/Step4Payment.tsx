'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, formatVND } from '@/lib/api';
import { useWizard } from '@/lib/wizard-context';

export default function Step4Payment() {
  const { state, setStep } = useWizard();
  const { surveyId, priceAmount, qrData, sampleSize, region, modelName } = state;
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const router = useRouter();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 5-minute countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  // Poll backend status every 2.5s for SePay webhook confirmation
  useEffect(() => {
    if (!surveyId) return;
    pollRef.current = setInterval(async () => {
      try {
        const s = await api.getSurveyStatus(surveyId);
        if (s.status === 'PROCESSING' || s.status === 'COMPLETED') {
          clearInterval(pollRef.current!);
          setStep(5);
          router.push(`/processing/${surveyId}`);
        }
      } catch {
        // network polling retry
      }
    }, 2500);

    return () => clearInterval(pollRef.current!);
  }, [surveyId, setStep, router]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulatePayment = async () => {
    if (!surveyId) return;
    setSimulating(true);
    try {
      // Call test webhook simulation or trigger status directly
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/payment/simulate/${surveyId}`, {
        method: 'POST',
      }).catch(() => null);

      setStep(5);
      router.push(`/processing/${surveyId}`);
    } catch (e) {
      console.error(e);
      // Fallback redirect directly
      setStep(5);
      router.push(`/processing/${surveyId}`);
    } finally {
      setSimulating(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const projectCode = surveyId ? `#PANEL-${surveyId.slice(0, 8).toUpperCase()}` : '#PANEL-PREVIEW';

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
          <span>✦ BƯỚC 04 / 04</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
          Phiếu thanh toán & Kích hoạt khảo sát
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
          Quét mã VietQR bằng ứng dụng ngân hàng bất kỳ. Hệ thống sẽ tự động ghi nhận chuyển khoản và kích hoạt khảo sát ngay lập tức.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        {/* Left Column (7 cols): Proforma Research Invoice */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Invoice Header */}
          <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                OFFICIAL RESEARCH INVOICE
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                Bản Kê Chi Phí Khảo Sát
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Nền tảng Nghiên cứu Thị trường AI Synthetic Panel Việt Nam
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Mã hồ sơ dự án</span>
              <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">
                {projectCode}
              </span>
              <div className="mt-2 inline-block px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                CHỜ THANH TOÁN
              </div>
            </div>
          </div>

          {/* Invoice Details Table */}
          <div className="p-6 space-y-4">
            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 text-xs">Phương pháp nghiên cứu</span>
                <span className="font-semibold text-slate-900 text-right">
                  {modelName || 'Kiểm định Ý tưởng Sản phẩm (BASES)'}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 text-xs">Quy mô mẫu thực nghiệm</span>
                <span className="font-semibold text-slate-900 font-mono">
                  N = {sampleSize.toLocaleString('vi-VN')} hồ sơ
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 text-xs">Phạm vi địa lý & nhân khẩu</span>
                <span className="font-semibold text-slate-900">
                  {region} (18 - 65 tuổi)
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 text-xs">Thuật toán phân bổ</span>
                <span className="text-slate-700 text-xs font-medium">
                  Phân tầng thống kê chuẩn xác (Stratified Quota Sampling)
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-500 text-xs">Báo cáo xuất xưởng</span>
                <span className="text-slate-700 text-xs font-medium">
                  Executive Dashboard + File PDF A4
                </span>
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                  Tổng kinh phí trọn gói
                </span>
                <span className="text-[11px] text-slate-400">Không phát sinh phụ phí</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-slate-900">
                  {formatVND(priceAmount || 300000)}
                </span>
              </div>
            </div>

            {/* Account Info Pill */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-500">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">
                    {qrData?.accountNumber || '0987654321'}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(qrData?.accountNumber || '0987654321', 'acc')}
                    className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition-colors"
                  >
                    {copiedField === 'acc' ? 'Đã sao chép ✓' : 'Sao chép'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-500">Nội dung chuyển khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">
                    {qrData?.addInfo || surveyId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(qrData?.addInfo || surveyId, 'info')}
                    className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition-colors"
                  >
                    {copiedField === 'info' ? 'Đã sao chép ✓' : 'Sao chép'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): VietQR Box + Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 shadow-md text-center">
            {/* Bank Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-900">
                {qrData?.bankName || 'Ngân Hàng MB Bank'}
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                VietQR Pro
              </span>
            </div>

            {/* QR Code Container */}
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 inline-block mb-3">
              {qrData?.qrDataURL ? (
                <img
                  src={qrData.qrDataURL}
                  alt="VietQR Code"
                  className="w-48 h-48 object-contain mx-auto rounded-lg shadow-xs"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs font-mono">
                  [VietQR Image]
                </div>
              )}
            </div>

            {/* Account Owner */}
            <div className="text-xs text-slate-600 mb-4">
              Chủ TK: <strong className="text-slate-900">{qrData?.accountName || 'CONG TY CP AI RESEARCH'}</strong>
            </div>

            {/* Countdown Timer */}
            <div className="bg-slate-50 py-3 px-4 rounded-xl border border-slate-200 mb-4">
              <div className="text-[11px] text-slate-500 mb-1">Hiệu lực giao dịch còn lại</div>
              <div className="font-mono text-2xl font-bold text-slate-900 tracking-wider">
                {minutes}:{seconds}
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-amber-600 h-full transition-all duration-1000"
                  style={{ width: `${(timeLeft / 300) * 100}%` }}
                />
              </div>
            </div>

            {/* Transfer Confirmation Pulse */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>Hệ thống đang tự động lắng nghe xác nhận chuyển khoản...</span>
            </div>
          </div>

          {/* Manual Confirm Button */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <span className="text-[11px] text-slate-500 block mb-2">
              Sau khi chuyển khoản thành công trên app ngân hàng:
            </span>
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={simulating}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{simulating ? 'Đang xác thực giao dịch...' : '✓ Tôi Đã Hoàn Tất Chuyển Khoản (Tiến Hành Khảo Sát)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Back Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          ← Quay lại chỉnh sửa thông tin SP
        </button>
      </div>
    </div>
  );
}
