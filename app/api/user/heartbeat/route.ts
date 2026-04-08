// app/api/user/heartbeat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { decodeSessionIdFromAccessToken } from '@/lib/security/twoFactor';
import { getRequestIpAddress, trackUserSessionDevice } from '@/lib/sessionDevices';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { supabase, user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = user.id;

        const { data: sessionData } = await supabase.auth.getSession();
        await trackUserSessionDevice(supabaseAdmin, {
            userId,
            sessionId: decodeSessionIdFromAccessToken(sessionData.session?.access_token),
            ipAddress: getRequestIpAddress(request),
            userAgent: request.headers.get('user-agent'),
        });

        const { error } = await supabaseAdmin
            .from('users')
            .update({
                last_active_at: new Date().toISOString(),
                // Also clear the warning sent flag since they are active
                verification_sent_at: null
            })
            .eq('id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Heartbeat error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
