'use client';

import React, { useState } from 'react';

interface BasesMatrixProps {
  appealScore: number;       // Relevance (Y axis): 1 - 5
  uniquenessScore: number;   // Uniqueness (X axis): 1 - 5
  viabilityScore: number;    // 0 - 100
  flopRiskIndex?: number;    // %
  matrixPosition?: string;
  matrixQuadrant?: string;
}

export default function BasesMatrix({
  appealScore,
  uniquenessScore,
  viabilityScore,
  flopRiskIndex = 12,
  matrixPosition = 'Ngôi sao đột phá',
  matrixQuadrant = 'star',
}: BasesMatrixProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  // Nielsen Benchmark threshold is 3.5 on a 1 - 5 Likert scale
  // Map coordinates (1.0 to 5.0) smoothly across the 2x2 grid where (3.5, 3.5) is dead center (50%, 50%)
  const calculateCoordinate = (val: number) => {
    const clamped = Math.max(1.0, Math.min(5.0, val));
    if (clamped < 3.5) {
      // 1.0 -> 12%, 3.5 -> 50%
      return 12 + ((clamped - 1.0) / (3.5 - 1.0)) * 38;
    } else {
      // 3.5 -> 50%, 5.0 -> 88%
      return 50 + ((clamped - 3.5) / (5.0 - 3.5)) * 38;
    }
  };

  const xPercent = calculateCoordinate(uniquenessScore);
  const yPercent = calculateCoordinate(appealScore);

  const getQuadrantInfo = () => {
    switch (matrixQuadrant) {
      case 'star':
        return {
          title: 'NGÔI SAO ĐỘT PHÁ (BREAKTHROUGH STAR)',
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          desc: 'Sản phẩm vừa có tính khác biệt vượt trội, vừa giải quyết trúng nhu cầu thiết yếu hàng ngày. Tỷ lệ sống sót trên kệ siêu thị sau 12 tháng dự báo đạt trên 82%.',
          tag: '⭐ Ngôi sao đột phá',
        };
      case 'metoo':
        return {
          title: 'HÀNG BẮT CHƯỚC (ME-TOO / COMMODITY)',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          desc: 'Nhu cầu cao nhưng độ độc đáo thấp. Dễ bị cạnh tranh khốc liệt về giá và bị các thương hiệu đầu ngành áp đảo nếu thiếu ngân sách quảng cáo lớn.',
          tag: '📦 Thiết yếu phổ thông',
        };
      case 'niche':
        return {
          title: 'TIỀM NĂNG THỊ PHẦN NGÁCH (NICHE HERO)',
          badge: 'bg-blue-100 text-blue-900 border-blue-300',
          desc: 'Ý tưởng rất độc đáo nhưng chỉ chạm vào một phân khúc khách hàng chuyên biệt. Khuyến nghị tối ưu chi phí phân phối và tập trung vào cộng đồng ngách.',
          tag: '🎯 Thị phần ngách',
        };
      default:
        return {
          title: 'NGUY CƠ THẤT BẠI (HIGH FLOP RISK)',
          badge: 'bg-rose-100 text-rose-900 border-rose-300',
          desc: 'Cả tính liên quan lẫn độ độc đáo đều dưới ngưỡng an toàn. Khuyến nghị cấu trúc lại toàn bộ đề xuất giá trị trước khi đầu tư sản xuất.',
          tag: '⚠ Nguy cơ thất bại',
        };
    }
  };

  const quad = getQuadrantInfo();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            PHƯƠNG PHÁP NIELSEN BASES
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
            Ma Trận Định Vị Tiềm Năng Sản Phẩm (BASES Matrix)
          </h3>
          <p className="text-xs text-slate-500">
            Tương quan giữa Độ Độc Đáo (Trục Hoành) và Mức Độ Liên Quan / Thiết Yếu (Trục Tung)
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold text-center shrink-0 ${quad.badge}`}>
          {matrixPosition || quad.tag}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── 2D Interactive BASES Matrix Canvas (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="relative w-full h-[380px] min-h-[380px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden select-none">
            {/* 4 Quadrants Background Grid */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              {/* Top-Left (Q2): Low Uniqueness, High Relevance = Me-Too / Commodity */}
              <div className="p-3.5 border-r border-b border-slate-200 bg-amber-50/30 flex flex-col justify-between relative">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                    HÀNG BẮT CHƯỚC (ME-TOO)
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Nhu cầu cao · Thiếu khác biệt</p>
                </div>
                <span className="text-[9px] font-mono text-slate-400">X &lt; 3.5 | Y &ge; 3.5</span>
              </div>

              {/* Top-Right (Q1): High Uniqueness, High Relevance = Breakthrough Star */}
              <div className="p-3.5 border-b border-slate-200 bg-emerald-50/60 flex flex-col justify-between relative ring-inset">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-950 bg-emerald-200/90 px-2 py-0.5 rounded border border-emerald-300">
                      ⭐ NGÔI SAO ĐỘT PHÁ
                    </span>
                    <p className="text-[10px] text-emerald-800 font-medium mt-1">Vừa độc đáo · Vừa thiết yếu</p>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded shadow-2xs">
                    Sống sót &gt;82%
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-700 font-semibold text-right">X &ge; 3.5 | Y &ge; 3.5</span>
              </div>

              {/* Bottom-Left (Q3): Low Uniqueness, Low Relevance = High Flop Risk */}
              <div className="p-3.5 border-r border-slate-200 bg-rose-50/35 flex flex-col justify-between relative">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">
                    NGUY CƠ THẤT BẠI (FLOP RISK)
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Kém độc đáo · Nhu cầu mờ nhạt</p>
                </div>
                <span className="text-[9px] font-mono text-slate-400">X &lt; 3.5 | Y &lt; 3.5</span>
              </div>

              {/* Bottom-Right (Q4): High Uniqueness, Low Relevance = Niche Potential */}
              <div className="p-3.5 bg-blue-50/35 flex flex-col justify-between relative">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
                    THỊ TRƯỜNG NGÁCH (NICHE HERO)
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Độc đáo cao · Dung lượng hẹp</p>
                </div>
                <span className="text-[9px] font-mono text-slate-400 text-right">X &ge; 3.5 | Y &lt; 3.5</span>
              </div>
            </div>

            {/* Center Axes Lines (Intersecting at 50%, 50%) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px border-l-2 border-dashed border-slate-300 pointer-events-none" />
            <div className="absolute left-0 right-0 top-1/2 h-px border-t-2 border-dashed border-slate-300 pointer-events-none" />

            {/* Center Benchmark Crosshair Tag */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-300 text-[9px] font-mono text-slate-600 font-bold shadow-2xs z-10 pointer-events-none whitespace-nowrap">
              Benchmark 3.5 / 5.0
            </div>

            {/* ── Product Location Pin (Dynamic Coordinate) ── */}
            <div
              className="absolute z-20 transition-all duration-700 ease-out cursor-pointer group"
              style={{
                left: `${xPercent}%`,
                bottom: `${yPercent}%`,
                transform: 'translate(-50%, 50%)',
              }}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              {/* Radar beacon pulsing */}
              <div className="w-8 h-8 rounded-full bg-amber-500/30 animate-ping absolute -top-1 -left-1 pointer-events-none" />

              {/* Pin Core */}
              <div className="w-6 h-6 rounded-full bg-amber-600 border-2 border-white shadow-md flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Floating Tooltip Callout Card */}
              {showTooltip && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl shadow-xl text-xs z-30 pointer-events-none border border-slate-700 animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="font-bold text-amber-400 text-[11px] truncate flex items-center gap-1">
                    <span>📍</span>
                    <span>Sản phẩm thử nghiệm</span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-[10px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Độ độc đáo (X):</span>
                      <span className="font-mono font-bold text-amber-300">{uniquenessScore.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Độ thiết yếu (Y):</span>
                      <span className="font-mono font-bold text-emerald-300">{appealScore.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1 mt-1">
                      <span className="text-slate-400">Điểm khả thi:</span>
                      <span className="font-mono font-bold text-emerald-400">{viabilityScore}/100</span>
                    </div>
                  </div>
                  {/* Tooltip triangle arrow */}
                  <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-700" />
                </div>
              )}
            </div>
          </div>

          {/* Coordinate Axes Explanations */}
          <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-500 px-1">
            <span>← (1.0) Kém khác biệt</span>
            <span className="uppercase text-slate-700 font-bold tracking-wider">
              Trục Hoành: Độ Độc Đáo (Uniqueness) →
            </span>
            <span>Đột phá (5.0) →</span>
          </div>
        </div>

        {/* ── Diagnostic Strategic Metrics (5 cols) ── */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Card 1: Vị trí chiến lược */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              VỊ TRÍ CHIẾN LƯỢC HIỆN TẠI
            </span>
            <div className="font-serif font-bold text-slate-900 text-base mb-1.5 flex items-center gap-1.5">
              <span>{quad.title}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {quad.desc}
            </p>
          </div>

          {/* Card 2: 2 Chỉ số thành phần */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Độ độc đáo (X)
              </span>
              <div className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {uniquenessScore.toFixed(1)} <span className="text-xs text-slate-400 font-sans font-normal">/ 5.0</span>
              </div>
              <span className={`text-[10px] font-medium block mt-1 ${uniquenessScore >= 3.5 ? 'text-emerald-700 font-semibold' : 'text-amber-700'}`}>
                {uniquenessScore >= 3.5 ? '✓ Vượt chuẩn độc đáo' : '⚠ Thấp hơn kỳ vọng'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Độ liên quan (Y)
              </span>
              <div className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {appealScore.toFixed(1)} <span className="text-xs text-slate-400 font-sans font-normal">/ 5.0</span>
              </div>
              <span className={`text-[10px] font-medium block mt-1 ${appealScore >= 3.5 ? 'text-emerald-700 font-semibold' : 'text-amber-700'}`}>
                {appealScore >= 3.5 ? '✓ Nhu cầu rõ nét' : '⚠ Nhu cầu mờ nhạt'}
              </span>
            </div>
          </div>

          {/* Card 3: Flop Risk Index & Progress Meter */}
          <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                  Chỉ số nguy cơ thất bại (Flop Risk Index)
                </span>
                <span className="text-[11px] text-rose-700/80">Tỷ lệ người dùng cự tuyệt mua</span>
              </div>
              <div className="text-xl font-serif font-black text-rose-700 font-mono shrink-0">
                {flopRiskIndex}%
              </div>
            </div>

            {/* Visual Risk Gauge Bar */}
            <div className="w-full bg-rose-200/70 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  flopRiskIndex <= 20
                    ? 'bg-emerald-500'
                    : flopRiskIndex <= 40
                    ? 'bg-amber-500'
                    : 'bg-rose-600'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, flopRiskIndex))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-rose-700">
              <span>0% An toàn tuyệt đối</span>
              <span className="font-bold">
                {flopRiskIndex <= 20 ? 'Ngưỡng an toàn cao (&lt;20%)' : 'Cần cảnh giác (&gt;20%)'}
              </span>
              <span>100% Cực kỳ nguy hiểm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
