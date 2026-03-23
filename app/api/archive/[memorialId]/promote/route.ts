import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest, { params }: { params: Promise<{ memorialId: string }> }) {
    try {
        const { memorialId } = await params;
        const { witnessUserId } = await req.json(); // The ID of the person to promote
        const { user } = await createAuthenticatedClient();

        // 1. Check if the requester is the OWNER
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('user_id')
            .eq('id', memorialId)
            .single();

        if (memorial?.user_id !== user?.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Promote the user to co_guardian
        const { error } = await supabaseAdmin
            .from('user_memorial_roles')
            .update({ role: 'co_guardian' })
            .eq('user_memorial_roles.memorial_id', memorialId)
            .eq('user_id', witnessUserId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}