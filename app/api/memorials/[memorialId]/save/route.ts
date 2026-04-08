import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { MemorialData } from '@/types/memorial';
import {
    buildEditorActorLabel,
    createVersionFromDiff,
} from '@/lib/versioningServer';
import {
    hasArchivePermission,
    resolveArchivePermissionContext,
} from '@/lib/archivePermissions';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

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
    { params }: { params: Promise<{ memorialId: string }> }
) {
    try {
        const { memorialId } = await params;
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const memorialData = body?.memorialData as MemorialData | undefined;

        if (!memorialData?.step1?.fullName) {
            return NextResponse.json(
                { error: 'A memorial name is required before saving.' },
                { status: 400 }
            );
        }

        const [permission, memorialRes] = await Promise.all([
            resolveArchivePermissionContext(supabaseAdmin, memorialId, user.id),
            supabaseAdmin
                .from('memorials')
                .select('id, user_id, mode, status, slug, paid, updated_at, completed_steps, step1, step2, step3, step4, step5, step6, step7, step8, step9')
                .eq('id', memorialId)
                .single(),
        ]);

        if (!permission.memorialExists || memorialRes.error || !memorialRes.data) {
            return NextResponse.json({ error: 'Memorial not found.' }, { status: 404 });
        }

        const memorial = memorialRes.data;
        const isOwner = permission.context?.role === 'owner';
        const isCoGuardian = permission.context?.role === 'co_guardian';

        if (!permission.context || !hasArchivePermission(permission.context, 'edit_archive')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const oldData = buildMemorialData(memorial);
        const now = new Date().toISOString();

        const updatePayload = {
            step1: memorialData.step1,
            step2: memorialData.step2,
            step3: memorialData.step3,
            step4: memorialData.step4,
            step5: memorialData.step5,
            step6: memorialData.step6,
            step7: memorialData.step7,
            step8: memorialData.step8,
            step9: memorialData.step9,
            completed_steps: memorialData.completedSteps || [],
            full_name: memorialData.step1.fullName,
            birth_date: memorialData.step1.birthDate || null,
            death_date: memorialData.step1.deathDate || null,
            profile_photo_url: memorialData.step1.profilePhotoPreview || null,
            cover_photo_url: memorialData.step8?.coverPhotoPreview || null,
            slug: generateSlug(memorialData.step1.fullName) || memorial.slug || memorialId,
            mode: memorial.mode,
            status: memorial.status || 'draft',
            user_id: memorial.user_id,
            paid: memorialData.paid ?? memorial.paid ?? false,
            updated_at: now,
        };

        const { data: updatedMemorial, error: updateError } = await supabaseAdmin
            .from('memorials')
            .update(updatePayload)
            .eq('id', memorialId)
            .select('*')
            .single();

        if (updateError) {
            throw updateError;
        }

        let historyRecorded = false;
        let versionError: string | null = null;

        try {
            const actorName = buildEditorActorLabel(
                isOwner ? 'owner' : 'co_guardian',
                user.email
            );

            const { version } = await createVersionFromDiff({
                supabaseAdmin,
                memorialId,
                oldData,
                newData: memorialData,
                createdBy: user.id,
                createdByName: actorName,
                changeReason: isOwner ? 'owner_edit' : 'co_guardian_edit',
                changeType: 'manual',
            });

            historyRecorded = !!version;
        } catch (error: any) {
            console.error('[memorial-save] Version creation failed:', error);
            versionError = error.message || 'Version snapshot failed.';
        }

        return NextResponse.json({
            success: true,
            memorial: updatedMemorial,
            historyRecorded,
            versionError,
        });
    } catch (error: any) {
        console.error('[memorial-save]', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
