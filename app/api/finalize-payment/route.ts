import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const { memorialId } = await request.json();

        if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
            console.error('[Finalize Payment] Invalid memorial ID:', memorialId);
            return NextResponse.json({
                error: 'Invalid memorial ID. Please create an archive first.'
            }, { status: 400 });
        }

        console.log('[Finalize Payment] Starting for memorial:', memorialId);

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Fetch current memorial
        const { data: currentMemorial, error: fetchError } = await supabaseAdmin
            .from('memorials')
            .select('state, user_id')
            .eq('id', memorialId)
            .single();

        if (fetchError || !currentMemorial) {
            console.error('Memorial not found:', fetchError);
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // Single state transition: creating/private -> live
        const { error: updateError } = await supabaseAdmin
            .from('memorials')
            .update({
                state: 'live',
                paid: true,
                payment_confirmed_at: new Date().toISOString(),
            })
            .eq('id', memorialId);

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        console.log('[Finalize Payment] Memorial state set to live:', memorialId);

        return NextResponse.json({
            success: true,
            message: 'Payment finalized — memorial is now live',
            state: 'live',
        });

    } catch (error: any) {
        console.error('Finalize payment error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
