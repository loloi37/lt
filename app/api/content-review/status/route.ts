import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    const memorialId = req.nextUrl.searchParams.get('memorialId');

    if (!memorialId) {
        return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
    }

    try {
        const { data } = await supabaseAdmin
            .from('content_reviews')
            .select('*')
            .eq('memorial_id', memorialId)
            .single();

        if (!data) {
            return NextResponse.json({
                status: 'not_submitted',
                submittedAt: null,
                reviewedAt: null,
                flaggedItems: [],
            });
        }

        return NextResponse.json({
            status: data.status,
            submittedAt: data.submitted_at,
            reviewedAt: data.reviewed_at,
            flaggedItems: data.flagged_items || [],
        });
    } catch {
        return NextResponse.json({
            status: 'not_submitted',
            submittedAt: null,
            reviewedAt: null,
            flaggedItems: [],
        });
    }
}
