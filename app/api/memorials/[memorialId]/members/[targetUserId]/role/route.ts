// app/api/memorials/[memorialId]/members/[targetUserId]/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';

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

        // 1. Verify caller is Owner
        const { data: memorial } = await supabaseAdmin
            .from('memorials').select('user_id').eq('id', memorialId).single();

        if (memorial?.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Prevent changing own role
        if (targetUserId === user.id) {
            return NextResponse.json({ error: 'Cannot change the owner role' }, { status: 400 });
        }

        // 3. Update Role
        const { error } = await supabaseAdmin
            .from('user_memorial_roles')
            .update({ role: newRole })
            .eq('memorial_id', memorialId)
            .eq('user_id', targetUserId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}