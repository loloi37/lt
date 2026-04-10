import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { getSupabaseAdmin } from '@/lib/apiAuth';

export async function POST(request: NextRequest) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        // 1. AUTHENTICATE THE USER
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { fromId, toId, type, description, sourceHandle, targetHandle } = await request.json();

        if (!fromId || !toId || !type) {
            return NextResponse.json({ error: 'Missing IDs or type' }, { status: 400 });
        }

        // 2. VERIFY OWNERSHIP OF THE SOURCE MEMORIAL + MODE CHECK
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('user_id, mode')
            .eq('id', fromId)
            .single();

        if (!memorial || memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden: You do not own this archive' }, { status: 403 });
        }

        if (memorial.mode !== 'family') {
            return NextResponse.json({ error: 'Relations are only available for Family plan archives' }, { status: 403 });
        }

        // 2b. VERIFY TARGET MEMORIAL IS ALSO FAMILY MODE
        const { data: targetMemorial } = await supabaseAdmin
            .from('memorials')
            .select('mode')
            .eq('id', toId)
            .single();

        if (!targetMemorial || targetMemorial.mode !== 'family') {
            return NextResponse.json({ error: 'Target archive must also be a Family plan archive' }, { status: 403 });
        }

        // 3. Create the forward link (A -> B)
        // Try with handle columns; fall back without them if columns don't exist yet
        const baseForward = {
            from_memorial_id: fromId,
            to_memorial_id: toId,
            relationship_type: type,
            ...(description ? { description } : {}),
        };

        let { error: error1 } = await supabaseAdmin
            .from('memorial_relations')
            .insert([{
                ...baseForward,
                ...(sourceHandle ? { source_handle: sourceHandle } : {}),
                ...(targetHandle ? { target_handle: targetHandle } : {}),
            }]);

        // If it fails due to unknown columns, retry without handles
        if (error1) {
            const retry = await supabaseAdmin
                .from('memorial_relations')
                .insert([baseForward]);
            if (retry.error) throw retry.error;
        }

        // 4. Automatically create the reverse link (B -> A)
        let reverseType = 'other';
        if (type === 'parent') reverseType = 'child';
        if (type === 'child') reverseType = 'parent';
        if (type === 'spouse') reverseType = 'spouse';
        if (type === 'sibling') reverseType = 'sibling';

        const reverseSourceHandle = targetHandle ? targetHandle.replace('-tgt', '-src') : undefined;
        const reverseTargetHandle = sourceHandle ? sourceHandle.replace('-src', '-tgt') : undefined;

        const baseReverse = {
            from_memorial_id: toId,
            to_memorial_id: fromId,
            relationship_type: reverseType,
            ...(description ? { description } : {}),
        };

        const { error: error2 } = await supabaseAdmin
            .from('memorial_relations')
            .insert([{
                ...baseReverse,
                ...(reverseSourceHandle ? { source_handle: reverseSourceHandle } : {}),
                ...(reverseTargetHandle ? { target_handle: reverseTargetHandle } : {}),
            }]);

        // If reverse fails with handle columns, retry without
        if (error2) {
            await supabaseAdmin
                .from('memorial_relations')
                .insert([baseReverse]);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Link API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
