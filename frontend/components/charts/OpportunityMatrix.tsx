'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Cell,
} from 'recharts';

interface OpportunityMatrixProps {
  modelSpecific?: {
    pain_points?: Array<{
      name: string;
      importance: number;
      satisfaction: number;
      opportunity_score: number;
    }>;
  };
}

export default function OpportunityMatrix({ modelSpecific }: OpportunityMatrixProps) {
  const points = modelSpecific?.pain_points || [
    { name: 'Độ ngọt tự nhiên không gắt', importance: 8.8, satisfaction: 4.2, opportunity_score: 9.2 },
    { name: 'Bảo quản được lâu sau mở', importance: 8.2, satisfaction: 5.1, opportunity_score: 8.4 },
    { name: 'Giá thành uống mỗi ngày', importance: 7.9, satisfaction: 6.0, opportunity_score: 7.6 },
    { name: 'Độ đa dạng hương vị', importance: 6.5, satisfaction: 7.1, opportunity_score: 5.8 },
    { name: 'Bao bì thân thiện môi trường', importance: 5.8, satisfaction: 6.8, opportunity_score: 5.2 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            MA TRẬN CƠ HỘI U&amp;A
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
            Ma Trận Khoảng Trống Cơ Hội &amp; Nỗi Đau Khách Hàng (Opportunity Matrix)
          </h3>
          <p className="text-xs text-slate-500">
            Tương quan giữa Tầm quan trọng của nhu cầu và Mức độ thỏa mãn với các giải pháp hiện tại
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold text-center shrink-0">
          Tìm ra khoảng trống thị trường chưa ai giải quyết tốt
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Scatter / Bubble Plot (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 px-1">
            <span className="font-medium text-slate-600">
              Trục tung: Tầm quan trọng của nhu cầu (2.0 — 10.0đ)
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Vùng vàng: Khoảng trống cơ hội vàng (Unmet Needs)
            </span>
          </div>

          <div className="h-[340px] min-h-[340px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 25, bottom: 15, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  dataKey="satisfaction"
                  name="Thỏa mãn hiện tại"
                  domain={[2, 10]}
                  unit="/10"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickMargin={8}
                />
                <YAxis
                  type="number"
                  dataKey="importance"
                  name="Tầm quan trọng"
                  domain={[2, 10]}
                  unit="/10"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickMargin={8}
                />

                {/* Shaded Area for "Golden Opportunity Gap" (High Importance, Low Satisfaction) */}
                <ReferenceArea x1={2} x2={6} y1={7} y2={10} fill="#FEF3C7" fillOpacity={0.4} />

                <ReferenceLine x={6} stroke="#CBD5E1" strokeDasharray="4 4" />
                <ReferenceLine y={7} stroke="#CBD5E1" strokeDasharray="4 4" />

                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                          <div className="font-bold text-amber-400">{data.name}</div>
                          <div>Tầm quan trọng: <span className="font-mono font-bold">{data.importance}/10</span></div>
                          <div>Mức độ thỏa mãn: <span className="font-mono font-bold">{data.satisfaction}/10</span></div>
                          <div>Điểm cơ hội: <span className="font-mono font-bold text-emerald-400">{data.opportunity_score}/10</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Scatter name="Nỗi đau" data={points}>
                  {points.map((p, idx) => (
                    <Cell
                      key={idx}
                      fill={p.importance >= 7 && p.satisfaction < 6 ? '#D97706' : '#0F172A'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            <div className="absolute top-3 left-14 text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded shadow-2xs border border-amber-300 pointer-events-none">
              ⭐ KHOẢNG TRỐNG CƠ HỘI VÀNG (UNMET NEEDS)
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-500 px-2">
            <span>← (2.0) Kém thỏa mãn</span>
            <span className="uppercase text-slate-700 font-bold tracking-wider">
              Trục Hoành: Mức Độ Thỏa Mãn Hiện Có (Satisfaction) →
            </span>
            <span>Rất thỏa mãn (10.0) →</span>
          </div>
        </div>

        {/* Opportunity Ranking List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            BẢNG XẾP HẠNG KHOẢNG TRỐNG CƠ HỘI
          </span>
          <div className="space-y-2">
            {points.map((p, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Quan trọng: {p.importance} · Thỏa mãn: {p.satisfaction}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">CƠ HỘI</span>
                  <span className="font-mono font-black text-amber-700 text-sm">
                    {p.opportunity_score}đ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
