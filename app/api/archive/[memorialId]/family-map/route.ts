import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from
    '@/utils/supabase/api';

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
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 1. Fetch all linked memorials
        const { data: relations } = await supabaseAdmin
            .from('memorial_relations')
            .select(`
        relation_type,
        to_memorial_id,
        memorials!memorial_relations_to_memorial_id_fkey (
          id,
          full_name,
          birth_date,
          death_date,
          profile_photo_url
        )
      `)
            .eq('from_memorial_id', memorialId);

        if (!relations || relations.length === 0) {
            return NextResponse.json({ linked: [] });
        }

        // 2. Check which ones this user has access to
        const linkedIds = relations.map(
            r => r.to_memorial_id
        );

        const { data: userRoles } = await supabaseAdmin
            .from('user_memorial_roles')
            .select('memorial_id')
            .eq('user_id', user.id)
            .in('memorial_id', linkedIds);

        const accessSet = new Set(
            (userRoles || []).map(r => r.memorial_id)
        );

        // 3. Shape the response
        const linked = relations.map(r => {
            const m = (r as any).memorials;
            return {
                id: m.id,
                fullName: m.full_name,
                birthDate: m.birth_date,
                deathDate: m.death_date,
                profilePhotoUrl: m.profile_photo_url,
                relation: r.relation_type || null,
                userHasAccess: accessSet.has(m.id)
            };
        });

        return NextResponse.json({ linked });
    } catch (err: any) {
        console.error('[family-map]', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
