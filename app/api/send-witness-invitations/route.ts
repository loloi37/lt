import { NextRequest, NextResponse } from 'next/server';
import { getWitnessInvitationEmail } from '@/lib/email/templates';
import { sendEmail } from '@/lib/email/sender';
import { requireMemorialAccess } from '@/lib/apiAuth';
import { safeLogMemorialActivity } from '@/lib/activityLog';

export async function POST(request: NextRequest) {
    try {
        const { memorialId, inviterName, emails, personalMessage, deceasedName } = await request.json();

        if (!memorialId || !emails || emails.length === 0 || !inviterName) {
            return NextResponse.json({ error: 'Missing required fields: memorialId, inviterName, or emails' }, { status: 400 });
        }

        // AUTH: Derive identity from session, enforce invite_member permission
        const access = await requireMemorialAccess({
            memorialId,
            action: 'invite_member',
        });
        if (!access.ok) return access.response;

        const { user, admin, context } = access;

        const results = [];

        for (const email of emails) {
            // Check for existing pending invitation to prevent duplicates
            const { data: existingInvite } = await admin
                .from('witness_invitations')
                .select('id')
                .eq('memorial_id', memorialId)
                .eq('invitee_email', email)
                .eq('status', 'pending')
                .maybeSingle();

            if (existingInvite) {
                results.push({ email, status: 'already_pending' });
                continue;
            }

            // Check if user is already a member (has existing role)
            const { data: authUser } = await admin.auth.admin.getUserByEmail(email);
            if (authUser?.user) {
                const { data: existingRole } = await admin
                    .from('user_memorial_roles')
                    .select('role')
                    .eq('memorial_id', memorialId)
                    .eq('user_id', authUser.user.id)
                    .maybeSingle();

                if (existingRole) {
                    results.push({ email, status: 'already_member' });
                    continue;
                }
            }

            // Create invitation record
            const { data: invitation, error: dbError } = await admin
                .from('witness_invitations')
                .insert([{
                    memorial_id: memorialId,
                    inviter_name: inviterName,
                    invitee_email: email,
                    personal_message: personalMessage,
                    role: 'witness',
                    plan: context.plan,
                }])
                .select()
                .single();

            if (dbError) {
                console.error(`DB Error for ${email}:`, dbError);
                continue;
            }

            // Construct link
            const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
            const host = request.headers.get('host');
            const inviteLink = `${protocol}://${host}/invite/${invitation.id}`;

            // Send email
            await sendEmail({
                to: email,
                subject: `An invitation to bear witness for ${deceasedName || 'a loved one'}`,
                html: getWitnessInvitationEmail(inviterName, deceasedName || 'a loved one', inviteLink, personalMessage),
            });

            await safeLogMemorialActivity(admin, {
                memorialId,
                action: 'invite_sent',
                summary: `Invitation sent to ${email} as witness.`,
                actorUserId: user.id,
                actorEmail: user.email ?? null,
                subjectEmail: email,
            });

            results.push({ email, status: 'sent' });
        }

        return NextResponse.json({ success: true, dispatched: results.length });

    } catch (error: any) {
        console.error('Invitation API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
