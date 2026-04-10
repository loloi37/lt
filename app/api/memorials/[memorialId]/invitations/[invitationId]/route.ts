import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { hasPermission, resolveArchivePermissionContext } from '@/lib/archivePermissions';
import { safeLogMemorialActivity } from '@/lib/activityLog';
import { getSupabaseAdmin } from '@/lib/apiAuth';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string; invitationId: string }> }
) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { memorialId, invitationId } = await params;
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const permission = await resolveArchivePermissionContext(
            supabaseAdmin,
            memorialId,
            user.id
        );

        if (!permission.memorialExists || !permission.context) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (!hasPermission(permission.context, 'invite_member')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { data: invitation } = await supabaseAdmin
            .from('witness_invitations')
            .select('id, status, memorial_id')
            .eq('id', invitationId)
            .maybeSingle();

        if (!invitation || invitation.memorial_id !== memorialId) {
            return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
        }

        if (invitation.status !== 'pending') {
            return NextResponse.json(
                { error: 'Only pending invitations can be cancelled' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('witness_invitations')
            .delete()
            .eq('id', invitationId);

        if (error) {
            throw error;
        }

        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId,
            action: 'invite_cancelled',
            summary: `Pending invitation for ${invitationId} was cancelled.`,
            actorUserId: user.id,
            actorEmail: user.email ?? null,
            details: {
                invitationId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
