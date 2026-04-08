import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { safeLogMemorialActivity } from '@/lib/activityLog';
import { hasPermission, resolveArchivePermissionContext } from '@/lib/archivePermissions';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { memorialId, deviceName, browser, os } = await req.json();
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const permission = await resolveArchivePermissionContext(
            supabaseAdmin,
            memorialId,
            user.id
        );

        if (!permission.memorialExists) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (!permission.context || !hasPermission(permission.context, 'manage_devices')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const deviceId = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

        const { error } = await supabaseAdmin.from('anchor_devices').insert({
            id: deviceId,
            user_id: user.id,
            memorial_id: memorialId,
            device_name: deviceName || 'Unknown Device',
            browser: browser || 'Unknown',
            os: os || 'Unknown',
            sync_progress_bytes: 0,
            total_bytes: 0,
            status: 'syncing',
        });

        if (error) {
            throw error;
        }

        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId,
            action: 'device_registered',
            summary: `${deviceName || 'A device'} was registered for archive sync.`,
            actorUserId: user.id,
            actorEmail: user.email ?? null,
            details: {
                deviceId,
                browser: browser || 'Unknown',
                os: os || 'Unknown',
            },
        });

        return NextResponse.json({
            deviceId,
            status: 'registered',
        });
    } catch (error: any) {
        console.error('Device registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
