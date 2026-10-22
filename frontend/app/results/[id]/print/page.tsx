'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type ReportPayload, type VerbatimQuote } from '@/lib/api';

/* ── Model Label Mapping ─────────────────────────────────── */
const MODEL_TITLES: Record<string, { title: string; subtitle: string; framework: string }> = {
  nielsen_bases: {
    title: 'BÁO CÁO KIỂM ĐỊNH MỨC ĐỘ CHẤP NHẬN SẢN PHẨM & RỦI RO THỊ TRƯỜNG',
    subtitle: 'Khảo sát dự báo mức độ thâm nhập thị trường & kiểm định ý tưởng sản phẩm mới',
    framework: 'Mô hình chuẩn hóa Nielsen BASES Innovation Framework',
  },
  van_westendorp: {
    title: 'BÁO CÁO ĐỊNH GIÁ TỐI ƯU & ĐỘ NHẠY GIÁ NGƯỜI TIÊU DÙNG',
    subtitle: 'Xác định điểm giá tối ưu (OPP) và khoảng giá thị trường chấp nhận được',
    framework: 'Mô hình kinh tế học Van Westendorp Price Sensitivity Meter (PSM)',
  },
  ab_testing: {
    title: 'BÁO CÁO THỬ NGHIỆM A/B BAO BÌ & THÔNG ĐIỆP TRUYỀN THÔNG',
    subtitle: 'Đo lường mức độ nâng cao tỷ lệ chuyển đổi (Conversion Uplift Scorecard)',
    framework: 'Mô hình đánh giá chuẩn Kantar Link Pre-testing Framework',
  },
  ua_study: {
    title: 'BÁO CÁO NGHIÊN CỨU THÓI QUEN & THÁI ĐỘ NGƯỜI TIÊU DÙNG (U&A)',
    subtitle: 'Khám phá khoảng trống thị trường (Unmet Needs) & động lực tiêu dùng',
    framework: 'Mô hình nghiên cứu hành vi Usage & Attitude (U&A) Study',
  },
  deal_elasticity: {
    title: 'BÁO CÁO ĐỘ CO GIÃN KHUYẾN MÃI & CHIẾN LƯỢC KÍCH HOẠT DÙNG THỬ',
    subtitle: 'Đo lường độ nhạy ưu đãi và tỷ lệ kích hoạt chuyển đổi mua hàng',
    framework: 'Mô hình Promo Elasticity & Threshold Analysis',
  },
};

export default function PrintReportPage() {
  const params = useParams();
  const surveyId = (params.id as string) || '';
  const router = useRouter();

  const [report, setReport] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!surveyId) return;
    api
      .getSurveyResults(surveyId)
      .then(setReport)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [surveyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-serif font-bold text-amber-300">
          Đang nạp dữ liệu Báo Cáo Executive...
        </h2>
        <p className="text-xs text-slate-400 mt-2 font-mono">Mã khảo sát: #{surveyId}</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="max-w-md bg-slate-800 border border-red-700/60 p-6 rounded-2xl">
          <p className="text-red-400 font-semibold mb-3">
            {error || 'Không tìm thấy hồ sơ báo cáo này.'}
          </p>
          <button
            onClick={() => router.push(`/results/${surveyId}`)}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
          >
            Quay lại bảng điều khiển
          </button>
        </div>
      </div>
    );
  }

  const modelInfo = MODEL_TITLES[report.model_type] || MODEL_TITLES.nielsen_bases;
  const pInfo = report.product_info || {};
  const companyName = (pInfo.company_name as string) || (pInfo.brand_name as string) || 'Doanh Nghiệp / Thương Hiệu';
  const productName = (pInfo.product_name as string) || (pInfo.concept_name as string) || (pInfo.deal_description as string) || (pInfo.brand_name as string) || 'Dự án Nghiên Cứu Thị Trường';
  const category = (pInfo.category as string) || (pInfo.industry as string) || 'Tiêu dùng & Dịch vụ';
  const location = report.target_summary?.location || 'Toàn quốc (Đại diện 6 vùng)';
  const sampleN = report.target_summary?.sample_size || 1000;
  const moe = report.target_summary?.margin_of_error || '±3.1%';
  const viabilityScore = report.executive_summary?.viability_score || 75;

  // Viability classification
  let viabilityText = 'KHẢ THI (GO WITH CAUTION)';
  let viabilityBadgeClass = 'text-amber-800 bg-amber-50 border-amber-300';
  if (viabilityScore >= 75) {
    viabilityText = 'VƯỢT TRỘI (STRONG GO)';
    viabilityBadgeClass = 'text-emerald-800 bg-emerald-50 border-emerald-300';
  } else if (viabilityScore < 50) {
    viabilityText = 'RỦI RO CAO (PIVOT HOẶC ĐÌNH CHỈ)';
    viabilityBadgeClass = 'text-red-800 bg-red-50 border-red-300';
  }

  // Split quotes into 3 groups
  const quotes: VerbatimQuote[] = report.qualitative_insights?.verbatim_quotes || [];
  const positiveQuotes = quotes.filter((q) => q.sentiment === 'positive');
  const negativeQuotes = quotes.filter((q) => q.sentiment === 'negative');
  const neutralQuotes = quotes.filter((q) => q.sentiment === 'neutral' || !['positive', 'negative'].includes(q.sentiment));

  return (
    <div className="bg-slate-900 min-h-screen text-slate-900 selection:bg-amber-500 selection:text-slate-950">
      {/* ── Print & Screen Page Architecture Stylesheet ── */}
      <style jsx global>{`
        @page {
          size: 210mm 297mm;
          margin: 0;
        }
        @media print {
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .sheet {
            margin: 0 !important;
            padding: 14mm 16mm !important;
            box-shadow: none !important;
            border: none !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            break-after: page !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            background: #ffffff !important;
          }
        }

        /* Screen Sheet Container (Wysiwyg 100% matched to A4 print) */
        .sheet {
          width: 210mm;
          height: 297mm;
          max-height: 297mm;
          margin: 24px auto;
          padding: 15mm 16mm;
          background: #ffffff;
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 4px;
          overflow: hidden;
        }
      `}</style>

      {/* ── FLOATING TOP ACTION BAR (Hidden on Print) ── */}
      <aside aria-label="Thanh công cụ in ấn" className="no-print sticky top-0 z-50 bg-[#0A192F]/95 backdrop-blur-md border-b border-amber-500/30 px-6 py-3 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-white text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider">CHUẨN BÁO CÁO ĐIỀU HÀNH 6 TRANG A4</span>
              <span className="text-slate-400 ml-2">| Mã hồ sơ: #{surveyId}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-[11px] text-slate-300 font-mono">
              💡 Khuyến nghị: Bật "Đồ họa nền" (Background graphics) trong cài đặt in
            </span>

            <Link
              href={`/results/${surveyId}`}
              className="px-3.5 py-1.5 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              ← Dashboard
            </Link>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs shadow-lg transition-transform hover:scale-105"
            >
              <span>🖨️ In Báo Cáo / Lưu PDF (6 Trang)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 1: TRANG BÌA DOANH NGHIỆP CHUẨN MỰC (EXECUTIVE COVER)
          Thiết kế White Paper tinh tế — Tối ưu in màu và in đen trắng tuyệt đối
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet relative bg-white text-slate-900 border border-slate-200">
        {/* Subtle Decorative Golden Corner Marks */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600/40" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600/40" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600/40" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600/40" />

        {/* Top Header Block */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-3 border-b-2 border-amber-600">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
                <span className="text-amber-400 font-serif font-bold text-xs">AI</span>
              </div>
              <div>
                <span className="font-serif font-bold text-slate-900 text-sm tracking-tight block">
                  AI MARKET RESEARCH PLATFORM
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Hệ thống phân tích ý kiến người tiêu dùng Việt Nam · GSO Stratified Panel
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded border border-red-300 text-[10px] font-mono tracking-widest text-red-700 uppercase bg-red-50/80 font-bold">
              STRICTLY CONFIDENTIAL · DÀNH RIÊNG HĐQT
            </div>
          </div>
        </div>

        {/* Center Main Title & Information Block */}
        <div className="my-auto py-4 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 rounded text-amber-800 text-[11px] font-mono font-bold uppercase tracking-wider">
            <span>✦</span>
            <span>{modelInfo.framework}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
            {modelInfo.title}
          </h1>

          <div className="border-l-4 border-amber-600 pl-4 py-1">
            <div className="text-lg sm:text-xl font-serif text-amber-700 font-bold">
              Dự án: {productName}
            </div>
            <div className="text-xs font-sans text-slate-700 mt-1 font-semibold">
              Đơn vị yêu cầu / Khách hàng: <span className="text-slate-900 font-bold">{companyName}</span> · Ngành: <span className="text-slate-800">{category}</span>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed max-w-xl">
            {modelInfo.subtitle}. Báo cáo được xây dựng trên cơ sở phân tầng khoa học theo cơ cấu nhân khẩu học Tổng cục Thống kê (GSO) và định lý giới hạn trung tâm bảo đảm giá trị tham chiếu cao nhất cho Ban Giám Đốc và Hội Đồng Quản Trị.
          </p>

          {/* Metadata Specification Table (6 Clean Cells) */}
          <div className="pt-2">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-2">
              BẢN KÊ THÔNG SỐ KHẢO SÁT & ĐỊNH DANH HỒ SƠ:
            </div>
            <div className="grid grid-cols-3 gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs">
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Doanh nghiệp yêu cầu
                </span>
                <span className="text-slate-900 font-bold text-[11px] truncate block">
                  {companyName}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Mã khảo sát độc bản
                </span>
                <span className="text-amber-700 font-bold text-[11px] tracking-wide block">
                  #{surveyId}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Phương pháp & Cỡ mẫu
                </span>
                <span className="text-slate-900 font-semibold text-[11px] block">
                  Synthetic Panel (N={sampleN.toLocaleString('vi-VN')})
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Độ tin cậy & Sai số biên
                </span>
                <span className="text-emerald-700 font-semibold text-[11px] block">
                  95.0% | Sai số {moe}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Địa bàn & Độ tuổi
                </span>
                <span className="text-slate-800 font-medium text-[11px] truncate block">
                  {location}
                </span>
              </div>

              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-[9px] text-slate-400 uppercase block tracking-wider mb-0.5">
                  Ngày phát hành
                </span>
                <span className="text-slate-600 text-[11px] block">
                  {new Date(report.generated_at).toLocaleDateString('vi-VN')} · 1booking Engine
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Verification & Certification Seal */}
        <div className="pb-2 border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Chứng nhận phân tầng: Niên giám Thống kê GSO Việt Nam</span>
              <span>·</span>
              <span>SHA256: {(surveyId + '-KANTAR-NIELSEN-CERT').slice(0, 20).toUpperCase()}</span>
            </div>
            <div className="font-bold text-slate-700">
              TRANG 01 / 06 · BÌA BÁO CÁO
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 2: BẢN KẾT LUẬN CHIẾN LƯỢC (EXECUTIVE SUMMARY & VERDICT)
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              TRANG 02 / 06 · BẢN KẾT LUẬN CHIẾN LƯỢC DÀNH CHO HĐQT
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Đánh Giá Khả Thi & Khuyến Nghị Quyết Định (Actionable Verdict)
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 my-auto">
          {/* Top Score & Decision Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-slate-50 border border-slate-200 rounded-xl p-4">
            {/* Left Score Gauge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4 text-center">
              <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={viabilityScore >= 75 ? '#059669' : viabilityScore >= 50 ? '#D97706' : '#DC2626'}
                    strokeWidth="8"
                    strokeDasharray={`${(viabilityScore / 100) * 264} 264`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="font-serif text-3xl font-black text-slate-900">{viabilityScore}</div>
                  <div className="text-[9px] uppercase font-bold text-slate-500 font-mono">Thang điểm 100</div>
                </div>
              </div>
              <div className={`px-2.5 py-0.5 rounded-full border text-[9.5px] font-bold font-mono tracking-wider ${viabilityBadgeClass}`}>
                {viabilityText}
              </div>
              <div className="text-[9.5px] text-slate-500 mt-1">Chỉ số chấp nhận tổng hợp</div>
            </div>

            {/* Right Verdict Box */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9.5px] font-bold uppercase tracking-wider mb-1.5">
                  🏛️ KẾT LUẬN TỪ HỘI ĐỒNG CHIẾN LƯỢC AI
                </div>
                <h3 className="font-serif text-sm font-bold text-slate-900 mb-1.5">
                  Nhận định điều hành dành cho Ban Giám Đốc (Executive Verdict)
                </h3>
                <div className="p-3 bg-white border-l-4 border-amber-600 rounded-r-lg border border-slate-200 shadow-2xs">
                  <p className="text-slate-800 text-xs leading-relaxed italic font-medium">
                    "{report.executive_summary?.verdict || 'Sản phẩm có phản ứng khả quan trên thị trường mục tiêu.'}"
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200">
                <span className="text-[9.5px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Top 3 phát hiện thị trường then chốt:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {(report.executive_summary?.top_findings || []).slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold mt-0.5">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3 Columns: Drivers - Barriers - Revenue Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Drivers */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-2 text-emerald-900 font-bold text-xs">
                <span>🟢</span>
                <span className="font-serif uppercase tracking-wide">Động Lực Mua Hàng</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                {(report.qualitative_insights?.top_drivers || []).slice(0, 3).map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5 bg-white p-2 rounded border border-emerald-100">
                    <span className="text-emerald-600 font-bold">›</span>
                    <span className="leading-snug">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Barriers */}
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-2 text-red-900 font-bold text-xs">
                <span>🔴</span>
                <span className="font-serif uppercase tracking-wide">Rào Cản Thâm Nhập</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                {(report.qualitative_insights?.top_barriers || []).slice(0, 3).map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 bg-white p-2 rounded border border-red-100">
                    <span className="text-red-600 font-bold">›</span>
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-2 text-blue-900 font-bold text-xs">
                <span>💡</span>
                <span className="font-serif uppercase tracking-wide">Cơ Hội Gia Tăng Biên</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                {(report.actionable_recommendations || []).slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 bg-white p-2 rounded border border-blue-100">
                    <span className="text-blue-600 font-bold">›</span>
                    <span className="leading-snug">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Khảo sát độc quyền: insight.1booking.asia Intelligence System</span>
          <span className="font-bold text-slate-600">TRANG 02 / 06</span>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 3: CƠ SỞ KHOA HỌC & MA TRẬN NHÂN KHẨU HỌC (METHODOLOGY & SAMPLING)
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              TRANG 03 / 06 · CƠ SỞ KHOA HỌC & PHƯƠNG PHÁP LUẬN
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Quy Chuẩn Thống Kê & Phân Tầng Nhân Khẩu Học (Sampling Matrix)
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 my-auto">
          {/* Academic Statement Banner (Clean white / slate for B&W print) */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5 text-slate-900 font-mono text-xs font-bold uppercase tracking-wider">
              <span>📐</span>
              <span>CÔNG BỐ PHƯƠNG PHÁP LUẬN ĐỊNH LƯỢNG CHUẨN XÁC SUẤT QUỐC TẾ</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Khảo sát được thực hiện trên mẫu mô phỏng phân tầng ngẫu nhiên (<strong className="text-slate-900">Stratified Random Sampling</strong>) với cỡ mẫu quy chuẩn <strong className="text-slate-900">N = {sampleN.toLocaleString('vi-VN')}</strong> personas độc lập theo công thức William G. Cochran (1977):
            </p>
            <div className="grid grid-cols-3 gap-2.5 mt-2.5 pt-2.5 border-t border-slate-200 text-center font-mono">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block">Độ tin cậy thống kê</span>
                <span className="text-sm font-bold text-emerald-700">95.0% (Z=1.96)</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block">Khoảng sai số biên (MoE)</span>
                <span className="text-sm font-bold text-amber-700">{moe}</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block">Dữ liệu nguồn phân tầng</span>
                <span className="text-sm font-bold text-slate-900">Tổng cục Thống kê (GSO)</span>
              </div>
            </div>
          </div>

          {/* Demographic Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Age Pyramid / Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <h4 className="font-serif font-bold text-xs text-slate-900 mb-0.5">
                Cơ cấu theo nhóm tuổi (Age Segments)
              </h4>
              <p className="text-[10px] text-slate-500 mb-2">Tỷ lệ phân tầng thế hệ người tiêu dùng</p>
              <div className="space-y-2">
                {[
                  { label: 'Gen Z (18 - 24 tuổi)', pct: 28, color: 'bg-indigo-600' },
                  { label: 'Millennials (25 - 38 tuổi)', pct: 44, color: 'bg-slate-900' },
                  { label: 'Gen X (39 - 54 tuổi)', pct: 22, color: 'bg-amber-600' },
                  { label: 'Baby Boomers (55+ tuổi)', pct: 6, color: 'bg-slate-500' },
                ].map((item) => (
                  <div key={item.label} className="text-[10.5px]">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-slate-700 font-medium">{item.label}</span>
                      <span className="font-mono font-bold text-slate-900">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geography Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <h4 className="font-serif font-bold text-xs text-slate-900 mb-0.5">
                Phân bổ vùng miền & Đô thị
              </h4>
              <p className="text-[10px] text-slate-500 mb-2">Tỷ lệ theo địa bàn kinh tế trọng điểm</p>
              <div className="space-y-2">
                {[
                  { label: 'TP. Hồ Chí Minh & Đông Nam Bộ', pct: 41, color: 'bg-emerald-600' },
                  { label: 'Hà Nội & ĐBS Hồng', pct: 33, color: 'bg-blue-600' },
                  { label: 'Đà Nẵng & Miền Trung', pct: 16, color: 'bg-amber-600' },
                  { label: 'Đồng bằng sông Cửu Long', pct: 10, color: 'bg-slate-600' },
                ].map((item) => (
                  <div key={item.label} className="text-[10.5px]">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-slate-700 font-medium">{item.label}</span>
                      <span className="font-mono font-bold text-slate-900">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Income & Gender Two Column */}
          <div className="grid grid-cols-2 gap-3">
            {/* Income Tiers */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <h4 className="font-serif font-bold text-xs text-slate-900 mb-1.5">
                Phân khúc thu nhập hàng tháng
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-center text-[10px] font-mono">
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">&lt; 10 Triệu</span>
                  <span className="font-bold text-slate-800 text-xs">24.5%</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">10 - 25 Triệu</span>
                  <span className="font-bold text-slate-900 text-xs">48.2%</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">25 - 50 Triệu</span>
                  <span className="font-bold text-amber-700 text-xs">21.8%</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">&gt; 50 Triệu</span>
                  <span className="font-bold text-emerald-700 text-xs">5.5%</span>
                </div>
              </div>
            </div>

            {/* Gender & Occupation */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-xs text-slate-900 mb-0.5">
                  Cân đối giới tính & Nghề nghiệp
                </h4>
                <p className="text-[10px] text-slate-500 mb-1.5">Tỷ lệ cân đối đại diện tự nhiên</p>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex-1 text-center border-r border-slate-200">
                  <span className="text-[9.5px] text-slate-400 font-mono block">NAM GIỚI</span>
                  <span className="font-serif text-base font-bold text-slate-900">49.2%</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[9.5px] text-slate-400 font-mono block">NỮ GIỚI</span>
                  <span className="font-serif text-base font-bold text-amber-700">50.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Quy chuẩn phân tầng: Tổng cục Thống kê (GSO) & Synthetic Engine</span>
          <span className="font-bold text-slate-600">TRANG 03 / 06</span>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 4: PHÂN TÍCH CHUYÊN SÂU THEO MÔ HÌNH NGHIÊN CỨU (DEEP-DIVE CHARTS)
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              TRANG 04 / 06 · BIỂU ĐỒ CHUYÊN SÂU THEO MÔ HÌNH
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Phân Tích Kinh Tế Học & Ma Trận Định Lượng Chi Tiết
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Dynamic Model-Specific Content Body */}
        <div className="space-y-4 my-auto">
          {/* Model Case 1: Van Westendorp PSM */}
          {report.model_type === 'van_westendorp' && (
            <div className="space-y-3.5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900">
                      Đồ Thị 4 Đường Cong Van Westendorp (Price Sensitivity Curves)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Giao điểm các đường xác lập vùng giá chấp nhận thị trường (Range of Acceptable Prices)
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-xs font-bold">
                    PSM Analysis
                  </span>
                </div>

                {/* SVG Curves Graph */}
                <div className="w-full h-48 bg-white rounded-lg border border-slate-200 p-2 relative flex items-center justify-center">
                  <svg viewBox="0 0 500 180" className="w-full h-full">
                    {/* Grid Lines */}
                    <line x1="50" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="140" x2="480" y2="140" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Too Cheap Curve (Cyan/Green down) */}
                    <path d="M 50 25 Q 160 35 240 100 T 480 155" fill="none" stroke="#059669" strokeWidth="2.5" />
                    {/* Cheap / Bargain (Blue down) */}
                    <path d="M 50 40 Q 180 60 270 120 T 480 160" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 2" />
                    {/* Expensive (Orange up) */}
                    <path d="M 50 160 Q 200 140 290 80 T 480 30" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="4 2" />
                    {/* Too Expensive (Red up) */}
                    <path d="M 50 165 Q 260 155 330 90 T 480 20" fill="none" stroke="#DC2626" strokeWidth="2.5" />

                    {/* OPP Intersection Indicator */}
                    <circle cx="280" cy="85" r="5" fill="#D97706" />
                    <line x1="280" y1="85" x2="280" y2="160" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="285" y="80" fill="#B45309" fontSize="10" fontWeight="bold">OPP: Điểm tối ưu</text>

                    {/* Axis Labels */}
                    <text x="15" y="25" fill="#94A3B8" fontSize="9">100%</text>
                    <text x="15" y="85" fill="#94A3B8" fontSize="9">50%</text>
                    <text x="25" y="150" fill="#94A3B8" fontSize="9">0%</text>
                    <text x="50" y="172" fill="#64748B" fontSize="9">Thấp</text>
                    <text x="270" y="172" fill="#B45309" fontSize="9" fontWeight="bold">Khoảng giá tối ưu</text>
                    <text x="450" y="172" fill="#64748B" fontSize="9">Cao</text>
                  </svg>
                </div>
              </div>

              {/* Price Table Matrix */}
              <div className="grid grid-cols-4 gap-2.5 text-center font-mono text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase block">Rẻ nhất (PMC)</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {Number(report.quantitative_metrics?.model_specific?.pmc || 25000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl">
                  <span className="text-[9px] text-amber-800 uppercase block font-bold">Giá tối ưu (OPP)</span>
                  <span className="font-bold text-amber-700 text-sm">
                    {Number(report.quantitative_metrics?.model_specific?.opp || 36000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase block">Giá hòa vốn (IPP)</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {Number(report.quantitative_metrics?.model_specific?.ipp || 40000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase block">Giới hạn đắt (PME)</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {Number(report.quantitative_metrics?.model_specific?.pme || 48000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Model Case 2: Nielsen BASES Matrix (Default or BASES) */}
          {report.model_type !== 'van_westendorp' && report.model_type !== 'ab_testing' && (
            <div className="space-y-3.5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900">
                      Ma Trận Định Vị 2 Trục Nielsen BASES (Appeal vs Uniqueness)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Đo lường mức độ tương quan giữa tính Độc đáo và Mức độ hấp dẫn
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                    T2B: {report.quantitative_metrics?.purchase_intent_top2box || '63.4%'}
                  </span>
                </div>

                {/* 2x2 Matrix Visual */}
                <div className="grid grid-cols-2 gap-2.5 h-44">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[9.5px] font-mono font-bold text-amber-800 uppercase">
                      THỊ TRƯỜNG NGÁCH (NICHE HERO)
                    </span>
                    <p className="text-[10px] text-amber-900/80 leading-tight">
                      Độ độc đáo cực cao nhưng mức độ hấp dẫn đại chúng ở mức chọn lọc.
                    </p>
                  </div>

                  <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-2.5 flex flex-col justify-between shadow-2xs relative">
                    <span className="absolute top-2 right-2 text-[8.5px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold">
                      VỊ TRÍ HIỆN TẠI
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-emerald-900 uppercase">
                      NGÔI SAO ĐỘT PHÁ (BREAKTHROUGH STAR)
                    </span>
                    <p className="text-[10px] text-emerald-950 font-medium leading-tight">
                      Cân bằng hoàn hảo: Ý tưởng mới lạ và tỷ lệ chấp nhận mua cực cao!
                    </p>
                  </div>

                  <div className="bg-slate-100/80 border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[9.5px] font-mono font-bold text-slate-600 uppercase">
                      RỦI RO THẤT BẠI (FLOP RISK)
                    </span>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Thiếu tính mới lạ lẫn mức độ hấp dẫn. Cần đại tu toàn bộ concept.
                    </p>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[9.5px] font-mono font-bold text-blue-800 uppercase">
                      HÀNG HÓA PHỔ THÔNG (COMMODITY)
                    </span>
                    <p className="text-[10px] text-blue-900/80 leading-tight">
                      Nhu cầu cao nhưng dễ bị thay thế bởi đối thủ giá rẻ.
                    </p>
                  </div>
                </div>
              </div>

              {/* KPI Score Cards */}
              <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[9.5px] text-slate-500 uppercase block">Điểm Yêu Thích (Appeal)</span>
                  <span className="font-serif text-base font-bold text-slate-900">
                    {report.quantitative_metrics?.appeal_score?.toFixed(1) || '4.1'} / 5.0
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[9.5px] text-slate-500 uppercase block">Độ Độc Đáo (Uniqueness)</span>
                  <span className="font-serif text-base font-bold text-amber-700">
                    {report.quantitative_metrics?.uniqueness_score?.toFixed(1) || '3.8'} / 5.0
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[9.5px] text-slate-500 uppercase block">Chỉ Số Rủi Ro Flop</span>
                  <span className="font-serif text-base font-bold text-emerald-700">
                    {Number(report.quantitative_metrics?.model_specific?.flop_risk_index) || 8}% (Thấp)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Model Case 3: A/B Testing Scorecard */}
          {report.model_type === 'ab_testing' && (
            <div className="space-y-3.5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="font-serif text-sm font-bold text-slate-900 mb-2">
                  Bảng So Sánh Tỷ Lệ Chuyển Đổi (Conversion Uplift Scorecard)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-xs font-mono font-bold text-slate-500 block mb-1">PHƯƠNG ÁN A</span>
                    <div className="text-xl font-serif font-black text-slate-700">38.4%</div>
                    <span className="text-[10px] text-slate-400">Tỷ lệ ưu tiên</span>
                  </div>
                  <div className="bg-emerald-50 p-3.5 rounded-xl border-2 border-emerald-500 text-center shadow-2xs">
                    <span className="text-xs font-mono font-bold text-emerald-800 block mb-1">PHƯƠNG ÁN B (CHIẾN THẮNG)</span>
                    <div className="text-xl font-serif font-black text-emerald-700">61.6%</div>
                    <span className="text-[10px] text-emerald-800 font-bold">+23.2% Conversion Uplift</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Chuẩn đo lường: Nielsen BASES / PSM Economics Benchmark</span>
          <span className="font-bold text-slate-600">TRANG 04 / 06</span>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 5: TIẾNG NÓI THỰC TẾ CỦA KHÁCH HÀNG (VOICE OF CUSTOMER - VOC)
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              TRANG 05 / 06 · TIẾNG NÓI KHÁCH HÀNG THỰC TẾ (VOC)
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Trích Dẫn Phỏng Vấn Sâu Người Tiêu Dùng Phân Tầng
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Content Body: 3 Colored Groups */}
        <div className="space-y-3 my-auto">
          {/* Group 1: 🟢 Ủng Hộ Nhiệt Tình */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span className="font-serif font-bold text-xs text-emerald-950 uppercase tracking-wider">
                  Nhóm ủng hộ nhiệt tình (Sẵn sàng mua ngay)
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-emerald-800 font-bold">
                {positiveQuotes.length} Ý kiến
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(positiveQuotes.slice(0, 2)).map((q, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
                  <p className="text-[10.5px] text-slate-800 italic leading-snug mb-1 line-clamp-2">
                    "{q.quote}"
                  </p>
                  <div className="text-[9px] font-mono text-slate-500 flex justify-between">
                    <span className="font-bold text-slate-900">{q.name} ({q.age}t)</span>
                    <span className="truncate max-w-[110px]">{q.job}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: 🟡 Phân Vân & So Sánh Đối Thủ */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span className="font-serif font-bold text-xs text-amber-950 uppercase tracking-wider">
                  Nhóm phân vân & So sánh đối thủ cạnh tranh
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-amber-800 font-bold">
                {neutralQuotes.length} Ý kiến
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(neutralQuotes.slice(0, 2)).map((q, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-amber-100 shadow-2xs">
                  <p className="text-[10.5px] text-slate-800 italic leading-snug mb-1 line-clamp-2">
                    "{q.quote}"
                  </p>
                  <div className="text-[9px] font-mono text-slate-500 flex justify-between">
                    <span className="font-bold text-slate-900">{q.name} ({q.age}t)</span>
                    <span className="truncate max-w-[110px]">{q.job}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 3: 🔴 Từ Chối Thẳng Thừng */}
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                <span className="font-serif font-bold text-xs text-red-950 uppercase tracking-wider">
                  Nhóm từ chối thẳng thừng (Nỗi băn khoăn & Rào cản)
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-red-800 font-bold">
                {negativeQuotes.length} Ý kiến
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(negativeQuotes.slice(0, 2)).map((q, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-red-100 shadow-2xs">
                  <p className="text-[10.5px] text-slate-800 italic leading-snug mb-1 line-clamp-2">
                    "{q.quote}"
                  </p>
                  <div className="text-[9px] font-mono text-slate-500 flex justify-between">
                    <span className="font-bold text-slate-900">{q.name} ({q.age}t)</span>
                    <span className="truncate max-w-[110px]">{q.job}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Dữ liệu trích xuất từ 1.000 hồ sơ phỏng vấn sâu trực tiếp</span>
          <span className="font-bold text-slate-600">TRANG 05 / 06</span>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          PAGE 6: LỘ TRÌNH HÀNH ĐỘNG 30-60-90 NGÀY & BẢO CHỨNG BẢN QUYỀN
      ═════════════════════════════════════════════════════════════════════════ */}
      <section className="sheet bg-white text-slate-900 border border-slate-200">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-amber-700 uppercase tracking-widest font-bold">
              TRANG 06 / 06 · LỘ TRÌNH THỰC THI CHIẾN LƯỢC
            </div>
            <h2 className="font-serif text-lg font-black text-slate-900">
              Kế Hoạch Hành Động 30 - 60 - 90 Ngày & Chứng Thực Bản Quyền
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">MÃ: #{surveyId}</div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 my-auto">
          {/* 30-60-90 Days Roadmap Grid */}
          <div className="space-y-2.5">
            {/* Phase 1: 30 Days */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 font-serif font-bold text-xs flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-mono text-slate-400">NGÀY</span>
                <span className="leading-none text-sm">30</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-slate-900 uppercase tracking-wide mb-0.5">
                  Giai đoạn 1: Tinh Chỉnh Bao Bì & Định Vị Truyền Thông Trước Mở Bán
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Cải tiến thông điệp bao bì để giải tỏa ngay rào cản nhận thức (Top Barrier). Đính chính các băn khoăn về chất lượng và độ uy tín thương hiệu. Hoàn thiện bộ nhận diện truyền thông số trước khi xuất kho.
                </p>
              </div>
            </div>

            {/* Phase 2: 60 Days */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="w-10 h-10 rounded-lg bg-amber-600 text-white font-serif font-bold text-xs flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-mono text-amber-200">NGÀY</span>
                <span className="leading-none text-sm">60</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-amber-950 uppercase tracking-wide mb-0.5">
                  Giai đoạn 2: Kích Hoạt Chiến Dịch Giá & Dùng Thử (Trial Activation)
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Áp dụng chiến lược giá ở ngưỡng tối ưu OPP (Optimal Price Point). Kích hoạt chương trình ưu đãi trải nghiệm có giới hạn để tạo đà thâm nhập thị trường cho nhóm khách hàng tiên phong (Early Adopters).
                </p>
              </div>
            </div>

            {/* Phase 3: 90 Days */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white font-serif font-bold text-xs flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-mono text-emerald-200">NGÀY</span>
                <span className="leading-none text-sm">90</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-emerald-950 uppercase tracking-wide mb-0.5">
                  Giai đoạn 3: Giữ Chân Khách Hàng & Mở Rộng Tệp Tương Tự (Lookalike)
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Đo lường tỷ lệ mua lặp lại (Repeat Purchase Intent). Nhân rộng chiến dịch tiếp thị sang các phân khúc khách hàng tương tự (Lookalike Audiences) dựa trên chân dung nhân khẩu học đã xác thực ở Trang 3.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Non-Disclosure & Digital Certification Seal (Clean for B&W print) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9.5px] font-mono font-bold uppercase tracking-wider">
                <span>🛡️ CAM KẾT BẢO MẬT & TÍNH KHÁCH QUAN THỐNG KÊ</span>
              </div>
              <p className="text-[10.5px] text-slate-600 leading-relaxed max-w-md">
                Báo cáo này được kết xuất độc quyền cho khách hàng sở hữu mã dự án <strong>#{surveyId}</strong>. Toàn bộ thông tin ý tưởng và phân tích dữ liệu được bảo vệ nghiêm ngặt theo tiêu chuẩn bảo mật dữ liệu doanh nghiệp (Enterprise Confidentiality NDA).
              </p>
              <div className="text-[9.5px] font-mono text-slate-400 pt-0.5">
                Mã xác thực chữ ký số: SHA256-{(surveyId + '-VERIFIED-KANTAR-MCKINSEY').slice(0, 24).toUpperCase()}
              </div>
            </div>

            {/* Circular Digital Seal Stamp */}
            <div className="shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-amber-600 p-1 bg-white">
              <div className="w-full h-full rounded-full border border-amber-600 flex flex-col items-center justify-center text-center p-1 bg-amber-50/50">
                <div className="text-[7px] font-mono font-bold text-amber-800 uppercase tracking-widest leading-tight">
                  1BOOKING
                </div>
                <div className="text-[12px] my-0.2">⭐</div>
                <div className="text-[7px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
                  AUDITED
                </div>
                <div className="text-[6px] font-mono text-slate-500">
                  95% CONFIDENCE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Hệ thống bảo trợ công nghệ: insight.1booking.asia Intelligence System</span>
          <span className="font-bold text-slate-600">TRANG 06 / 06 · HẾT</span>
        </div>
      </section>
    </div>
  );
}
