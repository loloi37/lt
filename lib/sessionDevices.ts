import type { NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';

function compactUserAgent(userAgent?: string | null) {
  return String(userAgent || '').trim().slice(0, 1024);
}

export function getRequestIpAddress(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (!forwardedFor) {
    return null;
  }

  return forwardedFor.split(',')[0]?.trim() || null;
}

export function getDeviceLabelFromUserAgent(userAgent?: string | null) {
  const normalized = compactUserAgent(userAgent);

  if (!normalized) {
    return 'Unknown device';
  }

  if (normalized.includes('iPhone')) return 'iPhone';
  if (normalized.includes('iPad')) return 'iPad';
  if (normalized.includes('Android')) return 'Android device';
  if (normalized.includes('Mac OS X')) return 'Mac';
  if (normalized.includes('Windows')) return 'Windows device';
  if (normalized.includes('Linux')) return 'Linux device';

  return 'Browser session';
}

export async function trackUserSessionDevice(
  supabaseAdmin: SupabaseClient,
  {
    userId,
    sessionId,
    ipAddress,
    userAgent,
  }: {
    userId: string;
    sessionId: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }
) {
  if (!sessionId) {
    return;
  }

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin.from('user_session_devices').upsert(
    {
      user_id: userId,
      session_id: sessionId,
      device_label: getDeviceLabelFromUserAgent(userAgent),
      ip_address: ipAddress ?? null,
      user_agent: compactUserAgent(userAgent),
      last_seen_at: now,
      revoked_at: null,
    },
    {
      onConflict: 'user_id,session_id',
    }
  );

  if (error) {
    // Non-critical: log but don't crash the caller.
    // The table may not exist yet if the migration hasn't been run.
    console.warn('[session-devices] tracking failed:', error.message || error);
  }
}
