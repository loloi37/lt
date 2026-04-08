import { NextResponse } from 'next/server';
import {
    clearAllTrustedTwoFactorSessions,
    createAdminClient,
    getTwoFactorEnforcementStatus,
    listTwoFactorFactors,
} from '@/lib/security/twoFactor';
import { getAuthenticatedTwoFactorContext } from '@/lib/security/twoFactorServer';

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ factorId: string }> }
) {
    try {
        const { factorId } = await params;
        const { user, sessionId } = await getAuthenticatedTwoFactorContext();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseAdmin = createAdminClient();
        const enforcement = await getTwoFactorEnforcementStatus(supabaseAdmin, user.id, sessionId);

        if (enforcement.enabled && enforcement.requiresChallenge) {
            return NextResponse.json({ error: 'Verify this session before changing your two-factor settings.' }, { status: 403 });
        }

        const { error: deleteFactorError } = await supabaseAdmin
            .from('user_two_factor_factors')
            .delete()
            .eq('id', factorId)
            .eq('user_id', user.id);

        if (deleteFactorError) {
            throw deleteFactorError;
        }

        const remainingFactors = await listTwoFactorFactors(supabaseAdmin, user.id);
        const remainingVerifiedFactors = remainingFactors.filter((factor) => Boolean(factor.verified_at));

        if (!remainingVerifiedFactors.length) {
            const { error: deleteRecoveryError } = await supabaseAdmin
                .from('user_two_factor_recovery_codes')
                .delete()
                .eq('user_id', user.id);

            if (deleteRecoveryError) {
                throw deleteRecoveryError;
            }

            await clearAllTrustedTwoFactorSessions(supabaseAdmin, user.id);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[two-factor-delete-factor]', error);
        return NextResponse.json(
            { error: error.message || 'Could not remove this authenticator.' },
            { status: 500 }
        );
    }
}
