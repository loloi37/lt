import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import {
    buildTwoFactorEnrollment,
    createAdminClient,
    encryptTwoFactorSecret,
} from '@/lib/security/twoFactor';
import { getAuthenticatedTwoFactorContext } from '@/lib/security/twoFactorServer';

export async function POST(request: NextRequest) {
    try {
        const { user } = await getAuthenticatedTwoFactorContext();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await request.json().catch(() => ({}));
        const friendlyName = String(payload.friendlyName || 'Authenticator').trim() || 'Authenticator';

        const enrollment = buildTwoFactorEnrollment(user.email || user.id, friendlyName);
        const encryptedSecret = encryptTwoFactorSecret(enrollment.secret);
        const qrCodeDataUrl = await QRCode.toDataURL(enrollment.otpauthUri, {
            margin: 1,
            width: 220,
        });

        const supabaseAdmin = createAdminClient();

        const { error: deletePendingError } = await supabaseAdmin
            .from('user_two_factor_factors')
            .delete()
            .eq('user_id', user.id)
            .is('verified_at', null);

        if (deletePendingError) {
            throw deletePendingError;
        }

        const { data, error } = await supabaseAdmin
            .from('user_two_factor_factors')
            .insert({
                user_id: user.id,
                friendly_name: friendlyName,
                secret_ciphertext: encryptedSecret.ciphertext,
                secret_iv: encryptedSecret.iv,
                secret_auth_tag: encryptedSecret.authTag,
            })
            .select('id')
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            enrollment: {
                factorId: data.id,
                friendlyName,
                qrCode: qrCodeDataUrl,
                secret: enrollment.secret,
                otpauthUri: enrollment.otpauthUri,
            },
        });
    } catch (error: any) {
        console.error('[two-factor-enroll]', error);
        return NextResponse.json(
            { error: error.message || 'Could not start two-factor setup.' },
            { status: 500 }
        );
    }
}
