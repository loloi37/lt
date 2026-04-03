'use client';
import { useState, useEffect } from 'react';
import { ArchiveCapabilities } from '@/lib/archivePermissions';

export interface ArchiveRoleData {
    currentUserId: string;
    userRole: 'witness' | 'co_guardian' | 'owner' | 'reader';
    plan: 'personal' | 'family';
    roleLabel: string;
    capabilities: ArchiveCapabilities;
    memorial: {
        id: string;
        fullName: string;
        birthDate: string | null;
        deathDate: string | null;
        profilePhotoUrl: string | null;
        userId: string;
    };
    myContributions: {
        id: string;
        type: 'memory' | 'photo' | 'video';
        status: 'pending_approval' | 'approved' | 'rejected' | 'needs_changes';
        title: string;
        createdAt: string;
        adminNotes: string | null;
        revisionCount: number;
    }[];
    pendingCount: number;
}

export function useArchiveRole(memorialId: string) {
    const [data, setData] = useState<ArchiveRoleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memorialId) return;
        const fetchRoleData = () => fetch(`/api/archive/${memorialId}/role-data`)
            .then(r => r.json())
            .then(d => {
                if (d.error) throw new Error(d.error);
                setData(d);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));

        fetchRoleData();

        const handleRoleChanged = (event: Event) => {
            const detail = (event as CustomEvent<{ memorialId: string }>).detail;
            if (detail?.memorialId === memorialId) {
                setLoading(true);
                fetchRoleData();
            }
        };

        window.addEventListener('ulumae:role-changed', handleRoleChanged);
        return () => window.removeEventListener('ulumae:role-changed', handleRoleChanged);
    }, [memorialId]);

    return { data, loading, error };
}
