-- ============================================================================
-- Legacy Vault: COMPLETE FRESH DATABASE SETUP
-- Run this in Supabase Dashboard → SQL Editor on an EMPTY project.
-- This creates all tables, functions, triggers, indexes, and RLS policies.
-- ============================================================================
-- Before running this script, create these STORAGE BUCKETS manually
-- in Supabase Dashboard → Storage:
--   1. videos          (Public: YES)
--   2. memorial-media   (Public: YES)
--   3. concierge-files  (Public: YES)
--   4. exports          (Public: NO)
--   5. authorization-pdfs (Public: NO)
--   6. arweave-staging  (Public: NO)
-- ============================================================================


-- ████████████████████████████████████████████████████████████████████████████
-- SECTION 1: EXTENSIONS & ENUM TYPES
-- ████████████████████████████████████████████████████████████████████████████

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Memorial state enum (luxury model)
DO $$ BEGIN
    CREATE TYPE memorial_state AS ENUM ('creating', 'private', 'live', 'preserved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- ████████████████████████████████████████████████████████████████████████████
-- SECTION 2: HELPER FUNCTIONS
-- ████████████████████████████████████████████████████████████████████████████

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create public.users row when auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = NEW.email;
  RETURN NEW;
END;
$$;

-- Get next version number for a memorial
CREATE OR REPLACE FUNCTION get_next_version_number(p_memorial_id UUID)
RETURNS INTEGER AS $$
    SELECT COALESCE(MAX(version_number), 0) + 1
    FROM memorial_versions
    WHERE memorial_id = p_memorial_id;
$$ LANGUAGE sql STABLE;

-- Prevent client-side payment spoofing
CREATE OR REPLACE FUNCTION check_paid_status_integrity()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.paid = false AND NEW.paid = true) THEN
    IF current_setting('role') != 'service_role' THEN
      RAISE EXCEPTION 'You cannot manually set your archive as paid.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Track user activity for dead man's switch
CREATE OR REPLACE FUNCTION update_user_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET last_activity_at = now() WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ████████████████████████████████████████████████████████████████████████████
-- SECTION 3: CORE TABLES
-- ████████████████████████████████████████████████████████████████████████████

-- ──────────────────────────────────────────
-- 3.1 USERS (linked to auth.users)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name TEXT,
    dead_mans_switch_enabled BOOLEAN DEFAULT false,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_active_at TIMESTAMP WITH TIME ZONE,
    verification_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ──────────────────────────────────────────
-- 3.2 MEMORIALS (main archive data)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- NEW: Collections-based data model (luxury refactor)
    state memorial_state DEFAULT 'creating',
    stories JSONB DEFAULT '{}'::jsonb,
    media JSONB DEFAULT '{}'::jsonb,
    timeline JSONB DEFAULT '{}'::jsonb,
    network JSONB DEFAULT '{}'::jsonb,
    letters JSONB DEFAULT '[]'::jsonb,

    -- LEGACY: Step-based data (kept for backward compatibility / migration)
    step1 JSONB DEFAULT '{}'::jsonb,
    step2 JSONB DEFAULT '{}'::jsonb,
    step3 JSONB DEFAULT '{}'::jsonb,
    step4 JSONB DEFAULT '{}'::jsonb,
    step5 JSONB DEFAULT '{}'::jsonb,
    step6 JSONB DEFAULT '{}'::jsonb,
    step7 JSONB DEFAULT '{}'::jsonb,
    step8 JSONB DEFAULT '{}'::jsonb,
    step9 JSONB DEFAULT '{}'::jsonb,
    completed_steps INTEGER[] DEFAULT '{}',

    -- Status and metadata
    status TEXT DEFAULT 'draft',
    mode TEXT DEFAULT 'draft',
    slug TEXT UNIQUE,
    full_name TEXT,
    birth_date DATE,
    death_date DATE,
    profile_photo_url TEXT,
    cover_photo_url TEXT,

    -- Payment
    paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_confirmed_at TIMESTAMP WITH TIME ZONE,
    plan_type TEXT DEFAULT 'personal',
    amount_paid INTEGER DEFAULT 0,
    stripe_payment_id TEXT,
    refund_eligible BOOLEAN DEFAULT true,
    upgraded_from TEXT,
    upgraded_at TIMESTAMP WITH TIME ZONE,

    -- Arweave preservation
    arweave_tx_id TEXT,
    arweave_status TEXT CHECK (arweave_status IN ('pending', 'confirming', 'confirmed', 'failed')),
    certificate_url TEXT,

    -- Soft delete
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Export tracking
    last_exported_at TIMESTAMP WITH TIME ZONE
);

-- ──────────────────────────────────────────
-- 3.3 WITNESS_INVITATIONS (contributor invitations - legacy table name)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS witness_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    inviter_name TEXT NOT NULL,
    invitee_email TEXT NOT NULL,
    role TEXT DEFAULT 'contributor',
    personal_message TEXT,
    status TEXT DEFAULT 'pending',
    accepted_by_user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- ──────────────────────────────────────────
-- 3.4 MEMORIAL_CONTRIBUTIONS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorial_contributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    witness_name TEXT,
    type TEXT NOT NULL,
    content JSONB NOT NULL,
    status TEXT DEFAULT 'pending_approval',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ──────────────────────────────────────────
-- 3.5 MEMORIAL_AUTHORIZATIONS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorial_authorizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    user_id UUID REFERENCES users(id),
    memorial_id UUID REFERENCES memorials(id),

    -- Creator info
    creator_full_name TEXT NOT NULL,
    creator_dob DATE,
    creator_address TEXT,
    creator_city_state_zip TEXT,
    creator_email TEXT NOT NULL,
    creator_phone TEXT,
    relationship_to_deceased TEXT NOT NULL,
    relationship_other TEXT,

    -- Deceased info
    deceased_full_name TEXT NOT NULL,
    deceased_dob DATE NOT NULL,
    deceased_dod DATE,
    deceased_death_place TEXT,
    deceased_last_residence TEXT,

    -- Estate info
    probate_opened BOOLEAN,
    probate_case_number TEXT,
    probate_jurisdiction TEXT,
    executor_name TEXT,
    executor_contact TEXT,

    -- Authority claims
    authority_claims JSONB,
    consent_obtained_from JSONB,
    no_conflicting_claims BOOLEAN DEFAULT false,

    -- Content representations
    accuracy_confirmed BOOLEAN DEFAULT false,
    copyright_confirmed BOOLEAN DEFAULT false,
    privacy_confirmed BOOLEAN DEFAULT false,
    indemnification_accepted BOOLEAN DEFAULT false,

    -- Simplified declaration checkboxes (luxury refactor)
    agree_legal_authority BOOLEAN DEFAULT false,
    agree_good_faith BOOLEAN DEFAULT false,
    agree_permanence BOOLEAN DEFAULT false,
    authorization_type TEXT DEFAULT 'individual',

    -- Signature
    signature_type TEXT DEFAULT 'typed',
    electronic_signature TEXT NOT NULL,
    signature_date TIMESTAMP WITH TIME ZONE NOT NULL,
    signature_ip_address TEXT,
    signature_user_agent TEXT,
    device_fingerprint TEXT,
    geolocation TEXT,

    -- Video evidence (legacy, may be NULL)
    video_storage_path TEXT,
    video_hash TEXT,

    -- Status
    status TEXT DEFAULT 'pending',
    reviewed_by TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,

    -- Storage
    pdf_storage_path TEXT,
    form_data_json JSONB
);

-- ──────────────────────────────────────────
-- 3.6 MEMORIAL_RELATIONS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorial_relations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    to_memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(from_memorial_id, to_memorial_id)
);

-- ──────────────────────────────────────────
-- 3.7 MEMORIAL_VERSIONS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorial_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by_name TEXT,
    change_summary TEXT NOT NULL,
    change_reason TEXT,
    change_type TEXT NOT NULL DEFAULT 'manual',
    steps_modified INTEGER[] DEFAULT '{}',
    snapshot_data JSONB NOT NULL,
    is_full_snapshot BOOLEAN NOT NULL DEFAULT false,
    is_restored_from UUID REFERENCES memorial_versions(id),
    CONSTRAINT unique_version_per_memorial UNIQUE (memorial_id, version_number)
);

-- ──────────────────────────────────────────
-- 3.8 USER_SUCCESSORS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_successors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    successor_name TEXT NOT NULL,
    successor_email TEXT NOT NULL,
    relationship TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    verification_token UUID DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, successor_email)
);

-- ──────────────────────────────────────────
-- 3.9 SUCCESSION_ACTIVATIONS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS succession_activations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    successor_id UUID REFERENCES user_successors(id),
    death_certificate_url TEXT NOT NULL,
    id_proof_url TEXT NOT NULL,
    request_note TEXT,
    status TEXT DEFAULT 'under_review',
    verification_period_ends TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ──────────────────────────────────────────
-- 3.10 MEMORIAL_REMINDERS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorial_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    memorial_name TEXT NOT NULL DEFAULT 'your archive',
    remind_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

-- ──────────────────────────────────────────
-- 3.11 CONCIERGE_PROJECTS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS concierge_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    initial_message TEXT,
    status TEXT NOT NULL DEFAULT 'requested',
    paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMP WITH TIME ZONE,
    zoom_link TEXT,
    content_preview JSONB DEFAULT '{}',
    memorial_data JSONB DEFAULT '{}',
    person_full_name TEXT,
    person_birth_date TEXT,
    person_death_date TEXT,
    relationship TEXT,
    materials_inventory JSONB DEFAULT '{}',
    preservation_priorities TEXT,
    sensitive_aspects TEXT,
    contact_preference TEXT DEFAULT 'email',
    total_amount INTEGER DEFAULT 6300,
    amount_paid_so_far INTEGER DEFAULT 0,
    payment_phase TEXT DEFAULT 'pending',
    upgraded_from TEXT,
    differential_amount INTEGER
);

-- ──────────────────────────────────────────
-- 3.12 CONCIERGE_FILES
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS concierge_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    project_id UUID REFERENCES concierge_projects(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    user_note TEXT
);

-- ──────────────────────────────────────────
-- 3.13 CONCIERGE_NOTES
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS concierge_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    project_id UUID REFERENCES concierge_projects(id) ON DELETE CASCADE NOT NULL,
    note_type TEXT NOT NULL DEFAULT 'text',
    content TEXT,
    audio_url TEXT,
    from_user BOOLEAN DEFAULT true
);

-- ──────────────────────────────────────────
-- 3.14 ARWEAVE_TRANSACTIONS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS arweave_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    tx_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'confirmed', 'failed')),
    data_size BIGINT,
    cost_winston TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    confirmed_at TIMESTAMPTZ
);

-- ──────────────────────────────────────────
-- 3.15 CERTIFICATES
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    arweave_tx_id TEXT NOT NULL,
    pdf_storage_path TEXT,
    generated_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────
-- 3.16 LETTERS_TO_FUTURE
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS letters_to_future (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    recipient_name TEXT,
    recipient_email TEXT NOT NULL,
    deliver_at TIMESTAMPTZ NOT NULL,
    content TEXT NOT NULL,
    sealed BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'delivered', 'failed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────
-- 3.17 MODERATION_REVIEWS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS moderation_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'photo', 'video', 'voice')),
    content_ref TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'flagged', 'rejected')),
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────
-- 3.18 CONTRIBUTOR_INVITATIONS (new naming)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contributor_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
    inviter_name TEXT NOT NULL,
    invitee_email TEXT NOT NULL,
    personal_message TEXT,
    role TEXT DEFAULT 'contributor' CHECK (role IN ('contributor', 'co_guardian')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days')
);


-- ████████████████████████████████████████████████████████████████████████████
-- SECTION 4: INDEXES
-- ████████████████████████████████████████████████████████████████████████████

-- Memorials
CREATE INDEX IF NOT EXISTS idx_memorials_user_id ON memorials(user_id);
CREATE INDEX IF NOT EXISTS idx_memorials_status ON memorials(status);
CREATE INDEX IF NOT EXISTS idx_memorials_mode ON memorials(mode);
CREATE INDEX IF NOT EXISTS idx_memorials_slug ON memorials(slug);
CREATE INDEX IF NOT EXISTS idx_memorials_created_at ON memorials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memorials_refund_eligible ON memorials(refund_eligible);
CREATE INDEX IF NOT EXISTS idx_memorials_plan_type ON memorials(plan_type);
CREATE INDEX IF NOT EXISTS idx_memorials_user_mode ON memorials(user_id, mode);

-- Witness invitations
CREATE INDEX IF NOT EXISTS idx_witness_inv_memorial ON witness_invitations(memorial_id);
CREATE INDEX IF NOT EXISTS idx_witness_inv_email ON witness_invitations(invitee_email);

-- Memorial authorizations
CREATE INDEX IF NOT EXISTS idx_auth_user_id ON memorial_authorizations(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_memorial_id ON memorial_authorizations(memorial_id);
CREATE INDEX IF NOT EXISTS idx_auth_status ON memorial_authorizations(status);
CREATE INDEX IF NOT EXISTS idx_auth_created_at ON memorial_authorizations(created_at DESC);

-- Memorial versions
CREATE INDEX IF NOT EXISTS idx_versions_memorial_date ON memorial_versions(memorial_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_versions_created_by ON memorial_versions(created_by);
CREATE INDEX IF NOT EXISTS idx_versions_type ON memorial_versions(memorial_id, change_type);

-- Reminders
CREATE INDEX IF NOT EXISTS idx_reminders_status_remind_at ON memorial_reminders(status, remind_at);

-- Concierge
CREATE INDEX IF NOT EXISTS idx_concierge_projects_user_id ON concierge_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_concierge_projects_status ON concierge_projects(status);
CREATE INDEX IF NOT EXISTS idx_concierge_projects_email ON concierge_projects(email);
CREATE INDEX IF NOT EXISTS idx_concierge_projects_created_at ON concierge_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_concierge_files_project_id ON concierge_files(project_id);
CREATE INDEX IF NOT EXISTS idx_concierge_files_created_at ON concierge_files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_concierge_notes_project_id ON concierge_notes(project_id);
CREATE INDEX IF NOT EXISTS idx_concierge_notes_created_at ON concierge_notes(created_at DESC);

-- Arweave
CREATE INDEX IF NOT EXISTS idx_arweave_tx_memorial ON arweave_transactions(memorial_id);
CREATE INDEX IF NOT EXISTS idx_arweave_tx_status ON arweave_transactions(status);

-- Certificates
CREATE INDEX IF NOT EXISTS idx_certificates_memorial ON certificates(memorial_id);

-- Letters
CREATE INDEX IF NOT EXISTS idx_letters_memorial ON letters_to_future(memorial_id);
CREATE INDEX IF NOT EXISTS idx_letters_deliver ON letters_to_future(deliver_at) WHERE status = 'scheduled';

-- Moderation
CREATE INDEX IF NOT EXISTS idx_moderation_memorial ON moderation_reviews(memorial_id);

-- Contributor invitations
CREATE INDEX IF NOT EXISTS idx_contributor_inv_memorial ON contributor_invitations(memorial_id);
CREATE INDEX IF NOT EXISTS idx_contributor_inv_email ON contributor_invitations(invitee_email);


-- ████████████████████████████████████████████████████████████████████████████
-- SECTION 5: TRIGGERS
-- ████████████████████████████████████████████████████████████████████████████

-- Auto-update updated_at on memorials
CREATE TRIGGER update_memorials_updated_at
    BEFORE UPDATE ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on memorial_authorizations
CREATE TRIGGER update_memorial_authorizations_updated_at
    BEFORE UPDATE ON memorial_authorizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on concierge_projects
CREATE TRIGGER update_concierge_projects_updated_at
    BEFORE UPDATE ON concierge_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-create public.users row on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Secure paid column from client-side modification
CREATE TRIGGER secure_paid_column
    BEFORE UPDATE ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION check_paid_status_integrity();

-- Track user activity on memorial updates (for dead man's switch)
CREATE TRIGGER trigger_update_activity
    AFTER UPDATE ON memorials
    FOR EACH ROW EXECUTE FUNCTION update_user_last_activity();

-- Auto-disable refund when memorial is published
CREATE OR REPLACE FUNCTION auto_disable_refund_on_publish()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
        NEW.refund_eligible = FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_disable_refund_on_publish
    BEFORE UPDATE ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION auto_disable_refund_on_publish();


-- ████████████████████████████████████████████████████████████████████████████
-- SECTION 6: ROW LEVEL SECURITY (RLS)
-- ████████████████████████████████████████████████████████████████████████████

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE witness_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_successors ENABLE ROW LEVEL SECURITY;
ALTER TABLE succession_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE concierge_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE concierge_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE concierge_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE arweave_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters_to_future ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributor_invitations ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────
-- 6.1 RLS HELPER FUNCTIONS (prevent infinite recursion)
-- ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_witness_for_memorial(p_memorial_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.witness_invitations
    WHERE memorial_id = p_memorial_id
      AND invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND status = 'accepted'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_memorial_owner(p_memorial_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memorials WHERE id = p_memorial_id AND user_id = auth.uid()
  );
$$;

-- ──────────────────────────────────────────
-- 6.2 USERS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Users can view own profile"
    ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to read users table (needed for various lookups)
CREATE POLICY "Authenticated users can read users"
    ON users FOR SELECT TO authenticated USING (true);

-- ──────────────────────────────────────────
-- 6.3 MEMORIALS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Owners can manage their own memorials"
    ON memorials FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Witnesses can view invited memorials"
    ON memorials FOR SELECT
    USING (public.is_witness_for_memorial(id));

CREATE POLICY "Published memorials are public"
    ON memorials FOR SELECT
    USING (status = 'published');

-- ──────────────────────────────────────────
-- 6.4 WITNESS_INVITATIONS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Owners can view invitations for own memorials"
    ON witness_invitations FOR SELECT
    USING (public.is_memorial_owner(memorial_id));

CREATE POLICY "Anyone can view invitation by id"
    ON witness_invitations FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update invitations"
    ON witness_invitations FOR UPDATE TO authenticated
    USING (true) WITH CHECK (true);

-- ──────────────────────────────────────────
-- 6.5 MEMORIAL_CONTRIBUTIONS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Anyone logged in can submit a memory"
    ON memorial_contributions FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Owners can manage contributions"
    ON memorial_contributions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM memorials
            WHERE memorials.id = memorial_contributions.memorial_id
            AND memorials.user_id = auth.uid()
        )
    );

CREATE POLICY "Contributors can view own contributions"
    ON memorial_contributions FOR SELECT
    USING (auth.uid() = user_id);

-- ──────────────────────────────────────────
-- 6.6 MEMORIAL_AUTHORIZATIONS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Users can view own authorizations"
    ON memorial_authorizations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create authorizations"
    ON memorial_authorizations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ──────────────────────────────────────────
-- 6.7 MEMORIAL_RELATIONS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Owners can manage memorial relations"
    ON memorial_relations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM memorials m
            WHERE (m.id = memorial_relations.from_memorial_id
                OR m.id = memorial_relations.to_memorial_id)
            AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "Public read relations"
    ON memorial_relations FOR SELECT USING (true);

-- ──────────────────────────────────────────
-- 6.8 MEMORIAL_VERSIONS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Owners can view memorial versions"
    ON memorial_versions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM memorials m
            WHERE m.id = memorial_versions.memorial_id
            AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can create memorial versions"
    ON memorial_versions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memorials m
            WHERE m.id = memorial_versions.memorial_id
            AND m.user_id = auth.uid()
        )
    );

GRANT ALL ON memorial_versions TO service_role;

-- ──────────────────────────────────────────
-- 6.9 USER_SUCCESSORS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Users can manage own successors"
    ON user_successors FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read successors by token"
    ON user_successors FOR SELECT USING (true);

-- ──────────────────────────────────────────
-- 6.10 SUCCESSION_ACTIVATIONS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Stewards view own requests"
    ON succession_activations FOR SELECT
    USING (
        successor_id IN (
            SELECT id FROM user_successors
            WHERE successor_email = auth.jwt() ->> 'email'
        )
    );

-- ──────────────────────────────────────────
-- 6.11 MEMORIAL_REMINDERS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Users can manage their own reminders"
    ON memorial_reminders FOR ALL
    USING (true) WITH CHECK (true);

-- ──────────────────────────────────────────
-- 6.12 CONCIERGE POLICIES (open access for admin workflow)
-- ──────────────────────────────────────────

CREATE POLICY "Allow all access to concierge_projects"
    ON concierge_projects FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to concierge_files"
    ON concierge_files FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to concierge_notes"
    ON concierge_notes FOR ALL USING (true) WITH CHECK (true);

-- ──────────────────────────────────────────
-- 6.13 ARWEAVE_TRANSACTIONS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Owner can view own arweave transactions"
    ON arweave_transactions FOR SELECT
    USING (memorial_id IN (SELECT id FROM memorials WHERE user_id = auth.uid()));

-- ──────────────────────────────────────────
-- 6.14 CERTIFICATES POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Owner can view own certificates"
    ON certificates FOR SELECT
    USING (memorial_id IN (SELECT id FROM memorials WHERE user_id = auth.uid()));

-- ──────────────────────────────────────────
-- 6.15 LETTERS_TO_FUTURE POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Owner can manage own letters"
    ON letters_to_future FOR ALL USING (user_id = auth.uid());

-- ──────────────────────────────────────────
-- 6.16 MODERATION_REVIEWS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Owner can view own moderation reviews"
    ON moderation_reviews FOR SELECT
    USING (memorial_id IN (SELECT id FROM memorials WHERE user_id = auth.uid()));

-- ──────────────────────────────────────────
-- 6.17 CONTRIBUTOR_INVITATIONS POLICIES
-- ──────────────────────────────────────────

CREATE POLICY "Owner can manage contributor invitations"
    ON contributor_invitations FOR ALL
    USING (memorial_id IN (SELECT id FROM memorials WHERE user_id = auth.uid()));


-- ████████████████████████████████████████████████████████████████████████████
-- SECTION 7: STORAGE BUCKET POLICIES
-- ████████████████████████████████████████████████████████████████████████████

-- Videos bucket
CREATE POLICY "Users can upload videos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Anyone can view videos"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'videos');

-- Memorial-media bucket
CREATE POLICY "Users can upload media"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'memorial-media');

CREATE POLICY "Anyone can view media"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'memorial-media');

-- Concierge-files bucket
CREATE POLICY "Public Upload to Concierge Files"
    ON storage.objects FOR INSERT TO public
    WITH CHECK (bucket_id = 'concierge-files');

CREATE POLICY "Public Access to Concierge Files"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'concierge-files');

CREATE POLICY "Public Delete from Concierge Files"
    ON storage.objects FOR DELETE TO public
    USING (bucket_id = 'concierge-files');

-- Authorization-pdfs bucket
CREATE POLICY "Users can upload authorization PDFs"
    ON storage.objects FOR INSERT TO public
    WITH CHECK (bucket_id = 'authorization-pdfs');

CREATE POLICY "Users can read authorization PDFs"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'authorization-pdfs');

-- Exports bucket (private — signed URLs only)
CREATE POLICY "Authenticated users can upload exports"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'exports');

CREATE POLICY "Authenticated users can read exports"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'exports');


-- ████████████████████████████████████████████████████████████████████████████
-- SECTION 8: BACKFILL EXISTING AUTH USERS
-- ████████████████████████████████████████████████████████████████████████████

-- Create public.users rows for any auth users that already exist
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- ████████████████████████████████████████████████████████████████████████████
-- DONE! Verify with these queries:
-- ████████████████████████████████████████████████████████████████████████████

-- Check all tables exist:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check memorial columns:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'memorials' ORDER BY ordinal_position;

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check storage buckets:
-- SELECT id, name, public FROM storage.buckets ORDER BY name;
