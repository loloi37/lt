// app/api/memorials/[memorialId]/members/[targetUserId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';
import { removeFamilyCoGuardianAccess } from '@/lib/familyWorkspace';

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

        // 1. Check if caller is Owner (Only owners can remove members)
        const { data: memorial } = await supabaseAdmin
            .from('memorials').select('user_id').eq('id', memorialId).single();

        if (memorial?.user_id !== user.id) {
            return NextResponse.json({ error: 'Only the archive owner can remove members' }, { status: 403 });
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

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
