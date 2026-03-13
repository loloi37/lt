-- ============================================================================
-- Legacy Vault: "Value First" Luxury Refactor Migration
-- Migrates from multi-tier SaaS (draft/personal/family/concierge) to
-- single luxury model with collections-based data and Arweave preservation.
-- ============================================================================

-- 1. MEMORIAL STATE ENUM
-- Replaces the old mode + status + paid booleans with a single state field.
DO $$ BEGIN
    CREATE TYPE memorial_state AS ENUM ('creating', 'private', 'live', 'preserved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. ADD NEW COLUMNS TO MEMORIALS TABLE
-- Collections data (JSONB) replaces the old step1-step9 columns.
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS state memorial_state DEFAULT 'creating';
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS stories jsonb DEFAULT '{}'::jsonb;
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS media jsonb DEFAULT '{}'::jsonb;
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS timeline jsonb DEFAULT '{}'::jsonb;
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS network jsonb DEFAULT '{}'::jsonb;
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS letters jsonb DEFAULT '[]'::jsonb;

-- Arweave preservation fields
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS arweave_tx_id text;
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS arweave_status text CHECK (arweave_status IN ('pending', 'confirming', 'confirmed', 'failed'));
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS certificate_url text;

-- 3. MIGRATE EXISTING DATA FROM STEP-BASED TO COLLECTIONS-BASED
-- This maps the old step1-step9 columns into the new JSONB collections.
-- Only runs for rows that still have step1 data but no stories data.
UPDATE memorials
SET
    stories = jsonb_build_object(
        'fullName', COALESCE(step1->>'fullName', full_name, ''),
        'birthDate', COALESCE(step1->>'birthDate', birth_date, ''),
        'deathDate', step1->>'deathDate',
        'isStillLiving', COALESCE((step1->>'isStillLiving')::boolean, false),
        'isSelfArchive', COALESCE((step1->>'isSelfArchive')::boolean, false),
        'birthPlace', COALESCE(step1->>'birthPlace', ''),
        'deathPlace', COALESCE(step1->>'deathPlace', ''),
        'epitaph', COALESCE(step1->>'epitaph', ''),
        'biography', COALESCE(step6->>'biography', ''),
        'lifePhilosophy', COALESCE(step6->>'lifePhilosophy', ''),
        'childhoodHome', COALESCE(step2->>'childhoodHome', ''),
        'familyBackground', COALESCE(step2->>'familyBackground', ''),
        'schools', COALESCE(step2->'schools', '{"elementary":"","highSchool":"","college":"","additionalEducation":""}'::jsonb),
        'childhoodPersonality', COALESCE(step2->'childhoodPersonality', '[]'::jsonb),
        'earlyInterests', COALESCE(step2->'earlyInterests', '[]'::jsonb),
        'occupations', COALESCE(step3->'occupations', '[]'::jsonb),
        'careerHighlights', COALESCE(step3->'careerHighlights', '[]'::jsonb),
        'education', COALESCE(step3->'education', '{"major":"","graduationYear":"","honors":""}'::jsonb),
        'personalityTraits', COALESCE(step5->'personalityTraits', '[]'::jsonb),
        'coreValues', COALESCE(step5->'coreValues', '[]'::jsonb),
        'passions', COALESCE(step5->'passions', '[]'::jsonb),
        'favoriteQuotes', COALESCE(step5->'favoriteQuotes', '[]'::jsonb),
        'memorableSayings', COALESCE(step5->'memorableSayings', '[]'::jsonb),
        'legacyStatement', COALESCE(step8->>'legacyStatement', step6->>'legacyStatement', '')
    ),
    media = jsonb_build_object(
        'coverPhotoPreview', step8->>'coverPhotoPreview',
        'gallery', COALESCE(step8->'gallery', '[]'::jsonb),
        'childhoodPhotos', COALESCE(step2->'childhoodPhotos', '[]'::jsonb),
        'interactiveGallery', COALESCE(step8->'interactiveGallery', '[]'::jsonb),
        'voiceRecordings', COALESCE(step8->'voiceRecordings', '[]'::jsonb),
        'videos', COALESCE(step9->'videos', '[]'::jsonb)
    ),
    timeline = jsonb_build_object(
        'lifeChapters', COALESCE(step6->'lifeChapters', '[]'::jsonb),
        'majorLifeEvents', COALESCE(step4->'majorLifeEvents', step6->'majorLifeEvents', '[]'::jsonb)
    ),
    network = jsonb_build_object(
        'partners', COALESCE(step4->'partners', '[]'::jsonb),
        'children', COALESCE(step4->'children', '[]'::jsonb),
        'invitedEmails', COALESCE(step7->'invitedEmails', '[]'::jsonb),
        'contributorPersonalMessage', COALESCE(step7->>'personalMessage', ''),
        'sentInvitations', COALESCE(step7->'sentInvitations', '[]'::jsonb),
        'sharedMemories', COALESCE(step7->'sharedMemories', '[]'::jsonb),
        'impactStories', '[]'::jsonb
    ),
    -- Map old mode/paid to new state
    state = CASE
        WHEN paid = true AND status = 'published' THEN 'live'::memorial_state
        WHEN paid = true THEN 'live'::memorial_state
        WHEN mode IN ('personal', 'family', 'concierge') THEN 'private'::memorial_state
        ELSE 'creating'::memorial_state
    END
WHERE step1 IS NOT NULL
  AND (stories IS NULL OR stories = '{}'::jsonb);


-- 4. ARWEAVE TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS arweave_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id uuid REFERENCES memorials(id) ON DELETE CASCADE,
    tx_id text NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'confirmed', 'failed')),
    data_size bigint,
    cost_winston text,
    created_at timestamptz DEFAULT now(),
    confirmed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_arweave_tx_memorial ON arweave_transactions(memorial_id);
CREATE INDEX IF NOT EXISTS idx_arweave_tx_status ON arweave_transactions(status);


-- 5. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id uuid REFERENCES memorials(id) ON DELETE CASCADE,
    arweave_tx_id text NOT NULL,
    pdf_storage_path text,
    generated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_certificates_memorial ON certificates(memorial_id);


-- 6. MODERATION REVIEWS TABLE
CREATE TABLE IF NOT EXISTS moderation_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id uuid REFERENCES memorials(id) ON DELETE CASCADE,
    content_type text NOT NULL CHECK (content_type IN ('text', 'photo', 'video', 'voice')),
    content_ref text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'flagged', 'rejected')),
    reviewer_notes text,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_moderation_memorial ON moderation_reviews(memorial_id);


-- 7. LETTERS TO THE FUTURE TABLE
CREATE TABLE IF NOT EXISTS letters_to_future (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id uuid REFERENCES memorials(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id),
    recipient_name text,
    recipient_email text NOT NULL,
    deliver_at timestamptz NOT NULL,
    content text NOT NULL,
    sealed boolean DEFAULT false,
    status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'delivered', 'failed')),
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_letters_memorial ON letters_to_future(memorial_id);
CREATE INDEX IF NOT EXISTS idx_letters_deliver ON letters_to_future(deliver_at) WHERE status = 'scheduled';


-- 8. CONTRIBUTOR INVITATIONS TABLE (mirrors witness_invitations with updated naming)
CREATE TABLE IF NOT EXISTS contributor_invitations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id uuid REFERENCES memorials(id) ON DELETE CASCADE,
    inviter_name text NOT NULL,
    invitee_email text NOT NULL,
    personal_message text,
    role text DEFAULT 'contributor' CHECK (role IN ('contributor', 'co_guardian')),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz DEFAULT (now() + interval '30 days')
);

CREATE INDEX IF NOT EXISTS idx_contributor_inv_memorial ON contributor_invitations(memorial_id);
CREATE INDEX IF NOT EXISTS idx_contributor_inv_email ON contributor_invitations(invitee_email);


-- 9. STORAGE BUCKETS (run via Supabase Dashboard or supabase CLI)
-- These are included as comments since storage bucket creation requires the storage API.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('arweave-staging', 'arweave-staging', false) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('letters', 'letters', false) ON CONFLICT DO NOTHING;


-- 10. ROW LEVEL SECURITY POLICIES

-- Arweave transactions: owner read/write
ALTER TABLE arweave_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Owner can view own arweave transactions"
    ON arweave_transactions FOR SELECT
    USING (memorial_id IN (SELECT id FROM memorials WHERE user_id = auth.uid()));

-- Certificates: owner read
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Owner can view own certificates"
    ON certificates FOR SELECT
    USING (memorial_id IN (SELECT id FROM memorials WHERE user_id = auth.uid()));

-- Letters: owner read/write
ALTER TABLE letters_to_future ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Owner can manage own letters"
    ON letters_to_future FOR ALL
    USING (user_id = auth.uid());

-- Moderation reviews: owner read
ALTER TABLE moderation_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Owner can view own moderation reviews"
    ON moderation_reviews FOR SELECT
    USING (memorial_id IN (SELECT id FROM memorials WHERE user_id = auth.uid()));

-- Contributor invitations: owner + invitee
ALTER TABLE contributor_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Owner can manage contributor invitations"
    ON contributor_invitations FOR ALL
    USING (memorial_id IN (SELECT id FROM memorials WHERE user_id = auth.uid()));


-- ============================================================================
-- VERIFICATION QUERIES (run after migration to confirm success)
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'memorials' ORDER BY ordinal_position;
-- SELECT count(*) FROM memorials WHERE stories IS NOT NULL AND stories != '{}'::jsonb;
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('arweave_transactions', 'certificates', 'moderation_reviews', 'letters_to_future', 'contributor_invitations');
