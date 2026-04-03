// app/invite/[token]/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import InviteShell from './_components/InviteShell';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll(); } } }
    );

    // 1. Fetch invitation data and memorial details in one join
    const { data: invitation, error } = await supabase
        .from('witness_invitations')
        .select(`
      id, inviter_name, invitee_email, role, personal_message, plan, status, expires_at, memorial_id,
      memorials!inner ( id, full_name, birth_date, death_date, profile_photo_url, deleted_at )
    `)
        .eq('id', token)
        .single();

    // 2. Security & Logic Gates
    if (error || !invitation) redirect('/dashboard?error=invite_not_found');

    const memorial = (invitation as any).memorials;
    if (memorial?.deleted_at) redirect('/dashboard?error=memorial_deleted');

    // 3. Check if user is already authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // 4. Check if user is already a member
    if (user) {
        const { data: existingRole } = await supabase
            .from('user_memorial_roles')
            .select('role')
            .eq('memorial_id', memorial.id)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existingRole) {
            redirect(`/archive/${memorial.id}`); // Already joined, skip the invite
        }
    }

    // 5. Check Expiry
    const isExpired = new Date(invitation.expires_at) < new Date();

    // Package the data for the client component
    const initialData = {
        invitation: {
            id: invitation.id,
            inviterName: invitation.inviter_name,
            inviteeEmail: invitation.invitee_email,
            role: invitation.role,
            personalMessage: invitation.personal_message,
            plan: invitation.plan,
            status: invitation.status,
            isExpired,
            memorial: {
                id: memorial.id,
                fullName: memorial.full_name,
                birthDate: memorial.birth_date,
                deathDate: memorial.death_date,
                profilePhotoUrl: memorial.profile_photo_url
            }
        },
        isAuthenticated: !!user
    };

    return <InviteShell initialData={initialData} token={token} />;
}