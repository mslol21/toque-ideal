'use client';

import React from 'react';
import { Award, ExternalLink } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const InstitutionalSection: React.FC = () => {
  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/toque.ideal/', '_blank');
  };

  return (
    <section id="institucional" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* SECTION HEADER WITH AUTHENTIC SITE COPY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/80 border border-slate-300 text-[#204060] text-xs font-extrabold uppercase tracking-widest">
            <Award className="w-4 h-4 text-[#204060]" />
            <span>QUEM SOMOS — TOQUE IDEAL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Arte em vidro. <br />
            <span className="brand-gradient-text">Design com propósito.</span>
          </h2>

          <p className="text-slate-700 text-base leading-relaxed font-medium">
            A <strong>Toque Ideal</strong> é uma fabricante especializada em peças decorativas em vidro e produtos personalizados, desenvolvendo coleções com padrão único de modernidade, qualidade e design. Cada peça é tratada como exclusiva, pensada para atender clientes exigentes que buscam beleza, elegância e funcionalidade em seus ambientes.
          </p>

          <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-[#204060] pl-4 italic font-medium bg-slate-50 py-2 rounded-r-xl">
            Presente nas principais feiras do setor — como a <strong>ABCasa Fair</strong> — a empresa é referência no segmento de home decor, levando as últimas tendências em design e decoração ao mercado nacional.
          </p>

          {/* AUTHENTIC STATS FROM SITE */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#204060]">10+</span>
              <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">ANOS DE MERCADO</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#204060]">100+</span>
              <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">MODELOS DIFERENTES</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#204060]">ABCasa</span>
              <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">FAIR DESTAQUE</span>
            </div>
          </div>
        </div>

        {/* IMAGE SHOWCASE ADJUSTED FOR FULL UNCROPPED DISPLAY */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 p-3 shadow-xl bg-white flex flex-col justify-between">
          <div className="w-full h-auto min-h-[400px] max-h-[600px] overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center">
            <img
              src="https://www.toqueideal.com/escultura.png"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=1000';
              }}
              alt="Arte em Vidro Escultura Toque Ideal"
              className="w-full h-full object-contain max-h-[580px] rounded-2xl transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-extrabold text-[#204060] block uppercase tracking-wider">FEIRA ABCASA FAIR & SHOWROOM</span>
            <span className="text-sm font-extrabold text-slate-900">Escultura Exclusiva em Vidro Lapidado</span>
          </div>
        </div>

      </div>

      {/* INSTAGRAM SECTION MATCHING SCREENSHOT 4 */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-extrabold text-[#204060] uppercase tracking-wider">REDES SOCIAIS</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Siga-nos no Instagram
          </h3>
          <p className="text-slate-600 text-sm max-w-lg font-medium">
            Acompanhe nossos lançamentos, ambientes decorados e novidades direto pelo Instagram.
          </p>
        </div>

        <button
          onClick={handleInstagramClick}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2.5 shrink-0 uppercase tracking-wider"
        >
          <InstagramIcon className="w-5 h-5 text-white" />
          <span>@TOQUE.IDEAL</span>
          <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
        </button>
      </div>

    </section>
  );
};
