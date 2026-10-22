'use client';

import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
      className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex items-center gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-full bg-slate-900/95 hover:bg-slate-950 text-amber-400 border border-amber-500/40 hover:border-amber-400 shadow-2xl backdrop-blur-md transition-all duration-300 cursor-pointer group ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      }`}
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] transform group-hover:-translate-y-0.5 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
      <span className="text-[11px] font-sans font-bold tracking-wider hidden sm:inline text-slate-200 group-hover:text-white">
        LÊN ĐẦU
      </span>
    </button>
  );
}
