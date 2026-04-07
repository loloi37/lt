-- Commands to execute in Supabase for the Dashboard Navigation & Design phase.
-- Run in order. All statements are additive and idempotent.

-- 1. Per-memorial preservation size cap (50 GB default).
ALTER TABLE memorials
  ADD COLUMN IF NOT EXISTS preservation_size_cap_bytes BIGINT
  DEFAULT 53687091200;

-- 2. Ensure users.full_name exists for the Profile settings page.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS full_name TEXT;
