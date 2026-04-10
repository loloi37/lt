// app/archive/[memorialId]/_hooks/useRoleSync.ts
'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getArchiveCapabilities, ArchivePlan } from '@/lib/archivePermissions';
import { WitnessRole } from '@/types/roles';

export function useRoleSync(
    memorialId: string,
    userId: string,
    currentRole: string,
    plan?: ArchivePlan
) {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        if (!memorialId || !userId) return;

        // Use the authoritative plan from server data, not inferred from pathname
        const resolvedPlan = plan || 'personal';

        const channel = supabase
            .channel(`role-sync:${memorialId}:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'user_memorial_roles',
                    filter: `memorial_id=eq.${memorialId}`,
                },
                (payload) => {
                    // Verify it's specifically for this user
                    if (payload.new.user_id !== userId) return;

                    const newRole = payload.new.role as WitnessRole;
                    if (newRole !== currentRole) {
                        // Fire a custom event that the RoleBanner + useArchiveRole listen to
                        window.dispatchEvent(new CustomEvent('ulumae:role-changed', {
                            detail: { memorialId, oldRole: currentRole, newRole }
                        }));

                        // Use the actual plan from server, not pathname-inferred
                        const nextCapabilities = getArchiveCapabilities(newRole, resolvedPlan);
                        if (pathname.includes('/steward') && !nextCapabilities.canReview) {
                            toast.error('Your updated role no longer includes steward access.');
                            router.replace(`/archive/${memorialId}`);
                            return;
                        }
                        if (pathname.includes('/contribute') && !nextCapabilities.canContribute) {
                            toast.error('Your updated role no longer includes contribution access.');
                            router.replace(`/archive/${memorialId}`);
                        }
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'user_memorial_roles',
                    filter: `memorial_id=eq.${memorialId}`,
                },
                (payload) => {
                    // If the row is gone, the user no longer has access
                    if (payload.old.user_id === userId) {
                        window.dispatchEvent(new CustomEvent('ulumae:access-revoked', {
                            detail: { memorialId }
                        }));

                        toast.error('Your access to this archive has been removed.');
                        router.replace(`/archive/${memorialId}/revoked`);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [memorialId, userId, currentRole, plan, pathname, router, supabase]);
}
