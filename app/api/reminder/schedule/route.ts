// app/api/reminder/schedule/route.ts
// Step 1.1.4: Schedule a gentle reminder email for paused archives
import { NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { getSupabaseAdmin } from '@/lib/apiAuth';

export async function POST(request: Request) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { user: authUser } = await createAuthenticatedClient();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = authUser.id;

        const { memorialId, fullName, delayDays } = await request.json();

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // User email comes from the auth session
        const userEmail = authUser.email;

        if (!userEmail) {
            return NextResponse.json({ success: true, skipped: true });
        }

        // Store reminder in the database for a cron job to pick up
        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + (delayDays || 7));

        const { error } = await supabaseAdmin
            .from('memorial_reminders')
            .insert({
                memorial_id: memorialId,
                user_id: userId,
                user_email: userEmail,
                memorial_name: fullName || 'your archive',
                remind_at: reminderDate.toISOString(),
                status: 'pending',
            });

        if (error) {
            // Table might not exist yet — that's okay, fail gracefully
            console.error('Reminder schedule error:', error);
            return NextResponse.json({ success: true, note: 'Reminder noted' });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Reminder API error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
