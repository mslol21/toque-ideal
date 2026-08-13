'use client';

import React from 'react';
import { useShowroom } from '@/lib/store';
import { formatCurrency, calculateCartTotals } from '@/lib/utils';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Palette,
} from 'lucide-react';

export const QuoteDrawer: React.FC = () => {
  const {
    cartItems,
    isQuoteDrawerOpen,
    setIsQuoteDrawerOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    setIsQuoteModalOpen,
  } = useShowroom();

  if (!isQuoteDrawerOpen) return null;

  const { subtotal, totalUnits, discountPercentage, discountAmount, totalAmount } =
    calculateCartTotals(cartItems);

  const handleProceedToCheckout = () => {
    setIsQuoteDrawerOpen(false);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* DRAWER HEADER */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#204060] flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Seu Orçamento</h3>
              <span className="text-xs text-slate-500 font-medium">
                {totalUnits} {totalUnits === 1 ? 'peça selecionada' : 'peças selecionadas'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsQuoteDrawerOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DRAWER ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-all"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                />

                <div className="flex-1 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs leading-tight">
                    {item.product.name}
                  </h4>

                  {/* COLOR & GOLD RIM BADGES */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {item.selectedColor && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center gap-1">
                        <Palette className="w-2.5 h-2.5 text-[#204060]" />
                        <span>{item.selectedColor}</span>
                      </span>
                    )}

                    {item.hasGoldRim && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[10px] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                        <span>Borda Dourada</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium block">
                    Técnica: {item.selectedOption}
                  </span>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-lg bg-slate-100 border border-slate-200 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-extrabold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatCurrency(item.lineSubtotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Remover peça"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8 text-[#204060]" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Seu orçamento está vazio</h4>
              <p className="text-slate-500 text-xs max-w-xs mx-auto">
                Navegue pelo catálogo e selecione as peças decorativas que deseja incluir no seu pedido.
              </p>
            </div>
          )}
        </div>

        {/* DRAWER FOOTER WITH TOTALS */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal ({totalUnits} peças):</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Desconto de Escala ({discountPercentage * 100}%):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Valor Total Estimado:</span>
                <span className="text-[#204060]">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 rounded-2xl brand-gradient-bg font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-transform text-white uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>FINALIZAR E SOLICITAR ORÇAMENTO</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={clearCart}
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 text-center block"
            >
              Esvaziar Orçamento
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
