'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CatalogSection } from '@/components/CatalogSection';
import { InstitutionalSection } from '@/components/InstitutionalSection';
import { Footer } from '@/components/Footer';
import { ExhibitionController } from '@/components/ExhibitionController';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { QuoteDrawer } from '@/components/QuoteDrawer';
import { QuoteModal } from '@/components/QuoteModal';
import { QRCodeModal } from '@/components/QRCodeModal';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-[#204060] selection:text-white">
      
      {/* KIOSK & INACTIVITY OVERLAY CONTROLLER */}
      <ExhibitionController />

      {/* HEADER NAV */}
      <Header />

      {/* HERO / WELCOME SCREEN */}
      <HeroSection />

      {/* VISUAL CATALOG & FILTERS */}
      <CatalogSection />

      {/* INSTITUTIONAL SECTION ("QUEM SOMOS") */}
      <InstitutionalSection />

      {/* FOOTER */}
      <Footer />

      {/* GLOBAL MODALS & DRAWERS */}
      <ProductDetailModal />
      <QuoteDrawer />
      <QuoteModal />
      <QRCodeModal />

    </main>
  );
}
