// app/api/finalize-upgrade/route.ts
// Handles plan upgrade finalization: updates mode on EXISTING memorial
// CRITICAL: This must NEVER create a new memorial entity.
// It only changes the mode field to preserve all existing data.
import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { safeLogMemorialActivity } from '@/lib/activityLog';
import { getSupabaseAdmin } from '@/lib/apiAuth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

const PLAN_PRICES: Record<string, number> = {
    personal: 1470,
    family: 2940,
    concierge: 6300,
};

export async function POST(request: NextRequest) {
    try {
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { memorialId, targetPlan } = await request.json();

        if (!memorialId || !targetPlan) {
            return NextResponse.json({ error: 'Missing memorialId or targetPlan' }, { status: 400 });
        }

        // Verify the memorial belongs to this user
        const { data: memorial, error: fetchError } = await supabaseAdmin
            .from('memorials')
            .select('id, mode, user_id, paid, step1, step2, step3, step4, step5, step6, step7, step8, step9')
            .eq('id', memorialId)
            .single();

        if (fetchError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Not authorized to upgrade this memorial' }, { status: 403 });
        }

        // IDEMPOTENCY: If already upgraded to this plan, return success without re-processing
        if (memorial.mode === targetPlan) {
            console.log(`[FinalizeUpgrade] Memorial ${memorialId} already at ${targetPlan} — idempotent no-op.`);
            return NextResponse.json({
                success: true,
                message: `Already at ${targetPlan}`,
                previousMode: targetPlan,
                newMode: targetPlan,
                dataPreserved: true,
            });
        }

        const previousMode = memorial.mode;

        // Only update the mode and payment fields — PRESERVE ALL DATA
        const updatePayload: Record<string, any> = {
            mode: targetPlan,
            plan_type: targetPlan,
            amount_paid: PLAN_PRICES[targetPlan] || 0,
            upgraded_from: previousMode,
            upgraded_at: new Date().toISOString(),
            // Keep paid=true, keep payment_confirmed_at
            // DO NOT touch step1-step9, full_name, profile_photo_url, etc.
        };

        const { error: updateError } = await supabaseAdmin
            .from('memorials')
            .update(updatePayload)
            .eq('id', memorialId);

        if (updateError) {
            console.error('[FinalizeUpgrade] Update error:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // Create a version snapshot recording the upgrade
        const { error: snapshotError } = await supabaseAdmin
            .from('memorial_versions')
            .insert({
                memorial_id: memorialId,
                version_number: 0, // will be auto-incremented if the table supports it
                snapshot_data: { ...memorial, mode: targetPlan },
                is_full_snapshot: true,
                steps_modified: [],
                change_type: 'manual',
                change_summary: `Plan upgraded from ${memorial.mode} to ${targetPlan} — all existing data preserved`,
                change_reason: 'plan_upgrade',
                created_by: user.id,
                created_by_name: 'Owner',
                created_at: new Date().toISOString(),
            });

        if (snapshotError) {
            console.error('[FinalizeUpgrade] Snapshot error:', snapshotError);
            // Non-blocking — don't fail the upgrade for a snapshot issue
        }

        console.log(`[FinalizeUpgrade] Memorial ${memorialId} upgraded: ${memorial.mode} → ${targetPlan}. All data preserved.`);

        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId,
            action: 'plan_upgraded',
            summary: `Plan upgraded from ${memorial.mode} to ${targetPlan}.`,
            actorUserId: user.id,
            actorEmail: user.email ?? null,
            details: {
                previousMode: memorial.mode,
                targetPlan,
            },
        });

        return NextResponse.json({
            success: true,
            message: `Upgrade complete: ${memorial.mode} → ${targetPlan}`,
            previousMode: memorial.mode,
            newMode: targetPlan,
            dataPreserved: true,
        });
    } catch (error: any) {
        console.error('[FinalizeUpgrade] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
    }
}
