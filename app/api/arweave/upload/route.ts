import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { uploadToArweave, estimateUploadCost } from '@/lib/arweave/uploader';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { memorialId } = await request.json();

        if (!memorialId) {
            return NextResponse.json({ error: 'Memorial ID is required' }, { status: 400 });
        }

        // Verify ownership
        const { data: memorial, error: fetchError } = await supabaseAdmin
            .from('memorials')
            .select('*')
            .eq('id', memorialId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found or access denied' }, { status: 404 });
        }

        // Verify payment before allowing preservation
        if (memorial.state !== 'live' && memorial.state !== 'preserved') {
            return NextResponse.json({ error: 'Payment required before preservation' }, { status: 402 });
        }

        // Prepare memorial data for upload
        const memorialData = JSON.stringify({
            stories: memorial.stories,
            media: memorial.media,
            timeline: memorial.timeline,
            network: memorial.network,
            metadata: {
                fullName: memorial.full_name,
                birthDate: memorial.birth_date,
                deathDate: memorial.death_date,
                preservedAt: new Date().toISOString(),
            },
        });

        // Estimate cost
        const cost = await estimateUploadCost(Buffer.from(memorialData).length);

        // Upload to Arweave
        const result = await uploadToArweave({
            memorialId,
            data: memorialData,
            tags: {
                'Memorial-Name': memorial.full_name || 'Unknown',
            },
        });

        // Update memorial with Arweave transaction info
        await supabaseAdmin
            .from('memorials')
            .update({
                arweave_tx_id: result.transactionId,
                arweave_status: 'pending',
                state: 'preserved',
            })
            .eq('id', memorialId);

        return NextResponse.json({
            success: true,
            transactionId: result.transactionId,
            size: result.size,
            cost: cost.cost,
            gatewayUrl: `https://arweave.net/${result.transactionId}`,
        });

    } catch (error: any) {
        console.error('Arweave upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
