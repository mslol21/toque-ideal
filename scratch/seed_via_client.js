const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unnskpqpnmpxenzfxesb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVubnNrcHFwbm1weGVuemZ4ZXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NzU2OTEsImV4cCI6MjEwMjE1MTY5MX0.WiwtqKuYFO53-wmyj2mq9Sma6-fgFpRzUaAA3eqwPJk';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: null }
});

const INITIAL_CATEGORIES = [
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

const INITIAL_PRODUCTS = [
  {
    id: 'p0000000-0000-0000-0000-000000000001',
    sku: 'VDR-WAV-01',
    name: 'Centro de Mesa Sculpted Wave Verde 50cm',
    slug: 'centro-de-mesa-sculpted-wave-verde',
    short_desc: 'Peça decorativa em vidro moldado artesanal com efeito ondulado verde esmeralda cristalino.',
    description: 'Ícone da coleção Home Decor Toque Ideal. Este centro de mesa escultural é moldado a quente em vidro de alta espessura com tonalidade verde profundo, criando fluidez e elegância incomparáveis em mesas de jantar, recepções e aparadores.',
    price: 380.00,
    promo_price: 340.00,
    moq: 1,
    category_id: 'c0000000-0000-0000-0000-000000000001',
    category_name: 'Peças Decorativas em Vidro',
    is_active: true,
    is_featured: true,
    is_launch: true,
    custom_options: ['Lapidação Especial', 'Gravação Laser no Vidro', 'Embalagem Especial de Presente'],
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
    short_desc: 'Escultura imponente em vidro soprado cor âmbar com base de acrílico preto cristal.',
    description: 'Destaque da ABCasa Fair. Uma peça artística rica em textura e nuances douradas que refrata a iluminação ambiente. Ideal para hotéis de luxo, escritórios de advocacia e residências de alto padrão.',
    price: 690.00,
    promo_price: 620.00,
    moq: 1,
    category_id: 'c0000000-0000-0000-0000-000000000002',
    category_name: 'Home Decor & Design',
    is_active: true,
    is_featured: true,
    is_launch: true,
    custom_options: ['Placa de Inox Gravada a Laser', 'Base Personalizada', 'Lapidação Especial'],
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
  }
];

async function seed() {
  console.log('Seeding categories via Supabase REST API...');
  const { data: catData, error: catErr } = await supabase.from('categories').upsert(INITIAL_CATEGORIES).select();
  if (catErr) {
    console.log('Categories notice (table may need schema.sql execution in SQL Editor):', catErr.message);
  } else {
    console.log('Successfully seeded categories in Supabase!', catData.length);
  }

  console.log('Seeding products via Supabase REST API...');
  const { data: prodData, error: prodErr } = await supabase.from('products').upsert(INITIAL_PRODUCTS).select();
  if (prodErr) {
    console.log('Products notice:', prodErr.message);
  } else {
    console.log('Successfully seeded products in Supabase!', prodData.length);
  }
}

seed();
