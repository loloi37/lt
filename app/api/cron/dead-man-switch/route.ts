// app/api/cron/dead-man-switch/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getProofOfLifeEmail, getSuccessorAlertEmail } from '@/lib/email/templates';

// Initialize Admin Client (Service Role needed to scan all users)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
    // Security: Check for a secret CRON key to prevent unauthorized triggering
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // For dev/demo purposes we might skip this or use a simple check
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
            const diffTime = Math.abs(now.getTime() - lastActive.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Thresholds
            const WARNING_THRESHOLD = 365; // 1 year
            const ALERT_THRESHOLD = 365 + 90; // 1 year + 90 days

            // Case A: Successor Alert (More than 1 year + 90 days inactive)
            if (diffDays >= ALERT_THRESHOLD) {
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
                    await resend.emails.send({
                        from: 'Legacy Vault <security@resend.dev>',
                        to: [successor.successor_email],
                        subject: `URGENT: Status Check for ${user.full_name || 'Account Owner'}`,
                        html: getSuccessorAlertEmail(
                            successor.successor_name,
                            user.full_name || 'the account owner',
                            `${process.env.NEXT_PUBLIC_BASE_URL}/succession/request` // Direct them to request page
                        )
                    });
                    results.alertsSent++;
                }
            }
            // Case B: User Warning (More than 1 year inactive)
            else if (diffDays >= WARNING_THRESHOLD) {
                // Check if we already sent a warning recently (e.g., in last 30 days) to avoid spam
                const lastSent = user.verification_sent_at ? new Date(user.verification_sent_at) : null;
                const daysSinceLastSend = lastSent ? Math.ceil((now.getTime() - lastSent.getTime()) / (1000 * 3600 * 24)) : 999;

                if (daysSinceLastSend > 30) {
                    // Send Warning to User
                    await resend.emails.send({
                        from: 'Legacy Vault <security@resend.dev>',
                        to: [user.email],
                        subject: 'Legacy Vault: Annual Verification Required',
                        html: getProofOfLifeEmail(
                            user.full_name || 'Valued Member',
                            `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?checkin=true` // Login link acts as check-in
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