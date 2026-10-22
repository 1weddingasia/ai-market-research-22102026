'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api, formatVND } from '@/lib/api';

interface SurveyItem {
  survey_id: string;
  product_name: string;
  model_type: string;
  status: string;
  sample_size: number;
  price_amount: number;
  viability_score?: number;
  verdict?: string;
  created_at: string;
  completed_at?: string;
  results_url?: string;
  print_url?: string;
}

export default function TraCuuPage() {
  const [step, setStep] = useState<'EMAIL' | 'OTP' | 'RESULTS'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);

  // Trạng thái xóa riêng 1 báo cáo
  const [deleteSurveyId, setDeleteSurveyId] = useState<string | null>(null);
  const [deleteSurveyLoading, setDeleteSurveyLoading] = useState(false);
  const [deleteSurveyError, setDeleteSurveyError] = useState('');
  const [deleteSurveySuccess, setDeleteSurveySuccess] = useState('');

  const handleConfirmDelete = async () => {
    if (!deleteSurveyId) return;
    setDeleteSurveyLoading(true);
    setDeleteSurveyError('');
    try {
      await api.deleteSurvey(deleteSurveyId, email.trim().toLowerCase());
      setDeleteSurveySuccess(`Báo cáo #${deleteSurveyId} đã được tiêu hủy thành công.`);
      setSurveys((prev) => prev.filter((s) => s.survey_id !== deleteSurveyId));
      setTimeout(() => {
        setDeleteSurveyId(null);
        setDeleteSurveySuccess('');
      }, 1500);
    } catch (err: any) {
      setDeleteSurveyError(err.message || 'Lỗi khi tiêu hủy báo cáo. Vui lòng thử lại.');
    } finally {
      setDeleteSurveyLoading(false);
    }
  };

  // BƯỚC 1: Gửi OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ email doanh nghiệp hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.requestLookupOtp(cleanEmail);
      setInfoMessage(res.message);
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Không tìm thấy báo cáo nào liên kết với email này.');
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 2: Xác thực OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyLookupOtp(email.trim().toLowerCase(), cleanOtp);
      setSurveys(res.surveys || []);
      setStep('RESULTS');
    } catch (err: any) {
      setError(err.message || 'Mã xác thực không chính xác hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col justify-between">
      {/* ── Header ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 group-hover:bg-amber-600 transition-colors flex items-center justify-center shadow-xs">
              <span className="text-amber-400 group-hover:text-white font-serif font-black text-xs sm:text-sm transition-colors">AI</span>
            </div>
            <div>
              <span className="font-serif font-bold text-slate-900 group-hover:text-amber-700 text-sm sm:text-base tracking-tight block leading-tight transition-colors">
                AI Market Research
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Hệ Thống Tra Cứu Báo Cáo Doanh Nghiệp
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-slate-100 transition-all"
            >
              ← Trang chủ
            </Link>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xs transition-all"
            >
              <span>Tạo khảo sát mới</span>
              <span className="text-amber-400">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full flex-1">
        {/* Banner tiêu đề */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-3 font-mono">
            <span>🔒 TRA CỨU BẢO MẬT KHÔNG CẦN MẬT KHẨU</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tra Cứu Hồ Sơ & Báo Cáo Nghiên Cứu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
            Nhập email doanh nghiệp bạn đã sử dụng khi khởi tạo khảo sát để nhận mã truy cập và xem lại toàn bộ hồ sơ báo cáo.
          </p>
        </div>

        {/* ── STEP 1: NHẬP EMAIL ── */}
        {step === 'EMAIL' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label htmlFor="email-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Địa chỉ Email nhận báo cáo
                </label>
                <div className="relative">
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ví dụ: giamdoc@congty.com"
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Hệ thống sẽ gửi một mã OTP 6 số về email này để xác thực quyền sở hữu.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang kiểm tra hệ thống...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi mã xác thực OTP</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="text-emerald-500">✓</span> Không cần mật khẩu
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-500">✓</span> Mã hóa đầu cuối
              </span>
            </div>
          </div>
        )}

        {/* ── STEP 2: NHẬP OTP ── */}
        {step === 'OTP' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-xl mx-auto mb-3">
                ✉️
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Nhập Mã Xác Thực 6 Số
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Mã xác thực đã được gửi tới hộp thư: <strong className="text-slate-800">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center tracking-[12px] font-mono text-2xl sm:text-3xl font-extrabold py-3.5 px-4 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 transition-all text-slate-900"
                />
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Mã OTP có hiệu lực trong 10 phút. Vui lòng kiểm tra cả hòm thư Spam nếu chưa thấy.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed text-center">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang giải mã hồ sơ...</span>
                  </>
                ) : (
                  <span>Xác Nhận & Xem Danh Sách Báo Cáo →</span>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('EMAIL');
                    setError('');
                  }}
                  className="hover:text-slate-900 underline underline-offset-2 cursor-pointer"
                >
                  Đổi email khác
                </button>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                >
                  Gửi lại mã OTP
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3: DANH SÁCH BÁO CÁO ── */}
        {step === 'RESULTS' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Hồ sơ tài khoản khách hàng
                </span>
                <div className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{email}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Đã xác thực OTP
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Tổng cộng: <strong className="text-slate-900">{surveys.length}</strong> báo cáo
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('EMAIL');
                    setEmail('');
                    setOtp('');
                    setSurveys([]);
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            </div>

            {surveys.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <div className="text-3xl mb-3">📭</div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Chưa có báo cáo nào được ghi nhận
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                  Email này chưa khởi tạo báo cáo khảo sát nào hoặc các khảo sát trước đó đã được tiêu hủy theo yêu cầu bảo mật.
                </p>
                <Link
                  href="/wizard"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all"
                >
                  Khởi tạo khảo sát đầu tiên →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {surveys.map((s) => {
                  const isCompleted = s.status === 'COMPLETED';
                  const dateStr = s.created_at ? new Date(s.created_at).toLocaleDateString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  }) : '—';

                  return (
                    <div
                      key={s.survey_id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            #{s.survey_id}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                            {s.model_type.replace(/_/g, ' ')}
                          </span>
                          {isCompleted ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              ✓ ĐÃ HOÀN TẤT
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                              ⏳ ĐANG XỬ LÝ
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-lg font-bold text-slate-900">
                          {s.product_name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                          <span>Quy mô: <strong className="text-slate-800">N = {s.sample_size?.toLocaleString('vi-VN')} Personas</strong></span>
                          <span>·</span>
                          <span>Thời gian: {dateStr}</span>
                          {s.viability_score !== undefined && s.viability_score !== null && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-700 font-bold">
                                Điểm khả thi: {s.viability_score}/100
                              </span>
                            </>
                          )}
                        </div>

                        {s.verdict && (
                          <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200/80 line-clamp-2">
                            "{s.verdict}"
                          </p>
                        )}
                      </div>

                      {/* Nút hành động */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {isCompleted ? (
                          <>
                            <Link
                              href={`/results/${s.survey_id}`}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all text-center"
                            >
                              <span>Xem Dashboard</span>
                              <span>→</span>
                            </Link>
                            <div className="flex items-center gap-1.5 w-full sm:w-auto">
                              <Link
                                href={`/results/${s.survey_id}/print`}
                                target="_blank"
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs py-1.5 px-3 rounded-lg border border-slate-300 transition-all text-center"
                              >
                                <span>📄 In A4</span>
                              </Link>
                              <a
                                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/survey/${s.survey_id}/pdf?download=true`}
                                download={`bao-cao-khao-sat-${s.survey_id}.html`}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-1.5 px-3 rounded-lg border border-slate-300 transition-all text-center"
                              >
                                <span>💾 Tải file</span>
                              </a>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteSurveyId(s.survey_id);
                                setDeleteSurveyError('');
                                setDeleteSurveySuccess('');
                              }}
                              className="text-slate-400 hover:text-red-600 text-[11px] font-medium py-1 px-2 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              title="Chỉ xóa duy nhất báo cáo này"
                            >
                              🗑️ Xóa riêng báo cáo này
                            </button>
                          </>
                        ) : (
                          <Link
                            href={`/results/${s.survey_id}`}
                            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all"
                          >
                            <span>Theo dõi tiến trình</span>
                            <span>→</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Modal Tiêu Hủy Riêng 1 Báo Cáo ── */}
      {deleteSurveyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Tiêu Hủy Riêng Báo Cáo Này
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Mã hồ sơ: #{deleteSurveyId}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Bạn đang yêu cầu tiêu hủy <strong className="text-red-700">DUY NHẤT báo cáo khảo sát mã #{deleteSurveyId}</strong>.
              <br /><br />
              🛡️ <strong>Cam kết an toàn tuyệt đối:</strong> Toàn bộ các báo cáo khảo sát khác của bạn (nếu có) trên hệ thống vẫn được <strong>bảo toàn nguyên vẹn 100%</strong>. Hành động này không thể hoàn tác.
            </p>

            {deleteSurveyError && (
              <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                ⚠️ {deleteSurveyError}
              </div>
            )}

            {deleteSurveySuccess && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                ✅ {deleteSurveySuccess}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleteSurveyLoading}
                onClick={() => setDeleteSurveyId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleteSurveyLoading || !!deleteSurveySuccess}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {deleteSurveyLoading ? 'Đang tiêu hủy...' : 'Xác nhận xóa riêng báo cáo này'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>AI Market Research Platform · insight.1booking.asia</span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Bảo Mật Cấp Doanh Nghiệp</span>
            <span>·</span>
            <span>Xác thực OTP 100% không ma sát</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
