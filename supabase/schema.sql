-- TOQUE IDEAL DIGITAL SHOWROOM - SUPABASE DATABASE SCHEMA
-- Execute este arquivo no SQL Editor do seu Dashboard Supabase

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) DEFAULT 'Package',
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUTOS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    promo_price DECIMAL(10,2) DEFAULT NULL,
    moq INT NOT NULL DEFAULT 1, -- Quantidade Mínima
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_launch BOOLEAN DEFAULT FALSE,
    custom_options JSONB DEFAULT '["Gravação Laser", "Impressão UV", "Serigrafia"]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. IMAGENS DO PRODUTO
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CLIENTES
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) DEFAULT 'SP',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORÇAMENTOS / PEDIDOS COMERCIAIS
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Novo', -- Novo, Em análise, Orçamento enviado, Negociação, Aprovado, Produção, Concluído, Cancelado
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ITENS DO ORÇAMENTO
CREATE TABLE IF NOT EXISTS public.quote_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    customization_details TEXT,
    line_subtotal DECIMAL(10,2) NOT NULL
);

-- 7. EVENTOS ANALYTICS (MODO EXPOSIÇÃO & MÉTRICAS)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- product_view, product_add, quote_submitted, qr_generated, whatsapp_clicked, session_started
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Leitura pública para o showroom
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public product images are viewable by everyone" ON public.product_images FOR SELECT USING (true);

-- Permissão de inserção pública para orçamentos e eventos
CREATE POLICY "Allow public client creation" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public quote creation" ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public quote items creation" ON public.quote_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Leitura/Escrita completa para admin e serviço
CREATE POLICY "Allow full access for authenticated admin" ON public.quotes FOR ALL USING (true);
CREATE POLICY "Allow full access for authenticated clients" ON public.clients FOR ALL USING (true);
CREATE POLICY "Allow full product admin manage" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow full images admin manage" ON public.product_images FOR ALL USING (true);

-- INDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON public.quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);

-- DADOS INICIAIS / SEED DATA
INSERT INTO public.categories (id, name, slug, icon, description, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Taças', 'tacas', 'Wine', 'Taças personalizadas em acrílico cristal e vidro lapidado', 1),
('c0000000-0000-0000-0000-000000000002', 'Copos', 'copos', 'Beer', 'Copos premium, long drink, térmicos e metalizados', 2),
('c0000000-0000-0000-0000-000000000003', 'Troféus', 'trofeus', 'Trophy', 'Troféus de alta precisão em acrílico bisotado, vidro e inox', 3),
('c0000000-0000-0000-0000-000000000004', 'Brindes Corporativos', 'brindes-corporativos', 'Gift', 'Soluções exclusivas para eventos, colaboradores e clientes VIP', 4),
('c0000000-0000-0000-0000-000000000005', 'Produtos Personalizados', 'produtos-personalizados', 'Sparkles', 'Artefatos com gravação a laser, impressão UV e alto relevo', 5),
('c0000000-0000-0000-0000-000000000006', 'Soluções Corporativas', 'solucoes-corporativas', 'Building2', 'Kits para grandes empresas, convenções e premiações', 6),
('c0000000-0000-0000-0000-000000000007', 'Lançamentos', 'lancamentos', 'Zap', 'Últimas novidades e designs exclusivos Toque Ideal', 7),
('c0000000-0000-0000-0000-000000000008', 'Mais Vendidos', 'mais-vendidos', 'Flame', 'Os campeões de vendas em grandes eventos e feiras', 8)
ON CONFLICT (slug) DO NOTHING;
