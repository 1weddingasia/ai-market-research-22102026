'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface DealElasticityChartProps {
  modelSpecific?: {
    switching_intent?: number;      // %
    perceived_value?: number;       // 1 - 10
    redemption_friction?: number;   // 1 - 10
    cannibalization_risk?: number;  // %
    tiers?: Array<{
      discount_level: string;
      conversion_rate: number;
      revenue_impact: string;
    }>;
  };
}

export default function DealElasticityChart({ modelSpecific }: DealElasticityChartProps) {
  const switchingIntent = modelSpecific?.switching_intent ?? 72;
  const perceivedValue = modelSpecific?.perceived_value ?? 8.4;
  const friction = modelSpecific?.redemption_friction ?? 3.2;
  const cannibalization = modelSpecific?.cannibalization_risk ?? 24;

  const tiers = modelSpecific?.tiers || [
    { discount_level: 'Giảm 10%', conversion_rate: 28, revenue_impact: '+12% Lợi nhuận' },
    { discount_level: 'Giảm 20%', conversion_rate: 54, revenue_impact: '+29% Lợi nhuận (Tối ưu)' },
    { discount_level: 'Giảm 30%', conversion_rate: 76, revenue_impact: '+15% (Bắt đầu ăn mòn biên)' },
    { discount_level: 'Mua 1 tặng 1', conversion_rate: 88, revenue_impact: '-8% (Rủi ro lỗ biên)' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            MÔ HÌNH DEAL ELASTICITY
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
            Độ Co Giãn Khuyến Mãi & Tỷ Lệ Đổi Thương Hiệu (Switching Intent)
          </h3>
          <p className="text-xs text-slate-500">
            Dự báo tỷ lệ kích hoạt chuyển dịch người tiêu dùng từ đối thủ cạnh tranh sang sản phẩm mới
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold text-center shrink-0">
          Tỷ lệ chuyển đổi mục tiêu: {switchingIntent}%
        </div>
      </div>

      {/* 3 High-Level Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Ý ĐỊNH ĐỔI THƯƠNG HIỆU (SWITCHING INTENT)
          </span>
          <div className="text-2xl font-serif font-black text-emerald-900 mt-1">
            {switchingIntent}%
          </div>
          <p className="text-[11px] text-emerald-800/80 mt-1">
            Khách hàng sẵn sàng từ bỏ thương hiệu quen thuộc để dùng thử gói ưu đãi này.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            GIÁ TRỊ CẢM NHẬN VS RÀO CẢN
          </span>
          <div className="text-xl font-serif font-bold text-slate-900 mt-1">
            {perceivedValue} <span className="text-xs text-slate-400 font-sans font-normal">/ 10đ</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Chỉ số lực cản tham gia (Friction): {friction}/10 (Mức an toàn, thao tác dễ hiểu).
          </p>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            RỦI RO ĂN MÒN DOANH SỐ (CANNIBALIZATION)
          </span>
          <div className="text-xl font-serif font-bold text-amber-900 mt-1">
            {cannibalization}%
          </div>
          <p className="text-[11px] text-amber-800/80 mt-1">
            Tỷ lệ khách hàng cũ mua khuyến mãi thay vì mua giá nguyên bản.
          </p>
        </div>
      </div>

      {/* Conversion by Discount Tier Bar Chart */}
      <div className="border border-slate-200 rounded-xl p-5">
        <h4 className="font-serif text-sm font-bold text-slate-900 mb-1">
          Tỷ Lệ Kích Hoạt Mua Theo Từng Mức Chiết Khấu / Khuyến Mãi
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Đo lường độ đàn hồi giữa mức giảm giá và số lượng khách hàng mới sẵn sàng xuống tiền
        </p>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tiers} margin={{ top: 10, right: 30, left: 15, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="discount_level" tick={{ fontSize: 11, fill: '#334155' }} />
              <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                formatter={(val: any, name: any, item: any) => [
                  `${val}% (Hiệu quả: ${item?.payload?.revenue_impact || ''})`,
                  'Tỷ lệ chuyển đổi',
                ]}
                contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
              />
              <Bar dataKey="conversion_rate" radius={[6, 6, 0, 0]}>
                {tiers.map((t, idx) => (
                  <Cell
                    key={idx}
                    fill={idx === 1 ? '#059669' : idx === 3 ? '#DC2626' : '#0F172A'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
