import { NextRequest, NextResponse } from 'next/server';
import {
    createAdminClient,
    decryptTwoFactorSecret,
    listTwoFactorFactors,
    replaceRecoveryCodes,
    trustCurrentTwoFactorSession,
    verifyTwoFactorToken,
} from '@/lib/security/twoFactor';
import { getAuthenticatedTwoFactorContext } from '@/lib/security/twoFactorServer';

export async function POST(request: NextRequest) {
    try {
        const { user, sessionId, sessionExpiresAt } = await getAuthenticatedTwoFactorContext();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await request.json();
        const factorId = String(payload.factorId || '');
        const code = String(payload.code || '').replace(/\D/g, '').slice(0, 6);

        if (!factorId || code.length < 6) {
            return NextResponse.json({ error: 'A valid setup code is required.' }, { status: 400 });
        }

        const supabaseAdmin = createAdminClient();
        const factors = await listTwoFactorFactors(supabaseAdmin, user.id, { includeSecrets: true });
        const pendingFactor = factors.find((factor) => factor.id === factorId && !factor.verified_at);

        if (!pendingFactor) {
            return NextResponse.json({ error: 'This authenticator setup could not be found.' }, { status: 404 });
        }

        const secret = decryptTwoFactorSecret(pendingFactor);
        const verification = verifyTwoFactorToken(secret, code);

        if (!verification) {
            return NextResponse.json({ error: 'The authenticator code is not valid.' }, { status: 400 });
        }

        const now = new Date().toISOString();

        const { error: updateError } = await supabaseAdmin
            .from('user_two_factor_factors')
            .update({
                verified_at: now,
                last_used_at: now,
                last_verified_time_step: verification.timeStep,
            })
            .eq('id', factorId)
            .eq('user_id', user.id);

        if (updateError) {
            throw updateError;
        }

        const recoveryCodes = await replaceRecoveryCodes(supabaseAdmin, user.id);

        if (sessionId) {
            await trustCurrentTwoFactorSession(
                supabaseAdmin,
                user.id,
                sessionId,
                sessionExpiresAt
            );
        }

        return NextResponse.json({
            success: true,
            recoveryCodes,
        });
    } catch (error: any) {
        console.error('[two-factor-verify-enrollment]', error);
        return NextResponse.json(
            { error: error.message || 'Could not finish authenticator setup.' },
            { status: 500 }
        );
    }
}
