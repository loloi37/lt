import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { MemorialData } from '@/types/memorial';
import { applyVersionSnapshot, detectChangedSteps } from '@/lib/versioning';
import {
    buildEditorActorLabel,
    insertVersionSnapshot,
} from '@/lib/versioningServer';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function buildMemorialData(record: any): MemorialData {
    return {
        step1: record.step1 || {},
        step2: record.step2 || {},
        step3: record.step3 || {},
        step4: record.step4 || {},
        step5: record.step5 || {},
        step6: record.step6 || {},
        step7: record.step7 || {},
        step8: record.step8 || {},
        step9: record.step9 || {},
        currentStep: 1,
        paid: record.paid ?? false,
        lastSaved: record.updated_at || null,
        completedSteps: record.completed_steps || [],
    } as MemorialData;
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ memorialId: string; versionId: string }> }
) {
    try {
        const { memorialId, versionId } = await params;
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: memorial, error: memorialError } = await supabaseAdmin
            .from('memorials')
            .select('id, user_id, paid, updated_at, completed_steps, step1, step2, step3, step4, step5, step6, step7, step8, step9')
            .eq('id', memorialId)
            .single();

        if (memorialError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found.' }, { status: 404 });
        }

        if (memorial.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Only the memorial owner can restore history.' },
                { status: 403 }
            );
        }

        const { data: version, error: versionError } = await supabaseAdmin
            .from('memorial_versions')
            .select('*')
            .eq('id', versionId)
            .eq('memorial_id', memorialId)
            .single();

        if (versionError || !version) {
            return NextResponse.json({ error: 'Version not found.' }, { status: 404 });
        }

        const currentData = buildMemorialData(memorial);
        const restoredData = applyVersionSnapshot(currentData, version.snapshot_data || {});
        const changedSteps = detectChangedSteps(currentData, restoredData);
        const now = new Date().toISOString();

        const { error: updateError } = await supabaseAdmin
            .from('memorials')
            .update({
                step1: restoredData.step1,
                step2: restoredData.step2,
                step3: restoredData.step3,
                step4: restoredData.step4,
                step5: restoredData.step5,
                step6: restoredData.step6,
                step7: restoredData.step7,
                step8: restoredData.step8,
                step9: restoredData.step9,
                completed_steps: restoredData.completedSteps || [],
                full_name: restoredData.step1.fullName,
                birth_date: restoredData.step1.birthDate || null,
                death_date: restoredData.step1.deathDate || null,
                profile_photo_url: restoredData.step1.profilePhotoPreview || null,
                cover_photo_url: restoredData.step8?.coverPhotoPreview || null,
                updated_at: now,
            })
            .eq('id', memorialId);

        if (updateError) {
            throw updateError;
        }

        await insertVersionSnapshot({
            supabaseAdmin,
            memorialId,
            snapshotData: restoredData,
            stepsModified: changedSteps,
            createdBy: user.id,
            createdByName: buildEditorActorLabel('owner', user.email),
            changeSummary: `Restored the archive to version #${version.version_number}`,
            changeReason: 'restore_action',
            changeType: 'restore',
            isRestoredFrom: version.id,
        });

        return NextResponse.json({
            success: true,
            restoredData,
        });
    } catch (error: any) {
        console.error('[versions-restore]', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
