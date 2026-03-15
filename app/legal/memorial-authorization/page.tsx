'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This route has been replaced — the real authorization form is at /authorization/[memorialId]
// which is opened directly from the personal-confirmation and family-confirmation pages.
export default function LegalMemorialAuthorizationRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/preservation-gate');
    }, [router]);
    return null;
}
