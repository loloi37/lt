import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getContributorInvitationEmail } from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { memorialId, inviterName, emails, personalMessage, deceasedName } = await request.json();

        if (!memorialId || !emails || emails.length === 0 || !inviterName) {
            return NextResponse.json({ error: 'Missing required fields: memorialId, inviterName, or emails' }, { status: 400 });
        }

        const results = [];

        for (const email of emails) {
            // 1. Create invitation record
            const { data: invitation, error: dbError } = await supabaseAdmin
                .from('witness_invitations')
                .insert([{
                    memorial_id: memorialId,
                    inviter_name: inviterName,
                    invitee_email: email,
                    personal_message: personalMessage,
                    role: 'contributor' // Changed from 'witness'
                }])
                .select()
                .single();

            if (dbError) {
                console.error(`DB Error for ${email}:`, dbError);
                continue;
            }

            // 2. Construct link
            const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
            const host = request.headers.get('host');
            const inviteLink = `${protocol}://${host}/invitation/accept/${invitation.id}`;

            // 3. Send email with warm contributor language
            await resend.emails.send({
                from: 'Legacy Vault <onboarding@resend.dev>',
                to: [email],
                subject: `You're invited to contribute to ${deceasedName || 'a loved one'}'s memorial`,
                html: getContributorInvitationEmail(inviterName, deceasedName || 'a loved one', inviteLink, personalMessage),
            });

            results.push({ email, status: 'sent' });
        }

        return NextResponse.json({ success: true, dispatched: results.length });

    } catch (error: any) {
        console.error('Invitation API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
