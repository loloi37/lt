// app/api/memorials/[memorialId]/access-request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';

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

        // 6. TODO: Notify Owner (Optional - could be handled by a DB Trigger later)

        return NextResponse.json({ success: true, message: 'Request submitted successfully' });

    } catch (error: any) {
        console.error('[ACCESS_REQUEST_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}