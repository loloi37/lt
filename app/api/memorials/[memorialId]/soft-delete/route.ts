import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PATCH /api/memorials/[memorialId]/soft-delete
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ memorialId: string }> }
) {
    try {
        const { memorialId } = await params;
        const { action } = await request.json(); // 'delete' | 'restore'

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorial id' }, { status: 400 });
        }

        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: memorial, error: fetchError } = await supabaseAdmin
            .from('memorials')
            .select('user_id, preservation_state')
            .eq('id', memorialId)
            .single();

        if (fetchError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden: You do not own this archive' }, { status: 403 });
        }

        if (action === 'delete' && memorial.preservation_state === 'preserved') {
            return NextResponse.json(
                { error: 'This archive has been permanently preserved on the blockchain and cannot be deleted.' },
                { status: 403 }
            );
        }

        const updates =
            action === 'restore'
                ? { deleted: false, deleted_at: null }
                : { deleted: true, deleted_at: new Date().toISOString() };

        const { error } = await supabaseAdmin
            .from('memorials')
            .update(updates)
            .eq('id', memorialId);

        if (error) {
            console.error('soft-delete error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Soft delete execution error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
