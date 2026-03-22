import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

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

        // 3. Authenticated user join path
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

        // 4. Update last_visited_at on the new role
        await supabaseAdmin
            .from('user_memorial_roles')
            .update({ last_visited_at: new Date().toISOString() })
            .eq('user_id', user!.id)
            .eq('memorial_id', data.memorial_id);

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
    // Verify the contribution exists and is verified
    const { data: contribution } = await supabaseAdmin
        .from('memorial_contributions')
        .select('id, memorial_id, contributor_verified')
        .eq('id', contributionId)
        .single();

    if (!contribution?.contributor_verified) {
        return NextResponse.json(
            { error: 'Contribution not verified.' },
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
        role: 'witness',
        plan: 'personal',
        isAnonymous: true
    });
}