import { NextRequest, NextResponse } from 'next/server';
import { requireUser, getSupabaseAdmin } from '@/lib/apiAuth';
import { safeLogMemorialActivity } from '@/lib/activityLog';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string; contributionId: string }> }
) {
    try {
        const { memorialId, contributionId } = await params;
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { user } = auth;
        const supabaseAdmin = getSupabaseAdmin();

        const { data: contribution } = await supabaseAdmin
            .from('memorial_contributions')
            .select('id, memorial_id, user_id, status, revision_count')
            .eq('id', contributionId)
            .maybeSingle();

        if (!contribution || contribution.memorial_id !== memorialId) {
            return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
        }

        if (contribution.user_id !== user.id) {
            return NextResponse.json({ error: 'Only the contributor can resubmit this item' }, { status: 403 });
        }

        if (contribution.status !== 'needs_changes') {
            return NextResponse.json({ error: 'Only contributions marked for changes can be resubmitted' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('memorial_contributions')
            .update({
                status: 'pending_approval',
                admin_notes: null,
                revision_count: (contribution.revision_count || 0) + 1,
                notified_at: null,
            })
            .eq('id', contributionId);

        if (error) {
            throw error;
        }

        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId,
            action: 'contribution_resubmitted',
            summary: 'A contribution was revised and resubmitted for review.',
            actorUserId: user.id,
            actorEmail: user.email ?? null,
            details: {
                contributionId,
                revisionCount: (contribution.revision_count || 0) + 1,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[contribution-resubmit]', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
