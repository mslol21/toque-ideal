import { Category, Product } from '@/types';

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
    id: 'p0000000-0000-0000-0000-000000000001',
    sku: 'VDR-WAV-01',
    name: 'Centro de Mesa Sculpted Wave Verde 50cm',
    slug: 'centro-de-mesa-sculpted-wave-verde',
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
    custom_options: ['Lapidação Especial', 'Gravação Laser no Vidro', 'Filete em Ouro 24k / Borda Dourada', 'Embalagem Especial de Presente'],
    available_colors: ['Verde Esmeralda', 'Âmbar Dourado', 'Azul Cobalto', 'Fumê Cristal', 'Incolor / Transparente', 'Rubi Imperial'],
    has_gold_rim_option: true,
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      material: 'Vidro Moldado Artesanal Translúcido 8mm',
      dimensions: 'Comprimento 52cm x Largura 24cm x Altura 12cm',
      weight: '3.200g',
      applications: ['Decoração de Salas VIP', 'Aparadores Corporativos', 'Projetos de Interiores']
    }
  },
  {
    id: 'p0000000-0000-0000-0000-000000000002',
    sku: 'VDR-AMB-02',
    name: 'Escultura Flama Âmbar Lapidada 45cm',
    slug: 'escultura-flama-ambar-lapidada',
    short_desc: 'Escultura imponente em vidro soprado com nuances refinadas e base de acrílico cristal.',
    description: 'Destaque da ABCasa Fair. Uma peça artística rica em textura e nuances cromáticas que refrata a iluminação ambiente. Ideal para hotéis de luxo, escritórios de advocacia e residências de alto padrão.',
    price: 690.00,
    promo_price: 620.00,
    moq: 1,
    category_id: 'c0000000-0000-0000-0000-000000000002',
    category_name: 'Home Decor & Design',
    is_active: true,
    is_featured: true,
    is_launch: true,
    custom_options: ['Placa de Inox Gravada a Laser', 'Base Personalizada', 'Lapidação Especial', 'Filete em Ouro 24k / Borda Dourada'],
    available_colors: ['Âmbar Dourado', 'Verde Esmeralda', 'Azul Cobalto', 'Incolor / Transparente', 'Fumê Cristal'],
    has_gold_rim_option: true,
    images: [
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      material: 'Vidro Âmbar Nobre + Base Acrílica Maciça',
      dimensions: 'Altura 45cm x Largura 18cm x Profundidade 12cm',
      weight: '4.500g',
      applications: ['Homenagens Especiais', 'Decoração de Interiores', 'Coleção ABCasa']
    }
  },
  {
    id: 'p0000000-0000-0000-0000-000000000003',
    sku: 'VDR-FOL-03',
    name: 'Prato Decorativo de Vidro Moldado "Folha"',
    slug: 'prato-decorativo-vidro-folha',
    short_desc: 'Prato decorativo com relevo de folha natural em vidro de alta espessura.',
    description: 'Objeto de arte com curvas orgânicas inspiradas na natureza. Produzido em técnica de termo-moldagem em matriz cerâmica, perfeito para composições de mesas de centro.',
    price: 290.00,
    promo_price: 260.00,
    moq: 1,
    category_id: 'c0000000-0000-0000-0000-000000000001',
    category_name: 'Peças Decorativas em Vidro',
    is_active: true,
    is_featured: true,
    is_launch: false,
    custom_options: ['Lapidação Especial', 'Gravação Laser no Vidro', 'Filete em Ouro 24k / Borda Dourada'],
    available_colors: ['Verde Esmeralda', 'Fumê Cristal', 'Incolor / Transparente', 'Âmbar Dourado', 'Rubi Imperial'],
    has_gold_rim_option: true,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      material: 'Vidro Termo-moldado 10mm',
      dimensions: 'Comprimento 48cm x Largura 28cm',
      weight: '2.800g',
      applications: ['Mesa de Centro', 'Aparadores', 'Projetos Arquitetônicos']
    }
  },
  {
    id: 'p0000000-0000-0000-0000-000000000004',
    sku: 'VDR-BIS-04',
    name: 'Vaso Decorativo Lapidado Cristal Bisotado',
    slug: 'vaso-decorativo-lapidado-cristal-bisotado',
    short_desc: 'Vaso geométrico em cristal de alta transparência com facetas lapidadas à mão.',
    description: 'Refração de luz impressionante com facetas angulares bisotadas. Cria um ponto focal sofisticado em qualquer ambiente decorado.',
    price: 450.00,
    promo_price: 399.00,
    moq: 1,
    category_id: 'c0000000-0000-0000-0000-000000000003',
    category_name: 'Destaques ABCasa Fair',
    is_active: true,
    is_featured: true,
    is_launch: true,
    custom_options: ['Lapidação Especial', 'Filete em Ouro 24k / Borda Dourada', 'Embalagem Especial de Presente'],
    available_colors: ['Incolor / Transparente', 'Âmbar Dourado', 'Verde Esmeralda', 'Fumê Cristal', 'Azul Cobalto'],
    has_gold_rim_option: true,
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'
    ],
    specs: {
      material: 'Vidro Cristal Lapidado Bisotado 12mm',
      dimensions: 'Altura 35cm x Diâmetro 18cm',
      weight: '3.600g',
      applications: ['Hall de Entrada', 'Salas de Reunião Diretoria', 'Showrooms']
    }
  }
];
