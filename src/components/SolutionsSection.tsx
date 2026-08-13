'use client';

import React from 'react';
import { useShowroom } from '@/lib/store';
import { Calendar, Gift, Megaphone, Sparkles, Layers3, Lightbulb, ArrowRight } from 'lucide-react';

export const SolutionsSection: React.FC = () => {
  const { setActiveCategory } = useShowroom();

  const scrollToCatalog = (catId?: string) => {
    if (catId) setActiveCategory(catId);
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const solutions = [
    {
      icon: Calendar,
      title: 'Eventos & Decor Corporativo',
      description: 'Troféus de destaque, placas de comemoração de metas e centros de mesa para convenções e feiras.',
      catId: 'trofeus',
    },
    {
      icon: Gift,
      title: 'Brindes VIP & Endomarketing',
      description: 'Kits executivos, taças metalizadas e presentes corporativos refinados para encantar clientes.',
      catId: 'brindes-corporativos',
    },
    {
      icon: Megaphone,
      title: 'Campanhas Promocionais',
      description: 'Copos long drink e taças em larga escala para grandes ativações de marca e lançamento de produtos.',
      catId: 'tacas-copos',
    },
    {
      icon: Sparkles,
      title: 'Peças em Vidro Personalizadas',
      description: 'Artefatos gravados com o seu logotipo em corte CNC laser, lapidação artesanal ou impressão UV LED.',
      catId: 'pecas-decorativas-vidro',
    },
    {
      icon: Layers3,
      title: 'Grandes Volumes & Atacado',
      description: 'Capacidade fabril para produzir milhares de unidades com preço direto de fábrica e prazo garantido.',
      catId: 'home-decor',
    },
    {
      icon: Lightbulb,
      title: 'Projetos Especiais & Feiras',
      description: 'Desenvolvimento de expositores em acrílico iluminado com LED, maquetes e peças conceituais sob medida.',
      catId: 'all',
    },
  ];

  return (
    <section id="solucoes" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* SECTION HEADER */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/80 border border-slate-300 text-[#204060] text-xs font-extrabold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-[#204060]" />
          <span>SOLUÇÕES PARA SUA MARCA</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Desenvolvido sob medida para cada necessidade
        </h2>
        <p className="text-slate-600 text-sm font-medium">
          Seja para decor de interiores, uma premiação VIP ou grandes lotes promocionais, temos a solução ideal.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => scrollToCatalog(item.catId)}
              className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white hover:border-[#204060] hover:shadow-[0_20px_40px_rgba(32,64,96,0.12)] cursor-pointer transition-all duration-300 group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-[#204060] transition-colors">
                  <Icon className="w-6 h-6 text-[#204060] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#204060] transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs font-extrabold text-[#204060] group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                <span>Explorar soluções</span>
                <ArrowRight className="w-4 h-4 text-[#204060]" />
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
