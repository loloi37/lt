'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface UserArchive {
    id: string;
    state: 'creating' | 'private' | 'live' | 'preserved';
    paid: boolean;
    fullName: string | null;
    profilePhotoUrl: string | null;
    updatedAt: string;
}

export type UserPlan = 'none' | 'creating' | 'active';

export interface AuthState {
    authenticated: boolean;
    loading: boolean;
    user: { id: string; email: string } | null;
    plan: UserPlan;
    hasPaid: boolean;
    archives: UserArchive[];
    revalidate: () => Promise<void>;
}

const defaultState: AuthState = {
    authenticated: false,
    loading: true,
    user: null,
    plan: 'none',
    hasPaid: false,
    archives: [],
    revalidate: async () => { },
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
        const now = Date.now();
        if (!force && now - lastFetchRef.current < 2000) return;
        if (!force && isFetchingRef.current) return;

        isFetchingRef.current = true;
        try {
            const res = await fetch('/api/user/state', {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' },
            });
            if (!res.ok) throw new Error('State fetch failed');
            const data = await res.json();

            // Map server response to simplified plan model
            let plan: UserPlan = 'none';
            if (data.hasPaid || data.plan === 'personal' || data.plan === 'family' || data.plan === 'concierge') {
                plan = 'active';
            } else if (data.archives?.length > 0) {
                plan = 'creating';
            }

            setState({
                authenticated: data.authenticated,
                loading: false,
                user: data.user,
                plan,
                hasPaid: data.hasPaid || false,
                archives: (data.archives || []).map((a: any) => ({
                    id: a.id,
                    state: a.status === 'published' ? 'live' : (a.paid ? 'live' : 'creating'),
                    paid: a.paid,
                    fullName: a.fullName,
                    profilePhotoUrl: a.profilePhotoUrl,
                    updatedAt: a.updatedAt,
                })),
            });
            lastFetchRef.current = Date.now();
        } catch (err) {
            console.error('[AuthProvider] State fetch error:', err);
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setState(prev => ({
                        ...prev,
                        loading: false,
                        authenticated: true,
                        user: { id: user.id, email: user.email || '' },
                    }));
                } else {
                    setState(prev => ({ ...prev, loading: false }));
                }
            } catch {
                setState(prev => ({ ...prev, loading: false }));
            }
        } finally {
            isFetchingRef.current = false;
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchState(true);
    }, [fetchState]);

    // Re-fetch on critical pages
    useEffect(() => {
        const criticalPaths = ['/dashboard', '/payment', '/payment-success', '/create', '/preservation-gate'];
        const isCritical = criticalPaths.some(p => pathname.startsWith(p));
        if (isCritical) {
            fetchState(true);
        }
    }, [pathname, fetchState]);

    // Re-fetch on browser back/forward
    useEffect(() => {
        const handlePopState = () => fetchState(true);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [fetchState]);

    // Re-fetch on auth state change
    useEffect(() => {
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
                fetchState(true);
            }
        });
        return () => subscription.unsubscribe();
    }, [fetchState]);

    // Re-fetch on tab visibility
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') fetchState(true);
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
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

// ─── Utility: Dashboard path ────────────────────────────────────────────────
export function getDashboardPath(state: AuthState): string {
    if (!state.authenticated || !state.user) return '/login';
    return '/dashboard';
}
