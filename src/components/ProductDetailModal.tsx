'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShowroom } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { PersonalizationOption } from '@/types';
import { X, Plus, Minus, QrCode, Check, ShoppingBag, Info } from 'lucide-react';
import { logAnalyticsEvent } from '@/lib/supabase';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    openQRModal,
  } = useShowroom();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<PersonalizationOption>('Gravação Laser');
  const [customNotes, setCustomNotes] = useState('');

  const product = selectedProductDetail;

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(product.moq || 1);
      setSelectedOption(product.custom_options[0] || 'Gravação Laser');
      setCustomNotes('');
      logAnalyticsEvent('product_view', product.id, product.name);
    }
  }, [product]);

  if (!product) return null;

  const currentPrice = product.promo_price || product.price;
  const lineTotal = currentPrice * quantity;
  const images = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOption, customNotes);
    setSelectedProductDetail(null);
  };

  const handleShareQR = () => {
    if (typeof window !== 'undefined') {
      openQRModal(
        product.name,
        window.location.href,
        `Cód: ${product.sku} | Preço: ${formatCurrency(currentPrice)}`
      );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        
        {/* MODAL CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* LEFT: GALLERY */}
            <div className="p-6 sm:p-8 bg-slate-50 flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-r border-slate-200">
              
              {/* MAIN ACTIVE IMAGE */}
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-200 group shadow-inner">
                <img
                  src={images[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* SKU BADGE */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 text-xs font-mono font-bold shadow-sm">
                  SKU: {product.sku}
                </div>
              </div>

              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-[#204060] scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* TECHNICAL SPECS */}
              {product.specs && (
                <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-[#204060] flex items-center gap-1.5 uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5 text-[#204060]" /> Especificações Técnicas
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                    {product.specs.material && (
                      <div><span className="text-slate-400">Material:</span> {product.specs.material}</div>
                    )}
                    {product.specs.capacity && (
                      <div><span className="text-slate-400">Capacidade:</span> {product.specs.capacity}</div>
                    )}
                    {product.specs.dimensions && (
                      <div><span className="text-slate-400">Dimensões:</span> {product.specs.dimensions}</div>
                    )}
                    {product.specs.weight && (
                      <div><span className="text-slate-400">Peso:</span> {product.specs.weight}</div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT: DETAILS & CUSTOMIZATION */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
              
              <div className="space-y-4">
                
                {/* CATEGORY & TITLE */}
                <div>
                  <span className="text-xs font-extrabold text-[#204060] uppercase tracking-wider">
                    {product.category_name || 'Toque Ideal Showroom'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    {product.name}
                  </h2>
                </div>

                {/* DESCRIPTION */}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* PRICING & MOQ */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Preço unitário estimado</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-slate-900">
                        {formatCurrency(currentPrice)}
                      </span>
                      {product.promo_price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Qtd. Mínima (MOQ)</span>
                    <span className="text-sm font-extrabold text-[#204060]">
                      {product.moq} unidades
                    </span>
                  </div>
                </div>

                {/* PERSONALIZATION OPTIONS SELECTOR */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                    Técnica de Personalização
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.custom_options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                          selectedOption === opt
                            ? 'bg-[#204060] text-white border-[#204060] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedOption === opt && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CUSTOM NOTES */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Observações de Gravação / Logotipo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={e => setCustomNotes(e.target.value)}
                    placeholder="Ex: Gravar logo da empresa em ambos os lados"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#204060]"
                  />
                </div>

                {/* QUANTITY SELECTOR */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Quantidade Desejada
                    </label>
                    <span className="text-xs text-[#204060] font-bold">
                      Subtotal: <strong>{formatCurrency(lineTotal)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1">
                      <button
                        onClick={() => setQuantity(prev => Math.max(product.moq || 1, prev - 10))}
                        className="p-2 text-slate-600 hover:text-slate-900 font-bold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={product.moq || 1}
                        value={quantity}
                        onChange={e => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || (product.moq || 1)))}
                        className="w-16 text-center bg-transparent text-slate-900 font-extrabold text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(prev => prev + 10)}
                        className="p-2 text-slate-600 hover:text-slate-900 font-bold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-xs text-slate-400">
                      (Passo de 10 em 10)
                    </span>
                  </div>
                </div>

              </div>

              {/* ACTIONS */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                <button
                  onClick={handleShareQR}
                  title="Gerar QR Code para visualizar este produto no seu celular"
                  className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 hover:border-[#204060] text-slate-700 hover:text-[#204060] transition-colors"
                >
                  <QrCode className="w-5 h-5 text-[#204060]" />
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 rounded-2xl brand-gradient-bg font-extrabold text-sm shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 text-white uppercase tracking-wider"
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <span>ADICIONAR AO PEDIDO</span>
                </button>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
