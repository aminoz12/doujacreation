-- ============================================================================
-- ZINACHIC — COMPLETE SUPABASE SETUP (single file)
-- ============================================================================
-- Run this ONCE in the Supabase SQL Editor of your NEW project.
-- It is idempotent (safe to re-run) and creates everything the app needs:
--   • all tables (catalog, orders, bespoke leads, admin/auth)
--   • indexes, Row Level Security policies, functions & triggers
--   • the `product-images` storage bucket + public-read policy
--   • seed data (currencies, collections, occasion tags, default admin)
--
-- AFTER RUNNING:
--   1. Set these env vars in the app (.env.local / Vercel):
--        NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
--        SUPABASE_SERVICE_ROLE_KEY   (from Project Settings → API)
--   2. Default admin login →  username: dija   password: dija123@
--        ⚠️ CHANGE THIS IMMEDIATELY from the admin Settings page.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. TABLES
-- ----------------------------------------------------------------------------

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  remember_me BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_fr TEXT,
  image_url TEXT,
  meta_title_en VARCHAR(255),
  meta_title_fr VARCHAR(255),
  meta_description_en TEXT,
  meta_description_fr TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(50) UNIQUE,
  name_en VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_fr TEXT,
  size_guide_en TEXT,
  size_guide_fr TEXT,
  fabric_care_en TEXT,
  fabric_care_fr TEXT,
  price_eur DECIMAL(10,2) NOT NULL,
  original_price_eur DECIMAL(10,2),
  is_promotion BOOLEAN DEFAULT false,
  promotion_start_date DATE,
  promotion_end_date DATE,
  promotion_label_en VARCHAR(100),
  promotion_label_fr VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'out_of_season')),
  meta_title_en VARCHAR(255),
  meta_title_fr VARCHAR(255),
  meta_description_en TEXT,
  meta_description_fr TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upgrade path: databases created before per-product size/fabric guides existed.
-- (CREATE TABLE IF NOT EXISTS does not add columns to an existing table.)
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_guide_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_guide_fr TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS fabric_care_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS fabric_care_fr TEXT;

-- Product sizes
CREATE TABLE IF NOT EXISTS product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(20) NOT NULL,
  stock_quantity INT DEFAULT 0,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product colors
CREATE TABLE IF NOT EXISTS product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  hex_code VARCHAR(7) NOT NULL,
  stock_quantity INT DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product images (color_id references product_colors, declared above)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_id UUID REFERENCES product_colors(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  alt_text_en VARCHAR(255),
  alt_text_fr VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product ↔ Collections (M2M)
CREATE TABLE IF NOT EXISTS product_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, collection_id)
);

-- Tags + Product ↔ Tags (M2M)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, tag_id)
);

-- Currency rates (EUR base)
CREATE TABLE IF NOT EXISTS currency_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency_code VARCHAR(3) NOT NULL UNIQUE,
  rate_from_eur DECIMAL(10,6) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (Stripe payments)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  -- Customer
  customer_first_name VARCHAR(100) NOT NULL,
  customer_last_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  -- Shipping
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100) NOT NULL DEFAULT 'Morocco',
  -- Billing (optional)
  billing_address TEXT,
  billing_city VARCHAR(100),
  billing_postal_code VARCHAR(20),
  billing_country VARCHAR(100),
  -- Totals
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  -- Payment (Stripe)
  payment_method VARCHAR(50) DEFAULT 'stripe',
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  stripe_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  -- Legacy (kept nullable for historical compatibility)
  sumup_checkout_id VARCHAR(255),
  sumup_transaction_id VARCHAR(255),
  -- Fulfilment
  status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, pending, delivered, cancelled
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Order line items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name_en VARCHAR(255) NOT NULL,
  product_name_fr VARCHAR(255),
  product_sku VARCHAR(100),
  product_image_url TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bespoke / made-to-measure leads
CREATE TABLE IF NOT EXISTS bespoke_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  occasion VARCHAR(100),
  event_date DATE,
  budget VARCHAR(50),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, contacted, quoted, won, lost
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. INDEXES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_colors_product_id ON product_colors(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_color_id ON product_images(color_id);
CREATE INDEX IF NOT EXISTS idx_product_collections_product ON product_collections(product_id);
CREATE INDEX IF NOT EXISTS idx_product_collections_collection ON product_collections(collection_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_product ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_bespoke_status ON bespoke_requests(status);
CREATE INDEX IF NOT EXISTS idx_bespoke_created_at ON bespoke_requests(created_at DESC);

-- ----------------------------------------------------------------------------
-- 3. FUNCTIONS & TRIGGERS
-- ----------------------------------------------------------------------------

-- updated_at auto-touch
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_currency_rates_updated_at ON currency_rates;
CREATE TRIGGER update_currency_rates_updated_at BEFORE UPDATE ON currency_rates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Promotion helpers
CREATE OR REPLACE FUNCTION is_promotion_active(p products)
RETURNS BOOLEAN AS $$
BEGIN
  IF p.is_promotion = false THEN RETURN false; END IF;
  IF p.promotion_start_date IS NOT NULL AND p.promotion_start_date > CURRENT_DATE THEN RETURN false; END IF;
  IF p.promotion_end_date IS NOT NULL AND p.promotion_end_date < CURRENT_DATE THEN RETURN false; END IF;
  RETURN true;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_effective_price(p products)
RETURNS DECIMAL AS $$
BEGIN
  IF is_promotion_active(p) AND p.original_price_eur IS NOT NULL THEN
    RETURN p.price_eur;
  END IF;
  RETURN COALESCE(p.original_price_eur, p.price_eur);
END;
$$ LANGUAGE plpgsql;

-- Auto-generate order number (ZC-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'ZC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_order_number ON orders;
CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
ALTER TABLE admins              ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections         ENABLE ROW LEVEL SECURITY;
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors      ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images      ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags                ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_rates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bespoke_requests    ENABLE ROW LEVEL SECURITY;

-- Public (anon) read access — storefront. Orders/leads are NOT publicly readable.
DROP POLICY IF EXISTS "Public read collections" ON collections;
CREATE POLICY "Public read collections" ON collections FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Public read product_images" ON product_images;
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read product_collections" ON product_collections;
CREATE POLICY "Public read product_collections" ON product_collections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read product_sizes" ON product_sizes;
CREATE POLICY "Public read product_sizes" ON product_sizes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read product_colors" ON product_colors;
CREATE POLICY "Public read product_colors" ON product_colors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read tags" ON tags;
CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read product_tags" ON product_tags;
CREATE POLICY "Public read product_tags" ON product_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read currency_rates" ON currency_rates;
CREATE POLICY "Public read currency_rates" ON currency_rates FOR SELECT USING (true);

-- Service role full access (admin/server operations bypass the public rules).
DROP POLICY IF EXISTS "Service role full access admins" ON admins;
CREATE POLICY "Service role full access admins" ON admins FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access admin_sessions" ON admin_sessions;
CREATE POLICY "Service role full access admin_sessions" ON admin_sessions FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access collections" ON collections;
CREATE POLICY "Service role full access collections" ON collections FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access products" ON products;
CREATE POLICY "Service role full access products" ON products FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access product_sizes" ON product_sizes;
CREATE POLICY "Service role full access product_sizes" ON product_sizes FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access product_colors" ON product_colors;
CREATE POLICY "Service role full access product_colors" ON product_colors FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access product_images" ON product_images;
CREATE POLICY "Service role full access product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access product_collections" ON product_collections;
CREATE POLICY "Service role full access product_collections" ON product_collections FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access tags" ON tags;
CREATE POLICY "Service role full access tags" ON tags FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access product_tags" ON product_tags;
CREATE POLICY "Service role full access product_tags" ON product_tags FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access currency_rates" ON currency_rates;
CREATE POLICY "Service role full access currency_rates" ON currency_rates FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access orders" ON orders;
CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access order_items" ON order_items;
CREATE POLICY "Service role full access order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role full access bespoke_requests" ON bespoke_requests;
CREATE POLICY "Service role full access bespoke_requests" ON bespoke_requests FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 5. STORAGE BUCKET (product images)
-- ----------------------------------------------------------------------------
-- Create a public bucket. Uploads happen server-side via the service role
-- (bypasses RLS); the public-read policy lets the storefront load images.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  15728640, -- 15 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read product-images" ON storage.objects;
CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- ----------------------------------------------------------------------------
-- 6. SEED DATA
-- ----------------------------------------------------------------------------

-- Currencies (EUR base)
INSERT INTO currency_rates (currency_code, rate_from_eur, symbol) VALUES
  ('EUR', 1.000000, '€'),
  ('USD', 1.080000, '$'),
  ('MAD', 10.900000, 'د.م.')
ON CONFLICT (currency_code) DO NOTHING;

-- Collections
INSERT INTO collections (slug, name_en, name_fr, description_en, description_fr, display_order) VALUES
  ('caftan',      'Caftan',      'Caftan',      'Elegant traditional caftans', 'Caftans traditionnels élégants', 1),
  ('jellaba',     'Jellaba',     'Jellaba',     'Classic Moroccan jellabas',   'Jellabas marocaines classiques', 2),
  ('takchita',    'Takchita',    'Takchita',    'Ceremonial takchitas',        'Takchitas de cérémonie',         3),
  ('homme',       'Men',         'Homme',       'Traditional men''s wear',     'Vêtements traditionnels pour hommes', 4),
  ('femme',       'Women',       'Femme',       'Traditional women''s wear',   'Vêtements traditionnels pour femmes', 5),
  ('accessories', 'Accessories', 'Accessoires', 'Luxury accessories',          'Accessoires de luxe',            6)
ON CONFLICT (slug) DO NOTHING;

-- Tags (includes the occasion tags used by the "Shop the Occasion" section)
INSERT INTO tags (name_en, name_fr, slug) VALUES
  ('Wedding',         'Mariage',          'wedding'),
  ('Eid',             'Aïd',              'eid'),
  ('Henna Night',     'Soirée Henné',     'henna'),
  ('Evening',         'Soirée',           'evening'),
  ('Bestseller',      'Meilleures ventes','bestseller'),
  ('Summer 2026',     'Été 2026',         'summer-2026'),
  ('Limited Edition', 'Édition limitée',  'limited-edition'),
  ('Handmade',        'Fait main',        'handmade')
ON CONFLICT (slug) DO NOTHING;

-- Default admin — username: dija / password: dija123@  (bcrypt hash)
-- ⚠️ CHANGE THE PASSWORD from the admin Settings page right after first login.
INSERT INTO admins (username, password_hash) VALUES
  ('dija', '$2b$10$9xe6fR4KVA1Y5Ud00icg7.nDsvZy45MzpZBweUSpoj0p0eoSUpkaG')
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- DONE. Verify with:
--   SELECT table_name FROM information_schema.tables WHERE table_schema='public';
--   SELECT id, public FROM storage.buckets WHERE id='product-images';
-- ============================================================================
