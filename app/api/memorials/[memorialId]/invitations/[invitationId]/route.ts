import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string; invitationId: string }> }
) {
    try {
        const { memorialId, invitationId } = await params;
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('user_id')
            .eq('id', memorialId)
            .single();

        if (memorial?.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Only the archive owner can cancel invitations' },
                { status: 403 }
            );
        }

        const { data: invitation } = await supabaseAdmin
            .from('witness_invitations')
            .select('id, status, memorial_id')
            .eq('id', invitationId)
            .maybeSingle();

        if (!invitation || invitation.memorial_id !== memorialId) {
            return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
        }

        if (invitation.status !== 'pending') {
            return NextResponse.json(
                { error: 'Only pending invitations can be cancelled' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('witness_invitations')
            .delete()
            .eq('id', invitationId);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
