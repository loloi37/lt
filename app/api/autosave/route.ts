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

        const { memorialId, stories, media, timeline, network, letters } = body;

        if (!memorialId) {
            // Create a new memorial — always starts in 'creating' state
            // SECURITY: Never trust client-provided state values
            const { data: newMemorial, error: insertError } = await supabase
                .from('memorials')
                .insert({
                    user_id: user.id,
                    state: 'creating',
                    slug: `memorial-${Date.now()}`,
                    stories, media, timeline, network, letters,
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (insertError) {
                console.error('Autosave API insert error:', insertError);
                return NextResponse.json({ error: insertError.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, memorialId: newMemorial.id });
        }

        // 3. Update using the SECURE client (respects RLS)
        // Extra `.eq('user_id', user.id)` ensures only the owner can update
        const { error } = await supabase
            .from('memorials')
            .update({
                stories, media, timeline, network, letters,
                updated_at: new Date().toISOString(),
            })
            .eq('id', memorialId)
            .eq('user_id', user.id);

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