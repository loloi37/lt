import { MemorialData } from '@/types/memorial';
import { MemorialVersion, MemorialVersionChangeType } from '@/lib/versioning';

interface CreateVersionParams {
    memorialId: string;
    oldData: MemorialData;
    newData: MemorialData;
    changeReason?: string;
    changeType?: MemorialVersionChangeType;
}

async function parseJsonSafely(response: Response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

export async function createVersion({
    memorialId,
    oldData,
    newData,
    changeReason,
    changeType = 'manual',
}: CreateVersionParams): Promise<{ success: boolean; version?: MemorialVersion; error?: string }> {
    try {
        const response = await fetch(`/api/memorials/${memorialId}/versions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mode: 'diff',
                oldData,
                newData,
                changeReason,
                changeType,
            }),
        });

        const payload = await parseJsonSafely(response);
        if (!response.ok) {
            return { success: false, error: payload?.error || 'Could not record the change.' };
        }

        return { success: true, version: payload?.version };
    } catch (error: any) {
        console.error('Failed to create version:', error);
        return { success: false, error: error.message || 'Could not record the change.' };
    }
}

export async function createFullSnapshot({
    memorialId,
    data,
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
    changeType?: MemorialVersionChangeType;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(`/api/memorials/${memorialId}/versions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mode: 'snapshot',
                data,
                changeSummary,
                changeReason,
                changeType,
            }),
        });

        const payload = await parseJsonSafely(response);
        if (!response.ok) {
            return { success: false, error: payload?.error || 'Could not create the snapshot.' };
        }

        return { success: true };
    } catch (error: any) {
        console.error('Failed to create full snapshot:', error);
        return { success: false, error: error.message || 'Could not create the snapshot.' };
    }
}

export async function getVersionHistory(
    memorialId: string,
    limit = 50
): Promise<{ versions: MemorialVersion[]; error?: string }> {
    try {
        const response = await fetch(`/api/memorials/${memorialId}/versions?limit=${limit}`, {
            cache: 'no-store',
        });

        const payload = await parseJsonSafely(response);
        if (!response.ok) {
            return { versions: [], error: payload?.error || 'Could not load the version history.' };
        }

        return { versions: payload?.versions || [] };
    } catch (error: any) {
        console.error('Failed to get version history:', error);
        return { versions: [], error: error.message || 'Could not load the version history.' };
    }
}

export async function restoreVersion(
    memorialId: string,
    versionId: string,
    currentData: MemorialData,
    userId?: string,
    userName?: string,
): Promise<{ success: boolean; restoredData?: MemorialData; error?: string }> {
    try {
        const response = await fetch(`/api/memorials/${memorialId}/versions/${versionId}/restore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const payload = await parseJsonSafely(response);
        if (!response.ok) {
            return { success: false, error: payload?.error || 'Could not restore this version.' };
        }

        return {
            success: true,
            restoredData: (payload?.restoredData as MemorialData) || currentData,
        };
    } catch (error: any) {
        console.error('Failed to restore version:', error);
        return { success: false, error: error.message || 'Could not restore this version.' };
    }
}

export type { MemorialVersion };
