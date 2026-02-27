-- ============================================================
-- Migration 50: Supabase Auth Integration + Row Level Security
-- ============================================================
-- Run this in Supabase Dashboard -> SQL Editor
-- This sets up:
--   1. Trigger to auto-create public.users on auth signup
--   2. RLS policies for memorials, witness_invitations, etc.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- STEP 1: Link auth.users → public.users via trigger
-- When a user signs up through Supabase Auth, automatically
-- create a row in public.users with the same id and email.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
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

-- Drop the trigger if it already exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ────────────────────────────────────────────────────────────
-- STEP 2: Enable RLS on core tables
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.witness_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_successors ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- STEP 3: RLS Policies for public.users
-- ────────────────────────────────────────────────────────────

-- Users can read their own row
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own row
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);


-- ────────────────────────────────────────────────────────────
-- STEP 4: RLS Policies for public.memorials
-- ────────────────────────────────────────────────────────────

-- Owners can view their own memorials
CREATE POLICY "Owners can view own memorials"
  ON public.memorials FOR SELECT
  USING (auth.uid() = user_id);

-- Witnesses can view memorials they were invited to (accepted)
CREATE POLICY "Witnesses can view invited memorials"
  ON public.memorials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.witness_invitations wi
      WHERE wi.memorial_id = memorials.id
        AND wi.invitee_email = (
          SELECT email FROM auth.users WHERE id = auth.uid()
        )
        AND wi.status = 'accepted'
    )
  );

-- Published memorials are publicly viewable (for person/[id] page)
CREATE POLICY "Published memorials are public"
  ON public.memorials FOR SELECT
  USING (status = 'published' AND deleted IS NOT TRUE);

-- Owners can insert memorials (user_id must match auth.uid)
CREATE POLICY "Authenticated users can create memorials"
  ON public.memorials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owners can update their own memorials
CREATE POLICY "Owners can update own memorials"
  ON public.memorials FOR UPDATE
  USING (auth.uid() = user_id);

-- Owners can delete their own memorials
CREATE POLICY "Owners can delete own memorials"
  ON public.memorials FOR DELETE
  USING (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- STEP 5: RLS Policies for public.witness_invitations
-- ────────────────────────────────────────────────────────────

-- Memorial owners can manage invitations for their memorials
CREATE POLICY "Owners can view invitations for own memorials"
  ON public.witness_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials m
      WHERE m.id = witness_invitations.memorial_id
        AND m.user_id = auth.uid()
    )
  );

-- Invitees can view their own invitations
CREATE POLICY "Invitees can view own invitations"
  ON public.witness_invitations FOR SELECT
  USING (
    invitee_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Allow anyone to view invitations by ID (for the accept page, before login)
-- Note: The accept page validates the token/id directly
CREATE POLICY "Anyone can view invitation by id for acceptance"
  ON public.witness_invitations FOR SELECT
  USING (true);

-- Invitees can update their invitation (to accept/decline)
CREATE POLICY "Invitees can update own invitations"
  ON public.witness_invitations FOR UPDATE
  USING (
    invitee_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 6: RLS Policies for public.memorial_authorizations
-- ────────────────────────────────────────────────────────────

-- Owners can view their own authorizations
CREATE POLICY "Users can view own authorizations"
  ON public.memorial_authorizations FOR SELECT
  USING (auth.uid() = user_id);

-- Owners can create authorizations
CREATE POLICY "Users can create authorizations"
  ON public.memorial_authorizations FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- STEP 7: RLS Policies for public.memorial_relations
-- ────────────────────────────────────────────────────────────

-- Owners can manage relations for their memorials
CREATE POLICY "Owners can view own memorial relations"
  ON public.memorial_relations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials m
      WHERE (m.id = memorial_relations.from_memorial_id
          OR m.id = memorial_relations.to_memorial_id)
        AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can create memorial relations"
  ON public.memorial_relations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memorials m
      WHERE m.id = memorial_relations.from_memorial_id
        AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete memorial relations"
  ON public.memorial_relations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials m
      WHERE (m.id = memorial_relations.from_memorial_id
          OR m.id = memorial_relations.to_memorial_id)
        AND m.user_id = auth.uid()
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 8: RLS Policies for public.memorial_versions
-- ────────────────────────────────────────────────────────────

-- Owners can view version history for their memorials
CREATE POLICY "Owners can view memorial versions"
  ON public.memorial_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials m
      WHERE m.id = memorial_versions.memorial_id
        AND m.user_id = auth.uid()
    )
  );

-- System (via service role) creates versions, but owners can too
CREATE POLICY "Owners can create memorial versions"
  ON public.memorial_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memorials m
      WHERE m.id = memorial_versions.memorial_id
        AND m.user_id = auth.uid()
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 9: RLS Policies for public.user_successors
-- ────────────────────────────────────────────────────────────

CREATE POLICY "Users can view own successors"
  ON public.user_successors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create successors"
  ON public.user_successors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own successors"
  ON public.user_successors FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own successors"
  ON public.user_successors FOR DELETE
  USING (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- DONE! RLS is now active.
-- API routes using supabase service role key bypass RLS.
-- Client-side queries and middleware queries respect RLS.
-- ────────────────────────────────────────────────────────────
