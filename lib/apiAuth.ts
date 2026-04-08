// lib/apiAuth.ts
//
// Centralized API authentication + authorization helpers.
//
// Rules enforced here:
//   1. Never trust userId / memorialId / role from the client.
//   2. Authentication (who the user is) is derived from the Supabase
//      session cookie via createAuthenticatedClient().
//   3. Authorization (what they can do) is resolved against the database
//      via resolveArchivePermissionContext() — never read from the body.
//   4. Routes call requireUser() or requireMemorialAccess() and receive
//      a typed result. Both helpers can return a NextResponse early to
//      keep call sites uniform.

import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { createAuthenticatedClient } from '@/utils/supabase/api';
import {
  ArchiveAction,
  ArchivePermissionContext,
  hasPermission,
  resolveArchivePermissionContext,
} from '@/lib/archivePermissions';

// ─── Admin client (singleton) ───────────────────────────────────────────────
//
// Service-role client used for permission resolution and privileged writes
// after the request has already been authorized. Never expose this to the
// client.

let _adminClient: SupabaseClient | null = null;
export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient;
  _adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  return _adminClient;
}

// ─── requireUser ────────────────────────────────────────────────────────────
//
// Resolve the authenticated user from the session cookie. Returns either
// { user, supabase } or a 401 response. Use it at the top of any route
// that needs an authenticated identity.

export type RequireUserResult =
  | { ok: true; user: User; supabase: SupabaseClient }
  | { ok: false; response: NextResponse };

export async function requireUser(): Promise<RequireUserResult> {
  const { supabase, user } = await createAuthenticatedClient();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { ok: true, user, supabase };
}

// ─── requireMemorialAccess ──────────────────────────────────────────────────
//
// Resolve the user, then resolve the user's role on a specific memorial,
// then optionally enforce a permission check. The route never sees the
// raw role string from the client.

export interface RequireMemorialAccessOptions {
  memorialId: string;
  /** Permission action that must be allowed. If omitted, only membership is required. */
  action?: ArchiveAction;
}

export type RequireMemorialAccessResult =
  | {
      ok: true;
      user: User;
      supabase: SupabaseClient;
      admin: SupabaseClient;
      context: ArchivePermissionContext;
    }
  | { ok: false; response: NextResponse };

export async function requireMemorialAccess(
  options: RequireMemorialAccessOptions
): Promise<RequireMemorialAccessResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth;

  const { user, supabase } = auth;
  const admin = getSupabaseAdmin();

  if (!options.memorialId || typeof options.memorialId !== 'string') {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Missing memorialId' },
        { status: 400 }
      ),
    };
  }

  const permission = await resolveArchivePermissionContext(
    admin,
    options.memorialId,
    user.id
  );

  if (!permission.memorialExists) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      ),
    };
  }

  if (!permission.context) {
    // Memorial exists but the user has no role on it.
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  if (options.action && !hasPermission(permission.context, options.action)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return {
    ok: true,
    user,
    supabase,
    admin,
    context: permission.context,
  };
}
