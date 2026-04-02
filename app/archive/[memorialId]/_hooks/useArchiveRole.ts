'use client';
import { useState, useEffect } from 'react';

export interface ArchiveRoleData {
    userRole: 'witness' | 'co_guardian' | 'owner';
    plan: 'personal' | 'family';
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
        status: 'pending_approval' | 'approved' | 'rejected';
        title: string;
        createdAt: string;
    }[];
    pendingCount: number;
}

export function useArchiveRole(memorialId: string) {
    const [data, setData] = useState<ArchiveRoleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memorialId) return;
        fetch(`/api/archive/${memorialId}/role-data`)
            .then(r => r.json())
            .then(d => {
                if (d.error) throw new Error(d.error);
                setData(d);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [memorialId]);

    return { data, loading, error };
}