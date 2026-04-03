import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ReviewDecision = 'approved' | 'rejected' | 'needs_changes';

const VALID_DECISIONS: ReviewDecision[] = ['approved', 'rejected', 'needs_changes'];

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string; contributionId: string }> }
) {
    try {
        const { memorialId, contributionId } = await params;
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const decision = body?.decision as ReviewDecision;
        const adminNotes = String(body?.adminNotes || '').trim();

        if (!VALID_DECISIONS.includes(decision)) {
            return NextResponse.json({ error: 'Invalid review decision' }, { status: 400 });
        }

        if ((decision === 'rejected' || decision === 'needs_changes') && adminNotes.length < 8) {
            return NextResponse.json(
                { error: 'Please include a short explanation so the contributor understands the decision.' },
                { status: 400 }
            );
        }

        const [{ data: memorial }, { data: reviewerRole }, { data: contribution }] = await Promise.all([
            supabaseAdmin
                .from('memorials')
                .select('user_id')
                .eq('id', memorialId)
                .single(),
            supabaseAdmin
                .from('user_memorial_roles')
                .select('role')
                .eq('memorial_id', memorialId)
                .eq('user_id', user.id)
                .maybeSingle(),
            supabaseAdmin
                .from('memorial_contributions')
                .select('id, memorial_id, status')
                .eq('id', contributionId)
                .maybeSingle(),
        ]);

        const canReview = memorial?.user_id === user.id || reviewerRole?.role === 'co_guardian';
        if (!canReview) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!contribution || contribution.memorial_id !== memorialId) {
            return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
        }

        if (contribution.status !== 'pending_approval') {
            return NextResponse.json(
                { error: 'Only contributions awaiting review can be updated from this queue.' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('memorial_contributions')
            .update({
                status: decision,
                admin_notes: adminNotes || null,
                notified_at: new Date().toISOString(),
            })
            .eq('id', contributionId);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[contribution-review]', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
