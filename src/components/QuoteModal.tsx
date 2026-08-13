'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShowroom } from '@/lib/store';
import { formatCurrency, generateQuoteId, buildWhatsAppUrl } from '@/lib/utils';
import { saveQuoteToStore, logAnalyticsEvent } from '@/lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, MessageCircle, QrCode, Building, User, Phone, Mail, MapPin, Sparkles, Send } from 'lucide-react';
import { Quote } from '@/types';

export const QuoteModal: React.FC = () => {
  const {
    cart,
    clearCart,
    isQuoteModalOpen,
    setIsQuoteModalOpen,
    cartTotals,
  } = useShowroom();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<Quote | null>(null);

  if (!isQuoteModalOpen) return null;

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !whatsapp || !email) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Empresa, WhatsApp e E-mail).');
      return;
    }

    setLoading(true);

    const quoteNumber = generateQuoteId();
    const clientData = { name, company, whatsapp, email, city, state, notes };

    try {
      const quoteResult = await saveQuoteToStore(
        quoteNumber,
        clientData,
        cart,
        cartTotals.subtotal,
        cartTotals.discountAmount,
        cartTotals.totalAmount,
        notes
      );

      logAnalyticsEvent('quote_submitted', undefined, quoteNumber, {
        totalAmount: cartTotals.totalAmount,
        itemCount: cart.length,
      });

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#204060', '#2563EB', '#3B82F6', '#FFFFFF'],
        });
      } catch (e) {}

      setSubmittedQuote(quoteResult);
      clearCart();
    } catch (err) {
      console.error('Erro ao enviar orçamento:', err);
      alert('Ocorreu um problema ao salvar seu orçamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!submittedQuote) return;
    const url = buildWhatsAppUrl(
      submittedQuote.client.whatsapp,
      submittedQuote.quote_number,
      submittedQuote.client.name,
      submittedQuote.client.company,
      submittedQuote.items,
      submittedQuote.total_amount
    );

    logAnalyticsEvent('whatsapp_clicked', undefined, submittedQuote.quote_number);
    window.open(url, '_blank');
  };

  const handleClose = () => {
    setSubmittedQuote(null);
    setIsQuoteModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8 my-8"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>

          {!submittedQuote ? (
            /* FORM STATE */
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-[#204060] font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-[#204060]" />
                  <span>FINALIZAR SOLICITAÇÃO COMERCIAL</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Solicitar Orçamento Personalizado
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Preencha seus dados de contato para que nossa equipe comercial envie a cotação formal.
                </p>
              </div>

              {/* SUMMARY BOX */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase">Itens Selecionados</span>
                  <span className="font-bold text-slate-900 text-sm">{cartTotals.totalUnits} unidades</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-semibold block uppercase">Total Estimado</span>
                  <span className="font-extrabold text-[#204060] text-base">{formatCurrency(cartTotals.totalAmount)}</span>
                </div>
              </div>

              {/* FORM FIELDS */}
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* NOME */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#204060]" /> Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#204060]"
                    />
                  </div>

                  {/* EMPRESA */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#204060]" /> Sua Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="Ex: Grupo Inovação S/A"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#204060]"
                    />
                  </div>

                  {/* WHATSAPP */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#204060]" /> WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="Ex: (11) 96776-7364"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#204060]"
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#204060]" /> E-mail Comercial *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Ex: contato@suaempresa.com.br"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#204060]"
                    />
                  </div>

                  {/* CIDADE */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#204060]" /> Cidade / Estado
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Cidade (ex: São Paulo)"
                        className="col-span-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#204060]"
                      />
                      <input
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        placeholder="UF (ex: SP)"
                        className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#204060] uppercase"
                      />
                    </div>
                  </div>

                </div>

                {/* OBSERVAÇÕES */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Observações ou Prazos Especiais do Evento
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Conte-nos se precisa para uma data específica ou detalhes de logotipo..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#204060]"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl brand-gradient-bg font-extrabold text-base shadow-xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 mt-4 text-white uppercase tracking-wider"
                >
                  {loading ? (
                    <span>Gerando Orçamento...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5 text-white" />
                      <span>GERAR ORÇAMENTO AGORA</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          ) : (
            /* SUCCESS STATE WITH QR CODE & WHATSAPP BUTTON */
            <div className="text-center space-y-6 py-4">
              
              <div className="w-16 h-16 rounded-full bg-[#204060]/10 border border-[#204060] flex items-center justify-center mx-auto text-[#204060]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ORÇAMENTO REGISTRADO COM SUCESSO!
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  N° {submittedQuote.quote_number}
                </h2>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Sua solicitação foi salva no nosso sistema comercial. Leve este orçamento com você ou envie pelo WhatsApp!
                </p>
              </div>

              {/* DYNAMIC QR CODE DISPLAY */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 inline-block mx-auto space-y-3 shadow-inner">
                <div className="p-3 bg-white rounded-2xl inline-block shadow-md">
                  <QRCodeSVG
                    value={window.location.href}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#204060] font-bold">
                  <QrCode className="w-4 h-4 text-[#204060]" />
                  <span>Escaneie para salvar no seu celular</span>
                </div>
              </div>

              {/* DIRECT WHATSAPP ACTION BUTTON */}
              <div className="space-y-3 max-w-sm mx-auto pt-2">
                <button
                  onClick={handleOpenWhatsApp}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                  <span>FALAR VIA WHATSAPP AGORA</span>
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200"
                >
                  Concluir e Voltar ao Showroom
                </button>
              </div>

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
