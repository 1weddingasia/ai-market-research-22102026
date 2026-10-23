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
  const isLight = variant === 'light'; // Dùng trên nền tối (slate-900 / navy)
  const isCompact = variant === 'compact'; // Chỉ hiển thị icon
  const isFooter = variant === 'footer';

  const textColorMain = isLight || isFooter ? 'text-white' : 'text-slate-900';
  const textColorSub = isLight || isFooter ? 'text-slate-400' : 'text-slate-500';

  const content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* ── Emblem Symbol Icon ── */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Glow halo on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 blur-[6px] opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
        
        {/* Diamond / Faceted Icon Container */}
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-[1.5px] shadow-md border border-amber-500/30 group-hover:border-amber-400/80 transition-all duration-300 group-hover:scale-105">
          <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 transform group-hover:rotate-6 transition-transform duration-300"
            >
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                <linearGradient id="prismGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
              </defs>
              
              {/* Outer faceted geometric shield / diamond */}
              <path
                d="M18 3L30 10V22L18 33L6 22V10L18 3Z"
                stroke="url(#goldGrad)"
                strokeWidth="1.8"
                strokeLinejoin="round"
                className="opacity-80"
              />
              {/* Central Pillar of Insight / Letter I & Tech node */}
              <path
                d="M18 9V27"
                stroke="url(#goldGrad)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              {/* Horizontal radar pulses */}
              <path
                d="M12 15L18 12L24 15"
                stroke="url(#prismGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 21L18 24L26 21"
                stroke="url(#prismGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Core Star / Node */}
              <circle cx="18" cy="18" r="2.2" fill="#FEF3C7" className="animate-pulse" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Brand Typography ── */}
      {!isCompact && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={`font-sans font-extrabold tracking-[0.12em] text-base sm:text-lg uppercase transition-colors ${textColorMain} group-hover:text-amber-500`}
            >
              INSIGHT
            </span>
            <span className="font-serif font-black text-base sm:text-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              AI
            </span>
          </div>

          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-1 leading-none">
              <span
                className={`text-[10px] sm:text-[11px] font-semibold tracking-[0.08em] uppercase ${textColorSub} group-hover:text-amber-400/90 transition-colors`}
              >
                Nghiên Cứu Thị Trường
              </span>
              <span className="w-1 h-1 rounded-full bg-amber-500/60 hidden sm:inline-block" />
              <span className="text-[9px] font-mono font-bold text-amber-600/90 dark:text-amber-400/80 uppercase hidden sm:inline-block">
                Tier-1
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
