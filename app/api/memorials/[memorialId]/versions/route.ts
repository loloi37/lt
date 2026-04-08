import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { MemorialData } from '@/types/memorial';
import {
    buildEditorActorLabel,
    createVersionFromDiff,
    insertVersionSnapshot,
} from '@/lib/versioningServer';
import {
    hasPermission,
    resolveArchivePermissionContext,
} from '@/lib/archivePermissions';
import { DEFAULT_VERSION_LIMIT, MAX_VERSION_LIMIT, MEMORIAL_STEP_IDS } from '@/lib/constants';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ memorialId: string }> }
) {
    try {
        const { memorialId } = await params;
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const permission = await resolveArchivePermissionContext(
            supabaseAdmin,
            memorialId,
            user.id
        );

        if (!permission.memorialExists) {
            return NextResponse.json({ error: 'Memorial not found.' }, { status: 404 });
        }

        if (!permission.context || !hasPermission(permission.context, 'view_activity')) {
            return NextResponse.json(
                { error: 'Only members with stewardship access can view version history.' },
                { status: 403 }
            );
        }

        const rawLimit = Number(request.nextUrl.searchParams.get('limit') || DEFAULT_VERSION_LIMIT);
        const limit = Number.isFinite(rawLimit)
            ? Math.min(Math.max(rawLimit, 1), MAX_VERSION_LIMIT)
            : DEFAULT_VERSION_LIMIT;

        const { data, error } = await supabaseAdmin
            .from('memorial_versions')
            .select('*')
            .eq('memorial_id', memorialId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        return NextResponse.json({ versions: data || [] });
    } catch (error: any) {
        console.error('[versions-get]', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ memorialId: string }> }
) {
    try {
        const { memorialId } = await params;
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const permission = await resolveArchivePermissionContext(
            supabaseAdmin,
            memorialId,
            user.id
        );

        if (!permission.memorialExists) {
            return NextResponse.json({ error: 'Memorial not found.' }, { status: 404 });
        }

        if (!permission.context || !hasPermission(permission.context, 'edit_archive')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const isOwner = permission.context.role === 'owner';
        const isCoGuardian = permission.context.role === 'co_guardian';

        const body = await request.json();
        const actorName = buildEditorActorLabel(
            isOwner ? 'owner' : 'co_guardian',
            user.email
        );

        if (body?.mode === 'snapshot') {
            const memorialData = body?.data as MemorialData | undefined;
            const changeSummary = String(body?.changeSummary || '').trim();

            if (!memorialData || !changeSummary) {
                return NextResponse.json(
                    { error: 'Snapshot data and a summary are required.' },
                    { status: 400 }
                );
            }

            const version = await insertVersionSnapshot({
                supabaseAdmin,
                memorialId,
                snapshotData: memorialData,
                stepsModified: Array.isArray(body?.stepsModified) ? body.stepsModified : [...MEMORIAL_STEP_IDS],
                createdBy: user.id,
                createdByName: actorName,
                changeSummary,
                changeReason: body?.changeReason || null,
                changeType: body?.changeType || 'manual',
            });

            return NextResponse.json({ success: true, version });
        }

        const oldData = body?.oldData as MemorialData | undefined;
        const newData = body?.newData as MemorialData | undefined;

        if (!oldData || !newData) {
            return NextResponse.json(
                { error: 'Old and new memorial data are required.' },
                { status: 400 }
            );
        }

        const { version } = await createVersionFromDiff({
            supabaseAdmin,
            memorialId,
            oldData,
            newData,
            createdBy: user.id,
            createdByName: actorName,
            changeReason: body?.changeReason || null,
            changeType: body?.changeType || 'manual',
        });

        return NextResponse.json({ success: true, version });
    } catch (error: any) {
        console.error('[versions-post]', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
