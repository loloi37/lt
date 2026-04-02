import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { memorialId, userId } = await req.json();

        if (!memorialId || !userId) {
            return NextResponse.json({ error: 'Missing memorialId or userId' }, { status: 400 });
        }

        // Verify ownership
        const { data: memorial, error: memError } = await supabaseAdmin
            .from('memorials')
            .select('id, user_id, paid')
            .eq('id', memorialId)
            .single();

        if (memError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (memorial.user_id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!memorial.paid) {
            return NextResponse.json({ error: 'Memorial must be paid before preservation' }, { status: 400 });
        }

        // Generate mock transaction ID (placeholder for real Arweave upload)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        const txId = Array.from({ length: 43 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

        // Store transaction record
        const { error: txError } = await supabaseAdmin
            .from('arweave_transactions')
            .insert({
                memorial_id: memorialId,
                tx_id: txId,
                status: 'confirmed',
                gateway_urls: [
                    `https://arweave.net/${txId}`,
                    `https://ar-io.dev/${txId}`,
                    `https://g8way.io/${txId}`,
                ],
                file_count: Math.floor(Math.random() * 50) + 10,
                total_bytes: Math.floor(Math.random() * 500_000_000) + 10_000_000,
                confirmed_at: new Date().toISOString(),
            });

        // Update memorial with arweave tx id (ignore if column doesn't exist yet)
        try {
            await supabaseAdmin
                .from('memorials')
                .update({ arweave_tx_id: txId })
                .eq('id', memorialId);
        } catch {
            // Column may not exist yet — ignore
        }

        return NextResponse.json({
            txId,
            status: 'confirmed',
            gatewayUrls: [
                `https://arweave.net/${txId}`,
                `https://ar-io.dev/${txId}`,
                `https://g8way.io/${txId}`,
            ],
        });
    } catch (error: any) {
        console.error('Arweave upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
