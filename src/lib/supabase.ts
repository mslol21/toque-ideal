import { createClient } from '@supabase/supabase-js';
import { Product, Quote, AnalyticsEvent, ClientData, CartItem, QuoteStatus, Category, GlassColorOption } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_GLASS_COLORS } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    try {
      return window.crypto.randomUUID();
    } catch (e) {}
  }
  const hex = Date.now().toString(16).padStart(12, '0');
  return `c0000000-0000-4000-8000-${hex}`;
}

// GLASS COLORS PERSISTENCE DRIVER
export async function getColorsFromStore(): Promise<GlassColorOption[]> {
  if (typeof window === 'undefined') return INITIAL_GLASS_COLORS;

  let localColors: GlassColorOption[] = INITIAL_GLASS_COLORS;
  const stored = localStorage.getItem('toque_ideal_glass_colors');
  if (stored) {
    try {
      localColors = JSON.parse(stored);
    } catch (e) {}
  } else {
    localStorage.setItem('toque_ideal_glass_colors', JSON.stringify(INITIAL_GLASS_COLORS));
  }

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('glass_colors')
        .select('*');

      if (!error && data && data.length > 0) {
        const mergedMap = new Map<string, GlassColorOption>();
        (data as GlassColorOption[]).forEach(c => mergedMap.set(c.id || c.name, c));
        localColors.forEach(c => {
          if (!mergedMap.has(c.id || c.name)) {
            mergedMap.set(c.id || c.name, c);
          }
        });
        const merged = Array.from(mergedMap.values());
        localStorage.setItem('toque_ideal_glass_colors', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Falling back to local storage for glass colors');
  }

  return localColors;
}

export async function saveColorToStore(colorOption: GlassColorOption): Promise<GlassColorOption> {
  if (!colorOption.id) {
    colorOption.id = generateUUID();
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('toque_ideal_glass_colors');
    let list: GlassColorOption[] = stored ? JSON.parse(stored) : INITIAL_GLASS_COLORS;
    const existingIdx = list.findIndex(c => c.id === colorOption.id || c.name === colorOption.name);
    if (existingIdx >= 0) {
      list[existingIdx] = colorOption;
    } else {
      list.push(colorOption);
    }
    localStorage.setItem('toque_ideal_glass_colors', JSON.stringify(list));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('glass_colors').upsert({
        id: colorOption.id,
        name: colorOption.name,
        hex: colorOption.hex,
        is_active: colorOption.is_active,
      });
    } catch (e) {}
  }

  return colorOption;
}

export async function deleteColorFromStore(colorId: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('toque_ideal_glass_colors');
    if (stored) {
      const list: GlassColorOption[] = JSON.parse(stored);
      const updated = list.filter(c => c.id !== colorId);
      localStorage.setItem('toque_ideal_glass_colors', JSON.stringify(updated));
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('glass_colors').delete().eq('id', colorId);
    } catch (e) {}
  }
  return true;
}

// CATEGORY PERSISTENCE DRIVER
export async function getCategoriesFromStore(): Promise<Category[]> {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;

  let localCategories: Category[] = INITIAL_CATEGORIES;
  const stored = localStorage.getItem('toque_ideal_categories');
  if (stored) {
    try {
      localCategories = JSON.parse(stored);
    } catch (e) {}
  } else {
    localStorage.setItem('toque_ideal_categories', JSON.stringify(INITIAL_CATEGORIES));
  }

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const mergedMap = new Map<string, Category>();
        (data as Category[]).forEach(c => mergedMap.set(c.id, c));
        localCategories.forEach(c => {
          if (!mergedMap.has(c.id)) {
            mergedMap.set(c.id, c);
          }
        });
        const merged = Array.from(mergedMap.values());
        localStorage.setItem('toque_ideal_categories', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Falling back to local storage for categories');
  }

  return localCategories;
}

export async function saveCategoryToStore(category: Category): Promise<Category> {
  if (!category.id || category.id.startsWith('cat-')) {
    category.id = generateUUID();
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('toque_ideal_categories');
    let list: Category[] = stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
    const existingIdx = list.findIndex(c => c.id === category.id || c.slug === category.slug);
    if (existingIdx >= 0) {
      list[existingIdx] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem('toque_ideal_categories', JSON.stringify(list));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').upsert({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon || 'Sparkles',
        description: category.description || '',
        display_order: category.display_order || 0,
      });
    } catch (e) {
      console.warn('Supabase sync warning for category:', e);
    }
  }

  return category;
}

export async function deleteCategoryFromStore(categoryId: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('toque_ideal_categories');
    if (stored) {
      const list: Category[] = JSON.parse(stored);
      const updated = list.filter(c => c.id !== categoryId);
      localStorage.setItem('toque_ideal_categories', JSON.stringify(updated));
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').delete().eq('id', categoryId);
    } catch (e) {}
  }
  return true;
}

// PRODUCT PERSISTENCE DRIVER
export async function getProductsFromStore(): Promise<Product[]> {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;

  let localProds: Product[] = INITIAL_PRODUCTS;
  const stored = localStorage.getItem('toque_ideal_products');
  if (stored) {
    try {
      localProds = JSON.parse(stored);
    } catch (e) {}
  } else {
    localStorage.setItem('toque_ideal_products', JSON.stringify(INITIAL_PRODUCTS));
  }

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        const mergedMap = new Map<string, Product>();
        (data as Product[]).forEach(p => mergedMap.set(p.id, p));
        localProds.forEach(p => {
          if (!mergedMap.has(p.id)) {
            mergedMap.set(p.id, p);
          }
        });
        const merged = Array.from(mergedMap.values());
        localStorage.setItem('toque_ideal_products', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Falling back to local storage for products');
  }

  return localProds;
}

export async function saveProductToStore(product: Product): Promise<Product> {
  if (!product.id || product.id.startsWith('p-')) {
    product.id = generateUUID();
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('toque_ideal_products');
    let list: Product[] = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    const existingIdx = list.findIndex(p => p.id === product.id || p.sku === product.sku);
    if (existingIdx >= 0) {
      list[existingIdx] = product;
    } else {
      list.push(product);
    }
    localStorage.setItem('toque_ideal_products', JSON.stringify(list));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').upsert({
        id: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        short_desc: product.short_desc,
        description: product.description,
        price: product.price,
        promo_price: product.promo_price,
        moq: product.moq,
        category_id: product.category_id,
        category_name: product.category_name,
        is_active: product.is_active,
        is_featured: product.is_featured,
        is_launch: product.is_launch,
        custom_options: product.custom_options,
        available_colors: product.available_colors,
        has_gold_rim_option: product.has_gold_rim_option,
        images: product.images,
        specs: product.specs,
      });
    } catch (e) {
      console.warn('Supabase sync warning for product:', e);
    }
  }

  return product;
}

export async function deleteProductFromStore(productId: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('toque_ideal_products');
    if (stored) {
      const list: Product[] = JSON.parse(stored);
      const updated = list.filter(p => p.id !== productId);
      localStorage.setItem('toque_ideal_products', JSON.stringify(updated));
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (e) {}
  }
  return true;
}

// QUOTE PERSISTENCE DRIVER
export async function getQuotesFromStore(): Promise<Quote[]> {
  if (typeof window === 'undefined') return [];

  let localQuotes: Quote[] = [];
  const stored = localStorage.getItem('toque_ideal_quotes');
  if (stored) {
    try {
      localQuotes = JSON.parse(stored);
    } catch (e) {}
  }

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mergedMap = new Map<string, Quote>();
        (data as Quote[]).forEach(q => mergedMap.set(q.id || q.quote_number, q));
        localQuotes.forEach(q => {
          const key = q.id || q.quote_number;
          if (!mergedMap.has(key)) {
            mergedMap.set(key, q);
          }
        });
        const merged = Array.from(mergedMap.values());
        localStorage.setItem('toque_ideal_quotes', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Falling back to local storage for quotes');
  }

  return localQuotes;
}

export async function saveQuoteToStore(
  quoteNumber: string,
  clientData: ClientData,
  items: CartItem[],
  subtotal: number,
  discountAmount: number,
  totalAmount: number,
  notes?: string
): Promise<Quote> {
  const newQuote: Quote = {
    id: generateUUID(),
    quote_number: quoteNumber,
    client: clientData,
    status: 'Novo',
    items,
    subtotal,
    discount_amount: discountAmount,
    total_amount: totalAmount,
    notes,
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('toque_ideal_quotes');
    const currentQuotes: Quote[] = stored ? JSON.parse(stored) : [];
    const updated = [newQuote, ...currentQuotes];
    localStorage.setItem('toque_ideal_quotes', JSON.stringify(updated));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('quotes').insert({
        id: newQuote.id,
        quote_number: newQuote.quote_number,
        client: newQuote.client,
        status: newQuote.status,
        items: newQuote.items,
        subtotal: newQuote.subtotal,
        discount_amount: newQuote.discount_amount,
        total_amount: newQuote.total_amount,
        notes: newQuote.notes,
        created_at: newQuote.created_at,
      });
    } catch (e) {
      console.warn('Supabase sync warning for quote:', e);
    }
  }

  return newQuote;
}

export async function updateQuoteStatusInStore(quoteId: string, status: QuoteStatus): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('toque_ideal_quotes');
    if (stored) {
      const currentQuotes: Quote[] = JSON.parse(stored);
      const updated = currentQuotes.map(q => (q.id === quoteId ? { ...q, status } : q));
      localStorage.setItem('toque_ideal_quotes', JSON.stringify(updated));
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('quotes').update({ status }).eq('id', quoteId);
    } catch (e) {}
  }
  return true;
}

// ANALYTICS DRIVER
export async function logAnalyticsEvent(
  eventType: string,
  productId?: string,
  productName?: string,
  metadata?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  let sessionId = sessionStorage.getItem('toque_ideal_session_id');
  if (!sessionId) {
    sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('toque_ideal_session_id', sessionId);
  }

  const event: AnalyticsEvent = {
    id: generateUUID(),
    event_type: eventType as any,
    product_id: productId,
    product_name: productName,
    session_id: sessionId,
    metadata,
    created_at: new Date().toISOString(),
  };

  const localEvents = localStorage.getItem('toque_ideal_analytics') || '[]';
  try {
    const parsed = JSON.parse(localEvents);
    parsed.unshift(event);
    localStorage.setItem('toque_ideal_analytics', JSON.stringify(parsed.slice(0, 100)));
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('analytics_events').insert({
        id: event.id,
        event_type: event.event_type,
        product_id: event.product_id,
        product_name: event.product_name,
        session_id: event.session_id,
        metadata: event.metadata,
        created_at: event.created_at,
      });
    } catch (e) {}
  }
}

export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('toque_ideal_analytics');
  let localEvents: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        const mergedMap = new Map<string, AnalyticsEvent>();
        (data as AnalyticsEvent[]).forEach(e => mergedMap.set(e.id, e));
        localEvents.forEach(e => {
          if (!mergedMap.has(e.id)) {
            mergedMap.set(e.id, e);
          }
        });
        const merged = Array.from(mergedMap.values());
        localStorage.setItem('toque_ideal_analytics', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {}

  return localEvents;
}
