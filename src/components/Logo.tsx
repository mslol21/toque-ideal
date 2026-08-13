'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'inline' | 'full';
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true, variant = 'inline', theme = 'light' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.25em]',
    md: 'text-base sm:text-lg tracking-[0.25em]',
    lg: 'text-xl sm:text-2xl tracking-[0.3em]',
    xl: 'text-3xl sm:text-4xl tracking-[0.35em]',
  };

  if (variant === 'full') {
    return (
      <div className="relative inline-block overflow-hidden rounded-2xl border border-white/30 shadow-2xl group">
        <img
          src="/logo.svg"
          alt="Toque Ideal Logo"
          className="w-48 sm:w-64 h-auto object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-[#204060]';
  const subtitleColor = theme === 'dark' ? 'text-gray-300' : 'text-slate-500';

  return (
    <div className="flex items-center gap-3 select-none group">
      
      {/* BRAND EMBLEM */}
      <div className={`${iconSizes[size]} rounded-xl bg-[#204060] border-2 border-[#204060] p-1.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300 shrink-0`}>
        <img
          src="/logo-icon.svg"
          alt="Toque Ideal Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      {/* TYPOGRAPHY */}
      <div>
        <span className={`font-extrabold uppercase block leading-none ${textColor} ${textSizes[size]} group-hover:text-[#2563eb] transition-colors`}>
          TOQUE IDEAL
        </span>
        {showSubtitle && (
          <span className={`text-[10px] sm:text-xs font-semibold tracking-wider block mt-1 uppercase ${subtitleColor}`}>
            Artigos de Decoração
          </span>
        )}
      </div>

    </div>
  );
};
