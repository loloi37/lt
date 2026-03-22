import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const token = params.token;

        // 1. Fetch invitation + memorial data in one query
        const { data: invitation, error } = await supabaseAdmin
            .from('witness_invitations')
            .select(`
        id,
        inviter_name,
        invitee_email,
        role,
        personal_message,
        plan,
        status,
        expires_at,
        memorial_id,
        memorials!inner (
          id,
          full_name,
          birth_date,
          death_date,
          profile_photo_url,
          mode,
          deleted
        )
      `)
            .eq('id', token)
            .single();

        // 2. Invitation not found
        if (error || !invitation) {
            return NextResponse.json({
                state: 'NOT_FOUND',
                message: 'This invitation does not exist.'
            }, { status: 404 });
        }

        const memorial = (invitation as any).memorials;

        // 3. Memorial was deleted
        if (memorial?.deleted) {
            return NextResponse.json({
                state: 'MEMORIAL_DELETED',
                inviterName: invitation.inviter_name,
                message: 'The archive this invitation refers to has been removed.'
            });
        }

        // 4. Auto-expire if past expiry date
        if (
            invitation.status === 'pending' &&
            new Date(invitation.expires_at) < new Date()
        ) {
            await supabaseAdmin
                .from('witness_invitations')
                .update({ status: 'expired' })
                .eq('id', token);

            return NextResponse.json({
                state: 'EXPIRED',
                inviterName: invitation.inviter_name,
                inviteeEmail: invitation.invitee_email
            });
        }

        // 5. Already declined
        if (invitation.status === 'declined') {
            return NextResponse.json({
                state: 'DECLINED',
                inviterName: invitation.inviter_name
            });
        }

        // 6. Check if current user already has access
        let alreadyJoined = false;
        let currentUserRole = null;

        try {
            const { user } = await createAuthenticatedClient();
            if (user) {
                const { data: existingRole } = await supabaseAdmin
                    .from('user_memorial_roles')
                    .select('role')
                    .eq('user_id', user.id)
                    .eq('memorial_id', memorial.id)
                    .single();

                if (existingRole) {
                    alreadyJoined = true;
                    currentUserRole = existingRole.role;
                }
            }
        } catch {
            // Not authenticated — that is fine
        }

        // 7. Accepted by someone else
        if (
            invitation.status === 'accepted' &&
            !alreadyJoined
        ) {
            return NextResponse.json({
                state: 'USED_BY_OTHER',
                inviterName: invitation.inviter_name
            });
        }

        // 8. Already joined by current user
        if (alreadyJoined) {
            return NextResponse.json({
                state: 'ALREADY_JOINED',
                memorialId: memorial.id,
                role: currentUserRole
            });
        }

        // 9. Valid pending invitation — return full data
        return NextResponse.json({
            state: 'PENDING',
            invitation: {
                id: invitation.id,
                inviterName: invitation.inviter_name,
                inviteeEmail: invitation.invitee_email,
                role: invitation.role,
                personalMessage: invitation.personal_message,
                plan: invitation.plan,
                memorial: {
                    id: memorial.id,
                    fullName: memorial.full_name,
                    birthDate: memorial.birth_date,
                    deathDate: memorial.death_date,
                    profilePhotoUrl: memorial.profile_photo_url
                }
            }
        });

    } catch (err: any) {
        console.error('[Invite API]', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}