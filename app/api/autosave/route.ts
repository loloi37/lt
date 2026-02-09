// app/api/autosave/route.ts
// Handles sendBeacon calls when user closes the page
// This is a best-effort save — data might arrive as text/plain from sendBeacon

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side
);

export async function POST(request: NextRequest) {
    try {
        // sendBeacon sends as text/plain, regular fetch sends as application/json
        const contentType = request.headers.get('content-type') || '';
        let body: any;

        if (contentType.includes('text/plain')) {
            const text = await request.text();
            body = JSON.parse(text);
        } else {
            body = await request.json();
        }

        const { memorialId, step1, step2, step3, step4, step5, step6, step7, step8, step9 } = body;

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('memorials')
            .update({
                step1,
                step2,
                step3,
                step4,
                step5,
                step6,
                step7,
                step8,
                step9,
                updated_at: new Date().toISOString(),
            })
            .eq('id', memorialId);

        if (error) {
            console.error('Autosave API error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Autosave API exception:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}