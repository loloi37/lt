import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getSuccessorInvitationEmail } from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { userId, ownerName, successorName, successorEmail, relationship } = await request.json();

        if (!userId || !successorEmail || !successorName) {
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
        await resend.emails.send({
            from: 'Legacy Vault <onboarding@resend.dev>', // Update with verified domain in production
            to: [successorEmail],
            subject: `IMPORTANT: ${ownerName} has designated you as Archive Steward`,
            html: getSuccessorInvitationEmail(ownerName, successorName, acceptLink),
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Succession API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}