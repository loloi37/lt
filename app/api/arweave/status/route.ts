import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { queryTransactionDetails } from '@/lib/arweave/status';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const txId = request.nextUrl.searchParams.get('txId');
        const memorialId = request.nextUrl.searchParams.get('memorialId');

        if (!txId) {
            return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
        }

        // Query Arweave network for confirmation status
        const status = await queryTransactionDetails(txId);

        // If confirmed, update the memorial record in Supabase
        if (status.status === 'confirmed' && memorialId) {
            await supabaseAdmin
                .from('memorials')
                .update({ arweave_status: 'confirmed' })
                .eq('id', memorialId)
                .eq('arweave_tx_id', txId);
        }

        return NextResponse.json(status);

    } catch (error: any) {
        console.error('Arweave status check error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
