-- ============================================
-- SQL Migration #49: Monetization & Pricing Upgrade
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Add plan_type column to memorials
-- Tracks which plan the user purchased: 'personal', 'family', 'concierge'
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'personal';

-- 2. Add amount_paid to memorials
-- Stores the dollar amount paid (e.g., 1470, 2940, 6300)
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS amount_paid INTEGER DEFAULT 0;

-- 3. Add stripe_payment_id to memorials
-- Stores the Stripe PaymentIntent or Checkout Session ID for reference
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT;

-- 4. Add refund_eligible flag to memorials
-- TRUE by default after payment, becomes FALSE when archive is published
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS refund_eligible BOOLEAN DEFAULT TRUE;

-- 5. Create index for refund queries
CREATE INDEX IF NOT EXISTS idx_memorials_refund_eligible ON memorials(refund_eligible);
CREATE INDEX IF NOT EXISTS idx_memorials_plan_type ON memorials(plan_type);

-- 6. Create trigger: automatically set refund_eligible = false when status changes to 'published'
CREATE OR REPLACE FUNCTION auto_disable_refund_on_publish()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
        NEW.refund_eligible = FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_disable_refund_on_publish ON memorials;
CREATE TRIGGER trigger_disable_refund_on_publish
    BEFORE UPDATE ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION auto_disable_refund_on_publish();

-- 7. Add upgrade tracking columns to memorials
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS upgraded_from TEXT; -- e.g., 'personal' if upgraded to family
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS upgraded_at TIMESTAMP WITH TIME ZONE;

-- 8. Add payment tracking to concierge_projects for phased payments
ALTER TABLE concierge_projects
ADD COLUMN IF NOT EXISTS total_amount INTEGER DEFAULT 6300;
ALTER TABLE concierge_projects
ADD COLUMN IF NOT EXISTS amount_paid_so_far INTEGER DEFAULT 0;
ALTER TABLE concierge_projects
ADD COLUMN IF NOT EXISTS payment_phase TEXT DEFAULT 'pending';
-- payment_phase: 'pending' | 'deposit_30' | 'draft_40' | 'final_30' | 'complete'
ALTER TABLE concierge_projects
ADD COLUMN IF NOT EXISTS upgraded_from TEXT; -- 'family' if upgraded from family plan
ALTER TABLE concierge_projects
ADD COLUMN IF NOT EXISTS differential_amount INTEGER; -- amount after subtracting previous plan

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check new columns exist on memorials
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'memorials'
  AND column_name IN ('plan_type', 'amount_paid', 'stripe_payment_id', 'refund_eligible', 'upgraded_from', 'upgraded_at')
ORDER BY column_name;

-- Check new columns on concierge_projects
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'concierge_projects'
  AND column_name IN ('total_amount', 'amount_paid_so_far', 'payment_phase', 'upgraded_from', 'differential_amount')
ORDER BY column_name;

-- Check trigger exists
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_disable_refund_on_publish';
