import { NextRequest, NextResponse } from 'next/server';
import { requireUser, getSupabaseAdmin } from '@/lib/apiAuth';
import { safeLogMemorialActivity } from '@/lib/activityLog';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        // AUTH: Require an authenticated user
        const auth = await requireUser();
        if (!auth.ok) return auth.response;

        const { user } = auth;
        const admin = getSupabaseAdmin();

        // Fetch the invitation to verify the user is the invitee or the memorial owner
        const { data: invitation, error: fetchError } = await admin
            .from('witness_invitations')
            .select('id, invitee_email, memorial_id, status')
            .eq('id', token)
            .eq('status', 'pending')
            .maybeSingle();

        if (fetchError || !invitation) {
            return NextResponse.json({ error: 'Invitation not found or already resolved' }, { status: 404 });
        }

        // Verify the user is either the invitee (by email) or the memorial owner
        const isInvitee = user.email?.toLowerCase() === invitation.invitee_email?.toLowerCase();

        if (!isInvitee) {
            // Check if they are the memorial owner
            const { data: memorial } = await admin
                .from('memorials')
                .select('user_id')
                .eq('id', invitation.memorial_id)
                .single();

            if (!memorial || memorial.user_id !== user.id) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        const { error } = await admin
            .from('witness_invitations')
            .update({ status: 'declined' })
            .eq('id', token)
            .eq('status', 'pending');

        if (error) throw error;

        await safeLogMemorialActivity(admin, {
            memorialId: invitation.memorial_id,
            action: 'invite_cancelled',
            summary: `Invitation declined for ${invitation.invitee_email}.`,
            actorUserId: user.id,
            actorEmail: user.email ?? null,
            subjectEmail: invitation.invitee_email,
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[decline/route]', err);
        return NextResponse.json(
            { error: 'Failed to decline' },
            { status: 500 }
        );
    }
}
