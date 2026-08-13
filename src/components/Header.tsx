'use client';

import React, { useState } from 'react';
import { useShowroom } from '@/lib/store';
import { ShoppingBag, Monitor, Menu, X, QrCode } from 'lucide-react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const {
    cartTotals,
    setIsQuoteDrawerOpen,
    isExhibitionMode,
    toggleExhibitionMode,
    openQRModal,
  } = useShowroom();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShareCatalogQR = () => {
    if (typeof window !== 'undefined') {
      openQRModal(
        'Catálogo Toque Ideal no seu Celular',
        window.location.href,
        'Escaneie para acessar o catálogo digital no seu smartphone'
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* OFFICIAL LOGO TOQUE IDEAL */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer"
        >
          <Logo size="md" theme="light" />
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => scrollToSection('inicio')}
            className="text-slate-700 hover:text-[#204060] transition-colors font-extrabold uppercase tracking-wider text-xs"
          >
            Início
          </button>
          <button
            onClick={() => scrollToSection('catalogo')}
            className="text-slate-700 hover:text-[#204060] transition-colors font-extrabold uppercase tracking-wider text-xs"
          >
            Produtos & Catálogo
          </button>
          <button
            onClick={() => scrollToSection('institucional')}
            className="text-slate-700 hover:text-[#204060] transition-colors font-extrabold uppercase tracking-wider text-xs"
          >
            Sobre Nós
          </button>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          
          {/* MODO EXPOSIÇÃO TOGGLE */}
          <button
            onClick={toggleExhibitionMode}
            title={isExhibitionMode ? 'Desativar Modo Exposição' : 'Ativar Modo Exposição para Estande'}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
              isExhibitionMode
                ? 'brand-gradient-bg border-transparent text-white shadow-md animate-pulse'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4 text-slate-700" />
            <span>{isExhibitionMode ? 'Modo Exposição ATIVO' : 'Modo Exposição'}</span>
          </button>

          {/* CATALOG QR CODE BUTTON */}
          <button
            onClick={handleShareCatalogQR}
            title="Gerar QR Code para Celular"
            className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-[#204060] text-slate-700 hover:text-[#204060] transition-colors"
          >
            <QrCode className="w-5 h-5 text-[#204060]" />
          </button>

          {/* SHOPPING CART BUTTON */}
          <button
            onClick={() => setIsQuoteDrawerOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl brand-gradient-bg font-extrabold text-xs shadow-md hover:shadow-lg transition-all duration-300 group text-white uppercase tracking-wider"
          >
            <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Orçamento</span>
            {cartTotals.totalUnits > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#204060] text-xs flex items-center justify-center font-extrabold shadow">
                {cartTotals.totalUnits}
              </span>
            )}
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-lg">
          <button
            onClick={() => scrollToSection('inicio')}
            className="block w-full text-left py-2 text-slate-800 font-extrabold text-base border-b border-slate-100"
          >
            Início
          </button>
          <button
            onClick={() => scrollToSection('catalogo')}
            className="block w-full text-left py-2 text-slate-800 font-extrabold text-base border-b border-slate-100"
          >
            Produtos & Catálogo
          </button>
          <button
            onClick={() => scrollToSection('institucional')}
            className="block w-full text-left py-2 text-slate-800 font-extrabold text-base border-b border-slate-100"
          >
            Sobre Nós
          </button>
          
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                toggleExhibitionMode();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl brand-gradient-bg text-white font-bold text-sm shadow-md"
            >
              <Monitor className="w-4 h-4 text-white" />
              {isExhibitionMode ? 'Desativar Modo Exposição' : 'Ativar Modo Exposição (Touch)'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
