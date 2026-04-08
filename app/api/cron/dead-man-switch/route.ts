// app/api/cron/dead-man-switch/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/sender';
import { getProofOfLifeEmail, getSuccessorAlertEmail } from '@/lib/email/templates';
import { getSupabaseAdmin } from '@/lib/apiAuth';
import {
    DMS_INACTIVITY_ALERT_DAYS,
    DMS_INACTIVITY_WARNING_DAYS,
    DMS_WARNING_RESEND_INTERVAL_DAYS,
} from '@/lib/constants';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export async function GET(request: NextRequest) {
    // Security: cron secret is REQUIRED. Previously this check was commented
    // out for "dev/demo" — that left an unauthenticated endpoint that could
    // trigger emails to every user with DMS enabled. Now it always rejects
    // missing/invalid secrets, even in development.
    if (!process.env.CRON_SECRET) {
        console.error('[cron/dead-man-switch] CRON_SECRET not configured');
        return NextResponse.json(
            { error: 'Cron not configured' },
            { status: 500 }
        );
    }

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    try {
        const now = new Date();

        // 1. Fetch users with Dead Man's Switch ENABLED
        const { data: users, error } = await supabaseAdmin
            .from('users')
            .select('id, email, full_name, last_active_at, verification_sent_at, created_at')
            .eq('dead_mans_switch_enabled', true);

        if (error) throw error;
        if (!users || users.length === 0) {
            return NextResponse.json({ message: 'No users to process' });
        }

        const results = {
            warningsSent: 0,
            alertsSent: 0
        };

        for (const user of users) {
            const lastActive = new Date(user.last_active_at || user.created_at); // Fallback to created_at
            const diffDays = Math.ceil(
                Math.abs(now.getTime() - lastActive.getTime()) / MS_PER_DAY
            );

            // Case A: Successor Alert (More than 1 year + 90 days inactive)
            if (diffDays >= DMS_INACTIVITY_ALERT_DAYS) {
                // Fetch Successor
                const { data: successor } = await supabaseAdmin
                    .from('user_successors')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'accepted') // Only accepted successors
                    .order('created_at', { ascending: false }) // Get latest
                    .limit(1)
                    .single();

                if (successor) {
                    // Send Alert to Successor
                    await sendEmail({
                        to: successor.successor_email,
                        subject: `URGENT: Status Check for ${user.full_name || 'Account Owner'}`,
                        html: getSuccessorAlertEmail(
                            successor.successor_name,
                            user.full_name || 'the account owner',
                            `${process.env.NEXT_PUBLIC_BASE_URL}/succession/request`
                        )
                    });
                    results.alertsSent++;
                }
            }
            // Case B: User Warning (More than 1 year inactive)
            else if (diffDays >= DMS_INACTIVITY_WARNING_DAYS) {
                // Avoid spamming the user — only re-send if it has been long
                // enough since the last warning email.
                const lastSent = user.verification_sent_at ? new Date(user.verification_sent_at) : null;
                const daysSinceLastSend = lastSent
                    ? Math.ceil((now.getTime() - lastSent.getTime()) / MS_PER_DAY)
                    : Number.POSITIVE_INFINITY;

                if (daysSinceLastSend > DMS_WARNING_RESEND_INTERVAL_DAYS) {
                    // Send Warning to User
                    await sendEmail({
                        to: user.email,
                        subject: 'ULUMAE: Annual Verification Required',
                        html: getProofOfLifeEmail(
                            user.full_name || 'Valued Member',
                            `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?checkin=true`
                        )
                    });

                    // Update verification_sent_at
                    await supabaseAdmin
                        .from('users')
                        .update({ verification_sent_at: new Date().toISOString() })
                        .eq('id', user.id);

                    results.warningsSent++;
                }
            }
        }

        return NextResponse.json({ success: true, ...results });

    } catch (err: any) {
        console.error('Cron job failed:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}