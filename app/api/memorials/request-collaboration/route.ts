import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { memorialId, targetOwnerId, requesterId } = await request.json();

        // In a real app, this would create a record in a 'notifications' table
        // or send an email to the targetOwnerId.
        // For now, we will create a 'witness_invitation' with a special type

        const { error } = await supabaseAdmin
            .from('memorial_contributions')
            .insert([{
                memorial_id: memorialId,
                user_id: requesterId,
                type: 'memory', // Placeholder type
                witness_name: "Family Member",
                content: { note: "Requested to be a Co-Guardian" },
                status: 'pending_approval' // Re-using the approval queue
            }]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}