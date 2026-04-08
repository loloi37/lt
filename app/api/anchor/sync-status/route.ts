import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { hasPermission, resolveArchivePermissionContext } from '@/lib/archivePermissions';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    const memorialId = req.nextUrl.searchParams.get('memorialId');

    try {
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
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

        let query = supabaseAdmin
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
