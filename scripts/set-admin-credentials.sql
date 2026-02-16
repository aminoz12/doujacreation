-- Set admin panel user: username = dija, password = dija123@++
-- Run this in Supabase SQL Editor (or your PostgreSQL client).

-- Insert or update the admin (use ON CONFLICT to update if username already exists)
INSERT INTO admins (username, password_hash)
VALUES (
  'dija',
  '$2b$10$X2xy15QV2AiwnYqb9GVcdeCm.RxFpLpdm02MYJ3BeVN.JXhalEVyK'
)
ON CONFLICT (username)
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();
