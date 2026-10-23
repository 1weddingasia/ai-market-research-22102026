'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface LogEntry {
  percent: number;
  log: string;
  status?: string;
  time?: string;
}

export default function ProcessingPage() {
  const params = useParams();
  const surveyId = (params.id as string) || '';
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [sampleSize, setSampleSize] = useState<number>(1000);
  const [isPendingPayment, setIsPendingPayment] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Timer for elapsed seconds
  useEffect(() => {
    if (done || failed) return;
    const timer = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [done, failed]);

  useEffect(() => {
    if (!surveyId) return;

    fetch(`${API_URL}/survey/${surveyId}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.sample_size) setSampleSize(data.sample_size);
        if (data.status === 'PENDING_PAYMENT') {
          setIsPendingPayment(true);
        }
        if (data.status === 'COMPLETED') {
          setPercent(100);
          setDone(true);
          setTimeout(() => router.push(`/results/${surveyId}`), 1000);
        }
      })
      .catch(() => {});

    // Connect to SSE stream
    const es = new EventSource(`${API_URL}/survey/${surveyId}/stream`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if ('ping' in data) return;

        const newPercent = typeof data.percent === 'number' ? data.percent : 0;
        setPercent(newPercent);

        const now = new Date();
        const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        setLogs((prev) => [
          ...prev,
          {
            percent: newPercent,
            log: data.log || data.message || 'Đang xử lý...',
            status: data.status,
            time: timeStr,
          },
        ]);

        if (data.status === 'COMPLETED' || newPercent >= 100) {
          setDone(true);
          es.close();
          setTimeout(() => {
            router.push(`/results/${surveyId}`);
          }, 2000);
        }

        if (data.status === 'FAILED') {
          setFailed(true);
          setErrorMessage(data.log || 'Xử lý thất bại. Vui lòng thử lại.');
          es.close();
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    es.onerror = () => {
      // Fallback check status via HTTP polling
      const pollTimer = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/survey/${surveyId}/status`);
          if (res.ok) {
            const s = await res.json();
            if (s.sample_size) setSampleSize(s.sample_size);
            if (s.status === 'COMPLETED') {
              setPercent(100);
              setDone(true);
              clearInterval(pollTimer);
              setTimeout(() => router.push(`/results/${surveyId}`), 2000);
            } else if (s.status === 'FAILED') {
              setFailed(true);
              clearInterval(pollTimer);
            }
          }
        } catch {
          // ignore
        }
      }, 3000);

      return () => clearInterval(pollTimer);
    };

    return () => es.close();
  }, [surveyId, router, API_URL]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Format log with styled tags
  const renderLogMessage = (text: string) => {
    const tagMatch = text.match(/^\[(.*?)\]\s*(.*)$/);
    if (!tagMatch) {
      return <span className="text-slate-300">{text}</span>;
    }

    const [, tag, message] = tagMatch;
    let badgeClass = 'bg-slate-800 text-slate-300 border-slate-700';

    if (tag.includes('DÂN SỐ') || tag.includes('DUCKDB')) {
      badgeClass = 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60';
    } else if (tag.includes('PHÂN BỔ') || tag.includes('STRATIFICATION')) {
      badgeClass = 'bg-purple-950/80 text-purple-300 border-purple-700/60';
    } else if (tag.includes('PHỎNG VẤN') || tag.includes('AGENT') || tag.includes('CLUSTER')) {
      badgeClass = 'bg-blue-950/80 text-blue-300 border-blue-700/60';
    } else if (tag.includes('TIẾN ĐỘ') || tag.includes('BATCH')) {
      badgeClass = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
    } else if (tag.includes('TỔNG HỢP') || tag.includes('EVALUATION')) {
      badgeClass = 'bg-violet-950/80 text-violet-300 border-violet-700/60';
    } else if (tag.includes('PHÂN TÍCH') || tag.includes('ANALYSIS')) {
      badgeClass = 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60';
    } else if (tag.includes('THẨM ĐỊNH') || tag.includes('DEEPSEEK')) {
      badgeClass = 'bg-amber-950/80 text-amber-200 border-amber-500/70 font-bold';
    } else if (tag.includes('HOÀN TẤT') || tag.includes('COMPLETE') || tag.includes('REPORT')) {
      badgeClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 font-bold';
    }

    return (
      <span className="inline-flex items-center gap-2">
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${badgeClass}`}>
          [{tag}]
        </span>
        <span className={tag.includes('HOÀN TẤT') || tag.includes('COMPLETE') ? 'text-emerald-300 font-semibold' : 'text-slate-200'}>
          {message}
        </span>
      </span>
    );
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-[#070B13] text-slate-100 flex flex-col items-center py-6 px-4 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(217,119,6,0.06),transparent_50%)]" />

      {/* Top Navigation Bar */}
      <div className="relative max-w-4xl w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-serif font-black text-slate-950 text-base shadow-md group-hover:scale-105 transition-transform">
            AI
          </div>
          <div>
            <div className="font-serif font-bold text-white text-sm tracking-tight group-hover:text-amber-400 transition-colors">
              Market Research AI
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              insight.1booking.asia
            </div>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all"
        >
          <span>←</span>
          <span>Về trang chủ</span>
        </Link>
      </div>

      {/* Header Container */}
      <div className="relative max-w-4xl w-full text-center mb-8">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono mb-4 shadow-lg backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-semibold tracking-wider uppercase text-[11px]">
            HỆ THỐNG MÔ PHỎNG TÁC TỬ AI ĐANG VẬN HÀNH
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">TIẾN ĐỘ PHÂN TÍCH TRỰC TIẾP</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-white mb-3">
          {done
            ? 'Hoàn Tất Khảo Sát & Báo Cáo Chiến Lược'
            : failed
            ? 'Sự Cố Hệ Thống Khảo Sát'
            : `Đang Mô Phỏng Khảo Sát N=${sampleSize.toLocaleString('vi-VN')} Tác Tử AI Phân Vai`}
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Phân vai tác tử AI theo ma trận phân tầng nhân khẩu học người tiêu dùng Việt Nam (chuẩn GSO).
          Định lý giới hạn trung tâm bảo đảm sai số biên <span className="text-amber-400 font-semibold">±3.1%</span> ở độ tin cậy <span className="text-amber-400 font-semibold">95%</span>.
        </p>
      </div>

      {/* Main Telemetry Box */}
      <div className="relative bg-[#0D1322] border border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full p-5 sm:p-7 backdrop-blur-xl">
        {/* Pending Payment Notice Banner */}
        {isPendingPayment && !done && (
          <div className="mb-6 p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 text-amber-200 text-left space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <span className="font-bold text-white text-sm sm:text-base">
                Hồ sơ chưa được kích hoạt hoặc chưa ghi nhận thanh toán
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hồ sơ <strong className="font-mono text-amber-300">{surveyId}</strong> đang ở trạng thái <em>Chờ thanh toán (PENDING_PAYMENT)</em>. Vui lòng quay lại màn hình thanh toán để quét mã VietQR hoặc áp dụng mã ưu đãi hợp lệ để hệ thống kích hoạt khảo sát.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/wizard"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition-colors shadow-sm"
              >
                <span>←</span>
                <span>Quay Lại Bước 4 Thanh Toán & Áp Dụng Mã Ưu Đãi</span>
              </Link>
            </div>
          </div>
        )}

        {/* HUD Top Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 pb-6 border-b border-slate-800/80 text-xs">
          <div className="bg-[#0A0E1A] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-1">
              Mã khảo sát (Panel ID)
            </span>
            <div className="font-mono font-bold text-amber-400 truncate">
              {surveyId || 'PANEL-INSPECTION'}
            </div>
          </div>

          <div className="bg-[#0A0E1A] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-1">
              Phân bổ mẫu & Sai số
            </span>
            <div className="font-mono font-bold text-white truncate">
              N={sampleSize.toLocaleString('vi-VN')} <span className="text-emerald-400 font-normal">| MoE ±3.1%</span>
            </div>
          </div>

          <div className="bg-[#0A0E1A] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-1">
              Phương pháp khảo sát
            </span>
            <div className="font-mono font-bold text-cyan-400 truncate">
              Phân Tầng Chuẩn GSO
            </div>
          </div>

          <div className="bg-[#0A0E1A] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-1">
              Thời gian vận hành
            </span>
            <div className="font-mono font-bold text-slate-200">
              {formatTimer(secondsElapsed)}s <span className="text-slate-500 font-normal">({percent}%)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar with Glowing Effect */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Tiến trình trích xuất & suy luận:</span>
            </span>
            <span className="font-bold text-amber-400 text-sm">{percent}%</span>
          </div>

          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                failed
                  ? 'bg-red-500'
                  : done
                  ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                  : 'bg-gradient-to-r from-cyan-500 via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Console / Terminal Window */}
        <div className="bg-[#060911] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
          {/* Terminal Window Bar */}
          <div className="bg-[#0A0F1D] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-[11px] font-mono text-slate-400 ml-2">
                insight.1booking.asia — Tiến Độ Khảo Sát & Mô Phỏng Tác Tử AI Trực Tiếp
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:block">
              MARKET INTELLIGENCE ENGINE
            </div>
          </div>

          {/* Terminal Log Stream */}
          <div className="p-4 sm:p-5 font-mono text-xs leading-relaxed max-h-80 overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
            {logs.length === 0 && (
              <div className="text-slate-500 italic py-2">
                [00:00s] [DÂN SỐ HỌC GSO] Đang khởi tạo ma trận tác tử AI và phân bổ hạn ngạch nhân khẩu học theo Tổng cục Thống kê...
              </div>
            )}

            {logs.map((entry, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-[11.5px]">
                <span className="text-slate-600 shrink-0 font-mono">
                  [{entry.time || '00:00'}]
                </span>
                <span className="text-amber-400/80 shrink-0 font-mono w-9 text-right">
                  {String(entry.percent).padStart(3, ' ')}%
                </span>
                <div className="flex-1 break-words">
                  {renderLogMessage(entry.log)}
                </div>
              </div>
            ))}

            {!done && !failed && (
              <div className="flex items-center gap-2 text-slate-500 pt-2 text-[11px]">
                <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse" />
                <span>Đang phân tích phương sai & tổng hợp báo cáo chuyên sâu...</span>
              </div>
            )}

            <div ref={logEndRef} />
          </div>
        </div>

        {/* Card Footer / Action */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="text-slate-400 flex items-center gap-2 text-center sm:text-left">
            <span className="text-emerald-400">🛡️</span>
            <span>Tiêu chuẩn ESOMAR / Kantar Research Matrix · Cam kết phân bổ mẫu độc lập</span>
          </div>

          {done ? (
            <button
              type="button"
              onClick={() => router.push(`/results/${surveyId}`)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <span>Xem Báo Cáo Executive Ngay</span>
              <span>→</span>
            </button>
          ) : (
            <div className="text-slate-500 text-[11px]">
              Tự động chuyển trang ngay khi hoàn tất 100%
            </div>
          )}
        </div>
      </div>

      {/* Failure Box */}
      {failed && (
        <div className="mt-6 text-center max-w-md bg-red-950/40 border border-red-800/80 p-5 rounded-xl">
          <p className="text-red-400 text-sm font-semibold mb-3">{errorMessage}</p>
          <button
            type="button"
            onClick={() => router.push('/wizard')}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-5 rounded-lg border border-slate-700"
          >
            Quay lại bảng cấu hình khảo sát
          </button>
        </div>
      )}
    </main>
  );
}
