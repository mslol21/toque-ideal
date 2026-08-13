'use client';

import React from 'react';
import { Product } from '@/types';
import { useShowroom } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Eye, Plus, Sparkles, Check, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const colorMap: Record<string, string> = {
  'Verde Esmeralda': 'bg-emerald-600',
  'Âmbar Dourado': 'bg-amber-500',
  'Azul Cobalto': 'bg-blue-600',
  'Fumê Cristal': 'bg-slate-700',
  'Incolor / Transparente': 'bg-slate-200 border border-slate-300',
  'Rubi Imperial': 'bg-rose-600',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, cartItems } = useShowroom();

  const isAlreadyInCart = cartItems.some(item => item.product.id === product.id);

  const displayPrice = product.promo_price || product.price;
  const hasPromo = Boolean(product.promo_price && product.promo_price < product.price);

  const handleAddToCartQuick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultColor = product.available_colors && product.available_colors.length > 0 ? product.available_colors[0] : 'Incolor / Transparente';
    addToCart(product, product.moq || 1, 'Gravação Laser no Vidro', defaultColor, Boolean(product.has_gold_rim_option));
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group cursor-pointer rounded-3xl bg-white border border-slate-200/90 hover:border-[#204060]/50 p-4 transition-all duration-300 hover:shadow-xl flex flex-col justify-between relative overflow-hidden"
    >

      {/* TOP IMAGE CONTAINER */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* BADGES OVERLAY */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {product.is_launch && (
            <span className="px-2.5 py-1 rounded-full brand-gradient-bg text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              Lançamento
            </span>
          )}
          {product.has_gold_rim_option && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/95 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Borda Dourada</span>
            </span>
          )}
        </div>

        {/* QUICK VIEW BUTTON OVERLAY */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <span className="px-4 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-lg flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#204060]" />
            <span>Ver Detalhes & Cores</span>
          </span>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-extrabold text-[#204060] uppercase tracking-wider">
              {product.category_name || 'Vidro Decorativo'}
            </span>
            <span className="font-mono text-slate-400 font-bold">
              SKU: {product.sku}
            </span>
          </div>

          <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#204060] transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">
            {product.short_desc}
          </p>
        </div>

        {/* COLOR PALETTE DOTS */}
        {product.available_colors && product.available_colors.length > 0 && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#204060]" />
              <span>Cores:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {product.available_colors.map((c, idx) => (
                <span
                  key={idx}
                  title={c}
                  className={`w-3.5 h-3.5 rounded-full shadow-sm ${colorMap[c] || 'bg-slate-400'}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* PRICE & ADD ACTION FOOTER */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Preço Estimado
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-slate-900">
                {formatCurrency(displayPrice)}
              </span>
              {hasPromo && (
                <span className="text-xs text-slate-400 line-through font-semibold">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCartQuick}
            className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-md ${
              isAlreadyInCart
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'brand-gradient-bg text-white hover:scale-105'
            }`}
            title="Adicionar ao Orçamento"
          >
            {isAlreadyInCart ? (
              <Check className="w-4 h-4" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="text-xs font-extrabold hidden sm:inline uppercase tracking-wider">
                  Adicionar
                </span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
