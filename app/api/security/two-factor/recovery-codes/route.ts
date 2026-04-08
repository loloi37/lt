import { NextResponse } from 'next/server';
import {
    createAdminClient,
    getTwoFactorEnforcementStatus,
    replaceRecoveryCodes,
} from '@/lib/security/twoFactor';
import { getAuthenticatedTwoFactorContext } from '@/lib/security/twoFactorServer';

export async function POST() {
    try {
        const { user, sessionId } = await getAuthenticatedTwoFactorContext();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseAdmin = createAdminClient();
        const enforcement = await getTwoFactorEnforcementStatus(supabaseAdmin, user.id, sessionId);

        if (!enforcement.enabled) {
            return NextResponse.json({ error: 'Enable two-factor authentication first.' }, { status: 400 });
        }

        if (enforcement.requiresChallenge) {
            return NextResponse.json({ error: 'Verify this session with two-factor authentication first.' }, { status: 403 });
        }

        const recoveryCodes = await replaceRecoveryCodes(supabaseAdmin, user.id);

        return NextResponse.json({ success: true, recoveryCodes });
    } catch (error: any) {
        console.error('[two-factor-recovery-codes]', error);
        return NextResponse.json(
            { error: error.message || 'Could not regenerate recovery codes.' },
            { status: 500 }
        );
    }
}
