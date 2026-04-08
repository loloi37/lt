// app/api/memorials/[memorialId]/access-request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';
import { hasPermission, resolveArchivePermissionContext } from '@/lib/archivePermissions';
import { safeLogMemorialActivity } from '@/lib/activityLog';

// Initialize Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ memorialId: string }> }
) {
    try {
        const { memorialId } = await params;
        const { requestMessage } = await req.json();

        // 1. AUTHENTICATE CALLER
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. VALIDATE MEMORIAL & PLAN
        // Only Family Plan memorials support the "Request Access" flow
        const { data: memorial, error: memError } = await supabaseAdmin
            .from('memorials')
            .select('mode, full_name')
            .eq('id', memorialId)
            .single();

        if (memError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (memorial.mode !== 'family') {
            return NextResponse.json({ error: 'Access requests are only available for Family Plan archives' }, { status: 400 });
        }

        // 3. CHECK IF ALREADY A MEMBER
        const { data: existingRole } = await supabaseAdmin
            .from('user_memorial_roles')
            .select('id')
            .eq('memorial_id', memorialId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existingRole) {
            return NextResponse.json({ error: 'You are already a member of this archive' }, { status: 400 });
        }

        // 4. CHECK FOR EXISTING PENDING REQUEST
        const { data: existingRequest } = await supabaseAdmin
            .from('memorial_access_requests')
            .select('id')
            .eq('memorial_id', memorialId)
            .eq('requester_user_id', user.id)
            .eq('status', 'pending')
            .maybeSingle();

        if (existingRequest) {
            return NextResponse.json({ error: 'You already have a pending request for this archive' }, { status: 400 });
        }

        // 5. CREATE THE REQUEST
        const { error: insertError } = await supabaseAdmin
            .from('memorial_access_requests')
            .insert({
                memorial_id: memorialId,
                requester_user_id: user.id,
                requested_role: 'witness', // Default requested role
                request_message: requestMessage || '',
                status: 'pending'
            });

        if (insertError) throw insertError;
        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId,
            action: 'access_request_created',
            summary: 'A family access request was submitted.',
            actorUserId: user.id,
            actorEmail: user.email ?? null,
            details: {
                requestedRole: 'witness',
            },
        });

        return NextResponse.json({ success: true, message: 'Request submitted successfully' });

    } catch (error: any) {
        console.error('[ACCESS_REQUEST_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(
    req: NextRequest,
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

        if (!permission.memorialExists || !permission.context) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (!hasPermission(permission.context, 'approve_access_requests')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { data: requests, error } = await supabaseAdmin
            .from('memorial_access_requests')
            .select('id, requester_user_id, requested_role, request_message, status, created_at')
            .eq('memorial_id', memorialId)
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (error) {
            throw error;
        }

        const enriched = await Promise.all(
            (requests || []).map(async (request) => {
                const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(request.requester_user_id);
                return {
                    id: request.id,
                    requesterUserId: request.requester_user_id,
                    email: authUser.user?.email || 'Unknown',
                    requestedRole: request.requested_role,
                    requestMessage: request.request_message || '',
                    status: request.status,
                    createdAt: request.created_at,
                };
            })
        );

        return NextResponse.json({ requests: enriched });
    } catch (error: any) {
        console.error('[ACCESS_REQUEST_LIST_ERROR]', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
