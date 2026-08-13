'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShowroom } from '@/lib/store';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Copy, Check } from 'lucide-react';

export const QRCodeModal: React.FC = () => {
  const { isQRModalOpen, setIsQRModalOpen, qrPayload } = useShowroom();
  const [copied, setCopied] = React.useState(false);

  if (!isQRModalOpen || !qrPayload) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrPayload.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6 overflow-hidden"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setIsQRModalOpen(false)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#204060] text-[11px] font-extrabold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-[#204060]" />
              <span>DIGITAL SHOWROOM MOBILE LINK</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              CONTINUE NO SEU CELULAR
            </h2>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">
              Escaneie o QR Code abaixo com a câmera do seu celular e leve sua seleção com você.
            </p>
          </div>

          {/* QR CODE CONTAINER */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 inline-block mx-auto space-y-3 relative shadow-inner">
            <div className="p-4 bg-white rounded-2xl inline-block shadow-md">
              <QRCodeSVG
                value={qrPayload.url}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
            {qrPayload.subtitle && (
              <p className="text-[11px] text-[#204060] font-bold max-w-xs">
                {qrPayload.subtitle}
              </p>
            )}
          </div>

          {/* COPY LINK OPTION */}
          <div className="pt-2">
            <button
              onClick={handleCopyLink}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Link Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#204060]" />
                  <span>Copiar Link direto</span>
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
