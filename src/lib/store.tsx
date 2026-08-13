'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, PersonalizationOption } from '@/types';
import { calculateCartTotals } from './utils';
import { logAnalyticsEvent } from './supabase';

interface ShowroomContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOption?: PersonalizationOption, customNotes?: string) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Modals
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (product: Product | null) => void;
  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
  qrPayload: { title: string; url: string; subtitle?: string } | null;
  openQRModal: (title: string, url: string, subtitle?: string) => void;

  // Filters & Search
  activeCategory: string;
  setActiveCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'name';
  setSortBy: (sort: 'popular' | 'price-asc' | 'price-desc' | 'name') => void;

  // Exhibition Kiosk Mode
  isExhibitionMode: boolean;
  toggleExhibitionMode: () => void;
  showIdlePrompt: boolean;
  resetIdleState: () => void;

  // Calculated totals
  cartTotals: ReturnType<typeof calculateCartTotals>;
}

const ShowroomContext = createContext<ShowroomContextType | null>(null);

export function ShowroomProvider({ children }: { children: React.ReactNode }) {
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrPayload, setQrPayload] = useState<{ title: string; url: string; subtitle?: string } | null>(null);

  // Filter State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'name'>('popular');

  // Exhibition Mode State
  const [isExhibitionMode, setIsExhibitionMode] = useState<boolean>(false);
  const [showIdlePrompt, setShowIdlePrompt] = useState<boolean>(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Load saved state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('toque_ideal_cart');
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) {}
      }

      const savedMode = localStorage.getItem('toque_ideal_exhibition_mode');
      if (savedMode === 'true') {
        setIsExhibitionMode(true);
      }

      // Initialize session analytics event
      if (!sessionStorage.getItem('tq_session_id')) {
        const sid = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        sessionStorage.setItem('tq_session_id', sid);
        logAnalyticsEvent('session_started', undefined, undefined, { isExhibitionMode: savedMode === 'true' });
      }
    }
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('toque_ideal_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Exhibition Idle Detection (30s timer)
  const resetIdleState = useCallback(() => {
    setLastActivity(Date.now());
    if (showIdlePrompt) {
      setShowIdlePrompt(false);
    }
  }, [showIdlePrompt]);

  useEffect(() => {
    if (!isExhibitionMode) return;

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleUserInteraction = () => resetIdleState();

    activityEvents.forEach(evt => window.addEventListener(evt, handleUserInteraction));

    const idleInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      // 30 segundos de inatividade aciona prompt no Modo Exposição
      if (elapsed > 30000 && !showIdlePrompt) {
        setShowIdlePrompt(true);
      }
    }, 2000);

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, handleUserInteraction));
      clearInterval(idleInterval);
    };
  }, [isExhibitionMode, lastActivity, showIdlePrompt, resetIdleState]);

  // Reset Application State after inactivity prompt timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showIdlePrompt) {
      timeout = setTimeout(() => {
        setIsCartOpen(false);
        setIsQuoteModalOpen(false);
        setSelectedProductDetail(null);
        setIsQRModalOpen(false);
        setSearchQuery('');
        setActiveCategory('all');
        setShowIdlePrompt(false);
        setCart([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [showIdlePrompt]);

  // Cart Functions
  const addToCart = (
    product: Product,
    quantity?: number,
    selectedOption?: PersonalizationOption,
    customNotes?: string
  ) => {
    const qty = quantity || product.moq || 1;
    const option = selectedOption || product.custom_options[0] || 'Gravação Laser';
    const unitPrice = product.promo_price || product.price;

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedOption === option
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + qty;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          lineSubtotal: newQty * unitPrice,
          customNotes: customNotes || updated[existingIndex].customNotes,
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity: qty,
          selectedOption: option,
          customNotes,
          unitPrice,
          lineSubtotal: qty * unitPrice,
        },
      ];
    });

    logAnalyticsEvent('product_add', product.id, product.name, { quantity: qty, option });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const item = cart[index];
    if (item) {
      logAnalyticsEvent('product_remove', item.product.id, item.product.name);
    }
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    setCart(prev => {
      if (quantity <= 0) return prev.filter((_, i) => i !== index);
      const updated = [...prev];
      const item = updated[index];
      if (item) {
        updated[index] = {
          ...item,
          quantity,
          lineSubtotal: quantity * item.unitPrice,
        };
      }
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  const toggleExhibitionMode = () => {
    setIsExhibitionMode(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('toque_ideal_exhibition_mode', String(next));
      }
      return next;
    });
  };

  const openQRModal = (title: string, url: string, subtitle?: string) => {
    setQrPayload({ title, url, subtitle });
    setIsQRModalOpen(true);
    logAnalyticsEvent('qr_generated', undefined, title, { url });
  };

  const cartTotals = calculateCartTotals(cart);

  return (
    <ShowroomContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        isQRModalOpen,
        setIsQRModalOpen,
        qrPayload,
        openQRModal,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        isExhibitionMode,
        toggleExhibitionMode,
        showIdlePrompt,
        resetIdleState,
        cartTotals,
      }}
    >
      {children}
    </ShowroomContext.Provider>
  );
}

export function useShowroom() {
  const context = useContext(ShowroomContext);
  if (!context) {
    throw new Error('useShowroom deve ser usado dentro de um ShowroomProvider');
  }
  return context;
}
