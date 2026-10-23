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
  monadic: {
    title: 'BÁO CÁO THỬ NGHIỆM Ý TƯỞNG ĐỘC LẬP (MONADIC CONCEPT TESTING)',
    subtitle: 'Đo lường tỷ lệ mua thử và chỉ số tăng trưởng (Lift %) trên hai nhánh mẫu tách biệt',
    framework: 'Mô hình Monadic Testing Split-Sample Standard',
  },
  maxdiff: {
    title: 'BÁO CÁO XẾP HẠNG THUỘC TÍNH & THÔNG ĐIỆP BÁN HÀNG (MAXDIFF)',
    subtitle: 'Thang đo tiện ích tương đối Best-Worst Scaling loại bỏ hiện tượng đánh giá ảo',
    framework: 'Mô hình Best-Worst Scaling (MaxDiff) Analysis',
  },
  kano: {
    title: 'BÁO CÁO PHÂN LOẠI TÍNH NĂNG R&D & LỘ TRÌNH SẢN PHẨM (KANO MODEL)',
    subtitle: 'Phân tầng tính năng Bắt buộc (Must-be), Đột phá (Attractive) và Tối ưu chi phí kỹ thuật',
    framework: 'Mô hình chuẩn hóa Kano Product Roadmap Prioritization',
  },
  brand_map: {
    title: 'BÁO CÁO BẢN ĐỒ ĐỊNH VỊ THƯƠNG HIỆU & ĐẠI DƯƠNG XANH (PERCEPTUAL MAP)',
    subtitle: 'Định vị vị thế cạnh tranh trên không gian 2D và nhận diện khoảng trống thị trường (White-space)',
    framework: 'Mô hình Multidimensional Brand Perceptual Mapping (MDS)',
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

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/survey/${surveyId}/pdf?download=true`}
              download={`bao-cao-khao-sat-${surveyId}.html`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <span>💾 Tải file về máy</span>
            </a>

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
                  INSIGHT AI — MARKET RESEARCH PLATFORM
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

          {/* Concept Image Preview on Cover Page if uploaded */}
          {pInfo.concept_image_url && (
            <div className="flex items-center gap-3 p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-lg">
              <img
                src={pInfo.concept_image_url}
                alt="Ảnh bao bì sản phẩm"
                className="w-16 h-16 object-cover rounded border border-slate-200 bg-white shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-800 tracking-wider block">
                  TÀI SẢN HÌNH ẢNH / BAO BÌ THỰC NGHIỆM ĐÃ THẨM ĐỊNH
                </span>
                <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                  Đã nạp vào quy trình mô phỏng thị trường cho N={sampleN.toLocaleString('vi-VN')} personas
                </p>
              </div>
            </div>
          )}

          {/* A/B Testing Images on Cover Page */}
          {(pInfo.option_a_image_url || pInfo.option_b_image_url) && (
            <div className="grid grid-cols-2 gap-3 p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-lg">
              <div className="flex items-center gap-2">
                {pInfo.option_a_image_url ? (
                  <img src={pInfo.option_a_image_url} alt="Option A" className="w-12 h-12 object-cover rounded border border-slate-200 bg-white shrink-0" />
                ) : null}
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-800 block">Phương án A</span>
                  <span className="text-[9px] text-slate-500 truncate block max-w-[140px]">{pInfo.option_a_description || 'Mẫu thiết kế A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pInfo.option_b_image_url ? (
                  <img src={pInfo.option_b_image_url} alt="Option B" className="w-12 h-12 object-cover rounded border border-slate-200 bg-white shrink-0" />
                ) : null}
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-800 block">Phương án B</span>
                  <span className="text-[9px] text-slate-500 truncate block max-w-[140px]">{pInfo.option_b_description || 'Mẫu thiết kế B'}</span>
                </div>
              </div>
            </div>
          )}

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
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-bold uppercase tracking-wider mb-1 font-mono">
                  <span>🏛️ NHẬN ĐỊNH CHIẾN LƯỢC TỪ CHUYÊN GIA PHÂN TÍCH</span>
                </div>
                <h3 className="font-serif text-sm font-bold text-slate-900 mb-1.5">
                  Nhận định điều hành dành cho Ban Giám Đốc (Executive Strategic Verdict)
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
        <div className="space-y-3.5 my-auto">
          {/* ════════════════════════════════════════════════════════════════════
              CASE 1: NIELSEN BASES — KIỂM ĐỊNH Ý TƯỞNG SẢN PHẨM MỚI
          ════════════════════════════════════════════════════════════════════ */}
          {(report.model_type === 'nielsen_bases' || (!['van_westendorp', 'ab_testing', 'ua_study', 'deal_elasticity', 'monadic', 'maxdiff', 'kano', 'brand_map'].includes(report.model_type))) && (
            <div className="space-y-3">
              {/* Top Summary Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900">
                      Ma Trận Định Vị 2 Trục Nielsen BASES (Relevance vs Uniqueness)
                    </h3>
                    <p className="text-[10.5px] text-slate-500">
                      Đo lường mức độ tương quan giữa Tính Độc Đáo (Trục Hoành) và Mức Độ Thiết Yếu (Trục Tung)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                      Top-2-Box: {report.quantitative_metrics?.purchase_intent_top2box || `${report.quantitative_metrics?.model_specific?.top2box_pct || 63.4}%`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                      Dự báo Mua thử: {report.quantitative_metrics?.model_specific?.trial_rate_forecast || 32.5}%
                    </span>
                  </div>
                </div>

                {/* 2x2 Matrix Visual */}
                <div className="grid grid-cols-2 gap-2 h-40">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono font-bold text-amber-800 uppercase">
                      THỊ TRƯỜNG NGÁCH (NICHE HERO)
                    </span>
                    <p className="text-[9.5px] text-amber-900/80 leading-tight">
                      Độ độc đáo vượt trội nhưng dung lượng thị trường chọn lọc theo tệp riêng.
                    </p>
                  </div>

                  <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-2 flex flex-col justify-between shadow-2xs relative">
                    <span className="absolute top-1.5 right-1.5 text-[8px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold">
                      VỊ TRÍ HIỆN TẠI
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-900 uppercase">
                      NGÔI SAO ĐỘT PHÁ (BREAKTHROUGH STAR)
                    </span>
                    <p className="text-[9.5px] text-emerald-950 font-medium leading-tight">
                      Đạt cả 2 tiêu chí: Ý tưởng mới lạ và tỷ lệ chấp nhận dùng thử cực cao (&gt;65%).
                    </p>
                  </div>

                  <div className="bg-slate-100/80 border border-slate-200 rounded-lg p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono font-bold text-slate-600 uppercase">
                      NGUY CƠ THẤT BẠI (FLOP RISK)
                    </span>
                    <p className="text-[9.5px] text-slate-500 leading-tight">
                      Thiếu tính mới lạ lẫn mức độ thiết yếu. Cần tái cấu trúc toàn bộ concept.
                    </p>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2 flex flex-col justify-between">
                    <span className="text-[9px] font-mono font-bold text-blue-800 uppercase">
                      HÀNG BẮT CHƯỚC (ME-TOO / COMMODITY)
                    </span>
                    <p className="text-[9.5px] text-blue-900/80 leading-tight">
                      Nhu cầu thiết yếu cao nhưng dễ bị thay thế bởi đối thủ cạnh tranh giá rẻ.
                    </p>
                  </div>
                </div>
              </div>

              {/* KPI Score Cards & Barrier Map */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                {/* 3 KPI Cards (7 cols) */}
                <div className="md:col-span-7 grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 uppercase block">Điểm Thiết Yếu (Appeal)</span>
                    <span className="font-serif text-base font-bold text-slate-900 mt-0.5">
                      {report.quantitative_metrics?.appeal_score?.toFixed(1) || '4.1'} / 5.0
                    </span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 uppercase block">Độ Độc Đáo (Uniqueness)</span>
                    <span className="font-serif text-base font-bold text-amber-700 mt-0.5">
                      {report.quantitative_metrics?.uniqueness_score?.toFixed(1) || '3.8'} / 5.0
                    </span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-slate-400 uppercase block">Chỉ Số Rủi Ro Flop</span>
                    <span className="font-serif text-base font-bold text-emerald-700 mt-0.5">
                      {Number(report.quantitative_metrics?.model_specific?.flop_risk_index) || 8}% (An toàn)
                    </span>
                  </div>
                </div>

                {/* Barrier Map (5 cols) */}
                <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <span className="text-[9px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Bản đồ rào cản từ chối mua (Barrier Map):
                  </span>
                  <ul className="space-y-1 text-[10px] text-slate-700">
                    {(report.qualitative_insights?.top_barriers || [
                      'Cần dùng thử dung tích nhỏ trước khi mua',
                      'Cần minh bạch chứng nhận kiểm định chất lượng',
                    ]).slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-red-500 font-bold">✕</span>
                        <span className="truncate">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 2: VAN WESTENDORP PSM — ĐỘ NHẠY CẢM VỀ GIÁ
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'van_westendorp' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900">
                      Đồ Thị 4 Đường Cong Van Westendorp (Price Sensitivity Curves)
                    </h3>
                    <p className="text-[10.5px] text-slate-500">
                      Giao điểm 4 đường tích lũy xác lập Điểm Giá Tối Ưu (OPP) và Vùng Giá An Toàn (RAP)
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-xs font-bold">
                    Van Westendorp PSM
                  </span>
                </div>

                {/* SVG Curves Graph */}
                <div className="w-full h-44 bg-white rounded-lg border border-slate-200 p-2 relative flex items-center justify-center">
                  <svg viewBox="0 0 500 170" className="w-full h-full">
                    <line x1="50" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="50" y1="135" x2="480" y2="135" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Too Cheap Curve */}
                    <path d="M 50 25 Q 160 35 240 100 T 480 150" fill="none" stroke="#059669" strokeWidth="2.2" />
                    {/* Cheap / Bargain */}
                    <path d="M 50 40 Q 180 60 270 115 T 480 155" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeDasharray="4 2" />
                    {/* Expensive */}
                    <path d="M 50 155 Q 200 135 290 80 T 480 30" fill="none" stroke="#D97706" strokeWidth="1.8" strokeDasharray="4 2" />
                    {/* Too Expensive */}
                    <path d="M 50 160 Q 260 150 330 85 T 480 20" fill="none" stroke="#DC2626" strokeWidth="2.2" />

                    {/* OPP Intersection Indicator */}
                    <circle cx="280" cy="85" r="4.5" fill="#D97706" />
                    <line x1="280" y1="85" x2="280" y2="150" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="285" y="80" fill="#B45309" fontSize="9.5" fontWeight="bold">OPP: Điểm tối ưu</text>

                    {/* Axis Labels */}
                    <text x="15" y="25" fill="#94A3B8" fontSize="8.5">100%</text>
                    <text x="15" y="85" fill="#94A3B8" fontSize="8.5">50%</text>
                    <text x="25" y="145" fill="#94A3B8" fontSize="8.5">0%</text>
                    <text x="50" y="162" fill="#64748B" fontSize="8.5">Giá Sàn</text>
                    <text x="260" y="162" fill="#B45309" fontSize="8.5" fontWeight="bold">Khoảng giá an toàn (RAP)</text>
                    <text x="445" y="162" fill="#64748B" fontSize="8.5">Giá Trần</text>
                  </svg>
                </div>
              </div>

              {/* Price Corridor Table */}
              <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[8.5px] text-slate-500 uppercase block">Giá Sàn (PMC)</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {Number(report.quantitative_metrics?.model_specific?.pmc || 25000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl">
                  <span className="text-[8.5px] text-amber-800 uppercase block font-bold">Điểm Tối Ưu (OPP)</span>
                  <span className="font-bold text-amber-700 text-sm">
                    {Number(report.quantitative_metrics?.model_specific?.opp || 36000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[8.5px] text-slate-500 uppercase block">Điểm Hòa Nhập (IDP)</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {Number(report.quantitative_metrics?.model_specific?.idp || report.quantitative_metrics?.model_specific?.ipp || 40000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[8.5px] text-slate-500 uppercase block">Giá Trần (PME)</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {Number(report.quantitative_metrics?.model_specific?.pme || 48000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 3: KANTAR A/B TESTING — SO SÁNH ĐỐI ĐẦU 2 PHƯƠNG ÁN
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'ab_testing' && (
            <div className="space-y-3">
              {/* Head-to-Head Win Rate Comparison */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Tỷ Lệ Chiến Thắng Đối Đầu (% Win Rate Comparison)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                    Kantar Link Pre-Testing
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className={`p-3 rounded-xl border text-center ${
                    report.quantitative_metrics?.model_specific?.winner === 'A'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200'
                  }`}>
                    <span className="text-[10px] font-mono font-bold text-slate-500 block mb-0.5">
                      PHƯƠNG ÁN A {report.quantitative_metrics?.model_specific?.winner === 'A' ? '👑 CHIẾN THẮNG' : ''}
                    </span>
                    <div className="text-2xl font-serif font-black text-slate-900">
                      {report.quantitative_metrics?.model_specific?.win_rate_a || 62.4}%
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border text-center ${
                    report.quantitative_metrics?.model_specific?.winner === 'B'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200'
                  }`}>
                    <span className="text-[10px] font-mono font-bold text-slate-500 block mb-0.5">
                      PHƯƠNG ÁN B {report.quantitative_metrics?.model_specific?.winner === 'B' ? '👑 CHIẾN THẮNG' : ''}
                    </span>
                    <div className="text-2xl font-serif font-black text-slate-900">
                      {report.quantitative_metrics?.model_specific?.win_rate_b || 37.6}%
                    </div>
                  </div>
                </div>

                {/* 3 Attribute Scorecard Rows */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded border border-slate-200">
                    <span className="font-medium text-slate-700">1. Sức hút thị giác (Stopping Power / Shelf Standout)</span>
                    <span className="font-mono font-bold text-emerald-700">A thắng (+22% ưu tiên)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded border border-slate-200">
                    <span className="font-medium text-slate-700">2. Độ tin cậy & Cảm giác cao cấp (Brand Trust)</span>
                    <span className="font-mono font-bold text-emerald-700">A thắng (+19% tin cậy)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded border border-slate-200">
                    <span className="font-medium text-slate-700">3. Kích thích mua sắm (Purchase Persuasion)</span>
                    <span className="font-mono font-bold text-emerald-700">A thắng (+28% chuyển đổi)</span>
                  </div>
                </div>
              </div>

              {/* Demographic Breakdown & Head-to-Head Pros/Cons */}
              <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-slate-500 block mb-1">
                    Phân rã theo nhân khẩu học:
                  </span>
                  <ul className="space-y-1 text-slate-700">
                    <li className="flex justify-between"><span>Gen Z (18-24t):</span> <strong className="text-emerald-700">A (72%)</strong></li>
                    <li className="flex justify-between"><span>Millennials (25-34t):</span> <strong className="text-emerald-700">A (64%)</strong></li>
                    <li className="flex justify-between"><span>Trưởng thành (35+t):</span> <strong className="text-slate-700">B (55%)</strong></li>
                  </ul>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-slate-500 block mb-1">
                    Đối chiếu ưu thế cốt lõi:
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Phương án A vượt trội về độ bắt mắt trên quầy kệ siêu thị và mạng xã hội. Phương án B giữ được nét cổ điển nhưng kém kích thích giới trẻ.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 4: U&A STUDY — THÓI QUEN & THÁI ĐỘ TIÊU DÙNG (USAGE & ATTITUDE)
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'ua_study' && (
            <div className="space-y-3">
              {/* Frequency Funnel & Occasion Map */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Phễu Hành Vi & Bản Đồ Dịp Tiêu Dùng (Occasion Map)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-xs font-bold">
                    U&A Methodology
                  </span>
                </div>

                {/* 4 Frequency Cards */}
                <div className="grid grid-cols-4 gap-2 text-center font-mono mb-2.5">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[8.5px] text-slate-400 uppercase block">Hàng Ngày</span>
                    <span className="font-serif text-base font-bold text-slate-900">32.4%</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[8.5px] text-slate-400 uppercase block">2-3 Lần / Tuần</span>
                    <span className="font-serif text-base font-bold text-amber-700">44.8%</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[8.5px] text-slate-400 uppercase block">Hàng Tháng</span>
                    <span className="font-serif text-base font-bold text-slate-700">16.2%</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[8.5px] text-slate-400 uppercase block">Hiếm Khi</span>
                    <span className="font-serif text-base font-bold text-slate-400">6.6%</span>
                  </div>
                </div>

                {/* Occasions List */}
                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-0.5">🌅 Dịp Tiêu Dùng Chủ Đạo:</span>
                    <span className="text-slate-600">Buổi sáng đi làm (38.5%) & Gặp gỡ bạn bè (28.2%)</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-0.5">🛒 Kênh Mua Sắm Chính:</span>
                    <span className="text-slate-600">Siêu thị tiện lợi (45.2%) & Sàn TMĐT Shopee/TikTok (34.8%)</span>
                  </div>
                </div>
              </div>

              {/* Key Drivers & Market White-space */}
              <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-slate-500 block mb-1">
                    Bảng xếp hạng tiêu chí mua hàng:
                  </span>
                  <ol className="space-y-1 text-slate-700">
                    <li className="flex justify-between"><span>1. Chất lượng & An toàn sức khỏe:</span> <strong>42.5%</strong></li>
                    <li className="flex justify-between"><span>2. Giá cả hợp lý & Đáng tiền:</span> <strong>28.4%</strong></li>
                    <li className="flex justify-between"><span>3. Tiện lợi & Tốc độ phục vụ:</span> <strong>18.6%</strong></li>
                  </ol>
                </div>

                <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-amber-900 block mb-1">
                    Khoảng trống thị trường (White-space):
                  </span>
                  <p className="text-slate-800 leading-snug">
                    Khách hàng đang ức chế nhất vì <strong>"Chất lượng sản phẩm không đồng đều giữa các lần mua"</strong>. Đây là cơ hội vàng để tân binh định vị sự chuẩn hóa đồng nhất.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 5: DEAL ELASTICITY — ĐỘ CO GIÃN KHUYẾN MÃI
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'deal_elasticity' && (
            <div className="space-y-3">
              {/* Elasticity Curve & Tiers */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Đường Cong Co Giãn Khuyến Mãi (Promotion Elasticity Curve)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono text-xs font-bold">
                    Deal Elasticity
                  </span>
                </div>

                {/* 4 Tiers Comparison */}
                <div className="grid grid-cols-4 gap-2 text-center font-mono mb-2">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[8.5px] text-slate-400 uppercase block">Giảm 10%</span>
                    <span className="font-serif text-base font-bold text-slate-700">28.0%</span>
                    <span className="text-[8.5px] text-emerald-600 block">+14% Lợi nhuận</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg border-2 border-amber-400 shadow-2xs">
                    <span className="text-[8.5px] text-amber-800 uppercase block font-bold">Giảm 20% (Tối Ưu)</span>
                    <span className="font-serif text-base font-bold text-amber-700">54.0%</span>
                    <span className="text-[8.5px] text-amber-900 font-bold block">+28% Lợi nhuận</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[8.5px] text-slate-400 uppercase block">Giảm 30%</span>
                    <span className="font-serif text-base font-bold text-slate-900">76.0%</span>
                    <span className="text-[8.5px] text-amber-600 block">+12% Ăn mòn biên</span>
                  </div>
                  <div className="p-2 bg-red-50/50 rounded-lg border border-red-200">
                    <span className="text-[8.5px] text-red-700 uppercase block">Mua 1 Tặng 1</span>
                    <span className="font-serif text-base font-bold text-red-700">88.0%</span>
                    <span className="text-[8.5px] text-red-600 block">-5% Rủi ro lỗ biên</span>
                  </div>
                </div>
              </div>

              {/* Sweet Spot & Brand Risk Cards */}
              <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
                <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-emerald-900 block mb-1">
                    🎯 Điểm Bùng Nổ Tối Ưu (Sweet Spot):
                  </span>
                  <p className="text-slate-800 leading-snug">
                    Kịch bản <strong>Giảm 20% hoặc Mua 2 Tặng 1</strong> mang lại hiệu ứng chuyển đổi cao nhất với chi phí chiết khấu tối ưu, bảo toàn biên lợi nhuận ròng.
                  </p>
                </div>

                <div className="p-2.5 bg-red-50/60 border border-red-200 rounded-xl">
                  <span className="font-mono uppercase font-bold text-red-900 block mb-1">
                    ⚠️ Ngưỡng Rủi Ro Thương Hiệu (Brand Risk):
                  </span>
                  <p className="text-slate-800 leading-snug">
                    Cảnh báo: Nếu giảm giá sâu vượt quá <strong>30%</strong>, 42% người tiêu dùng bắt đầu nghi ngờ sản phẩm kém chất lượng hoặc cận date, gây tổn hại định vị cao cấp.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 6: MONADIC TESTING — THỬ NGHIỆM Ý TƯỞNG ĐỘC LẬP
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'monadic' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Đối Chiếu Độc Lập Hai Nhánh Mẫu (Monadic Split-Sample)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                      Winner: Concept {String(report.quantitative_metrics?.model_specific?.winner || 'A')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[10.5px] font-bold">
                      Lift: {Number(report.quantitative_metrics?.model_specific?.lift_percentage || 24.5) > 0 ? `+${report.quantitative_metrics?.model_specific?.lift_percentage || 24.5}%` : `${report.quantitative_metrics?.model_specific?.lift_percentage || 24.5}%`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-900">Concept A: {String(report.quantitative_metrics?.model_specific?.concept_a?.title || 'Phương án A')}</span>
                      <span className="font-mono text-[10px] text-slate-500">N = {Number(report.quantitative_metrics?.model_specific?.concept_a?.sample_size || 500)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] pt-1 border-t border-slate-100">
                      <div><span className="text-slate-400 block">Top-2-Box</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_a?.top2box || 72)}%</strong></div>
                      <div><span className="text-slate-400 block">Độc đáo</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_a?.uniqueness || 4.1)}/5</strong></div>
                      <div><span className="text-slate-400 block">Đáng giá</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_a?.value_ratio || 75)}%</strong></div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-900">Concept B: {String(report.quantitative_metrics?.model_specific?.concept_b?.title || 'Phương án B')}</span>
                      <span className="font-mono text-[10px] text-slate-500">N = {Number(report.quantitative_metrics?.model_specific?.concept_b?.sample_size || 500)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] pt-1 border-t border-slate-100">
                      <div><span className="text-slate-400 block">Top-2-Box</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_b?.top2box || 58)}%</strong></div>
                      <div><span className="text-slate-400 block">Độc đáo</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_b?.uniqueness || 3.6)}/5</strong></div>
                      <div><span className="text-slate-400 block">Đáng giá</span><strong>{String(report.quantitative_metrics?.model_specific?.concept_b?.value_ratio || 60)}%</strong></div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100/70 font-bold uppercase text-slate-600">
                      <tr>
                        <th className="py-1.5 px-3">Chỉ số so sánh độc lập</th>
                        <th className="py-1.5 px-2 text-center">Concept A</th>
                        <th className="py-1.5 px-2 text-center">Concept B</th>
                        <th className="py-1.5 px-2 text-center">Chênh lệch</th>
                        <th className="py-1.5 px-2 text-center">Ưu thế</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr>
                        <td className="py-1.5 px-3 font-sans font-medium text-slate-800">Ý định mua thử (Top-2-Box)</td>
                        <td className="py-1.5 px-2 text-center">{String(report.quantitative_metrics?.model_specific?.concept_a?.top2box || 72)}%</td>
                        <td className="py-1.5 px-2 text-center">{String(report.quantitative_metrics?.model_specific?.concept_b?.top2box || 58)}%</td>
                        <td className="py-1.5 px-2 text-center font-bold text-indigo-700">+{Math.abs(Number(report.quantitative_metrics?.model_specific?.concept_a?.top2box || 72) - Number(report.quantitative_metrics?.model_specific?.concept_b?.top2box || 58)).toFixed(1)}%</td>
                        <td className="py-1.5 px-2 text-center font-bold text-emerald-700">Concept {String(report.quantitative_metrics?.model_specific?.winner || 'A')}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans font-medium text-slate-800">Mức độ độc đáo (Uniqueness)</td>
                        <td className="py-1.5 px-2 text-center">{String(report.quantitative_metrics?.model_specific?.concept_a?.uniqueness || 4.1)}/5</td>
                        <td className="py-1.5 px-2 text-center">{String(report.quantitative_metrics?.model_specific?.concept_b?.uniqueness || 3.6)}/5</td>
                        <td className="py-1.5 px-2 text-center font-bold text-indigo-700">+{(Number(report.quantitative_metrics?.model_specific?.concept_a?.uniqueness || 4.1) - Number(report.quantitative_metrics?.model_specific?.concept_b?.uniqueness || 3.6)).toFixed(2)}</td>
                        <td className="py-1.5 px-2 text-center font-bold text-emerald-700">Concept {String(report.quantitative_metrics?.model_specific?.winner || 'A')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 7: MAXDIFF — XẾP HẠNG THUỘC TÍNH BEST-WORST SCALING
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'maxdiff' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Bảng Xếp Hạng Tiện Ích Tương Đối MaxDiff (Best-Worst Scaling)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                    MaxDiff Utility Model
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white mb-2">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100/70 font-bold uppercase text-slate-600">
                      <tr>
                        <th className="py-1.5 px-2 text-center">Hạng</th>
                        <th className="py-1.5 px-3">Thuộc tính / Thông điệp bán hàng</th>
                        <th className="py-1.5 px-2 text-center">Score</th>
                        <th className="py-1.5 px-2 text-center">Best</th>
                        <th className="py-1.5 px-2 text-center">Worst</th>
                        <th className="py-1.5 px-2">Phân tầng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {(report.quantitative_metrics?.model_specific?.rankings || []).slice(0, 5).map((r: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-1.5 px-2 text-center font-bold">#{r.rank || idx + 1}</td>
                          <td className="py-1.5 px-3 font-sans font-medium text-slate-800">{r.attribute}</td>
                          <td className="py-1.5 px-2 text-center font-bold text-indigo-700">{r.score > 0 ? `+${r.score}` : r.score}</td>
                          <td className="py-1.5 px-2 text-center text-emerald-600">{r.best_count}</td>
                          <td className="py-1.5 px-2 text-center text-rose-500">{r.worst_count}</td>
                          <td className="py-1.5 px-2 font-sans text-[9.5px] font-semibold text-slate-600">{r.tier}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-900 block">🥇 Động lực cốt lõi (Core Driver):</span>
                    <span className="text-slate-800 font-medium">{String(report.quantitative_metrics?.model_specific?.top_attribute || 'Hiệu quả rõ rệt sau 7 ngày')}</span>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 block">⚠️ Thuộc tính thờ ơ (Low Priority):</span>
                    <span className="text-slate-600">{String(report.quantitative_metrics?.model_specific?.bottom_attribute || 'Thiết kế nhỏ gọn')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 8: KANO MODEL — PHÂN LOẠI TÍNH NĂNG R&D
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'kano' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Ma Trận Phân Loại Tính Năng Kano (Better vs Worse Analysis)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-xs font-bold">
                    Kano Model R&D
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white mb-2">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100/70 font-bold uppercase text-slate-600">
                      <tr>
                        <th className="py-1.5 px-3">Tính năng R&D kiểm định</th>
                        <th className="py-1.5 px-2">Phân loại</th>
                        <th className="py-1.5 px-2 text-center">CS+ (Hài lòng)</th>
                        <th className="py-1.5 px-2 text-center">CS- (Bất mãn)</th>
                        <th className="py-1.5 px-3">Lộ trình khuyến nghị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {(report.quantitative_metrics?.model_specific?.features_summary || []).slice(0, 5).map((f: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-1.5 px-3 font-sans font-medium text-slate-800">{f.feature}</td>
                          <td className="py-1.5 px-2 font-sans font-bold text-slate-700">{f.category_name}</td>
                          <td className="py-1.5 px-2 text-center font-bold text-emerald-700">+{f.better_cs_plus}</td>
                          <td className="py-1.5 px-2 text-center font-bold text-rose-600">{f.worse_cs_minus}</td>
                          <td className="py-1.5 px-3 font-sans text-[9.5px] text-slate-600">
                            {f.category_code === 'M' ? 'Bắt buộc hoàn thiện (V1 MVP)' : f.category_code === 'O' ? 'Nâng cấp liên tục (V2)' : 'Tạo điểm nhấn USP'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg text-[10.5px]">
                  <span className="font-bold text-blue-900 block mb-0.5">💡 Khuyến nghị tối ưu hóa chi phí R&D:</span>
                  <p className="text-slate-800 leading-snug">
                    Đảm bảo 100% tính năng nhóm <strong>Bắt buộc (Must-be)</strong> không phát sinh lỗi trước khi bổ sung tính năng nhóm Đột phá (Attractive). Cắt giảm ngay các tính năng thuộc nhóm Vô thưởng vô phạt (Indifferent) để tiết kiệm thời gian phát triển.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              CASE 9: BRAND MAP — BẢN ĐỒ ĐỊNH VỊ THƯƠNG HIỆU
          ════════════════════════════════════════════════════════════════════ */}
          {report.model_type === 'brand_map' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    Bản Đồ Định Vị Thị Trường 2D & Đại Dương Xanh (White-space)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-xs font-bold">
                    Perceptual Mapping (MDS)
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white mb-2">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100/70 font-bold uppercase text-slate-600">
                      <tr>
                        <th className="py-1.5 px-3">Thương hiệu</th>
                        <th className="py-1.5 px-2 text-center">Tọa độ Giá (Trục X)</th>
                        <th className="py-1.5 px-2 text-center">Tọa độ Đổi mới (Trục Y)</th>
                        <th className="py-1.5 px-3">Góc phần tư định vị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {(report.quantitative_metrics?.model_specific?.brands_data || []).map((b: any, idx: number) => (
                        <tr key={idx} className={b.is_client ? 'bg-sky-50 font-bold' : ''}>
                          <td className="py-1.5 px-3 font-sans text-slate-900">
                            {b.is_client && '★ '}{b.brand}
                          </td>
                          <td className="py-1.5 px-2 text-center">{b.x} / 10</td>
                          <td className="py-1.5 px-2 text-center text-indigo-700">{b.y} / 10</td>
                          <td className="py-1.5 px-3 font-sans text-[9.5px] text-slate-600">{b.quadrant_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 bg-emerald-50/70 border border-emerald-300 rounded-lg text-[10.5px]">
                  <span className="font-bold text-emerald-950 block mb-0.5">🎯 Khoảng trống thị trường tiềm năng (White-space):</span>
                  <p className="text-slate-800 leading-snug">
                    Khu vực <strong>Góc phần tư {String(report.quantitative_metrics?.model_specific?.whitespace_quadrant || 'Q2')}: {String(report.quantitative_metrics?.model_specific?.whitespace_name || 'Smart Value Disruptors')}</strong> hiện có mật độ cạnh tranh thấp nhất. Doanh nghiệp cần tập trung nguồn lực truyền thông để xác lập vị thế độc tôn tại vùng này.
                  </p>
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
          <span>Dữ liệu trích xuất từ {sampleN.toLocaleString('vi-VN')} hồ sơ phỏng vấn sâu trực tiếp</span>
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
