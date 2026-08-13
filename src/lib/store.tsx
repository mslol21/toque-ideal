'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, PersonalizationOption } from '@/types';
import { calculateCartTotals } from './utils';
import { logAnalyticsEvent } from './supabase';

interface ShowroomContextType {
  // Cart
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedOption?: PersonalizationOption,
    selectedColor?: string,
    hasGoldRim?: boolean,
    customNotes?: string
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isQuoteDrawerOpen: boolean;
  setIsQuoteDrawerOpen: (open: boolean) => void;

  // Modals
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);

  // Modals State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
        try { setCartItems(JSON.parse(savedCart)); } catch (e) {}
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
      localStorage.setItem('toque_ideal_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

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
        setIsQuoteDrawerOpen(false);
        setIsQuoteModalOpen(false);
        setSelectedProduct(null);
        setIsQRModalOpen(false);
        setSearchQuery('');
        setActiveCategory('all');
        setShowIdlePrompt(false);
        setCartItems([]);
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
    selectedColor?: string,
    hasGoldRim?: boolean,
    customNotes?: string
  ) => {
    const qty = quantity || product.moq || 1;
    const option = selectedOption || product.custom_options[0] || 'Gravação Laser no Vidro';
    const color = selectedColor || (product.available_colors && product.available_colors[0]) || 'Incolor / Transparente';
    const goldRim = hasGoldRim ?? Boolean(product.has_gold_rim_option);
    const unitPrice = product.promo_price || product.price;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedOption === option &&
          item.selectedColor === color &&
          item.hasGoldRim === goldRim
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
          selectedColor: color,
          hasGoldRim: goldRim,
          customNotes,
          unitPrice,
          lineSubtotal: qty * unitPrice,
        },
      ];
    });

    logAnalyticsEvent('product_add', product.id, product.name, { quantity: qty, option, color, goldRim });
    setIsQuoteDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (item) {
        logAnalyticsEvent('product_remove', item.product.id, item.product.name);
      }
      return prev.filter(i => i.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => {
      if (quantity <= 0) return prev.filter(i => i.product.id !== productId);
      return prev.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
            lineSubtotal: quantity * item.unitPrice,
          };
        }
        return item;
      });
    });
  };

  const clearCart = () => setCartItems([]);

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

  const cartTotals = calculateCartTotals(cartItems);

  return (
    <ShowroomContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isQuoteDrawerOpen,
        setIsQuoteDrawerOpen,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        selectedProduct,
        setSelectedProduct,
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
