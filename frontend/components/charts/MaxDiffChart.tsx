'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

interface MaxDiffRanking {
  rank: number;
  attribute: string;
  score: number;
  best_count: number;
  worst_count: number;
  appearances: number;
  tier: string;
  badge_color?: string;
}

interface MaxDiffChartProps {
  modelSpecific?: {
    rankings?: MaxDiffRanking[];
    top_attribute?: string;
    top_score?: number;
    bottom_attribute?: string;
    bottom_score?: number;
    utility_spread?: number;
    total_attributes_tested?: number;
  };
}

export default function MaxDiffChart({ modelSpecific }: MaxDiffChartProps) {
  const rankings = modelSpecific?.rankings || [
    { rank: 1, attribute: 'Hiệu quả rõ rệt sau 7 ngày', score: 48.5, best_count: 320, worst_count: 28, appearances: 602, tier: 'Trọng tâm Cốt lõi (Core Must-Have)', badge_color: 'emerald' },
    { rank: 2, attribute: '100% Nguồn gốc tự nhiên hữu cơ', score: 32.1, best_count: 260, worst_count: 67, appearances: 601, tier: 'Trọng tâm Cốt lõi (Core Must-Have)', badge_color: 'emerald' },
    { rank: 3, attribute: 'Mức giá hợp lý tiết kiệm', score: 14.8, best_count: 180, worst_count: 91, appearances: 600, tier: 'Lợi thế Cạnh tranh (Differentiator)', badge_color: 'blue' },
    { rank: 4, attribute: 'Bao bì thân thiện môi trường', score: 2.5, best_count: 110, worst_count: 95, appearances: 604, tier: 'Lợi thế Cạnh tranh (Differentiator)', badge_color: 'blue' },
    { rank: 5, attribute: 'Thương hiệu chuẩn quốc tế', score: -11.2, best_count: 70, worst_count: 137, appearances: 598, tier: 'Ưu tiên Thứ cấp (Nice-to-Have)', badge_color: 'amber' },
    { rank: 6, attribute: 'Thiết kế nhỏ gọn tiện lợi', score: -28.4, best_count: 40, worst_count: 211, appearances: 602, tier: 'Khách hàng Thờ ơ (Low Priority / Waste)', badge_color: 'slate' },
  ];

  const topAttr = modelSpecific?.top_attribute || rankings[0].attribute;
  const topScore = modelSpecific?.top_score ?? rankings[0].score;
  const bottomAttr = modelSpecific?.bottom_attribute || rankings[rankings.length - 1].attribute;
  const bottomScore = modelSpecific?.bottom_score ?? rankings[rankings.length - 1].score;
  const spread = modelSpecific?.utility_spread ?? (topScore - bottomScore);

  // Data formatted for chart (reversed for top-down display in horizontal bar)
  const chartData = [...rankings].reverse().map((r) => ({
    name: r.attribute.length > 25 ? `${r.attribute.slice(0, 25)}...` : r.attribute,
    fullName: r.attribute,
    score: r.score,
    tier: r.tier,
    rank: r.rank,
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            PHƯƠNG PHÁP BEST-WORST SCALING (MAXDIFF)
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
            Thang Đo Tiện Ích Tương Đối: Xếp Hạng Thuộc Tính & Thông Điệp Bán Hàng
          </h3>
          <p className="text-xs text-slate-500">
            Công thức chuẩn hóa MaxDiff Score = (Best - Worst) / Tần suất xuất hiện × 100. Điểm &gt; 0 biểu thị lực kích hoạt thực tế.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold">
            Biên độ phân hóa: <strong className="text-slate-900">{spread.toFixed(1)} pts</strong>
          </span>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            🥇 Thuộc tính Dẫn đầu (Top Claim)
          </span>
          <h4 className="font-serif text-sm font-bold text-slate-900 mt-1 line-clamp-1">{topAttr}</h4>
          <p className="text-xs text-emerald-700 font-mono font-bold mt-1">Score: {topScore > 0 ? `+${topScore}` : topScore} điểm</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            ⚡ Độ Phân Hóa Tiện Ích (Spread)
          </span>
          <h4 className="font-serif text-sm font-bold text-slate-900 mt-1">
            Loại bỏ đánh giá ảo 5 sao
          </h4>
          <p className="text-xs text-indigo-700 font-mono font-bold mt-1">Khoảng chênh lệch: {spread.toFixed(1)} điểm</p>
        </div>

        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
            ⚠️ Thuộc tính Thờ ơ (Low Utility)
          </span>
          <h4 className="font-serif text-sm font-bold text-slate-900 mt-1 line-clamp-1">{bottomAttr}</h4>
          <p className="text-xs text-rose-700 font-mono font-bold mt-1">Score: {bottomScore > 0 ? `+${bottomScore}` : bottomScore} điểm</p>
        </div>
      </div>

      {/* Horizontal Diverging Bar Chart */}
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>← Kém hấp dẫn (Score &lt; 0)</span>
          <span className="font-semibold text-slate-700">Trục 0 Điểm Trung Tính</span>
          <span>Ưu tiên cao (Score &gt; 0) →</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" domain={[-50, 60]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 500 }}
                width={160}
              />
              <Tooltip
                formatter={(val: any) => [`${Number(val) > 0 ? `+${val}` : val} điểm`, 'MaxDiff Utility Score']}
                labelFormatter={(lbl, items) => {
                  const item = items?.[0]?.payload;
                  return item?.fullName || lbl;
                }}
              />
              <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} strokeDasharray="2 2" />
              <Bar dataKey="score" radius={[4, 4, 4, 4]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score >= 20 ? '#059669' : entry.score >= 0 ? '#0284c7' : entry.score >= -15 ? '#f59e0b' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Ranking Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 text-center">Hạng</th>
              <th className="py-3 px-4">Thuộc tính / Thông điệp kiểm định</th>
              <th className="py-3 px-4 text-center">MaxDiff Score</th>
              <th className="py-3 px-4 text-center">Số lần chọn Best</th>
              <th className="py-3 px-4 text-center">Số lần chọn Worst</th>
              <th className="py-3 px-4">Phân tầng chiến lược</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rankings.map((r) => (
              <tr key={r.rank} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 text-center font-bold text-slate-700">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    r.rank === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {r.rank}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-900">{r.attribute}</td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span className={r.score >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                    {r.score > 0 ? `+${r.score}` : r.score}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-mono text-emerald-600 font-semibold">{r.best_count}</td>
                <td className="py-3 px-4 text-center font-mono text-rose-500 font-semibold">{r.worst_count}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    r.score >= 25
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : r.score >= 5
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : r.score >= -15
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                    {r.tier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
