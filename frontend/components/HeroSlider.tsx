'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Slide {
  id: string;
  badge: {
    icon: string;
    text: string;
    color: string;
  };
  tabTitle: string;
  tabSubtitle: string;
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
  imageSrc: string;
  imageAlt: string;
  floatingBadgeTop: {
    icon: string;
    text: string;
    color: string;
  };
  floatingBadgeBottom: {
    icon: string;
    text: string;
    subtext: string;
    color: string;
  };
  bannerFootnote: string;
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const SLIDE_DURATION = 6000; // 6 seconds per slide

  const SLIDES: Slide[] = [
    {
      id: 'nielsen_bases',
      tabTitle: '1. Khảo Sát Ý Tưởng',
      tabSubtitle: 'Nielsen BASES · 1.000 Mẫu',
      badge: {
        icon: '✦',
        text: 'PHÂN TẦNG DÂN SỐ VIỆT NAM CHUẨN GSO · ESOMAR',
        color: 'bg-amber-500/10 text-amber-900 border-amber-300/60',
      },
      headlinePrefix: 'Khảo sát thị trường ',
      headlineHighlight: '1.000 người tiêu dùng',
      headlineHighlightClass: 'from-amber-600 via-amber-700 to-slate-900',
      headlineSuffix: ' trong 60 giây',
      description:
        'Mô phỏng phản hồi thực tế từ mẫu đại diện 6 vùng kinh tế trọng điểm (Hà Nội, Đà Nẵng, TP.HCM, ĐBSCL...). Đo lường mức độ độc đáo, tỷ lệ dùng thử dự báo và rào cản thất bại trước khi xuất xưởng.',
      primaryCta: {
        label: 'Khởi tạo khảo sát ngay',
        href: '/wizard?model=nielsen_bases',
        btnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
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
      imageSrc: '/images/hero/slide-1-concept.jpg',
      imageAlt: 'Mô phỏng khảo sát 1.000 người tiêu dùng Việt Nam trên bản đồ kinh tế 3D',
      floatingBadgeTop: {
        icon: '👥',
        text: '1.000 Synthetic Personas · 6 Vùng Kinh Tế',
        color: 'bg-slate-900/85 text-amber-300 border-amber-500/40',
      },
      floatingBadgeBottom: {
        icon: '🟢',
        text: 'Điểm Khả Thi: 78 / 100',
        subtext: 'Dự báo dùng thử 74.2% · Strong Go',
        color: 'bg-slate-900/90 text-white border-emerald-500/50',
      },
      bannerFootnote: 'Dữ liệu phân tầng nhân khẩu học theo Tổng cục Thống kê (GSO)',
    },
    {
      id: 'van_westendorp',
      tabTitle: '2. Định Giá Tối Ưu',
      tabSubtitle: 'Van Westendorp PSM',
      badge: {
        icon: '💎',
        text: 'MÔ HÌNH KINH TẾ LƯỢNG VAN WESTENDORP (PSM)',
        color: 'bg-emerald-500/10 text-emerald-900 border-emerald-300/60',
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
        btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25',
      },
      secondaryCta: {
        label: '📚 Xem Bạch Thư Định Giá',
        href: '/bach-thu',
      },
      tertiaryCta: {
        label: 'Cơ sở khoa học PSM',
        href: '#tieu-chuan-khoa-hoc',
      },
      accentColor: 'emerald',
      imageSrc: '/images/hero/slide-2-pricing.jpg',
      imageAlt: 'Thẩm định 4 đường cong kinh tế lượng và điểm giá tối ưu Van Westendorp',
      floatingBadgeTop: {
        icon: '📈',
        text: '4 Đường Cong Độ Nhạy Cảm Về Giá (PSM)',
        color: 'bg-slate-900/85 text-emerald-300 border-emerald-500/40',
      },
      floatingBadgeBottom: {
        icon: '🎯',
        text: 'Điểm Giá Tối Ưu: 320.000₫',
        subtext: 'Khoảng giá an toàn: 280k — 420k',
        color: 'bg-slate-900/90 text-white border-teal-500/50',
      },
      bannerFootnote: 'Tối ưu hóa doanh thu và loại trừ rủi ro bẫy giá rẻ trên thị trường',
    },
    {
      id: 'ab_testing',
      tabTitle: '3. Đấu Đầu Bao Bì A/B',
      tabSubtitle: 'Kantar Link Pre-Testing',
      badge: {
        icon: '🎨',
        text: 'KANTAR LINK PRE-TESTING FRAMEWORK',
        color: 'bg-indigo-500/10 text-indigo-900 border-indigo-300/60',
      },
      headlinePrefix: 'Đấu đầu trực quan ',
      headlineHighlight: 'Bao Bì Mẫu A vs B',
      headlineHighlightClass: 'from-indigo-600 via-purple-700 to-slate-900',
      headlineSuffix: ' trước khi in ấn đại trà',
      description:
        'Tải lên trực tiếp 2 mẫu thiết kế bao bì hoặc thông điệp USP. Đo lường tỷ lệ Win-rate (%), kiểm định ý nghĩa thống kê p < 0.05 và thẩm định độ nổi bật thực tế trên quầy kệ siêu thị & sàn TMĐT.',
      primaryCta: {
        label: 'Thử nghiệm bao bì A/B ngay',
        href: '/wizard?model=ab_testing',
        btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25',
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
      imageSrc: '/images/hero/slide-3-abtesting.jpg',
      imageAlt: 'So sánh đối đầu trực quan 2 mẫu thiết kế bao bì A và B',
      floatingBadgeTop: {
        icon: '🏆',
        text: 'Mẫu A Thắng: 63.4% Win-Rate (p < 0.01)',
        color: 'bg-slate-900/85 text-indigo-300 border-indigo-500/40',
      },
      floatingBadgeBottom: {
        icon: '✨',
        text: 'Shelf Stand-out: +34%',
        subtext: 'Rõ nét trên quầy kệ & Shopee/TikTok',
        color: 'bg-slate-900/90 text-white border-purple-500/50',
      },
      bannerFootnote: 'Thẩm định mức độ nhận diện thương hiệu và thị hiếu tiêu dùng thực chiến',
    },
  ];

  // Auto-play timer with pause on hover
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);

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
      className="relative overflow-hidden pt-6 sm:pt-8 pb-12 sm:pb-18 px-4 sm:px-6 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Glow */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] blur-3xl pointer-events-none rounded-full transition-all duration-700 opacity-25 ${
          slide.accentColor === 'amber'
            ? 'bg-amber-400'
            : slide.accentColor === 'emerald'
            ? 'bg-emerald-400'
            : 'bg-indigo-400'
        }`}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Slide Selector Tabs with Live Progress Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          {SLIDES.map((s, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`group relative text-left p-3 sm:p-3.5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden border ${
                  isActive
                    ? 'bg-white text-slate-900 border-slate-300 shadow-md ring-2 ring-slate-900/10'
                    : 'bg-white/60 hover:bg-white text-slate-600 hover:text-slate-900 border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <span className="text-base">{s.badge.icon}</span>
                    <span>{s.tabTitle}</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{s.tabSubtitle}</p>

                {/* Animated progress bar for the active slide */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${
                        s.accentColor === 'amber'
                          ? 'bg-amber-500'
                          : s.accentColor === 'emerald'
                          ? 'bg-emerald-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{
                        animation: isPaused
                          ? 'none'
                          : `heroProgress ${SLIDE_DURATION}ms linear infinite`,
                      }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Slide Content Grid: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[440px]">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left order-2 lg:order-1">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border transition-colors ${slide.badge.color}`}
            >
              <span>{slide.badge.icon}</span>
              <span>{slide.badge.text}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight leading-[1.22]">
              {slide.headlinePrefix}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.headlineHighlightClass}`}
              >
                {slide.headlineHighlight}
              </span>
              {slide.headlineSuffix}
            </h1>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={slide.primaryCta.href}
                className={`inline-flex items-center justify-center gap-2 font-bold text-sm sm:text-base py-3.5 px-7 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] cursor-pointer ${slide.primaryCta.btnClass}`}
              >
                <span>{slide.primaryCta.label}</span>
                <span>→</span>
              </Link>

              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm py-3 px-5 rounded-xl border border-slate-300 shadow-2xs hover:shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] cursor-pointer"
              >
                <span>{slide.secondaryCta.label}</span>
              </Link>

              <a
                href={slide.tertiaryCta.href}
                className="inline-flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm py-2 px-3 transition-colors text-center"
              >
                {slide.tertiaryCta.label}
              </a>
            </div>

            {/* Micro guarantee */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs sm:text-sm text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Không cần tạo tài khoản phức tạp
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Xuất kết quả trong 60 giây
              </span>
            </div>
          </div>

          {/* Right Column: High-Impact Visual Image Showcase */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 group">
              {/* Aspect Ratio Container (16:9) */}
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

                {/* Floating Badge Top */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <div
                    className={`backdrop-blur-md px-3 py-1.5 rounded-xl border shadow-lg text-[11px] sm:text-xs font-semibold flex items-center gap-2 ${slide.floatingBadgeTop.color}`}
                  >
                    <span>{slide.floatingBadgeTop.icon}</span>
                    <span>{slide.floatingBadgeTop.text}</span>
                  </div>
                </div>

                {/* Floating Badge Bottom */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 text-right">
                  <div
                    className={`backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border shadow-xl text-left ${slide.floatingBadgeBottom.color}`}
                  >
                    <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      <span>{slide.floatingBadgeBottom.icon}</span>
                      <span>{slide.floatingBadgeBottom.text}</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-300 font-normal mt-0.5">
                      {slide.floatingBadgeBottom.subtext}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Glass Caption */}
              <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="truncate">{slide.bannerFootnote}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 ml-2">
                  Live Preview
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators & Navigation Controls */}
        <div className="flex items-center justify-between pt-6 sm:pt-8 border-t border-slate-200/80 mt-6 sm:mt-8">
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
            <span className="hidden sm:inline-block text-[11px] text-slate-400 ml-3 italic">
              {isPaused ? '⏸ Đang dừng khi rê chuột' : '▶ Tự động chuyển mỗi 6s'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Slide trước"
              className="w-9 h-9 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs transition-all cursor-pointer font-bold"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Slide tiếp theo"
              className="w-9 h-9 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs transition-all cursor-pointer font-bold"
            >
              →
            </button>
          </div>
        </div>

        {/* Bottom Trust Metrics */}
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

      {/* Global CSS keyframe animation for the progress bar */}
      <style jsx>{`
        @keyframes heroProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
