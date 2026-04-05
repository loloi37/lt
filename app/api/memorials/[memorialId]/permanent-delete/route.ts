import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// DELETE /api/memorials/[memorialId]/permanent-delete
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ memorialId: string }> }
) {
    try {
        const { memorialId } = await params;

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorial id' }, { status: 400 });
        }

        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: memorial, error: fetchError } = await supabaseAdmin
            .from('memorials')
            .select('user_id, deleted, paid, mode')
            .eq('id', memorialId)
            .single();

        if (fetchError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden: You do not own this archive' }, { status: 403 });
        }

        if (!memorial.deleted) {
            return NextResponse.json(
                { error: 'Memorial must be in trash before permanent deletion' },
                { status: 400 }
            );
        }

        if (memorial.paid && memorial.mode) {
            const planRank: Record<string, number> = { draft: 0, personal: 1, family: 2, concierge: 3 };
            const memorialPlanRank = planRank[memorial.mode] ?? 0;

            const { data: userRow } = await supabaseAdmin
                .from('users')
                .select('highest_plan')
                .eq('id', user.id)
                .single();

            const currentRank = planRank[userRow?.highest_plan ?? 'draft'] ?? 0;
            if (memorialPlanRank > currentRank) {
                await supabaseAdmin
                    .from('users')
                    .update({ highest_plan: memorial.mode })
                    .eq('id', user.id);
            } else if (!userRow?.highest_plan && memorial.paid) {
                await supabaseAdmin
                    .from('users')
                    .update({ highest_plan: memorial.mode })
                    .eq('id', user.id);
            }
        }

        const { error } = await supabaseAdmin
            .from('memorials')
            .delete()
            .eq('id', memorialId);

        if (error) {
            console.error('permanent-delete error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Permanent delete execution error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
