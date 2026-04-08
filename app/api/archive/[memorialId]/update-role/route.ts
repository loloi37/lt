// app/api/archive/[memorialId]/update-role/route.ts
//
// Legacy entry-point for changing a member's role on an archive.
// Kept as a thin wrapper around the centralized permission system so any
// existing callers continue to work, but the canonical implementation now
// lives at: PATCH /api/memorials/[memorialId]/members/[targetUserId]/role
//
// Security: never trusts the requester's role from the body — it is resolved
// from the database via requireMemorialAccess('manage_members').

import { NextRequest, NextResponse } from 'next/server';
import { WitnessRole } from '@/types/roles';
import { requireMemorialAccess } from '@/lib/apiAuth';
import { safeLogMemorialActivity } from '@/lib/activityLog';
import {
  syncCoGuardianAcrossOwnerFamily,
  updateFamilyCoGuardianRole,
} from '@/lib/familyWorkspace';

const VALID_ROLES = ['co_guardian', 'witness', 'reader'] as const;
type AssignableRole = (typeof VALID_ROLES)[number];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ memorialId: string }> }
) {
  try {
    const { memorialId } = await params;
    const body = (await req.json()) as { targetUserId?: string; newRole?: string };
    const { targetUserId, newRole } = body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json(
        { error: 'Missing targetUserId' },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(newRole as AssignableRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      );
    }

    // 1. AUTH + AUTHORIZATION (centralized).
    //    Resolves the caller from the cookie session and verifies their
    //    database-backed role on this memorial allows manage_members.
    const access = await requireMemorialAccess({
      memorialId,
      action: 'manage_members',
    });
    if (!access.ok) return access.response;

    const { user, admin, context } = access;

    // 2. Owner identity invariants.
    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: "Cannot change the owner's role" },
        { status: 400 }
      );
    }
    if (targetUserId === context.ownerUserId) {
      return NextResponse.json(
        { error: "Cannot change the owner's role" },
        { status: 400 }
      );
    }

    // 3. Plan constraint: co_guardian only exists on family plans.
    if (newRole === 'co_guardian' && context.plan !== 'family') {
      return NextResponse.json(
        { error: 'Co-Guardian role is only available for Family plan archives' },
        { status: 403 }
      );
    }

    // 4. Apply the change. For family co-guardian transitions we keep the
    //    role consistent across every memorial in the owner's family.
    const { data: currentRoleRow } = await admin
      .from('user_memorial_roles')
      .select('role')
      .eq('memorial_id', memorialId)
      .eq('user_id', targetUserId)
      .maybeSingle();

    const isFamilyMemorial = context.plan === 'family';
    const isFamilyWideCoGuardianChange =
      isFamilyMemorial &&
      (newRole === 'co_guardian' || currentRoleRow?.role === 'co_guardian');

    if (isFamilyWideCoGuardianChange) {
      if (newRole === 'co_guardian') {
        await syncCoGuardianAcrossOwnerFamily(context.ownerUserId, targetUserId);
      } else {
        await updateFamilyCoGuardianRole(
          context.ownerUserId,
          targetUserId,
          newRole as 'witness' | 'reader'
        );
      }
    } else {
      const { error } = await admin
        .from('user_memorial_roles')
        .update({ role: newRole })
        .eq('memorial_id', memorialId)
        .eq('user_id', targetUserId);

      if (error) throw error;
    }

    await safeLogMemorialActivity(admin, {
      memorialId,
      action: 'member_role_updated',
      summary: `A member role was changed to ${newRole}.`,
      actorUserId: user.id,
      actorEmail: user.email ?? null,
      subjectUserId: targetUserId,
      details: { newRole },
    });

    return NextResponse.json({ success: true, newRole: newRole as WitnessRole });
  } catch (err: any) {
    console.error('Update role error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
