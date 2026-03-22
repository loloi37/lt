'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Sub-components (defined in sections below)
import InvitePreview from './_components/InvitePreview';
import InviteAcceptance from './_components/InviteAcceptance';
import InviteTerminal from './_components/InviteTerminal';
import InviteAuthStep from './_components/InviteAuthStep';

export type InviteStep =
    | 'loading'
    | 'preview'
    | 'auth'
    | 'acceptance'
    | 'joining'
    | 'terminal';

export type TerminalReason =
    | 'NOT_FOUND'
    | 'EXPIRED'
    | 'DECLINED'
    | 'USED_BY_OTHER'
    | 'MEMORIAL_DELETED'
    | 'ALREADY_JOINED';

export interface InvitationData {
    id: string;
    inviterName: string;
    inviteeEmail: string;
    role: 'witness' | 'co_guardian';
    personalMessage: string | null;
    plan: 'personal' | 'family';
    memorial: {
        id: string;
        fullName: string;
        birthDate: string | null;
        deathDate: string | null;
        profilePhotoUrl: string | null;
    };
}

export default function InvitePage({
    params
}: {
    params: Promise<{ token: string }>
}) {
    const unwrapped = use(params);
    const token = unwrapped.token;
    const router = useRouter();

    const [step, setStep] = useState<InviteStep>('loading');
    const [invitation, setInvitation] =
        useState<InvitationData | null>(null);
    const [terminalReason, setTerminalReason] =
        useState<TerminalReason | null>(null);
    const [terminalMeta, setTerminalMeta] =
        useState<Record<string, string>>({});
    const [isAuthenticated, setIsAuthenticated] =
        useState(false);

    useEffect(() => {
        initPage();
    }, [token]);

    const initPage = async () => {
        try {
            // 1. Check auth status in parallel with API call
            const supabase = createClient();
            const [
                { data: { user } },
                apiRes
            ] = await Promise.all([
                supabase.auth.getUser(),
                fetch(`/api/invite/${token}`)
            ]);

            const data = await apiRes.json();
            setIsAuthenticated(!!user);

            // 2. Route based on state
            switch (data.state) {
                case 'PENDING':
                    setInvitation(data.invitation);
                    // If authenticated, skip preview and go
                    // straight to acceptance
                    setStep(user ? 'acceptance' : 'preview');
                    break;

                case 'ALREADY_JOINED':
                    // Redirect directly to their archive
                    router.replace(
                        `/archive/${data.memorialId}`
                    );
                    break;

                case 'NOT_FOUND':
                case 'EXPIRED':
                case 'DECLINED':
                case 'USED_BY_OTHER':
                case 'MEMORIAL_DELETED':
                    setTerminalReason(data.state);
                    setTerminalMeta({
                        inviterName: data.inviterName || '',
                        inviteeEmail: data.inviteeEmail || ''
                    });
                    setStep('terminal');
                    break;

                default:
                    setTerminalReason('NOT_FOUND');
                    setStep('terminal');
            }
        } catch (err) {
            console.error('[InvitePage]', err);
            setTerminalReason('NOT_FOUND');
            setStep('terminal');
        }
    };

    const handleAuthSuccess = async () => {
        setIsAuthenticated(true);
        setStep('acceptance');
    };

    const handleJoinSuccess = (
        memorialId: string,
        role: string
    ) => {
        router.replace(
            `/archive/${memorialId}/welcome?role=${role}`
        );
    };

    // Loading state
    if (step === 'loading') {
        return (
            <div className="min-h-screen bg-ivory flex 
        items-center justify-center">
                <div className="w-10 h-10 border-2 
          border-sand/30 border-t-charcoal/40 
          rounded-full animate-spin" />
            </div>
        );
    }

    // Terminal states (expired, not found, etc.)
    if (step === 'terminal') {
        return (
            <InviteTerminal
                reason={terminalReason!}
                meta={terminalMeta}
            />
        );
    }

    // Unauthenticated preview
    if (step === 'preview' && invitation) {
        return (
            <InvitePreview
                invitation={invitation}
                onContinue={() => setStep('auth')}
            />
        );
    }

    // Auth step
    if (step === 'auth' && invitation) {
        return (
            <InviteAuthStep
                invitation={invitation}
                onSuccess={handleAuthSuccess}
                onBack={() => setStep('preview')}
            />
        );
    }

    // Acceptance screen
    if (step === 'acceptance' && invitation) {
        return (
            <InviteAcceptance
                invitation={invitation}
                token={token}
                onSuccess={handleJoinSuccess}
            />
        );
    }

    return null;
}