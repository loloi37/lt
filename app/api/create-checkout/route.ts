// app/api/create-checkout/route.ts
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
        const { memorialId, plan, amount, isDraftUpgrade } = await request.json();
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
        }

        // --- HARD BARRIER: Check Authorization Status ---
        const { data: auth, error: authError } = await supabaseAdmin
            .from('memorial_authorizations')
            .select('id, authorization_type')
            .eq('memorial_id', memorialId)
            .eq('status', 'approved')
            .maybeSingle();

        // Family plan requires account-level auth; Personal (direct or draft upgrade) requires individual
        const expectedType = plan === 'Family' ? 'account' : 'individual';

        if (authError || !auth || auth.authorization_type !== expectedType) {
            return NextResponse.json({
                error: 'Authorization required',
                code: 'LEGAL_AUTH_REQUIRED',
                redirectUrl: `/authorization/${memorialId}`
            }, { status: 403 });
        }
        // -----------------------------------------------

        // Determine the success URL plan label for the redirect
        const planLabel = isDraftUpgrade ? 'personal' : (plan?.toLowerCase() ?? 'personal');

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: isDraftUpgrade
                                ? 'Legacy Vault - Draft → Personal Upgrade'
                                : `Legacy Vault - ${plan} Plan`,
                            description: isDraftUpgrade
                                ? 'Activate your draft memorial with lifetime hosting and no watermarks'
                                : 'Permanent archival for your memorial',
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                memorialId: memorialId,
                plan: plan,
                isDraftUpgrade: isDraftUpgrade ? 'true' : 'false',
            },
            success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&id=${memorialId}&plan=${planLabel}`,
            cancel_url: isDraftUpgrade
                ? `${origin}/dashboard/draft/${memorialId}` // back to draft dashboard on cancel
                : `${origin}/create?id=${memorialId}`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
