'use client';

import React, { useState, useEffect } from 'react';
import { useShowroom } from '@/lib/store';
import { PersonalizationOption } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Plus,
  Minus,
  Sparkles,
  Info,
  Palette,
  CheckCircle2,
} from 'lucide-react';

const colorSwatches: Record<string, { bg: string; border: string }> = {
  'Verde Esmeralda': { bg: 'bg-emerald-600', border: 'border-emerald-700' },
  'Âmbar Dourado': { bg: 'bg-amber-500', border: 'border-amber-600' },
  'Azul Cobalto': { bg: 'bg-blue-600', border: 'border-blue-700' },
  'Fumê Cristal': { bg: 'bg-slate-700', border: 'border-slate-800' },
  'Incolor / Transparente': { bg: 'bg-slate-100', border: 'border-slate-300' },
  'Rubi Imperial': { bg: 'bg-rose-600', border: 'border-rose-700' },
};

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsQuoteDrawerOpen } = useShowroom();

  const colorsList = selectedProduct?.available_colors && selectedProduct.available_colors.length > 0
    ? selectedProduct.available_colors
    : ['Verde Esmeralda', 'Âmbar Dourado', 'Azul Cobalto', 'Incolor / Transparente'];

  const [quantity, setQuantity] = useState<number>(selectedProduct?.moq || 1);
  const [selectedOption, setSelectedOption] = useState<PersonalizationOption>(
    selectedProduct?.custom_options[0] || 'Gravação Laser no Vidro'
  );
  const [selectedColor, setSelectedColor] = useState<string>(colorsList[0]);
  const [hasGoldRim, setHasGoldRim] = useState<boolean>(Boolean(selectedProduct?.has_gold_rim_option));
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [customNotes, setCustomNotes] = useState<string>('');

  // ESC KEY TO CLOSE MODAL
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProduct]);

  if (!selectedProduct) return null;

  const displayPrice = selectedProduct.promo_price || selectedProduct.price;
  const lineSubtotal = displayPrice * quantity;

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > (selectedProduct.moq || 1) ? prev - 1 : prev));

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedOption, selectedColor, hasGoldRim, customNotes);
    setSelectedProduct(null);
    setIsQuoteDrawerOpen(true);
  };

  return (
    <div
      onClick={() => setSelectedProduct(null)}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      {/* MODAL CARD CONTAINER */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl my-auto flex flex-col no-scrollbar"
      >
        
        {/* STICKY TOP BAR WITH CLEAR ALWAYS-VISIBLE CLOSE BUTTON */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#204060] animate-pulse" />
            <span className="text-xs font-extrabold text-[#204060] uppercase tracking-wider">
              {selectedProduct.category_name || 'Vidro Decorativo'} • SKU: {selectedProduct.sku}
            </span>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="p-2 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs border border-slate-300 transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
            title="Fechar janela (ou clique fora)"
          >
            <span className="uppercase tracking-wider">FECHAR</span>
            <X className="w-4 h-4 text-slate-800" />
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* GALLERY COLUMN */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {selectedProduct.is_launch && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full brand-gradient-bg text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
                  Lançamento
                </span>
              )}
            </div>

            {/* THUMBNAILS */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#204060] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* SPECS HIGHLIGHT BOX */}
            {selectedProduct.specs && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <Info className="w-4 h-4 text-[#204060]" />
                  <span>Especificações Técnicas</span>
                </div>
                {selectedProduct.specs.material && (
                  <div><strong className="text-slate-800">Material:</strong> {selectedProduct.specs.material}</div>
                )}
                {selectedProduct.specs.dimensions && (
                  <div><strong className="text-slate-800">Dimensões:</strong> {selectedProduct.specs.dimensions}</div>
                )}
              </div>
            )}
          </div>

          {/* CONFIGURATION COLUMN */}
          <div className="space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedProduct.name}
                </h2>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedProduct.description}
              </p>

              {/* COLOR SWATCH SELECTOR */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[#204060]" />
                    <span>COR DO VIDRO:</span>
                  </label>
                  <span className="text-xs font-extrabold text-[#204060]">{selectedColor}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {colorsList.map((colorName) => {
                    const isSelected = selectedColor === colorName;
                    const style = colorSwatches[colorName] || { bg: 'bg-slate-300', border: 'border-slate-400' };
                    return (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() => setSelectedColor(colorName)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-[#204060] text-white border-[#204060] shadow-md scale-[1.02]'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${style.bg} ${style.border} shrink-0`} />
                        <span className="truncate text-[11px]">{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GOLD RIM (BORDA DOURADA) TOGGLE OPTION */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-2 shadow-sm">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setHasGoldRim(!hasGoldRim)}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
                      <Sparkles className="w-4 h-4 text-amber-100" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-amber-950 block">Filete em Ouro 24k / Borda Dourada</span>
                      <span className="text-[10px] text-amber-800 font-medium block">Acabamento luxuoso aplicado à mão nas bordas do vidro</span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={hasGoldRim}
                    onChange={e => setHasGoldRim(e.target.checked)}
                    className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* PERSONALIZATION TECHNIQUE SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                  TÉCNICA DE ACABAMENTO / PERSONALIZAÇÃO:
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {selectedProduct.custom_options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedOption(option)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                        selectedOption === option
                          ? 'bg-[#204060] text-white border-[#204060] shadow-md'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{option}</span>
                      {selectedOption === option && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY CONTROLS */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    QUANTIDADE SOLICITADA:
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    (Mínimo: {selectedProduct.moq} un.)
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl bg-slate-100 border border-slate-300 p-1">
                    <button
                      onClick={handleDecrement}
                      className="p-2 rounded-lg bg-white text-slate-700 hover:text-slate-900 shadow-sm transition-transform active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-black text-slate-900 text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="p-2 rounded-lg bg-white text-slate-700 hover:text-slate-900 shadow-sm transition-transform active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      SUBTOTAL DA PEÇA
                    </span>
                    <span className="text-2xl font-black text-[#204060]">
                      {formatCurrency(lineSubtotal)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* ADD TO QUOTE ACTION BUTTON */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-2xl brand-gradient-bg font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-transform text-white uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>ADICIONAR AO ORÇAMENTO</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
