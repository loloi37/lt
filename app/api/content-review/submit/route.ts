import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { safeLogMemorialActivity } from '@/lib/activityLog';
import { hasPermission, resolveArchivePermissionContext } from '@/lib/archivePermissions';
import { getSupabaseAdmin } from '@/lib/apiAuth';

export async function POST(req: NextRequest) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { memorialId } = await req.json();
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

        if (!permission.memorialExists || !permission.context) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (!hasPermission(permission.context, 'export_archive')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { error } = await supabaseAdmin.from('content_reviews').upsert({
            memorial_id: memorialId,
            status: 'approved',
            submitted_at: new Date().toISOString(),
            reviewed_at: new Date().toISOString(),
            flagged_items: [],
        }, { onConflict: 'memorial_id' });

        if (error) {
            throw error;
        }

        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId,
            action: 'content_review_submitted',
            summary: 'Content review was submitted for preservation readiness.',
            actorUserId: user.id,
            actorEmail: user.email ?? null,
        });

        return NextResponse.json({
            status: 'approved',
            message: 'Content review approved. Ready for preservation.',
        });
    } catch (error: any) {
        console.error('Content review error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
