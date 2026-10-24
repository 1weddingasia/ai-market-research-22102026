'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HeroSlider from '@/components/HeroSlider';
import Logo from '@/components/Logo';

export default function HomePage() {
  const router = useRouter();
  const [lookupId, setLookupId] = useState('');
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      desc: 'Bao phủ toàn diện 6 vùng kinh tế trọng điểm. Quy mô mẫu lớn giúp loại bỏ nhiễu và định vị xu hướng hành vi với độ chuẩn xác thống kê cao nhất.',
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
    {
      id: 'monadic',
      code: 'MONADIC TESTING',
      title: 'Thử nghiệm Ý tưởng Độc lập (Split-Sample)',
      desc: 'Đánh giá khách quan 2 concept trên 2 nhánh mẫu riêng biệt, đo lường chính xác tỷ lệ mua thử và Lift %.',
    },
    {
      id: 'maxdiff',
      code: 'MAXDIFF SCALING',
      title: 'Xếp hạng Thuộc tính & Thông điệp Bán hàng',
      desc: 'Phương pháp Best-Worst Scaling xếp hạng khoa học 6-10 thông điệp, loại bỏ hiện tượng đánh giá ảo 5 sao.',
    },
    {
      id: 'kano',
      code: 'KANO MODEL R&D',
      title: 'Phân loại Tính năng & Lộ trình Sản phẩm',
      desc: 'Phân loại tính năng Bắt buộc (Must-be) vs Đột phá (Attractive) giúp đội ngũ kỹ thuật tối ưu chi phí phát triển.',
    },
    {
      id: 'brand_map',
      code: 'PERCEPTUAL MAP',
      title: 'Bản đồ Định vị & Khoảng trống Thị trường',
      desc: 'Định vị vị thế thương hiệu so với đối thủ cạnh tranh trên không gian 2D để tìm kiếm đại dương xanh (White-space).',
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
      {/* ── Top Bar / Header Tinh Gọn & Sang Trọng ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo INSIGHT AI */}
          <Logo href="/" />

          {/* Navigation Tinh Gọn (4 mục cốt lõi, không rối mắt) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-slate-600 shrink-0">
            <a href="#phuong-phap" className="hover:text-slate-900 transition-colors">
              Mô hình nghiên cứu
            </a>
            <Link
              href="/results/DEMO-NIELSEN-BASES"
              className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-900 font-bold transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Báo cáo mẫu</span>
              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">Demo</span>
            </Link>
            <a href="#bang-gia" className="hover:text-slate-900 transition-colors">
              Bảng giá
            </a>
            <Link
              href="/minh-bach-khoa-hoc"
              className="hover:text-slate-900 transition-colors"
            >
              Minh bạch khoa học
            </Link>
          </nav>

          {/* Actions bên phải */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/tra-cuu"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Tra cứu</span>
            </Link>

            <Link
              href="/wizard"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 sm:py-2.5 px-3.5 sm:px-4.5 rounded-xl shadow-xs transition-all"
            >
              <span>Khởi tạo khảo sát</span>
              <span className="text-amber-400 font-bold">→</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer Tinh Gọn */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <Link
              href="/wizard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              <span>🚀 Khởi tạo khảo sát mới ngay</span>
              <span className="text-amber-400">→</span>
            </Link>

            <Link
              href="/results/DEMO-NIELSEN-BASES"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200"
            >
              <span className="flex items-center gap-2">
                <span>📊</span>
                <span>Xem Báo Cáo Mẫu Thực Tế (Live Demo)</span>
              </span>
              <span>→</span>
            </Link>

            <Link
              href="/tra-cuu"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200"
            >
              <span className="flex items-center gap-2">
                <span>🔍</span>
                <span>Tra cứu báo cáo khảo sát</span>
              </span>
              <span>→</span>
            </Link>

            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 pt-1 border-t border-slate-100">
              <a
                href="#phuong-phap"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-center font-semibold"
              >
                Mô hình nghiên cứu
              </a>
              <a
                href="#bang-gia"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-center font-semibold"
              >
                Bảng giá trọn gói
              </a>
              <Link
                href="/minh-bach-khoa-hoc"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-center font-semibold"
              >
                Minh bạch khoa học
              </Link>
              <Link
                href="/bach-thu"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-center font-semibold"
              >
                Bạch thư C-Level
              </Link>
            </div>
          </div>
        )}
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

      {/* ── Dynamic 3-Slide Hero Section ── */}
      <HeroSlider />

      {/* ── 3-Step Process ── */}
      <section id="quy-trinh" className="py-12 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            QUY TRÌNH TINH GỌN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
            Khảo sát thực chiến chỉ với 3 bước
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Không cần chờ đợi hàng tuần, không phát sinh chi phí phỏng vấn viên.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-serif font-bold text-base flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 mb-2">Chọn gói & Cấu hình mẫu</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chọn 1 trong 9 phương pháp nghiên cứu chuẩn quốc tế. Tùy chọn khu vực địa lý (TP.HCM, Hà Nội, Toàn quốc) và độ tuổi mục tiêu.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-serif font-bold text-base flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 mb-2">Quét mã VietQR thanh toán</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quét mã VietQR bằng ứng dụng ngân hàng bất kỳ. Hệ thống tự động ghi nhận chuyển khoản và kích hoạt khảo sát ngay lập tức.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-serif font-bold text-base flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 mb-2">Nhận Dashboard & Tải PDF A4</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Theo dõi luồng phân tích trực tiếp theo thời gian thực (Live Stream). Nhận báo cáo chiến lược điều hành 4 tab và xuất file báo cáo chiến lược chuẩn Executive Summary (A4) sẵn sàng thuyết trình.
            </p>
          </div>
        </div>
      </section>

      {/* ── 9 Frameworks Section ── */}
      <section id="phuong-phap" className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
              CHUẨN PHƯƠNG PHÁP LUẬN QUỐC TẾ
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-3">
              9 Mô hình nghiên cứu chuyên sâu
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
              Được thiết kế dựa trên 9 bộ khung phương pháp luận được các tập đoàn FMCG & tư vấn chiến lược toàn cầu tin dùng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {METHODS.map((m) => {
              const demoUrl = {
                nielsen_bases: '/results/DEMO-NIELSEN-BASES',
                van_westendorp: '/results/DEMO-VAN-WESTENDORP',
                ab_testing: '/results/DEMO-AB-TESTING',
                monadic: '/results/DEMO-MONADIC',
                maxdiff: '/results/DEMO-MAXDIFF',
                kano: '/results/DEMO-KANO',
                brand_map: '/results/DEMO-BRAND-MAP',
                ua_study: '/results/DEMO-UA-STUDY',
                deal_elasticity: '/results/DEMO-DEAL-ELASTICITY',
              }[m.id] || '/results/DEMO-NIELSEN-BASES';

              return (
                <div key={m.id} className="bg-slate-800/80 border border-slate-700 p-5 sm:p-6 rounded-2xl hover:border-amber-400/50 transition-all flex flex-col justify-between group">
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
                  <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col gap-2.5 text-xs">
                    <Link
                      href={demoUrl}
                      target="_blank"
                      className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-all group/btn"
                      title="Mở xem báo cáo mẫu thực tế trong tab mới (gồm 4 Tab tương tác & Bản in 6 Trang A4)"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <span>📊</span>
                        <span>Xem Báo Cáo Mẫu (Live Demo)</span>
                      </span>
                      <span className="text-[11px] font-mono text-amber-400 group-hover/btn:translate-x-0.5 transition-transform">Mở ↗</span>
                    </Link>

                    <div className="flex items-center justify-between pt-0.5">
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing Table ── */}
      <section id="bang-gia" className="py-12 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            BẢNG GIÁ MINH BẠCH
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
            Chi phí khảo sát trọn gói
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Không phí ẩn, không duy trì hàng tháng. Chỉ trả tiền theo số lượng mẫu khảo sát thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {PACKAGES.map((pkg, idx) => (
            <div
              key={idx}
              className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                pkg.recommended
                  ? 'bg-white border-2 border-amber-400 shadow-lg ring-4 ring-amber-400/10'
                  : 'bg-white border-slate-200 shadow-xs'
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
                  Sai số thống kê trên cỡ mẫu (MoE): {pkg.moe} (Độ tin cậy 95%)
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
      <section id="tieu-chuan-khoa-hoc" className="py-12 sm:py-16 px-4 sm:px-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-300 p-5 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-5 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  PHƯƠNG PHÁP LUẬN HỌC THUẬT QUỐC TẾ
                </span>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-slate-900 mt-2">
                  Cơ sở Toán học của Sai số biên & Độ tin cậy 95%
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span>Chuẩn Cochran (1977)</span>
                <span>•</span>
                <span>ESOMAR / AAPOR</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-xs text-slate-600 leading-relaxed">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Công thức tính Sai số biên (Margin of Error - MoE)
                </h4>
                <p>
                  Sai số biên được tính toán nghiêm ngặt theo công thức chọn mẫu xác suất của nhà thống kê <strong>William G. Cochran (1977)</strong> cho tổng thể dân số lớn ($N &gt; 100.000$ người):
                </p>
                <div className="bg-slate-900 text-amber-300 p-3.5 sm:p-4 rounded-xl font-mono text-center text-xs sm:text-sm shadow-inner">
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
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full text-left border-collapse border border-slate-200 rounded-lg text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="p-2 sm:p-2.5">Cỡ mẫu (n)</th>
                        <th className="p-2 sm:p-2.5">Sai số biên</th>
                        <th className="p-2 sm:p-2.5">Mục đích sử dụng thực tế</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold font-mono">500 mẫu</td>
                        <td className="p-2 sm:p-2.5 font-bold text-amber-700">±4.38%</td>
                        <td className="p-2 sm:p-2.5">Thăm dò nhanh concept ban đầu</td>
                      </tr>
                      <tr className="bg-amber-50/40">
                        <td className="p-2 sm:p-2.5 font-bold font-mono text-slate-900">1.000 mẫu</td>
                        <td className="p-2 sm:p-2.5 font-bold text-emerald-700">±3.10%</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-slate-900">Chuẩn vàng quốc tế (Nielsen/Kantar)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold font-mono">2.000 mẫu</td>
                        <td className="p-2 sm:p-2.5 font-bold text-amber-700">±2.19%</td>
                        <td className="p-2 sm:p-2.5">Phân tích chéo nhóm tuổi & tỉnh thành</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold font-mono">3.000 mẫu</td>
                        <td className="p-2 sm:p-2.5 font-bold text-amber-700">±1.79%</td>
                        <td className="p-2 sm:p-2.5">Đại diện toàn diện 6 vùng kinh tế</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  * Khung mẫu phân tầng nhân khẩu học được chuẩn hóa và đối chuẩn (benchmark) theo Niên giám Thống kê của Tổng cục Thống kê Việt Nam (GSO): Giới tính (49.8% Nam / 50.2% Nữ), Độ tuổi 18 - 65, và 6 vùng kinh tế. Mô hình hành vi tiêu dùng được tổng hợp từ dữ liệu thói quen thương mại điện tử, mức chi tiêu khả dụng và văn hóa bán lẻ bản địa tại Việt Nam.
                </p>
              </div>
            </div>

            {/* Bạch thư Callout Box */}
            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-50/70 p-4 sm:p-5 rounded-xl border border-amber-300/80">
              <div className="space-y-1">
                <span className="inline-block text-[10px] font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded uppercase">
                  TÀI LIỆU TOÀN VĂN CHÍNH THỨC DÀNH CHO C-LEVEL & R&D
                </span>
                <h4 className="font-serif font-bold text-slate-900 text-sm sm:text-base">
                  Bạch Thư Phương Pháp Luận: Nền Tảng Nghiên Cứu Thị Trường Bằng Tác Tử AI Mô Phỏng
                </h4>
                <p className="text-xs text-slate-600 max-w-2xl">
                  Tìm hiểu chi tiết cơ sở toán học Cochran, độ tương quan 75%–85% theo chuẩn Stanford &amp; Harvard, cơ chế bảo mật theo Luật 91/2025/QH15 và cách loại bỏ 80% rủi ro dòng vốn trước khi sản xuất đại trà.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full sm:w-auto">
                <Link
                  href="/minh-bach-khoa-hoc"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl shadow-xs transition-all"
                >
                  <span>Minh Bạch Khoa Học &amp; Thống Kê</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/bach-thu"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl shadow-xs transition-all"
                >
                  <span>Đọc Bạch Thư</span>
                  <span className="text-amber-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section (Giải Tỏa Hoài Nghi) ── */}
      <section id="faq" className="py-12 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            GIẢI ĐÁP DOANH NGHIỆP
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
            Câu hỏi thường gặp của Nhà Sáng Lập & Giám Đốc
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Mọi thắc mắc về tính chuẩn xác, nguồn dữ liệu và giá trị thực tế của báo cáo.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs">
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
              <span className="text-amber-600 font-sans font-black shrink-0">01.</span>
              <span>Tại sao AI Synthetic Panel chuẩn xác và khách quan hơn việc tự hỏi ChatGPT thông thường?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-7 pt-1 sm:pt-0">
              Khi bạn tự hỏi ChatGPT với 1 câu prompt đơn lẻ, AI chỉ đưa ra một góc nhìn tổng quát mang tính chủ quan của một thực thể AI duy nhất. Ngược lại, hệ thống của chúng tôi vận hành một cụm <strong>1.000 AI Personas độc lập</strong>. Khung mẫu phân tầng nhân khẩu học được đối chuẩn theo Niên giám Thống kê (GSO) về cơ cấu vùng miền, độ tuổi, giới tính và thu nhập, kết hợp cùng mô hình hành vi mua sắm thương mại điện tử thực tế tại Việt Nam. Từng tác tử AI phân vai độc lập và đưa ra phản hồi đa chiều, sau đó thuật toán tổng hợp ma trận Top-2-Box, Van Westendorp PSM và độ lệch chuẩn để loại bỏ hoàn toàn thiên kiến, phản ánh khách quan phản ứng của thị trường.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs">
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
              <span className="text-amber-600 font-sans font-black shrink-0">02.</span>
              <span>Dữ liệu 1.000.000 chân dung người tiêu dùng tổng hợp (Synthetic Personas) được xây dựng thế nào và có an toàn pháp lý không?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-7 pt-1 sm:pt-0">
              Kho dữ liệu được xây dựng dưới dạng <strong>Chân dung người tiêu dùng tổng hợp (Synthetic Personas)</strong> vận hành theo 2 tầng khoa học: (1) <em>Tầng khung nhân khẩu học:</em> Chuẩn hóa và đối chuẩn (benchmark) theo Niên giám Thống kê Quốc gia (GSO) về tỷ lệ 6 vùng kinh tế trọng điểm, giới tính và ngũ phân vị thu nhập; (2) <em>Tầng hành vi & tâm lý:</em> Mô phỏng phản ứng mua sắm từ thói quen thương mại điện tử, chi tiêu khả dụng và văn hóa bán lẻ bản địa tại Việt Nam.
              <br className="mb-1" />
              <strong>Đặc biệt an toàn pháp lý:</strong> Hệ thống tuân thủ nghiêm ngặt nguyên tắc <em>Privacy-by-Design</em>, hoàn toàn không thu thập hay lưu trữ thông tin định danh cá nhân thật (PII-free) của bất kỳ công dân nào, đáp ứng 100% quy định của <em>Nghị định 13/2023/NĐ-CP</em> và <em>Luật Bảo vệ dữ liệu cá nhân</em>. Doanh nghiệp hoàn toàn an tâm khi sử dụng dữ liệu trong các báo cáo chiến lược.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs">
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
              <span className="text-amber-600 font-sans font-black shrink-0">03.</span>
              <span>Khi nào doanh nghiệp nên sử dụng nền tảng này?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-7 pt-1 sm:pt-0">
              Nền tảng phát huy hiệu quả cao nhất ở 4 giai đoạn quan trọng: (1) <strong>Kiểm định ý tưởng mới</strong> trước khi đầu tư khuôn mẫu hoặc nhập hàng số lượng lớn; (2) <strong>Tìm điểm giá tối ưu (OPP)</strong> để không bán quá rẻ làm mất biên lợi nhuận hoặc quá đắt làm tắc thanh khoản; (3) <strong>Thử nghiệm bao bì & thông điệp A/B</strong> trước khi chi ngân sách chạy quảng cáo; (4) <strong>Đo độ co giãn khuyến mãi</strong> để thiết kế combo quà tặng có tỷ lệ chốt đơn cao nhất.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs">
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
              <span className="text-amber-600 font-sans font-black shrink-0">04.</span>
              <span>Báo cáo có đủ tiêu chuẩn để trình Hội Đồng Quản Trị hoặc Nhà Đầu Tư không?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-7 pt-1 sm:pt-0">
              Hoàn toàn đủ tiêu chuẩn. Báo cáo được xây dựng theo chuẩn <strong>Executive Briefing 4 Phân mục</strong> (Tóm lược điều hành, Phân tích định lượng, Tiếng nói thị trường và Đề xuất hành động). Hệ thống cung cấp nút bấm <strong>Xuất Báo Cáo 6 Trang (A4)</strong> với bố cục sang trọng, có thông tin doanh nghiệp, mã độc bản bảo mật và biểu đồ trực quan, sẵn sàng in ấn hoặc đính kèm vào hồ sơ gọi vốn.
            </p>
          </div>
        </div>
      </section>

      {/* ── Bottom High-Converting CTA Section ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-[#0A192F] to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(217,119,6,0.15),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
            TỐI ƯU HÓA QUYẾT ĐỊNH KINH DOANH
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Kiểm thử ý tưởng với 1.000 khách hàng tiềm năng giả lập <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              trong 60 giây
            </span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Giúp doanh nghiệp tiết kiệm 95% chi phí và thời gian trước khi tung sản phẩm thật ra thị trường. Thử sai nhanh, định giá chuẩn xác và loại bỏ rủi ro chôn vốn bằng cụm tác tử AI mô phỏng người tiêu dùng Việt Nam.
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/wizard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm py-3.5 sm:py-4 px-8 sm:px-9 rounded-xl shadow-xl transition-all transform hover:scale-105"
            >
              <span>Khởi tạo khảo sát ngay</span>
              <span>→</span>
            </Link>
            <Link
              href="/results/DEMO-NIELSEN-BASES"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-sm py-3.5 sm:py-4 px-6 sm:px-7 rounded-xl border border-slate-700 hover:border-slate-500 transition-all"
            >
              <span>📊 Xem Báo Cáo Mẫu Thực Tế</span>
            </Link>
          </div>

          <div className="pt-6 sm:pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-10 text-[11px] sm:text-xs font-mono text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Kích hoạt VietQR tức thì
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Độ tin cậy 95% chuẩn Cochran
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Xuất báo cáo PDF A4 6 trang
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Bảo mật dữ liệu tuyệt đối (PII-Free)
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer Tinh Gọn, Đẳng Cấp & Chuẩn Pháp Lý ── */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 pt-12 sm:pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
          {/* 4-Column Structured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-xs">
            {/* Col 1: Brand & Media Positioning */}
            <div className="space-y-3.5 lg:pr-4">
              <Logo variant="footer" href="/" />
              <p className="text-slate-400 text-xs leading-relaxed">
                Chúng tôi giúp bạn kiểm thử ý tưởng với 1.000 khách hàng tiềm năng giả lập trong 60 giây, giúp tiết kiệm 95% chi phí và thời gian trước khi tung sản phẩm thật ra thị trường.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                  Cochran 95%
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                  Privacy-by-Design
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  VietQR Pro
                </span>
              </div>
            </div>

            {/* Col 2: Models & Solutions */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Mô Hình Nghiên Cứu
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#phuong-phap" className="hover:text-white transition-colors">
                    Nielsen BASES (Kiểm định ý tưởng)
                  </a>
                </li>
                <li>
                  <a href="#phuong-phap" className="hover:text-white transition-colors">
                    Van Westendorp (Định giá tối ưu)
                  </a>
                </li>
                <li>
                  <a href="#phuong-phap" className="hover:text-white transition-colors">
                    Kantar Link (Thử nghiệm A/B bao bì)
                  </a>
                </li>
                <li>
                  <a href="#phuong-phap" className="hover:text-white transition-colors">
                    U&amp;A Study (Hành vi &amp; Thói quen)
                  </a>
                </li>
                <li className="pt-1">
                  <Link
                    href="/results/DEMO-NIELSEN-BASES"
                    className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Xem toàn bộ 9 ca mẫu</span>
                    <span>→</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Academic & Documentation */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Cơ Sở Khoa Học
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/minh-bach-khoa-hoc" className="hover:text-white transition-colors">
                    Minh Bạch Khoa Học &amp; Thống Kê
                  </Link>
                </li>
                <li>
                  <Link href="/bach-thu" className="hover:text-white transition-colors">
                    Bạch Thư Phương Pháp Luận C-Level
                  </Link>
                </li>
                <li>
                  <Link href="/minh-bach-khoa-hoc" className="hover:text-white transition-colors">
                    Khung đối chuẩn Niên giám GSO
                  </Link>
                </li>
                <li>
                  <Link href="/tra-cuu" className="hover:text-white transition-colors">
                    Tra cứu báo cáo bảo mật
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Support & Operations */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Vận Hành &amp; Hỗ Trợ
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/wizard" className="hover:text-white transition-colors">
                    Khởi tạo khảo sát trực tuyến
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400">Cổng thanh toán: </span>
                  <span className="text-slate-200">VietQR 24/7 (SePay)</span>
                </li>
                <li>
                  <span className="text-slate-400">Email: </span>
                  <a href="mailto:hi@1booking.asia" className="text-amber-400 hover:underline">
                    hi@1booking.asia
                  </a>
                </li>
                <li>
                  <span className="text-slate-400">Hệ sinh thái: </span>
                  <a href="https://1booking.asia" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">
                    1booking.asia
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Disclaimer Box — Điều khoản Khước từ Trách nhiệm Pháp lý */}
          <div className="pt-6 border-t border-slate-900">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-slate-400 text-xs leading-relaxed space-y-2 shadow-inner">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <span>⚖️</span>
                <span>Điều khoản khước từ trách nhiệm (Legal Disclaimer)</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                INSIGHT AI là công cụ mô phỏng giả lập tác tử AI hỗ trợ thử nghiệm ý tưởng và tối ưu hóa chi phí nghiên cứu ban đầu. Kết quả khảo sát mang tính chất tham khảo khoa học, không thay thế hoàn toàn cho các quyết định đầu tư tài chính hoặc pháp lý thực tế của doanh nghiệp.
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Hệ thống vận hành theo nguyên tắc <em>Privacy-by-Design</em>, toàn bộ hồ sơ khách hàng giả lập là dữ liệu tổng hợp (Synthetic Personas), không thu thập hoặc lưu trữ thông tin định danh cá nhân thật (PII-free) của bất kỳ công dân nào, đáp ứng 100% quy định của <em>Nghị định 13/2023/NĐ-CP</em> và <em>Luật Bảo vệ dữ liệu cá nhân</em>.
              </p>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 text-center sm:text-left">
            <span>
              © 2026 INSIGHT AI Platform · Nền tảng Nghiên cứu Thị trường bằng Tác tử AI Mô phỏng. All rights reserved.
            </span>
            <div className="flex items-center gap-4 text-slate-400">
              <Link href="/minh-bach-khoa-hoc" className="hover:text-amber-400 transition-colors">
                Bảo vệ dữ liệu PII-Free
              </Link>
              <span>·</span>
              <Link href="/bach-thu" className="hover:text-amber-400 transition-colors">
                Chuẩn Cochran 95%
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
