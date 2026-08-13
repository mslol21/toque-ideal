-- TOQUE IDEAL DIGITAL SHOWROOM - SUPABASE DATABASE SCHEMA
-- Execute este arquivo no SQL Editor do seu Dashboard Supabase (https://supabase.com/dashboard/project/unnskpqpnmpxenzfxesb/sql)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(50) DEFAULT 'Sparkles',
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUTOS
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(100) PRIMARY KEY,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    promo_price DECIMAL(10,2) DEFAULT NULL,
    moq INT NOT NULL DEFAULT 1,
    category_id VARCHAR(100) REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_launch BOOLEAN DEFAULT FALSE,
    custom_options JSONB DEFAULT '["Gravação Laser no Vidro", "Lapidação Especial"]'::jsonb,
    available_colors JSONB DEFAULT '["Verde Esmeralda", "Âmbar Dourado", "Azul Cobalto", "Incolor / Transparente"]'::jsonb,
    has_gold_rim_option BOOLEAN DEFAULT TRUE,
    images JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ORÇAMENTOS / PEDIDOS COMERCIAIS
CREATE TABLE IF NOT EXISTS public.quotes (
    id VARCHAR(100) PRIMARY KEY,
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    client JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Novo',
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. EVENTOS ANALYTICS (MODO EXPOSIÇÃO & MÉTRICAS)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id VARCHAR(100) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    product_id VARCHAR(100),
    product_name VARCHAR(255),
    session_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROW LEVEL SECURITY (RLS) POLICIES - TOTAL READ/WRITE ACCESS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PERMISSIVAS PARA SHOWROOM E PAINEL ADMIN
DROP POLICY IF EXISTS "Public categories read" ON public.categories;
DROP POLICY IF EXISTS "Public categories write" ON public.categories;
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public categories write" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public products read" ON public.products;
DROP POLICY IF EXISTS "Public products write" ON public.products;
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public products write" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public quotes read" ON public.quotes;
DROP POLICY IF EXISTS "Public quotes write" ON public.quotes;
CREATE POLICY "Public quotes read" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Public quotes write" ON public.quotes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public analytics read" ON public.analytics_events;
DROP POLICY IF EXISTS "Public analytics write" ON public.analytics_events;
CREATE POLICY "Public analytics read" ON public.analytics_events FOR SELECT USING (true);
CREATE POLICY "Public analytics write" ON public.analytics_events FOR ALL USING (true) WITH CHECK (true);

-- SEED DATA DE CATEGORIAS INICIAIS
INSERT INTO public.categories (id, name, slug, icon, description, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Peças Decorativas em Vidro', 'pecas-decorativas-vidro', 'Sparkles', 'Design exclusivo em vidro moldado, ondas e esculturas de alta sofisticação.', 1),
('c0000000-0000-0000-0000-000000000002', 'Home Decor & Design', 'home-decor', 'Home', 'Peças únicas que transformam ambientes de luxo, residências e recepções corporativas.', 2),
('c0000000-0000-0000-0000-000000000003', 'Destaques ABCasa Fair', 'abcasa-fair', 'Award', 'Modelos expostos nas maiores feiras do segmento de decoração e design nacional.', 3)
ON CONFLICT (id) DO NOTHING;
