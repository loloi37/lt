'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface UserArchive {
    id: string;
    mode: 'draft' | 'personal' | 'family' | 'concierge';
    paid: boolean;
    status: 'draft' | 'published';
    fullName: string | null;
    profilePhotoUrl: string | null;
    updatedAt: string;
    paymentConfirmedAt: string | null;
}

export type UserPlan = 'none' | 'draft' | 'personal' | 'family' | 'concierge';

export interface AuthState {
    // Core auth
    authenticated: boolean;
    loading: boolean;
    user: { id: string; email: string } | null;

    // Plan & archives (server-validated)
    plan: UserPlan;
    hasPaid: boolean;
    archives: UserArchive[];

    // Actions
    revalidate: () => Promise<void>;
}

const defaultState: AuthState = {
    authenticated: false,
    loading: true,
    user: null,
    plan: 'none',
    hasPaid: false,
    archives: [],
    revalidate: async () => {},
};

const AuthContext = createContext<AuthState>(defaultState);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<Omit<AuthState, 'revalidate'>>({
        authenticated: false,
        loading: true,
        user: null,
        plan: 'none',
        hasPaid: false,
        archives: [],
    });
    const pathname = usePathname();
    const lastFetchRef = useRef<number>(0);
    const isFetchingRef = useRef(false);

    const fetchState = useCallback(async (force = false) => {
        // Debounce non-forced calls to avoid spam
        const now = Date.now();
        if (!force && now - lastFetchRef.current < 2000) return;
        // Never block forced calls (back-button, payment completion, etc.)
        // Only skip if a non-forced call and already fetching
        if (!force && isFetchingRef.current) return;

        isFetchingRef.current = true;
        try {
            const res = await fetch('/api/user/state', {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' },
            });
            if (!res.ok) throw new Error('State fetch failed');
            const data = await res.json();

            setState({
                authenticated: data.authenticated,
                loading: false,
                user: data.user,
                plan: data.plan || 'none',
                hasPaid: data.hasPaid || false,
                archives: data.archives || [],
            });
            lastFetchRef.current = Date.now();
        } catch (err) {
            console.error('[AuthProvider] State fetch error:', err);
            setState(prev => ({ ...prev, loading: false }));
        } finally {
            isFetchingRef.current = false;
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchState(true);
    }, [fetchState]);

    // Re-fetch when navigating to critical pages
    useEffect(() => {
        const criticalPaths = ['/dashboard', '/payment', '/choice-pricing', '/personal-confirmation', '/family-confirmation', '/payment-success'];
        const isCritical = criticalPaths.some(p => pathname.startsWith(p));
        if (isCritical) {
            fetchState(true);
        }
    }, [pathname, fetchState]);

    // Listen for browser back/forward button (popstate event)
    // This is the KEY fix: when the user hits back, the browser fires popstate
    // BEFORE React re-renders, so we force a revalidation immediately
    useEffect(() => {
        const handlePopState = () => {
            fetchState(true);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [fetchState]);

    // Listen for Supabase auth state changes (login/logout)
    useEffect(() => {
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
                fetchState(true);
            }
        });
        return () => subscription.unsubscribe();
    }, [fetchState]);

    // Listen for visibility change — force revalidate when tab becomes visible
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchState(true);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [fetchState]);

    // Listen for cross-window upgrade completion via BroadcastChannel
    useEffect(() => {
        try {
            const bc = new BroadcastChannel('lv-upgrade');
            bc.onmessage = (event) => {
                if (event.data?.type === 'upgrade-complete') {
                    fetchState(true);
                }
            };
            return () => bc.close();
        } catch (e) {
            // BroadcastChannel not supported in some browsers
        }
    }, [fetchState]);

    const contextValue: AuthState = {
        ...state,
        revalidate: () => fetchState(true),
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth(): AuthState {
    return useContext(AuthContext);
}

// ─── Utility: Get the dashboard path for a user based on their real state ────
export function getDashboardPath(state: AuthState): string {
    if (!state.authenticated || !state.user) return '/login';

    const paidArchive = state.archives.find(a => a.paid);
    if (paidArchive) {
        return `/dashboard/${paidArchive.mode}/${state.user.id}`;
    }

    const draftArchive = state.archives.find(a => !a.paid);
    if (draftArchive) {
        return `/dashboard/draft/${state.user.id}`;
    }

    return '/choice-pricing';
}
