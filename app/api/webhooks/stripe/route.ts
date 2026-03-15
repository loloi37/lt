// app/api/webhooks/stripe/route.ts
// Stripe sends payment events here to guarantee DB updates even if the user's browser closes.
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
        return NextResponse.json({ error: 'Missing stripe signature or webhook secret' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        // This verifies the request 100% came from Stripe
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle successful payment events
    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
        const session = event.data.object as any;

        // Extract the memorial ID from payment metadata
        const memorialId = session.metadata?.memorialId;

        if (!memorialId) {
            console.error('[Stripe Webhook] No memorialId found in metadata');
            return NextResponse.json({ received: true });
        }

        console.log(`[Stripe Webhook] Payment succeeded for memorial: ${memorialId}`);

        // 1. Fetch current memorial to check its state
        const { data: currentMemorial } = await supabaseAdmin
            .from('memorials')
            .select('*')
            .eq('id', memorialId)
            .single();

        if (!currentMemorial) {
            console.error(`[Stripe Webhook] Memorial ${memorialId} not found`);
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // 2. Build the update payload — single preservation payment model
        const updatePayload: Record<string, any> = {
            state: 'live',
            payment_confirmed_at: new Date().toISOString(),
            refund_eligible: true,
        };

        // 3. Update the database securely
        const { error: updateError } = await supabaseAdmin
            .from('memorials')
            .update(updatePayload)
            .eq('id', memorialId);

        if (updateError) {
            console.error('[Stripe Webhook] DB Update Error:', updateError);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        // 4. Create a Version Snapshot for the audit trail
        await supabaseAdmin.from('memorial_versions').insert({
            memorial_id: memorialId,
            version_number: 1,
            snapshot_data: { ...currentMemorial, ...updatePayload },
            is_full_snapshot: true,
            change_type: 'manual',
            change_summary: 'Archive preserved — payment confirmed',
            change_reason: 'stripe_payment_success',
            created_by: currentMemorial.user_id,
            created_by_name: 'System (Stripe)',
            created_at: new Date().toISOString(),
        });

        console.log(`[Stripe Webhook] Successfully preserved memorial ${memorialId}`);
    }

    return NextResponse.json({ received: true });
}
