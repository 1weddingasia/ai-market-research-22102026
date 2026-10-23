import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark' | 'compact' | 'footer';
  className?: string;
  showSubtitle?: boolean;
  href?: string;
}

export default function Logo({
  variant = 'default',
  className = '',
  showSubtitle = true,
  href = '/',
}: LogoProps) {
  const isDarkBg = variant === 'light' || variant === 'footer'; // Dùng trên nền tối (slate-900 / navy)
  const isCompact = variant === 'compact';

  const textColorMain = isDarkBg ? 'text-white' : 'text-slate-900';
  const textColorSub = isDarkBg ? 'text-slate-400' : 'text-slate-500';

  const content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* ── Emblem Symbol Icon: Radiant Imperial Gold Badge (High Contrast, Ultra Visible) ── */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Ambient Warm Golden Glow */}
        <div className="absolute inset-0 rounded-xl bg-amber-400/40 blur-[5px] group-hover:bg-amber-400/70 transition-all duration-300" />

        {/* Golden Medallion Squircle (Bright & Luxurious) */}
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1.5px] shadow-md shadow-amber-500/25 border border-amber-300/80 group-hover:shadow-lg group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105">
          <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center overflow-hidden p-1.5">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full transform group-hover:rotate-6 transition-transform duration-300 drop-shadow-sm"
            >
              {/* Outer Faceted Diamond in Deep Midnight Navy */}
              <path
                d="M18 4L31 11.5V24.5L18 32L5 24.5V11.5L18 4Z"
                fill="#0F172A"
                stroke="#FFFFFF"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />

              {/* Diamond Facet Refractions in Warm Gold & White */}
              <path
                d="M18 4V32"
                stroke="#FDE68A"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M5 11.5L18 18L31 11.5"
                stroke="#FEF3C7"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M5 24.5L18 18L31 24.5"
                stroke="#F59E0B"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />

              {/* Central Radiant White Star Node */}
              <circle cx="18" cy="18" r="3.2" fill="#FFFFFF" />
              <circle cx="18" cy="18" r="1.6" fill="#D97706" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Brand Typography: INSIGHT AI ── */}
      {!isCompact && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={`font-sans font-black tracking-[0.14em] text-base sm:text-lg uppercase transition-colors ${textColorMain} group-hover:text-amber-600`}
            >
              INSIGHT
            </span>
            <span className="font-serif font-black text-base sm:text-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              AI
            </span>
          </div>

          {showSubtitle && (
            <span
              className={`text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mt-1 leading-tight ${textColorSub} group-hover:text-amber-600 transition-colors hidden sm:block`}
            >
              Nghiên Cứu Thị Trường AI
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg shrink-0"
      >
        {content}
      </Link>
    );
  }

  return content;
}
