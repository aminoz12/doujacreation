-- =====================================================
-- ZINACHIC - STRIPE MIGRATION
-- Switches payment provider from SumUp to Stripe.
-- Run this SQL in the Supabase SQL Editor.
-- Safe to run multiple times (idempotent).
-- =====================================================

-- New Stripe tracking columns on orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);

-- New orders default to the Stripe payment method
ALTER TABLE orders ALTER COLUMN payment_method SET DEFAULT 'stripe';

-- Lookups used by the webhook
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);

-- NOTE: the legacy sumup_checkout_id / sumup_transaction_id columns are kept
-- for historical orders. Drop them later once no old orders reference them:
--   ALTER TABLE orders DROP COLUMN IF EXISTS sumup_checkout_id;
--   ALTER TABLE orders DROP COLUMN IF EXISTS sumup_transaction_id;
