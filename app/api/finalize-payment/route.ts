// app/api/finalize-payment/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { memorialId } = await req.json();

        // 1. Initialize Supabase with the SERVICE ROLE KEY (Superpower)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. Perform the update (The trigger will allow this because it's the service_role)
        const { data, error } = await supabaseAdmin
            .from('memorials')
            .update({
                paid: true,
                status: 'published'
            })
            .eq('id', memorialId)
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Finalize Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}