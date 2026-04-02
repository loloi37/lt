import { NextRequest, NextResponse } from 'next/server';
import { createFullSnapshot } from '@/lib/versionService';

export async function POST(request: NextRequest) {
    try {
        const { memorialId } = await request.json();

        if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
            console.error('[Finalize Payment] Invalid memorial ID:', memorialId);
            return NextResponse.json({
                error: 'Invalid memorial ID. Please create an archive first.'
            }, { status: 400 });
        }

        console.log('[Finalize Payment] Starting for memorial:', memorialId);

        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Fetch current memorial to check its mode
        const { data: currentMemorial, error: fetchCurrentError } = await supabaseAdmin
            .from('memorials')
            .select('mode, user_id')
            .eq('id', memorialId)
            .single();

        if (fetchCurrentError || !currentMemorial) {
            console.error('Memorial not found:', fetchCurrentError);
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // Build update payload — always mark paid and confirmed
        // If memorial was in draft mode, upgrade it to personal
        const updatePayload: Record<string, any> = {
            paid: true,
            payment_confirmed_at: new Date().toISOString(),
            // Refund eligibility: true by default, becomes false when status = 'published'
            refund_eligible: true,
        };

        // Store plan-specific pricing info
        if (currentMemorial.mode === 'draft' || currentMemorial.mode === 'personal') {
            updatePayload.plan_type = 'personal';
            updatePayload.amount_paid = 1470;
        } else if (currentMemorial.mode === 'family') {
            updatePayload.plan_type = 'family';
            updatePayload.amount_paid = 2940;
        }

        if (currentMemorial.mode === 'draft') {
            updatePayload.mode = 'personal';
            console.log('[Finalize Payment] Draft upgraded to Personal for memorial:', memorialId);
        }

        const { error: updateError } = await supabaseAdmin
            .from('memorials')
            .update(updatePayload)
            .eq('id', memorialId);

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // Fetch full memorial data for snapshot
        const { data: memorialData, error: fetchError } = await supabaseAdmin
            .from('memorials')
            .select('*')
            .eq('id', memorialId)
            .single();

        if (fetchError || !memorialData) {
            console.error('Fetch error after update:', fetchError);
            return NextResponse.json({ error: 'Memorial not found after update' }, { status: 404 });
        }

        // Create version snapshot
        const snapshotData = {
            memorial_id: memorialId,
            version_number: 1,
            snapshot_data: memorialData,
            is_full_snapshot: true,
            steps_modified: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            change_type: 'manual',
            change_summary: currentMemorial.mode === 'draft'
                ? 'Archive activated — Draft upgraded to Personal plan'
                : 'Archive activated — payment confirmed',
            change_reason: null,
            created_by: memorialData.user_id || null,
            created_by_name: 'Owner',
            created_at: new Date().toISOString()
        };

        const { error: snapshotError } = await supabaseAdmin
            .from('memorial_versions')
            .insert(snapshotData);

        if (snapshotError) {
            console.error('Snapshot creation failed:', snapshotError);
            // Don't block payment finalization if snapshot fails
        }

        return NextResponse.json({
            success: true,
            message: 'Payment finalized and snapshot created',
            upgradedFromDraft: currentMemorial.mode === 'draft',
        });

    } catch (error: any) {
        console.error('Finalize payment error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
