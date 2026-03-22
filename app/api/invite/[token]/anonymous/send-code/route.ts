import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(
    process.env.RESEND_API_KEY
);

export async function POST(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }

        // Generate 6-digit code
        const code = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const expires = new Date(
            Date.now() + 15 * 60 * 1000 // 15 minutes
        );

        // Store code in a temporary contribution
        // record (unverified)
        await supabaseAdmin
            .from('memorial_contributions')
            .insert({
                memorial_id: await getMemorialId(
                    params.token
                ),
                witness_name: name,
                contributor_email: email,
                contributor_verified: false,
                verification_code: code,
                verification_expires_at:
                    expires.toISOString(),
                is_anonymous: true,
                type: 'memory',
                content: {},
                status: 'pending_approval'
            });

        // Send code via email
        await resend.emails.send({
            from: 'Legacy Vault <noreply@resend.dev>',
            to: [email],
            subject: 'Your verification code',
            html: `
        <div style="font-family: Georgia, serif; 
          max-width: 400px; margin: 0 auto; 
          padding: 40px;">
          <p style="font-size: 16px; 
            color: #5a6b78;">
            Your verification code is:
          </p>
          <p style="font-size: 48px; 
            font-weight: bold; 
            letter-spacing: 12px; 
            color: #1a1a1a; 
            margin: 20px 0;">
            ${code}
          </p>
          <p style="font-size: 13px; 
            color: #9a9a9a;">
            This code expires in 15 minutes.
          </p>
        </div>
      `
        });

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('[AnonSendCode]', err);
        return NextResponse.json(
            { error: 'Failed to send code' },
            { status: 500 }
        );
    }
}

async function getMemorialId(
    token: string
): Promise<string> {
    const { data } = await supabaseAdmin
        .from('witness_invitations')
        .select('memorial_id')
        .eq('id', token)
        .single();
    return data?.memorial_id;
}