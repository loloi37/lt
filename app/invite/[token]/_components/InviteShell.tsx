'use client';

import { useState, useEffect, useCallback } from 'react';
import InviteAuthStep from './InviteAuthStep';
import InviteAcceptance from './InviteAcceptance';
import { InvitationData } from '../page';
import { createClient } from '@/utils/supabase/client';

interface InviteShellProps {
    initialData: {
        invitation: InvitationData;
        isAuthenticated: boolean;
        currentUserEmail: string | null;
    };
    token: string;
}

export default function InviteShell({
    initialData,
    token
}: InviteShellProps) {
    const [authState, setAuthState] = useState<{
        isAuthenticated: boolean;
        currentUserEmail: string | null;
    }>({
        isAuthenticated: initialData.isAuthenticated,
        currentUserEmail: initialData.currentUserEmail,
    });
    const [checkingAuth, setCheckingAuth] = useState(true);
    const supabase = createClient();

    const checkAuth = useCallback(async () => {
        setCheckingAuth(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setAuthState({
                isAuthenticated: !!user,
                currentUserEmail: user?.email ?? null,
            });
        } catch {
            setAuthState({
                isAuthenticated: false,
                currentUserEmail: null,
            });
        } finally {
            setCheckingAuth(false);
        }
    }, [supabase]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-olive/10 via-surface-low to-warm-muted/10 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-warm-border/30 border-t-olive rounded-full animate-spin" />
            </div>
        );
    }

    if (!authState.isAuthenticated) {
        return (
            <InviteAuthStep
                invitation={initialData.invitation}
                token={token}
                onSuccess={() => {
                    checkAuth();
                }}
                onBack={() => {}}
            />
        );
    }

    return (
        <InviteAcceptance
            invitation={initialData.invitation}
            token={token}
            currentUserEmail={authState.currentUserEmail}
            onSuccess={(memorialId: string, role: string) => {
                window.location.href = `/archive/${memorialId}/welcome?role=${role}`;
            }}
        />
    );
}