-- =====================================================
-- ZINACHIC - BESPOKE / MADE-TO-MEASURE REQUESTS
-- Lead capture for custom orders. Run in the Supabase SQL editor.
-- =====================================================

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

CREATE INDEX IF NOT EXISTS idx_bespoke_status ON bespoke_requests(status);
CREATE INDEX IF NOT EXISTS idx_bespoke_created_at ON bespoke_requests(created_at DESC);

-- RLS: only the service role can read/write (the public POST route uses the
-- service-role client server-side; the anon storefront key cannot read leads).
ALTER TABLE bespoke_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages bespoke_requests" ON bespoke_requests;
CREATE POLICY "Service role manages bespoke_requests"
  ON bespoke_requests FOR ALL
  USING (true)
  WITH CHECK (true);

GRANT ALL ON bespoke_requests TO service_role;
