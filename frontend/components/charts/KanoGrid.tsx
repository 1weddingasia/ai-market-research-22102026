'use client';

import React from 'react';

interface KanoFeatureSummary {
  feature: string;
  category_code: string;
  category_name: string;
  better_cs_plus: number;
  worse_cs_minus: number;
  priority: number;
}

interface KanoGridProps {
  modelSpecific?: {
    features_summary?: KanoFeatureSummary[];
    must_be_count?: number;
    one_dimensional_count?: number;
    attractive_count?: number;
    indifferent_count?: number;
    total_features?: number;
  };
}

export default function KanoGrid({ modelSpecific }: KanoGridProps) {
  const features = modelSpecific?.features_summary || [
    { feature: 'Bảo quản chân không không chất bảo quản', category_code: 'M', category_name: 'Bắt buộc phải có (Must-be)', better_cs_plus: 0.35, worse_cs_minus: -0.78, priority: 1 },
    { feature: 'Đóng gói theo khẩu phần ăn dinh dưỡng', category_code: 'O', category_name: 'Càng nhiều càng tốt (One-dimensional)', better_cs_plus: 0.72, worse_cs_minus: -0.65, priority: 2 },
    { feature: 'Tùy biến hương vị cá nhân hóa', category_code: 'A', category_name: 'Bất ngờ thú vị (Attractive)', better_cs_plus: 0.81, worse_cs_minus: -0.22, priority: 3 },
    { feature: 'Ứng dụng di động theo dõi lộ trình', category_code: 'I', category_name: 'Vô thưởng vô phạt (Indifferent)', better_cs_plus: 0.28, worse_cs_minus: -0.19, priority: 4 },
  ];

  const mustBeCount = modelSpecific?.must_be_count ?? features.filter(f => f.category_code === 'M').length;
  const oneDimCount = modelSpecific?.one_dimensional_count ?? features.filter(f => f.category_code === 'O').length;
  const attractiveCount = modelSpecific?.attractive_count ?? features.filter(f => f.category_code === 'A').length;
  const indifferentCount = modelSpecific?.indifferent_count ?? features.filter(f => f.category_code === 'I').length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            MÔ HÌNH KANO PRODUCT ROADMAP
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
            Ma Trận Phân Loại Tính Năng & Tối Ưu Hóa Chi Phí R&D
          </h3>
          <p className="text-xs text-slate-500">
            Trục tung: Hệ số thỏa mãn (Better / CS+). Trục hoành: Hệ số bất mãn (Worse / CS-).
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
            {mustBeCount} Bắt buộc (M)
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
            {oneDimCount} Càng nhiều càng tốt (O)
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            {attractiveCount} Đột phá (A)
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {indifferentCount} Thờ ơ (I)
          </span>
        </div>
      </div>

      {/* 2D Kano Coordinate Grid */}
      <div className="relative w-full aspect-[16/9] max-h-[380px] bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-hidden">
        {/* Quadrant Background Colors */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-40">
          <div className="bg-amber-100/50 border-r border-b border-slate-300 relative p-3">
            <span className="text-[11px] font-bold text-amber-900 uppercase">
              Bất ngờ thú vị (Attractive - A)
            </span>
            <span className="block text-[10px] text-amber-700">Tạo viral & Đột phá cảm xúc</span>
          </div>
          <div className="bg-blue-100/50 border-b border-slate-300 relative p-3 text-right">
            <span className="text-[11px] font-bold text-blue-900 uppercase">
              Càng nhiều càng tốt (One-dimensional - O)
            </span>
            <span className="block text-[10px] text-blue-700">Tỷ lệ thuận với giá bán</span>
          </div>
          <div className="bg-slate-200/50 border-r border-slate-300 relative p-3 flex flex-col justify-end">
            <span className="text-[11px] font-bold text-slate-700 uppercase">
              Vô thưởng vô phạt (Indifferent - I)
            </span>
            <span className="block text-[10px] text-slate-500">Cắt giảm để tiết kiệm R&D</span>
          </div>
          <div className="bg-rose-100/50 relative p-3 text-right flex flex-col justify-end">
            <span className="text-[11px] font-bold text-rose-900 uppercase">
              Bắt buộc phải có (Must-be - M)
            </span>
            <span className="block text-[10px] text-rose-700">Thiếu là khách bỏ đi ngay</span>
          </div>
        </div>

        {/* Center Crosshair Reference Lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-400 border-dashed" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-400 border-dashed" />

        {/* Axis Labels */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-0.5 rounded shadow-xs text-[10px] font-bold text-slate-700">
          ↑ Độ thỏa mãn cao (CS+ = 1.0)
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-0.5 rounded shadow-xs text-[10px] font-bold text-slate-700">
          ↓ Độ thỏa mãn thấp (CS+ = 0.0)
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 px-2 py-0.5 rounded shadow-xs text-[10px] font-bold text-slate-700">
          ← Không bức xúc (CS- = 0.0)
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 px-2 py-0.5 rounded shadow-xs text-[10px] font-bold text-slate-700">
          Cực kỳ bức xúc (CS- = -1.0) →
        </div>

        {/* Feature Nodes plotted on the 2D plane */}
        {features.map((f, idx) => {
          // X maps Worse (-1.0 -> 0.0) into percentage (0% -> 100%)
          // Worse = -1.0 means extreme dissatisfaction -> placed on right side (100%)
          // Worse = 0.0 means no dissatisfaction -> placed on left side (0%)
          const xPercent = Math.min(92, Math.max(8, Math.abs(f.worse_cs_minus) * 100));
          // Y maps Better (0.0 -> 1.0) into bottom-up percentage (0% at bottom, 100% at top)
          const yPercent = Math.min(90, Math.max(10, 100 - f.better_cs_plus * 100));

          const nodeColor =
            f.category_code === 'M'
              ? 'bg-rose-600 text-white border-rose-300'
              : f.category_code === 'O'
              ? 'bg-blue-600 text-white border-blue-300'
              : f.category_code === 'A'
              ? 'bg-amber-500 text-white border-amber-300'
              : 'bg-slate-600 text-white border-slate-300';

          return (
            <div
              key={idx}
              style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-md ${nodeColor} group-hover:scale-125 transition-transform`}>
                {idx + 1}
              </div>
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-slate-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl z-20 pointer-events-none">
                <span className="font-bold block text-amber-300">{idx + 1}. {f.feature}</span>
                <span className="block text-slate-300 mt-1">Nhóm: {f.category_name}</span>
                <span className="block text-slate-400 text-[10px] font-mono">
                  CS+: +{f.better_cs_plus} | CS-: {f.worse_cs_minus}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* R&D Roadmap Prioritization Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 text-center">ID</th>
              <th className="py-3 px-4">Tính năng R&D kiểm định</th>
              <th className="py-3 px-4">Phân loại Kano</th>
              <th className="py-3 px-4 text-center">Hệ số hài lòng (CS+)</th>
              <th className="py-3 px-4 text-center">Hệ số bất mãn (CS-)</th>
              <th className="py-3 px-4">Khuyến nghị lộ trình (Roadmap)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {features.map((f, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 text-center font-bold text-slate-700">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[11px]">
                    {idx + 1}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-900">{f.feature}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    f.category_code === 'M'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : f.category_code === 'O'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : f.category_code === 'A'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                    {f.category_name}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">+{f.better_cs_plus}</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">{f.worse_cs_minus}</td>
                <td className="py-3 px-4 text-slate-600 font-medium">
                  {f.category_code === 'M' && 'Ưu tiên số 1 (Bắt buộc trong MVP/V1)'}
                  {f.category_code === 'O' && 'Ưu tiên số 2 (Đầu tư nâng cấp liên tục)'}
                  {f.category_code === 'A' && 'Ưu tiên số 3 (Tính năng USP truyền thông)'}
                  {f.category_code === 'I' && 'Cắt giảm / Loại bỏ để tiết kiệm ngân sách'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
