'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useShowroom } from '@/lib/store';
import { ProductCard } from './ProductCard';
import { getProductsFromStore, getCategoriesFromStore } from '@/lib/supabase';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { Product, Category } from '@/types';
import { Search, ArrowUpDown, Sparkles, PackageX } from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useShowroom();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [pData, cData] = await Promise.all([
        getProductsFromStore(),
        getCategoriesFromStore(),
      ]);
      setProducts(pData);
      setCategories(cData);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.short_desc.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeCategory === 'all') return true;
        if (activeCategory === 'lancamentos') return product.is_launch;
        if (activeCategory === 'mais-vendidos') return product.is_featured;

        return product.category_id === activeCategory || product.category_name?.toLowerCase() === activeCategory.toLowerCase();
      })
      .sort((a, b) => {
        const priceA = a.promo_price || a.price;
        const priceB = b.promo_price || b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section id="catalogo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#204060] font-bold text-xs uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4 text-[#204060]" />
            <span>COLEÇÃO & CATÁLOGO VISUAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0f172a]">
            Nossas Peças Decorativas
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl font-medium">
            Arte em vidro e design com propósito. Coleções com padrão único de modernidade, qualidade e elegância, pensadas para atender clientes exigentes.
          </p>
        </div>

        {/* SEARCH & SORT CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* SEARCH BAR */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por peça ou SKU..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#204060] shadow-sm transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-semibold"
              >
                Limpar
              </button>
            )}
          </div>

          {/* SORT DROPDOWN */}
          <div className="relative w-full sm:w-auto flex items-center gap-2 px-3.5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm shadow-sm">
            <ArrowUpDown className="w-4 h-4 text-[#204060]" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer pr-4"
            >
              <option value="popular">Mais Populares</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="name">Nome (A-Z)</option>
            </select>
          </div>

        </div>
      </div>

      {/* CATEGORY FILTER PILLS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-5 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all border ${
            activeCategory === 'all'
              ? 'brand-gradient-bg border-transparent shadow-lg text-white'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-[#204060]/40 shadow-sm'
          }`}
        >
          Todas as Peças
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all border flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'brand-gradient-bg border-transparent shadow-lg text-white'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-[#204060]/40 shadow-sm'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="glass-panel h-96 rounded-3xl animate-pulse p-4 space-y-4">
              <div className="w-full h-56 bg-slate-200 rounded-2xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 border border-slate-200 bg-white shadow-xl">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <PackageX className="w-8 h-8 text-[#204060]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Nenhuma peça encontrada</h3>
          <p className="text-slate-500 text-xs">
            Não encontramos resultados para a busca "{searchQuery}". Tente limpar os filtros ou selecionar outra categoria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="px-6 py-3 rounded-xl brand-gradient-bg font-extrabold text-xs shadow-md text-white"
          >
            Ver catálogo completo
          </button>
        </div>
      )}

    </section>
  );
};
