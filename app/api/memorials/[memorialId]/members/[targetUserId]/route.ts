// app/api/memorials/[memorialId]/members/[targetUserId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';
import { removeFamilyCoGuardianAccess } from '@/lib/familyWorkspace';
import { hasPermission, resolveArchivePermissionContext } from '@/lib/archivePermissions';
import { safeLogMemorialActivity } from '@/lib/activityLog';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string, targetUserId: string }> }
) {
    try {
        const { memorialId, targetUserId } = await params;
        const { user } = await createAuthenticatedClient();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const permission = await resolveArchivePermissionContext(
            supabaseAdmin,
            memorialId,
            user.id
        );

        if (!permission.memorialExists || !permission.context) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (!hasPermission(permission.context, 'manage_members')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Prevent removing self (The owner must exist)
        if (targetUserId === user.id) {
            return NextResponse.json({ error: 'You cannot remove yourself as owner' }, { status: 400 });
        }

        const { data: memorialWithMode } = await supabaseAdmin
            .from('memorials')
            .select('user_id, mode')
            .eq('id', memorialId)
            .single();

        const { data: targetRole } = await supabaseAdmin
            .from('user_memorial_roles')
            .select('role')
            .eq('memorial_id', memorialId)
            .eq('user_id', targetUserId)
            .maybeSingle();

        const shouldRemoveAcrossFamily =
            memorialWithMode?.mode === 'family'
            && targetRole?.role === 'co_guardian';

        if (shouldRemoveAcrossFamily) {
            await removeFamilyCoGuardianAccess(memorialWithMode.user_id, targetUserId);
        } else {
            const { error } = await supabaseAdmin
                .from('user_memorial_roles')
                .delete()
                .eq('memorial_id', memorialId)
                .eq('user_id', targetUserId);

            if (error) throw error;
        }

        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId,
            action: 'member_removed',
            summary: 'Archive access was revoked for a member.',
            actorUserId: user.id,
            actorEmail: user.email ?? null,
            subjectUserId: targetUserId,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
