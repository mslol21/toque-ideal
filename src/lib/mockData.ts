import { Category, Product, GlassColorOption } from '@/types';

export const INITIAL_GLASS_COLORS: GlassColorOption[] = [
  { id: 'col-1', name: 'Verde Esmeralda', hex: '#059669', is_active: true },
  { id: 'col-2', name: 'Âmbar Dourado', hex: '#d97706', is_active: true },
  { id: 'col-3', name: 'Azul Cobalto', hex: '#2563eb', is_active: true },
  { id: 'col-4', name: 'Fumê Cristal', hex: '#334155', is_active: true },
  { id: 'col-5', name: 'Incolor / Transparente', hex: '#94a3b8', is_active: true },
  { id: 'col-6', name: 'Rubi Imperial', hex: '#e11d48', is_active: true },
  { id: 'col-7', name: 'Rosa Quartz', hex: '#ec4899', is_active: true },
  { id: 'col-8', name: 'Amarelo Citrino', hex: '#eab308', is_active: true },
  { id: 'col-9', name: 'Preto Ônix', hex: '#0f172a', is_active: true },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Peças Decorativas em Vidro',
    slug: 'pecas-decorativas-vidro',
    icon: 'Sparkles',
    description: 'Design exclusivo em vidro moldado, ondas e esculturas de alta sofisticação.',
    display_order: 1,
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Home Decor & Design',
    slug: 'home-decor',
    icon: 'Home',
    description: 'Peças únicas que transformam ambientes de luxo, residências e recepções corporativas.',
    display_order: 2,
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Destaques ABCasa Fair',
    slug: 'abcasa-fair',
    icon: 'Award',
    description: 'Modelos expostos nas maiores feiras do segmento de decoração e design nacional.',
    display_order: 3,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    sku: 'VDR-WAV-01',
    name: 'Centro de Mesa Sculpted Wave Verde 50cm',
    slug: 'centro-de-mesa-sculpted-wave-verde-50cm',
    short_desc: 'Peça decorativa em vidro moldado artesanal com efeito ondulado cristalino.',
    description: 'Ícone da coleção Home Decor Toque Ideal. Este centro de mesa escultural é moldado a quente em vidro de alta espessura, criando fluidez e elegância incomparáveis em mesas de jantar, recepções e aparadores.',
    price: 380.00,
    promo_price: 340.00,
    moq: 1,
    category_id: 'c0000000-0000-0000-0000-000000000001',
    category_name: 'Peças Decorativas em Vidro',
    is_active: true,
    is_featured: true,
    is_launch: true,
    custom_options: ['Gravação Laser no Vidro', 'Lapidação Especial', 'Filete em Ouro 24k / Borda Dourada', 'Embalagem Especial de Presente'],
    available_colors: ['Verde Esmeralda', 'Âmbar Dourado', 'Azul Cobalto', 'Incolor / Transparente'],
    has_gold_rim_option: true,
    images: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      material: 'Vidro Moldado Artesanal Translúcido 8mm',
      dimensions: 'Comprimento 52cm x Largura 24cm x Altura 12cm',
    }
  },
  {
    id: 'p-2',
    sku: 'VDR-AMB-02',
    name: 'Escultura Flama Âmbar Lapidada 45cm',
    slug: 'escultura-flama-ambar-lapidada-45cm',
    short_desc: 'Escultura imponente em vidro soprado com nuances refinadas e base de acrílico cristal.',
    description: 'Destaque da ABCasa Fair. Uma peça artística rica em textura e nuances cromáticas que refletem a iluminação ambiente. Ideal para hotéis de luxo, escritórios de advocacia e residências de alto padrão.',
    price: 680.00,
    promo_price: 620.00,
    moq: 1,
    category_id: 'c0000000-0000-0000-0000-000000000002',
    category_name: 'Home Decor & Design',
    is_active: true,
    is_featured: true,
    is_launch: false,
    custom_options: ['Placa de Inox Gravada a Laser', 'Base Personalizada', 'Lapidação Especial', 'Filete em Ouro 24k / Borda Dourada'],
    available_colors: ['Âmbar Dourado', 'Verde Esmeralda', 'Azul Cobalto', 'Incolor / Transparente', 'Fumê Cristal'],
    has_gold_rim_option: true,
    images: [
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      material: 'Vidro Âmbar Nobre + Base Acrílica Maciça',
      dimensions: 'Altura 45cm x Largura 18cm x Profundidade 12cm',
    }
  },
  {
    id: 'p-3',
    sku: 'VDR-FOL-03',
    name: 'Prato Decorativo de Vidro Moldado "Folha"',
    slug: 'prato-decorativo-vidro-moldado-folha',
    short_desc: 'Prato decorativo com relevo de folha natural em vidro de alta espessura.',
    description: 'Design orgânico inspirado nas formas da natureza. Produzido com técnicas de fusão de vidro a 800°C, resultando em um acabamento tátil único e brilho acetinado.',
    price: 290.00,
    promo_price: 260.00,
    moq: 1,
    category_id: 'c0000000-0000-0000-0000-000000000001',
    category_name: 'Peças Decorativas em Vidro',
    is_active: true,
    is_featured: false,
    is_launch: true,
    custom_options: ['Gravação Laser no Vidro', 'Filete em Ouro 24k / Borda Dourada', 'Embalagem Especial de Presente'],
    available_colors: ['Verde Esmeralda', 'Incolor / Transparente', 'Fumê Cristal', 'Rubi Imperial'],
    has_gold_rim_option: true,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      material: 'Vidro Cristalino Fundido',
      dimensions: 'Diâmetro 38cm x Altura 6cm',
    }
  },
  {
    id: 'p-4',
    sku: 'VDR-BIS-04',
    name: 'Vaso Decorativo Lapidado Cristal Bisotado',
    slug: 'vaso-decorativo-lapidado-cristal-bisotado',
    short_desc: 'Vaso geométrico em cristal de alta transparência com facetas lapidadas à mão.',
    description: 'Acabamento bisotado que refrata a luz em múltiplos ângulos. Desenvolvido para arranjos florais de alto padrão e composições conceituais em halls de entrada.',
    price: 450.00,
    promo_price: 399.00,
    moq: 1,
    category_id: 'c0000000-0000-0000-0000-000000000003',
    category_name: 'Destaques ABCasa Fair',
    is_active: true,
    is_featured: true,
    is_launch: false,
    custom_options: ['Lapidação Especial', 'Gravação Laser no Vidro', 'Filete em Ouro 24k / Borda Dourada'],
    available_colors: ['Incolor / Transparente', 'Fumê Cristal', 'Azul Cobalto', 'Âmbar Dourado'],
    has_gold_rim_option: true,
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      material: 'Cristal de Vidro Lapidado',
      dimensions: 'Altura 35cm x Diâmetro 16cm',
    }
  }
];
