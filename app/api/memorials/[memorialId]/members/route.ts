// app/api/memorials/[memorialId]/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';

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

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 1. Verify caller is Owner or Co-Guardian
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('user_id')
            .eq('id', memorialId)
            .single();

        const { data: callerRole } = await supabaseAdmin
            .from('user_memorial_roles')
            .select('role')
            .eq('memorial_id', memorialId)
            .eq('user_id', user.id)
            .maybeSingle();

        const isOwner = memorial?.user_id === user.id;
        const isCoGuardian = callerRole?.role === 'co_guardian';

        if (!isOwner && !isCoGuardian) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Fetch Active Members
        const { data: roles, error: rolesError } = await supabaseAdmin
            .from('user_memorial_roles')
            .select('user_id, role, joined_at')
            .eq('memorial_id', memorialId);

        if (rolesError) throw rolesError;

        // 3. Enrich with Auth Data (Email)
        const enrichedMembers = await Promise.all((roles || []).map(async (member) => {
            const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(member.user_id);
            return {
                userId: member.user_id,
                email: authUser?.user?.email || 'Unknown',
                role: member.role,
                status: 'active',
                joinedAt: member.joined_at
            };
        }));

        // 4. Fetch Pending Invitations
        const { data: pending, error: pendingError } = await supabaseAdmin
            .from('witness_invitations')
            .select('id, invitee_email, role, created_at')
            .eq('memorial_id', memorialId)
            .eq('status', 'pending');

        if (pendingError) throw pendingError;

        const pendingMembers = (pending || []).map(inv => ({
            invitationId: inv.id,
            userId: null,
            email: inv.invitee_email,
            role: inv.role,
            status: 'pending',
            joinedAt: inv.created_at
        }));

        return NextResponse.json({
            members: [...enrichedMembers, ...pendingMembers]
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
