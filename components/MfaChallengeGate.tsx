'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

const SKIP_PATHS = ['/login', '/signup', '/two-factor', '/auth/callback'];

export default function MfaChallengeGate() {
    const auth = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        const checkTwoFactor = async () => {
            if (auth.loading || !auth.authenticated) {
                return;
            }

            if (SKIP_PATHS.some((path) => pathname.startsWith(path))) {
                return;
            }

            try {
                const response = await fetch('/api/security/two-factor/state', {
                    cache: 'no-store',
                });
                const payload = await response.json();

                if (!response.ok || cancelled) {
                    return;
                }

                if (payload.requiresChallenge) {
                    const currentPath = `${window.location.pathname}${window.location.search}`;
                    router.replace(`/two-factor?next=${encodeURIComponent(currentPath)}`);
                }
            } catch (error) {
                console.error('[MfaChallengeGate]', error);
            }
        };

        checkTwoFactor();

        return () => {
            cancelled = true;
        };
    }, [auth.authenticated, auth.loading, pathname, router]);

    return null;
}
