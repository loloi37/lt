// app/api/memorials/[memorialId]/members/[targetUserId]/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';
import {
    syncCoGuardianAcrossOwnerFamily,
    updateFamilyCoGuardianRole,
} from '@/lib/familyWorkspace';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string, targetUserId: string }> }
) {
    try {
        const { memorialId, targetUserId } = await params;
        const { newRole } = await req.json();
        const { user } = await createAuthenticatedClient();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const VALID_ROLES = ['co_guardian', 'witness', 'reader'];
        if (!VALID_ROLES.includes(newRole)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // 1. Verify caller is Owner
        const { data: memorial } = await supabaseAdmin
            .from('memorials').select('user_id, mode').eq('id', memorialId).single();

        if (memorial?.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Prevent changing own role
        if (targetUserId === user.id) {
            return NextResponse.json({ error: 'Cannot change the owner role' }, { status: 400 });
        }

        if (newRole === 'co_guardian' && memorial?.mode !== 'family') {
            return NextResponse.json({ error: 'Co-Guardian is a Family plan role only' }, { status: 403 });
        }

        const { data: currentRoleRow } = await supabaseAdmin
            .from('user_memorial_roles')
            .select('role')
            .eq('memorial_id', memorialId)
            .eq('user_id', targetUserId)
            .maybeSingle();

        const isFamilyMemorial = memorial?.mode === 'family';
        const isFamilyWideCoGuardianChange =
            isFamilyMemorial
            && (newRole === 'co_guardian' || currentRoleRow?.role === 'co_guardian');

        if (isFamilyWideCoGuardianChange) {
            if (newRole === 'co_guardian') {
                await syncCoGuardianAcrossOwnerFamily(memorial.user_id, targetUserId);
            } else {
                await updateFamilyCoGuardianRole(
                    memorial.user_id,
                    targetUserId,
                    newRole as 'witness' | 'reader'
                );
            }
        } else {
            const { error } = await supabaseAdmin
                .from('user_memorial_roles')
                .update({ role: newRole })
                .eq('memorial_id', memorialId)
                .eq('user_id', targetUserId);

            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
