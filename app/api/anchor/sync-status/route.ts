import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');
    const memorialId = req.nextUrl.searchParams.get('memorialId');

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    try {
        let query = supabaseAdmin
            .from('anchor_devices')
            .select('*')
            .eq('user_id', userId);

        if (memorialId) {
            query = query.eq('memorial_id', memorialId);
        }

        const { data, error } = await query.order('last_sync_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({
            devices: (data || []).map(d => ({
                id: d.id,
                deviceName: d.device_name,
                browser: d.browser,
                os: d.os,
                syncProgressBytes: d.sync_progress_bytes,
                totalBytes: d.total_bytes,
                lastSyncAt: d.last_sync_at,
                status: d.status,
            })),
        });
    } catch {
        // Return mock data if table doesn't exist
        return NextResponse.json({
            devices: [],
        });
    }
}
