import { createAuthenticatedClient } from '@/utils/supabase/api';
import { decodeSessionIdFromAccessToken } from '@/lib/security/twoFactor';

export async function getAuthenticatedTwoFactorContext() {
    const { supabase, user, error } = await createAuthenticatedClient();

    if (error || !user) {
        return {
            supabase,
            user: null,
            sessionId: null,
            sessionExpiresAt: null,
        };
    }

    const { data: sessionData } = await supabase.auth.getSession();

    return {
        supabase,
        user,
        sessionId: decodeSessionIdFromAccessToken(sessionData.session?.access_token),
        sessionExpiresAt: sessionData.session?.expires_at
            ? new Date(sessionData.session.expires_at * 1000).toISOString()
            : null,
    };
}
