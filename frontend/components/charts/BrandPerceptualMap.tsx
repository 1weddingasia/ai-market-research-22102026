'use client';

import React from 'react';

interface BrandPoint {
  brand: string;
  x: number;
  y: number;
  quadrant: string;
  quadrant_name: string;
  color?: string;
  is_client?: boolean;
}

interface BrandPerceptualMapProps {
  modelSpecific?: {
    brands_data?: BrandPoint[];
    axis_x_label?: string;
    axis_y_label?: string;
    whitespace_quadrant?: string;
    whitespace_name?: string;
    client_brand?: string;
    total_brands?: number;
  };
}

export default function BrandPerceptualMap({ modelSpecific }: BrandPerceptualMapProps) {
  const brands = modelSpecific?.brands_data || [
    { brand: 'Thương hiệu của bạn', x: 4.5, y: 7.8, quadrant: 'Q2', quadrant_name: 'Bình dân & Hiện đại Thông minh', color: '#0ea5e9', is_client: true },
    { brand: 'Đối thủ A (Dẫn đầu truyền thống)', x: 5.4, y: 3.6, quadrant: 'Q4', quadrant_name: 'Cao cấp & Di sản Uy tín', color: '#dc2626', is_client: false },
    { brand: 'Đối thủ B (Ngoại nhập)', x: 8.6, y: 8.4, quadrant: 'Q1', quadrant_name: 'Cao cấp & Đột phá Công nghệ', color: '#4f46e5', is_client: false },
    { brand: 'Đối thủ C (Chuỗi giá rẻ)', x: 2.2, y: 2.5, quadrant: 'Q3', quadrant_name: 'Bình dân & Truyền thống Quen thuộc', color: '#d97706', is_client: false },
  ];

  const axisX = modelSpecific?.axis_x_label || 'Phân khúc Giá (1: Bình dân ↔ 10: Cao cấp)';
  const axisY = modelSpecific?.axis_y_label || 'Đổi mới Sáng tạo (1: Truyền thống ↔ 10: Đột phá)';
  const whitespaceQuad = modelSpecific?.whitespace_quadrant || 'Q2';
  const whitespaceName = modelSpecific?.whitespace_name || 'Bình dân & Hiện đại Thông minh (Smart Value Disruptor)';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            PHƯƠNG PHÁP BRAND PERCEPTUAL MAPPING
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
            Bản Đồ Định Vị Thị Trường 2D & Phát Hiện Đại Dương Xanh (White-space)
          </h3>
          <p className="text-xs text-slate-500">
            Tọa độ nhận thức của người tiêu dùng đo lường trên hệ trục 10 điểm. Tâm tọa độ chuẩn (5.0, 5.0).
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-900 text-xs font-bold text-center shrink-0">
          🎯 Khoảng trống thị trường: {whitespaceQuad}
        </div>
      </div>

      {/* 2D Perceptual Scatter Map */}
      <div className="relative w-full aspect-[16/10] max-h-[420px] bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-hidden">
        {/* 4 Quadrants Background */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {/* Top-Left: Q2 */}
          <div className={`p-4 border-r border-b border-slate-300 relative ${
            whitespaceQuad === 'Q2' ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50'
          }`}>
            <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
              Q2: Smart Value Disruptors
              {whitespaceQuad === 'Q2' && <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded text-[9px]">Khoảng trống</span>}
            </span>
            <span className="block text-[10px] text-slate-500">Bình dân & Hiện đại thông minh</span>
          </div>

          {/* Top-Right: Q1 */}
          <div className={`p-4 border-b border-slate-300 relative text-right ${
            whitespaceQuad === 'Q1' ? 'bg-indigo-50/70 border-indigo-300' : 'bg-slate-50'
          }`}>
            <span className="text-[10px] font-bold uppercase text-indigo-800 flex items-center justify-end gap-1">
              {whitespaceQuad === 'Q1' && <span className="bg-indigo-600 text-white px-1.5 py-0.2 rounded text-[9px]">Khoảng trống</span>}
              Q1: Premium Innovators
            </span>
            <span className="block text-[10px] text-slate-500">Cao cấp & Đột phá công nghệ</span>
          </div>

          {/* Bottom-Left: Q3 */}
          <div className={`p-4 border-r border-slate-300 relative flex flex-col justify-end ${
            whitespaceQuad === 'Q3' ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50'
          }`}>
            <span className="text-[10px] font-bold uppercase text-amber-800 flex items-center gap-1">
              Q3: Budget Traditionalists
              {whitespaceQuad === 'Q3' && <span className="bg-amber-600 text-white px-1.5 py-0.2 rounded text-[9px]">Khoảng trống</span>}
            </span>
            <span className="block text-[10px] text-slate-500">Bình dân & Quen thuộc</span>
          </div>

          {/* Bottom-Right: Q4 */}
          <div className={`p-4 relative text-right flex flex-col justify-end ${
            whitespaceQuad === 'Q4' ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50'
          }`}>
            <span className="text-[10px] font-bold uppercase text-rose-800 flex items-center justify-end gap-1">
              {whitespaceQuad === 'Q4' && <span className="bg-rose-600 text-white px-1.5 py-0.2 rounded text-[9px]">Khoảng trống</span>}
              Q4: Heritage Luxury
            </span>
            <span className="block text-[10px] text-slate-500">Cao cấp & Di sản truyền thống</span>
          </div>
        </div>

        {/* Center Crosshair (5.0, 5.0) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-slate-400" />
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-slate-400" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-700 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full z-10 shadow-xs">
          (5,5)
        </div>

        {/* Dynamic Axis Legend */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/95 px-3 py-0.5 rounded-full shadow-xs border border-slate-200 text-[10px] font-bold text-slate-800">
          ↑ {axisY}
        </div>
        <div className="absolute bottom-2 right-4 bg-white/95 px-3 py-0.5 rounded-full shadow-xs border border-slate-200 text-[10px] font-bold text-slate-800">
          {axisX} →
        </div>

        {/* Brand Bubbles on Map */}
        {brands.map((b, idx) => {
          // X: 1 -> 10 => 5% -> 95%
          const leftPct = Math.min(94, Math.max(6, ((b.x - 1) / 9) * 100));
          // Y: 1 -> 10 => 95% -> 5%
          const topPct = Math.min(92, Math.max(8, 100 - ((b.y - 1) / 9) * 100));

          return (
            <div
              key={idx}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
            >
              <div
                className={`relative px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-transform group-hover:scale-115 flex items-center gap-1.5 ${
                  b.is_client
                    ? 'bg-sky-600 text-white ring-4 ring-sky-300/50'
                    : 'bg-slate-900 text-white border border-slate-700'
                }`}
              >
                {b.is_client && <span className="text-amber-300">★</span>}
                <span>{b.brand}</span>
                <span className="text-[10px] font-mono opacity-80">({b.x}, {b.y})</span>
              </div>

              {/* Tooltip on Hover */}
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-slate-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl z-30 pointer-events-none">
                <span className="font-bold block text-amber-300">{b.brand}</span>
                <span className="block text-slate-300 mt-1">Phân vị: {b.quadrant_name}</span>
                <span className="block text-slate-400 text-[10px] font-mono">
                  Giá: {b.x}/10 | Công nghệ: {b.y}/10
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* White-space Opportunity Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Đại dương xanh (White-space Opportunity)
          </span>
          <h4 className="font-serif text-sm font-bold text-slate-900 mt-0.5">
            Góc phần tư {whitespaceQuad}: {whitespaceName}
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            Khu vực này hiện có mật độ cạnh tranh thấp nhất và nhu cầu người tiêu dùng chưa được phục vụ triệt để.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-block px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs">
            Cơ hội dẫn đầu phân khúc
          </span>
        </div>
      </div>

      {/* Brands Coordinates Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Thương hiệu</th>
              <th className="py-3 px-4 text-center">Tọa độ Giá (Trục X)</th>
              <th className="py-3 px-4 text-center">Tọa độ Đổi mới (Trục Y)</th>
              <th className="py-3 px-4">Góc phần tư định vị</th>
              <th className="py-3 px-4">Vị thế cạnh tranh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {brands.map((b, idx) => (
              <tr key={idx} className={b.is_client ? 'bg-sky-50/50 font-semibold' : 'hover:bg-slate-50/50'}>
                <td className="py-3 px-4 text-slate-900 flex items-center gap-1.5">
                  {b.is_client && <span className="text-sky-600 font-bold">★</span>}
                  <span>{b.brand}</span>
                  {b.is_client && <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-bold">Thương hiệu của bạn</span>}
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">{b.x} / 10</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-indigo-700">{b.y} / 10</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {b.quadrant}: {b.quadrant_name}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {b.is_client ? 'Định vị cốt lõi của chiến dịch' : 'Đối thủ tham chiếu trực tiếp'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
