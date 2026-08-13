export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  display_order?: number;
}

export type PersonalizationOption =
  | 'Gravação Laser no Vidro'
  | 'Lapidação Especial'
  | 'Filete em Ouro 24k / Borda Dourada'
  | 'Embalagem Especial de Presente'
  | 'Placa de Inox Gravada a Laser'
  | 'Base Personalizada';

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  short_desc: string;
  price: number;
  promo_price?: number | null;
  moq: number; // Quantidade Mínima
  category_id: string;
  category_name?: string;
  is_active: boolean;
  is_featured: boolean;
  is_launch: boolean;
  custom_options: PersonalizationOption[];
  available_colors?: string[]; // Opções de Cores do Vidro
  has_gold_rim_option?: boolean; // Opção de Borda Dourada
  images: string[];
  specs?: {
    material?: string;
    capacity?: string;
    dimensions?: string;
    weight?: string;
    applications?: string[];
  };
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption: PersonalizationOption;
  selectedColor?: string; // Cor selecionada pelo cliente
  hasGoldRim?: boolean; // Borda dourada ativada
  customNotes?: string;
  unitPrice: number;
  lineSubtotal: number;
}

export interface ClientData {
  id?: string;
  name: string;
  company: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  notes?: string;
}

export type QuoteStatus =
  | 'Novo'
  | 'Em análise'
  | 'Orçamento enviado'
  | 'Negociação'
  | 'Aprovado'
  | 'Produção'
  | 'Concluído'
  | 'Cancelado';

export interface Quote {
  id: string;
  quote_number: string;
  client: ClientData;
  status: QuoteStatus;
  items: CartItem[];
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  notes?: string;
  created_at: string;
}

export type AnalyticsEventType =
  | 'product_view'
  | 'product_add'
  | 'product_remove'
  | 'quote_started'
  | 'quote_submitted'
  | 'qr_generated'
  | 'whatsapp_clicked'
  | 'session_started';

export interface AnalyticsEvent {
  id: string;
  event_type: AnalyticsEventType;
  product_id?: string;
  product_name?: string;
  session_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ExhibitionConfig {
  isExhibitionMode: boolean;
  idleTimeoutSeconds: number;
  staffPin: string;
}
