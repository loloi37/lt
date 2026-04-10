import { NextRequest, NextResponse } from 'next/server';
import { requireUser, getSupabaseAdmin } from '@/lib/apiAuth';
import { safeLogMemorialActivity } from '@/lib/activityLog';

export async function POST(request: NextRequest) {
    try {
        // AUTH: Derive identity from session — never trust requesterId from body
        const auth = await requireUser();
        if (!auth.ok) return auth.response;

        const { user } = auth;
        const admin = getSupabaseAdmin();

        const { memorialId } = await request.json();

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
        }

        // Verify the memorial exists and is a family plan
        const { data: memorial, error: memError } = await admin
            .from('memorials')
            .select('id, user_id, mode')
            .eq('id', memorialId)
            .single();

        if (memError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (memorial.mode !== 'family') {
            return NextResponse.json({ error: 'Collaboration requests are only available for Family plan archives' }, { status: 400 });
        }

        // Don't allow the owner to request collaboration on their own memorial
        if (memorial.user_id === user.id) {
            return NextResponse.json({ error: 'You are already the owner of this memorial' }, { status: 400 });
        }

        // Check for existing pending access request to prevent duplicates
        const { data: existingRequest } = await admin
            .from('memorial_access_requests')
            .select('id')
            .eq('memorial_id', memorialId)
            .eq('requester_user_id', user.id)
            .eq('status', 'pending')
            .maybeSingle();

        if (existingRequest) {
            return NextResponse.json({ error: 'You already have a pending request for this memorial' }, { status: 409 });
        }

        // Create a proper access request — not a fake contribution
        const { error: insertError } = await admin
            .from('memorial_access_requests')
            .insert({
                memorial_id: memorialId,
                requester_user_id: user.id,
                requested_role: 'co_guardian',
                request_message: 'Requested to join as a Co-Guardian.',
                status: 'pending',
            });

        if (insertError) throw insertError;

        await safeLogMemorialActivity(admin, {
            memorialId,
            action: 'access_request_created',
            summary: 'A collaboration request was submitted.',
            actorUserId: user.id,
            actorEmail: user.email ?? null,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
