import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/sender';
import { getSuccessorInvitationEmail } from '@/lib/email/templates';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { getSupabaseAdmin } from '@/lib/apiAuth';

export async function POST(request: NextRequest) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = user.id;

        const { ownerName, successorName, successorEmail, relationship } = await request.json();

        if (!successorEmail || !successorName) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 1. Create record in DB
        const { data: successor, error: dbError } = await supabaseAdmin
            .from('user_successors')
            .insert([{
                user_id: userId,
                successor_name: successorName,
                successor_email: successorEmail,
                relationship: relationship,
                status: 'pending'
            }])
            .select()
            .single();

        if (dbError) throw dbError;

        // 2. Generate Link
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = request.headers.get('host');
        const acceptLink = `${protocol}://${host}/succession/accept/${successor.verification_token}`;

        // 3. Send Email
        await sendEmail({
            to: successorEmail,
            subject: `IMPORTANT: ${ownerName} has designated you as Archive Steward`,
            html: getSuccessorInvitationEmail(ownerName, successorName, acceptLink),
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Succession API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}