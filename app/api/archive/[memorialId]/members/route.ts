import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface MemberRecord {
  userId: string | null;
  email: string;
  displayName: string | null;
  role: 'owner' | 'co_guardian' | 'witness' | 'reader';
  status: 'active' | 'pending';
  joinedAt: string | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ memorialId: string }> }
) {
  try {
    const { memorialId } = await params;
    const { user } = await createAuthenticatedClient();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify requester is the memorial owner
    const { data: memorial } = await supabaseAdmin
      .from('memorials')
      .select('user_id, mode')
      .eq('id', memorialId)
      .single();

    if (!memorial || memorial.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch accepted members from user_memorial_roles
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_memorial_roles')
      .select('user_id, role, joined_at')
      .eq('memorial_id', memorialId);

    if (rolesError) throw rolesError;

    // Fetch user emails for accepted members
    const members: MemberRecord[] = [];

    // Add the owner first
    const { data: ownerData } = await supabaseAdmin.auth.admin.getUserById(user.id);

    members.push({
      userId: user.id,
      email: ownerData?.user?.email || user.email || 'Owner',
      displayName: null,
      role: 'owner',
      status: 'active',
      joinedAt: null,
    });

    // Add accepted members (excluding owner if they appear in roles)
    if (roles) {
      for (const role of roles) {
        if (role.user_id === user.id) continue; // Skip owner duplicate

        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(role.user_id);

        members.push({
          userId: role.user_id,
          email: userData?.user?.email || 'Unknown',
          displayName: null,
          role: role.role,
          status: 'active',
          joinedAt: role.joined_at,
        });
      }
    }

    // Fetch pending invitations
    const { data: pendingInvites, error: inviteError } = await supabaseAdmin
      .from('witness_invitations')
      .select('invitee_email, role, created_at')
      .eq('memorial_id', memorialId)
      .eq('status', 'pending');

    if (inviteError) throw inviteError;

    if (pendingInvites) {
      for (const invite of pendingInvites) {
        members.push({
          userId: null,
          email: invite.invitee_email,
          displayName: null,
          role: invite.role,
          status: 'pending',
          joinedAt: invite.created_at,
        });
      }
    }

    return NextResponse.json({
      members,
      planType: memorial.mode,
    });
  } catch (err: any) {
    console.error('Members API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
