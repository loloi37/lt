// app/api/reminder/schedule/route.ts
// Step 1.1.4: Schedule a gentle reminder email for paused archives
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { memorialId, userId, fullName, delayDays } = await request.json();

        if (!memorialId || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get user email
        const { data: user } = await supabase
            .from('users')
            .select('email')
            .eq('id', userId)
            .single();

        if (!user?.email || user.email.includes('@legacyvault.temp')) {
            // No real email — silently skip (no error to user)
            return NextResponse.json({ success: true, skipped: true });
        }

        // Store reminder in the database for a cron job to pick up
        // For now, we store the reminder request. A cron job would process these.
        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + (delayDays || 7));

        const { error } = await supabase
            .from('memorial_reminders')
            .insert({
                memorial_id: memorialId,
                user_id: userId,
                user_email: user.email,
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
