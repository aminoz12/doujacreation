-- ============================================
-- MIGRATION: Rename MAD columns to EUR
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Rename price columns in products table
ALTER TABLE products RENAME COLUMN price_mad TO price_eur;
ALTER TABLE products RENAME COLUMN original_price_mad TO original_price_eur;

-- 2. Update currency_rates table to use EUR as base
UPDATE currency_rates SET rate_from_mad = 1.000000 WHERE currency_code = 'EUR';
UPDATE currency_rates SET rate_from_mad = 1.080000 WHERE currency_code = 'USD';
UPDATE currency_rates SET rate_from_mad = 10.900000 WHERE currency_code = 'MAD';

-- 3. Rename the rate column to be more accurate
ALTER TABLE currency_rates RENAME COLUMN rate_from_mad TO rate_from_eur;

-- 4. Update the get_effective_price function
CREATE OR REPLACE FUNCTION get_effective_price(p products)
RETURNS DECIMAL AS $$
BEGIN
  IF is_promotion_active(p) AND p.original_price_eur IS NOT NULL THEN
    RETURN p.price_eur;
  END IF;
  RETURN COALESCE(p.original_price_eur, p.price_eur);
END;
$$ LANGUAGE plpgsql;

-- 5. Update is_promotion_active to use new column names (no changes needed, it doesn't use price columns)

-- Done! Your database now uses EUR as the primary currency.





