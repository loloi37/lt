import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any, // Use the latest stable version
});

export async function POST(request: NextRequest) {
    try {
        const { memorialId, plan, amount } = await request.json();
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Legacy Vault - ${plan} Plan`,
                            description: `Permanent archival for your memorial`,
                        },
                        unit_amount: amount * 100, // $1,500 becomes 150000 cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // CRITICAL: We store the memorialId here so we can find it after payment
            metadata: {
                memorialId: memorialId,
            },
            success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&id=${memorialId}&plan=personal`,
            cancel_url: `${origin}/create?id=${memorialId}`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}