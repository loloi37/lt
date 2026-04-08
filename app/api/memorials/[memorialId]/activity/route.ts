import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import {
  hasPermission,
  resolveArchivePermissionContext,
} from '@/lib/archivePermissions';
import { DEFAULT_ACTIVITY_LIMIT } from '@/lib/constants';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ memorialId: string }> }
) {
  try {
    const { memorialId } = await params;
    const { user } = await createAuthenticatedClient();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permission = await resolveArchivePermissionContext(
      supabaseAdmin,
      memorialId,
      user.id
    );

    if (!permission.memorialExists) {
      return NextResponse.json({ error: 'Memorial not found.' }, { status: 404 });
    }

    if (!permission.context || !hasPermission(permission.context, 'view_activity')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const rawLimit = Number(request.nextUrl.searchParams.get('limit') || DEFAULT_ACTIVITY_LIMIT);
    const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 100)) : DEFAULT_ACTIVITY_LIMIT;

    const { data, error } = await supabaseAdmin
      .from('memorial_activity_log')
      .select('id, action, summary, actor_email, subject_email, details, created_at')
      .eq('memorial_id', memorialId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      activity: (data || []).map((item) => ({
        id: item.id,
        action: item.action,
        summary: item.summary,
        actorEmail: item.actor_email,
        subjectEmail: item.subject_email,
        details: item.details || {},
        createdAt: item.created_at,
      })),
    });
  } catch (error: any) {
    console.error('[memorial-activity]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
