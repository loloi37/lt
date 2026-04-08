import { NextRequest, NextResponse } from 'next/server';
import { requireMemorialAccess } from '@/lib/apiAuth';

export async function GET(req: NextRequest) {
    const memorialId = req.nextUrl.searchParams.get('memorialId') || '';

    try {
        const access = await requireMemorialAccess({
            memorialId,
            action: 'manage_devices',
        });
        if (!access.ok) return access.response;

        const { user, admin } = access;

        let query = admin
            .from('anchor_devices')
            .select('*')
            .eq('user_id', user.id)
            .eq('memorial_id', memorialId);

        const { data, error } = await query.order('last_sync_at', { ascending: false });

        if (error) {
            throw error;
        }

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
    } catch (error: any) {
        console.error('[anchor-sync-status]', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
