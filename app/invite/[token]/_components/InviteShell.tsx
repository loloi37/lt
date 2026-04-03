// app/invite/[token]/_components/InviteShell.tsx
'use client';

import { useState } from 'react';
import InvitePreview from './InvitePreview';
import InviteAuthStep from './InviteAuthStep';
import InviteAcceptance from './InviteAcceptance';
import InviteTerminal from './InviteTerminal';

export default function InviteShell({ initialData, token }: any) {
    // Step machine: 'preview' -> 'auth' -> 'acceptance'
    const [step, setStep] = useState<string>(
        initialData.invitation.isExpired ? 'terminal' :
            initialData.invitation.status !== 'pending' ? 'terminal' :
                initialData.isAuthenticated ? 'acceptance' : 'preview'
    );

    const [authStatus, setAuthStatus] = useState(initialData.isAuthenticated);

    // Determine terminal reason if needed
    const terminalReason = initialData.invitation.isExpired ? 'EXPIRED' :
        initialData.invitation.status === 'declined' ? 'DECLINED' :
            initialData.invitation.status === 'accepted' ? 'USED_BY_OTHER' : null;

    if (step === 'terminal' || terminalReason) {
        return (
            <InviteTerminal
                reason={terminalReason || 'NOT_FOUND'}
                meta={{
                    inviterName: initialData.invitation.inviterName,
                    inviteeEmail: initialData.invitation.inviteeEmail
                }}
            />
        );
    }

    if (step === 'preview') {
        return (
            <InvitePreview
                invitation={initialData.invitation}
                onContinue={() => setStep('auth')}
            />
        );
    }

    if (step === 'auth') {
        return (
            <InviteAuthStep
                invitation={initialData.invitation}
                onSuccess={() => {
                    setAuthStatus(true);
                    setStep('acceptance');
                }}
                onBack={() => setStep('preview')}
            />
        );
    }

    if (step === 'acceptance') {
        return (
            <InviteAcceptance
                invitation={initialData.invitation}
                token={token}
                onSuccess={(memorialId: string, role: string) => {
                    window.location.href = `/archive/${memorialId}/welcome?role=${role}`;
                }}
            />
        );
    }

    return null;
}