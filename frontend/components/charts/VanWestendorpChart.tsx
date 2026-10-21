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
  Legend,
  ReferenceDot,
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
  const opp = modelSpecific?.optimal_price || 35000;
  const ipp = modelSpecific?.indifference_price || 42000;
  const range = modelSpecific?.acceptable_range || [28000, 52000];

  // Default price curve simulation if not directly supplied
  const defaultCurves = [
    { price: 20000, too_cheap: 82, cheap: 75, expensive: 8, too_expensive: 2 },
    { price: 25000, too_cheap: 64, cheap: 70, expensive: 14, too_expensive: 5 },
    { price: 30000, too_cheap: 42, cheap: 62, expensive: 24, too_expensive: 9 },
    { price: 35000, too_cheap: 22, cheap: 51, expensive: 36, too_expensive: 16 }, // Near OPP
    { price: 40000, too_cheap: 12, cheap: 38, expensive: 48, too_expensive: 26 },
    { price: 45000, too_cheap: 5, cheap: 24, expensive: 62, too_expensive: 42 },
    { price: 50000, too_cheap: 2, cheap: 14, expensive: 74, too_expensive: 58 },
    { price: 55000, too_cheap: 1, cheap: 8, expensive: 85, too_expensive: 73 },
    { price: 60000, too_cheap: 0, cheap: 3, expensive: 92, too_expensive: 86 },
  ];

  const data = modelSpecific?.price_curves && modelSpecific.price_curves.length > 0
    ? modelSpecific.price_curves
    : defaultCurves;

  const formatVND = (v: number) => `${(v / 1000).toLocaleString('vi-VN')}k`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-6">
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
        <div className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold text-center shrink-0">
          Điểm giá tối ưu: {opp.toLocaleString('vi-VN')} đ
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Line Chart (8 cols) */}
        <div className="lg:col-span-8 h-80 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="price"
                tickFormatter={formatVND}
                tick={{ fontSize: 11, fill: '#64748B' }}
                label={{ value: 'MỨC GIÁ DỰ KIẾN (VND) →', position: 'bottom', offset: 10, fontSize: 11, fill: '#64748B' }}
              />
              <YAxis
                unit="%"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748B' }}
                label={{ value: 'TỶ LỆ % NGƯỜI ĐÁNH GIÁ', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#64748B' }}
              />

              {/* Acceptable Price Range Highlight */}
              <ReferenceArea
                x1={range[0]}
                x2={range[1]}
                fill="#FEF3C7"
                fillOpacity={0.35}
              />

              <Tooltip
                formatter={(val: any, name: any) => [`${val}%`, name]}
                labelFormatter={(label: any) => `Mức giá: ${Number(label).toLocaleString('vi-VN')} đ`}
                contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />

              {/* 4 Curves */}
              <Line type="monotone" dataKey="too_cheap" name="Quá rẻ (Nghi ngờ chất lượng)" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="cheap" name="Rẻ (Mức giá hời)" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="expensive" name="Đắt (Nhưng vẫn cân nhắc)" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="too_expensive" name="Quá đắt (Cự tuyệt mua)" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />

              {/* Reference Dot OPP */}
              <ReferenceDot x={opp} y={20} r={5} fill="#059669" stroke="#FFFFFF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Price Recommendations Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              ĐIỂM GIÁ TỐI ƯU (OPP)
            </span>
            <div className="text-2xl font-serif font-black text-emerald-900 mt-1">
              {opp.toLocaleString('vi-VN')} đ
            </div>
            <p className="text-[11px] text-emerald-800/80 mt-1 leading-relaxed">
              Giao điểm giữa "Quá rẻ" và "Quá đắt". Mức giá tối đa hóa doanh số thâm nhập thị trường với lực cản tâm lý thấp nhất.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              ĐIỂM GIÁ CÂN BẰNG (IPP)
            </span>
            <div className="text-xl font-serif font-bold text-slate-900 mt-1">
              {ipp.toLocaleString('vi-VN')} đ
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Giao điểm giữa "Hời" và "Đắt". Mức giá giúp định vị thương hiệu ở phân khúc cao cấp hơn mà không làm mất lòng khách hàng.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
              KHOẢNG GIÁ CHẤP NHẬN ĐƯỢC (RAP)
            </span>
            <div className="text-base font-mono font-bold text-amber-900 mt-1">
              {range[0].toLocaleString('vi-VN')} đ — {range[1].toLocaleString('vi-VN')} đ
            </div>
            <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
              Mọi mức giá nằm ngoài khoảng này sẽ chịu sụt giảm mạnh về doanh thu hoặc biên lợi nhuận.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
