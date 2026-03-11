import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        // 1. AUTHENTICATE THE USER
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { fromId, toId, type, description, sourceHandle, targetHandle } = await request.json();

        if (!fromId || !toId || !type) {
            return NextResponse.json({ error: 'Missing IDs or type' }, { status: 400 });
        }

        // 2. VERIFY OWNERSHIP OF THE SOURCE MEMORIAL
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('user_id')
            .eq('id', fromId)
            .single();

        if (!memorial || memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden: You do not own this archive' }, { status: 403 });
        }

        // 3. Create the forward link (A -> B)
        const { error: error1 } = await supabaseAdmin
            .from('memorial_relations')
            .insert([{
                from_memorial_id: fromId,
                to_memorial_id: toId,
                relationship_type: type,
                ...(description ? { description } : {}),
                ...(sourceHandle ? { source_handle: sourceHandle } : {}),
                ...(targetHandle ? { target_handle: targetHandle } : {}),
            }]);

        if (error1) throw error1;

        // 4. Automatically create the reverse link (B -> A)
        let reverseType = 'other';
        if (type === 'parent') reverseType = 'child';
        if (type === 'child') reverseType = 'parent';
        if (type === 'spouse') reverseType = 'spouse';
        if (type === 'sibling') reverseType = 'sibling';

        // Flip handles for reverse: source↔target, swap -src↔-tgt suffixes
        const reverseSourceHandle = targetHandle ? targetHandle.replace('-tgt', '-src') : undefined;
        const reverseTargetHandle = sourceHandle ? sourceHandle.replace('-src', '-tgt') : undefined;

        const { error: error2 } = await supabaseAdmin
            .from('memorial_relations')
            .insert([{
                from_memorial_id: toId,
                to_memorial_id: fromId,
                relationship_type: reverseType,
                ...(description ? { description } : {}),
                ...(reverseSourceHandle ? { source_handle: reverseSourceHandle } : {}),
                ...(reverseTargetHandle ? { target_handle: reverseTargetHandle } : {}),
            }]);

        // Note: We don't throw on error2 in case it already exists

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Link API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
