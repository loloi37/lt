import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[contribution-resubmit]', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
