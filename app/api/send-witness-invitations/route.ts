import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getWitnessInvitationEmail } from '@/lib/email/templates';
import { sendEmail } from '@/lib/email/sender';


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

        // Fetch the memorial's mode to determine the plan
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('mode')
            .eq('id', memorialId)
            .single();

        const plan = memorial?.mode === 'family' ? 'family' : 'personal';

        const results = [];

        for (const email of emails) {
            // 1. Create invitation record in Supabase
            const { data: invitation, error: dbError } = await supabaseAdmin
                .from('witness_invitations')
                .insert([{
                    memorial_id: memorialId,
                    inviter_name: inviterName,
                    invitee_email: email,
                    personal_message: personalMessage,
                    role: 'witness',
                    plan: plan
                }])
                .select()
                .single();

            if (dbError) {
                console.error(`DB Error for ${email}:`, dbError);
                continue;
            }

            // 2. Construct link — now pointing to the new flow
            const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
            const host = request.headers.get('host');
            const inviteLink = `${protocol}://${host}/invite/${invitation.id}`;

            // 3. Send email
            await sendEmail({
                to: email,
                subject: `An invitation to bear witness for ${deceasedName || 'a loved one'}`,
                html: getWitnessInvitationEmail(inviterName, deceasedName || 'a loved one', inviteLink, personalMessage),
            });


            results.push({ email, status: 'sent' });
        }

        return NextResponse.json({ success: true, dispatched: results.length });

    } catch (error: any) {
        console.error('Invitation API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}