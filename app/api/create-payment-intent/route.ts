// app/api/create-payment-intent/route.ts
// Create a PaymentIntent for Stripe Elements (Preservation Gate payment)
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { memorialId, amount = 1470, plan = 'personal' } = await request.json();

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
        }

        // Verify authorization exists
        const { data: auth } = await supabaseAdmin
            .from('memorial_authorizations')
            .select('id, authorization_type')
            .eq('memorial_id', memorialId)
            .in('status', ['pending', 'approved'])
            .maybeSingle();

        if (!auth) {
            return NextResponse.json({
                error: 'Authorization required before payment',
                code: 'LEGAL_AUTH_REQUIRED',
            }, { status: 403 });
        }

        // Fetch memorial details
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('full_name, state')
            .eq('id', memorialId)
            .single();

        const fullName = memorial?.full_name || 'Memorial Archive';

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects cents
            currency: 'usd',
            description: `Legacy Vault — Permanent Archive for ${fullName}`,
            metadata: {
                memorialId,
                plan,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            amount,
            fullName,
        });
    } catch (error: any) {
        console.error('PaymentIntent error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
