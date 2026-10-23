'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, formatVND } from '@/lib/api';
import { useWizard } from '@/lib/wizard-context';

export default function Step4Payment() {
  const { state, setStep, setDiscountState } = useWizard();
  const {
    surveyId,
    priceAmount,
    qrData,
    sampleSize,
    region,
    modelName,
    originalPrice,
    discountCode,
    discountAmount,
    isFree,
  } = state;

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activatingFree, setActivatingFree] = useState(false);

  // Discount code local state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const router = useRouter();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 5-minute countdown (only active if payment required)
  useEffect(() => {
    if (isFree || priceAmount === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFree, priceAmount]);

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

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [surveyId, setStep, router]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Áp dụng mã giảm giá
  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponCode.trim() || !surveyId) return;

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await api.applyDiscount(surveyId, couponCode.trim());
      if (res.success) {
        setDiscountState({
          priceAmount: res.final_amount,
          originalPrice: res.original_price,
          discountCode: res.discount_code,
          discountAmount: res.discount_amount,
          qrData: res.qr_data || null,
          isFree: res.is_free,
        });
        setCouponSuccess(res.message);
        setCouponCode('');
      } else {
        setCouponError(res.message || 'Mã ưu đãi không hợp lệ.');
      }
    } catch (err: unknown) {
      setCouponError(err instanceof Error ? err.message : 'Mã ưu đãi không hợp lệ hoặc đã hết hạn.');
    } finally {
      setCouponLoading(false);
    }
  };

  // Hủy mã giảm giá
  const handleRemoveCoupon = async () => {
    if (!surveyId) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await api.removeDiscount(surveyId);
      if (res.success) {
        setDiscountState({
          priceAmount: res.final_amount,
          originalPrice: res.original_price,
          discountCode: null,
          discountAmount: 0,
          qrData: res.qr_data || null,
          isFree: false,
        });
        setCouponSuccess('Đã hủy mã ưu đãi, khôi phục giá gốc.');
        setTimeout(() => setCouponSuccess(''), 3000);
      }
    } catch (err: unknown) {
      setCouponError(err instanceof Error ? err.message : 'Có lỗi khi hủy mã ưu đãi.');
    } finally {
      setCouponLoading(false);
    }
  };

  // Kích hoạt khảo sát miễn phí 100%
  const handleActivateFree = async () => {
    if (!surveyId) return;
    setActivatingFree(true);
    try {
      await api.activateFreeSurvey(surveyId);
      setStep(5);
      router.push(`/processing/${surveyId}`);
    } catch (err: unknown) {
      setCouponError(err instanceof Error ? err.message : 'Kích hoạt thất bại. Vui lòng thử lại.');
      setActivatingFree(false);
    }
  };

  // Nút kiểm tra giao dịch chuyển khoản thực tế (SePay)
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState('');

  const handleCheckPaymentStatus = async () => {
    if (!surveyId) return;
    setCheckingPayment(true);
    setPaymentNotice('');
    try {
      const s = await api.getSurveyStatus(surveyId);
      if (s.status === 'PROCESSING' || s.status === 'COMPLETED') {
        setStep(5);
        router.push(`/processing/${surveyId}`);
      } else {
        setPaymentNotice(`Hệ thống đang đối soát với ngân hàng (thường mất 5 - 15 giây sau khi chuyển). Nếu bạn đã chuyển khoản với đúng nội dung ${surveyId}, vui lòng đợi giây lát hoặc bấm lại nút này.`);
      }
    } catch {
      setPaymentNotice('Chưa thể kết nối đối soát lúc này. Vui lòng thử lại sau giây lát.');
    } finally {
      setCheckingPayment(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const projectCode = surveyId ? `#PANEL-${surveyId.slice(0, 8).toUpperCase()}` : '#PANEL-PREVIEW';
  const effectiveOriginalPrice = originalPrice > 0 ? originalPrice : (priceAmount + discountAmount) || 300000;
  const isZeroCost = isFree || priceAmount === 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
          <span>✦ BƯỚC 04 / 04</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
          {isZeroCost ? 'Xác nhận hồ sơ & Kích hoạt khảo sát' : 'Phiếu thanh toán & Kích hoạt khảo sát'}
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
          {isZeroCost
            ? 'Hồ sơ đã được áp dụng mã ưu đãi 100%. Bạn có thể bấm kích hoạt để cụm AI bắt đầu khảo sát ngay lập tức.'
            : 'Quét mã VietQR bằng ứng dụng ngân hàng bất kỳ. Hệ thống sẽ tự động ghi nhận chuyển khoản và kích hoạt khảo sát ngay lập tức.'}
        </p>
      </div>

      {/* ── BĂNG NHẬP MÃ ƯU ĐÃI NỔI BẬT (PROMINENT COUPON BAR) ── */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50/80 border-2 border-amber-300 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl">🏷️</span>
              <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Bạn có mã ưu đãi / Voucher đối tác?
              </span>
              {discountCode && (
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ ĐÃ ÁP DỤNG: {discountCode}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600">
              Nhập mã ưu đãi hoặc voucher đối tác (nếu có) để được khấu trừ trực tiếp vào kinh phí khảo sát.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {!discountCode ? (
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã ưu đãi / voucher..."
                  disabled={couponLoading}
                  className="w-full sm:w-56 bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-mono font-bold tracking-wider uppercase transition-all disabled:opacity-50 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  {couponLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang kiểm tra...</span>
                    </>
                  ) : (
                    <span>Áp Dụng</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-emerald-800">
                  {isZeroCost ? '🎉 Miễn phí 100%' : `Tiết kiệm ${formatVND(discountAmount)}`}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  disabled={couponLoading}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
                >
                  Hủy mã
                </button>
              </div>
            )}
          </div>
        </div>

        {couponError && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-1.5">
            <span>⚠️</span>
            <span>{couponError}</span>
          </div>
        )}

        {couponSuccess && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <span>✓</span>
            <span>{couponSuccess}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        {/* Left Column (7 cols): Proforma Research Invoice */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Invoice Header */}
          <div className="bg-slate-900 text-white p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                OFFICIAL RESEARCH INVOICE
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Bản Kê Chi Phí Khảo Sát
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
                Nền tảng Nghiên cứu Thị trường AI Synthetic Panel Việt Nam
              </p>
            </div>
            <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-0 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
              <span className="text-[10px] text-slate-400 block">Mã hồ sơ:</span>
              <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm tracking-wider">
                {projectCode}
              </span>
              <div
                className={`sm:mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isZeroCost
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                    : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                }`}
              >
                {isZeroCost ? 'MIỄN PHÍ 100%' : 'CHỜ THANH TOÁN'}
              </div>
            </div>
          </div>

          {/* Invoice Details Table */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2">
                <span className="text-slate-500 text-xs shrink-0">Phương pháp nghiên cứu</span>
                <span className="font-semibold text-slate-900 text-right text-xs sm:text-sm">
                  {modelName || 'Kiểm định Ý tưởng Sản phẩm (BASES)'}
                </span>
              </div>
              <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2">
                <span className="text-slate-500 text-xs">Quy mô mẫu</span>
                <span className="font-semibold text-slate-900 font-mono text-xs sm:text-sm">
                  N = {sampleSize.toLocaleString('vi-VN')} hồ sơ
                </span>
              </div>
              <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2">
                <span className="text-slate-500 text-xs">Phạm vi địa lý & nhân khẩu</span>
                <span className="font-semibold text-slate-900 text-xs sm:text-sm text-right">
                  {region} (18 - 65 tuổi)
                </span>
              </div>
              <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2">
                <span className="text-slate-500 text-xs">Thuật toán phân bổ</span>
                <span className="text-slate-700 text-xs font-medium text-right">
                  Phân tầng thống kê chuẩn xác (Stratified Quota Sampling)
                </span>
              </div>
              <div className="py-2.5 sm:py-3 flex items-center justify-between gap-2">
                <span className="text-slate-500 text-xs">Báo cáo xuất xưởng</span>
                <span className="text-slate-700 text-xs font-medium text-right">
                  Executive Dashboard + File PDF A4
                </span>
              </div>
            </div>

            {/* Status indicator if discount applied */}
            {discountCode && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs">
                <span className="font-bold text-emerald-900">
                  🏷️ Đã áp dụng mã: <span className="font-mono">{discountCode}</span>
                </span>
                <span className="font-semibold text-emerald-700">
                  Giảm {formatVND(discountAmount)}
                </span>
              </div>
            )}

            {/* Total Section with breakdown if discounted */}
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-2">
              {discountAmount > 0 && (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Kinh phí gốc:</span>
                    <span className="line-through">{formatVND(effectiveOriginalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
                    <span>Ưu đãi khấu trừ ({discountCode}):</span>
                    <span>- {formatVND(discountAmount)}</span>
                  </div>
                  <div className="border-t border-slate-200/80 pt-2" />
                </>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-700 tracking-wider block">
                    {discountAmount > 0 ? 'Kinh phí thực tế cần thanh toán' : 'Tổng kinh phí trọn gói'}
                  </span>
                  <span className="text-[11px] text-slate-400">Không phát sinh phụ phí</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xl sm:text-2xl font-serif font-bold ${
                      isZeroCost ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {formatVND(priceAmount || 0)}
                  </span>
                  {isZeroCost && (
                    <span className="text-[11px] font-bold text-emerald-700 block">
                      (Tài trợ toàn bộ 100%)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Account Info Pill (Only when payment > 0) */}
            {!isZeroCost && (
              <div className="space-y-2 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500">Nội dung chuyển khoản:</span>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
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
            )}
          </div>
        </div>

        {/* Right Column (5 cols): VietQR Box OR 100% Free Activation Card */}
        <div className="lg:col-span-5 space-y-4">
          {isZeroCost ? (
            /* ── CELEBRATORY CARD CHO MÃ GIẢM 100% ── */
            <div className="bg-gradient-to-b from-emerald-500/10 via-emerald-50/60 to-white border-2 border-emerald-400 rounded-2xl p-5 sm:p-6 shadow-md text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-3xl mx-auto shadow-inner">
                🎁
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mb-2">
                  ƯU ĐÃI ĐẶC BIỆT 100%
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Hồ Sơ Đủ Điều Kiện Kích Hoạt Miễn Phí
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Bạn đã kích hoạt thành công mã ưu đãi toàn phần <strong>{discountCode}</strong> (0đ). Bạn không cần chuyển khoản ngân hàng. Hãy bấm nút dưới đây để hệ thống AI bắt đầu mô phỏng ngay lập tức!
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleActivateFree}
                  disabled={activatingFree}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {activatingFree ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang kích hoạt hệ thống AI...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀 Bắt Đầu Khảo Sát Ngay</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                Tốc độ xử lý: ~60 giây · Báo cáo gửi trực tiếp về email
              </div>
            </div>
          ) : (
            /* ── VIETQR BOX BÌNH THƯỜNG / SAU GIẢM GIÁ 30%, 50% ── */
            <>
              <div className="bg-white border-2 border-amber-300 rounded-2xl p-4 sm:p-6 shadow-md text-center">
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
                      [Đang tạo mã VietQR...]
                    </div>
                  )}
                </div>

                {/* Beneficiary Name */}
                <div className="text-xs sm:text-sm text-slate-600 mb-4">
                  Đơn vị thụ hưởng: <strong className="text-slate-900">HỆ THỐNG INSIGHT AI</strong>
                </div>

                {/* Countdown Timer */}
                <div className="bg-slate-50 py-3 px-4 rounded-xl border border-slate-200 mb-4">
                  <div className="text-xs text-slate-500 mb-1">Hiệu lực giao dịch còn lại</div>
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
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span>Hệ thống đang tự động lắng nghe xác nhận chuyển khoản...</span>
                </div>
              </div>

              {/* Manual Confirm Button */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2.5">
                <span className="text-xs sm:text-sm text-slate-600 font-medium block">
                  Sau khi quét mã VietQR và chuyển khoản thành công:
                </span>
                <button
                  type="button"
                  onClick={handleCheckPaymentStatus}
                  disabled={checkingPayment}
                  className="btn-primary w-full text-sm sm:text-base py-3 px-4 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {checkingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang kiểm tra giao dịch với ngân hàng...</span>
                    </>
                  ) : (
                    <span>✓ Tôi Đã Chuyển Khoản Xong (Kiểm Tra Giao Dịch Ngay)</span>
                  )}
                </button>
                {paymentNotice && (
                  <p className="text-xs sm:text-sm text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200 text-left font-medium leading-relaxed">
                    ℹ️ {paymentNotice}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Back Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="btn-outline text-xs sm:text-sm py-2.5 px-4 rounded-lg"
        >
          ← Quay lại chỉnh sửa thông tin SP
        </button>
      </div>
    </div>
  );
}
