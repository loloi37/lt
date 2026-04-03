// app/api/memorials/[memorialId]/invite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/sender';
import { getWitnessInvitationEmail } from '@/lib/email/templates';
import { WitnessRole } from '@/types/roles';

// Initialize Admin Client for sensitive DB operations
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

        // 1. AUTHENTICATE CALLER (Server-side session check)
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, role, personalMessage } = await req.json();

        // 2. VALIDATE INPUTS
        const VALID_ROLES: WitnessRole[] = ['witness', 'co_guardian', 'reader'];
        if (!VALID_ROLES.includes(role as WitnessRole)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // 3. PERMISSION CHECK: Is the caller the Owner or a Co-Guardian?
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('user_id, mode, full_name')
            .eq('id', memorialId)
            .single();

        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        const isOwner = memorial.user_id === user.id;

        const { data: callerRoleRecord } = await supabaseAdmin
            .from('user_memorial_roles')
            .select('role')
            .eq('memorial_id', memorialId)
            .eq('user_id', user.id)
            .single();

        const isCoGuardian = callerRoleRecord?.role === 'co_guardian';

        if (!isOwner && !isCoGuardian) {
            return NextResponse.json({ error: 'Forbidden: You do not have permission to invite members' }, { status: 403 });
        }

        // 4. ROLE CONSTRAINTS
        if (isCoGuardian && role === 'co_guardian') {
            return NextResponse.json({ error: 'Co-Guardians cannot invite other Co-Guardians.' }, { status: 403 });
        }

        if (role === 'co_guardian' && memorial.mode !== 'family') {
            return NextResponse.json({ error: 'Co-Guardian is a Family plan role only.' }, { status: 403 });
        }

        // 5. UPSERT LOGIC (Update existing pending or Create new)
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const { data: existingInvite } = await supabaseAdmin
            .from('witness_invitations')
            .select('id')
            .eq('memorial_id', memorialId)
            .eq('invitee_email', email.toLowerCase())
            .eq('status', 'pending')
            .maybeSingle();

        let invitationId: string;

        if (existingInvite) {
            const { data: updated, error: updateError } = await supabaseAdmin
                .from('witness_invitations')
                .update({
                    role,
                    personal_message: personalMessage,
                    expires_at: expiresAt,
                    inviter_name: user.email
                })
                .eq('id', existingInvite.id)
                .select()
                .single();

            if (updateError) throw updateError;
            invitationId = updated.id;
        } else {
            const { data: created, error: insertError } = await supabaseAdmin
                .from('witness_invitations')
                .insert({
                    memorial_id: memorialId,
                    inviter_name: user.email,
                    invitee_email: email.toLowerCase(),
                    role,
                    personal_message: personalMessage,
                    plan: memorial.mode === 'family' ? 'family' : 'personal',
                    expires_at: expiresAt
                })
                .select()
                .single();

            if (insertError) throw insertError;
            invitationId = created.id;
        }

        // 6. SEND EMAIL VIA BREVO (using your existing sender logic)
        const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invitationId}`;

        await sendEmail({
            to: email.toLowerCase(),
            subject: `An invitation to bear witness for ${memorial.full_name || 'a loved one'}`,
            html: getWitnessInvitationEmail(
                user.email!,
                memorial.full_name || 'their loved one',
                inviteLink,
                personalMessage
            )
        });

        return NextResponse.json({ success: true, invitationId });

    } catch (error: any) {
        console.error('[INVITE_API_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}