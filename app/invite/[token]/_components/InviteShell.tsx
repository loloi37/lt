'use client';

import { useState } from 'react';
import InvitePreview from './InvitePreview';
import InviteAuthStep from './InviteAuthStep';
import InviteAcceptance from './InviteAcceptance';
import { InvitationData } from '../page';

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
    const [step, setStep] = useState<string>(
        initialData.isAuthenticated ? 'acceptance' : 'auth'
    );

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
                onSuccess={() => setStep('acceptance')}
                onBack={() => setStep('preview')}
            />
        );
    }

    return (
        <InviteAcceptance
            invitation={initialData.invitation}
            token={token}
            currentUserEmail={initialData.currentUserEmail}
            onSuccess={(memorialId: string, role: string) => {
                window.location.href = `/archive/${memorialId}/welcome?role=${role}`;
            }}
        />
    );
}
