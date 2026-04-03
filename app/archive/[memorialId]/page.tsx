// app/archive/[memorialId]/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ArchiveHubClient from './_components/ArchiveHubClient';
import { WitnessRole } from '@/types/roles';

export default async function ArchivePage({ params }: { params: Promise<{ memorialId: string }> }) {
    const { memorialId } = await params;
    const cookieStore = await cookies();

    // 1. Initialize server-side Supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                }
            }
        }
    );

    // 2. Authenticate User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect(`/login?next=/archive/${memorialId}`);
    }

    // 3. Fetch Memorial Data & Determine Ownership
    const { data: memorial, error: memError } = await supabase
        .from('memorials')
        .select('id, full_name, profile_photo_url, mode, user_id')
        .eq('id', memorialId)
        .single();

    if (memError || !memorial) {
        redirect('/dashboard'); // Memorial doesn't exist or was deleted
    }

    let userRole: WitnessRole | 'none' = 'none';

    if (memorial.user_id === user.id) {
        userRole = 'owner';
    } else {
        // 4. Check specific role if not owner
        const { data: roleData } = await supabase
            .from('user_memorial_roles')
            .select('role')
            .eq('memorial_id', memorialId)
            .eq('user_id', user.id)
            .single();

        if (roleData) {
            userRole = roleData.role as WitnessRole;
        }
    }

    // 5. Hard Security Gate
    if (userRole === 'none') {
        redirect('/dashboard'); // User has no access to this archive
    }

    // 6. Fetch contextual data (Pending queue for admins, own contributions for everyone)
    let pendingCount = 0;
    if (userRole === 'owner' || userRole === 'co_guardian') {
        const { count } = await supabase
            .from('memorial_contributions')
            .select('*', { count: 'exact', head: true })
            .eq('memorial_id', memorialId)
            .eq('status', 'pending_approval');
        pendingCount = count || 0;
    }

    const { data: myContributions } = await supabase
        .from('memorial_contributions')
        .select('id, type, status, content, created_at, admin_notes, revision_count')
        .eq('memorial_id', memorialId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // 7. Package safe data for the client
    const roleData = {
        userRole,
        plan: memorial.mode,
        memorial: {
            id: memorial.id,
            fullName: memorial.full_name,
            profilePhotoUrl: memorial.profile_photo_url
        },
        pendingCount,
        myContributions: (myContributions || []).map(c => ({
            id: c.id,
            type: c.type,
            status: c.status,
            title: c.content?.title || 'Untitled',
            createdAt: c.created_at,
            adminNotes: c.admin_notes || null,
            revisionCount: c.revision_count || 0,
        }))
    };

    return (
        <ArchiveHubClient
            roleData={roleData}
            memorialId={memorialId}
            userId={user.id}
        />
    );
}   
