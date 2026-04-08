import { NextRequest, NextResponse } from 'next/server';
import { requireMemorialAccess } from '@/lib/apiAuth';
import { safeLogMemorialActivity } from '@/lib/activityLog';

export async function POST(req: NextRequest) {
    try {
        const { memorialId, deviceName, browser, os } = await req.json();

        const access = await requireMemorialAccess({
            memorialId,
            action: 'manage_devices',
        });
        if (!access.ok) return access.response;

        const { user, admin } = access;

        const deviceId = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

        const { error } = await admin.from('anchor_devices').insert({
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

        await safeLogMemorialActivity(admin, {
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
