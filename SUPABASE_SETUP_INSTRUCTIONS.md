# Legacy Vault — Supabase Schema Setup Instructions

This document contains all SQL needed to set up the new tables and modifications
for the luxury digital legacy platform transformation.

## Prerequisites

- A Supabase project with auth enabled
- Service role key configured in `.env.local`
- Existing tables: `memorials`, `users`, `memorial_versions`, `memorial_authorizations`,
  `witness_invitations`, `memorial_contributions`, `memorial_relations`, `user_successors`,
  `succession_activations`

---

## Step 1: New Tables

### 1.1 Arweave Transactions

Tracks all Arweave preservation uploads and their confirmation status.

```sql
CREATE TABLE IF NOT EXISTS arweave_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    tx_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'submitted', 'confirming', 'confirmed', 'failed')),
    gateway_urls TEXT[] DEFAULT '{}',
    file_count INTEGER DEFAULT 0,
    total_bytes BIGINT DEFAULT 0,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_arweave_tx_memorial ON arweave_transactions(memorial_id);
CREATE INDEX idx_arweave_tx_id ON arweave_transactions(tx_id);
CREATE INDEX idx_arweave_tx_status ON arweave_transactions(status);
```

### 1.2 Anchor Devices

Tracks local device sync for Family tier users.

```sql
CREATE TABLE IF NOT EXISTS anchor_devices (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL DEFAULT 'Unknown Device',
    browser TEXT DEFAULT 'Unknown',
    os TEXT DEFAULT 'Unknown',
    sync_progress_bytes BIGINT DEFAULT 0,
    total_bytes BIGINT DEFAULT 0,
    last_sync_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'syncing'
        CHECK (status IN ('syncing', 'synced', 'error', 'stale')),
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anchor_user ON anchor_devices(user_id);
CREATE INDEX idx_anchor_memorial ON anchor_devices(memorial_id);
CREATE INDEX idx_anchor_status ON anchor_devices(status);
```

### 1.3 Recovery Contacts

Stores Shamir's Secret Sharing recovery contacts for social recovery.

```sql
CREATE TABLE IF NOT EXISTS recovery_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    relationship TEXT DEFAULT '',
    key_shard_encrypted TEXT,
    shard_index INTEGER,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'delivered')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recovery_user ON recovery_contacts(user_id);
```

### 1.4 Encryption Keys

Stores encrypted key metadata for memorial encryption.

```sql
CREATE TABLE IF NOT EXISTS encryption_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    encrypted_key TEXT NOT NULL,
    salt TEXT NOT NULL,
    iv TEXT NOT NULL,
    method TEXT NOT NULL DEFAULT 'AES-256-GCM',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_encryption_memorial ON encryption_keys(memorial_id);
```

### 1.5 Content Reviews

Tracks pre-preservation content screening status.

```sql
CREATE TABLE IF NOT EXISTS content_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_submitted'
        CHECK (status IN ('not_submitted', 'pending_review', 'approved', 'needs_changes')),
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT,
    flagged_items JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_content_review_memorial ON content_reviews(memorial_id);
```

### 1.6 Preservation Certificates

Stores generated certificate metadata.

```sql
CREATE TABLE IF NOT EXISTS preservation_certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    certificate_data JSONB NOT NULL DEFAULT '{}',
    pdf_url TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_cert_memorial ON preservation_certificates(memorial_id);
```

---

## Step 2: Table Modifications

### 2.1 Add columns to `memorials` table

```sql
-- Preservation state (new state machine)
ALTER TABLE memorials
    ADD COLUMN IF NOT EXISTS preservation_state TEXT DEFAULT 'draft'
        CHECK (preservation_state IN ('draft', 'building', 'review', 'preserving', 'preserved', 'archived'));

-- Arweave integration
ALTER TABLE memorials
    ADD COLUMN IF NOT EXISTS arweave_tx_id TEXT,
    ADD COLUMN IF NOT EXISTS preservation_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS content_size_bytes BIGINT DEFAULT 0;

-- Content review
ALTER TABLE memorials
    ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'not_submitted'
        CHECK (review_status IN ('not_submitted', 'pending_review', 'approved', 'needs_changes'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memorials_preservation_state ON memorials(preservation_state);
CREATE INDEX IF NOT EXISTS idx_memorials_arweave_tx ON memorials(arweave_tx_id);
```

### 2.2 Add access_level to `user_successors`

```sql
ALTER TABLE user_successors
    ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'editorial'
        CHECK (access_level IN ('read_only', 'editorial', 'full_ownership'));
```

---

## Step 3: Row Level Security (RLS) Policies

### 3.1 Arweave Transactions

```sql
ALTER TABLE arweave_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view transactions for their own memorials
CREATE POLICY "Users can view own arweave transactions"
    ON arweave_transactions
    FOR SELECT
    USING (
        memorial_id IN (
            SELECT id FROM memorials WHERE user_id = auth.uid()
        )
    );

-- Only service role can insert/update (API routes use service role)
CREATE POLICY "Service role can manage arweave transactions"
    ON arweave_transactions
    FOR ALL
    USING (auth.role() = 'service_role');
```

### 3.2 Anchor Devices

```sql
ALTER TABLE anchor_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own devices"
    ON anchor_devices
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage own devices"
    ON anchor_devices
    FOR ALL
    USING (user_id = auth.uid());
```

### 3.3 Recovery Contacts

```sql
ALTER TABLE recovery_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recovery contacts"
    ON recovery_contacts
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage own recovery contacts"
    ON recovery_contacts
    FOR ALL
    USING (user_id = auth.uid());
```

### 3.4 Encryption Keys

```sql
ALTER TABLE encryption_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own encryption keys"
    ON encryption_keys
    FOR SELECT
    USING (
        memorial_id IN (
            SELECT id FROM memorials WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role manages encryption keys"
    ON encryption_keys
    FOR ALL
    USING (auth.role() = 'service_role');
```

### 3.5 Content Reviews

```sql
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own content reviews"
    ON content_reviews
    FOR SELECT
    USING (
        memorial_id IN (
            SELECT id FROM memorials WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role manages content reviews"
    ON content_reviews
    FOR ALL
    USING (auth.role() = 'service_role');
```

### 3.6 Preservation Certificates

```sql
ALTER TABLE preservation_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
    ON preservation_certificates
    FOR SELECT
    USING (
        memorial_id IN (
            SELECT id FROM memorials WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role manages certificates"
    ON preservation_certificates
    FOR ALL
    USING (auth.role() = 'service_role');
```

---

## Step 4: Functions & Triggers

### 4.1 Auto-update `updated_at` timestamp

```sql
-- Generic trigger function (if not already created)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to new tables
CREATE TRIGGER tr_arweave_transactions_updated_at
    BEFORE UPDATE ON arweave_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_anchor_devices_updated_at
    BEFORE UPDATE ON anchor_devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_recovery_contacts_updated_at
    BEFORE UPDATE ON recovery_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_content_reviews_updated_at
    BEFORE UPDATE ON content_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 4.2 Preservation state transition validation

```sql
CREATE OR REPLACE FUNCTION validate_preservation_state_transition()
RETURNS TRIGGER AS $$
DECLARE
    valid_transitions JSONB := '{
        "draft": ["building"],
        "building": ["review", "draft"],
        "review": ["preserving", "building"],
        "preserving": ["preserved", "review"],
        "preserved": ["archived"],
        "archived": []
    }'::JSONB;
    allowed_next JSONB;
BEGIN
    -- Skip if preservation_state didn't change
    IF OLD.preservation_state = NEW.preservation_state THEN
        RETURN NEW;
    END IF;

    -- Skip if OLD state is null (initial insert)
    IF OLD.preservation_state IS NULL THEN
        RETURN NEW;
    END IF;

    allowed_next := valid_transitions->OLD.preservation_state;

    IF allowed_next IS NULL OR NOT (allowed_next ? NEW.preservation_state) THEN
        RAISE EXCEPTION 'Invalid state transition: % -> %',
            OLD.preservation_state, NEW.preservation_state;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_validate_preservation_state
    BEFORE UPDATE ON memorials
    FOR EACH ROW
    WHEN (OLD.preservation_state IS DISTINCT FROM NEW.preservation_state)
    EXECUTE FUNCTION validate_preservation_state_transition();
```

---

## Step 5: Storage Buckets

### 5.1 Certificates bucket

```sql
-- Run in Supabase Dashboard > Storage > New bucket
-- Name: certificates
-- Public: false
-- File size limit: 10MB
-- Allowed MIME types: application/pdf, image/png
```

Or via SQL:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'certificates',
    'certificates',
    false,
    10485760,
    ARRAY['application/pdf', 'image/png']
)
ON CONFLICT (id) DO NOTHING;
```

Storage policy:

```sql
CREATE POLICY "Users can view own certificates"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'certificates'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
```

---

## Step 6: Verification

Run these queries to verify the setup:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'arweave_transactions',
    'anchor_devices',
    'recovery_contacts',
    'encryption_keys',
    'content_reviews',
    'preservation_certificates'
);

-- Check new columns on memorials
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'memorials'
AND column_name IN ('preservation_state', 'arweave_tx_id', 'preservation_date', 'content_size_bytes', 'review_status');

-- Check new column on user_successors
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_successors'
AND column_name = 'access_level';

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'arweave_transactions',
    'anchor_devices',
    'recovery_contacts',
    'encryption_keys',
    'content_reviews',
    'preservation_certificates'
);
```

---

## Notes

- All new tables use `gen_random_uuid()` for UUIDs (built-in PostgreSQL 13+)
- The `arweave_transactions` table is designed for the placeholder service — when
  real Arweave integration is added, the same schema will work
- The `anchor_devices` table uses a text `id` (not UUID) because device IDs are
  generated client-side with a timestamp-based format
- RLS policies use `auth.uid()` for user identification and `auth.role() = 'service_role'`
  for API-level operations
- The preservation state machine is enforced at the database level via trigger
- All `updated_at` columns are automatically maintained by triggers
