// lib/versionService.ts
// Handles creating, querying, and restoring memorial versions
// Works with Supabase memorial_versions table

import { supabase } from '@/lib/supabase';
import { MemorialData } from '@/types/memorial';

// =============================================
// TYPES
// =============================================

export interface MemorialVersion {
    id: string;
    memorial_id: string;
    version_number: number;
    created_at: string;
    created_by: string | null;
    created_by_name: string | null;
    change_summary: string;
    change_reason: string | null;
    change_type: 'manual' | 'auto_save' | 'witness_contribution' | 'restore';
    steps_modified: number[];
    snapshot_data: Partial<MemorialData>;
    is_full_snapshot: boolean;
    is_restored_from: string | null;
}

interface CreateVersionParams {
    memorialId: string;
    oldData: MemorialData;
    newData: MemorialData;
    userId?: string;
    userName?: string;
    changeReason?: string;
    changeType?: MemorialVersion['change_type'];
}

// =============================================
// STEP NAMES for human-readable summaries
// =============================================

const STEP_NAMES: Record<number, string> = {
    1: 'Basic Information',
    2: 'Early Life & Childhood',
    3: 'Career & Education',
    4: 'Relationships & Family',
    5: 'Personality & Values',
    6: 'Life Story',
    7: 'Memories & Witnesses',
    8: 'Photos & Legacy',
    9: 'Videos',
};

// =============================================
// DETECT WHICH STEPS CHANGED
// =============================================

function detectChangedSteps(oldData: MemorialData, newData: MemorialData): number[] {
    const changed: number[] = [];

    const stepKeys: Array<{ step: number; key: keyof MemorialData }> = [
        { step: 1, key: 'step1' },
        { step: 2, key: 'step2' },
        { step: 3, key: 'step3' },
        { step: 4, key: 'step4' },
        { step: 5, key: 'step5' },
        { step: 6, key: 'step6' },
        { step: 7, key: 'step7' },
        { step: 8, key: 'step8' },
        { step: 9, key: 'step9' },
    ];

    for (const { step, key } of stepKeys) {
        const oldJson = JSON.stringify(oldData[key] || {});
        const newJson = JSON.stringify(newData[key] || {});
        if (oldJson !== newJson) {
            changed.push(step);
        }
    }

    return changed;
}

// =============================================
// GENERATE HUMAN-READABLE CHANGE SUMMARY
// =============================================

function generateChangeSummary(
    oldData: MemorialData,
    newData: MemorialData,
    stepsModified: number[]
): string {
    if (stepsModified.length === 0) return 'No changes detected';

    const parts: string[] = [];

    for (const step of stepsModified) {
        const name = STEP_NAMES[step] || `Step ${step}`;

        // Generate specific summaries per step
        switch (step) {
            case 1:
                if (oldData.step1.fullName !== newData.step1.fullName) {
                    parts.push(`Updated name to "${newData.step1.fullName}"`);
                } else {
                    parts.push(`Updated ${name}`);
                }
                break;

            case 6: {
                const oldWords = oldData.step6.biography.trim().split(/\s+/).length;
                const newWords = newData.step6.biography.trim().split(/\s+/).length;
                const diff = newWords - oldWords;
                if (diff > 0) {
                    parts.push(`Added ${diff} words to biography`);
                } else if (diff < 0) {
                    parts.push(`Edited biography (${Math.abs(diff)} words removed)`);
                } else {
                    parts.push('Edited biography');
                }
                break;
            }

            case 8: {
                const oldPhotos = oldData.step8.gallery?.length || 0;
                const newPhotos = newData.step8.gallery?.length || 0;
                const photoDiff = newPhotos - oldPhotos;
                if (photoDiff > 0) {
                    parts.push(`Added ${photoDiff} photo${photoDiff !== 1 ? 's' : ''}`);
                } else if (photoDiff < 0) {
                    parts.push(`Removed ${Math.abs(photoDiff)} photo${Math.abs(photoDiff) !== 1 ? 's' : ''}`);
                } else {
                    parts.push(`Updated ${name}`);
                }
                break;
            }

            case 9: {
                const oldVids = oldData.step9?.videos?.length || 0;
                const newVids = newData.step9?.videos?.length || 0;
                const vidDiff = newVids - oldVids;
                if (vidDiff > 0) {
                    parts.push(`Added ${vidDiff} video${vidDiff !== 1 ? 's' : ''}`);
                } else if (vidDiff < 0) {
                    parts.push(`Removed ${Math.abs(vidDiff)} video${Math.abs(vidDiff) !== 1 ? 's' : ''}`);
                } else {
                    parts.push(`Updated ${name}`);
                }
                break;
            }

            default:
                parts.push(`Updated ${name}`);
        }
    }

    return parts.join(', ');
}

// =============================================
// CREATE A VERSION
// =============================================

export async function createVersion({
    memorialId,
    oldData,
    newData,
    userId,
    userName,
    changeReason,
    changeType = 'manual',
}: CreateVersionParams): Promise<{ success: boolean; version?: MemorialVersion; error?: string }> {
    try {
        // Detect what changed
        const stepsModified = detectChangedSteps(oldData, newData);

        // Don't create a version if nothing changed
        if (stepsModified.length === 0) {
            return { success: true }; // Silent skip
        }

        // Generate summary
        const changeSummary = generateChangeSummary(oldData, newData, stepsModified);

        // Build snapshot — only save the changed steps (diff approach)
        const snapshotData: Record<string, any> = {};
        for (const step of stepsModified) {
            const key = `step${step}` as keyof MemorialData;
            snapshotData[key] = newData[key];
        }

        // Get next version number
        const { data: versionNum, error: numError } = await supabase
            .rpc('get_next_version_number', { p_memorial_id: memorialId });

        if (numError) throw numError;

        // Insert the version
        const { data: version, error: insertError } = await supabase
            .from('memorial_versions')
            .insert({
                memorial_id: memorialId,
                version_number: versionNum,
                created_by: userId || null,
                created_by_name: userName || null,
                change_summary: changeSummary,
                change_reason: changeReason || null,
                change_type: changeType,
                steps_modified: stepsModified,
                snapshot_data: snapshotData,
                is_full_snapshot: false,
            })
            .select()
            .single();

        if (insertError) throw insertError;

        return { success: true, version };
    } catch (err: any) {
        console.error('Failed to create version:', err);
        return { success: false, error: err.message };
    }
}

// =============================================
// CREATE A FULL SNAPSHOT (for milestones: publish, payment, restore)
// =============================================

export async function createFullSnapshot({
    memorialId,
    data,
    userId,
    userName,
    changeSummary,
    changeReason,
    changeType = 'manual',
}: {
    memorialId: string;
    data: MemorialData;
    userId?: string;
    userName?: string;
    changeSummary: string;
    changeReason?: string;
    changeType?: MemorialVersion['change_type'];
}): Promise<{ success: boolean; error?: string }> {
    try {
        const { data: versionNum } = await supabase
            .rpc('get_next_version_number', { p_memorial_id: memorialId });

        const { error } = await supabase
            .from('memorial_versions')
            .insert({
                memorial_id: memorialId,
                version_number: versionNum || 1,
                created_by: userId || null,
                created_by_name: userName || null,
                change_summary: changeSummary,
                change_reason: changeReason || null,
                change_type: changeType,
                steps_modified: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                snapshot_data: {
                    step1: data.step1,
                    step2: data.step2,
                    step3: data.step3,
                    step4: data.step4,
                    step5: data.step5,
                    step6: data.step6,
                    step7: data.step7,
                    step8: data.step8,
                    step9: data.step9,
                },
                is_full_snapshot: true,
            });

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        console.error('Failed to create full snapshot:', err);
        return { success: false, error: err.message };
    }
}

// =============================================
// GET VERSION HISTORY
// =============================================

export async function getVersionHistory(
    memorialId: string,
    limit = 50
): Promise<{ versions: MemorialVersion[]; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('memorial_versions')
            .select('*')
            .eq('memorial_id', memorialId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { versions: data || [] };
    } catch (err: any) {
        console.error('Failed to get version history:', err);
        return { versions: [], error: err.message };
    }
}

// =============================================
// GET SINGLE VERSION
// =============================================

export async function getVersion(
    versionId: string
): Promise<{ version: MemorialVersion | null; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('memorial_versions')
            .select('*')
            .eq('id', versionId)
            .single();

        if (error) throw error;
        return { version: data };
    } catch (err: any) {
        return { version: null, error: err.message };
    }
}

// =============================================
// RESTORE A VERSION
// =============================================

export async function restoreVersion(
    memorialId: string,
    versionId: string,
    currentData: MemorialData,
    userId?: string,
    userName?: string,
): Promise<{ success: boolean; restoredData?: MemorialData; error?: string }> {
    try {
        // 1. Get the version to restore
        const { version, error: fetchError } = await getVersion(versionId);
        if (fetchError || !version) throw new Error(fetchError || 'Version not found');

        // 2. Build restored data
        let restoredData: MemorialData;

        if (version.is_full_snapshot) {
            // Full snapshot — use it directly
            restoredData = {
                ...currentData, // Keep non-step fields (paid, etc.)
                ...version.snapshot_data,
            } as MemorialData;
        } else {
            // Partial snapshot — merge changed steps onto current data
            restoredData = { ...currentData };
            for (const [key, value] of Object.entries(version.snapshot_data)) {
                (restoredData as any)[key] = value;
            }
        }

        // 3. Update the memorial in DB
        const { error: updateError } = await supabase
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
                updated_at: new Date().toISOString(),
            })
            .eq('id', memorialId);

        if (updateError) throw updateError;

        // 4. Create a NEW version recording this restore
        await createFullSnapshot({
            memorialId,
            data: restoredData,
            userId,
            userName,
            changeSummary: `Restored to version #${version.version_number} from ${new Date(version.created_at).toLocaleDateString()}`,
            changeType: 'restore',
        });

        return { success: true, restoredData };
    } catch (err: any) {
        console.error('Failed to restore version:', err);
        return { success: false, error: err.message };
    }
}