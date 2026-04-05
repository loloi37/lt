import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { getInvitationLookup } from '@/lib/invitations';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        let currentUserId: string | null = null;
        try {
            const { user } = await createAuthenticatedClient();
            currentUserId = user?.id ?? null;
        } catch {
            currentUserId = null;
        }

        const lookup = await getInvitationLookup(token, currentUserId);
        const status = lookup.state === 'NOT_FOUND' ? 404 : 200;

        return NextResponse.json(lookup, { status });
    } catch (err: any) {
        console.error('[Invite API]', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
