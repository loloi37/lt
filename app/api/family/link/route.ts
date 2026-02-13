import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { fromId, toId, type } = await request.json();

        if (!fromId || !toId || !type) {
            return NextResponse.json({ error: 'Missing IDs or type' }, { status: 400 });
        }

        // 1. Create the forward link (A -> B)
        const { error: error1 } = await supabaseAdmin
            .from('memorial_relations')
            .insert([{
                from_memorial_id: fromId,
                to_memorial_id: toId,
                relationship_type: type
            }]);

        if (error1) throw error1;

        // 2. Automatically create the reverse link (B -> A)
        // We infer the reverse type logic
        let reverseType = 'other';
        if (type === 'parent') reverseType = 'child';
        if (type === 'child') reverseType = 'parent';
        if (type === 'spouse') reverseType = 'spouse';
        if (type === 'sibling') reverseType = 'sibling';

        const { error: error2 } = await supabaseAdmin
            .from('memorial_relations')
            .insert([{
                from_memorial_id: toId,
                to_memorial_id: fromId,
                relationship_type: reverseType
            }]);

        // Note: We don't throw on error2 just in case it already exists, 
        // but ideally we handle duplicates gracefully.

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Link API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}