'use client';

import React from 'react';
import { Phone, Mail, MapPin, Lock } from 'lucide-react';
import { Logo } from './Logo';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* BRAND COL */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" theme="dark" />
            <p className="text-slate-400 text-xs leading-relaxed pt-2">
              Fabricante especializada em peças decorativas em vidro e objetos de design de alto padrão.
            </p>
          </div>

          {/* CONTACT COL WITH REAL DETAILS */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[#90CDF4]">
              Atendimento Comercial
            </h4>
            <ul className="space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#90CDF4]" />
                <a href="https://wa.me/5511967767364" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  (11) 96776-7364 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#90CDF4]" />
                <a href="mailto:comercial@toqueideal.com.br" className="hover:text-white transition-colors">
                  comercial@toqueideal.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-[#90CDF4]" />
                <a href="https://www.instagram.com/toque.ideal/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  @toque.ideal
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#90CDF4]" />
                <span>São Paulo - SP | Atendimento Nacional</span>
              </li>
            </ul>
          </div>

          {/* CATEGORIES COL */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[#90CDF4]">
              Nossas Linhas
            </h4>
            <ul className="space-y-1.5 text-slate-300 font-medium">
              <li>• Peças Decorativas em Vidro</li>
              <li>• Esculturas & Centros de Mesa</li>
              <li>• Coleção Exclusiva ABCasa Fair</li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT & DISCREET ADMIN LOCK ACCESS */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} Toque Ideal — Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Showroom Digital Corporativo</span>
            
            {/* DISCREET LOCK LINK FOR STAFF */}
            <a
              href="/admin"
              className="text-slate-600 hover:text-slate-300 transition-colors p-1"
              title="Acesso Restrito da Equipe"
            >
              <Lock className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
