'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShowroom } from '@/lib/store';
import { Monitor, Sparkles, Hand, RefreshCw } from 'lucide-react';

export const ExhibitionController: React.FC = () => {
  const {
    isExhibitionMode,
    showIdlePrompt,
    resetIdleState,
    toggleExhibitionMode,
  } = useShowroom();

  const [countdown, setCountdown] = useState(10);

  // Apply touch lock class to body when in Exhibition Mode
  useEffect(() => {
    if (isExhibitionMode) {
      document.body.classList.add('exhibition-kiosk-active');
    } else {
      document.body.classList.remove('exhibition-kiosk-active');
    }
  }, [isExhibitionMode]);

  // Countdown timer when prompt is visible
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showIdlePrompt) {
      setCountdown(10);
      interval = setInterval(() => {
        setCountdown(prev => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showIdlePrompt]);

  return (
    <>
      {/* FLOATING KIOSK INDICATOR BAR (MODO EXPOSIÇÃO) */}
      {isExhibitionMode && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#090a0f]/90 border border-[#D4AF37]/40 shadow-2xl backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="text-xs font-bold text-[#F3E5AB]">Modo Exposição Kiosk</span>
          <button
            onClick={toggleExhibitionMode}
            className="ml-2 text-[10px] text-gray-400 hover:text-white underline"
          >
            Sair
          </button>
        </div>
      )}

      {/* 30s INACTIVITY OVERLAY PROMPT */}
      <AnimatePresence>
        {isExhibitionMode && showIdlePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetIdleState}
            className="fixed inset-0 z-50 bg-[#090a0f]/90 backdrop-blur-2xl flex items-center justify-center p-6 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-lg w-full glass-panel p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37]/50 text-center space-y-6 shadow-[0_0_80px_rgba(212,175,55,0.25)] relative overflow-hidden"
            >
              {/* Glow Accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="w-20 h-20 mx-auto rounded-3xl gold-gradient-bg flex items-center justify-center shadow-xl animate-bounce">
                <Hand className="w-10 h-10 text-[#090a0f]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37]">
                  STAND TOQUE IDEAL
                </span>
                <h2 className="text-3xl font-extrabold text-white">
                  Pronto para descobrir a Toque Ideal?
                </h2>
                <p className="text-gray-300 text-sm">
                  Toque em qualquer lugar da tela para continuar navegando no showroom.
                </p>
              </div>

              <div className="pt-2 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-amber-300 bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/30">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Reiniciando em {countdown}s...</span>
                </div>

                <button
                  onClick={resetIdleState}
                  className="w-full py-4 rounded-xl gold-gradient-bg text-[#090a0f] font-extrabold text-base shadow-lg hover:scale-105 transition-transform"
                >
                  CONTINUAR NAVEGAÇÃO
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
