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
        const { memorialId } = await req.json();
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

        if (!permission.memorialExists || !permission.context) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (!hasPermission(permission.context, 'export_archive')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { data: memorial, error: memError } = await supabaseAdmin
            .from('memorials')
            .select('id, paid')
            .eq('id', memorialId)
            .single();

        if (memError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (!memorial.paid) {
            return NextResponse.json({ error: 'Memorial must be paid before preservation' }, { status: 400 });
        }

        // PLACEHOLDER: Real Arweave integration required before production.
        // This generates a local-only transaction record to allow the UI flow
        // to be tested end-to-end. The data is NOT actually uploaded to Arweave.
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        const txId = `PLACEHOLDER_${Array.from({ length: 35 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`;

        // Store transaction record with placeholder status
        const { error: txError } = await supabaseAdmin
            .from('arweave_transactions')
            .insert({
                memorial_id: memorialId,
                tx_id: txId,
                status: 'placeholder',
                gateway_urls: [],
                file_count: 0,
                total_bytes: 0,
                confirmed_at: null,
            });

        // Update memorial with arweave tx id (ignore if column doesn't exist yet)
        try {
            await supabaseAdmin
                .from('memorials')
                .update({ arweave_tx_id: txId })
                .eq('id', memorialId);
        } catch {
            // Column may not exist yet — ignore
        }

        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId,
            action: 'memorial_exported',
            summary: 'Preservation upload started for this memorial.',
            actorUserId: user.id,
            actorEmail: user.email ?? null,
            details: {
                txId,
            },
        });

        return NextResponse.json({
            txId,
            status: 'placeholder',
            gatewayUrls: [],
            notice: 'This is a placeholder record. Real Arweave integration is pending.',
        });
    } catch (error: any) {
        console.error('Arweave upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
