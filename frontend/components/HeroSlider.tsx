'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SlideData {
  id: string;
  badge: {
    icon: string;
    text: string;
    badgeClass: string;
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
  accentColor: 'amber' | 'emerald' | 'indigo';
  imageSrc: string;
  imageAlt: string;
  statsPill: {
    icon: string;
    label: string;
    value: string;
  };
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const SLIDE_DURATION = 6500; // 6.5s mỗi slide

  const SLIDES: SlideData[] = [
    {
      id: 'nielsen_bases',
      tabTitle: '01. Khảo Sát Ý Tưởng',
      tabSubtitle: 'Nielsen BASES · 1.000 Khách Hàng AI',
      badge: {
        icon: '✦',
        text: 'ĐỐI CHUẨN PHÂN TẦNG NIÊN GIÁM THỐNG KÊ GSO · ESOMAR',
        badgeClass: 'bg-amber-400/15 text-amber-300 border-amber-400/40',
      },
      headlinePrefix: 'Kiểm thử ý tưởng với ',
      headlineHighlight: '1.000 khách hàng tiềm năng giả lập',
      headlineHighlightClass: 'from-amber-300 via-amber-400 to-amber-200',
      headlineSuffix: ' trong 60 giây',
      description:
        'Mô phỏng phản ứng thị trường độc lập trước khi rót vốn sản xuất. Dữ liệu được đối chuẩn phân tầng khoa học theo Niên giám Thống kê GSO (6 vùng kinh tế, độ tuổi, thu nhập), giúp đo lường chính xác tỷ lệ chấp nhận dùng thử và bóc tách rào cản thất bại.',
      primaryCta: {
        label: 'Khởi tạo khảo sát ngay',
        href: '/wizard?model=nielsen_bases',
        btnClass:
          'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25',
      },
      secondaryCta: {
        label: '📊 Xem Báo Cáo Mẫu (Demo)',
        href: '/results/DEMO-NIELSEN-BASES',
      },
      tertiaryCta: {
        label: 'Bảng giá dịch vụ',
        href: '#bang-gia',
      },
      accentColor: 'amber',
      imageSrc: '/images/hero/slide-1-concept.jpg',
      imageAlt: 'Mô phỏng thị trường 1.000 khách hàng AI phân vai theo nhân khẩu học Việt Nam',
      statsPill: {
        icon: '👥',
        label: 'Quy mô mô phỏng',
        value: '1.000 Personas · MoE ±3.1%',
      },
    },
    {
      id: 'van_westendorp',
      tabTitle: '02. Định Giá Tối Ưu',
      tabSubtitle: 'Van Westendorp PSM · 4 Đường Cong',
      badge: {
        icon: '💎',
        text: 'MÔ HÌNH KINH TẾ LƯỢNG VAN WESTENDORP (PSM)',
        badgeClass: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40',
      },
      headlinePrefix: 'Xác định ',
      headlineHighlight: 'Điểm Giá Tối Ưu (OPP)',
      headlineHighlightClass: 'from-emerald-300 via-teal-300 to-emerald-200',
      headlineSuffix: ' & bảo vệ biên lợi nhuận',
      description:
        'Chấm dứt việc định giá sản phẩm theo cảm tính. Phương pháp 4 đường cong kinh tế lượng giúp doanh nghiệp xác lập ranh giới vàng: mức giá tối đa hóa doanh thu, điểm giá hòa nhập và vùng giá an toàn không lo rơi vào bẫy giá rẻ.',
      primaryCta: {
        label: 'Khảo sát định giá ngay',
        href: '/wizard?model=van_westendorp',
        btnClass:
          'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25',
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
      imageAlt: 'Đồ thị đường cong kinh tế lượng và điểm giá tối ưu Van Westendorp PSM',
      statsPill: {
        icon: '📈',
        label: 'Kinh tế lượng',
        value: 'OPP, IDP, PMC, PME Curves',
      },
    },
    {
      id: 'ab_testing',
      tabTitle: '03. Đấu Đầu Bao Bì A/B',
      tabSubtitle: 'Kantar Link Pre-Testing · Win-Rate %',
      badge: {
        icon: '🎨',
        text: 'KANTAR LINK PRE-TESTING FRAMEWORK',
        badgeClass: 'bg-indigo-400/15 text-indigo-300 border-indigo-400/40',
      },
      headlinePrefix: 'Đấu đầu trực quan ',
      headlineHighlight: 'Bao Bì Mẫu A vs B',
      headlineHighlightClass: 'from-indigo-300 via-purple-300 to-indigo-200',
      headlineSuffix: ' trước khi in ấn đại trà',
      description:
        'Nạp trực tiếp 2 mẫu thiết kế bao bì hoặc thông điệp USP vào hệ thống. Phân tích tỷ lệ chiến thắng (Win-rate %), kiểm định ý nghĩa thống kê p < 0.05 và thẩm định độ bắt mắt trên quầy kệ siêu thị lẫn sàn TMĐT trước khi xuất xưởng.',
      primaryCta: {
        label: 'Thử nghiệm bao bì A/B ngay',
        href: '/wizard?model=ab_testing',
        btnClass:
          'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/25',
      },
      secondaryCta: {
        label: '🔍 Tra Cứu Khảo Sát',
        href: '/tra-cuu',
      },
      tertiaryCta: {
        label: 'Quy trình 3 bước',
        href: '#quy-trinh',
      },
      accentColor: 'indigo',
      imageSrc: '/images/hero/slide-3-abtesting.jpg',
      imageAlt: 'So sánh đối đầu trực quan 2 mẫu thiết kế bao bì A và B theo chuẩn Kantar',
      statsPill: {
        icon: '🏆',
        label: 'Đo lường trực quan',
        value: 'Win-rate % & Shelf Standout',
      },
    },
  ];

  const totalSlides = SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide, SLIDE_DURATION]);

  return (
    <section
      className="relative w-full h-[640px] sm:h-[700px] lg:h-[760px] xl:h-[800px] overflow-hidden bg-slate-950 text-white select-none border-b border-slate-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Carousel Banner"
    >
      {/* ── 3 FULL-WIDTH LAYERED SLIDES (Smooth Cross-Fade Ken Burns) ── */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive
                ? 'opacity-100 z-10 pointer-events-auto'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
            style={{ willChange: 'opacity' }}
          >
            {/* Background Image with Slow Cinematic Zoom (Ken Burns) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover object-center transition-transform duration-[7500ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Multi-layered Vignette Overlay: Deep Left Contrast for Perfect Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

              {/* Ambient Colored Aura */}
              <div
                className={`absolute top-1/3 left-10 w-[550px] h-[350px] blur-[120px] rounded-full pointer-events-none opacity-30 ${
                  slide.accentColor === 'amber'
                    ? 'bg-amber-500'
                    : slide.accentColor === 'emerald'
                    ? 'bg-emerald-500'
                    : 'bg-indigo-500'
                }`}
              />
            </div>

            {/* Slide Foreground Content Container */}
            <div className="relative z-20 w-full h-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center">
              <div className="max-w-3xl space-y-4 sm:space-y-6 pt-4 sm:pt-0">
                {/* Badge Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10.5px] sm:text-xs font-mono font-bold tracking-wider uppercase border backdrop-blur-md shadow-sm transition-all duration-700">
                  <span className="text-amber-400">{slide.badge.icon}</span>
                  <span className={slide.badge.badgeClass.split(' ')[1] || 'text-amber-300'}>
                    {slide.badge.text}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] font-black text-white leading-[1.12] tracking-tight">
                  {slide.headlinePrefix}
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.headlineHighlightClass} inline-block`}
                  >
                    {slide.headlineHighlight}
                  </span>
                  {slide.headlineSuffix}
                </h1>

                {/* Description Paragraph */}
                <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed font-normal max-w-2xl drop-shadow-sm">
                  {slide.description}
                </p>

                {/* Action Buttons (CTAs) */}
                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href={slide.primaryCta.href}
                    className={`inline-flex items-center justify-center gap-2 text-xs sm:text-sm py-3.5 px-6 sm:px-7 rounded-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer ${slide.primaryCta.btnClass}`}
                  >
                    <span>{slide.primaryCta.label}</span>
                    <span>→</span>
                  </Link>

                  <Link
                    href={slide.secondaryCta.href}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm py-3.5 px-5 sm:px-6 rounded-xl border border-white/20 backdrop-blur-md transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
                  >
                    <span>{slide.secondaryCta.label}</span>
                  </Link>

                  <a
                    href={slide.tertiaryCta.href}
                    className="inline-flex items-center justify-center gap-1.5 text-slate-400 hover:text-white font-semibold text-xs sm:text-sm py-2 px-3 transition-colors"
                  >
                    <span>{slide.tertiaryCta.label}</span>
                    <span className="text-xs">›</span>
                  </a>
                </div>

                {/* Micro Proof & Trust Guarantee */}
                <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Xuất kết quả trong 60 giây</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Đối chuẩn Niên giám GSO</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Không cần đăng ký phức tạp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── ARROW NAVIGATION (PREV / NEXT) ── */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Slide trước"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Slide tiếp theo"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── BOTTOM CONTROLS & TAB NAVIGATION TRAY ── */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-950/70 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-white/10 shadow-2xl">
            {SLIDES.map((s, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`group relative text-left p-2.5 sm:p-3 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/25 shadow-lg'
                      : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] sm:text-xs font-bold truncate">
                      {s.tabTitle}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300/80 truncate hidden sm:block">
                    {s.tabSubtitle}
                  </p>

                  {/* Smooth Progress Bar for Active Slide */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                        style={{
                          animation: isPaused
                            ? 'none'
                            : `slideTimer ${SLIDE_DURATION}ms linear infinite`,
                        }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress animation keyframe */}
      <style jsx>{`
        @keyframes slideTimer {
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
