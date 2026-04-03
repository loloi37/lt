import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { getArchiveCapabilities, getRoleLabel } from '@/lib/archivePermissions';
import { WitnessRole } from '@/types/roles';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string }> }
) {
    try {
        const { memorialId } = await params;

        // 1. Authenticate
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Fetch role + memorial in parallel
        const [roleResult, memorialResult] =
            await Promise.all([
                supabaseAdmin
                    .from('user_memorial_roles')
                    .select('role, joined_at')
                    .eq('user_id', user.id)
                    .eq('memorial_id', memorialId)
                    .single(),

                supabaseAdmin
                    .from('memorials')
                    .select(`
            id,
            full_name,
            birth_date,
            death_date,
            profile_photo_url,
            mode,
            step6,
            step7,
            step8,
            step9
          `)
                    .eq('id', memorialId)
                    .single()
            ]);

        // 3. Verify they actually have a role here
        // (prevents URL-guessing access)
        if (roleResult.error || !roleResult.data) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            );
        }

        if (memorialResult.error || !memorialResult.data) {
            return NextResponse.json(
                { error: 'Archive not found' },
                { status: 404 }
            );
        }

        const memorial = memorialResult.data;
        const userRole = roleResult.data.role as WitnessRole;
        const plan = memorial.mode === 'family'
            ? 'family'
            : 'personal';
        const capabilities = getArchiveCapabilities(userRole, plan);

        // 4. Compute content richness
        // (determines which empty-state copy we show)
        const hasBiography =
            (memorial.step6?.biography || '').length > 100;
        const photoCount =
            (memorial.step8?.gallery || []).length;
        const memoryCount =
            (memorial.step7?.sharedMemories || []).length +
            (memorial.step7?.impactStories || []).length;
        const videoCount =
            (memorial.step9?.videos || []).length;

        const contentScore =
            (hasBiography ? 2 : 0) +
            photoCount +
            memoryCount +
            videoCount;

        const archiveRichness: 'empty' | 'partial' | 'rich' =
            contentScore === 0
                ? 'empty'
                : contentScore < 5
                    ? 'partial'
                    : 'rich';

        // 5. Family plan: fetch linked memorials count
        let linkedCount = 0;
        if (plan === 'family') {
            const { count } = await supabaseAdmin
                .from('memorial_relations')
                .select('*', { count: 'exact', head: true })
                .eq('from_memorial_id', memorialId);
            linkedCount = count || 0;
        }

        // 6. Update last_visited_at
        await supabaseAdmin
            .from('user_memorial_roles')
            .update({
                last_visited_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('memorial_id', memorialId);

        return NextResponse.json({
            memorial: {
                id: memorial.id,
                fullName: memorial.full_name,
                birthDate: memorial.birth_date,
                deathDate: memorial.death_date,
                profilePhotoUrl: memorial.profile_photo_url
            },
            userRole,
            roleLabel: getRoleLabel(userRole),
            plan,
            capabilities,
            archiveRichness,
            stats: {
                photoCount,
                memoryCount,
                videoCount,
                hasBiography
            },
            linkedCount,
            joinedAt: roleResult.data.joined_at
        });

    } catch (err: any) {
        console.error('[welcome-data]', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
