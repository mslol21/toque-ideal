import { createClient } from '@supabase/supabase-js';
import { Product, Quote, AnalyticsEvent, ClientData, CartItem, QuoteStatus, Category } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// CATEGORY PERSISTENCE DRIVER
export async function getCategoriesFromStore(): Promise<Category[]> {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    }
  } catch (e) {
    console.warn('Falling back to local storage for categories');
  }

  const localCategories = localStorage.getItem('toque_ideal_categories');
  if (localCategories) {
    try {
      return JSON.parse(localCategories);
    } catch (e) {}
  }

  localStorage.setItem('toque_ideal_categories', JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_CATEGORIES;
}

export async function saveCategoryToStore(category: Category): Promise<Category> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .upsert(category)
        .select()
        .single();
      if (!error && data) return data as Category;
    } catch (e) {}
  }

  const currentCategories = await getCategoriesFromStore();
  const existingIdx = currentCategories.findIndex(c => c.id === category.id);
  let updated: Category[];
  if (existingIdx >= 0) {
    updated = [...currentCategories];
    updated[existingIdx] = category;
  } else {
    updated = [...currentCategories, category];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('toque_ideal_categories', JSON.stringify(updated));
  }
  return category;
}

export async function deleteCategoryFromStore(categoryId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').delete().eq('id', categoryId);
    } catch (e) {}
  }

  const currentCategories = await getCategoriesFromStore();
  const updated = currentCategories.filter(c => c.id !== categoryId);
  if (typeof window !== 'undefined') {
    localStorage.setItem('toque_ideal_categories', JSON.stringify(updated));
  }
  return true;
}

// PRODUCT PERSISTENCE DRIVER
export async function getProductsFromStore(): Promise<Product[]> {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    }
  } catch (e) {
    console.warn('Falling back to local storage for products');
  }

  const localProds = localStorage.getItem('toque_ideal_products');
  if (localProds) {
    try {
      return JSON.parse(localProds);
    } catch (e) {}
  }

  localStorage.setItem('toque_ideal_products', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export async function saveProductToStore(product: Product): Promise<Product> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert(product)
        .select()
        .single();
      if (!error && data) return data as Product;
    } catch (e) {}
  }

  const currentProds = await getProductsFromStore();
  const existingIdx = currentProds.findIndex(p => p.id === product.id);
  let updated: Product[];
  if (existingIdx >= 0) {
    updated = [...currentProds];
    updated[existingIdx] = product;
  } else {
    updated = [...currentProds, product];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('toque_ideal_products', JSON.stringify(updated));
  }
  return product;
}

export async function deleteProductFromStore(productId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (e) {}
  }

  const currentProds = await getProductsFromStore();
  const updated = currentProds.filter(p => p.id !== productId);
  if (typeof window !== 'undefined') {
    localStorage.setItem('toque_ideal_products', JSON.stringify(updated));
  }
  return true;
}

// QUOTE PERSISTENCE DRIVER
export async function getQuotesFromStore(): Promise<Quote[]> {
  if (typeof window === 'undefined') return [];

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Quote[];
      }
    }
  } catch (e) {
    console.warn('Falling back to local storage for quotes');
  }

  const localQuotes = localStorage.getItem('toque_ideal_quotes');
  if (localQuotes) {
    try {
      return JSON.parse(localQuotes);
    } catch (e) {}
  }
  return [];
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
    id: `q-${Date.now()}`,
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

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('quotes').insert(newQuote);
    } catch (e) {}
  }

  const currentQuotes = await getQuotesFromStore();
  const updated = [newQuote, ...currentQuotes];
  if (typeof window !== 'undefined') {
    localStorage.setItem('toque_ideal_quotes', JSON.stringify(updated));
  }
  return newQuote;
}

export async function updateQuoteStatusInStore(quoteId: string, status: QuoteStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('quotes').update({ status }).eq('id', quoteId);
    } catch (e) {}
  }

  const currentQuotes = await getQuotesFromStore();
  const updated = currentQuotes.map(q => (q.id === quoteId ? { ...q, status } : q));
  if (typeof window !== 'undefined') {
    localStorage.setItem('toque_ideal_quotes', JSON.stringify(updated));
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
    id: `evt-${Date.now()}`,
    event_type: eventType as any,
    product_id: productId,
    product_name: productName,
    session_id: sessionId,
    metadata,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('analytics_events').insert(event);
    } catch (e) {}
  }

  const localEvents = localStorage.getItem('toque_ideal_analytics') || '[]';
  try {
    const parsed = JSON.parse(localEvents);
    parsed.unshift(event);
    localStorage.setItem('toque_ideal_analytics', JSON.stringify(parsed.slice(0, 100)));
  } catch (e) {}
}

export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  if (typeof window === 'undefined') return [];

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        return data as AnalyticsEvent[];
      }
    }
  } catch (e) {}

  const localEvents = localStorage.getItem('toque_ideal_analytics');
  if (localEvents) {
    try {
      return JSON.parse(localEvents);
    } catch (e) {}
  }
  return [];
}
