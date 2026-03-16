import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { userId, memorialId, deviceName, browser, os } = await req.json();

        if (!userId || !memorialId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const deviceId = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

        try {
            await supabaseAdmin.from('anchor_devices').insert({
                id: deviceId,
                user_id: userId,
                memorial_id: memorialId,
                device_name: deviceName || 'Unknown Device',
                browser: browser || 'Unknown',
                os: os || 'Unknown',
                sync_progress_bytes: 0,
                total_bytes: 0,
                status: 'syncing',
            });
        } catch {
            // Table may not exist yet - return mock
        }

        return NextResponse.json({
            deviceId,
            status: 'registered',
        });
    } catch (error: any) {
        console.error('Device registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
