import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { MemorialData } from '@/types/memorial';
import {
    buildEditorActorLabel,
    createVersionFromDiff,
    insertVersionSnapshot,
} from '@/lib/versioningServer';

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

        const { data: memorial, error: memorialError } = await supabaseAdmin
            .from('memorials')
            .select('user_id')
            .eq('id', memorialId)
            .single();

        if (memorialError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found.' }, { status: 404 });
        }

        if (memorial.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Only the memorial owner can view version history.' },
                { status: 403 }
            );
        }

        const rawLimit = Number(request.nextUrl.searchParams.get('limit') || '50');
        const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 50;

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

        const [memorialRes, roleRes] = await Promise.all([
            supabaseAdmin
                .from('memorials')
                .select('user_id')
                .eq('id', memorialId)
                .single(),
            supabaseAdmin
                .from('user_memorial_roles')
                .select('role')
                .eq('memorial_id', memorialId)
                .eq('user_id', user.id)
                .maybeSingle(),
        ]);

        if (memorialRes.error || !memorialRes.data) {
            return NextResponse.json({ error: 'Memorial not found.' }, { status: 404 });
        }

        const isOwner = memorialRes.data.user_id === user.id;
        const isCoGuardian = roleRes.data?.role === 'co_guardian';

        if (!isOwner && !isCoGuardian) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

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
                stepsModified: Array.isArray(body?.stepsModified) ? body.stepsModified : [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
