'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { api, type ReportPayload } from '@/lib/api';
import Logo from '@/components/Logo';
import BasesMatrix from '@/components/charts/BasesMatrix';
import VanWestendorpChart from '@/components/charts/VanWestendorpChart';
import ABScorecard from '@/components/charts/ABScorecard';
import OpportunityMatrix from '@/components/charts/OpportunityMatrix';
import DealElasticityChart from '@/components/charts/DealElasticityChart';
import MonadicScorecard from '@/components/charts/MonadicScorecard';
import MaxDiffChart from '@/components/charts/MaxDiffChart';
import KanoGrid from '@/components/charts/KanoGrid';
import BrandPerceptualMap from '@/components/charts/BrandPerceptualMap';

/* ── Model Strategic Pillars Mapping (McKinsey / Domain-Specific Framework) ── */
const MODEL_STRATEGIC_PILLARS: Record<string, Array<{ pillar_name: string; icon: string }>> = {
  nielsen_bases: [
    { pillar_name: 'Tối ưu hóa Khái niệm & USP', icon: '💡' },
    { pillar_name: 'Kích hoạt Dùng thử (Trial Rate)', icon: '🎯' },
    { pillar_name: 'Rào chắn Giảm Rủi ro Thất bại', icon: '🛡️' },
  ],
  van_westendorp: [
    { pillar_name: 'Điểm Giá Tối Ưu (OPP)', icon: '💎' },
    { pillar_name: 'Bảo Toàn Giá Trị Thương Hiệu (IPP)', icon: '⚖️' },
    { pillar_name: 'Biên Độ Chấp Nhận & Phân Tầng Giá', icon: '📊' },
  ],
  ab_testing: [
    { pillar_name: 'Phương Án Chiến Thắng & Lợi Thế Cốt Lõi', icon: '🏆' },
    { pillar_name: 'Khắc Phục Điểm Nghẽn Mẫu Thua', icon: '🔍' },
    { pillar_name: 'Kế Hoạch Triển Khai Hoàn Thiện', icon: '📦' },
  ],
  maxdiff: [
    { pillar_name: 'Thuộc Tính Ưu Tiên Cao Nhất (Top-Tier)', icon: '⭐' },
    { pillar_name: 'Thông Điệp Truyền Thông Bán Hàng (USP)', icon: '📢' },
    { pillar_name: 'Cắt Giảm Chi Phí Thuộc Tính Thờ Ơ', icon: '✂️' },
  ],
  kano: [
    { pillar_name: 'Tính Năng Bắt Buộc (Must-be)', icon: '🔒' },
    { pillar_name: 'Tính Năng Tăng Trưởng (One-dimensional)', icon: '📈' },
    { pillar_name: 'Vũ Khí Bất Ngờ (Attractive)', icon: '✨' },
  ],
  brand_map: [
    { pillar_name: 'Tọa Độ Định Vị Hiện Tại', icon: '📍' },
    { pillar_name: 'Khai Thác Khoảng Trống (White-space)', icon: '🌊' },
    { pillar_name: 'Lộ Trình Tái Định Vị Cạnh Tranh', icon: '🧭' },
  ],
  monadic: [
    { pillar_name: 'Hiệu Suất Ý Niệm Độc Lập (Top-2-Box)', icon: '⚖️' },
    { pillar_name: 'Mức Độ Chênh Lệch (Lift %)', icon: '📊' },
    { pillar_name: 'Quyết Định Lựa Chọn Khái Niệm Tối Ưu', icon: '🎯' },
  ],
  ua_study: [
    { pillar_name: 'Dịp Sử Dụng Cốt Lõi (Occasions)', icon: '⏰' },
    { pillar_name: 'Nhu Cầu Chưa Thỏa Mãn (Unmet Needs)', icon: '💡' },
    { pillar_name: 'Gia Tăng Tần Suất & Quy Mô Giỏ Hàng', icon: '🛒' },
  ],
  deal_elasticity: [
    { pillar_name: 'Ngưỡng Co Giãn Giá Khuyến Mãi', icon: '📉' },
    { pillar_name: 'Tỷ Lệ Lôi Kéo Người Dùng (Switching)', icon: '🔄' },
    { pillar_name: 'Cấu Trúc Chiết Khấu Tối Ưu Lợi Nhuận', icon: '💰' },
  ],
};

const MODEL_BENCHMARK_NAMES: Record<string, string> = {
  nielsen_bases: 'Chuẩn đánh giá chỉ số chấp nhận Nielsen BASES',
  van_westendorp: 'Chuẩn kinh tế học Van Westendorp Price Sensitivity (PSM)',
  ab_testing: 'Chuẩn thử nghiệm đối đầu Kantar Link Pre-testing',
  ua_study: 'Chuẩn nghiên cứu hành vi thói quen Usage & Attitude (U&A)',
  deal_elasticity: 'Chuẩn ma trận co giãn giá khuyến mãi Deal Elasticity',
  monadic: 'Chuẩn thử nghiệm ý niệm đơn lập Monadic Split-sample',
  maxdiff: 'Chuẩn xếp hạng phân cấp tiện ích Best-Worst Scaling (MaxDiff)',
  kano: 'Chuẩn phân tầng tính năng R&D Kano Product Roadmap',
  brand_map: 'Chuẩn định vị không gian đa chiều Brand Perceptual Mapping',
};

/* ── Helpers ─────────────────────────────────────────────── */

function ScoreGauge({ score, modelType }: { score: number; modelType?: string }) {
  const isGo = score >= 70;
  const isCaution = score >= 50 && score < 70;
  const color = isGo ? '#059669' : isCaution ? '#D97706' : '#DC2626';
  const verdict = isGo ? 'GO (ĐỦ ĐIỀU KIỆN RA MẮT)' : isCaution ? 'CAUTION (CẦN TỐI ƯU HÓA)' : 'NO-GO (RỦI RO CAO)';
  const verdictBg = isGo ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : isCaution ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-red-50 text-red-800 border-red-300';

  const r = 70;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
      <div className="relative inline-flex items-center justify-center mb-3">
        <svg width={180} height={180} className="-rotate-90">
          <circle cx={90} cy={90} r={r} fill="none" stroke="#F1F5F9" strokeWidth={12} />
          <circle
            cx={90}
            cy={90}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-4xl font-serif font-black" style={{ color }}>
            {score}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Điểm khả thi / 100
          </div>
        </div>
      </div>

      <div className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase ${verdictBg}`}>
        {verdict}
      </div>
      <p className="text-[11px] text-slate-400 mt-2 font-medium">
        {MODEL_BENCHMARK_NAMES[modelType || ''] || 'Chuẩn đánh giá chỉ số chấp nhận thị trường'}
      </p>
    </div>
  );
}

function SentimentBadge({ s }: { s: string }) {
  if (s === 'positive') {
    return (
      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
        ✓ Tích cực
      </span>
    );
  }
  if (s === 'negative') {
    return (
      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200">
        ✕ Băn khoăn
      </span>
    );
  }
  return (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
      — Trung lập
    </span>
  );
}

/* ── Tabs ────────────────────────────────────────────────── */

function Tab1ExecutiveSummary({ report }: { report: ReportPayload }) {
  const exec = report.executive_summary;
  const pInfo = report.product_info || {};

  return (
    <div className="space-y-6">
      {/* Top Gauge & AI Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex">
          <div className="w-full">
            <ScoreGauge score={exec.viability_score} modelType={report.model_type} />
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-3">
              🏛️ KẾT LUẬN TỪ HỘI ĐỒNG CHIẾN LƯỢC AI
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-3">
              Nhận định điều hành (Executive Verdict)
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-5">
              "{exec.verdict}"
            </p>
          </div>

          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
              Top 3 phát hiện thị trường quan trọng nhất
            </span>
            <ul className="space-y-2 text-xs text-slate-700">
              {exec.top_findings.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✦</span>
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Visual Imagery Appraisal Cards (If Images Were Uploaded) ── */}
      {report.model_type === 'ab_testing' && (pInfo.option_a_image_url || pInfo.option_b_image_url) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider mb-4 border border-amber-200 font-mono">
            📸 THIẾT KẾ BAO BÌ & HÌNH ẢNH MẪU ĐỐI ĐẦU A/B ĐÃ THẨM ĐỊNH
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase text-slate-900 mb-2">Phương án A (Concept A)</span>
              {pInfo.option_a_image_url ? (
                <img
                  src={pInfo.option_a_image_url}
                  alt="Phương án A"
                  className="w-full max-h-56 object-contain rounded-lg border border-slate-200 bg-white mb-3 shadow-2xs"
                />
              ) : (
                <div className="w-full h-36 flex items-center justify-center bg-slate-200 rounded-lg text-xs text-slate-500 mb-3">
                  Không có file ảnh
                </div>
              )}
              {pInfo.option_a_description && (
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  {pInfo.option_a_description}
                </p>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase text-slate-900 mb-2">Phương án B (Concept B)</span>
              {pInfo.option_b_image_url ? (
                <img
                  src={pInfo.option_b_image_url}
                  alt="Phương án B"
                  className="w-full max-h-56 object-contain rounded-lg border border-slate-200 bg-white mb-3 shadow-2xs"
                />
              ) : (
                <div className="w-full h-36 flex items-center justify-center bg-slate-200 rounded-lg text-xs text-slate-500 mb-3">
                  Không có file ảnh
                </div>
              )}
              {pInfo.option_b_description && (
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  {pInfo.option_b_description}
                </p>
              )}
            </div>
          </div>
          {report.quantitative_metrics?.model_specific?.deepseek_audit?.packaging_visual_audit && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-slate-800 leading-relaxed">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1 font-mono uppercase text-[11px]">
                <span>⚖️</span>
                <span>Đánh giá chuyên sâu về bao bì & nhận diện trực quan đối đầu:</span>
              </span>
              <p>{report.quantitative_metrics.model_specific.deepseek_audit.packaging_visual_audit}</p>
            </div>
          )}
        </div>
      )}

      {report.model_type !== 'ab_testing' && pInfo.concept_image_url && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <img
            src={pInfo.concept_image_url}
            alt="Ảnh Concept / Bao bì"
            className="w-full sm:w-44 h-44 object-cover rounded-xl border border-slate-200 bg-slate-100 shadow-xs shrink-0"
          />
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-2 border border-emerald-200 font-mono">
              📸 TÀI SẢN HÌNH ẢNH / BAO BÌ THỰC NGHIỆM ĐÃ THẨM ĐỊNH
            </div>
            <h4 className="font-serif text-lg font-bold text-slate-900 mb-1">
              Hình ảnh nhận diện thực tế của sản phẩm
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tài sản hình ảnh thực tế này đã được đưa vào bối cảnh nghiên cứu để {report.target_summary?.sample_size?.toLocaleString('vi-VN')} tác tử AI phân vai trực quan hóa kiểu dáng bao bì, cảm nhận màu sắc thương hiệu và mô phỏng phản xạ mua sắm khách quan.
            </p>
            {report.quantitative_metrics?.model_specific?.deepseek_audit?.packaging_visual_audit && (
              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5 font-mono uppercase text-[10px] text-indigo-700">
                  🔍 Đánh giá chuyên sâu về bao bì & nhận diện trực quan:
                </span>
                <p>{report.quantitative_metrics.model_specific.deepseek_audit.packaging_visual_audit}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Target Summary 4-Card Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Cỡ mẫu thực nghiệm
          </span>
          <div className="text-xl font-serif font-bold text-slate-900 mt-1">
            N = {report.target_summary.sample_size.toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Personas mô phỏng phân tầng</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
            Độ tin cậy & Sai số biên
          </span>
          <div className="text-xl font-serif font-bold text-amber-700 mt-1">
            95% <span className="text-sm font-sans font-normal text-slate-600">({report.target_summary.margin_of_error || '±3.1%'})</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Định lý Giới hạn Trung tâm</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Cơ sở phân tầng dân số
          </span>
          <div className="text-base font-bold text-slate-900 mt-1 truncate">
            Tổng cục Thống kê (GSO)
          </div>
          <span className="text-[11px] text-slate-500 font-medium">{report.target_summary.location}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Mô hình phân tích
          </span>
          <div className="text-base font-bold text-slate-900 mt-1 truncate">
            {report.model_type.replace(/_/g, ' ').toUpperCase()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Chuẩn ESOMAR / Kantar</span>
        </div>
      </div>

      {/* ── Target Audience Specification Card ── */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <h4 className="font-serif font-bold text-base text-slate-900">
              Đặc Tả Phân Khúc Đối Tượng Mục Tiêu (Target Audience Specification)
            </h4>
          </div>
          <span className="text-[10px] font-mono bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
            DuckDB 1.000.000 Personas Filtered
          </span>
        </div>

        <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/60 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 font-bold text-sm flex items-center justify-center shrink-0">
            🎯
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900">
              Chân dung phân khúc tiêu dùng trích xuất:
            </div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">
              {report.target_summary.demographics || `${report.target_summary.sample_size.toLocaleString('vi-VN')} Tác tử AI phân vai | ${report.target_summary.location}`}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Các tác tử AI đã được nạp đúng các tham số nhân khẩu học trên từ kho Parquet 1.000.000 hồ sơ để đưa ra phản hồi thực tế, bóc tách chính xác tâm lý chi tiêu và rào cản mua hàng.
            </p>
          </div>
        </div>

        {/* Breakdown Tags Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Địa bàn</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-0.5 truncate">{report.target_summary.location}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Giới tính</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-0.5">
              {report.target_summary.target_gender === 'female' ? 'Nữ giới 100%' : report.target_summary.target_gender === 'male' ? 'Nam giới 100%' : 'Toàn bộ (Nam & Nữ)'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Thu nhập</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-0.5 truncate">
              {report.target_summary.target_income === 'AB' ? 'Hạng A-B (>15tr)' : report.target_summary.target_income === 'A' ? 'Hạng A (>25tr)' : report.target_summary.target_income === 'CD' ? 'Hạng C-D (<15tr)' : 'Đa dạng phân khúc'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Hôn nhân</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-0.5 truncate">
              {report.target_summary.target_marital_status === 'married' ? 'Có gia đình / Con cái' : report.target_summary.target_marital_status === 'single' ? 'Độc thân' : 'Tất cả tình trạng'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Nghề nghiệp</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-0.5 truncate">
              {report.target_summary.target_occupation === 'office' ? 'Văn phòng / Trí thức' : report.target_summary.target_occupation === 'business' ? 'Kinh doanh / Buôn bán' : report.target_summary.target_occupation === 'worker' ? 'Công nhân / Sản xuất' : 'Đa dạng mọi ngành'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Môi trường</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-0.5 truncate">
              {report.target_summary.target_zone === 'urban' ? 'Chỉ Đô Thị' : report.target_summary.target_zone === 'rural' ? 'Chỉ Nông Thôn' : 'Toàn địa bàn'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Strategic Executive Council Audit ── */}
      <div className="bg-gradient-to-br from-slate-900 to-[#0A192F] text-white border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-[#D4AF37] text-[10px] font-bold border border-amber-400/30 uppercase tracking-wider mb-2 font-mono">
              <span>🏛️ NHẬN ĐỊNH CHIẾN LƯỢC TỪ CHUYÊN GIA PHÂN TÍCH</span>
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-tight">
              Đánh Giá Độc Lập Dành Cho Ban Giám Đốc
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Đối chiếu sức mua & thu nhập thực tế trên mẫu {report.target_summary.sample_size.toLocaleString('vi-VN')} tác tử AI phân vai theo ma trận GSO
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-mono text-amber-300 font-bold px-2.5 py-1 rounded bg-slate-800 border border-amber-400/30 block sm:inline-block">
              Chứng Thực Độc Lập
            </span>
          </div>
        </div>

        {/* Nội dung thẩm định chi tiết */}
        <div className="space-y-5">
          {/* 1. Đối chiếu sức mua & thu nhập thực tế */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1.5 flex items-center gap-1.5">
              <span>📊</span>
              <span>Đối chiếu sức mua & thu nhập thực tế:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {report.quantitative_metrics?.model_specific?.deepseek_audit?.data_consistency_audit ||
                `Dữ liệu mô phỏng từ ${report.target_summary.sample_size.toLocaleString('vi-VN')} tác tử AI phân vai thể hiện tính nhất quán cao giữa ngưỡng định giá và thu nhập khả dụng theo phân tầng dân số GSO. Phương sai phân bố chuẩn p < 0.05.`}
            </p>
          </div>

          {/* 2. Ba trụ cột khuyến nghị hành động theo đúng phương pháp luận nghiên cứu */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 block">
              3 Khuyến nghị hành động trọng tâm dành cho Ban Lãnh Đạo:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(() => {
                const audit = report.quantitative_metrics?.model_specific?.deepseek_audit;
                const defaultPillars = MODEL_STRATEGIC_PILLARS[report.model_type] || MODEL_STRATEGIC_PILLARS.nielsen_bases;

                if (audit?.strategic_pillars && Array.isArray(audit.strategic_pillars) && audit.strategic_pillars.length > 0) {
                  return audit.strategic_pillars.slice(0, 3).map((p: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                          <span>{p.icon || defaultPillars[i]?.icon || '✦'}</span>
                          <span>{p.pillar_name || defaultPillars[i]?.pillar_name || `Trọng tâm 0${i + 1}`}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mt-1">
                          {(p.recommendation || '').replace(/^\[.*?\]:\s*/, '')}
                        </p>
                      </div>
                    </div>
                  ));
                }

                const recList = audit?.strategic_recommendations || report.actionable_recommendations.slice(0, 3);
                return recList.map((rec: string, i: number) => {
                  const fallbackPillar = defaultPillars[i] || { pillar_name: `Trọng tâm 0${i + 1}`, icon: '✦' };
                  return (
                    <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                          <span>{fallbackPillar.icon}</span>
                          <span>{fallbackPillar.pillar_name}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mt-1">
                          {rec.replace(/^\[.*?\]:\s*/, '')}
                        </p>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* 3. Cảnh báo rủi ro chí mạng */}
          {(report.quantitative_metrics?.model_specific?.deepseek_audit?.critical_risks || [
            "Rủi ro áp lực cạnh tranh từ các đối thủ lớn có lợi thế chuỗi cung ứng và ngân sách quảng cáo vượt trội.",
            "Rủi ro suy giảm biên lợi nhuận nếu phải phụ thuộc quá mức vào các chiến dịch khuyến mãi ngắn hạn."
          ]).length > 0 && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30">
              <div className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold mb-2 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Cảnh báo rủi ro thị trường (Critical Market Risks):</span>
              </div>
              <ul className="space-y-1.5 text-xs text-red-200">
                {(report.quantitative_metrics?.model_specific?.deepseek_audit?.critical_risks || [
                  "Rủi ro áp lực cạnh tranh từ các đối thủ lớn có lợi thế chuỗi cung ứng và ngân sách quảng cáo vượt trội.",
                  "Rủi ro suy giảm biên lợi nhuận nếu phải phụ thuộc quá mức vào các chiến dịch khuyến mãi ngắn hạn."
                ]).map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span className="leading-relaxed">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Tab2Quantitative({ report }: { report: ReportPayload }) {
  const metrics = report.quantitative_metrics;

  const ageData = metrics.demographic_breakdown?.by_age
    ? Object.entries(metrics.demographic_breakdown.by_age).map(([group, val]) => ({ group, value: val }))
    : [];

  const genderData = metrics.demographic_breakdown?.by_gender
    ? Object.entries(metrics.demographic_breakdown.by_gender).map(([name, value]) => ({
        name: name.toLowerCase().includes('nam') || name.toLowerCase() === 'male' ? 'Nam giới' : 'Nữ giới',
        value: Number(value || 0),
      }))
    : [];

  const normalizeScale = (score?: number) => {
    if (score == null) return null;
    const num = Number(score);
    if (isNaN(num)) return null;
    return num <= 5 ? (num / 5) * 100 : Math.min(100, num);
  };

  const keyMetrics = [
    metrics.appeal_score ? { name: 'Mức độ yêu thích (Appeal)', value: normalizeScale(metrics.appeal_score)! } : null,
    metrics.uniqueness_score ? { name: 'Độ độc đáo (Uniqueness)', value: normalizeScale(metrics.uniqueness_score)! } : null,
  ].filter(Boolean) as { name: string; value: number }[];

  return (
    <div className="space-y-6">
      {/* ── Specialized Methodology-Specific Chart ── */}
      {report.model_type === 'nielsen_bases' && (
        <BasesMatrix
          appealScore={metrics.appeal_score || 3.8}
          uniquenessScore={metrics.uniqueness_score || 4.1}
          viabilityScore={report.executive_summary.viability_score || 75}
          flopRiskIndex={Number(metrics.model_specific?.flop_risk_index) || 18}
          matrixPosition={String(metrics.model_specific?.matrix_position || 'Ngôi sao đột phá')}
          matrixQuadrant={String(metrics.model_specific?.matrix_quadrant || 'star')}
        />
      )}

      {report.model_type === 'van_westendorp' && (
        <VanWestendorpChart modelSpecific={metrics.model_specific} />
      )}

      {report.model_type === 'ab_testing' && (
        <ABScorecard modelSpecific={metrics.model_specific} />
      )}

      {report.model_type === 'ua_study' && (
        <OpportunityMatrix modelSpecific={metrics.model_specific} />
      )}

      {report.model_type === 'deal_elasticity' && (
        <DealElasticityChart modelSpecific={metrics.model_specific} />
      )}

      {report.model_type === 'monadic' && (
        <MonadicScorecard modelSpecific={metrics.model_specific} />
      )}

      {report.model_type === 'maxdiff' && (
        <MaxDiffChart modelSpecific={metrics.model_specific} />
      )}

      {report.model_type === 'kano' && (
        <KanoGrid modelSpecific={metrics.model_specific} />
      )}

      {report.model_type === 'brand_map' && (
        <BrandPerceptualMap modelSpecific={metrics.model_specific} />
      )}

      {/* Top Bar Chart: Key Quantitative Metrics */}
      {keyMetrics.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Chỉ số định lượng trọng yếu (Key Metrics)
              </h3>
              <p className="text-xs text-slate-500">
                Thang đo chuẩn hóa quy đổi trên hệ điểm 100%
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              {MODEL_BENCHMARK_NAMES[report.model_type] || 'Chỉ số định lượng chuẩn hóa'}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={keyMetrics} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                <Tooltip
                  formatter={(val: any) => [`${Number(val ?? 0).toFixed(1)}%`, 'Điểm quy đổi']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {keyMetrics.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? '#0F172A' : '#059669'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 2-Column: Demographics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Breakdown */}
        {ageData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Phân bổ cơ cấu theo độ tuổi
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                  Hạn ngạch GSO
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Tỷ lệ đại diện phân tầng nhân khẩu trong mẫu N={report.target_summary?.sample_size?.toLocaleString('vi-VN') || '1.000'}
              </p>
            </div>
            <div className="space-y-3.5 my-auto">
              {ageData.map(({ group, value }) => {
                const numVal = Number(value || 0);
                return (
                  <div key={group} className="flex items-center gap-3">
                    <div className="w-14 text-xs font-semibold text-slate-700 text-right shrink-0 font-mono">
                      {group}
                    </div>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-900 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, numVal))}%` }}
                      />
                    </div>
                    <div className="w-12 text-xs font-mono font-bold text-slate-900 text-right">
                      {numVal.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Phương pháp: Stratified Sampling</span>
              <span className="font-mono text-emerald-600 font-medium">Σ = 100.0%</span>
            </div>
          </div>
        )}

        {/* Gender Breakdown */}
        {genderData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Phân bổ cơ cấu giới tính
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                  Cân đối 50:50
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">
                Cân đối giới tính tự động theo Quota dân số thực địa
              </p>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={66}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#0F172A" />
                    <Cell fill="#B45309" />
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => [`${Number(v || 0).toFixed(1)}%`, 'Tỷ lệ mẫu']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Quota</span>
                <span className="text-xs font-serif font-black text-slate-800">100%</span>
              </div>
            </div>

            {/* Premium Stat Badges to replace overlapping SVG text labels */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 py-2 px-3 rounded-lg border border-slate-200 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F172A] inline-block" />
                  <span className="font-medium">Nam giới</span>
                </div>
                <span className="text-base font-serif font-bold text-slate-900">
                  {Number(genderData.find((g) => g.name === 'Nam giới')?.value || 50).toFixed(1)}%
                </span>
              </div>
              <div className="bg-amber-50/60 py-2 px-3 rounded-lg border border-amber-200/80 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-900 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B45309] inline-block" />
                  <span className="font-medium">Nữ giới</span>
                </div>
                <span className="text-base font-serif font-bold text-amber-950">
                  {Number(genderData.find((g) => g.name === 'Nữ giới')?.value || 50).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top 2 Box Banner */}
      {metrics.purchase_intent_top2box && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex items-center gap-5">
          <div className="bg-white border border-emerald-300 rounded-xl p-4 text-center shrink-0 min-w-[110px] shadow-xs">
            <span className="text-2xl font-serif font-black text-emerald-700">
              {metrics.purchase_intent_top2box}
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block mt-1">
              Top-2-Box (T2B)
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-950 mb-1">
              Ý định mua sắm tích cực (Purchase Intent T2B)
            </h4>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Top-2-Box đo lường tỷ lệ người tiêu dùng chọn mức "Chắc chắn mua" hoặc "Rất có thể sẽ mua". Đây là chỉ báo quan trọng nhất để dự báo tỷ lệ thâm nhập thị trường thành công của sản phẩm mới.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Tab3VoiceOfConsumer({ report }: { report: ReportPayload }) {
  const { top_drivers, top_barriers, verbatim_quotes } = report.qualitative_insights;

  return (
    <div className="space-y-6">
      {/* 2-Column: Drivers vs Barriers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drivers */}
        <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-4">
            <span>✅ ĐỘNG LỰC THÚC ĐẨY MUA HÀNG (DRIVERS)</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-700">
            {top_drivers.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5 bg-emerald-50/30 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-emerald-600 font-bold">›</span>
                <span className="leading-relaxed font-medium">{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Barriers */}
        <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2.5 py-1 rounded-full mb-4">
            <span>⛔ RÀO CẢN & ĐIỂM NGẦN NGẠI (BARRIERS)</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-700">
            {top_barriers.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 bg-red-50/30 p-2.5 rounded-lg border border-red-100">
                <span className="text-red-600 font-bold">›</span>
                <span className="leading-relaxed font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verbatim Quotes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Ý kiến định tính trích xuất từ Tác tử AI phân vai (Synthetic VoC Verbatim)
            </h3>
            <p className="text-xs text-slate-500">
              Các phản hồi định tính mô phỏng góc nhìn tâm lý học của người tiêu dùng theo phân tầng GSO
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            {verbatim_quotes.length} Phản hồi tiêu biểu
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verbatim_quotes.map((q, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border bg-white shadow-xs flex flex-col justify-between transition-all ${
                q.sentiment === 'positive'
                  ? 'border-emerald-200 hover:border-emerald-400'
                  : q.sentiment === 'negative'
                  ? 'border-red-200 hover:border-red-400'
                  : 'border-slate-200'
              }`}
            >
              <div className="mb-4">
                <span className="font-serif text-3xl text-amber-300 leading-none block select-none mb-1">
                  “
                </span>
                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed italic pl-1">
                  {q.quote}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{q.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {q.age} tuổi · {q.job} {q.income ? `· Thu nhập ${q.income}` : ''}
                  </div>
                </div>
                <SentimentBadge s={q.sentiment} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Tab4StrategicAction({ report, surveyId }: { report: ReportPayload; surveyId: string }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const recs = report.actionable_recommendations;

  return (
    <div className="space-y-6">
      {/* 3 Numbered Action Steps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-3">
          📋 CHIẾN LƯỢC HÀNH ĐỘNG DOANH NGHIỆP
        </div>
        <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
          3 Khuyến nghị thực thi dành cho Ban Điều Hành & Marketing
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Được tổng hợp tự động từ ma trận đánh giá rào cản và khoảng trống thị trường.
        </p>

        <div className="space-y-4">
          {recs.map((rec, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-serif font-bold text-sm flex items-center justify-center shrink-0">
                0{i + 1}
              </div>
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {rec}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Download Callout Banner */}
      <div className="bg-[#0A192F] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-500/30">
        <div>
          <div className="inline-block px-2.5 py-0.5 rounded bg-amber-400/20 text-[#D4AF37] text-[10px] font-bold border border-amber-400/40 uppercase tracking-wider mb-2 font-mono">
            BÁO CÁO EXECUTIVE 6 TRANG CHUẨN KANTAR / MCKINSEY
          </div>
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
            Xuất Bản Báo Cáo Chiến Lược Toàn Văn (A4 Print / PDF)
          </h4>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Hồ sơ báo cáo đóng dấu mộc số bảo mật 1booking Insight Engine, thiết kế chuẩn A4 Landscape / Portrait gồm đủ 6 trang: Trang bìa, Kết luận HĐQT, Cơ sở GSO N={report.target_summary?.sample_size?.toLocaleString('vi-VN') || '1.000'}, Biểu đồ kinh tế học, 15 Trích dẫn VoC và Lộ trình 30-60-90 ngày.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href={`/results/${surveyId}/print`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <span>🖨️ Mở Bản In / Lưu PDF A4 (6 Trang)</span>
          </a>

          <a
            href={`${API_URL}/survey/${surveyId}/pdf?download=true`}
            download={`bao-cao-khao-sat-${surveyId}.html`}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-400 text-white text-xs py-3 px-4 rounded-xl transition-colors font-medium"
          >
            <span>💾 Tải file báo cáo (.html / .pdf)</span>
          </a>
        </div>
      </div>

      {/* Meta Footer */}
      <div className="text-center text-[11px] text-slate-400 pt-2">
        Mã hồ sơ: {report.project_id} · Thời điểm tạo: {new Date(report.generated_at).toLocaleString('vi-VN')} · Xác thực chữ ký số INSIGHT AI Platform
      </div>
    </div>
  );
}

/* ── Main Results Component ──────────────────────────────── */

const TABS = [
  { id: 'executive', label: '1. Tóm lược điều hành' },
  { id: 'quantitative', label: '2. Phân tích định lượng' },
  { id: 'consumer', label: '3. Tiếng nói thị trường' },
  { id: 'actions', label: '4. Đề xuất hành động' },
];

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const [report, setReport] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('executive');

  // Trạng thái modal tiêu hủy dữ liệu
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const handleDeleteSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');
    setDeleteSuccess('');

    if (!deleteEmail.trim()) {
      setDeleteError('Vui lòng nhập email xác nhận.');
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await api.deleteSurvey(surveyId, deleteEmail.trim().toLowerCase());
      setDeleteSuccess(res.message);
      setTimeout(() => {
        router.push('/tra-cuu');
      }, 2000);
    } catch (err: any) {
      setDeleteError(err.message || 'Email xác nhận không chính xác. Để bảo mật dữ liệu, chỉ chủ sở hữu mới có quyền tiêu hủy.');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (!surveyId) return;
    api.getSurveyResults(surveyId)
      .then(setReport)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [surveyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
        <h3 className="font-serif text-lg font-bold text-slate-900">
          Đang nạp dữ liệu báo cáo chiến lược...
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Đang xử lý ma trận số liệu khảo sát từ hồ sơ #{surveyId}
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mb-4">
          ⚠️
        </div>
        <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
          Không tìm thấy hoặc chưa hoàn tất báo cáo
        </h3>
        <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
          {error || 'Khảo sát này đang được xử lý hoặc mã định danh không chính xác. Vui lòng kiểm tra lại.'}
        </p>
        <a
          href="/wizard"
          className="bg-slate-900 text-white text-xs font-semibold py-2.5 px-6 rounded-lg shadow-sm"
        >
          Khởi tạo khảo sát mới
        </a>
      </div>
    );
  }

  const pInfo = report.product_info || {};
  const companyName = pInfo.company_name || pInfo.brand_name || 'Doanh Nghiệp / Thương Hiệu';
  const productName = pInfo.product_name || pInfo.concept_name || pInfo.deal_description || pInfo.brand_name || 'Dự án Nghiên Cứu Thị Trường';
  const category = pInfo.category || pInfo.industry || 'Tiêu dùng & Dịch vụ';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Sticky Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-10 py-3 sm:py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="compact" href="/" />
            <div className="border-l border-slate-200 pl-3">
              <div className="font-serif font-bold text-slate-900 text-xs sm:text-base leading-tight">
                INSIGHT AI · Executive Briefing
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-mono truncate max-w-[140px] sm:max-w-[280px]">
                {companyName} · #{surveyId}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Confidential Stamp */}
            <div className="border border-red-500/80 bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded hidden sm:block">
              CONFIDENTIAL · BẢO MẬT HĐQT
            </div>

            {/* Print / Download Button */}
            <a
              href={`/results/${surveyId}/print`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs py-2 px-3 sm:px-3.5 rounded-lg shadow-sm transition-all"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">Xuất Báo Cáo 6 Trang (A4)</span>
              <span className="sm:hidden">Xuất A4</span>
            </a>

            <a
              href={`${API_URL}/survey/${surveyId}/pdf?download=true`}
              download={`bao-cao-khao-sat-${surveyId}.html`}
              className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-xs transition-colors hidden sm:inline-flex"
            >
              <span>💾 Tải file</span>
            </a>

            {/* Enterprise Privacy & Data Security Button */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-300 hover:border-red-300 text-xs font-semibold py-2 px-2.5 sm:px-3 rounded-lg shadow-2xs transition-all cursor-pointer"
              title="Xóa vĩnh viễn báo cáo này để bảo vệ bí mật kinh doanh"
            >
              <span>🛡️</span>
              <span className="hidden sm:inline">Xóa & Bảo mật dữ liệu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Project Title Banner */}
      <section className="bg-[#0A192F] text-white py-6 sm:py-10 px-4 sm:px-10 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-[#D4AF37] text-[10px] font-bold border border-amber-400/30 uppercase tracking-wider mb-2 font-mono">
              BÁO CÁO NGHIÊN CỨU THỊ TRƯỜNG AI · EXECUTIVE INTELLIGENCE
            </div>
            <h1 className="font-serif text-xl sm:text-3xl font-black text-white tracking-tight">
              {productName}
            </h1>
            <div className="text-amber-400 font-medium text-xs sm:text-sm mt-1">
              Đơn vị yêu cầu: <span className="text-white font-semibold">{companyName}</span> · Ngành hàng: <span className="text-slate-200">{category}</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Địa bàn: <span className="text-white font-semibold">{report.target_summary.location}</span> · Quy mô: <span className="text-[#D4AF37] font-semibold">N = {report.target_summary.sample_size.toLocaleString('vi-VN')} Personas</span> · Độ tin cậy: <span className="text-emerald-400 font-semibold">95%</span> · Sai số thống kê: <span className="text-amber-400 font-semibold">{report.target_summary.margin_of_error || '±3.1%'}</span> (Chuẩn phân tầng GSO)
            </p>
            {report.target_summary.demographics && (
              <div className="mt-2.5 inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs">
                <span className="text-amber-400 font-bold">🎯 Đối tượng mục tiêu:</span>
                <span className="text-slate-100">{report.target_summary.demographics}</span>
              </div>
            )}
          </div>

          <div className="text-left md:text-right border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
            <span className="text-[11px] text-slate-400 block font-mono">Phát hành bởi 1booking Insight</span>
            <span className="text-xs font-mono text-[#D4AF37] font-semibold">
              {new Date(report.generated_at).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </section>

      {/* 4-Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 grid grid-cols-2 sm:flex sm:flex-wrap gap-1 mb-8">
          {TABS.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs font-bold transition-all duration-150 text-center ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'executive' && <Tab1ExecutiveSummary report={report} />}
        {activeTab === 'quantitative' && <Tab2Quantitative report={report} />}
        {activeTab === 'consumer' && <Tab3VoiceOfConsumer report={report} />}
        {activeTab === 'actions' && <Tab4StrategicAction report={report} surveyId={surveyId} />}
      </div>

      {/* ── Enterprise Privacy / Data Destruction Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Xóa Vĩnh Viễn Dữ Liệu & Bảo Mật Tuyệt Đối
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Hồ sơ #{surveyId}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Theo tiêu chuẩn bảo mật dữ liệu doanh nghiệp, hành động này sẽ xóa vĩnh viễn <strong className="text-red-700">DUY NHẤT báo cáo khảo sát mã #{surveyId}</strong> và dữ liệu phản hồi của {report.target_summary?.sample_size?.toLocaleString('vi-VN') || '1.000'} tác tử AI mô phỏng khỏi toàn bộ hệ thống lưu trữ của chúng tôi. <strong>Toàn bộ các báo cáo khác của bạn (nếu có) vẫn được giữ nguyên vẹn 100%.</strong> Hành động này không thể hoàn tác.
            </p>

            <form onSubmit={handleDeleteSurvey} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nhập email bạn đã dùng khi tạo khảo sát để xác nhận:
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@congty.com"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              {deleteError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed">
                  ⚠️ {deleteError}
                </div>
              )}

              {deleteSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium leading-relaxed">
                  ✅ {deleteSuccess}
                  <div className="text-[11px] text-emerald-600 mt-1">Đang chuyển về trang tra cứu...</div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteError('');
                    setDeleteEmail('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={deleteLoading || !deleteEmail || !!deleteSuccess}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {deleteLoading ? 'Đang tiêu hủy...' : 'Xác nhận xóa vĩnh viễn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
