'use client';

import React from 'react';

interface MonadicScorecardProps {
  modelSpecific?: {
    concept_a?: {
      title: string;
      sample_size: number;
      top2box: number;
      uniqueness: number;
      relevance: number;
      value_ratio: number;
      description?: string;
      price?: string;
    };
    concept_b?: {
      title: string;
      sample_size: number;
      top2box: number;
      uniqueness: number;
      relevance: number;
      value_ratio: number;
      description?: string;
      price?: string;
    };
    lift_percentage?: number;
    winner?: string;
    winning_title?: string;
    comparisons?: Array<{
      metric: string;
      score_a: string;
      score_b: string;
      diff: string;
      winner: string;
    }>;
  };
}

export default function MonadicScorecard({ modelSpecific }: MonadicScorecardProps) {
  const winner = modelSpecific?.winner || 'A';
  const a = modelSpecific?.concept_a || {
    title: 'Concept A (Phương án 1)',
    sample_size: 500,
    top2box: 74.2,
    uniqueness: 4.2,
    relevance: 4.1,
    value_ratio: 78.5,
    price: '35.000đ',
  };
  const b = modelSpecific?.concept_b || {
    title: 'Concept B (Phương án 2)',
    sample_size: 500,
    top2box: 58.4,
    uniqueness: 3.5,
    relevance: 3.7,
    value_ratio: 62.0,
    price: '39.000đ',
  };
  const liftPct = modelSpecific?.lift_percentage ?? 27.1;

  const comparisons = modelSpecific?.comparisons || [
    { metric: 'Ý định mua thử (Top-2-Box Intent)', score_a: `${a.top2box}%`, score_b: `${b.top2box}%`, diff: `+${Math.abs(a.top2box - b.top2box).toFixed(1)}%`, winner: 'A' },
    { metric: 'Mức độ độc đáo mới lạ (Uniqueness)', score_a: `${a.uniqueness}/5`, score_b: `${b.uniqueness}/5`, diff: `+${(a.uniqueness - b.uniqueness).toFixed(2)}`, winner: 'A' },
    { metric: 'Mức độ cấp thiết liên quan (Relevance)', score_a: `${a.relevance}/5`, score_b: `${b.relevance}/5`, diff: `+${(a.relevance - b.relevance).toFixed(2)}`, winner: 'A' },
    { metric: 'Cảm nhận giá trị đáng tiền (Value for Money)', score_a: `${a.value_ratio}%`, score_b: `${b.value_ratio}%`, diff: `+${(a.value_ratio - b.value_ratio).toFixed(1)}%`, winner: 'A' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            PHƯƠNG PHÁP MONADIC TESTING (SPLIT-SAMPLE)
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
            Đối Chiếu Độc Lập Hai Nhánh Mẫu: Concept A vs Concept B
          </h3>
          <p className="text-xs text-slate-500">
            Khách hàng được chia đôi độc lập (N_A = {a.sample_size} | N_B = {b.sample_size}), đánh giá khách quan không bị nhiễu do so sánh trực diện
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold text-center shrink-0">
          🏆 Ý TƯỞNG CHIẾN THẮNG: CONCEPT {winner} ({winner === 'A' ? a.title : b.title})
        </div>
      </div>

      {/* Lift % Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Chênh lệch tăng trưởng (Lift %)</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono">p &lt; 0.05 Sig.</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Concept {winner} tạo ra lực kéo mua sắm vượt trội {liftPct > 0 ? `+${liftPct}%` : `${liftPct}%`} so với concept còn lại trong điều kiện khảo sát độc lập.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-3xl font-serif font-black text-amber-400">{liftPct > 0 ? `+${liftPct}%` : `${liftPct}%`}</span>
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Tăng trưởng ý định mua</span>
        </div>
      </div>

      {/* Two Concept Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card A */}
        <div className={`p-5 rounded-2xl border transition-all ${
          winner === 'A'
            ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-400/20 shadow-xs'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
              Nhánh Mẫu A (N = {a.sample_size})
            </span>
            {winner === 'A' && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                ⭐ Chiến thắng
              </span>
            )}
          </div>
          <h4 className="font-serif text-base font-bold text-slate-900">{a.title}</h4>
          {a.price && <p className="text-xs font-semibold text-amber-800 mt-0.5">Giá khảo sát: {a.price}</p>}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-200/70">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Top-2-Box</span>
              <span className="text-lg font-bold text-slate-900">{a.top2box}%</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Độc đáo</span>
              <span className="text-lg font-bold text-slate-900">{a.uniqueness}/5</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Đáng giá</span>
              <span className="text-lg font-bold text-slate-900">{a.value_ratio}%</span>
            </div>
          </div>
        </div>

        {/* Card B */}
        <div className={`p-5 rounded-2xl border transition-all ${
          winner === 'B'
            ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-400/20 shadow-xs'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
              Nhánh Mẫu B (N = {b.sample_size})
            </span>
            {winner === 'B' && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                ⭐ Chiến thắng
              </span>
            )}
          </div>
          <h4 className="font-serif text-base font-bold text-slate-900">{b.title}</h4>
          {b.price && <p className="text-xs font-semibold text-amber-800 mt-0.5">Giá khảo sát: {b.price}</p>}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-200/70">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Top-2-Box</span>
              <span className="text-lg font-bold text-slate-900">{b.top2box}%</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Độc đáo</span>
              <span className="text-lg font-bold text-slate-900">{b.uniqueness}/5</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Đáng giá</span>
              <span className="text-lg font-bold text-slate-900">{b.value_ratio}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparisons Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Tiêu chí đo lường độc lập</th>
              <th className="py-3 px-4 text-center">Concept A</th>
              <th className="py-3 px-4 text-center">Concept B</th>
              <th className="py-3 px-4 text-center">Chênh lệch</th>
              <th className="py-3 px-4 text-center">Ưu thế</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisons.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-slate-900">{row.metric}</td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">{row.score_a}</td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">{row.score_b}</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-indigo-700">{row.diff}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    row.winner === 'A' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Concept {row.winner}
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
