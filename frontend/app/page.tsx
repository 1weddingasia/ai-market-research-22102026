'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [lookupId, setLookupId] = useState('');
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const PACKAGES = [
    {
      name: 'Gói Thăm Dò Nhanh',
      sample: '500 mẫu',
      sampleSize: 500,
      price: '200.000',
      moe: '±4.38%',
      desc: 'Phù hợp kiểm tra nhanh concept sơ khai, đánh giá mức độ đón nhận ban đầu trước khi làm mẫu thử.',
      badge: 'TIẾT KIỆM',
      recommended: false,
    },
    {
      name: 'Gói Chuẩn Học Thuật',
      sample: '1.000 mẫu',
      sampleSize: 1000,
      price: '300.000',
      moe: '±3.10%',
      desc: 'Quy mô chuẩn vàng trong nghiên cứu thị trường quốc tế. Đảm bảo độ tin cậy 95% cho các quyết định đầu tư.',
      badge: 'KHUYÊN DÙNG PHỔ BIẾN',
      recommended: true,
    },
    {
      name: 'Gói Phân Tích Chuyên Sâu',
      sample: '2.000 mẫu',
      sampleSize: 2000,
      price: '500.000',
      moe: '±2.19%',
      desc: 'Phân tích đa chiều theo từng nhóm tuổi và tỉnh thành cụ thể. Độ lệch chuẩn cực thấp cho sản phẩm trọng điểm.',
      badge: 'DOANH NGHIỆP',
      recommended: false,
    },
    {
      name: 'Gói Toàn Quốc Quy Mô Lớn',
      sample: '3.000 mẫu',
      sampleSize: 3000,
      price: '700.000',
      moe: '±1.79%',
      desc: 'Bao phủ toàn diện 6 vùng kinh tế trọng điểm. Độ chính xác tương đương khảo sát thực địa diện rộng của Nielsen/Kantar.',
      badge: 'DOANH NGHIỆP LỚN',
      recommended: false,
    },
  ];

  const METHODS = [
    {
      id: 'nielsen_bases',
      code: 'NIELSEN BASES',
      title: 'Kiểm định Ý tưởng & Tiềm năng Sản phẩm',
      desc: 'Đo lường độ độc đáo, độ thiết yếu và ý định mua sắm (Top-2-Box), xác định nguy cơ thất bại trước khi sản xuất.',
    },
    {
      id: 'van_westendorp',
      code: 'VAN WESTENDORP',
      title: 'Đo Độ Nhạy Cảm & Định Giá Tối Ưu (PSM)',
      desc: 'Tìm ra Điểm giá Tối ưu (OPP), Điểm giá Cân bằng (IPP) và Khoảng giá chấp nhận được của thị trường.',
    },
    {
      id: 'ab_testing',
      code: 'KANTAR LINK',
      title: 'Thử nghiệm Đấu đầu A/B Bao bì & Thông điệp',
      desc: 'So sánh trực quan 2 phương án thiết kế hoặc USP để chọn ra mẫu có win-rate và lực kích hoạt mua sắm cao nhất.',
    },
    {
      id: 'ua_study',
      code: 'U&A STUDY',
      title: 'Thói quen, Thái độ & Khoảng trống Ngành hàng',
      desc: 'Giải mã nỗi đau người tiêu dùng chưa được giải quyết tốt (Unmet Needs) để tìm ra khoảng trống cạnh tranh.',
    },
    {
      id: 'deal_elasticity',
      code: 'DEAL ELASTICITY',
      title: 'Đo Độ Co Giãn Khuyến Mãi & Tỷ Lệ Đổi Thương Hiệu',
      desc: 'Dự báo tỷ lệ khách hàng từ bỏ đối thủ để chuyển sang dùng thử khi tung ra các gói ưu đãi / combo.',
    },
  ];

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = lookupId.trim().toUpperCase();
    if (!cleanId) {
      setLookupError('Vui lòng nhập mã khảo sát (Ví dụ: PANEL131336)');
      return;
    }
    setLookupError('');
    setShowLookupModal(false);
    router.push(`/results/${cleanId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* ── Top Bar / Header ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo có Link quay lại trang chủ */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 group-hover:bg-amber-600 transition-colors flex items-center justify-center shadow-xs">
              <span className="text-amber-400 group-hover:text-white font-serif font-black text-sm transition-colors">AI</span>
            </div>
            <div>
              <span className="font-serif font-bold text-slate-900 group-hover:text-amber-700 text-base tracking-tight block leading-tight transition-colors">
                AI Market Research
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Nền tảng Giả lập Khảo sát Xã hội học Việt Nam
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#phuong-phap" className="hover:text-slate-900 transition-colors">Phương pháp</a>
            <a href="#quy-trinh" className="hover:text-slate-900 transition-colors">Quy trình 3 bước</a>
            <a href="#bang-gia" className="hover:text-slate-900 transition-colors">Bảng giá</a>
            <a href="#tieu-chuan-khoa-hoc" className="hover:text-slate-900 transition-colors">Tiêu chuẩn Khoa học</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowLookupModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 py-2.5 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Tra cứu báo cáo</span>
            </button>

            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all"
            >
              <span>Bắt đầu khảo sát</span>
              <span className="text-amber-400">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Lookup Modal ── */}
      {showLookupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                  🔍
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Tra cứu báo cáo khảo sát
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLookupModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Nhập mã định danh khảo sát nhận được sau khi tạo đơn (Ví dụ: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">PANEL131336</code>) để mở trực tiếp kết quả.
            </p>

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  placeholder="VD: PANEL131336"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-mono text-slate-900 text-sm uppercase tracking-wider focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  autoFocus
                />
                {lookupError && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">{lookupError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLookupModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Mở báo cáo →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <span className="text-amber-500">✦</span>
            <span>KHO DỮ LIỆU 1.000.000 HỒ SƠ NGƯỜI TIÊU DÙNG VIỆT NAM THẬT</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15]">
            Khảo sát thị trường <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900">
              1.000 người tiêu dùng
            </span> trong 60 giây
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Mô phỏng hành vi tiêu dùng bằng AI Agents độc lập trên kho dữ liệu phân tầng dân số học Việt Nam (DuckDB + Cloudflare R2). Chuẩn xác theo Nielsen BASES & Van Westendorp, chi phí chỉ bằng 1/20 phương pháp truyền thống.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/wizard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-3.5 px-8 rounded-xl shadow-md transition-all"
            >
              <span>Khởi tạo khảo sát ngay</span>
              <span>→</span>
            </Link>
            <a
              href="#bang-gia"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm py-3.5 px-6 rounded-xl border border-slate-300 shadow-xs transition-all"
            >
              Xem bảng giá minh bạch
            </a>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-200/80 text-left">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Quy mô hồ sơ</span>
              <div className="text-2xl font-serif font-black text-slate-900 mt-1">1.000.000+</div>
              <span className="text-[11px] text-slate-500">Phân tầng 6 vùng kinh tế</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Thời gian xử lý</span>
              <div className="text-2xl font-serif font-black text-emerald-700 mt-1">&lt; 60 giây</div>
              <span className="text-[11px] text-slate-500">Chạy song song 50 batch</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Độ tin cậy</span>
              <div className="text-2xl font-serif font-black text-amber-700 mt-1">95% (MoE ±3.1%)</div>
              <span className="text-[11px] text-slate-500">Chuẩn Cochran & ESOMAR</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Thanh toán tự động</span>
              <div className="text-2xl font-serif font-black text-slate-900 mt-1">VietQR + SePay</div>
              <span className="text-[11px] text-slate-500">Kích hoạt AI tức thì</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-Step Process ── */}
      <section id="quy-trinh" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            QUY TRÌNH TINH GỌN
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-3">
            Khảo sát thực chiến chỉ với 3 bước
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Không cần chờ đợi hàng tuần, không phát sinh chi phí phỏng vấn viên.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-serif font-bold text-base flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">Chọn gói & Cấu hình mẫu</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chọn 1 trong 5 phương pháp nghiên cứu chuẩn quốc tế. Tùy chọn khu vực địa lý (TP.HCM, Hà Nội, Toàn quốc) và độ tuổi mục tiêu.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-serif font-bold text-base flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">Quét mã VietQR thanh toán</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quét mã VietQR bằng app ngân hàng bất kỳ. Cổng thanh toán SePay tự động ghi nhận chuyển khoản và kích hoạt AI ngay lập tức.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-serif font-bold text-base flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">Nhận Dashboard & Tải PDF A4</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Theo dõi trực tiếp terminal SSE xử lý từng hồ sơ. Nhận báo cáo chiến lược điều hành 4 tab và tải file PDF in ấn chuẩn bìa đen vàng.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5 Frameworks Section ── */}
      <section id="phuong-phap" className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
              CHUẨN PHƯƠNG PHÁP LUẬN QUỐC TẾ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
              5 Mô hình nghiên cứu chuyên sâu
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
              Được thiết kế dựa trên các bộ khung phương pháp luận được các tập đoàn FMCG toàn cầu tin dùng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {METHODS.map((m) => (
              <div key={m.id} className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl hover:border-amber-400/50 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 block mb-2">
                    {m.code}
                  </span>
                  <h3 className="font-serif text-base font-bold text-white mb-2">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Báo cáo chuẩn hóa</span>
                  <Link
                    href={`/wizard?model=${m.id}`}
                    className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Khởi tạo gói này</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Table ── */}
      <section id="bang-gia" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            BẢNG GIÁ MINH BẠCH
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-3">
            Chi phí khảo sát trọn gói
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Không phí ẩn, không duy trì hàng tháng. Chỉ trả tiền theo số lượng mẫu khảo sát thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                pkg.recommended
                  ? 'bg-white border-2 border-amber-400 shadow-lg ring-4 ring-amber-400/10'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {pkg.sample}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pkg.recommended ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {pkg.badge}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
                  {pkg.name}
                </h3>
                <div className="text-2xl font-serif font-black text-slate-900 my-3">
                  {pkg.price} <span className="text-xs font-sans font-normal text-slate-500">đ / khảo sát</span>
                </div>
                <div className="text-xs text-amber-700 font-semibold mb-4">
                  Sai số biên: {pkg.moe}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {pkg.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/wizard?sample=${pkg.sampleSize}`}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold block text-center transition-colors ${
                    pkg.recommended
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Chọn gói này →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tiêu chuẩn Khoa học & Cơ sở Thống kê (Academic Methodology Section) ── */}
      <section id="tieu-chuan-khoa-hoc" className="py-16 px-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  PHƯƠNG PHÁP LUẬN HỌC THUẬT QUỐC TẾ
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  Cơ sở Toán học của Sai số biên & Độ tin cậy 95%
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span>Chuẩn Cochran (1977)</span>
                <span>•</span>
                <span>ESOMAR / AAPOR</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600 leading-relaxed">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Công thức tính Sai số biên (Margin of Error - MoE)
                </h4>
                <p>
                  Sai số biên được tính toán nghiêm ngặt theo công thức chọn mẫu xác suất của nhà thống kê <strong>William G. Cochran (1977)</strong> cho tổng thể dân số lớn ($N &gt; 100.000$ người):
                </p>
                <div className="bg-slate-900 text-amber-300 p-4 rounded-xl font-mono text-center text-sm shadow-inner">
                  MoE = Z × √[ p × (1 - p) / n ]
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  <li><strong>Z = 1.96:</strong> Hệ số độ tin cậy tương ứng với ngưỡng <strong>95%</strong> (Confidence Level chuẩn quốc tế).</li>
                  <li><strong>p = 0.5:</strong> Giả định phương sai tối đa (50/50), bảo đảm sai số tính ra là mức an toàn và khắt khe nhất.</li>
                  <li><strong>n:</strong> Quy mô số lượng hồ sơ được giả lập ngẫu nhiên có phân tầng.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Đối sánh thực nghiệm theo từng cỡ mẫu
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-200 rounded-lg">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="p-2.5">Cỡ mẫu (n)</th>
                        <th className="p-2.5">Sai số biên (MoE)</th>
                        <th className="p-2.5">Mục đích sử dụng thực tế</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-bold font-mono">500 mẫu</td>
                        <td className="p-2.5 font-bold text-amber-700">±4.38%</td>
                        <td className="p-2.5">Thăm dò nhanh concept, kiểm tra ban đầu</td>
                      </tr>
                      <tr className="bg-amber-50/40">
                        <td className="p-2.5 font-bold font-mono text-slate-900">1.000 mẫu</td>
                        <td className="p-2.5 font-bold text-emerald-700">±3.10%</td>
                        <td className="p-2.5 font-semibold text-slate-900">Chuẩn vàng quốc tế (Nielsen/Kantar)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold font-mono">2.000 mẫu</td>
                        <td className="p-2.5 font-bold text-amber-700">±2.19%</td>
                        <td className="p-2.5">Phân tích chéo theo nhóm tuổi & tỉnh thành</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold font-mono">3.000 mẫu</td>
                        <td className="p-2.5 font-bold text-amber-700">±1.79%</td>
                        <td className="p-2.5">Đại diện toàn diện 6 vùng kinh tế Việt Nam</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  * Dữ liệu personas được phân tầng (Stratified Sampling) theo cơ cấu nhân khẩu học Việt Nam: Giới tính (49.8% Nam / 50.2% Nữ), Độ tuổi 18 - 65, và 6 vùng kinh tế theo Tổng cục Thống kê (GSO).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-amber-600 transition-colors flex items-center justify-center">
              <span className="text-amber-400 group-hover:text-white font-serif font-bold text-sm transition-colors">AI</span>
            </div>
            <div>
              <span className="text-white font-bold block group-hover:text-amber-300 transition-colors">AI Market Research Platform</span>
              <span>insight.1booking.asia · Hệ thống phân tích ý kiến người tiêu dùng Việt Nam</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <span>Bảo mật dữ liệu tuyệt đối</span>
            <span>·</span>
            <span>Cloudflare R2 Storage</span>
            <span>·</span>
            <span>VietQR Pro Certified</span>
          </div>

          <div>
            © 2026 AI Market Research. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
