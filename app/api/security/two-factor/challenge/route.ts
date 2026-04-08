import { NextRequest, NextResponse } from 'next/server';
import {
    clearAllTrustedTwoFactorSessions,
    createAdminClient,
    decryptTwoFactorSecret,
    getTwoFactorEnforcementStatus,
    hashRecoveryCode,
    listTwoFactorFactors,
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

        if (!sessionId) {
            return NextResponse.json({ error: 'This session could not be verified. Please sign in again.' }, { status: 400 });
        }

        const payload = await request.json();
        const method = payload.method === 'recovery' ? 'recovery' : 'totp';
        const supabaseAdmin = createAdminClient();
        const enforcement = await getTwoFactorEnforcementStatus(supabaseAdmin, user.id, sessionId);

        if (!enforcement.enabled) {
            return NextResponse.json({ error: 'Two-factor authentication is not enabled on this account.' }, { status: 400 });
        }

        if (method === 'recovery') {
            const recoveryCode = String(payload.recoveryCode || '');
            const recoveryCodeHash = hashRecoveryCode(recoveryCode);

            const { data: recoveryRows, error: recoveryError } = await supabaseAdmin
                .from('user_two_factor_recovery_codes')
                .select('id, code_hash, used_at')
                .eq('user_id', user.id)
                .is('used_at', null);

            if (recoveryError) {
                throw recoveryError;
            }

            const matchingCode = (recoveryRows || []).find((row: any) => row.code_hash === recoveryCodeHash);

            if (!matchingCode) {
                return NextResponse.json({ error: 'The recovery code is not valid.' }, { status: 400 });
            }

            const { error: useRecoveryError } = await supabaseAdmin
                .from('user_two_factor_recovery_codes')
                .update({ used_at: new Date().toISOString() })
                .eq('id', matchingCode.id)
                .eq('user_id', user.id)
                .is('used_at', null);

            if (useRecoveryError) {
                throw useRecoveryError;
            }

            await trustCurrentTwoFactorSession(supabaseAdmin, user.id, sessionId, sessionExpiresAt);

            return NextResponse.json({ success: true, method: 'recovery' });
        }

        const code = String(payload.code || '').replace(/\D/g, '').slice(0, 6);
        const requestedFactorId = payload.factorId ? String(payload.factorId) : null;

        if (code.length < 6) {
            return NextResponse.json({ error: 'A 6-digit authenticator code is required.' }, { status: 400 });
        }

        const factors = await listTwoFactorFactors(supabaseAdmin, user.id, { includeSecrets: true });
        const verifiedFactors = factors.filter((factor) => Boolean(factor.verified_at));
        const candidateFactors = requestedFactorId
            ? verifiedFactors.filter((factor) => factor.id === requestedFactorId)
            : verifiedFactors;

        for (const factor of candidateFactors) {
            const secret = decryptTwoFactorSecret(factor);
            const verification = verifyTwoFactorToken(secret, code, factor.last_verified_time_step);

            if (!verification) {
                continue;
            }

            const now = new Date().toISOString();
            const { error: updateFactorError } = await supabaseAdmin
                .from('user_two_factor_factors')
                .update({
                    last_used_at: now,
                    last_verified_time_step: verification.timeStep,
                })
                .eq('id', factor.id)
                .eq('user_id', user.id);

            if (updateFactorError) {
                throw updateFactorError;
            }

            await trustCurrentTwoFactorSession(supabaseAdmin, user.id, sessionId, sessionExpiresAt);

            return NextResponse.json({ success: true, method: 'totp' });
        }

        return NextResponse.json(
            { error: 'The authenticator code is not valid or was already used.' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('[two-factor-challenge]', error);
        return NextResponse.json(
            { error: error.message || 'Could not verify this two-factor challenge.' },
            { status: 500 }
        );
    }
}
