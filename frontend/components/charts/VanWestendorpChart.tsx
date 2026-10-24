'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';

interface VanWestendorpChartProps {
  modelSpecific?: {
    optimal_price?: number;
    indifference_price?: number;
    acceptable_range?: [number, number];
    price_curves?: Array<{
      price: number;
      too_cheap: number;
      cheap: number;
      expensive: number;
      too_expensive: number;
    }>;
  };
}

export default function VanWestendorpChart({ modelSpecific }: VanWestendorpChartProps) {
  const opp = modelSpecific?.optimal_price || 32000;
  const ipp = modelSpecific?.indifference_price || 35000;
  const range = modelSpecific?.acceptable_range || [25000, 42000];

  // Default price curve simulation if not directly supplied
  const defaultCurves = [
    { price: 20000, too_cheap: 78, cheap: 85, expensive: 8, too_expensive: 2 },
    { price: 25000, too_cheap: 42, cheap: 68, expensive: 15, too_expensive: 4 },
    { price: 30000, too_cheap: 18, cheap: 54, expensive: 28, too_expensive: 7 },
    { price: 32000, too_cheap: 11, cheap: 45, expensive: 45, too_expensive: 12 }, // Near OPP
    { price: 35000, too_cheap: 7, cheap: 34, expensive: 58, too_expensive: 25 },  // Near IPP
    { price: 38000, too_cheap: 4, cheap: 22, expensive: 68, too_expensive: 38 },
    { price: 42000, too_cheap: 2, cheap: 12, expensive: 79, too_expensive: 52 },
    { price: 45000, too_cheap: 1, cheap: 6, expensive: 88, too_expensive: 68 },
    { price: 50000, too_cheap: 0, cheap: 3, expensive: 95, too_expensive: 92 },
  ];

  const data = modelSpecific?.price_curves && modelSpecific.price_curves.length > 0
    ? modelSpecific.price_curves
    : defaultCurves;

  const formatVND = (v: number) => `${(v / 1000).toLocaleString('vi-VN')}k`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            PHƯƠNG PHÁP VAN WESTENDORP (PSM)
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
            Đồ Thị 4 Đường Cong Độ Nhạy Cảm Về Giá (Price Sensitivity Meter)
          </h3>
          <p className="text-xs text-slate-500">
            Xác định Điểm giá Tối ưu (OPP) và Điểm giá Cân bằng (IPP) giảm thiểu tối đa lực cản mua hàng
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-bold text-center shrink-0">
          Điểm giá tối ưu: {opp.toLocaleString('vi-VN')} đ
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ── Line Chart & 4-Curve Visualizer (8 cols) ── */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {/* Axis Header indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 px-1">
            <span className="font-medium text-slate-600">
              Trục tung: Tỷ lệ % người tiêu dùng đánh giá (0% — 100%)
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Vùng vàng: Khoảng giá chấp nhận được (RAP)
            </span>
          </div>

          <div className="h-[340px] min-h-[340px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 25, left: 5, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="price"
                  tickFormatter={formatVND}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickMargin={8}
                />
                <YAxis
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickMargin={8}
                />

                {/* Acceptable Price Range Highlight (RAP) */}
                <ReferenceArea
                  x1={range[0]}
                  x2={range[1]}
                  fill="#FEF3C7"
                  fillOpacity={0.4}
                />

                {/* Vertical OPP Guideline */}
                <ReferenceLine
                  x={opp}
                  stroke="#059669"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: `OPP: ${formatVND(opp)}`,
                    position: 'top',
                    fill: '#059669',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />

                {/* Vertical IPP Guideline */}
                <ReferenceLine
                  x={ipp}
                  stroke="#2563EB"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  label={{
                    value: `IPP: ${formatVND(ipp)}`,
                    position: 'top',
                    fill: '#2563EB',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />

                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  labelFormatter={(label: any) => `Mức giá: ${Number(label).toLocaleString('vi-VN')} đ`}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />

                {/* 4 Economic Curves */}
                <Line
                  type="monotone"
                  dataKey="too_cheap"
                  name="Quá rẻ (Nghi ngờ chất lượng)"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="cheap"
                  name="Rẻ (Mức giá hời)"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expensive"
                  name="Đắt (Nhưng vẫn cân nhắc)"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="too_expensive"
                  name="Quá đắt (Cự tuyệt mua)"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Clean X-Axis Legend footer */}
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono font-semibold text-slate-500 px-2">
            <span>← Mức giá thấp</span>
            <span className="uppercase text-slate-700 font-bold tracking-wider">
              Trục Hoành: Mức Giá Khảo Sát (VNĐ) →
            </span>
            <span>Mức giá cao →</span>
          </div>

          {/* ── 4 Dedicated Strategic Legend Cards (Never overlaps) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shrink-0 shadow-2xs" />
              <div className="min-w-0">
                <div className="font-bold text-blue-900 text-xs sm:text-sm truncate">Quá rẻ</div>
                <div className="text-xs text-blue-700/90 truncate">Nghi ngờ chất lượng</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0 shadow-2xs" />
              <div className="min-w-0">
                <div className="font-bold text-emerald-900 text-xs sm:text-sm truncate">Rẻ (Giá hời)</div>
                <div className="text-xs text-emerald-700/90 truncate">Kích cầu thâm nhập</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0 shadow-2xs" />
              <div className="min-w-0">
                <div className="font-bold text-amber-900 text-xs sm:text-sm truncate">Đắt</div>
                <div className="text-xs text-amber-700/90 truncate">Vẫn cân nhắc mua</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0 shadow-2xs" />
              <div className="min-w-0">
                <div className="font-bold text-rose-900 text-xs sm:text-sm truncate">Quá đắt</div>
                <div className="text-xs text-rose-700/90 truncate">Cự tuyệt mua</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Price Recommendations Strategic Panel (4 cols) ── */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3.5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 shadow-2xs">
            <span className="text-xs uppercase font-bold text-emerald-900 tracking-wider block">
              ĐIỂM GIÁ TỐI ƯU (OPP)
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-emerald-900 mt-1">
              {opp.toLocaleString('vi-VN')} đ
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 mt-2 leading-relaxed font-normal">
              Giao điểm giữa "Quá rẻ" và "Quá đắt". Mức giá tối đa hóa doanh số thâm nhập thị trường với lực cản tâm lý thấp nhất.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
            <span className="text-xs uppercase font-bold text-slate-700 tracking-wider block">
              ĐIỂM GIÁ CÂN BẰNG (IPP)
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-1">
              {ipp.toLocaleString('vi-VN')} đ
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-normal">
              Giao điểm giữa "Hời" và "Đắt". Mức giá giúp định vị thương hiệu ở phân khúc cao cấp hơn mà không làm mất lòng khách hàng.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 sm:p-5 shadow-2xs">
            <span className="text-xs uppercase font-bold text-amber-900 tracking-wider block">
              KHOẢNG GIÁ CHẤP NHẬN ĐƯỢC (RAP)
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-amber-900 mt-1">
              {range[0].toLocaleString('vi-VN')} đ — {range[1].toLocaleString('vi-VN')} đ
            </div>
            <p className="text-xs sm:text-sm text-amber-950 mt-2 leading-relaxed font-normal">
              Mọi mức giá nằm ngoài khoảng này sẽ chịu sụt giảm mạnh về doanh thu hoặc biên lợi nhuận.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
