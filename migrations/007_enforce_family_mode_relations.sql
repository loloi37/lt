-- Migration 007: Enforce family-mode isolation for memorial_relations
-- Rule: Only memorials with mode='family' can have relationships

-- ============================================================
-- STEP 1: Clean up any existing invalid relations
-- (relations involving non-family memorials)
-- ============================================================
DELETE FROM memorial_relations
WHERE from_memorial_id IN (SELECT id FROM memorials WHERE mode != 'family')
   OR to_memorial_id IN (SELECT id FROM memorials WHERE mode != 'family');

-- ============================================================
-- STEP 2: Trigger — block INSERT of relations on non-family memorials
-- ============================================================
CREATE OR REPLACE FUNCTION enforce_family_mode_relations()
RETURNS TRIGGER AS $$
DECLARE
  from_mode TEXT;
  to_mode TEXT;
BEGIN
  SELECT mode INTO from_mode FROM memorials WHERE id = NEW.from_memorial_id;
  SELECT mode INTO to_mode FROM memorials WHERE id = NEW.to_memorial_id;

  IF from_mode IS NULL THEN
    RAISE EXCEPTION 'Source memorial not found: %', NEW.from_memorial_id;
  END IF;

  IF to_mode IS NULL THEN
    RAISE EXCEPTION 'Target memorial not found: %', NEW.to_memorial_id;
  END IF;

  IF from_mode != 'family' OR to_mode != 'family' THEN
    RAISE EXCEPTION 'Relations are only allowed between family-mode memorials. from_mode=%, to_mode=%', from_mode, to_mode;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_enforce_family_mode_relations
  BEFORE INSERT ON memorial_relations
  FOR EACH ROW
  EXECUTE FUNCTION enforce_family_mode_relations();

-- ============================================================
-- STEP 3: Trigger — prevent downgrading memorial mode if relations exist
-- (blocks family → personal/draft if memorial has active relations)
-- ============================================================
CREATE OR REPLACE FUNCTION prevent_mode_downgrade_with_relations()
RETURNS TRIGGER AS $$
DECLARE
  relation_count INTEGER;
BEGIN
  -- Only check when mode is changing away from 'family'
  IF OLD.mode = 'family' AND NEW.mode != 'family' THEN
    SELECT COUNT(*) INTO relation_count
    FROM memorial_relations
    WHERE from_memorial_id = NEW.id OR to_memorial_id = NEW.id;

    IF relation_count > 0 THEN
      RAISE EXCEPTION 'Cannot change mode from family to % — this memorial has % active relation(s). Remove all relations first.', NEW.mode, relation_count;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_prevent_mode_downgrade_with_relations
  BEFORE UPDATE ON memorials
  FOR EACH ROW
  WHEN (OLD.mode IS DISTINCT FROM NEW.mode)
  EXECUTE FUNCTION prevent_mode_downgrade_with_relations();
