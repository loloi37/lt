import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import {
    getArchiveCapabilities,
    getRoleLabel,
    resolveArchivePermissionContext,
} from '@/lib/archivePermissions';
import { WitnessRole } from '@/types/roles';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface MemorialRow {
    id: string;
    full_name: string;
    birth_date: string | null;
    death_date: string | null;
    profile_photo_url: string | null;
    mode: string;
    user_id: string;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string }> }
) {
    try {
        const { memorialId } = await params;
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const [permission, memorialRes, contributionsRes] =
            await Promise.all([
                resolveArchivePermissionContext(supabaseAdmin, memorialId, user.id),
                supabaseAdmin
                    .from('memorials')
                    .select(
                        'id, full_name, birth_date, death_date,' +
                        'profile_photo_url, mode, user_id'
                    )
                    .eq('id', memorialId)
                    .single(),
                supabaseAdmin
                    .from('memorial_contributions')
                    .select('id, type, status, content, created_at, admin_notes, revision_count')
                    .eq('memorial_id', memorialId)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(20)
            ]);

        // Cast memorial explicitly so TypeScript knows the shape
        const memorial = memorialRes.data as MemorialRow | null;

        if (!memorial) {
            return NextResponse.json(
                { error: 'Archive not found' },
                { status: 404 }
            );
        }

        if (!permission.context) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            );
        }

        const userRole = permission.context.role as WitnessRole;
        const plan = permission.context.plan;
        const capabilities = getArchiveCapabilities(userRole, plan);

        let pendingCount = 0;
        if (capabilities.canReview) {
            const { count } = await supabaseAdmin
                .from('memorial_contributions')
                .select('*', { count: 'exact', head: true })
                .eq('memorial_id', memorialId)
                .eq('status', 'pending_approval');
            pendingCount = count || 0;
        }

        const contributions = (contributionsRes.data || []).map(
            (c: any) => ({
                id: c.id,
                type: c.type,
                status: c.status,
                title: c.content?.title || 'Untitled',
                createdAt: c.created_at,
                adminNotes: c.admin_notes || null,
                revisionCount: c.revision_count || 0,
            })
        );

        return NextResponse.json({
            currentUserId: user.id,
            userRole,
            roleLabel: getRoleLabel(userRole),
            plan,
            capabilities,
            memorial: {
                id: memorial.id,
                fullName: memorial.full_name,
                birthDate: memorial.birth_date,
                deathDate: memorial.death_date,
                profilePhotoUrl: memorial.profile_photo_url,
                userId: memorial.user_id
            },
            myContributions: contributions,
            pendingCount
        });

    } catch (err: any) {
        console.error('[role-data]', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
