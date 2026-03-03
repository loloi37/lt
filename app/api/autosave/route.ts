import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate the user making the request
        const { supabase, user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse the body
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

        // 3. Update using the SECURE client (This will respect your SQL RLS Rules)
        // We also add `.eq('user_id', user.id)` as an extra layer of absolute security
        const { error } = await supabase
            .from('memorials')
            .update({
                step1, step2, step3, step4, step5, step6, step7, step8, step9,
                updated_at: new Date().toISOString(),
            })
            .eq('id', memorialId)
            .eq('user_id', user.id); // ONLY update if the logged-in user is the owner

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