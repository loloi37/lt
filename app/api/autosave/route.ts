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
            // Fallback: create a new memorial if no ID provided
            // SECURITY: Force draft mode on creation. Only a successful payment can change mode.
            // Never trust body.mode — a malicious user could set 'family' for free.
            const mode = 'draft';
            const { data: newMemorial, error: insertError } = await supabase
                .from('memorials')
                .insert({
                    user_id: user.id,
                    status: 'draft',
                    mode,
                    slug: `draft-${Date.now()}`,
                    paid: false,
                    step1, step2, step3, step4, step5, step6, step7, step8, step9,
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (insertError) {
                console.error('Autosave API insert error:', insertError);
                return NextResponse.json({ error: insertError.message }, { status: 500 });
            }

            // Sync owner identity into user_memorial_roles so RLS policies
            // that check this table will correctly recognise the owner.
            await supabase
                .from('user_memorial_roles')
                .upsert({
                    user_id: user.id,
                    memorial_id: newMemorial.id,
                    role: 'owner',
                    joined_at: new Date().toISOString(),
                }, { onConflict: 'user_id,memorial_id' });

            return NextResponse.json({ success: true, memorialId: newMemorial.id });
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