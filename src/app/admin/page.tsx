'use client';

import React, { useState, useEffect } from 'react';
import { Product, Quote, AnalyticsEvent, QuoteStatus, CartItem, PersonalizationOption, Category, GlassColorOption, ClientData } from '@/types';
import {
  getProductsFromStore,
  saveProductToStore,
  deleteProductFromStore,
  getQuotesFromStore,
  saveQuoteToStore,
  updateQuoteInStore,
  deleteQuoteFromStore,
  updateQuoteStatusInStore,
  getAnalyticsEvents,
  getCategoriesFromStore,
  saveCategoryToStore,
  deleteCategoryFromStore,
  getColorsFromStore,
  saveColorToStore,
  deleteColorFromStore,
  generateUUID,
} from '@/lib/supabase';
import { formatCurrency, generateQuoteId, buildWhatsAppUrl, calculateCartTotals } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard,
  Package,
  FileText,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Eye,
  DollarSign,
  TrendingUp,
  Search,
  ArrowLeft,
  X,
  Lock,
  LogOut,
  KeyRound,
  ShieldCheck,
  PlusCircle,
  Building,
  User,
  Phone,
  Mail,
  Send,
  Minus,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Award,
  Home,
  Gift,
  Star,
  Palette,
  MapPin,
  Kanban,
  ArrowRight,
  Clock,
  Check,
  ChevronRight,
  CreditCard,
  QrCode,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'pipeline' | 'categories' | 'colors' | 'products' | 'quotes' | 'new-quote' | 'analytics'>('dashboard');
  const [quoteViewMode, setQuoteViewMode] = useState<'kanban' | 'table'>('kanban');

  const [categories, setCategories] = useState<Category[]>([]);
  const [glassColors, setGlassColors] = useState<GlassColorOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [editingColor, setEditingColor] = useState<GlassColorOption | null>(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<Quote | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isEditQuoteModalOpen, setIsEditQuoteModalOpen] = useState(false);

  // Edit product color state
  const [formColors, setFormColors] = useState<string[]>([]);
  const [formHasGoldRim, setFormHasGoldRim] = useState<boolean>(true);

  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');

  // NEW ADMIN QUOTE GENERATOR WORKSTATION STATE
  const [adminOrderItems, setAdminOrderItems] = useState<CartItem[]>([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<string>('');
  const [addItemQty, setAddItemQty] = useState<number>(10);
  const [addItemOption, setAddItemOption] = useState<PersonalizationOption>('Gravação Laser no Vidro');
  const [addItemColor, setAddItemColor] = useState<string>('Verde Esmeralda');
  const [addItemGoldRim, setAddItemGoldRim] = useState<boolean>(true);
  const [addItemNotes, setAddItemNotes] = useState<string>('');

  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCep, setClientCep] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientNumber, setClientNumber] = useState('');
  const [clientNeighborhood, setClientNeighborhood] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientState, setClientState] = useState('SP');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [isSearchingCepAdmin, setIsSearchingCepAdmin] = useState(false);

  const [generatedQuoteSuccess, setGeneratedQuoteSuccess] = useState<Quote | null>(null);

  // VERIFY SESSION AUTHENTICATION
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = sessionStorage.getItem('toque_ideal_admin_auth');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const [cData, colData, pData, qData, aData] = await Promise.all([
      getCategoriesFromStore(),
      getColorsFromStore(),
      getProductsFromStore(),
      getQuotesFromStore(),
      getAnalyticsEvents(),
    ]);
    setCategories(cData);
    setGlassColors(colData);
    setProducts(pData);
    setQuotes(qData);
    setAnalytics(aData);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (editingProduct) {
      setFormColors(editingProduct.available_colors || glassColors.map(c => c.name));
      setFormHasGoldRim(editingProduct.has_gold_rim_option ?? true);
    } else {
      setFormColors(glassColors.map(c => c.name));
      setFormHasGoldRim(true);
    }
  }, [editingProduct, glassColors]);

  const handleAdminCepChange = async (val: string) => {
    setClientCep(val);
    const clean = val.replace(/\D/g, '');
    if (clean.length === 8) {
      setIsSearchingCepAdmin(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setClientAddress(data.logradouro || '');
          setClientNeighborhood(data.bairro || '');
          setClientCity(data.localidade || '');
          setClientState(data.uf || '');
        }
      } catch (e) {}
      setIsSearchingCepAdmin(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPins = ['2026', 'toqueideal', 'toqueideal2026'];
    if (validPins.includes(pinInput.trim().toLowerCase())) {
      setIsAuthenticated(true);
      sessionStorage.setItem('toque_ideal_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('toque_ideal_admin_auth');
  };

  // SAVE CATEGORY
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingCategory ? editingCategory.id : generateUUID();
    const name = formData.get('name') as string;

    const newCat: Category = {
      id,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      icon: (formData.get('icon') as string) || 'Sparkles',
      description: (formData.get('description') as string) || '',
      display_order: parseInt(formData.get('display_order') as string) || (categories.length + 1),
    };

    await saveCategoryToStore(newCat);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    loadAllData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Os produtos vinculados serão mantidos.')) {
      await deleteCategoryFromStore(id);
      loadAllData();
    }
  };

  // SAVE GLASS COLOR
  const handleSaveColor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingColor ? editingColor.id : generateUUID();
    const name = formData.get('name') as string;

    const newColor: GlassColorOption = {
      id,
      name,
      hex: (formData.get('hex') as string) || '#204060',
      is_active: formData.get('is_active') === 'on',
    };

    await saveColorToStore(newColor);
    setIsColorModalOpen(false);
    setEditingColor(null);
    loadAllData();
  };

  const handleDeleteColor = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta opção de cor do vidro?')) {
      await deleteColorFromStore(id);
      loadAllData();
    }
  };

  // DELETE QUOTE
  const handleDeleteQuote = async (quoteId: string) => {
    if (confirm('Tem certeza que deseja excluir permanentemente este orçamento?')) {
      await deleteQuoteFromStore(quoteId);
      if (selectedQuoteDetail?.id === quoteId) {
        setSelectedQuoteDetail(null);
      }
      loadAllData();
    }
  };

  // ADVANCE QUOTE STAGE IN KANBAN BOARD
  const handleAdvanceStage = async (quote: Quote) => {
    const stageOrder: QuoteStatus[] = [
      'Novo',
      'Em análise',
      'Orçamento enviado',
      'Negociação',
      'Aprovado',
      'Produção',
      'Concluído',
    ];
    const currentIdx = stageOrder.indexOf(quote.status);
    if (currentIdx >= 0 && currentIdx < stageOrder.length - 1) {
      const nextStatus = stageOrder[currentIdx + 1];
      await updateQuoteStatusInStore(quote.id, nextStatus);
      loadAllData();
    }
  };

  // SAVE EDITED QUOTE
  const handleSaveEditedQuote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingQuote) return;
    const formData = new FormData(e.currentTarget);

    const updatedClient: ClientData = {
      ...editingQuote.client,
      name: formData.get('client_name') as string,
      company: formData.get('client_company') as string,
      whatsapp: formData.get('client_whatsapp') as string,
      email: formData.get('client_email') as string,
      cep: formData.get('client_cep') as string,
      address: formData.get('client_address') as string,
      number: formData.get('client_number') as string,
      neighborhood: formData.get('client_neighborhood') as string,
      city: formData.get('client_city') as string,
      state: formData.get('client_state') as string,
    };

    const updatedQuote: Quote = {
      ...editingQuote,
      client: updatedClient,
      status: (formData.get('status') as QuoteStatus) || editingQuote.status,
      notes: formData.get('notes') as string,
    };

    await updateQuoteInStore(updatedQuote);
    setIsEditQuoteModalOpen(false);
    setEditingQuote(null);
    if (selectedQuoteDetail?.id === updatedQuote.id) {
      setSelectedQuoteDetail(updatedQuote);
    }
    loadAllData();
  };

  // ADD ITEM TO ADMIN ORDER WORKSTATION
  const handleAddProductToAdminOrder = () => {
    if (!selectedProductToAdd) return;
    const prod = products.find(p => p.id === selectedProductToAdd);
    if (!prod) return;

    const unitPrice = prod.promo_price || prod.price;
    const quantity = Math.max(prod.moq || 1, addItemQty);
    const lineSubtotal = unitPrice * quantity;

    const newItem: CartItem = {
      product: prod,
      quantity,
      selectedOption: addItemOption,
      selectedColor: addItemColor,
      hasGoldRim: addItemGoldRim,
      customNotes: addItemNotes,
      unitPrice,
      lineSubtotal,
    };

    setAdminOrderItems(prev => [...prev, newItem]);
    setSelectedProductToAdd('');
    setAddItemQty(10);
    setAddItemNotes('');
  };

  const handleRemoveAdminItem = (index: number) => {
    setAdminOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdminQtyChange = (index: number, newQty: number) => {
    setAdminOrderItems(prev =>
      prev.map((item, i) => {
        if (i === index) {
          const qty = Math.max(item.product.moq || 1, newQty);
          return {
            ...item,
            quantity: qty,
            lineSubtotal: item.unitPrice * qty,
          };
        }
        return item;
      })
    );
  };

  // CALCULATE TOTALS FOR ADMIN WORKSTATION
  const adminTotals = calculateCartTotals(adminOrderItems);

  // SUBMIT ADMIN ORDER / GENERATE QUOTE
  const handleCreateAdminQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminOrderItems.length === 0) {
      alert('Adicione pelo menos um produto ao pedido antes de gerar o orçamento.');
      return;
    }
    if (!clientName || !companyName || !clientWhatsapp || !clientEmail) {
      alert('Preencha os campos obrigatórios do cliente (Nome, Empresa, WhatsApp e E-mail).');
      return;
    }

    const quoteNumber = generateQuoteId();
    const clientData = {
      name: clientName,
      company: companyName,
      whatsapp: clientWhatsapp,
      email: clientEmail,
      cep: clientCep,
      address: clientAddress,
      number: clientNumber,
      neighborhood: clientNeighborhood,
      city: clientCity,
      state: clientState,
      notes: quoteNotes,
    };

    const savedQuote = await saveQuoteToStore(
      quoteNumber,
      clientData,
      adminOrderItems,
      adminTotals.subtotal,
      adminTotals.discountAmount,
      adminTotals.totalAmount,
      quoteNotes
    );

    setGeneratedQuoteSuccess(savedQuote);
    setAdminOrderItems([]);
    setClientName('');
    setCompanyName('');
    setClientWhatsapp('');
    setClientEmail('');
    setClientCep('');
    setClientAddress('');
    setClientNumber('');
    setClientNeighborhood('');
    setClientCity('');
    setQuoteNotes('');
    loadAllData();
  };

  // LOCK SCREEN FOR UNAUTHENTICATED USERS
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="flex justify-center">
            <Logo size="lg" theme="dark" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700/80 border border-slate-600 text-[#90CDF4] text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-[#90CDF4]" />
              <span>ACESSO RESTRITO À EQUIPE</span>
            </div>
            <h2 className="text-2xl font-black text-white">Painel Administrativo</h2>
            <p className="text-xs text-slate-400">
              Digite a senha ou código de acesso PIN para gerenciar produtos e orçamentos do estande.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={pinInput}
                  onChange={e => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Digite a senha (ex: 2026)..."
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900 border text-white text-center font-bold tracking-widest text-lg focus:outline-none transition-colors ${
                    pinError ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-[#2563eb]'
                  }`}
                />
              </div>

              {pinError && (
                <p className="text-xs text-red-400 font-bold">
                  Senha incorreta. Tente "2026" ou solicite a senha da equipe.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl brand-gradient-bg font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-transform text-white uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>DESBLOQUEAR PAINEL</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <a href="/" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Showroom
            </a>
            <span className="text-[10px] text-slate-500">Toque Ideal © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    );
  }

  const totalQuotesCount = quotes.length;
  const totalPipelineRevenue = quotes.reduce((acc, q) => acc + q.total_amount, 0);

  const newQuotesList = quotes.filter(q => q.status === 'Novo');
  const reviewQuotesList = quotes.filter(q => q.status === 'Em análise' || q.status === 'Orçamento enviado');
  const negociationQuotesList = quotes.filter(q => q.status === 'Negociação');
  const productionQuotesList = quotes.filter(q => q.status === 'Aprovado' || q.status === 'Produção');
  const completedQuotesList = quotes.filter(q => q.status === 'Concluído');

  const productViewCounts: Record<string, number> = {};
  const productAddCounts: Record<string, number> = {};

  analytics.forEach(evt => {
    if (evt.event_type === 'product_view' && evt.product_name) {
      productViewCounts[evt.product_name] = (productViewCounts[evt.product_name] || 0) + 1;
    }
    if (evt.event_type === 'product_add' && evt.product_name) {
      productAddCounts[evt.product_name] = (productAddCounts[evt.product_name] || 0) + 1;
    }
  });

  const topViewed = Object.entries(productViewCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topAdded = Object.entries(productAddCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingProduct ? editingProduct.id : generateUUID();
    const categoryId = formData.get('category_id') as string;

    const newProd: Product = {
      id,
      sku: formData.get('sku') as string,
      name: formData.get('name') as string,
      slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      short_desc: formData.get('short_desc') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      promo_price: formData.get('promo_price') ? parseFloat(formData.get('promo_price') as string) : null,
      moq: parseInt(formData.get('moq') as string) || 1,
      category_id: categoryId,
      category_name: categories.find(c => c.id === categoryId)?.name || 'Geral',
      is_active: formData.get('is_active') === 'on',
      is_featured: formData.get('is_featured') === 'on',
      is_launch: formData.get('is_launch') === 'on',
      custom_options: ['Gravação Laser no Vidro', 'Lapidação Especial', 'Filete em Ouro 24k / Borda Dourada', 'Embalagem Especial de Presente'],
      available_colors: formColors.length > 0 ? formColors : glassColors.map(c => c.name),
      has_gold_rim_option: formHasGoldRim,
      images: [
        (formData.get('image_url') as string) || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'
      ],
      specs: {
        material: formData.get('material') as string,
        capacity: formData.get('capacity') as string,
      }
    };

    await saveProductToStore(newProd);
    setIsProductModalOpen(false);
    setEditingProduct(null);
    loadAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto do catálogo?')) {
      await deleteProductFromStore(id);
      loadAllData();
    }
  };

  const handleUpdateStatus = async (quoteId: string, newStatus: QuoteStatus) => {
    await updateQuoteStatusInStore(quoteId, newStatus);
    loadAllData();
  };

  const filteredQuotes = quotes.filter(q => {
    if (quoteStatusFilter === 'all') return true;
    return q.status === quoteStatusFilter;
  });

  const filteredProducts = products.filter(p => {
    if (!productSearch) return true;
    return p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
  });

  const quoteStatuses: QuoteStatus[] = [
    'Novo',
    'Em análise',
    'Orçamento enviado',
    'Negociação',
    'Aprovado',
    'Produção',
    'Concluído',
    'Cancelado',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-8">
      
      {/* FULLY RESPONSIVE AUTHENTICATED ADMIN HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* TOP ROW FOR MOBILE: LOGO, SHOWROOM & BLOQUEAR */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
                title="Voltar ao Showroom"
              >
                <ArrowLeft className="w-4 h-4" /> Showroom
              </a>
              <Logo size="sm" theme="light" />
            </div>

            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 font-bold text-xs flex items-center gap-1 border border-slate-200 transition-colors shrink-0"
              title="Bloquear Painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* TABS MENU HORIZONTAL SCROLL BAR FOR ALL MOBILE AND TABLET SCREENS */}
          <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar shrink-0 border-t md:border-t-0 border-slate-100 pt-2 md:pt-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'dashboard' ? 'brand-gradient-bg shadow-md text-white' : 'text-slate-600 hover:text-slate-900 bg-slate-50 md:bg-transparent'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'pipeline' ? 'brand-gradient-bg shadow-md text-white' : 'text-slate-600 hover:text-slate-900 bg-slate-50 md:bg-transparent'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Esteira Kanban</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'categories' ? 'brand-gradient-bg shadow-md text-white' : 'text-slate-600 hover:text-slate-900 bg-slate-50 md:bg-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categorias</span>
            </button>

            <button
              onClick={() => setActiveTab('colors')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'colors' ? 'brand-gradient-bg shadow-md text-white' : 'text-slate-600 hover:text-slate-900 bg-slate-50 md:bg-transparent'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Cores</span>
            </button>

            <button
              onClick={() => setActiveTab('new-quote')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'new-quote' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Novo Orçamento</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'products' ? 'brand-gradient-bg shadow-md text-white' : 'text-slate-600 hover:text-slate-900 bg-slate-50 md:bg-transparent'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Produtos</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'quotes' ? 'brand-gradient-bg shadow-md text-white' : 'text-slate-600 hover:text-slate-900 bg-slate-50 md:bg-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Orçamentos</span>
              {quotes.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#204060] text-white text-[9px] flex items-center justify-center font-extrabold shadow">
                  {quotes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'analytics' ? 'brand-gradient-bg shadow-md text-white' : 'text-slate-600 hover:text-slate-900 bg-slate-50 md:bg-transparent'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* DESKTOP LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="hidden md:flex p-2.5 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 font-bold text-xs items-center gap-1.5 border border-slate-200 transition-colors shrink-0"
            title="Bloquear Painel / Sair"
          >
            <LogOut className="w-4 h-4" />
            <span>Bloquear</span>
          </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>ORÇAMENTOS RECEBIDOS</span>
                  <FileText className="w-4 h-4 text-[#204060]" />
                </div>
                <span className="text-3xl font-extrabold text-slate-900">{totalQuotesCount}</span>
                <span className="text-[11px] text-emerald-600 font-bold block">+100% de conversão digital</span>
              </div>

              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>VALOR EM PIPELINE</span>
                  <DollarSign className="w-4 h-4 text-[#204060]" />
                </div>
                <span className="text-3xl font-extrabold text-[#204060]">
                  {formatCurrency(totalPipelineRevenue)}
                </span>
                <span className="text-[11px] text-slate-500 block font-medium">Soma de orçamentos gerados</span>
              </div>

              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>CATÁLOGO ATIVO</span>
                  <Package className="w-4 h-4 text-[#204060]" />
                </div>
                <span className="text-3xl font-extrabold text-slate-900">{products.length}</span>
                <span className="text-[11px] text-slate-500 block font-medium">Produtos cadastrados</span>
              </div>

              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>INTERAÇÕES NO ESTANDE</span>
                  <TrendingUp className="w-4 h-4 text-[#204060]" />
                </div>
                <span className="text-3xl font-extrabold text-slate-900">{analytics.length}</span>
                <span className="text-[11px] text-[#2563eb] font-bold block">Eventos de navegação</span>
              </div>
            </div>

            {/* RANKINGS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#204060]" /> Peças Mais Visualizadas
                </h3>
                <div className="space-y-3">
                  {topViewed.length > 0 ? (
                    topViewed.map(([name, count], i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs border border-slate-100">
                        <span className="font-bold text-slate-800">{name}</span>
                        <span className="px-2.5 py-1 rounded-full bg-[#204060] text-white font-bold">
                          {count} views
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4">Nenhuma visualização registrada ainda.</p>
                  )}
                </div>
              </div>

              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#204060]" /> Peças Mais Adicionadas ao Pedido
                </h3>
                <div className="space-y-3">
                  {topAdded.length > 0 ? (
                    topAdded.map(([name, count], i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs border border-slate-100">
                        <span className="font-bold text-slate-800">{name}</span>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold">
                          {count} adicionados
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4">Nenhuma adição ao carrinho ainda.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ESTEIRA KANBAN OPERACIONAL TAB */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#204060]/10 border border-[#204060]/20 text-[#204060] text-xs font-bold uppercase tracking-wider mb-1">
                  <Kanban className="w-3.5 h-3.5 text-[#204060]" />
                  <span>PAINEL DE OPERAÇÃO & ESTEIRA KANBAN</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Gestão Visual de Orçamentos
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Acompanhe o fluxo comercial dos pedidos desde a cotação inicial até a produção e entrega.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('new-quote')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs flex items-center gap-2 shadow-md shrink-0 text-white uppercase tracking-wider"
              >
                <PlusCircle className="w-4 h-4 text-white" /> + NOVO ORÇAMENTO
              </button>
            </div>

            {/* METRICS CARDS LIKE SCREENSHOT 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">FATURAMENTO EM PIPELINE</span>
                <div className="text-xl sm:text-2xl font-black">{formatCurrency(totalPipelineRevenue)}</div>
                <span className="text-[10px] opacity-80 block">{quotes.length} orçamentos ativos</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">NOVOS PEDIDOS</span>
                <div className="text-xl sm:text-2xl font-black">{newQuotesList.length}</div>
                <span className="text-[10px] opacity-80 block">Aguardando atendimento</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-md space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">EM NEGOCIAÇÃO</span>
                <div className="text-xl sm:text-2xl font-black">{negociationQuotesList.length}</div>
                <span className="text-[10px] opacity-80 block">Propostas enviadas</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">EM PRODUÇÃO / CONCLUÍDOS</span>
                <div className="text-xl sm:text-2xl font-black">{productionQuotesList.length + completedQuotesList.length}</div>
                <span className="text-[10px] opacity-80 block">Aprovados pelo cliente</span>
              </div>
            </div>

            {/* KANBAN BOARD COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 no-scrollbar">
              
              {/* COLUMN 1: NOVOS */}
              <div className="p-4 rounded-3xl bg-slate-100/90 border border-slate-200 space-y-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase">Novos</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-xs">
                    {newQuotesList.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1 no-scrollbar">
                  {newQuotesList.length > 0 ? (
                    newQuotesList.map(quote => (
                      <div
                        key={quote.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-[#204060] text-xs">
                            #{quote.quote_number}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs">{quote.client.company || quote.client.name}</h4>
                          <span className="text-[11px] text-slate-500 block">{quote.client.name} • {quote.client.whatsapp}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>{quote.items.length} produto(s)</span>
                            <span className="text-[#204060] font-extrabold">{formatCurrency(quote.total_amount)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 gap-1">
                          <button
                            onClick={() => handleAdvanceStage(quote)}
                            className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors"
                            title="Avançar para Análise"
                          >
                            <span>Avançar</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const url = buildWhatsAppUrl(
                                quote.client.whatsapp,
                                quote.quote_number,
                                quote.client.name,
                                quote.client.company,
                                quote.items,
                                quote.total_amount,
                                quote.client
                              );
                              window.open(url, '_blank');
                            }}
                            className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"
                            title="WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedQuoteDetail(quote)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700"
                            title="Ver Detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs font-medium">Nenhum pedido novo</div>
                  )}
                </div>
              </div>

              {/* COLUMN 2: EM ANÁLISE / ENVIADO */}
              <div className="p-4 rounded-3xl bg-slate-100/90 border border-slate-200 space-y-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase">Em Análise</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-extrabold text-xs">
                    {reviewQuotesList.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1 no-scrollbar">
                  {reviewQuotesList.length > 0 ? (
                    reviewQuotesList.map(quote => (
                      <div
                        key={quote.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-[#204060] text-xs">
                            #{quote.quote_number}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
                            {quote.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs">{quote.client.company || quote.client.name}</h4>
                          <span className="text-[11px] text-slate-500 block">{quote.client.name} • {quote.client.whatsapp}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>{quote.items.length} produto(s)</span>
                            <span className="text-[#204060] font-extrabold">{formatCurrency(quote.total_amount)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 gap-1">
                          <button
                            onClick={() => handleAdvanceStage(quote)}
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors"
                            title="Avançar para Negociação"
                          >
                            <span>Ir p/ Negociação</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const url = buildWhatsAppUrl(
                                quote.client.whatsapp,
                                quote.quote_number,
                                quote.client.name,
                                quote.client.company,
                                quote.items,
                                quote.total_amount,
                                quote.client
                              );
                              window.open(url, '_blank');
                            }}
                            className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"
                            title="WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedQuoteDetail(quote)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700"
                            title="Ver Detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs font-medium">Nenhum pedido em análise</div>
                  )}
                </div>
              </div>

              {/* COLUMN 3: EM NEGOCIAÇÃO */}
              <div className="p-4 rounded-3xl bg-slate-100/90 border border-slate-200 space-y-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase">Negociação</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-extrabold text-xs">
                    {negociationQuotesList.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1 no-scrollbar">
                  {negociationQuotesList.length > 0 ? (
                    negociationQuotesList.map(quote => (
                      <div
                        key={quote.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-[#204060] text-xs">
                            #{quote.quote_number}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[9px] font-bold">
                            {quote.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs">{quote.client.company || quote.client.name}</h4>
                          <span className="text-[11px] text-slate-500 block">{quote.client.name} • {quote.client.whatsapp}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>{quote.items.length} produto(s)</span>
                            <span className="text-[#204060] font-extrabold">{formatCurrency(quote.total_amount)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 gap-1">
                          <button
                            onClick={() => handleAdvanceStage(quote)}
                            className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors"
                            title="Aprovar para Produção"
                          >
                            <span>Aprovar Pedido</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                          </button>
                          <button
                            onClick={() => {
                              const url = buildWhatsAppUrl(
                                quote.client.whatsapp,
                                quote.quote_number,
                                quote.client.name,
                                quote.client.company,
                                quote.items,
                                quote.total_amount,
                                quote.client
                              );
                              window.open(url, '_blank');
                            }}
                            className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"
                            title="WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedQuoteDetail(quote)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700"
                            title="Ver Detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs font-medium">Nenhum pedido em negociação</div>
                  )}
                </div>
              </div>

              {/* COLUMN 4: PRODUÇÃO & CONCLUÍDOS */}
              <div className="p-4 rounded-3xl bg-slate-100/90 border border-slate-200 space-y-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase">Produção & Concluídos</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-xs">
                    {productionQuotesList.length + completedQuotesList.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1 no-scrollbar">
                  {[...productionQuotesList, ...completedQuotesList].length > 0 ? (
                    [...productionQuotesList, ...completedQuotesList].map(quote => (
                      <div
                        key={quote.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-[#204060] text-xs">
                            #{quote.quote_number}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                            {quote.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs">{quote.client.company || quote.client.name}</h4>
                          <span className="text-[11px] text-slate-500 block">{quote.client.name} • {quote.client.whatsapp}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>{quote.items.length} produto(s)</span>
                            <span className="text-[#204060] font-extrabold">{formatCurrency(quote.total_amount)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 gap-1">
                          {quote.status !== 'Concluído' ? (
                            <button
                              onClick={() => handleAdvanceStage(quote)}
                              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors"
                              title="Finalizar e Concluir Pedido"
                            >
                              <span>Concluir Pedido</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </button>
                          ) : (
                            <span className="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-[11px] text-center">
                              Pedido Concluído
                            </span>
                          )}
                          <button
                            onClick={() => {
                              const url = buildWhatsAppUrl(
                                quote.client.whatsapp,
                                quote.quote_number,
                                quote.client.name,
                                quote.client.company,
                                quote.items,
                                quote.total_amount,
                                quote.client
                              );
                              window.open(url, '_blank');
                            }}
                            className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold"
                            title="WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedQuoteDetail(quote)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700"
                            title="Ver Detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs font-medium">Nenhum pedido concluído ainda</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CATEGORIES MANAGEMENT TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Gestão de Categorias</h2>
                <p className="text-xs text-slate-500 font-medium">Cadastre e organize as categorias de produtos do showroom digital.</p>
              </div>

              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl brand-gradient-bg font-bold text-xs flex items-center gap-2 shadow-md shrink-0 text-white uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 text-white" /> NOVA CATEGORIA
              </button>
            </div>

            {/* SCROLLABLE RESPONSIVE CATEGORY TABLE */}
            <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm no-scrollbar">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Ordem</th>
                    <th className="p-4">Ícone</th>
                    <th className="p-4">Nome da Categoria</th>
                    <th className="p-4">Slug (URL)</th>
                    <th className="p-4">Descrição</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-50">
                      <td className="p-4 font-extrabold text-[#204060]">{cat.display_order || 0}</td>
                      <td className="p-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[#204060]">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{cat.name}</td>
                      <td className="p-4 font-mono text-slate-500">{cat.slug}</td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">{cat.description || '-'}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GLASS COLORS MANAGEMENT TAB ("CORES") */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Gestão de Cores do Vidro</h2>
                <p className="text-xs text-slate-500 font-medium">Cadastre, edite e ative as opções de cores disponíveis para os produtos.</p>
              </div>

              <button
                onClick={() => {
                  setEditingColor(null);
                  setIsColorModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl brand-gradient-bg font-bold text-xs flex items-center gap-2 shadow-md shrink-0 text-white uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 text-white" /> NOVA COR
              </button>
            </div>

            {/* SCROLLABLE RESPONSIVE COLORS TABLE */}
            <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm no-scrollbar">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Amostra Visual</th>
                    <th className="p-4">Nome da Cor</th>
                    <th className="p-4">Código Hex / Cor</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {glassColors.map(colorOpt => (
                    <tr key={colorOpt.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-full border border-slate-300 shadow-sm shrink-0"
                            style={{ backgroundColor: colorOpt.hex || '#204060' }}
                          />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{colorOpt.name}</td>
                      <td className="p-4 font-mono font-bold text-slate-600">{colorOpt.hex || '#204060'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          colorOpt.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {colorOpt.is_active ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingColor(colorOpt);
                            setIsColorModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteColor(colorOpt.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NEW QUOTE GENERATOR WORKSTATION TAB ("NOVO ORÇAMENTO") */}
        {activeTab === 'new-quote' && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>CENTRAL DE VENDAS & ORÇAMENTOS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Criar Novo Orçamento Comercial
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Monte o pedido do cliente, preencha os dados da empresa/endereço e gere a cotação formal com link direto do WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#204060]" />
                    <span>1. Selecionar Peça do Catálogo</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Escolha o produto</label>
                      <select
                        value={selectedProductToAdd}
                        onChange={e => setSelectedProductToAdd(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-[#204060]"
                      >
                        <option value="">-- Selecione uma peça para adicionar --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (SKU: {p.sku}) — {formatCurrency(p.promo_price || p.price)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Quantidade</label>
                        <input
                          type="number"
                          min={1}
                          value={addItemQty}
                          onChange={e => setAddItemQty(parseInt(e.target.value) || 1)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Cor do Vidro</label>
                        <select
                          value={addItemColor}
                          onChange={e => setAddItemColor(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                        >
                          {glassColors.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Acabamento</label>
                        <select
                          value={addItemOption}
                          onChange={e => setAddItemOption(e.target.value as PersonalizationOption)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                        >
                          <option value="Gravação Laser no Vidro">Gravação Laser no Vidro</option>
                          <option value="Lapidação Especial">Lapidação Especial</option>
                          <option value="Embalagem Especial de Presente">Embalagem Especial de Presente</option>
                          <option value="Placa de Inox Gravada a Laser">Placa de Inox Gravada a Laser</option>
                          <option value="Base Personalizada">Base Personalizada</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <input
                        type="checkbox"
                        id="goldRimCheck"
                        checked={addItemGoldRim}
                        onChange={e => setAddItemGoldRim(e.target.checked)}
                        className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                      />
                      <label htmlFor="goldRimCheck" className="text-xs font-extrabold text-amber-950 cursor-pointer flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Aplicar Filete em Ouro 24k / Borda Dourada</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Observações do Item (Opcional)</label>
                      <input
                        type="text"
                        value={addItemNotes}
                        onChange={e => setAddItemNotes(e.target.value)}
                        placeholder="Ex: Gravação da logo do cliente na lateral"
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddProductToAdminOrder}
                      disabled={!selectedProductToAdd}
                      className="w-full py-3 rounded-xl brand-gradient-bg font-extrabold text-xs shadow-md hover:scale-[1.01] transition-transform text-white uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <PlusCircle className="w-4 h-4 text-white" />
                      <span>INCLUIR ITEM NO PEDIDO</span>
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      Itens do Pedido ({adminOrderItems.length})
                    </h3>
                    <span className="text-xs font-bold text-[#204060]">
                      Subtotal: {formatCurrency(adminTotals.subtotal)}
                    </span>
                  </div>

                  {adminOrderItems.length > 0 ? (
                    <div className="space-y-3">
                      {adminOrderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.images[0]}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{item.product.name}</span>
                              <span className="text-[10px] text-[#204060] font-semibold block">
                                Cor: {item.selectedColor || 'Padrão'} {item.hasGoldRim ? ' ✨ Borda Dourada' : ''}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                SKU: {item.product.sku} | Unitário: {formatCurrency(item.unitPrice)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                            <div className="flex items-center rounded-lg bg-white border border-slate-300 p-0.5">
                              <button
                                type="button"
                                onClick={() => handleAdminQtyChange(idx, item.quantity - 5)}
                                className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 font-extrabold text-slate-900">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleAdminQtyChange(idx, item.quantity + 5)}
                                className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-extrabold text-slate-900 text-right">
                              {formatCurrency(item.lineSubtotal)}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveAdminItem(idx)}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-xs text-slate-400 font-medium">
                        Nenhum item adicionado ao pedido ainda. Escolha um produto acima.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <form onSubmit={handleCreateAdminQuote} className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#204060]" />
                    <span>2. Dados do Cliente & Endereço</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Nome do Contato / Cliente *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          placeholder="Ex: Dra. Mariana Costa"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Razão Social / Nome da Empresa *</label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                          placeholder="Ex: Costa & Associados Arquitetura"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">WhatsApp com DDD *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={clientWhatsapp}
                            onChange={e => setClientWhatsapp(e.target.value)}
                            placeholder="(11) 96776-7364"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">E-mail Comercial *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={e => setClientEmail(e.target.value)}
                            placeholder="contato@empresa.com.br"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* CEP AUTO LOOKUP FOR ADMIN WORKSTATION */}
                    <div className="space-y-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-900 font-bold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#204060]" />
                          <span>Busca CEP & Endereço</span>
                        </label>
                        {isSearchingCepAdmin && (
                          <span className="text-[10px] text-[#204060] font-bold animate-pulse">Buscando CEP...</span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input
                            type="text"
                            value={clientCep}
                            onChange={e => handleAdminCepChange(e.target.value)}
                            placeholder="CEP"
                            maxLength={9}
                            className="w-full p-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={clientAddress}
                            onChange={e => setClientAddress(e.target.value)}
                            placeholder="Logradouro / Rua"
                            className="w-full p-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input
                            type="text"
                            value={clientNumber}
                            onChange={e => setClientNumber(e.target.value)}
                            placeholder="Número"
                            className="w-full p-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={clientNeighborhood}
                            onChange={e => setClientNeighborhood(e.target.value)}
                            placeholder="Bairro"
                            className="w-full p-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={clientCity}
                            onChange={e => setClientCity(e.target.value)}
                            placeholder="Cidade"
                            className="w-full p-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={clientState}
                            onChange={e => setClientState(e.target.value)}
                            placeholder="UF"
                            className="w-full p-2 rounded-xl bg-white border border-slate-200 text-slate-900 uppercase font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Condições Especiais / Prazo de Entrega</label>
                      <textarea
                        rows={2}
                        value={quoteNotes}
                        onChange={e => setQuoteNotes(e.target.value)}
                        placeholder="Ex: Entrega até dia 15/09 para evento corporativo."
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2 text-xs pt-3">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Subtotal dos Produtos:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(adminTotals.subtotal)}</span>
                    </div>

                    {adminTotals.discountAmount > 0 && (
                      <div className="flex items-center justify-between text-emerald-700 font-bold">
                        <span>Desconto Escala ({adminTotals.discountPercentage * 100}%):</span>
                        <span>-{formatCurrency(adminTotals.discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-300 font-extrabold text-sm text-slate-900">
                      <span>Valor Total do Orçamento:</span>
                      <span className="text-base text-[#204060]">{formatCurrency(adminTotals.totalAmount)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={adminOrderItems.length === 0}
                    className="w-full py-4 rounded-2xl brand-gradient-bg font-extrabold text-sm shadow-lg hover:scale-[1.01] transition-transform text-white uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>GERAR & REGISTRAR ORÇAMENTO</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Gestão de Catálogo</h2>
                <p className="text-xs text-slate-500 font-medium">Cadastre, edite e altere preços dos produtos do showroom.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Filtrar por nome ou SKU..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs shadow-sm"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl brand-gradient-bg font-bold text-xs flex items-center gap-2 shadow-md shrink-0 text-white uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4 text-white" /> NOVO PRODUTO
                </button>
              </div>
            </div>

            {/* SCROLLABLE RESPONSIVE PRODUCT TABLE */}
            <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm no-scrollbar">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Produto</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Preço</th>
                    <th className="p-4">MOQ</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        <div>
                          <span className="font-bold text-slate-900 block">{product.name}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">{product.short_desc}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold">{product.sku}</td>
                      <td className="p-4">{product.category_name || 'Geral'}</td>
                      <td className="p-4 font-extrabold text-slate-900">
                        {formatCurrency(product.promo_price || product.price)}
                      </td>
                      <td className="p-4 font-semibold">{product.moq} un.</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          product.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QUOTES MANAGEMENT TAB WITH FULL EDIT & DELETE ACTIONS */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Gestão de Orçamentos Comercial</h2>
                <p className="text-xs text-slate-500 font-medium">Acompanhe, edite e envie propostas dos orçamentos cadastrados.</p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar">
                <button
                  onClick={() => setQuoteStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                    quoteStatusFilter === 'all' ? 'brand-gradient-bg text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Todos ({quotes.length})
                </button>
                {quoteStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => setQuoteStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 ${
                      quoteStatusFilter === status ? 'brand-gradient-bg text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* SCROLLABLE RESPONSIVE QUOTES TABLE */}
            <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm no-scrollbar">
              <table className="w-full min-w-[750px] text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">N° Orçamento</th>
                    <th className="p-4">Cliente / Empresa</th>
                    <th className="p-4">WhatsApp</th>
                    <th className="p-4">Itens</th>
                    <th className="p-4">Valor Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredQuotes.map(quote => (
                    <tr key={quote.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-extrabold text-[#204060]">
                        {quote.quote_number}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{quote.client.name}</span>
                        <span className="text-[10px] text-slate-500">{quote.client.company}</span>
                      </td>
                      <td className="p-4 font-mono text-slate-700">{quote.client.whatsapp}</td>
                      <td className="p-4 font-semibold">{quote.items.length} produtos</td>
                      <td className="p-4 font-extrabold text-slate-900">
                        {formatCurrency(quote.total_amount)}
                      </td>
                      <td className="p-4">
                        <select
                          value={quote.status}
                          onChange={e => handleUpdateStatus(quote.id, e.target.value as QuoteStatus)}
                          className="bg-slate-100 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none border border-slate-300"
                        >
                          {quoteStatuses.map(st => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            const url = buildWhatsAppUrl(
                              quote.client.whatsapp,
                              quote.quote_number,
                              quote.client.name,
                              quote.client.company,
                              quote.items,
                              quote.total_amount,
                              quote.client
                            );
                            window.open(url, '_blank');
                          }}
                          className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold"
                          title="Enviar via WhatsApp"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedQuoteDetail(quote)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Ver Detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingQuote(quote);
                            setIsEditQuoteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Editar Orçamento"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-red-600"
                          title="Excluir Orçamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Eventos & Métricas em Tempo Real</h2>
              <p className="text-xs text-slate-500 font-medium">Log de navegação do estande e interação com QR Codes.</p>
            </div>

            {/* SCROLLABLE RESPONSIVE ANALYTICS TABLE */}
            <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm no-scrollbar">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Data/Hora</th>
                    <th className="p-4">Tipo de Evento</th>
                    <th className="p-4">Produto / Referência</th>
                    <th className="p-4">ID Sessão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {analytics.map(evt => (
                    <tr key={evt.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono text-slate-500 text-[11px]">
                        {new Date(evt.created_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">
                          {evt.event_type}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {evt.product_name || evt.metadata?.productName || '-'}
                      </td>
                      <td className="p-4 font-mono text-slate-500 text-[11px]">
                        {evt.session_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR FOR SMARTPHONES LIKE REFERENCE SCREENSHOT 2 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around md:hidden shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'dashboard' ? 'text-[#204060] font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Painel</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex flex-col items-center gap-0.5 relative ${
            activeTab === 'pipeline' ? 'text-[#204060] font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <Kanban className="w-5 h-5" />
          <span className="text-[10px]">Esteira</span>
          {newQuotesList.length > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-extrabold">
              {newQuotesList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('new-quote')}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'new-quote' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px]">Novo</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex flex-col items-center gap-0.5 relative ${
            activeTab === 'quotes' ? 'text-[#204060] font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">Pedidos</span>
          {quotes.length > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#204060] text-white text-[9px] flex items-center justify-center font-extrabold">
              {quotes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'colors' ? 'text-[#204060] font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <Palette className="w-5 h-5" />
          <span className="text-[10px]">Cores</span>
        </button>
      </div>

      {/* EDIT QUOTE MODAL */}
      {isEditQuoteModalOpen && editingQuote && (
        <div
          onClick={() => setIsEditQuoteModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
              <div>
                <span className="text-[10px] font-extrabold text-[#204060] uppercase">EDITAR PEDIDO / ORÇAMENTO</span>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">N° {editingQuote.quote_number}</h3>
              </div>
              <button
                onClick={() => setIsEditQuoteModalOpen(false)}
                className="p-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs border border-slate-300 transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="uppercase text-[10px]">FECHAR</span>
                <X className="w-4 h-4 text-slate-800" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedQuote} className="p-6 overflow-y-auto space-y-4 text-xs flex-1 no-scrollbar">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">Dados do Cliente & Contato:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Nome do Cliente *</label>
                    <input
                      name="client_name"
                      required
                      defaultValue={editingQuote.client.name}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Empresa / Razão Social *</label>
                    <input
                      name="client_company"
                      required
                      defaultValue={editingQuote.client.company}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">WhatsApp *</label>
                    <input
                      name="client_whatsapp"
                      required
                      defaultValue={editingQuote.client.whatsapp}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">E-mail Comercial *</label>
                    <input
                      name="client_email"
                      required
                      defaultValue={editingQuote.client.email}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">CEP</label>
                    <input
                      name="client_cep"
                      defaultValue={editingQuote.client.cep || ''}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-700 font-bold block mb-1">Logradouro / Rua</label>
                    <input
                      name="client_address"
                      defaultValue={editingQuote.client.address || ''}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Número</label>
                    <input
                      name="client_number"
                      defaultValue={editingQuote.client.number || ''}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-700 font-bold block mb-1">Bairro</label>
                    <input
                      name="client_neighborhood"
                      defaultValue={editingQuote.client.neighborhood || ''}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-slate-700 font-bold block mb-1">Cidade</label>
                    <input
                      name="client_city"
                      defaultValue={editingQuote.client.city}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">UF</label>
                    <input
                      name="client_state"
                      defaultValue={editingQuote.client.state}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 uppercase font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 font-bold block">Status do Orçamento</label>
                <select
                  name="status"
                  defaultValue={editingQuote.status}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                >
                  {quoteStatuses.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Observações do Pedido</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingQuote.notes || ''}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl brand-gradient-bg font-extrabold text-sm shadow-xl text-white uppercase tracking-wider"
              >
                SALVAR ALTERAÇÕES DO PEDIDO
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div
          onClick={() => setIsCategoryModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs border border-slate-300 transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="uppercase text-[10px]">FECHAR</span>
                <X className="w-4 h-4 text-slate-800" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 overflow-y-auto space-y-3 text-xs flex-1 no-scrollbar">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Nome da Categoria *</label>
                <input
                  name="name"
                  required
                  defaultValue={editingCategory?.name || ''}
                  placeholder="Ex: Peças Decorativas em Vidro"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Descrição</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingCategory?.description || ''}
                  placeholder="Descrição da linha de produtos..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Ícone Visual</label>
                  <select
                    name="icon"
                    defaultValue={editingCategory?.icon || 'Sparkles'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  >
                    <option value="Sparkles">Sparkles ✨</option>
                    <option value="Home">Home Decor 🏠</option>
                    <option value="Award">Award / Feira 🏆</option>
                    <option value="Gift">Presentes 🎁</option>
                    <option value="Star">Star ⭐</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Ordem de Exibição</label>
                  <input
                    name="display_order"
                    type="number"
                    defaultValue={editingCategory?.display_order || (categories.length + 1)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl brand-gradient-bg font-extrabold text-sm shadow-md mt-4 text-white uppercase tracking-wider"
              >
                Salvar Categoria
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT GLASS COLOR MODAL */}
      {isColorModalOpen && (
        <div
          onClick={() => setIsColorModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingColor ? 'Editar Cor do Vidro' : 'Cadastrar Nova Cor'}
              </h3>
              <button
                onClick={() => setIsColorModalOpen(false)}
                className="p-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs border border-slate-300 transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="uppercase text-[10px]">FECHAR</span>
                <X className="w-4 h-4 text-slate-800" />
              </button>
            </div>

            <form onSubmit={handleSaveColor} className="p-6 overflow-y-auto space-y-3 text-xs flex-1 no-scrollbar">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Nome da Cor *</label>
                <input
                  name="name"
                  required
                  defaultValue={editingColor?.name || ''}
                  placeholder="Ex: Verde Esmeralda, Rosa Quartz"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Código de Cor Hexadecimal (#HEX) *</label>
                <div className="flex items-center gap-3">
                  <input
                    name="hex"
                    type="color"
                    defaultValue={editingColor?.hex || '#059669'}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    name="hex_text"
                    type="text"
                    defaultValue={editingColor?.hex || '#059669'}
                    placeholder="#059669"
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 font-bold">
                <input type="checkbox" id="colorActive" name="is_active" defaultChecked={editingColor?.is_active ?? true} className="w-4 h-4 accent-[#204060]" />
                <label htmlFor="colorActive" className="cursor-pointer">Ativar para Seleção no Catálogo</label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl brand-gradient-bg font-extrabold text-sm shadow-md mt-4 text-white uppercase tracking-wider"
              >
                SALVAR COR DO VIDRO
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESSFUL ADMIN GENERATED QUOTE MODAL */}
      {generatedQuoteSuccess && (
        <div
          onClick={() => setGeneratedQuoteSuccess(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[88vh] bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 text-center space-y-5 shadow-2xl flex flex-col overflow-y-auto no-scrollbar"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shrink-0">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">ORÇAMENTO CRIADO COM SUCESSO!</span>
              <h3 className="text-3xl font-extrabold text-slate-900">N° {generatedQuoteSuccess.quote_number}</h3>
              <p className="text-xs text-slate-500">
                Registrado para <strong>{generatedQuoteSuccess.client.company}</strong> ({generatedQuoteSuccess.client.name})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span>Total de Itens:</span>
                <strong className="text-slate-900">{generatedQuoteSuccess.items.length} produtos</strong>
              </div>
              <div className="flex justify-between">
                <span>Valor Total:</span>
                <strong className="text-[#204060] font-extrabold text-sm">{formatCurrency(generatedQuoteSuccess.total_amount)}</strong>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  const url = buildWhatsAppUrl(
                    generatedQuoteSuccess.client.whatsapp,
                    generatedQuoteSuccess.quote_number,
                    generatedQuoteSuccess.client.name,
                    generatedQuoteSuccess.client.company,
                    generatedQuoteSuccess.items,
                    generatedQuoteSuccess.total_amount,
                    generatedQuoteSuccess.client
                  );
                  window.open(url, '_blank');
                }}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Send className="w-5 h-5 text-white" />
                <span>ENVIAR ORÇAMENTO VIA WHATSAPP</span>
              </button>

              <button
                onClick={() => {
                  setGeneratedQuoteSuccess(null);
                  setActiveTab('quotes');
                }}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200"
              >
                Ver na Lista de Orçamentos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div
          onClick={() => setIsProductModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* STICKY TOP BAR */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs border border-slate-300 transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="uppercase text-[10px]">FECHAR</span>
                <X className="w-4 h-4 text-slate-800" />
              </button>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs flex-1 no-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">SKU / Código *</label>
                  <input
                    name="sku"
                    required
                    defaultValue={editingProduct?.sku || ''}
                    placeholder="Ex: VDR-WAV-99"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Categoria *</label>
                  <select
                    name="category_id"
                    defaultValue={editingProduct?.category_id || (categories[0]?.id || '')}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Nome do Produto *</label>
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name || ''}
                  placeholder="Ex: Vaso Decorativo Vidro Verde 50cm"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Descrição Curta *</label>
                <input
                  name="short_desc"
                  required
                  defaultValue={editingProduct?.short_desc || ''}
                  placeholder="Resumo para o card"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Descrição Completa *</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingProduct?.description || ''}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              {/* CORES DISPONÍVEIS SELECTION */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-slate-900 font-extrabold block text-xs flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#204060]" />
                  <span>Cores Disponíveis do Vidro para Este Produto:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {glassColors.map((c) => {
                    const checked = formColors.includes(c.name);
                    return (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormColors(prev => [...prev, c.name]);
                            } else {
                              setFormColors(prev => prev.filter(item => item !== c.name));
                            }
                          }}
                          className="w-4 h-4 accent-[#204060] rounded"
                        />
                        <span className="w-3.5 h-3.5 rounded-full border shrink-0" style={{ backgroundColor: c.hex }} />
                        <span className="truncate">{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* BORDA DOURADA OPTION TOGGLE */}
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <input
                  type="checkbox"
                  id="formGoldRimCheck"
                  checked={formHasGoldRim}
                  onChange={e => setFormHasGoldRim(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <label htmlFor="formGoldRimCheck" className="text-xs font-extrabold text-amber-950 cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Permitir opção de Filete em Ouro 24k / Borda Dourada</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Preço Normal (R$)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={editingProduct?.price || 0}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Preço Promo (R$)</label>
                  <input
                    name="promo_price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.promo_price || ''}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Qtd. Mínima (MOQ)</label>
                  <input
                    name="moq"
                    type="number"
                    required
                    defaultValue={editingProduct?.moq || 1}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">URL da Imagem (Unsplash / Supabase)</label>
                <input
                  name="image_url"
                  defaultValue={editingProduct?.images[0] || ''}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-6 pt-2 font-bold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_active" defaultChecked={editingProduct?.is_active ?? true} />
                  <span>Ativo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_featured" defaultChecked={editingProduct?.is_featured ?? false} />
                  <span>Destaque</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_launch" defaultChecked={editingProduct?.is_launch ?? false} />
                  <span>Lançamento</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl brand-gradient-bg font-extrabold text-sm shadow-xl mt-4 text-white uppercase tracking-wider"
              >
                SALVAR PRODUTO
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QUOTE DETAIL MODAL WITH DIRECT WHATSAPP BUTTON, EDIT & DELETE */}
      {selectedQuoteDetail && (
        <div
          onClick={() => setSelectedQuoteDetail(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* STICKY TOP BAR */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
              <div>
                <span className="text-[10px] font-extrabold text-[#204060] uppercase">DETALHES DO ORÇAMENTO</span>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">N° {selectedQuoteDetail.quote_number}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const q = selectedQuoteDetail;
                    setSelectedQuoteDetail(null);
                    setEditingQuote(q);
                    setIsEditQuoteModalOpen(true);
                  }}
                  className="p-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs border border-slate-300 transition-all flex items-center gap-1"
                  title="Editar dados deste pedido"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-700" />
                  <span className="uppercase text-[10px]">EDITAR</span>
                </button>
                <button
                  onClick={() => handleDeleteQuote(selectedQuoteDetail.id)}
                  className="p-1.5 px-3 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs border border-red-200 transition-all flex items-center gap-1"
                  title="Excluir este pedido"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span className="uppercase text-[10px]">EXCLUIR</span>
                </button>
                <button
                  onClick={() => setSelectedQuoteDetail(null)}
                  className="p-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs border border-slate-300 transition-all flex items-center gap-1 shadow-sm ml-2"
                >
                  <span className="uppercase text-[10px]">FECHAR</span>
                  <X className="w-4 h-4 text-slate-800" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE BODY CONTENT */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1 no-scrollbar">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div><strong className="text-slate-900">Cliente:</strong> {selectedQuoteDetail.client.name}</div>
                  <div><strong className="text-slate-900">Empresa:</strong> {selectedQuoteDetail.client.company}</div>
                  <div><strong className="text-slate-900">WhatsApp:</strong> {selectedQuoteDetail.client.whatsapp}</div>
                  <div><strong className="text-slate-900">E-mail:</strong> {selectedQuoteDetail.client.email}</div>
                  {selectedQuoteDetail.client.cep && (
                    <div className="sm:col-span-2 pt-1 border-t border-slate-200 text-[11px]">
                      <strong className="text-slate-900">Endereço de Entrega:</strong>{' '}
                      {selectedQuoteDetail.client.address ? `${selectedQuoteDetail.client.address}, N° ${selectedQuoteDetail.client.number || 'S/N'}` : ''}{' '}
                      {selectedQuoteDetail.client.neighborhood ? `- ${selectedQuoteDetail.client.neighborhood}` : ''} - {selectedQuoteDetail.client.city}/{selectedQuoteDetail.client.state} (CEP: {selectedQuoteDetail.client.cep})
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Itens Solicitados:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedQuoteDetail.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 text-xs flex items-center justify-between border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.product.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Qtd: {item.quantity} un. | Cor: {item.selectedColor || 'Padrão'}
                          {item.hasGoldRim ? ' ✨ Borda Dourada' : ''}
                        </span>
                      </div>
                      <span className="font-extrabold text-slate-900">{formatCurrency(item.lineSubtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between font-extrabold text-sm text-slate-900">
                <span>Valor Total:</span>
                <span className="text-[#204060] text-base">{formatCurrency(selectedQuoteDetail.total_amount)}</span>
              </div>

              <button
                onClick={() => {
                  const url = buildWhatsAppUrl(
                    selectedQuoteDetail.client.whatsapp,
                    selectedQuoteDetail.quote_number,
                    selectedQuoteDetail.client.name,
                    selectedQuoteDetail.client.company,
                    selectedQuoteDetail.items,
                    selectedQuoteDetail.total_amount,
                    selectedQuoteDetail.client
                  );
                  window.open(url, '_blank');
                }}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg hover:scale-[1.01] transition-transform flex items-center justify-center gap-2.5 uppercase tracking-wider mt-4"
              >
                <Send className="w-5 h-5 text-white" />
                <span>ENVIAR ORÇAMENTO VIA WHATSAPP</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
