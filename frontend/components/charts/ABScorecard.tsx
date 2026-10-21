'use client';

import React from 'react';

interface ABScorecardProps {
  modelSpecific?: {
    winner?: string;
    win_rate_a?: number;
    win_rate_b?: number;
    dimensions?: Array<{
      criteria: string;
      score_a: number;
      score_b: number;
      diff: string;
      winner: string;
    }>;
    key_verdict?: string;
  };
}

export default function ABScorecard({ modelSpecific }: ABScorecardProps) {
  const winner = modelSpecific?.winner || 'A';
  const rateA = modelSpecific?.win_rate_a ?? 64.2;
  const rateB = modelSpecific?.win_rate_b ?? 35.8;

  const dimensions = modelSpecific?.dimensions || [
    { criteria: 'Mức độ bắt mắt trên kệ hàng (Shelf Standout)', score_a: 84, score_b: 62, diff: '+22%', winner: 'A' },
    { criteria: 'Cảm giác cao cấp & Sang trọng (Premium Feel)', score_a: 78, score_b: 59, diff: '+19%', winner: 'A' },
    { criteria: 'Độ rõ ràng của thông điệp (Clarity of Message)', score_a: 71, score_b: 76, diff: '+5% (B)', winner: 'B' },
    { criteria: 'Kích thích ý định dùng thử (Purchase Trigger)', score_a: 82, score_b: 54, diff: '+28%', winner: 'A' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            PHƯƠNG PHÁP KANTAR LINK A/B
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
            Bảng Đấu Đầu Trực Tiếp Option A vs Option B (A/B Scorecard)
          </h3>
          <p className="text-xs text-slate-500">
            Kiểm định độ áp đảo về cảm nhận thị giác, giá trị cảm nhận và lực kích hoạt mua sắm
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold text-center shrink-0">
          🏆 Phương án chiến thắng: CONCEPT {winner}
        </div>
      </div>

      {/* Head-to-Head Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Concept A Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          winner === 'A'
            ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-400/20'
            : 'bg-slate-50 border-slate-200 opacity-80'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-serif text-lg font-bold text-slate-900">
              CONCEPT A {winner === 'A' && '👑'}
            </span>
            <span className="text-2xl font-serif font-black text-slate-900">
              {rateA.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${rateA}%` }} />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {winner === 'A'
              ? 'Chiến thắng thuyết phục ở 3/4 chỉ số trọng yếu. Được người tiêu dùng đánh giá cao về tính nhận diện hiện đại.'
              : 'Tỷ lệ bình chọn thấp hơn. Cần tối ưu thêm về mặt thị giác.'}
          </p>
        </div>

        {/* Concept B Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          winner === 'B'
            ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-400/20'
            : 'bg-slate-50 border-slate-200 opacity-80'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-serif text-lg font-bold text-slate-900">
              CONCEPT B {winner === 'B' && '👑'}
            </span>
            <span className="text-2xl font-serif font-black text-slate-900">
              {rateB.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-amber-600 h-full rounded-full" style={{ width: `${rateB}%` }} />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {winner === 'B'
              ? 'Chiến thắng thuyết phục ở các tiêu chí cốt lõi. Khách hàng cảm thấy an tâm và tin cậy hơn.'
              : 'Tỷ lệ ủng hộ thấp hơn. Chỉ có ưu thế nhỏ về độ rõ ràng thông tin sản phẩm.'}
          </p>
        </div>
      </div>

      {/* Dimensional Breakdown Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-3">Tiêu chí đánh giá</th>
              <th className="p-3 text-center">Concept A</th>
              <th className="p-3 text-center">Concept B</th>
              <th className="p-3 text-right">Chênh lệch & Thắng thế</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {dimensions.map((dim, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3 font-medium text-slate-900">{dim.criteria}</td>
                <td className="p-3 text-center font-mono font-bold text-slate-900">{dim.score_a}đ</td>
                <td className="p-3 text-center font-mono font-bold text-slate-900">{dim.score_b}đ</td>
                <td className="p-3 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                    dim.winner === 'A' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {dim.diff}
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
