I now have a complete picture of the codebase. Let me construct the comprehensive architectural document.

---

# ULUMAE — Complete System Architecture & Implementation Blueprint

---

## A. Core System Architecture & Security Strategy

### 1. Live Role Change Handling & UI Synchronization

**The Core Problem:** The current `useArchiveRole` hook fetches role data once on mount via a plain `fetch`. If an Owner downgrades a Co-Guardian to a Reader mid-session, the degraded user continues acting with stale permissions in the browser until they refresh.

**Definitive Architecture Decision: Supabase Realtime + Optimistic Server-Side Invalidation**

Do not use WebSockets from scratch. Supabase Realtime is already in your stack. The architecture is:

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Database (Source of Truth)                        │
│  user_memorial_roles → Realtime Publication enabled         │
│  (filter: user_id = auth.uid())                             │
└─────────────────────────────────────────────────────────────┘
              ↓ Postgres NOTIFY via Realtime
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: Server                                             │
│  /api/archive/[id]/role-data — always re-checks DB          │
│  /api/archive/[id]/update-role — triggers DB change          │
│  Middleware — validates session cookie server-side           │
└─────────────────────────────────────────────────────────────┘
              ↓ Realtime channel subscription
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Client                                             │
│  useRoleWatcher hook — subscribes to user's role row        │
│  Detects UPDATE events → shows notification → re-fetches    │
│  If role deleted (revoked) → redirects to /access-revoked   │
└─────────────────────────────────────────────────────────────┘
```

**Concrete Implementation:**

Replace the current `useArchiveRole` hook with a `useRoleSession` hook that combines data fetching with a Realtime subscription:

```typescript
// hooks/useRoleSession.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useRoleSession(memorialId: string) {
  const supabase = createClient();
  const router = useRouter();
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoleData = useCallback(async () => {
    const res = await fetch(`/api/archive/${memorialId}/role-data`);
    if (res.status === 403) {
      // Access was revoked — do not silently fail
      router.replace(`/access-revoked?memorial=${memorialId}`);
      return;
    }
    const data = await res.json();
    setRoleData(data);
    setLoading(false);
  }, [memorialId]);

  useEffect(() => {
    fetchRoleData();

    // Subscribe to role changes for THIS user on THIS memorial
    const { data: { user } } = supabase.auth.getUser().then(({ data }) => {
      const channel = supabase
        .channel(`role-watch-${memorialId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_memorial_roles',
            filter: `memorial_id=eq.${memorialId}`,
          },
          (payload) => {
            if (payload.eventType === 'DELETE') {
              toast.error('Your access to this archive has been revoked.');
              router.replace('/dashboard');
              return;
            }
            if (payload.eventType === 'UPDATE') {
              const oldRole = payload.old?.role;
              const newRole = payload.new?.role;
              if (oldRole !== newRole) {
                toast(`Your role has been updated to: ${newRole}`, { icon: '🔄' });
                fetchRoleData(); // Re-fetch fresh server-verified data
              }
            }
          }
        )
        .subscribe();
      return { data: { channel } };
    });

    return () => {
      supabase.removeChannel(/* channel from above */);
    };
  }, [memorialId, fetchRoleData]);

  return { roleData, loading, refetch: fetchRoleData };
}
```

**UX Behavior on Downgrade:**

|Scenario|What the user sees|What happens technically|
|---|---|---|
|Downgraded while on a page they can still access|Toast: "Your role has been updated to Witness"|UI re-renders with reduced action set|
|Downgraded while on a restricted page (e.g., steward queue)|Toast: "You no longer have permission to view this page"|`router.replace('/archive/[id]')`|
|Role fully revoked (row deleted)|Toast: "Access has been removed"|Redirect to `/access-revoked`|
|New tab opened after revocation|Middleware check fails → server redirect|403 from API → middleware redirects|

**Critical requirement:** Realtime must be enabled for `user_memorial_roles` in your Supabase dashboard (Replication → Tables). You already did this for `memorial_contributions` (Section 22 of SQL). Add `user_memorial_roles` to the same publication.

---

### 2. Permissions & Security Architecture

**The Three-Layer Enforcement Model:**

```
REQUEST
  │
  ▼
┌──────────────────────────────────────┐
│  LAYER 1: Next.js Middleware          │  ← Catches unauthenticated requests
│  - Validates session cookie           │    before any route handler executes
│  - Route protection by prefix         │  ← CURRENT STATE: Only updates session
│  - Redirect to /login if no session   │    THIS IS INSUFFICIENT
└──────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────┐
│  LAYER 2: API Route Server Check      │  ← All /api/* routes verify:
│  - createAuthenticatedClient()        │    1. Valid session
│  - Checks user_memorial_roles         │    2. Correct role for action
│  - Uses supabaseAdmin (service_role)  │    3. Plan type compatibility
│  - Returns 401/403 with error codes   │  ← CURRENT STATE: Mostly done, gaps exist
└──────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────┐
│  LAYER 3: PostgreSQL RLS              │  ← Last line of defense
│  - SECURITY DEFINER helper functions  │    Even if API layer is bypassed,
│  - Row-level access filtering         │    the DB rejects unauthorized reads
│  - Cannot be bypassed from client     │  ← CURRENT STATE: Well-structured, needs gaps filled
└──────────────────────────────────────┘
```

**Middleware Hardening (Current gap: middleware.ts does nothing but refresh session):**

```typescript
// middleware.ts — PROPOSED
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/archive',
  '/create',
  '/admin',
];

// Routes that require specific plan types (checked via cookie/header)
// Full role/plan checks happen in API routes — middleware only gates auth
const PLAN_GATED = {
  '/dashboard/family': 'family',
  '/dashboard/personal': 'personal',
};

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED_PREFIXES.some(p => path.startsWith(p));
  if (!isProtected) return response;

  // Check session exists (cookie-based, fast)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handlers */ } }
  );
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('next', path);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
```

**Permission Matrix enforced at API level:**

|Action|Who can do it|How it is enforced|
|---|---|---|
|View memorial data|Owner, Co-Guardian, Witness, Reader|RLS policy + API check|
|Edit memorial content|Owner, Co-Guardian|API: `update-role/route.ts` checks `memorial.user_id === user.id OR co_guardian role`|
|Approve/reject contributions|Owner, Co-Guardian|API: `role-data` checks `userRole === 'co_guardian' OR isOwner`|
|Submit contributions|Witness (authenticated or anonymous)|RLS: `Anyone can submit contributions` + server validates invitation acceptance|
|View contributions (pending)|Owner, Co-Guardian|RLS: `get_co_guardian_memorial_ids + get_owned_memorial_ids`|
|Change member roles|Owner only|API: `memorial.user_id === user.id` hard check|
|Send invitations|Owner only|New `/api/invite/send` route: validates ownership|
|Delete archive|Owner only|API check + RLS|
|Create family relations|Owner only|DB trigger: `enforce_family_mode_relations`|
|Request access to new family archive|Witness|New `access-request` table + Owner approval flow|

**Critical RLS Gap to Fix:** The current `user_memorial_roles` table has no UPDATE policy. If an Owner changes a role via the API (which uses `supabaseAdmin`), that is fine — but there is no protection against a client-side user directly calling `supabase.from('user_memorial_roles').update()`. Add:

```sql
-- Add to supabase_fresh_setup.sql
CREATE POLICY "Only service_role can update roles"
  ON user_memorial_roles FOR UPDATE
  USING (auth.role() = 'service_role');
```

This ensures all role changes must go through your API routes (which use the service role key), not through the client SDK.

---

### 3. Content Ownership & Approval Flows

**Ownership Model:**

```
memorial_contributions.user_id   →  The authenticated user who submitted it
memorial_contributions.witness_name →  Display name (can differ from auth identity)
memorial_contributions.is_anonymous →  True for OTP-verified non-account contributors
```

**Ownership Rules:**

- **Owner and Co-Guardians** own the _decision_ on contributions (approve/reject)
- **Witnesses** own the _authorship_ of their contributions — they can view their own submissions and retract them before approval
- **Once approved**, content becomes part of the permanent memorial record — the Witness can no longer edit or delete it (only the Owner can)
- **Deleted contributions** should be soft-deleted (`status = 'archived'`) not hard-deleted, for audit trail

**Approval Flow State Machine:**

```
Witness submits
      │
      ▼
[pending_approval] ──► Owner/Co-Guardian sees it in steward queue
      │
      ├── Owner approves ──► [approved] → Appears in memorial view
      │
      ├── Owner rejects ──► [rejected] + admin_notes set → Witness notified (email/realtime)
      │
      └── Owner requests changes ──► [needs_changes] → Witness notified, can revise
                                           │
                                           └── Witness revises → [pending_approval] again
```

**Missing piece in current schema:** Add a `reverted_at` timestamp and `revision_count` to `memorial_contributions` to track how many times content has gone through review cycles. This prevents infinite revision loops.

```sql
ALTER TABLE memorial_contributions
  ADD COLUMN IF NOT EXISTS revision_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS retracted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notified_at TIMESTAMPTZ;
```

---

### 4. Comprehensive Invitation State Machine

**Complete State Diagram:**

```
                    Owner sends invite
                          │
                          ▼
                      [pending]
                     /    |    \
                    /     |     \
          Invitee   │     │      │ 30 days pass
          accepts   │     │      │ without action
                    │     │      ▼
                    │     │  [expired]
                    │     │      │
                    │     │      └── Owner can re-send → new invite record
                    │     │
                    │   Invitee declines
                    │     │
                    │     ▼
                    │  [declined]
                    │     │
                    │     └── Owner can re-send → new invite record
                    │
                    ▼
               [accepted]
                    │
                    └── user_memorial_roles row created
                         (invitation_id stored for audit)
```

**How states drive UX:**

|State|Invitee experience|Owner experience|
|---|---|---|
|`pending`|Sees invitation preview, can accept/decline|Shows "Pending" badge in RoleManagementTable|
|`accepted`|Redirected to archive on link visit|Shows "Active" with role badge|
|`declined`|Shows "You previously declined" terminal screen|Shows "Declined" badge, can re-invite|
|`expired`|Shows "Expired" terminal screen with contact info|Shows "Expired" badge, can re-invite|

**Storage:** Each invitation is a separate row. There is no deduplication at the invitation level — the `ALREADY_JOINED` check in `GET /api/invite/[token]` handles the case where someone tries to use a link after already accepting a different invitation to the same memorial. This is correct.

**Missing:** Add an `invitation_id` foreign key to `user_memorial_roles` to trace which invitation a membership originated from. This already exists (`invited_via_invitation_id`) — it is correct.

---

### 5. Critical Edge Cases

**A. Last Admin Protection**

Currently there is no protection against an Owner removing themselves. The system treats `user_id` on the `memorials` table as the canonical owner, which cannot be changed through normal flows. However, if the owner's account is deleted, `user_id` becomes `NULL` (via `ON DELETE SET NULL`). The archive becomes orphaned.

**Fix:**

```sql
-- In accept_invitation function, prevent the only owner from being demoted
-- In update-role API route, add check:
IF targetUserId = memorial.user_id THEN
  RAISE EXCEPTION 'Cannot change the owner''s role';
END IF;
-- This already exists in update-role/route.ts — correct.
```

For succession/orphaning: the `user_successors` table handles this at account level. Ensure your succession activation flow reassigns `memorials.user_id` to the successor's user ID when fully activated.

**B. Duplicate Invitations**

Currently, the system allows sending multiple pending invitations to the same email for the same memorial. This is a UX problem (the invitee gets multiple emails) and a data integrity problem (which one "counts"?).

**Fix — Add a unique constraint with a partial index:**

```sql
-- In SQL, add unique constraint on pending invitations
CREATE UNIQUE INDEX idx_unique_pending_invitation
  ON witness_invitations(memorial_id, invitee_email)
  WHERE status = 'pending';
```

This allows re-inviting after decline/expire but prevents duplicate pending invitations.

**C. Expired Token Handling**

Currently, expiry is checked lazily (only when the token is visited). Tokens are not proactively expired. This is acceptable behavior — the `expires_at` check in `GET /api/invite/[token]` handles this correctly and marks them expired

I now have a thorough understanding of the entire system. Here is the complete architectural analysis:

---

# ULUMAE — Complete System Architecture & Redesign Document

---

## A. Core System Architecture & Security Strategy

### 1. Live Role Change Handling & UI Synchronization

**The Problem Today:** The current `useArchiveRole.ts` hook fetches role data once on mount via a simple `fetch`. If a role is changed mid-session, the affected user has no mechanism to detect this until the next page load. This is a silent security gap — a downgraded user continues operating with stale role data in their browser.

**The Architecture Decision: Supabase Realtime + Short-Poll Fallback**

Do not use WebSockets from scratch. Supabase Realtime already provides Postgres-level change broadcasting. The solution is a three-layer defense:

**Layer 1 — Supabase Realtime subscription on `user_memorial_roles`:**

```typescript
// lib/realtime/useRoleSync.ts
import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function useRoleSync(memorialId: string, userId: string, currentRole: string) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`role:${memorialId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_memorial_roles',
          filter: `memorial_id=eq.${memorialId}`,
        },
        (payload) => {
          // Only react to changes affecting THIS user
          if (payload.new.user_id !== userId) return;

          const newRole = payload.new.role;
          if (newRole !== currentRole) {
            handleRoleChange(newRole, currentRole);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'user_memorial_roles',
          filter: `memorial_id=eq.${memorialId}`,
        },
        (payload) => {
          if (payload.old.user_id === userId) {
            handleRevocation();
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [memorialId, userId]);

  function handleRoleChange(newRole: string, oldRole: string) {
    // Fire a custom event that any component can listen to
    window.dispatchEvent(new CustomEvent('ulumae:role-changed', {
      detail: { memorialId, oldRole, newRole }
    }));
  }

  function handleRevocation() {
    window.dispatchEvent(new CustomEvent('ulumae:access-revoked', {
      detail: { memorialId }
    }));
    // Redirect immediately — no toast, just remove them
    router.replace(`/archive/${memorialId}/revoked`);
  }
}
```

**Layer 2 — The `RoleBanner` component listens to events and shows a non-dismissible notification:**

```
ROLE DOWNGRADED: You are now a Reader on this archive.
Your contribution abilities have been updated. [Reload to apply]
```

This banner is sticky, non-dismissible, and forces a hard reload which re-fetches role-data from the server via the API. The user cannot dismiss it — this is intentional. Stale permissions are a security risk.

**Layer 3 — Server-side re-validation on every protected API route:** Every API route must re-check the role from the DB, never trust a session claim. The `role-data` endpoint is already doing this correctly.

**UX for mid-session role changes:**

- **Downgrade (co_guardian → witness):** Sticky banner appears. "Review Queue" button disappears on reload. Steward page becomes inaccessible (403 enforced server-side).
- **Full revocation:** Immediate redirect to `/archive/[id]/revoked` — a graceful page explaining that access was removed and who to contact.
- **Upgrade (witness → co_guardian):** Positive toast notification. No forced reload needed — new capabilities become available on the next navigation.

**Enable Realtime on `user_memorial_roles` in Supabase:**

```sql
-- Add to supabase_fresh_setup.sql
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE user_memorial_roles;
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;
```

---

### 2. Permissions & Security Architecture

**The definitive enforcement stack (layered, not pick-one):**

```
Browser (UX gating only — never trust)
    ↓
Next.js Middleware (session refresh, redirect unauthenticated)
    ↓
API Route / Server Action (role verification against DB — PRIMARY ENFORCEMENT)
    ↓
Supabase RLS Policies (last line of defense — catches anything that bypasses API)
```

**Critical gap in current middleware:** `middleware.ts` only calls `updateSession` — it does NOT enforce any route-level authorization. This means a direct URL visit to `/archive/[id]/steward` by an unauthenticated user reaches the page component before any auth check. The fix:

```typescript
// middleware.ts — Enhanced version
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

// Routes that require authentication
const PROTECTED_PREFIXES = ['/archive', '/dashboard', '/create', '/succession'];
// Routes that are public
const PUBLIC_PREFIXES = ['/invite', '/person', '/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // First: refresh the session token (existing behavior)
  const response = await updateSession(request);

  // Second: enforce auth on protected routes
  const requiresAuth = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (requiresAuth) {
    const supabase = createServerClient(/* ... */);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}
```

**Critical gap in current RLS — `witness_invitations`:** The current policy `USING (true)` allows ANY authenticated user to read ALL invitations by ID. This is intentional for the invitation link flow, but the `Authenticated users can update invitations` policy with `USING (true)` means any authenticated user could update any invitation status. This must be locked down:

```sql
-- REPLACE these two policies:
DROP POLICY IF EXISTS "Authenticated users can update invitations" ON witness_invitations;

CREATE POLICY "Only memorial owner can update invitations"
  ON witness_invitations FOR UPDATE
  USING (
    memorial_id IN (SELECT get_owned_memorial_ids(auth.uid()))
    -- or via the accept flow which uses service_role
  );

-- The decline action should use the service_role key from an API route,
-- not the authenticated user directly.
```

**Critical gap — `memorial_contributions` INSERT policy:** `WITH CHECK (true)` means any unauthenticated user can insert a contribution for any memorial. For production, this should require either (a) authenticated user, or (b) the row to contain a `verification_code` that was pre-generated server-side:

```sql
DROP POLICY IF EXISTS "Anyone can submit contributions" ON memorial_contributions;

CREATE POLICY "Verified contributors can submit"
  ON memorial_contributions FOR INSERT
  WITH CHECK (
    -- Authenticated users
    auth.uid() IS NOT NULL
    OR
    -- Anonymous users must have a server-set verification_code
    (is_anonymous = true AND verification_code IS NOT NULL)
  );
```

**Role enforcement for `reader` (currently missing from RLS):** The `reader` role was added to the constraint check in Section 24 of the SQL, but there are no RLS policies that specifically restrict readers from contributing. This must be enforced at the API level:

```typescript
// In any contribution API route
const CONTRIBUTION_ALLOWED_ROLES = ['owner', 'co_guardian', 'witness'];
if (!CONTRIBUTION_ALLOWED_ROLES.includes(userRole)) {
  return NextResponse.json({ error: 'Readers cannot submit contributions' }, { status: 403 });
}
```

---

### 3. Content Ownership & Approval Flows

**Ownership model:**

|Content Type|Owner|Can Edit?|Can Delete?|Approval Required?|
|---|---|---|---|---|
|Core memorial data (steps 1–9)|Memorial Owner|Owner + Co-Guardian|Owner only|No — published directly|
|Witness memory submission|The Witness who submitted|Witness (before approval) / Co-Guardian (after)|Owner + Co-Guardian|**Yes — always**|
|Witness photo submission|The Witness who submitted|Owner + Co-Guardian only|Owner + Co-Guardian|**Yes — always**|
|Co-Guardian direct edit|Co-Guardian|Owner + Co-Guardian|Owner only|No — applied directly|

**The Approval Flow as a state machine (stored in `memorial_contributions.status`):**

```
[Witness submits] 
    → status: 'pending_approval'
    → Owner/Co-Guardian notified (email + realtime badge on steward page)

[Owner/Co-Guardian reviews]
    → APPROVE: status: 'approved' → content merges into public archive view
    → REJECT with note: status: 'rejected', admin_notes: "..." → Witness sees reason
    → (Future) NEEDS_CHANGES: status: 'needs_changes' → Witness can revise and resubmit
```

**Disputed content** (in `WitnessContribution.disputed`): If a Witness disagrees with a rejection, they flag it as disputed. This surfaces in the steward view with a special indicator — Owner must explicitly acknowledge to close it.

---

### 4. Comprehensive Invitation State Machine

**All states and their DB representation in `witness_invitations.status`:**

```
         [Owner sends invite]
               ↓
           'pending'  ←─── (Default. Invitation email sent. Link is live.)
            /  |  \
           /   |   \
     accepted  |  declined      expired
     (User      |   (User        (expires_at passed.
     clicked    |   clicked      Auto-set by API route
     Accept)    |   Decline)     when token is fetched)
               ↓
           [Never used — link
            visited after
            someone else
            accepted it]
               ↓
          'accepted'
          (but current viewer ≠ accepted_by_user_id)
               → Display: 'USED_BY_OTHER'
```

**How states drive the UX:**

|DB Status|API Returns|UI Renders|
|---|---|---|
|`pending` + not expired + not accepted|`PENDING`|InvitePreview → InviteAuth → InviteAcceptance|
|`pending` + current user already has role|`ALREADY_JOINED`|Redirect to `/archive/[id]`|
|`pending` + expires_at < now|`EXPIRED` (auto-updated)|InviteTerminal: EXPIRED|
|`accepted` + viewer ≠ acceptor|`USED_BY_OTHER`|InviteTerminal: USED_BY_OTHER|
|`declined`|`DECLINED`|InviteTerminal: DECLINED|
|`null` (no invitation found)|`NOT_FOUND`|InviteTerminal: NOT_FOUND|
|Memorial `deleted_at IS NOT NULL`|`MEMORIAL_DELETED`|InviteTerminal: MEMORIAL_DELETED|

**Missing state: `revoked`**. When an Owner removes a member from `user_memorial_roles`, the invitation that created that membership stays in state `accepted`. This is fine — the invitation is a historical record. The active access is controlled solely by `user_memorial_roles`. There is no need to update invitation status on role removal.

---

### 5. Critical Edge Cases

**A. Last Admin Protection** Currently there is zero protection preventing an Owner from deleting their own `user_memorial_roles` row or changing their own role. Add a DB trigger:

```sql
CREATE OR REPLACE FUNCTION prevent_owner_role_removal()
RETURNS TRIGGER AS $$
DECLARE
  memorial_owner_id UUID;
BEGIN
  SELECT user_id INTO memorial_owner_id FROM memorials WHERE id = OLD.memorial_id;
  IF OLD.user_id = memorial_owner_id AND OLD.role = 'owner' THEN
    RAISE EXCEPTION 'Cannot remove the Owner role from the memorial owner.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_prevent_owner_role_removal
  BEFORE DELETE ON user_memorial_roles
  FOR EACH ROW EXECUTE FUNCTION prevent_owner_role_removal();
```

The `update-role` API route already prevents self-role changes (`targetUserId === user.id`), but this is frontend-only. The trigger is the server-side guarantee.

**B. Duplicate Invitations** Current schema allows multiple `pending` invitations for the same `(memorial_id, invitee_email)` combination. Add a partial unique index:

```sql
CREATE UNIQUE INDEX idx_unique_pending_invitation
  ON witness_invitations (memorial_id, invitee_email)
  WHERE status = 'pending';
```

When a new invite is sent to an already-invited email, the API should `UPDATE` the existing pending invitation (reset `expires_at`, update `role`, update `personal_message`) rather than creating a duplicate row.

**C. Expired Tokens** Currently handled correctly: the `GET /api/invite/[token]` route checks `expires_at` and auto-updates to `expired`. However, there is no scheduled job to auto-expire in bulk. This is fine for UX — lazy expiry on access is sufficient. If batch expiry is needed later, a Supabase Edge Function cron can handle it.

**D. Revoked Access Mid-Session** Handled via the Realtime subscription described in Section 1. The `DELETE` event on `user_memorial_roles` triggers an immediate redirect to `/archive/[id]/revoked`.

**E. Immediate Role Downgrade (co_guardian → reader)** The current `update-role` API route updates the DB immediately. With Realtime enabled on `user_memorial_roles`, the downgraded user's browser receives the change event within ~200ms and the `RoleBanner` component fires. The server enforces the new permissions on the very next API call — the window of stale access is bounded by network latency, not user action.

**F. Invitation sent to a different email than what the user signs up with** Currently handled gracefully in `InviteAuthStep` — the email-differs warning is shown. The join still works because the DB stores `accepted_by_user_id`, not just email matching.

---

## B. File Path Analysis — Current vs. Proposed

### Current Structure (Problems Identified)

|Current Path|Problem|
|---|---|
|`app/invite/[token]/page.tsx`|Uses `'use client'` as the page root — should be a Server Component that validates the token server-side and only passes safe data to client components|
|`app/invite/[token]/anonymous/page.tsx`|The link `href="/invite/${invitation.id}/anonymous"` in `InviteAuthStep.tsx` uses `invitation.id` but should use `token` — these are the same UUID but semantically inconsistent|
|`app/dashboard/personal/[userId]/page.tsx`|`userId` is in the URL and matched against `auth.user.id` client-side. This is a client-side auth check — can be bypassed by navigating before auth loads. Must be enforced in middleware or as a Server Component|
|`app/dashboard/family/[userId]/page.tsx`|Same problem as personal. Also contains the `RoleManagementTable` scoped to only `firstPaidMemorial` — the family plan should show role management for the entire group, not just one memorial|
|`components/RoleManagementTable.tsx`|Lives in `/components/` (global) but is a feature-specific component. Should be colocated with the dashboard features it belongs to|
|`app/archive/[memorialId]/contribute/page.tsx`|No server-side check that the current user is allowed to contribute to THIS memorial. A user who has been revoked can still visit this URL and submit|
|`app/archive/[memorialId]/_hooks/useArchiveRole.ts`|The `useArchiveRole` hook is a `useEffect` + `fetch` pattern. It should use React Query or `useSWR` for caching, revalidation, and stale-while-revalidate semantics|
|`app/api/archive/[memorialId]/members/route.ts`|Queries `auth.users` directly as `'auth.users' as any` — this is a Supabase internal table access anti-pattern. Should use the admin client's `auth.admin.getUserById()` instead|
|`witness_invitations` table|`role` column only allows `witness` / `co_guardian` but `user_memorial_roles` also allows `reader`. Section 24 SQL already added `reader` to the invitation constraint — needs verification|
|No dedicated `send-invite` API route|The invitation sending logic is scattered — some via wizard steps, none via a unified POST endpoint|

### What is Duplicated / Confusing

1. **Invitation sending** exists in both the creation wizard (step 7) and `RoleManagementTable`'s "Invite new" link — both point to different places with no unified backend handler
2. **Role logic** is duplicated between `InviteAcceptance.tsx` (`ROLE_CONFIG`), `RoleManagementTable.tsx` (another `ROLE_CONFIG`), and `types/memorial.ts` (`WitnessRole` type) — single source of truth needed
3. **Two dashboards** (`personal/[userId]` and `family/[userId]`) share 80% of their logic but are completely separate files
4. **The "Invite Witnesses" step in the creation wizard** should be entirely removed per requirements — but the link `inviteStepHref` in `RoleManagementTable` still points to `step=7` of the creation wizard

---

## C. Proposed Improved File Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
│
├── (marketing)/
│   ├── how-it-works/
│   ├── choice-pricing/
│   └── faq/
│
├── invite/
│   └── [token]/
│       ├── page.tsx                          ← SERVER COMPONENT — validates token, passes data down
│       ├── _components/
│       │   ├── InviteShell.tsx               ← Client wrapper with step machine
│       │   ├── InvitePreview.tsx             ← Unchanged, already good
│       │   ├── InviteAuthStep.tsx            ← Unchanged, already good
│       │   ├── InviteAcceptance.tsx          ← Unchanged, already good
│       │   ├── InviteTerminal.tsx            ← Unchanged, already good
│       │   └── RoleBadge.tsx                 ← Extracted: shared role badge component
│       └── anonymous/
│           └── page.tsx                      ← Unchanged
│
├── dashboard/
│   └── [userId]/
│       ├── page.tsx                          ← UNIFIED dashboard — redirects based on plan
│       ├── _components/
│       │   ├── PersonalDashboardView.tsx     ← Extracted from personal/[userId]/page.tsx
│       │   ├── FamilyDashboardView.tsx       ← Extracted from family/[userId]/page.tsx
│       │   ├── DraftDashboardView.tsx        ← Extracted from draft/[userId]/page.tsx
│       │   ├── ManageWitnessesModal.tsx      ← NEW: Personal plan witness management
│       │   └── ArchiveCard.tsx               ← Extracted: reusable memorial card
│       └── _hooks/
│           └── useDashboard.ts               ← Shared data fetching logic
│
├── archive/
│   └── [memorialId]/
│       ├── page.tsx                          ← Unchanged (witness/co-guardian hub)
│       ├── _components/
│       │   ├── RoleBanner.tsx                ← NEW: Live role change notification
│       │   └── ArchiveHeader.tsx             ← Extracted header
│       ├── _hooks/
│       │   ├── useArchiveRole.ts             ← Upgraded to useSWR
│       │   └── useRoleSync.ts                ← NEW: Realtime role change listener
│       ├── contribute/
│       │   └── page.tsx                      ← Add server-side access check
│       ├── steward/
│       │   └── page.tsx                      ← Contribution review queue (owner/co-guardian only)
│       ├── view/
│       │   └── page.tsx                      ← Public-facing memorial view
│       ├── family/
│       │   └── page.tsx                      ← Family constellation map
│       ├── welcome/
│       │   └── page.tsx                      ← Post-join welcome screen
│       └── revoked/
│           └── page.tsx                      ← NEW: Access revoked graceful page
│
├── api/
│   ├── invite/
│   │   └── [token]/
│   │       ├── route.ts                      ← GET: validate token
│   │       ├── join/route.ts                 ← POST: accept invitation
│   │       ├── decline/route.ts              ← POST: decline invitation
│   │       └── anonymous/
│   │           ├── send-code/route.ts
│   │           └── verify/route.ts
│   │
│   ├── memorials/
│   │   └── [memorialId]/
│   │       ├── invite/route.ts               ← NEW: POST to send an invitation (unified)
│   │       ├── members/route.ts              ← GET: list members + pending invites
│   │       ├── members/[targetUserId]/
│   │       │   ├── route.ts                  ← DELETE: remove a member
│   │       │   └── role/route.ts             ← PATCH: update role (replaces update-role)
│   │       ├── access-request/route.ts       ← NEW: Family Witness requests access to another memorial
│   │       ├── role-data/route.ts            ← GET: current user's role data
│   │       └── contributions/
│   │           └── [contributionId]/
│   │               └── route.ts              ← PATCH: approve/reject contribution
│   │
│   └── user/
│       ├── heartbeat/route.ts
│       └── role-events/route.ts              ← NEW: SSE stream for role changes (fallback)
│
├── person/[memorialId]/page.tsx              ← Public memorial viewing page
│
└── [rest of existing routes unchanged]

components/
├── role/
│   ├── RoleManagementTable.tsx               ← Moved + enhanced
│   ├── RoleDropdown.tsx                      ← Extracted from RoleManagementTable
│   ├── RoleBadge.tsx                         ← Shared badge component
│   ├── InviteComposer.tsx                    ← NEW: The unified invite UI (email + message + role)
│   └── AccessRequestButton.tsx              ← NEW: Family Witness "Request Access" CTA
│
├── providers/
│   └── AuthProvider.tsx                      ← Unchanged
│
└── [other existing components unchanged]

lib/
├── permissions.ts                            ← NEW: Canonical permission definitions
└── roles.ts                                  ← NEW: Canonical ROLE_CONFIG (single source of truth)

types/
├── memorial.ts                               ← Existing (move WitnessRole etc. to roles.ts)
├── roles.ts                                  ← NEW: Authoritative role types
└── invite.ts                                 ← NEW: Invitation types extracted
```

---

## D. Role Matrix Table

|Role|Scope|Permissions|Restrictions|Relevant Pages|Dynamic UI Differences|
|---|---|---|---|---|---|
|**Owner**|Personal: 1 memorial / Family: all memorials in group|Full CRUD on all memorial content, approve/reject contributions, send/revoke invitations, delete archive, billing access, manage all members|Cannot delete preserved (Arweave) archive. Cannot reassign own role.|Dashboard, Archive hub, Steward page, Create wizard, Person view, Succession|Shows "Review queue" badge, "Manage Witnesses" button, "Delete" button, full "Edit" access|
|**Co-Guardian**|**Family only.** Scoped to specific memorials they were assigned to|Can view + edit memorial content directly (no approval needed), can approve/reject witness contributions, can invite new witnesses and readers|Cannot delete the archive. Cannot change billing. Cannot reassign the Owner. Cannot invite other Co-Guardians (only Owner can). Available on Family plan only — toggle hidden/disabled on Personal plan|Archive hub (with steward access), Steward page, Create wizard (no invite step), View page|Sees "Review queue" button + badge. No "Delete" button. No billing section. Cannot assign co_guardian in role dropdown|
|**Witness**|Personal: 1 memorial. Family: initially assigned memorial(s); can request access to others|View full archive. Submit memory/photo contributions (pending approval). In Family: can see other memorials in group and click "Request Access"|Cannot edit content directly. Cannot approve contributions. Cannot invite others. Cannot see other members list. Reader-level access only until contribution is approved|Archive hub (witness view), Contribute page, View page, Family map (view only)|Sees "Share memory" CTA. No "Review queue". Contribution history shown with approval status. In Family: "Request Access" button on unjoined memorials|
|**Reader**|Personal: 1 memorial / Family: specific memorial(s)|View published archive content only|Cannot contribute. Cannot suggest. Cannot interact. Cannot see member list. Cannot access steward or edit pages|View page (`/person/[id]`) only — no dashboard hub|No CTAs for contribution. No "Share memory" button. Minimal chrome — closest to a public visitor|

---

## E. Implementation Plan for the New "Witness" Invitation Flow

### The Unified `InviteComposer` Component

This is a single, self-contained component that replaces the scattered invite logic. It is used in two contexts: (1) the "Manage Witnesses" modal on the Personal dashboard, and (2) the Family dashboard's Permissions Management Center.

```typescript
// components/role/InviteComposer.tsx
'use client';
import { useState } from 'react';
import { Send, ChevronDown, Loader2, Check } from 'lucide-react';

type AssignableRole = 'witness' | 'co_guardian' | 'reader';

interface InviteComposerProps {
  memorialId: string;
  planType: 'personal' | 'family';
  onSuccess: (email: string, role: AssignableRole) => void;
}

const ROLE_OPTIONS: { value: AssignableRole; label: string; description: string }[] = [
  {
    value: 'witness',
    label: 'Witness',
    description: 'Can share memories and photos — all reviewed before publishing'
  },
  {
    value: 'reader',
    label: 'Reader',
    description: 'Can view the archive only — no contributions'
  },
  {
    value: 'co_guardian',
    label: 'Co-Guardian',
    description: 'Full edit access — for trusted family stewards only'
    // Rendered disabled + hidden when planType === 'personal'
  },
];

export default function InviteComposer({ memorialId, planType, onSuccess }: InviteComposerProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AssignableRole>('witness');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const availableRoles = ROLE_OPTIONS.filter(r =>
    planType === 'family' ? true : r.value !== 'co_guardian'
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/memorials/${memorialId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          role,
          personalMessage: message.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send invitation');

      setSent(true);
      onSuccess(email.trim(), role);
      setTimeout(() => {
        setSent(false);
        setEmail('');
        setMessage('');
        setRole('witness');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-4">
      {/* Row 1: Email + Role selector inline */}
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="flex-1 glass-input"
        />
        {/* Role selector — inline dropdown */}
        <RoleSelector
          value={role}
          options={availableRoles}
          onChange={setRole}
        />
      </div>

      {/* Row 2: Personal message */}
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Add a personal note (optional)..."
        rows={3}
        maxLength={500}
        className="w-full glass-input resize-none text-sm"
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || sent || !email.trim()}
        className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
          sent
            ? 'bg-olive/10 text-olive border border-olive/20'
            : 'glass-btn-dark'
        }`}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {sent ? <><Check size={16} /> Invitation sent</> : 'Send invitation →'}
      </button>
    </form>
  );
}
```

### The Backend: `POST /api/memorials/[memorialId]/invite`

```typescript
// app/api/memorials/[memorialId]/invite/route.ts
export async function POST(req, { params }) {
  const { memorialId } = await params;
  const { user } = await createAuthenticatedClient();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { email, role, personalMessage } = await req.json();

  // 1. Validate inputs
  const VALID_ROLES = ['witness', 'co_guardian', 'reader'];
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  // 2. Verify requester is owner OR co_guardian (co-guardians can invite witnesses/readers)
  const { data: memorial } = await supabaseAdmin
    .from('memorials').select('user_id, mode, full_name').eq('id', memorialId).single();

  const isOwner = memorial?.user_id === user.id;
  const { data: callerRole } = await supabaseAdmin
    .from('user_memorial_roles').select('role')
    .eq('memorial_id', memorialId).eq('user_id', user.id).single();

  const isCoGuardian = callerRole?.role === 'co_guardian';

  if (!isOwner && !isCoGuardian) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3. Co-guardians cannot invite co_guardians
  if (isCoGuardian && role === 'co_guardian') {
    return NextResponse.json({ error: 'Co-Guardians cannot invite other Co-Guardians' }, { status: 403 });
  }

  // 4. co_guardian role requires family plan
  if (role === 'co_guardian' && memorial.mode !== 'family') {
    return NextResponse.json({ error: 'Co-Guardian is a Family plan role only' }, { status: 403 });
  }

  // 5. Check for existing pending invite — UPDATE instead of INSERT
  const { data: existing } = await supabaseAdmin
    .from('witness_invitations')
    .select('id').eq('memorial_id', memorialId).eq('invitee_email', email.toLowerCase())
    .eq('status', 'pending').single();

  let invitationId: string;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  if (existing) {
    // Refresh existing pending invitation
    await supabaseAdmin.from('witness_invitations').update({
      role, personal_message: personalMessage, expires_at: expiresAt,
    }).eq('id', existing.id);
    invitationId = existing.id;
  } else {
    const { data: inv } = await supabaseAdmin.from('witness_invitations').insert({
      memorial_id: memorialId,
      inviter_name: user.email!, // or fetch display name
      invitee_email: email.toLowerCase(),
      role,
      personal_message: personalMessage,
      plan: memorial.mode === 'family' ? 'family' : 'personal',
      expires_at: expiresAt,
    }).select('id').single();
    invitationId = inv!.id;
  }

  // 6. Send email via your email service (Resend, SendGrid, etc.)
  await sendInvitationEmail({
    to: email,
    inviterName: user.email!,
    memorialName: memorial.full_name || 'a memorial',
    role,
    personalMessage,
    inviteUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invitationId}`,
  });

  return NextResponse.json({ success: true, invitationId });
}
```

### Removing the Invite Step from Creation Wizard

The wizard's step 7 currently handles both "Memories & Stories" and "Invite Witnesses". The fix:

1. Remove the invitation sub-section from step 7's JSX
2. Remove the `inviteStepHref` prop from `RoleManagementTable` when it points to the wizard
3. Replace with `inviteHref` that opens the `ManageWitnessesModal` inline

---

## F. Implementation Plan for Role Management UI

### The Upgraded `RoleManagementTable`

**Key new capabilities required:**

1. Optimistic updates (already implemented — keep)
2. Owner row locked (already implemented — keep)
3. Co-Guardian only in Family mode (already implemented — keep)
4. **NEW:** Revoke/remove member button
5. **NEW:** Re-invite capability for pending rows
6. **NEW:** Family Witness "Request Access" display
7. **NEW:** Realtime update subscription

```typescript
// components/role/RoleManagementTable.tsx — Enhanced

// Key additions to handleRoleChange:
const handleRoleChange = async (targetUserId: string, newRole: WitnessRole, email: string) => {
  // 1. Optimistic update (existing)
  setMembers(prev => prev.map(m => m.userId === targetUserId ? { ...m, role: newRole } : m));

  try {
    const res = await fetch(`/api/memorials/${memorialId}/members/${targetUserId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newRole }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update');
    }

    // Toast: "Sarah Chen is now a Witness"
    showToast(`${email} is now a ${newRole.replace('_', ' ')}`);

    // The affected user's browser will pick up the change via Realtime.
    // No need to trigger anything here.
  } catch (err) {
    fetchMembers(); // Revert
  }
};

// New: handleRemoveMember
const handleRemoveMember = async (targetUserId: string, email: string) => {
  // Optimistic remove
  setMembers(prev => prev.filter(m => m.userId !== targetUserId));

  try {
    await fetch(`/api/memorials/${memorialId}/members/${targetUserId}`, { method: 'DELETE' });
    showToast(`${email} has been removed`);
  } catch {
    fetchMembers(); // Revert
  }
};
```

**The MemberRow lock logic:**

```typescript
// Owner row is always locked (non-editable)
const isOwnerRow = member.role === 'owner';
// Cannot edit pending rows (they haven't joined yet — only re-invite or cancel)
const isPending = member.status === 'pending';
// Can edit active non-owner rows if requester is owner
const canEdit = isOwner && !isOwnerRow && !isPending;
```

**The Family Witness "Request Access" Flow:**

This requires a new table to store access requests:

```sql
-- Add to SQL migrations
CREATE TABLE IF NOT EXISTS memorial_access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  current_role TEXT NOT NULL, -- The role they're requesting to expand
  request_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ,
  decided_by UUID REFERENCES auth.users(id),
  CONSTRAINT unique_pending_access_request
    UNIQUE (requester_user_id, memorial_id) WHERE status = 'pending' -- partial unique
);

ALTER TABLE memorial_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Requesters can view own requests"
  ON memorial_access_requests FOR SELECT
  USING (requester_user_id = auth.uid());

CREATE POLICY "Memorial owners can view requests for their memorials"
  ON memorial_access_requests FOR SELECT
  USING (memorial_id IN (SELECT get_owned_memorial_ids(auth.uid())));

CREATE POLICY "Authenticated users can create requests"
  ON memorial_access_requests FOR INSERT
  WITH CHECK (requester_user_id = auth.uid());

CREATE POLICY "Owners can update requests"
  ON memorial_access_requests FOR UPDATE
  USING (memorial_id IN (SELECT get_owned_memorial_ids(auth.uid())));

CREATE POLICY "Service role full access"
  ON memorial_access_requests FOR ALL
  USING (auth.role() = 'service_role');
```

**The `AccessRequestButton` component:**

```typescript
// components/role/AccessRequestButton.tsx
// Shown on a Family memorial card when the viewing Witness 
// is NOT yet a member of that specific memorial

export function AccessRequestButton({ memorialId, memorialName }: Props) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'sent'>('idle');

  const handleRequest = async () => {
    setStatus('pending');
    try {
      await fetch(`/api/memorials/${memorialId}/access-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestMessage: '' }),
      });
      setStatus('sent');
    } catch {
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <span className="text-xs text-olive font-serif italic">
        Request sent — awaiting approval
      </span>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={status === 'pending'}
      className="text-xs glass-btn-dark px-4 py-2 rounded-lg"
    >
      Request Access to {memorialName}
    </button>
  );
}
```

**Owner approval flow for access requests:** The `steward` page (or a new "Requests" tab in the family dashboard) shows pending access requests. The Owner approves → system inserts a `user_memorial_roles` row for the requester at `witness` role. Realtime notifies the requester immediately.

---

## G. What is Already Done vs. What is Missing

### ✅ Already Done (solid foundations)

|Feature|Status|Notes|
|---|---|---|
|`witness_invitations` table + all states|✅ Complete|State machine is correct|
|`user_memorial_roles` table|✅ Complete|Unique constraint, RLS policies, proper indexes|
|`accept_invitation()` DB function|✅ Complete|Atomic, handles race conditions with FOR UPDATE|
|`reader` role added to constraints|✅ Complete|Section 24 of SQL|
|Circular RLS dependency fix|✅ Complete|SECURITY DEFINER helper functions elegant solution|
|`update-role` API route|✅ Complete|Proper authorization chain|
|`InvitePreview` component|✅ Complete|Clean UX, role-aware|
|`InviteAcceptance` component|✅ Complete|Two-checkbox consent is excellent UX|
|`InviteAuthStep` component|✅ Complete|Email locking, mode toggle|
|`InviteTerminal` component|✅ Complete|All terminal states handled|
|Anonymous contribution flow|✅ Complete|OTP verify, session storage|
|Optimistic role updates in RoleManagementTable|✅ Complete|Revert on failure|
|Plan-gated co_guardian in dropdown|✅ Complete|Family-only correctly enforced|
|RLS — content review, versions, authorizations|✅ Complete|Service role properly scoped|
|`memorial_relations` family-mode enforcement|✅ Complete|Trigger prevents non-family relations|
|Auto `updated_at` triggers|✅ Complete|All tables covered|
|`paid` column integrity trigger|✅ Complete|Prevents manual payment bypass|
|Preservation state machine trigger|✅ Complete|Valid transitions enforced|

### ❌ Missing (must build)

|Feature|Priority|Location|
|---|---|---|
|Realtime role change listener + `RoleBanner`|🔴 Critical|`lib/realtime/useRoleSync.ts` + new component|
|Middleware auth enforcement for protected routes|🔴 Critical|`middleware.ts`|
|Unified `POST /api/memorials/[id]/invite` endpoint|🔴 Critical|New route|
|Duplicate invitation prevention (partial unique index)|🔴 Critical|SQL migration|
|Last admin protection trigger|🔴 Critical|SQL migration|
|`InviteComposer` unified component|🔴 Critical|`components/role/InviteComposer.tsx`|
|`ManageWitnessesModal` for Personal dashboard|🔴 Critical|New component|
|Remove invite step from creation wizard|🔴 Critical|Wizard step 7 edit|
|`/archive/[id]/revoked` graceful page|🟡 High|New page|
|`memorial_access_requests` table + flow|🟡 High|SQL + API + component|
|`AccessRequestButton` component|🟡 High|`components/role/AccessRequestButton.tsx`|
|`DELETE /api/memorials/[id]/members/[userId]`|🟡 High|New route|
|`lib/roles.ts` — canonical role config|🟡 High|Eliminates duplication|
|`useRoleSync.ts` Realtime hook|🟡 High|New hook|
|`useSWR`/React Query for `useArchiveRole`|🟡 High|Replaces raw fetch|
|Family dashboard role management per memorial (not just first)|🟡 High|Dashboard refactor|
|`members/route.ts` fix: use `auth.admin.getUserById()`|🟡 High|Fix anti-pattern|
|RLS hardening on `witness_invitations` UPDATE|🟡 High|SQL policy change|
|RLS hardening on `memorial_contributions` INSERT|🟡 High|SQL policy change|
|Family Witness "Request Access" approval UI in steward|🟠 Medium|Steward page addition|
|Co-Guardian invitation restriction (cannot invite co-guardians)|🟠 Medium|API route enforcement|
|`WitnessRole` type moved to `lib/roles.ts` as single source|🟠 Medium|Type refactor|
|Toast on invitation sent|🟠 Medium|InviteComposer|

---

## H. Final Recommendation: Dynamic Pages vs. Separate Pages

**Decision: One shared `archive/[memorialId]` hub with server-enforced role-based section rendering. Separate pages only for functionally distinct surfaces.**

### Justification

**Keep unified:**

- `/archive/[memorialId]/page.tsx` — the hub. Server fetches role, renders appropriate action cards. A Reader sees a link to view. A Witness sees contribute CTA. A Co-Guardian sees review queue. An Owner sees everything. **One URL, one route, server-side role check, dynamically rendered sections.** This is secure because the role check happens server-side before the HTML is generated.

**Keep separate:**

- `/archive/[memorialId]/steward` — Separate page because it has entirely different data requirements (contribution queue) and access is meaningfully restricted (owner + co-guardian only). Middleware or the page's server component does a role check and returns 403 if not authorized.
- `/archive/[memorialId]/contribute` — Separate page. Witnesses access this; owners rarely need to. Different data model entirely.
- `/archive/[memorialId]/view` — Separate public-facing view that is stripped of all management chrome. This is what a Reader or public visitor sees. Completely different layout.

**Do NOT create:**

- Separate pages per role like `/archive/[id]/witness-dashboard` and `/archive/[id]/owner-dashboard`. This is the wrong pattern — it creates URL-as-security anti-pattern where role is implied by URL, encourages frontend-only access checks, and doubles maintenance burden.

**The security argument:** A single `/archive/[memorialId]/page.tsx` that performs one server-side `role-data` API call on load is MORE secure than multiple role-specific pages because:

1. There is only one place to update when security logic changes
2. A user cannot gain elevated access by visiting a different URL — the server always re-validates
3. The client receives only the data their role permits, not a full data dump that is then visually hidden

**The implementation:**

```typescript
// app/archive/[memorialId]/page.tsx — Server Component
import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ArchivePage({ params }) {
  const { memorialId } = await params;
  const supabase = createServerClient();
  
  // Server-side auth check — runs BEFORE any client JS
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/archive/${memorialId}`);

  // Server-side role check
  const roleData = await fetchRoleData(memorialId, user.id);
  if (!roleData) redirect('/dashboard');

  // Pass role-safe data to client component
  return <ArchiveHubClient roleData={roleData} memorialId={memorialId} />;
}
```

This architecture is correct, scalable, and secure. It scales to both Personal (single memorial) and Family (multiple memorials, same role enforcement logic per memorial) plans without branching.

---

### Summary of Priority Actions

The three highest-impact changes to make immediately are:

1. **Middleware hardening** — add server-side auth enforcement to protected routes so direct URL manipulation is blocked before React even loads
2. **Unified invite endpoint** (`POST /api/memorials/[id]/invite`) + `InviteComposer` component — consolidates all invitation logic into one auditable path
3. **Realtime role sync** — `useRoleSync.ts` hook + `RoleBanner` component — closes the session staleness security window for mid-session role changes

Everything else is progressively enhanceable, but these three close the most significant current vulnerabilities.