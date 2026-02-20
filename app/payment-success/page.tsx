// app/payment-success/page.tsx
'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const memorialId = searchParams.get('id');
    // plan comes from the Stripe success_url we set: ?plan=personal or ?plan=family
    const planParam = searchParams.get('plan') || 'personal';

    useEffect(() => {
        const finalizePayment = async () => {
            if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
                console.error('No valid memorial ID');
                alert('Payment successful, but no archive was created. Please contact support with your payment confirmation.');
                return;
            }

            try {
                console.log('Calling finalize-payment API for:', memorialId);
                const response = await fetch('/api/finalize-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ memorialId }),
                });

                const result = await response.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                console.log("Archive successfully activated:", result.message);

                // Redirect to the correct dashboard.
                // Use plan from URL (set by create-checkout) rather than potentially stale localStorage.
                // Draft upgrades → plan=personal → /dashboard/personal/...
                setTimeout(() => {
                    const userId = localStorage.getItem('user-id');
                    // Normalise: 'personal' or 'family' — anything else defaults to 'personal'
                    const mode = planParam === 'family' ? 'family' : 'personal';

                    // Update localStorage so subsequent navigation is consistent
                    localStorage.setItem('legacy-vault-mode', mode);

                    if (userId) {
                        router.push(`/dashboard/${mode}/${userId}`);
                    } else {
                        router.push(`/create?id=${memorialId}`);
                    }
                }, 3000);

            } catch (err: any) {
                console.error("Finalization failed:", err);
                alert(`Payment successful, but finalization failed: ${err.message}. Please contact support.`);
            }
        };

        finalizePayment();
    }, [memorialId, planParam, router]);

    return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle className="text-sage" size={40} />
                </div>
                <h1 className="font-serif text-4xl text-charcoal mb-4">Payment Successful</h1>
                <p className="text-charcoal/60 mb-8 leading-relaxed">
                    We are finalizing your eternal archive. Please wait a moment while we remove the watermarks...
                </p>
                <div className="flex items-center justify-center gap-2 text-sage font-medium">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Redirecting to your dashboard...</span>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
