'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useShowroom } from '@/lib/store';

export const HeroSection: React.FC = () => {
  const { setIsCartOpen } = useShowroom();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden py-24 px-4 sm:px-6 lg:px-8 text-center">
      
      {/* FULL-BLEED CINEMATIC HERO BACKGROUND IMAGE WITH DARK VIGNETTE */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.toqueideal.com/7.png"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920';
          }}
          alt="Toque Ideal Home Decor Hero"
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
        />
        {/* Dark Translucent Overlay matching toqueideal.com screenshot */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/90 via-[#0a1128]/60 to-[#0a1128]/50" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 flex flex-col items-center">
        
        {/* SUB-LABEL MATCHING SCREENSHOT ("HOME DECOR") */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gray-300 italic text-sm tracking-[0.3em] font-light uppercase">
            HOME DECOR
          </span>
        </motion.div>

        {/* MAIN HEADLINE MATCHING SCREENSHOT */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-md max-w-3xl"
        >
          Peças decorativas em vidro que transformam ambientes
        </motion.h1>

        {/* SUBTITLE MATCHING SCREENSHOT */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-200 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl opacity-90 drop-shadow"
        >
          Há mais de 10 anos criando objetos únicos que expressam estilo, personalidade e sofisticação.
        </motion.p>

        {/* CTA BUTTONS MATCHING SCREENSHOT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* PRIMARY BUTTON: SOLID NAVY BLUE */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#204060] hover:bg-[#285078] text-white font-extrabold text-xs tracking-wider uppercase shadow-xl hover:scale-105 transition-all duration-300 border border-[#204060]"
          >
            SOLICITAR ORÇAMENTO
          </button>

          {/* SECONDARY BUTTON: OUTLINE WHITE */}
          <button
            onClick={() => scrollToSection('catalogo')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent hover:bg-white hover:text-slate-900 border border-white/80 text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-md"
          >
            VER PRODUTOS
          </button>
        </motion.div>

        {/* SCROLL DOWN ARROW MATCHING SCREENSHOT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-12"
        >
          <button
            onClick={() => scrollToSection('catalogo')}
            className="text-white/70 hover:text-white transition-colors animate-bounce p-2"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
