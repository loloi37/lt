import { SupabaseClient } from '@supabase/supabase-js';
import { MemorialData } from '@/types/memorial';
import {
    MemorialVersion,
    MemorialVersionChangeType,
    detectChangedSteps,
    extractVersionSnapshot,
    generateChangeSummary,
} from '@/lib/versioning';

const ALL_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface InsertVersionParams {
    supabaseAdmin: SupabaseClient;
    memorialId: string;
    snapshotData: Partial<MemorialData>;
    stepsModified: number[];
    createdBy?: string;
    createdByName?: string;
    changeSummary: string;
    changeReason?: string | null;
    changeType?: MemorialVersionChangeType;
    isRestoredFrom?: string | null;
}

interface DiffVersionParams {
    supabaseAdmin: SupabaseClient;
    memorialId: string;
    oldData: Partial<MemorialData>;
    newData: MemorialData;
    createdBy?: string;
    createdByName?: string;
    changeReason?: string | null;
    changeType?: MemorialVersionChangeType;
}

export function buildEditorActorLabel(role: 'owner' | 'co_guardian', email?: string | null) {
    const roleLabel = role === 'owner' ? 'Owner' : 'Co-Guardian';
    return email ? `${roleLabel} • ${email}` : roleLabel;
}

export async function getNextVersionNumber(supabaseAdmin: SupabaseClient, memorialId: string) {
    const { data, error } = await supabaseAdmin.rpc('get_next_version_number', {
        p_memorial_id: memorialId,
    });

    if (!error && typeof data === 'number') {
        return data;
    }

    const { data: latest, error: latestError } = await supabaseAdmin
        .from('memorial_versions')
        .select('version_number')
        .eq('memorial_id', memorialId)
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (latestError) {
        throw latestError;
    }

    return (latest?.version_number || 0) + 1;
}

export async function insertVersionSnapshot({
    supabaseAdmin,
    memorialId,
    snapshotData,
    stepsModified,
    createdBy,
    createdByName,
    changeSummary,
    changeReason = null,
    changeType = 'manual',
    isRestoredFrom = null,
}: InsertVersionParams) {
    const versionNumber = await getNextVersionNumber(supabaseAdmin, memorialId);

    const { data, error } = await supabaseAdmin
        .from('memorial_versions')
        .insert({
            memorial_id: memorialId,
            version_number: versionNumber,
            created_by: createdBy || null,
            created_by_name: createdByName || null,
            change_summary: changeSummary,
            change_reason: changeReason,
            change_type: changeType,
            steps_modified: stepsModified.length > 0 ? stepsModified : ALL_STEPS,
            snapshot_data: extractVersionSnapshot(snapshotData),
            is_full_snapshot: true,
            is_restored_from: isRestoredFrom,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as MemorialVersion;
}

export async function createVersionFromDiff({
    supabaseAdmin,
    memorialId,
    oldData,
    newData,
    createdBy,
    createdByName,
    changeReason = null,
    changeType = 'manual',
}: DiffVersionParams) {
    const stepsModified = detectChangedSteps(oldData, newData);

    if (stepsModified.length === 0) {
        return { version: null, stepsModified };
    }

    const version = await insertVersionSnapshot({
        supabaseAdmin,
        memorialId,
        snapshotData: newData,
        stepsModified,
        createdBy,
        createdByName,
        changeSummary: generateChangeSummary(oldData, newData, stepsModified),
        changeReason,
        changeType,
    });

    return { version, stepsModified };
}
