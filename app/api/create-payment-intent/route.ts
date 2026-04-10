// app/api/create-payment-intent/route.ts
// Step 2.2.1: Create a PaymentIntent for Stripe Elements (on-site payment)
// This replaces the Checkout Session redirect flow for the seal flow.
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PLAN_PRICES_USD } from '@/lib/constants';
import { getSupabaseAdmin } from '@/lib/apiAuth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(request: NextRequest) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { memorialId, plan = 'personal' } = await request.json();
        // SECURITY: Never trust client-supplied amount. Derive from server-side plan pricing.
        const amount = PLAN_PRICES_USD[plan];
        if (!amount) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
        }

        // Determine expected authorization type based on plan
        const expectedAuthType = plan === 'family' ? 'account' : 'individual';

        // Verify authorization exists
        const { data: auth } = await supabaseAdmin
            .from('memorial_authorizations')
            .select('id, authorization_type')
            .eq('memorial_id', memorialId)
            .in('status', ['pending', 'approved'])
            .maybeSingle();

        if (!auth || auth.authorization_type !== expectedAuthType) {
            return NextResponse.json({
                error: 'Authorization required before payment',
                code: 'LEGAL_AUTH_REQUIRED',
            }, { status: 403 });
        }

        // Fetch memorial details for the description
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('full_name, mode')
            .eq('id', memorialId)
            .single();

        const fullName = memorial?.full_name || 'Memorial Archive';
        const isDraft = memorial?.mode === 'draft';

        const planLabel = plan === 'family' ? 'Family' : (isDraft ? 'Personal (Draft Upgrade)' : 'Personal');

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects cents
            currency: 'usd',
            description: plan === 'family'
                ? `ULUMAE — Family Plan for ${fullName}`
                : isDraft
                    ? `ULUMAE — Draft → Personal Upgrade for ${fullName}`
                    : `ULUMAE — Permanent Archive for ${fullName}`,
            metadata: {
                memorialId,
                plan: planLabel,
                isDraftUpgrade: isDraft ? 'true' : 'false',
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
