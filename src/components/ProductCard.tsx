'use client';

import React from 'react';
import { Product } from '@/types';
import { useShowroom } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Eye, Plus, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProductDetail } = useShowroom();

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800';
  const hasDiscount = Boolean(product.promo_price && product.promo_price < product.price);
  const currentPrice = product.promo_price || product.price;

  return (
    <div className="glass-panel rounded-3xl border border-slate-200 bg-white overflow-hidden flex flex-col hover:border-[#204060] hover:shadow-[0_20px_40px_rgba(32,64,96,0.12)] transition-all duration-300 group">
      
      {/* IMAGE CONTAINER */}
      <div className="relative h-72 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProductDetail(product)}>
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.is_launch && (
            <span className="px-3 py-1 rounded-full bg-[#204060] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              LANÇAMENTO
            </span>
          )}
          {hasDiscount && (
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              OFERTA
            </span>
          )}
          {product.is_featured && !product.is_launch && (
            <span className="px-3 py-1 rounded-full bg-[#204060] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#90CDF4]" /> DESTAQUE
            </span>
          )}
        </div>

        {/* SKU BADGE */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 text-[10px] font-mono font-bold shadow-sm">
          CÓD: {product.sku}
        </div>

        {/* OVERLAY QUICK VIEW BUTTON */}
        <div className="absolute inset-0 bg-[#0f172a]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductDetail(product);
            }}
            className="px-5 py-2.5 rounded-xl bg-white text-[#204060] font-extrabold text-xs flex items-center gap-2 shadow-xl hover:bg-slate-50 transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4 text-[#204060]" /> Ver detalhes
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* CATEGORY & MOQ */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#204060] font-extrabold uppercase tracking-wider text-[11px]">{product.category_name || 'Catálogo'}</span>
            <span className="text-slate-500 text-[11px] font-semibold">Qtd Mínima: <strong className="text-slate-900">{product.moq} un.</strong></span>
          </div>

          {/* TITLE */}
          <h3
            onClick={() => setSelectedProductDetail(product)}
            className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-[#204060] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {/* SHORT DESC */}
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {product.short_desc}
          </p>

          {/* CUSTOMIZATION OPTIONS TAGS */}
          <div className="pt-1 flex flex-wrap gap-1">
            {product.custom_options.slice(0, 3).map((opt, i) => (
              <span
                key={i}
                className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium"
              >
                {opt}
              </span>
            ))}
            {product.custom_options.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                +{product.custom_options.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* PRICING & ACTIONS */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">A partir de</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-slate-900">
                {formatCurrency(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProductDetail(product)}
              title="Ver detalhes do produto"
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-[#204060] text-slate-700 hover:text-[#204060] transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => addToCart(product)}
              title="Adicionar produto ao orçamento comercial"
              className="px-4 py-2.5 rounded-xl brand-gradient-bg font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform text-white uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
