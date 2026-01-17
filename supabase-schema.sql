-- ============================================
-- DOUJA CREATION - COMPLETE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ADMINS TABLE
-- ============================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. COLLECTIONS TABLE
-- ============================================
CREATE TABLE collections (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(50) UNIQUE,
  name_en VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_fr TEXT,
  -- Pricing (stored in EUR)
  price_eur DECIMAL(10,2) NOT NULL,
  original_price_eur DECIMAL(10,2),
  -- Promotion
  is_promotion BOOLEAN DEFAULT false,
  promotion_start_date DATE,
  promotion_end_date DATE,
  promotion_label_en VARCHAR(100),
  promotion_label_fr VARCHAR(100),
  -- Stock
  stock_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  -- Flags
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'out_of_season')),
  -- SEO
  meta_title_en VARCHAR(255),
  meta_title_fr VARCHAR(255),
  meta_description_en TEXT,
  meta_description_fr TEXT,
  -- Ordering
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. PRODUCT SIZES TABLE
-- ============================================
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(20) NOT NULL,
  stock_quantity INT DEFAULT 0,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_sizes_product_id ON product_sizes(product_id);

-- ============================================
-- 5. PRODUCT COLORS TABLE
-- ============================================
CREATE TABLE product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  hex_code VARCHAR(7) NOT NULL,
  stock_quantity INT DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_colors_product_id ON product_colors(product_id);

-- ============================================
-- 6. PRODUCT IMAGES TABLE (up to 5 images)
-- ============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_id UUID REFERENCES product_colors(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  alt_text_en VARCHAR(255),
  alt_text_fr VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_color_id ON product_images(color_id);

-- ============================================
-- 7. PRODUCT_COLLECTIONS TABLE (many-to-many)
-- ============================================
CREATE TABLE product_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, collection_id)
);

CREATE INDEX idx_product_collections_product ON product_collections(product_id);
CREATE INDEX idx_product_collections_collection ON product_collections(collection_id);

-- ============================================
-- 8. PRODUCT TAGS TABLE
-- ============================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, tag_id)
);

CREATE INDEX idx_product_tags_product ON product_tags(product_id);
CREATE INDEX idx_product_tags_tag ON product_tags(tag_id);

-- ============================================
-- 9. CURRENCY RATES TABLE
-- ============================================
CREATE TABLE currency_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency_code VARCHAR(3) NOT NULL UNIQUE,
  rate_from_eur DECIMAL(10,6) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 10. ADMIN SESSIONS TABLE
-- ============================================
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  remember_me BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_admin ON admin_sessions(admin_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read collections" ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_collections" ON product_collections FOR SELECT USING (true);
CREATE POLICY "Public read product_sizes" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Public read product_colors" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read product_tags" ON product_tags FOR SELECT USING (true);
CREATE POLICY "Public read currency_rates" ON currency_rates FOR SELECT USING (true);

-- Service role has full access (for admin operations)
CREATE POLICY "Service role full access admins" ON admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access collections" ON collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access product_collections" ON product_collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access product_sizes" ON product_sizes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access product_colors" ON product_colors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access tags" ON tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access product_tags" ON product_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access currency_rates" ON currency_rates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access admin_sessions" ON admin_sessions FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_currency_rates_updated_at BEFORE UPDATE ON currency_rates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Check if promotion is active
-- ============================================
CREATE OR REPLACE FUNCTION is_promotion_active(p products)
RETURNS BOOLEAN AS $$
BEGIN
  IF p.is_promotion = false THEN
    RETURN false;
  END IF;
  
  IF p.promotion_start_date IS NOT NULL AND p.promotion_start_date > CURRENT_DATE THEN
    RETURN false;
  END IF;
  
  IF p.promotion_end_date IS NOT NULL AND p.promotion_end_date < CURRENT_DATE THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Get product effective price
-- ============================================
CREATE OR REPLACE FUNCTION get_effective_price(p products)
RETURNS DECIMAL AS $$
BEGIN
  IF is_promotion_active(p) AND p.original_price_eur IS NOT NULL THEN
    RETURN p.price_eur;
  END IF;
  RETURN COALESCE(p.original_price_eur, p.price_eur);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA
-- ============================================

-- Default currency rates (EUR is now the base currency)
INSERT INTO currency_rates (currency_code, rate_from_eur, symbol) VALUES
  ('EUR', 1.000000, '€'),
  ('USD', 1.080000, '$'),
  ('MAD', 10.900000, 'د.م.');

-- Default collections
INSERT INTO collections (slug, name_en, name_fr, description_en, description_fr, display_order) VALUES
  ('caftan', 'Caftan', 'Caftan', 'Elegant traditional caftans', 'Caftans traditionnels élégants', 1),
  ('jellaba', 'Jellaba', 'Jellaba', 'Classic Moroccan jellabas', 'Jellabas marocaines classiques', 2),
  ('takchita', 'Takchita', 'Takchita', 'Ceremonial takchitas', 'Takchitas de cérémonie', 3),
  ('homme', 'Men', 'Homme', 'Traditional men''s wear', 'Vêtements traditionnels pour hommes', 4),
  ('femme', 'Women', 'Femme', 'Traditional women''s wear', 'Vêtements traditionnels pour femmes', 5),
  ('accessories', 'Accessories', 'Accessoires', 'Luxury accessories', 'Accessoires de luxe', 6);

-- Default tags
INSERT INTO tags (name_en, name_fr, slug) VALUES
  ('Wedding', 'Mariage', 'wedding'),
  ('Bestseller', 'Meilleures ventes', 'bestseller'),
  ('Summer 2026', 'Été 2026', 'summer-2026'),
  ('Limited Edition', 'Édition limitée', 'limited-edition'),
  ('Handmade', 'Fait main', 'handmade');

-- Default admin (password: dija123@ - hashed with bcrypt)
INSERT INTO admins (username, password_hash) VALUES
  ('dija', '$2b$10$9xe6fR4KVA1Y5Ud00icg7.nDsvZy45MzpZBweUSpoj0p0eoSUpkaG');

-- ============================================
-- STORAGE BUCKET SETUP
-- Run this separately or create via Supabase Dashboard:
-- ============================================
-- Go to Storage in Supabase Dashboard
-- Create a new bucket called 'product-images'
-- Set it to 'Public bucket'
-- Add policy: Allow public read access
-- Add policy: Allow authenticated uploads (or use service role)

