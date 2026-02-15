// app/payment-success/page.tsx
'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';


function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const memorialId = searchParams.get('id'); // Get ID from URL

    useEffect(() => {
        const finalizePayment = async () => {
            if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
                console.error('No valid memorial ID');
                alert('Payment successful, but no archive was created. Please contact support with your payment confirmation.');
                return;
            }

            try {
                console.log('Calling finalize-payment API for:', memorialId);
                // Call our new SECURE server route
                const response = await fetch('/api/finalize-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ memorialId }),
                });

                const result = await response.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                // ✅ TOUT est fait côté serveur (update + snapshot)
                console.log("Archive successfully activated:", result.message);

                // Redirection to the correct Dashboard
                setTimeout(() => {
                    const mode = localStorage.getItem('legacy-vault-mode') || 'personal';
                    const userId = localStorage.getItem('user-id');

                    if (userId) {
                        router.push(`/dashboard/${mode}/${userId}`);
                    } else {
                        // Fallback to create if for some reason userId is missing
                        router.push(`/create?id=${memorialId}`);
                    }
                }, 3000);

            } catch (err: any) {
                console.error("Finalization failed:", err);
                alert(`Payment successful, but finalization failed: ${err.message}. Please contact support.`);
            }
        };

        finalizePayment();
    }, [memorialId, router]);

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
                    <span>Redirecting to your Crossroads...</span>
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
