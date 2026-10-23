'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Slide {
  id: string;
  badge: {
    icon: string;
    text: string;
    color: string;
  };
  tabTitle: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineHighlightClass: string;
  headlineSuffix: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
    btnClass: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  tertiaryCta: {
    label: string;
    href: string;
  };
  accentColor: string;
  previewCard: React.ReactNode;
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDES: Slide[] = [
    {
      id: 'nielsen_bases',
      tabTitle: '1. Kiểm Định Ý Tưởng',
      badge: {
        icon: '✦',
        text: 'PHÂN TẦNG DÂN SỐ VIỆT NAM CHUẨN GSO · ESOMAR',
        color: 'bg-amber-50 text-amber-800 border-amber-200',
      },
      headlinePrefix: 'Khảo sát thị trường ',
      headlineHighlight: '1.000 người tiêu dùng',
      headlineHighlightClass: 'from-amber-600 via-amber-700 to-slate-900',
      headlineSuffix: ' trong 60 giây',
      description:
        'Mô phỏng phản hồi thực tế từ mẫu đại diện 6 vùng kinh tế trọng điểm. Đo lường mức độ độc đáo, tỷ lệ dùng thử dự báo và rào cản thất bại (Flop Risk) trước khi xuất xưởng.',
      primaryCta: {
        label: 'Khởi tạo khảo sát ngay',
        href: '/wizard?model=nielsen_bases',
        btnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
      },
      secondaryCta: {
        label: '📄 Xem Báo Cáo Mẫu Thực Tế',
        href: '/results/DEMO-NIELSEN-BASES',
      },
      tertiaryCta: {
        label: 'Bảng giá dịch vụ',
        href: '#bang-gia',
      },
      accentColor: 'amber',
      previewCard: (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono uppercase font-bold text-slate-700">
                Nielsen BASES · Chỉ Số Thực Nghiệm
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              STRONG GO
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                Điểm Khả Thi (Viability)
              </span>
              <div className="text-2xl font-serif font-black text-slate-900 mt-1">
                78 <span className="text-xs text-slate-500 font-sans font-normal">/ 100</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Cao hơn 82% ngành hàng</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                Dùng Thử Dự Báo (Trial)
              </span>
              <div className="text-2xl font-serif font-black text-amber-700 mt-1">
                74.2%
              </div>
              <span className="text-[10px] text-slate-500">Top-2-Box chấp nhận mua</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Mức độ độc đáo (Uniqueness):</span>
                <span className="font-bold text-slate-900">4.2 / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Lý do để tin (Reason to Believe):</span>
                <span className="font-bold text-slate-900">4.0 / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
              <span>Chỉ số rủi ro thất bại (Flop Index):</span>
              <span className="font-bold text-emerald-700">18% (Ngưỡng an toàn)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'van_westendorp',
      tabTitle: '2. Định Giá Tối Ưu',
      badge: {
        icon: '💎',
        text: 'MÔ HÌNH KINH TẾ LƯỢNG VAN WESTENDORP (PSM)',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      },
      headlinePrefix: 'Xác định ',
      headlineHighlight: 'Điểm Giá Tối Ưu (OPP)',
      headlineHighlightClass: 'from-emerald-600 via-teal-700 to-slate-900',
      headlineSuffix: ' & bảo vệ biên lợi nhuận',
      description:
        'Chấm dứt việc định giá theo cảm tính. Phương pháp 4 đường cong kinh tế lượng giúp doanh nghiệp tìm ra ranh giới giữa mức giá bị chê đắt và mức giá quá rẻ khiến khách hàng nghi ngờ chất lượng.',
      primaryCta: {
        label: 'Khảo sát định giá ngay',
        href: '/wizard?model=van_westendorp',
        btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
      },
      secondaryCta: {
        label: '📚 Xem Bạch Thư Định Giá',
        href: '/bach-thu',
      },
      tertiaryCta: {
        label: 'Cơ sở khoa học',
        href: '#tieu-chuan-khoa-hoc',
      },
      accentColor: 'emerald',
      previewCard: (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[11px] font-mono uppercase font-bold text-slate-700">
                Van Westendorp · Tối Ưu Hóa Giá Bán
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200">
              4 ĐƯỜNG CONG PSM
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">
                Điểm Giá Tối Ưu (OPP)
              </span>
              <div className="text-xl sm:text-2xl font-serif font-black text-emerald-900 mt-1">
                320.000đ
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Thâm nhập thị trường tối đa</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                Điểm Giá Cân Bằng (IPP)
              </span>
              <div className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-1">
                360.000đ
              </div>
              <span className="text-[10px] text-slate-500">Bảo toàn vị thế thương hiệu</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Khoảng giá chấp nhận:</span>
              <span className="font-mono font-bold text-slate-900">280.000đ — 420.000đ</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Ngưỡng bắt đầu đắt (PMC):</span>
              <span className="font-mono font-semibold text-slate-700">420.000đ</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-red-600">
              <span>Bẫy giá rẻ (Nghi ngờ chất lượng):</span>
              <span className="font-mono font-bold">&lt; 220.000đ</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ab_testing',
      tabTitle: '3. Đấu Đầu Bao Bì A/B',
      badge: {
        icon: '🎨',
        text: 'KANTAR LINK PRE-TESTING FRAMEWORK',
        color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      },
      headlinePrefix: 'Đấu đầu trực quan ',
      headlineHighlight: 'Bao Bì Mẫu A vs B',
      headlineHighlightClass: 'from-indigo-600 via-purple-700 to-slate-900',
      headlineSuffix: ' trước khi in ấn đại trà',
      description:
        'Tải lên trực tiếp 2 mẫu thiết kế bao bì hoặc 2 thông điệp bán hàng. Đo lường tỷ lệ Win-rate (%), kiểm định ý nghĩa thống kê p < 0.05 và thẩm định độ nổi bật thực tế trên quầy kệ siêu thị & e-commerce.',
      primaryCta: {
        label: 'Thử nghiệm bao bì A/B ngay',
        href: '/wizard?model=ab_testing',
        btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
      },
      secondaryCta: {
        label: '🔍 Tra Cứu Báo Cáo',
        href: '/tra-cuu',
      },
      tertiaryCta: {
        label: 'Quy trình 3 bước',
        href: '#quy-trinh',
      },
      accentColor: 'indigo',
      previewCard: (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[11px] font-mono uppercase font-bold text-slate-700">
                A/B Testing · Tỷ Lệ Chiến Thắng
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 font-bold border border-indigo-200">
              p &lt; 0.01 · ĐỘ TIN CẬY 99%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-300 relative">
              <span className="absolute -top-2 right-2 text-[9px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                MẪU THẮNG 🏆
              </span>
              <span className="text-[10px] font-bold text-indigo-900 uppercase block">
                Phương Án A (Hiện Đại)
              </span>
              <div className="text-2xl font-serif font-black text-indigo-700 mt-1">
                63.4%
              </div>
              <span className="text-[10px] text-indigo-800 font-medium">+26.8% chênh lệch vote</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 opacity-80">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Phương Án B (Truyền Thống)
              </span>
              <div className="text-2xl font-serif font-black text-slate-600 mt-1">
                36.6%
              </div>
              <span className="text-[10px] text-slate-400">Rối mắt, claim chữ nhỏ</span>
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Độ nổi bật quầy kệ (Shelf Stand-out):</span>
              <span className="font-bold text-emerald-700">+34% so với đối thủ</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500">
              <span>Độ rõ ràng của thông điệp USP:</span>
              <span className="font-bold text-indigo-900">4.5 / 5.0</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500">
              <span>Độ tương phản trên Shopee / TikTok Shop:</span>
              <span className="font-bold text-slate-900">Rất sắc nét</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, SLIDES.length]);

  const slide = SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section
      className="relative overflow-hidden pt-6 sm:pt-10 pb-12 sm:pb-20 px-4 sm:px-6 bg-gradient-to-b from-white via-slate-50/50 to-slate-50 border-b border-slate-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-200/20 via-slate-200/20 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Slide Selector Tabs */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 flex-wrap">
          {SLIDES.map((s, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md scale-102'
                    : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-2xs'
                }`}
              >
                <span>{s.badge.icon}</span>
                <span>{s.tabTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Slide Content Grid: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[380px]">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
            <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border transition-colors ${slide.badge.color}`}>
              <span>{slide.badge.icon}</span>
              <span>{slide.badge.text}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.25] sm:leading-[1.18]">
              {slide.headlinePrefix}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.headlineHighlightClass}`}>
                {slide.headlineHighlight}
              </span>
              {slide.headlineSuffix}
            </h1>

            <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-xl">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={slide.primaryCta.href}
                className={`inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md transition-all transform hover:scale-[1.02] cursor-pointer ${slide.primaryCta.btnClass}`}
              >
                <span>{slide.primaryCta.label}</span>
                <span>→</span>
              </Link>

              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm py-3 px-5 rounded-xl border border-slate-300 shadow-2xs transition-all cursor-pointer"
              >
                <span>{slide.secondaryCta.label}</span>
              </Link>

              <a
                href={slide.tertiaryCta.href}
                className="inline-flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs py-2 px-3 transition-colors text-center"
              >
                {slide.tertiaryCta.label}
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Preview Card */}
          <div className="lg:col-span-5 relative">
            {slide.previewCard}
          </div>
        </div>

        {/* Slide Indicators & Navigation Arrows */}
        <div className="flex items-center justify-between pt-8 sm:pt-10 border-t border-slate-200/70 mt-6 sm:mt-10">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Chuyển đến slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
            <span className="text-[11px] text-slate-400 ml-2 font-mono">
              0{currentSlide + 1} / 0{SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Slide trước"
              className="w-9 h-9 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs transition-all cursor-pointer"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Slide tiếp theo"
              className="w-9 h-9 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs transition-all cursor-pointer"
            >
              →
            </button>
          </div>
        </div>

        {/* Bottom Highlights (Preserved from classic high-trust stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-8 text-left">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Quy mô mẫu phân tầng</span>
            <div className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-1">1.000.000+</div>
            <span className="text-[10px] sm:text-[11px] text-slate-500">Chuẩn GSO 6 vùng kinh tế</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tốc độ xuất kết quả</span>
            <div className="text-xl sm:text-2xl font-serif font-black text-emerald-700 mt-1">&lt; 60 giây</div>
            <span className="text-[10px] sm:text-[11px] text-slate-500">Phỏng vấn song song</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Độ tin cậy thống kê</span>
            <div className="text-xl sm:text-2xl font-serif font-black text-amber-700 mt-1">95% (±3.1%)</div>
            <span className="text-[10px] sm:text-[11px] text-slate-500">Chuẩn Cochran & ESOMAR</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Kích hoạt tự động</span>
            <div className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-1">VietQR 24/7</div>
            <span className="text-[10px] sm:text-[11px] text-slate-500">Nhận báo cáo tức thì</span>
          </div>
        </div>
      </div>
    </section>
  );
}
