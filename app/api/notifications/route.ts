import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { DEFAULT_ACTIVITY_LIMIT } from '@/lib/constants';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface MemorialSummary {
  id: string;
  full_name: string | null;
  mode: string | null;
}

export async function GET() {
  try {
    const { user } = await createAuthenticatedClient();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [ownedMemorialsResult, membershipResult] = await Promise.all([
      supabaseAdmin
        .from('memorials')
        .select('id, full_name, mode')
        .eq('user_id', user.id)
        .eq('deleted', false),
      supabaseAdmin
        .from('user_memorial_roles')
        .select('memorial_id, role, memorials!inner(id, full_name, mode)')
        .eq('user_id', user.id),
    ]);

    if (ownedMemorialsResult.error) {
      throw ownedMemorialsResult.error;
    }

    if (membershipResult.error) {
      throw membershipResult.error;
    }

    const memorialMap = new Map<string, MemorialSummary>();
    const ownedMemorialIds = new Set<string>();
    const ownedFamilyMemorialIds = new Set<string>();
    const stewardMemorialIds = new Set<string>();
    const accessibleMemorialIds = new Set<string>();

    for (const memorial of ownedMemorialsResult.data || []) {
      memorialMap.set(memorial.id, memorial);
      ownedMemorialIds.add(memorial.id);
      accessibleMemorialIds.add(memorial.id);

      if (memorial.mode === 'family') {
        ownedFamilyMemorialIds.add(memorial.id);
      }
    }

    for (const membership of membershipResult.data || []) {
      const memorial = membership.memorials as unknown as MemorialSummary;
      if (memorial?.id) {
        memorialMap.set(memorial.id, memorial);
        accessibleMemorialIds.add(memorial.id);
      }

      if (membership.role === 'co_guardian' && membership.memorial_id) {
        stewardMemorialIds.add(membership.memorial_id);
      }
    }

    for (const memorialId of ownedMemorialIds) {
      stewardMemorialIds.add(memorialId);
    }

    const accessibleIds = Array.from(accessibleMemorialIds);
    const stewardIds = Array.from(stewardMemorialIds);
    const ownedIds = Array.from(ownedMemorialIds);

    const [
      contributionResult,
      accessRequestResult,
      creationRequestResult,
      activityResult,
    ] = await Promise.all([
      stewardIds.length > 0
        ? supabaseAdmin
            .from('memorial_contributions')
            .select('id, memorial_id, content, witness_name, created_at')
            .in('memorial_id', stewardIds)
            .eq('status', 'pending_approval')
            .order('created_at', { ascending: false })
            .limit(DEFAULT_ACTIVITY_LIMIT)
        : Promise.resolve({ data: [], error: null }),
      ownedIds.length > 0
        ? supabaseAdmin
            .from('memorial_access_requests')
            .select('id, memorial_id, requester_user_id, requested_role, request_message, created_at')
            .in('memorial_id', ownedIds)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(DEFAULT_ACTIVITY_LIMIT)
        : Promise.resolve({ data: [], error: null }),
      ownedFamilyMemorialIds.size > 0
        ? supabaseAdmin
            .from('memorial_creation_requests')
            .select('id, source_memorial_id, requester_user_id, proposed_name, request_message, created_at')
            .eq('owner_user_id', user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(DEFAULT_ACTIVITY_LIMIT)
        : Promise.resolve({ data: [], error: null }),
      // Activity log table may not exist yet — treat as empty if missing
      accessibleIds.length > 0
        ? supabaseAdmin
            .from('memorial_activity_log')
            .select('id, memorial_id, action, summary, actor_email, subject_email, created_at')
            .in('memorial_id', accessibleIds)
            .order('created_at', { ascending: false })
            .limit(DEFAULT_ACTIVITY_LIMIT)
            .then(res => res.error?.code === 'PGRST205' ? { data: [], error: null } : res)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (contributionResult.error) throw contributionResult.error;
    if (accessRequestResult.error) throw accessRequestResult.error;
    if (creationRequestResult.error) throw creationRequestResult.error;
    if (activityResult.error) throw activityResult.error;

    const requesterIds = [
      ...new Set([
        ...(accessRequestResult.data || []).map((item: any) => item.requester_user_id),
        ...(creationRequestResult.data || []).map((item: any) => item.requester_user_id),
      ].filter(Boolean)),
    ];

    const requesterEmailMap = new Map<string, string>();
    if (requesterIds.length > 0) {
      await Promise.all(
        requesterIds.map(async (requesterId) => {
          const { data } = await supabaseAdmin.auth.admin.getUserById(requesterId);
          if (data.user?.email) {
            requesterEmailMap.set(requesterId, data.user.email);
          }
        })
      );
    }

    const pendingItems = [
      ...(contributionResult.data || []).map((item: any) => ({
        id: `contribution:${item.id}`,
        type: 'pending_contribution',
        title: item.content?.title || 'Contribution awaiting review',
        body: item.witness_name
          ? `${item.witness_name} submitted content that needs review.`
          : 'A new contribution is waiting for review.',
        href: `/archive/${item.memorial_id}/steward`,
        memorialId: item.memorial_id,
        memorialName: memorialMap.get(item.memorial_id)?.full_name || 'Untitled memorial',
        createdAt: item.created_at,
      })),
      ...(accessRequestResult.data || []).map((item: any) => ({
        id: `access:${item.id}`,
        type: 'pending_access_request',
        title: `${item.requested_role || 'witness'} access request`,
        body: requesterEmailMap.get(item.requester_user_id)
          ? `${requesterEmailMap.get(item.requester_user_id)} requested access.`
          : 'A user requested access to this memorial.',
        href: `/dashboard/family/${user.id}#notifications`,
        memorialId: item.memorial_id,
        memorialName: memorialMap.get(item.memorial_id)?.full_name || 'Untitled memorial',
        createdAt: item.created_at,
      })),
      ...(creationRequestResult.data || []).map((item: any) => ({
        id: `creation:${item.id}`,
        type: 'pending_creation_request',
        title: item.proposed_name || 'New family memorial request',
        body: requesterEmailMap.get(item.requester_user_id)
          ? `${requesterEmailMap.get(item.requester_user_id)} asked to add another family memorial.`
          : 'A co-guardian asked to add another family memorial.',
        href: `/dashboard/family/${user.id}#notifications`,
        memorialId: item.source_memorial_id,
        memorialName: memorialMap.get(item.source_memorial_id)?.full_name || 'Untitled memorial',
        createdAt: item.created_at,
      })),
    ].sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );

    const recentActivity = (activityResult.data || []).map((item: any) => ({
      id: item.id,
      action: item.action,
      summary: item.summary,
      actorEmail: item.actor_email,
      subjectEmail: item.subject_email,
      memorialId: item.memorial_id,
      memorialName: memorialMap.get(item.memorial_id)?.full_name || 'Untitled memorial',
      createdAt: item.created_at,
    }));

    return NextResponse.json(
      {
        badgeCount: pendingItems.length,
        pendingItems,
        recentActivity,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    console.error('[notifications]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
