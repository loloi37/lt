import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { syncCoGuardianAcrossOwnerFamily } from '@/lib/familyWorkspace';
import { safeLogMemorialActivity } from '@/lib/activityLog';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;


        // 1. Authenticate the user making the request
        const { user, error: authError } =
            await createAuthenticatedClient();

        // Support anonymous contributors — they pass
        // their contributionId from the OTP verify step
        const body = await req.json();
        const { contributionId } = body;

        const isAnonymous = !user && !!contributionId;

        if (!user && !isAnonymous) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Call the atomic accept_invitation DB function
        // For anonymous users, we use a simplified path
        if (isAnonymous) {
            return handleAnonymousJoin(token, contributionId);
        }

        // 3. Get invitation to verify email matches (defensive)
        const { data: invData } = await supabaseAdmin
            .from('witness_invitations')
            .select('memorial_id, invitee_email')
            .eq('id', token)
            .single();

        // Verify the user's email matches the invited email (defensive check)
        if (invData?.invitee_email && user!.email) {
            const invitedEmailLower = invData.invitee_email.toLowerCase();
            const userEmailLower = user!.email.toLowerCase();
            if (invitedEmailLower !== userEmailLower) {
                return NextResponse.json(
                    { error: 'This invitation was sent to a different email address.', code: 'EMAIL_MISMATCH' },
                    { status: 400 }
                );
            }
        }

        // Defensive: check if user is already a member before attempting join
        if (invData?.memorial_id) {
            const { data: existingMember } = await supabaseAdmin
                .from('user_memorial_roles')
                .select('role')
                .eq('memorial_id', invData.memorial_id)
                .eq('user_id', user!.id)
                .maybeSingle();

            if (existingMember) {
                return NextResponse.json(
                    { error: 'You are already a member of this archive.', code: 'ALREADY_MEMBER' },
                    { status: 400 }
                );
            }
        }

        // 4. Call the atomic accept_invitation DB function
        const { data, error } = await supabaseAdmin
            .rpc('accept_invitation', {
                p_invitation_id: token,
                p_user_id: user!.id
            });

        if (error) {
            console.error('[join/route] RPC error:', error);
            return NextResponse.json(
                { error: 'Failed to join archive' },
                { status: 500 }
            );
        }

        if (!data.success) {
            // Map DB error codes to user-friendly messages
            const errorMessages: Record<string, string> = {
                INVITATION_NOT_FOUND:
                    'This invitation does not exist.',
                INVITATION_NOT_PENDING:
                    'This invitation has already been used.',
                INVITATION_EXPIRED:
                    'This invitation has expired.'
            };

            return NextResponse.json(
                {
                    error: errorMessages[data.error]
                        || 'Could not join this archive.',
                    code: data.error
                },
                { status: 400 }
            );
        }

        if (data.role === 'co_guardian' && data.plan === 'family') {
            const { data: memorial } = await supabaseAdmin
                .from('memorials')
                .select('user_id')
                .eq('id', data.memorial_id)
                .single();

            if (memorial?.user_id) {
                await syncCoGuardianAcrossOwnerFamily(memorial.user_id, user!.id);
            }
        }

// 4. Update last_visited_at on the new role
        await supabaseAdmin
            .from('user_memorial_roles')
            .update({ last_visited_at: new Date().toISOString() })
            .eq('user_id', user!.id)
            .eq('memorial_id', data.memorial_id);

        // 5. Log the invite acceptance
        const { data: inviterData } = await supabaseAdmin
            .from('witness_invitations')
            .select('inviter_name')
            .eq('id', token)
            .single();

        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId: data.memorial_id,
            action: 'invite_accepted',
            summary: `${inviterData?.inviter_name || 'Someone'} invited this user.`,
            actorUserId: user!.id,
            actorEmail: user!.email ?? null,
            details: { role: data.role },
        });

        return NextResponse.json({
            success: true,
            memorialId: data.memorial_id,
            role: data.role,
            plan: data.plan
        });

    } catch (err: any) {
        console.error('[join/route] Exception:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Anonymous join path — simpler since no
// user_memorial_roles row is created
async function handleAnonymousJoin(
    token: string,
    contributionId: string
) {
    const [{ data: contribution }, { data: invitation }] =
        await Promise.all([
            supabaseAdmin
                .from('memorial_contributions')
                .select('id, memorial_id, contributor_verified')
                .eq('id', contributionId)
                .single(),
            supabaseAdmin
                .from('witness_invitations')
                .select('id, memorial_id, role, plan, status')
                .eq('id', token)
                .single()
        ]);

    // Verify the contribution exists and is verified
    if (!contribution?.contributor_verified) {
        return NextResponse.json(
            { error: 'Contribution not verified.' },
            { status: 400 }
        );
    }

    if (!invitation || invitation.status !== 'pending') {
        return NextResponse.json(
            { error: 'This invitation is no longer valid.' },
            { status: 400 }
        );
    }

    if (invitation.memorial_id !== contribution.memorial_id) {
        return NextResponse.json(
            { error: 'Invitation does not match this contribution.' },
            { status: 400 }
        );
    }

    // Mark invitation as accepted without a user_id
    await supabaseAdmin
        .from('witness_invitations')
        .update({ status: 'accepted' })
        .eq('id', token)
        .eq('status', 'pending'); // Only if still pending

    return NextResponse.json({
        success: true,
        memorialId: contribution.memorial_id,
        role: invitation.role,
        plan: invitation.plan || 'personal',
        isAnonymous: true
    });
}
