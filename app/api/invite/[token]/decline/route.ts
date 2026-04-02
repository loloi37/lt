import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;


        const { error } = await supabaseAdmin
            .from('witness_invitations')
            .update({ status: 'declined' })
            .eq('id', token)
            .eq('status', 'pending'); // Only decline if pending

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[decline/route]', err);
        return NextResponse.json(
            { error: 'Failed to decline' },
            { status: 500 }
        );
    }
}