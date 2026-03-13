import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST: Create a new "Letter to the Future"
 * Stores a message to be delivered to a recipient on a future date.
 */
export async function POST(request: NextRequest) {
    try {
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { memorialId, message, recipientEmail, recipientName, deliveryDate } = await request.json();

        if (!memorialId || !message || !recipientEmail || !deliveryDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate delivery date is in the future
        const delivery = new Date(deliveryDate);
        if (delivery <= new Date()) {
            return NextResponse.json({ error: 'Delivery date must be in the future' }, { status: 400 });
        }

        // Verify memorial ownership
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('user_id')
            .eq('id', memorialId)
            .single();

        if (!memorial || memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Memorial not found or access denied' }, { status: 403 });
        }

        // Store the letter
        const { data: letter, error: insertError } = await supabaseAdmin
            .from('future_letters')
            .insert([{
                memorial_id: memorialId,
                user_id: user.id,
                message,
                recipient_email: recipientEmail,
                recipient_name: recipientName || '',
                delivery_date: deliveryDate,
                status: 'scheduled',
            }])
            .select()
            .single();

        if (insertError) throw insertError;

        return NextResponse.json({
            success: true,
            letter: {
                id: letter.id,
                recipientName: letter.recipient_name,
                deliveryDate: letter.delivery_date,
                status: letter.status,
            },
        });

    } catch (error: any) {
        console.error('Letter creation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET: Retrieve all letters for a memorial
 */
export async function GET(request: NextRequest) {
    try {
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const memorialId = request.nextUrl.searchParams.get('memorialId');

        if (!memorialId) {
            return NextResponse.json({ error: 'Memorial ID is required' }, { status: 400 });
        }

        // Verify ownership
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('user_id')
            .eq('id', memorialId)
            .single();

        if (!memorial || memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        const { data: letters, error } = await supabaseAdmin
            .from('future_letters')
            .select('id, recipient_name, recipient_email, delivery_date, status, created_at')
            .eq('memorial_id', memorialId)
            .order('delivery_date', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ letters: letters || [] });

    } catch (error: any) {
        console.error('Letter fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
