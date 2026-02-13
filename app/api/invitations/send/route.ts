import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getWitnessInvitationEmail } from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { memorialId, inviterName, inviteeEmail, personalMessage, role, deceasedName } = await request.json();

        if (!memorialId || !inviteeEmail || !inviterName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create invitation record in Supabase to get a unique ID (Token)
        const { data: invitation, error: dbError } = await supabaseAdmin
            .from('witness_invitations')
            .insert([{
                memorial_id: memorialId,
                inviter_name: inviterName,
                invitee_email: inviteeEmail,
                personal_message: personalMessage,
                role: role || 'witness'
            }])
            .select()
            .single();

        if (dbError) throw dbError;

        // 2. Construct the absolute link for the witness
        // In production, change this to your real domain
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = request.headers.get('host');
        const inviteLink = `${protocol}://${host}/invitation/accept/${invitation.id}`;

        // 3. Send the email via Resend
        const { data, error: mailError } = await resend.emails.send({
            from: 'Legacy Vault <onboarding@resend.dev>', // Note: Use your domain here once verified in Resend
            to: [inviteeEmail],
            subject: `An invitation to bear witness for ${deceasedName}`,
            html: getWitnessInvitationEmail(inviterName, deceasedName, inviteLink, personalMessage),
        });

        if (mailError) throw mailError;

        return NextResponse.json({ success: true, invitationId: invitation.id });

    } catch (error: any) {
        console.error('Invitation API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}