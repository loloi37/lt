// app/family-confirmation/page.tsx
'use client';
import { useState } from 'react';
import { ArrowLeft, Check, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FamilyConfirmationPage() {
    const router = useRouter(); // <--- ADD THIS LINE
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
    if (!acceptedTerms) {
        alert('Please accept the general conditions to continue');
        return;
    }

    setIsProcessing(true);

    try {
        let memorialId = localStorage.getItem('current-memorial-id');

        // Verify the cached memorial actually exists in DB (guard against stale localStorage)
        if (memorialId && memorialId !== 'null' && memorialId !== 'undefined') {
            const { data: existing } = await supabase
                .from('memorials')
                .select('id')
                .eq('id', memorialId)
                .maybeSingle();
            if (!existing) {
                memorialId = null;
                localStorage.removeItem('current-memorial-id');
            }
        }

        // Initialize empty memorial if none exists (existing logic)
        if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
            const userId = localStorage.getItem('user-id');
            const { data, error: insertError } = await supabase
                .from('memorials')
                .insert({
                    user_id: userId,
                    slug: `family-memorial-${Date.now()}`,
                    paid: false,
                    mode: 'family' // Ensure mode is set
                })
                .select()
                .single();

            if (insertError) throw insertError;
            memorialId = data.id;
            localStorage.setItem('current-memorial-id', memorialId!);
        }

        // 1. Call Checkout API
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                memorialId: memorialId,
                plan: 'Family',
                amount: 3000, // $3,000
            }),
        });

        const data = await response.json();

        // 2. STRICT BARRIER CHECK (Catching the security block)
        if (!response.ok) {
            if (data.code === 'LEGAL_AUTH_REQUIRED') {
                // Redirect to the authorization page for this specific ID
                router.push(`/authorization/${memorialId}?type=account&redirect=family`);
                return;
            }
            throw new Error(data.error || 'Payment initialization failed');
        }

        // 3. Proceed to Stripe
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error('No checkout URL returned');
        }
    } catch (error: any) {
        console.error('Payment error:', error);
        alert(error.message || 'Payment failed. Please try again.');
    } finally {
        setIsProcessing(false);
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-terracotta/10 via-ivory to-sage/10">
            {/* Header */}
            <div className="border-b border-sand/30 bg-white/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link
                        href="/choice-pricing"
                        className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to plans</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl text-charcoal mb-4">
                        Confirm Your Order
                    </h1>
                    <p className="text-lg text-charcoal/70">
                        Family Plan - $3,000
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl border border-sand/30 shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-charcoal mb-6">Order Summary</h2>

                    {/* Lorem Ipsum Content */}
                    <div className="prose max-w-none mb-8">
                        <p className="text-charcoal/70 leading-relaxed mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p className="text-charcoal/70 leading-relaxed mb-4">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p className="text-charcoal/70 leading-relaxed mb-4">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                        <p className="text-charcoal/70 leading-relaxed">
                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                        </p>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-sand/30 pt-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-charcoal/70">Family Plan</span>
                            <span className="text-charcoal font-medium">$3,000.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-charcoal/70">Tax</span>
                            <span className="text-charcoal font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold border-t border-sand/30 pt-4">
                            <span className="text-charcoal">Total</span>
                            <span className="text-terracotta">$3,000.00</span>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-white rounded-2xl border border-sand/30 shadow-sm p-8 mb-8">
                    <h3 className="text-lg font-semibold text-charcoal mb-6">Before Payment</h3>

                    {/* General T&C Checkbox */}
                    <label className="flex items-start gap-4 cursor-pointer group mb-6">
                        <div className="relative flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="w-6 h-6 text-terracotta border-2 border-sand/40 rounded focus:ring-2 focus:ring-terracotta/30 cursor-pointer"
                            />
                            {acceptedTerms && (
                                <Check size={16} className="absolute top-1 left-1 text-ivory pointer-events-none" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-charcoal group-hover:text-charcoal/80 transition-colors">
                                I accept the{' '}
                                <Link href="/legal/terms" className="text-terracotta hover:text-terracotta/80 underline font-medium">
                                    General Conditions
                                </Link>
                                {' '}and{' '}
                                <Link href="/legal/privacy" className="text-terracotta hover:text-terracotta/80 underline font-medium">
                                    Privacy Policy
                                </Link>
                            </p>
                            <p className="text-sm text-charcoal/60 mt-2">
                                By checking this box, you agree to our terms of service and acknowledge that you have read our privacy policy.
                            </p>
                        </div>
                    </label>

                    {/* Memorial Authorization Link */}
                    <div className="p-6 bg-gradient-to-br from-terracotta/5 to-sage/5 rounded-xl border-2 border-terracotta/20">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 bg-terracotta/20 rounded-full flex items-center justify-center">
                                    <ExternalLink size={16} className="text-terracotta" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-charcoal mb-2">Required: Memorial Authorization</h4>
                                <p className="text-sm text-charcoal/70 mb-4">
                                    Before proceeding to payment, you must review and complete the Memorial Authorization Form. This establishes your legal authority to create a memorial.
                                </p>
                                <Link
                                    href="/legal/memorial-authorization"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-lg btn-paper text-sm font-medium transition-all"
                                >
                                    <ExternalLink size={16} />
                                    Open Memorial Authorization Form
                                </Link>
                                <p className="text-xs text-charcoal/60 mt-3">
                                    💡 This will open in a new tab. You can close it when done and return here to proceed with payment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={!acceptedTerms || isProcessing}
                    className={`w-full py-5 rounded-lg btn-paper font-semibold text-lg transition-all flex items-center justify-center gap-2 ${acceptedTerms && !isProcessing
                        ? 'bg-gradient-to-r from-terracotta to-terracotta/90 hover:shadow-lg text-ivory'
                        : 'bg-sand/30 text-charcoal/40 cursor-not-allowed'
                        }`}
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : acceptedTerms ? (
                        <>
                            <Check size={20} />
                            Proceed to Payment
                        </>
                    ) : (
                        'Please accept the terms to continue'
                    )}
                </button>

                {/* Security Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-charcoal/50">
                        🔒 Secure payment powered by Stripe. Your information is encrypted and protected.
                    </p>
                </div>
            </div>
        </div>
    );
}
