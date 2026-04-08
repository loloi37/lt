import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { hasPermission, resolveArchivePermissionContext } from '@/lib/archivePermissions';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    const txId = req.nextUrl.searchParams.get('txId');
    const memorialId = req.nextUrl.searchParams.get('memorialId');

    if (!txId && !memorialId) {
        return NextResponse.json({ error: 'Provide txId or memorialId' }, { status: 400 });
    }

    try {
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (memorialId) {
            const permission = await resolveArchivePermissionContext(
                supabaseAdmin,
                memorialId,
                user.id
            );

            if (!permission.memorialExists || !permission.context) {
                return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
            }

            if (
                !hasPermission(permission.context, 'view_activity') &&
                !hasPermission(permission.context, 'export_archive')
            ) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        let query = supabaseAdmin.from('arweave_transactions').select('*');
        if (txId) query = query.eq('tx_id', txId);
        else if (memorialId) query = query.eq('memorial_id', memorialId);

        const { data, error } = await query.order('created_at', { ascending: false }).limit(1).single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (!data) {
            return NextResponse.json({
                txId: txId || null,
                status: 'not_found',
                gatewayUrls: [],
                fileCount: 0,
                totalBytes: 0,
                confirmedAt: null,
            });
        }

        return NextResponse.json({
            txId: data.tx_id,
            status: data.status,
            gatewayUrls: data.gateway_urls,
            fileCount: data.file_count,
            totalBytes: data.total_bytes,
            confirmedAt: data.confirmed_at,
        });
    } catch (error: any) {
        console.error('[arweave-status]', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
