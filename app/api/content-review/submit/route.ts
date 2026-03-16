import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { memorialId, userId } = await req.json();

        if (!memorialId || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify ownership
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('id, user_id')
            .eq('id', memorialId)
            .single();

        if (!memorial || memorial.user_id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        try {
            await supabaseAdmin.from('content_reviews').upsert({
                memorial_id: memorialId,
                status: 'approved', // Auto-approve for now (placeholder)
                submitted_at: new Date().toISOString(),
                reviewed_at: new Date().toISOString(),
                flagged_items: [],
            }, { onConflict: 'memorial_id' });
        } catch {
            // Table may not exist yet
        }

        return NextResponse.json({
            status: 'approved',
            message: 'Content review approved. Ready for preservation.',
        });
    } catch (error: any) {
        console.error('Content review error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
