// app/payment-success/page.tsx
// Step 2.2: Post-payment ritual page — solemn and warm
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const memorialId = searchParams.get('id');
    const planParam = searchParams.get('plan') || 'personal';

    const [phase, setPhase] = useState<'finalizing' | 'sealed' | 'redirecting'>('finalizing');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const finalizePayment = async () => {
            if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
                setError('Payment successful, but no archive was found. Please contact support with your payment confirmation.');
                return;
            }

            try {
                const response = await fetch('/api/finalize-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ memorialId }),
                });

                const result = await response.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                // Phase 2: Show the "sealed" message
                setPhase('sealed');

                // After 4 seconds, begin redirect
                setTimeout(() => {
                    setPhase('redirecting');
                    const userId = localStorage.getItem('user-id');
                    const mode = planParam === 'family' ? 'family' : 'personal';
                    localStorage.setItem('legacy-vault-mode', mode);

                    setTimeout(() => {
                        if (userId) {
                            router.push(`/dashboard/${mode}/${userId}`);
                        } else {
                            router.push(`/create?id=${memorialId}`);
                        }
                    }, 2000);
                }, 4000);

            } catch (err: any) {
                console.error('Finalization failed:', err);
                setError(`Payment successful, but finalization encountered an issue: ${err.message}. Your archive is safe. Please contact support.`);
            }
        };

        finalizePayment();
    }, [memorialId, planParam, router]);

    if (error) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <p className="text-charcoal/60 mb-6 leading-relaxed">{error}</p>
                    <a
                        href="mailto:support@legacyvault.com"
                        className="text-sm text-charcoal/40 underline hover:text-charcoal transition-colors"
                    >
                        Contact support@legacyvault.com
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                {phase === 'finalizing' && (
                    <div className="animate-fadeIn">
                        <div className="w-16 h-16 border-2 border-sand/30 border-t-charcoal/40 rounded-full animate-spin mx-auto mb-8" />
                        <p className="text-charcoal/40 text-sm">
                            Sealing the archive...
                        </p>
                    </div>
                )}

                {phase === 'sealed' && (
                    <div className="animate-fadeIn">
                        <div className="w-20 h-20 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal/50">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <h1 className="font-serif text-4xl text-charcoal mb-4">
                            The archive is sealed.
                        </h1>
                        <p className="text-charcoal/40 leading-relaxed text-sm">
                            What you have built is now permanent.
                            It will endure, be shared, and be passed on.
                        </p>
                    </div>
                )}

                {phase === 'redirecting' && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-center gap-2 text-charcoal/25 text-xs">
                            <Loader2 size={14} className="animate-spin" />
                            <span>Taking you to your archive...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-sand/30 border-t-charcoal/40 rounded-full animate-spin" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
