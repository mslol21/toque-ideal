'use client';

import React, { useState } from 'react';
import { useShowroom } from '@/lib/store';
import { formatCurrency, generateQuoteId, buildWhatsAppUrl } from '@/lib/utils';
import { saveQuoteToStore, logAnalyticsEvent } from '@/lib/supabase';
import {
  X,
  Send,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  QrCode,
  Lock,
  Palette,
} from 'lucide-react';

export const QuoteModal: React.FC = () => {
  const {
    cartItems,
    isQuoteModalOpen,
    setIsQuoteModalOpen,
    cartTotals,
    clearCart,
    openQRModal,
  } = useShowroom();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [notes, setNotes] = useState('');

  const [submittedQuoteNumber, setSubmittedQuoteNumber] = useState<string | null>(null);

  if (!isQuoteModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quoteNum = generateQuoteId();

    const clientData = {
      name,
      company,
      whatsapp,
      email,
      city,
      state,
      notes,
    };

    await saveQuoteToStore(
      quoteNum,
      clientData,
      cartItems,
      cartTotals.subtotal,
      cartTotals.discountAmount,
      cartTotals.totalAmount,
      notes
    );

    logAnalyticsEvent('quote_submitted', undefined, undefined, {
      quoteNum,
      totalAmount: cartTotals.totalAmount,
      itemCount: cartItems.length,
    });

    setSubmittedQuoteNumber(quoteNum);
  };

  const handleOpenWhatsApp = () => {
    if (!submittedQuoteNumber) return;
    const url = buildWhatsAppUrl(
      whatsapp,
      submittedQuoteNumber,
      name,
      company,
      cartItems,
      cartTotals.totalAmount
    );
    window.open(url, '_blank');
    logAnalyticsEvent('whatsapp_clicked', undefined, undefined, { quoteNum: submittedQuoteNumber });
  };

  const handleClose = () => {
    if (submittedQuoteNumber) {
      clearCart();
    }
    setSubmittedQuoteNumber(null);
    setIsQuoteModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedQuoteNumber ? (
          /* SUCCESS SCREEN WITH WHATSAPP LINK & QR CODE GENERATOR */
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
                ORÇAMENTO GERADO COM SUCESSO!
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900">
                N° {submittedQuoteNumber}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Seu pedido foi registrado na equipe comercial Toque Ideal. Clique abaixo para enviar pelo WhatsApp oficial ou gerar o QR Code de acompanhamento.
              </p>
            </div>

            {/* ORDER SUMMARY PREVIEW */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Cliente / Empresa:</span>
                <span className="font-bold text-slate-900">{name} ({company})</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Total de Peças:</span>
                <span className="font-bold text-slate-900">{cartTotals.totalUnits} un.</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Valor Total Estimado:</span>
                <span className="text-[#204060] font-extrabold">{formatCurrency(cartTotals.totalAmount)}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2.5 uppercase tracking-wider"
              >
                <Send className="w-5 h-5 text-white" />
                <span>ENVIAR ORÇAMENTO VIA WHATSAPP</span>
              </button>

              <button
                onClick={() => {
                  const url = buildWhatsAppUrl(
                    whatsapp,
                    submittedQuoteNumber,
                    name,
                    company,
                    cartItems,
                    cartTotals.totalAmount
                  );
                  openQRModal(
                    `Orçamento N° ${submittedQuoteNumber}`,
                    url,
                    `Escaneie para abrir no celular de ${name}`
                  );
                }}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#204060]" />
                <span>GERAR QR CODE PARA CELULAR</span>
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#204060] text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#204060]" />
                <span>FINALIZAÇÃO DO ORÇAMENTO</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Dados do Cliente & Empresa
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Preencha os campos abaixo para receber a proposta comercial formalizada.
              </p>
            </div>

            {/* ORDER ITEMS SUMMARY */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-extrabold text-[#204060] uppercase tracking-wider block text-[10px]">
                RESUMO DO SEU PEDIDO ({cartTotals.totalUnits} PEÇAS)
              </span>
              <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-700 font-medium">
                    <span className="truncate max-w-[240px]">
                      {item.quantity}x {item.product.name}
                      {item.selectedColor ? ` (${item.selectedColor})` : ''}
                      {item.hasGoldRim ? ' ✨ Borda Dourada' : ''}
                    </span>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatCurrency(item.lineSubtotal)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                <span>Valor Total Estimado:</span>
                <span className="text-[#204060] text-base">{formatCurrency(cartTotals.totalAmount)}</span>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Nome Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Dra. Mariana Costa"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#204060]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Razão Social / Nome da Empresa *</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Ex: Costa & Associados Arquitetura"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#204060]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">WhatsApp com DDD *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="(11) 96776-7364"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#204060]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">E-mail Comercial *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="contato@empresa.com.br"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#204060]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-slate-700 font-bold block mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="São Paulo"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">UF</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="SP"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Observações do Orçamento</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Prazo de entrega desejado ou gravação personalizada."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl brand-gradient-bg font-extrabold text-sm shadow-xl hover:scale-[1.01] transition-transform text-white uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-white" />
                <span>GERAR PROPOSTA COMERCIAL</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
