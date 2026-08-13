'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShowroom } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { X, Trash2, Plus, Minus, QrCode, ArrowRight, ShoppingBag, Percent } from 'lucide-react';

export const QuoteDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    setIsQuoteModalOpen,
    openQRModal,
    cartTotals,
  } = useShowroom();

  if (!isCartOpen) return null;

  const handleOpenQRForCart = () => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      openQRModal(
        'Leve seu Pedido para o Celular',
        currentUrl,
        `Contém ${cartTotals.totalUnits} itens | Total estimado: ${formatCurrency(cartTotals.totalAmount)}`
      );
    }
  };

  const handleProceedToQuote = () => {
    setIsCartOpen(false);
    setIsQuoteModalOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
        
        {/* OVERLAY CLICK TO CLOSE */}
        <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

        {/* DRAWER CONTENT */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-lg h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between z-10"
        >
          
          {/* DRAWER HEADER */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Seu Pedido Comercial</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {cart.length} {cart.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2.5 rounded-xl bg-slate-200/60 text-slate-600 hover:text-slate-900 border border-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ITEM LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 hover:border-[#204060] transition-colors shadow-sm"
                >
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#204060] font-bold">
                      Opção: {item.selectedOption}
                    </p>

                    {item.customNotes && (
                      <p className="text-[10px] text-slate-500 italic">
                        "{item.customNotes}"
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      {/* QUANTITY CONTROL */}
                      <div className="flex items-center rounded-lg bg-white border border-slate-300 shadow-sm">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 10)}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 10)}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-slate-900">
                        {formatCurrency(item.lineSubtotal)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8 text-[#204060]" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Seu pedido está vazio</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Navegue pelo catálogo e adicione produtos para montar sua solicitação comercial.
                </p>
              </div>
            )}
          </div>

          {/* DRAWER FOOTER */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal dos Itens:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(cartTotals.subtotal)}</span>
                </div>

                {cartTotals.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" />
                      Desconto Volume ({cartTotals.discountPercentage * 100}%):
                    </span>
                    <span>-{formatCurrency(cartTotals.discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                  <span>Valor Estimado Total:</span>
                  <span className="text-lg text-[#204060]">{formatCurrency(cartTotals.totalAmount)}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenQRForCart}
                  title="Gerar QR Code para enviar esta lista ao seu celular"
                  className="p-3.5 rounded-2xl bg-white border border-slate-300 hover:border-[#204060] text-slate-700 hover:text-[#204060] transition-colors shadow-sm"
                >
                  <QrCode className="w-5 h-5 text-[#204060]" />
                </button>

                <button
                  onClick={handleProceedToQuote}
                  className="flex-1 py-4 rounded-2xl brand-gradient-bg font-extrabold text-sm shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-white uppercase tracking-wider"
                >
                  <span>SOLICITAR ORÇAMENTO</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
