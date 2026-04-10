import { NextRequest, NextResponse } from 'next/server';
import { requireMemorialAccess } from '@/lib/apiAuth';

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

    // AUTH: Use centralized permission layer — require view_members permission
    const access = await requireMemorialAccess({
      memorialId,
      action: 'view_members',
    });
    if (!access.ok) return access.response;

    const { user, admin, context } = access;

    // Fetch accepted members from user_memorial_roles
    const { data: roles, error: rolesError } = await admin
      .from('user_memorial_roles')
      .select('user_id, role, joined_at')
      .eq('memorial_id', memorialId);

    if (rolesError) throw rolesError;

    // Fetch user emails for accepted members
    const members: MemberRecord[] = [];

    // Add the owner first
    const { data: ownerData } = await admin.auth.admin.getUserById(context.ownerUserId);

    members.push({
      userId: context.ownerUserId,
      email: ownerData?.user?.email || 'Owner',
      displayName: null,
      role: 'owner',
      status: 'active',
      joinedAt: null,
    });

    // Add accepted members (excluding owner if they appear in roles)
    if (roles) {
      for (const role of roles) {
        if (role.user_id === context.ownerUserId) continue;

        const { data: userData } = await admin.auth.admin.getUserById(role.user_id);

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
    const { data: pendingInvites, error: inviteError } = await admin
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
      planType: context.plan,
    });
  } catch (err: any) {
    console.error('Members API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
