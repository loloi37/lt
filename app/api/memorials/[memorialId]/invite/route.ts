// app/api/memorials/[memorialId]/invite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireMemorialAccess } from '@/lib/apiAuth';
import { sendEmail } from '@/lib/email/sender';
import { getWitnessInvitationEmail } from '@/lib/email/templates';
import { WitnessRole } from '@/types/roles';
import { safeLogMemorialActivity } from '@/lib/activityLog';
import { INVITATION_EXPIRATION_DAYS } from '@/lib/constants';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string }> }
) {
    try {
        const { memorialId } = await params;

        const { email, role, personalMessage } = await req.json();
        const normalizedEmail = String(email || '').trim().toLowerCase();

        // 1. VALIDATE INPUTS
        const VALID_ROLES: WitnessRole[] = ['witness', 'co_guardian', 'reader'];
        if (!VALID_ROLES.includes(role as WitnessRole)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        if (!normalizedEmail || !normalizedEmail.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // 2. AUTH + AUTHORIZATION (centralized)
        const access = await requireMemorialAccess({
            memorialId,
            action: 'invite_member',
        });

        if (!access.ok) return access.response;

        const { user, admin, context } = access;

        // Fetch memorial for metadata needed for email and constraints
        const { data: memorial } = await admin
            .from('memorials')
            .select('user_id, mode, full_name')
            .eq('id', memorialId)
            .single();

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (normalizedEmail === user.email?.toLowerCase()) {
            return NextResponse.json({ error: 'You already have access to this archive.' }, { status: 400 });
        }

        // 3. ROLE CONSTRAINTS
        if (role === 'co_guardian' && context.plan !== 'family') {
            return NextResponse.json({ error: 'Co-Guardian is a Family plan role only.' }, { status: 403 });
        }

        const { data: existingMembers } = await admin
            .from('user_memorial_roles')
            .select('user_id, role')
            .eq('memorial_id', memorialId);

        if (existingMembers?.length) {
            for (const member of existingMembers) {
                const { data: authUser } = await admin.auth.admin.getUserById(member.user_id);
                if (authUser.user?.email?.toLowerCase() === normalizedEmail) {
                    return NextResponse.json(
                        { error: `This person already has archive access as ${member.role}.` },
                        { status: 400 }
                    );
                }
            }
        }

        // 4. UPSERT LOGIC
        const expiresAt = new Date(
            Date.now() + INVITATION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
        ).toISOString();

        const { data: existingInvite } = await admin
            .from('witness_invitations')
            .select('id')
            .eq('memorial_id', memorialId)
            .eq('invitee_email', normalizedEmail)
            .eq('status', 'pending')
            .maybeSingle();

        let invitationId: string;

        if (existingInvite) {
            const { data: updated, error: updateError } = await admin
                .from('witness_invitations')
                .update({
                    role,
                    personal_message: personalMessage,
                    expires_at: expiresAt,
                    inviter_name: user.email
                })
                .eq('id', existingInvite.id)
                .select()
                .single();

            if (updateError) throw updateError;
            invitationId = updated.id;
        } else {
            const { data: created, error: insertError } = await admin
                .from('witness_invitations')
                .insert({
                    memorial_id: memorialId,
                    inviter_name: user.email,
                    invitee_email: normalizedEmail,
                    role,
                    personal_message: personalMessage,
                    plan: context.plan,
                    expires_at: expiresAt
                })
                .select()
                .single();

            if (insertError) throw insertError;
            invitationId = created.id;
        }

        // 5. SEND EMAIL
        const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invitationId}`;

        await sendEmail({
            to: normalizedEmail,
            subject: `An invitation to bear witness for ${memorial.full_name || 'a loved one'}`,
            html: getWitnessInvitationEmail(
                user.email!,
                memorial.full_name || 'their loved one',
                inviteLink,
                personalMessage
            )
        });

        await safeLogMemorialActivity(admin, {
            memorialId,
            action: 'invite_sent',
            summary: `Invitation sent to ${normalizedEmail} as ${role}.`,
            actorUserId: user.id,
            actorEmail: user.email ?? null,
            subjectEmail: normalizedEmail,
            details: {
                role,
                invitationId,
            },
        });

        return NextResponse.json({ success: true, invitationId });

    } catch (error: any) {
        console.error('[INVITE_API_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
