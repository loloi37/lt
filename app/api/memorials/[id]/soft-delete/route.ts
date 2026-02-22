import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PATCH /api/memorials/[id]/soft-delete
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { action } = await request.json(); // 'delete' | 'restore'

    if (!id) {
        return NextResponse.json({ error: 'Missing memorial id' }, { status: 400 });
    }

    const updates =
        action === 'restore'
            ? { deleted: false, deleted_at: null }
            : { deleted: true, deleted_at: new Date().toISOString() };

    const { error } = await supabaseAdmin
        .from('memorials')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('soft-delete error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
