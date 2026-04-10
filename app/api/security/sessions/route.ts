import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { decodeSessionIdFromAccessToken } from '@/lib/security/twoFactor';
import {
  getRequestIpAddress,
  trackUserSessionDevice,
} from '@/lib/sessionDevices';
import { SESSION_ACTIVITY_STALE_HOURS } from '@/lib/constants';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { supabase, user, error } = await createAuthenticatedClient();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const currentSessionId = decodeSessionIdFromAccessToken(
      sessionData.session?.access_token
    );

    await trackUserSessionDevice(supabaseAdmin, {
      userId: user.id,
      sessionId: currentSessionId,
      ipAddress: getRequestIpAddress(request),
      userAgent: request.headers.get('user-agent'),
    });

    const [sessionRowsResult, anchorRowsResult] = await Promise.all([
      supabaseAdmin
        .from('user_session_devices')
        .select('id, session_id, device_label, ip_address, user_agent, last_seen_at, created_at, revoked_at')
        .eq('user_id', user.id)
        .order('last_seen_at', { ascending: false }),
      supabaseAdmin
        .from('anchor_devices')
        .select('id, memorial_id, device_name, browser, os, last_sync_at, status, created_at')
        .eq('user_id', user.id)
        .order('last_sync_at', { ascending: false }),
    ]);

    if (sessionRowsResult.error) {
      throw sessionRowsResult.error;
    }

    if (anchorRowsResult.error) {
      throw anchorRowsResult.error;
    }

    const staleThreshold = Date.now() - SESSION_ACTIVITY_STALE_HOURS * 60 * 60 * 1000;

    return NextResponse.json(
      {
        currentSessionId,
        sessions: (sessionRowsResult.data || []).map((session) => ({
          id: session.id,
          sessionId: session.session_id,
          deviceLabel: session.device_label,
          ipAddress: session.ip_address,
          userAgent: session.user_agent,
          lastSeenAt: session.last_seen_at,
          createdAt: session.created_at,
          revokedAt: session.revoked_at,
          isCurrent: session.session_id === currentSessionId,
          isStale:
            !!session.last_seen_at &&
            new Date(session.last_seen_at).getTime() < staleThreshold,
        })),
        devices: (anchorRowsResult.data || []).map((device) => ({
          id: device.id,
          memorialId: device.memorial_id,
          deviceName: device.device_name,
          browser: device.browser,
          os: device.os,
          lastSyncAt: device.last_sync_at,
          status: device.status,
          createdAt: device.created_at,
        })),
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    console.error('[security-sessions]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await createAuthenticatedClient();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetId, type } = await request.json();

    if (!targetId || !['session', 'anchor'].includes(type)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (type === 'session') {
      const { error: revokeError } = await supabaseAdmin
        .from('user_session_devices')
        .update({ revoked_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('session_id', targetId);

      if (revokeError) throw revokeError;
    } else if (type === 'anchor') {
      const { error: revokeError } = await supabaseAdmin
        .from('anchor_devices')
        .update({ status: 'revoked' })
        .eq('user_id', user.id)
        .eq('id', targetId);

      if (revokeError) throw revokeError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[security-sessions-revoke]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
