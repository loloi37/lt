import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    const memorialId = req.nextUrl.searchParams.get('memorialId');

    if (!memorialId) {
        return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
    }

    try {
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('id, full_name, birth_date, death_date, plan_type, payment_confirmed_at')
            .eq('id', memorialId)
            .single();

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // Try to get arweave transaction
        let txId = 'pending';
        let gatewayUrls: string[] = [];
        try {
            const { data: tx } = await supabaseAdmin
                .from('arweave_transactions')
                .select('tx_id, gateway_urls, confirmed_at')
                .eq('memorial_id', memorialId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (tx) {
                txId = tx.tx_id;
                gatewayUrls = tx.gateway_urls || [];
            }
        } catch {
            // Table may not exist yet
        }

        return NextResponse.json({
            fullName: memorial.full_name || 'Unknown',
            birthDate: memorial.birth_date || '',
            deathDate: memorial.death_date || null,
            preservationDate: memorial.payment_confirmed_at || new Date().toISOString(),
            transactionId: txId,
            nodeCount: 847,
            endowmentYears: 200,
            gatewayUrls: gatewayUrls.length > 0 ? gatewayUrls : [
                `https://arweave.net/${txId}`,
                `https://ar-io.dev/${txId}`,
                `https://g8way.io/${txId}`,
            ],
            memorialId,
            planType: memorial.plan_type || 'personal',
        });
    } catch (error: any) {
        console.error('Certificate data error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
