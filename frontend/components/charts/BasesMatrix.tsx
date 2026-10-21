'use client';

import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea } from 'recharts';

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
  flopRiskIndex = 18,
  matrixPosition = 'Ngôi sao đột phá',
  matrixQuadrant = 'star',
}: BasesMatrixProps) {
  const currentPoint = [
    {
      x: uniquenessScore,
      y: appealScore,
      label: 'Sản phẩm thử nghiệm',
      viability: viabilityScore,
    },
  ];

  const getQuadrantInfo = () => {
    switch (matrixQuadrant) {
      case 'star':
        return {
          title: 'NGÔI SAO ĐỘT PHÁ (BREAKTHROUGH STAR)',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          desc: 'Sản phẩm vừa có tính khác biệt vượt trội, vừa giải quyết trúng nhu cầu thiết yếu hàng ngày. Tỷ lệ sống sót trên kệ siêu thị sau 12 tháng dự báo đạt trên 82%.',
        };
      case 'metoo':
        return {
          title: 'HÀNG BẮT CHƯỚC (ME-TOO / COMMODITY)',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          desc: 'Nhu cầu cao nhưng độ độc đáo thấp. Dễ bị cạnh tranh khốc liệt về giá và bị các thương hiệu đầu ngành áp đảo nếu thiếu ngân sách quảng cáo lớn.',
        };
      case 'niche':
        return {
          title: 'TIỀM NĂNG THỊ PHẦN NGÁCH (NICHE POTENTIAL)',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          desc: 'Ý tưởng rất độc đáo nhưng chỉ chạm vào một phân khúc khách hàng chuyên biệt. Nên tối ưu chi phí phân phối và tập trung vào cộng đồng ngách.',
        };
      default:
        return {
          title: 'NGUY CƠ THẤT BẠI (HIGH FLOP RISK)',
          badge: 'bg-red-100 text-red-800 border-red-300',
          desc: 'Cả tính liên quan lẫn độ độc đáo đều dưới ngưỡng an toàn. Khuyến nghị cấu trúc lại toàn bộ đề xuất giá trị trước khi đầu tư sản xuất.',
        };
    }
  };

  const quad = getQuadrantInfo();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-6">
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
          {matrixPosition}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Scatter Chart (7 cols) */}
        <div className="lg:col-span-7 h-80 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 25, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                type="number"
                dataKey="x"
                name="Độ độc đáo"
                domain={[1, 5]}
                tickCount={5}
                unit="/5"
                label={{ value: 'ĐỘ ĐỘC ĐÁO (UNIQUENESS) →', position: 'bottom', offset: 10, fontSize: 11, fill: '#64748B' }}
                tick={{ fontSize: 11, fill: '#64748B' }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Mức độ liên quan"
                domain={[1, 5]}
                tickCount={5}
                unit="/5"
                label={{ value: '↑ MỨC ĐỘ THIẾT YẾU / LIÊN QUAN (RELEVANCE)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#64748B' }}
                tick={{ fontSize: 11, fill: '#64748B' }}
              />
              {/* Midpoint references (3.5) */}
              <ReferenceLine x={3.5} stroke="#CBD5E1" strokeDasharray="4 4" />
              <ReferenceLine y={3.5} stroke="#CBD5E1" strokeDasharray="4 4" />

              {/* Shaded Area for Star Quadrant */}
              <ReferenceArea x1={3.5} x2={5} y1={3.5} y2={5} fill="#ECFDF5" fillOpacity={0.6} />

              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                        <div className="font-bold text-amber-400">{data.label}</div>
                        <div>Độ độc đáo: <span className="font-mono font-bold">{data.x}/5</span></div>
                        <div>Độ thiết yếu: <span className="font-mono font-bold">{data.y}/5</span></div>
                        <div>Điểm khả thi: <span className="font-mono font-bold text-emerald-400">{data.viability}/100</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Ý tưởng" data={currentPoint} fill="#B45309" shape="circle" />
            </ScatterChart>
          </ResponsiveContainer>

          {/* Quadrant Labels in Plot corners */}
          <div className="absolute top-3 left-16 text-[10px] font-bold text-slate-400 pointer-events-none">
            HÀNG BẮT CHƯỚC
          </div>
          <div className="absolute top-3 right-5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded pointer-events-none">
            ⭐ NGÔI SAO ĐỘT PHÁ
          </div>
          <div className="absolute bottom-10 left-16 text-[10px] font-bold text-red-500 pointer-events-none">
            NGUY CƠ THẤT BẠI
          </div>
          <div className="absolute bottom-10 right-5 text-[10px] font-bold text-blue-600 pointer-events-none">
            THỊ TRƯỜNG NGÁCH
          </div>
        </div>

        {/* Diagnostic Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              VỊ TRÍ CHIẾN LƯỢC
            </span>
            <div className="font-serif font-bold text-slate-900 text-base mb-1.5">
              {quad.title}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {quad.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Độ độc đáo (X)
              </span>
              <div className="text-xl font-serif font-bold text-slate-900 mt-0.5">
                {uniquenessScore.toFixed(1)} <span className="text-xs text-slate-400 font-sans font-normal">/ 5.0</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {uniquenessScore >= 3.5 ? '✓ Vượt chuẩn độc đáo' : '⚠ Thấp hơn kỳ vọng'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Độ liên quan (Y)
              </span>
              <div className="text-xl font-serif font-bold text-slate-900 mt-0.5">
                {appealScore.toFixed(1)} <span className="text-xs text-slate-400 font-sans font-normal">/ 5.0</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {appealScore >= 3.5 ? '✓ Nhu cầu rõ nét' : '⚠ Nhu cầu mờ nhạt'}
              </span>
            </div>
          </div>

          <div className="bg-red-50/60 border border-red-200 p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 block">
                Chỉ số nguy cơ thất bại (Flop Risk Index)
              </span>
              <span className="text-[11px] text-red-700/80">Tỷ lệ người dùng cự tuyệt mua</span>
            </div>
            <div className="text-lg font-serif font-black text-red-700 font-mono">
              {flopRiskIndex}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
