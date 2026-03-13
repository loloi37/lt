import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate the user
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { fromId, toId, type, description } = await request.json();

        if (!fromId || !toId || !type) {
            return NextResponse.json({ error: 'Missing IDs or type' }, { status: 400 });
        }

        // 2. Verify ownership of the source memorial
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('user_id')
            .eq('id', fromId)
            .single();

        if (!memorial || memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden: You do not own this archive' }, { status: 403 });
        }

        // 3. Create the forward link (A -> B) — simple relational insert
        const { error: error1 } = await supabaseAdmin
            .from('memorial_relations')
            .insert([{
                from_memorial_id: fromId,
                to_memorial_id: toId,
                relationship_type: type,
                ...(description ? { description } : {}),
            }]);

        if (error1) throw error1;

        // 4. Create the reverse link (B -> A)
        let reverseType = 'other';
        if (type === 'parent') reverseType = 'child';
        if (type === 'child') reverseType = 'parent';
        if (type === 'spouse') reverseType = 'spouse';
        if (type === 'sibling') reverseType = 'sibling';

        await supabaseAdmin
            .from('memorial_relations')
            .insert([{
                from_memorial_id: toId,
                to_memorial_id: fromId,
                relationship_type: reverseType,
                ...(description ? { description } : {}),
            }]);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Link API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
