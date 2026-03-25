// app/concierge-confirmation/page.tsx
'use client';
import { useState } from 'react';
import { ArrowLeft, Check, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ConciergeConfirmationPage() {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (!acceptedTerms) {
            alert('Please accept the general conditions to continue');
            return;
        }

        setIsProcessing(true);

        try {
            // Create Stripe Checkout Session
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: 'Conciergerie',
                    amount: 6300, // $6,300
                }),
            });

            const { url, error } = await response.json();

            if (error) {
                throw new Error(error);
            }

            // Redirect to Stripe Checkout using the URL from the server
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again or contact support.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-olive/10 via-surface-low to-warm-muted/10">
            {/* Header */}
            <div className="border-b border-warm-border/30 bg-white/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link
                        href="/choice-pricing"
                        className="inline-flex items-center gap-2 text-warm-dark/60 hover:text-warm-dark transition-colors"
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
                    <div className="inline-flex items-center justify-center gap-2 mb-4">
                        <Sparkles size={32} className="text-olive" />
                        <h1 className="font-serif text-4xl text-warm-dark">
                            Confirm Your Order
                        </h1>
                    </div>
                    <p className="text-lg text-warm-dark/70">
                        Conciergerie Service — $6,300. A single payment. Delivery within 60 days.
                    </p>
                    <div className="inline-block px-4 py-1.5 bg-olive/20 text-olive text-sm font-semibold rounded-full border border-olive/30 mt-3">
                        Premium White-Glove Service
                    </div>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl border border-warm-border/30 shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-warm-dark mb-6">Order Summary</h2>

                    <div className="prose max-w-none mb-8">
                        <p className="text-warm-dark/70 leading-relaxed mb-4">
                            Full curation by our team. We interview, digitize, write, and structure your archive from start to finish. Delivery within 60 days.
                        </p>
                        <p className="text-warm-dark/70 leading-relaxed mb-4">
                            Includes: everything in Family + phone/video interview, professional document digitization, biographical writing by an author, 2 revision cycles, physical preservation certificate.
                        </p>
                        <p className="text-sm text-warm-dark/50 leading-relaxed">
                            After payment, our team will contact you within 24 hours to begin the process.
                        </p>
                    </div>

                    {/* What's Included */}
                    <div className="bg-gradient-to-br from-olive/5 to-warm-muted/5 rounded-xl p-6 mb-6">
                        <h3 className="font-semibold text-warm-dark mb-4 flex items-center gap-2">
                            <Sparkles size={18} className="text-olive" />
                            What's Included
                        </h3>
                        <ul className="space-y-2 text-sm text-warm-dark/70">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-olive mt-0.5 flex-shrink-0" />
                                <span>Phone/video interview with our team</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-olive mt-0.5 flex-shrink-0" />
                                <span>Professional document digitization</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-olive mt-0.5 flex-shrink-0" />
                                <span>Biographical writing by an author</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-olive mt-0.5 flex-shrink-0" />
                                <span>2 revision cycles included</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-olive mt-0.5 flex-shrink-0" />
                                <span>Physical preservation certificate</span>
                            </li>
                        </ul>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-warm-border/30 pt-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-warm-dark/70">Conciergerie Service</span>
                            <span className="text-warm-dark font-medium">$6,300.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-warm-dark/70">Tax</span>
                            <span className="text-warm-dark font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold border-t border-warm-border/30 pt-4">
                            <span className="text-warm-dark">Total</span>
                            <span className="text-olive">$6,300.00</span>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-white rounded-2xl border border-warm-border/30 shadow-sm p-8 mb-8">
                    <h3 className="text-lg font-semibold text-warm-dark mb-6">Before Payment</h3>

                    {/* General T&C Checkbox */}
                    <label className="flex items-start gap-4 cursor-pointer group mb-6">
                        <div className="relative flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="w-6 h-6 text-olive border-2 border-warm-border/40 rounded focus:ring-2 focus:ring-olive/30 cursor-pointer"
                            />
                            {acceptedTerms && (
                                <Check size={16} className="absolute top-1 left-1 text-surface-low pointer-events-none" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-warm-dark group-hover:text-warm-dark/80 transition-colors">
                                I accept the{' '}
                                <Link href="/legal/terms" className="text-olive hover:text-olive/80 underline font-medium">
                                    General Conditions
                                </Link>
                                {' '}and{' '}
                                <Link href="/legal/privacy" className="text-olive hover:text-olive/80 underline font-medium">
                                    Privacy Policy
                                </Link>
                            </p>
                            <p className="text-sm text-warm-dark/60 mt-2">
                                By checking this box, you agree to our terms of service and acknowledge that you have read our privacy policy.
                            </p>
                        </div>
                    </label>

                    {/* Memorial Authorization Link */}
                    <div className="p-6 bg-gradient-to-br from-olive/5 to-warm-muted/5 rounded-xl border-2 border-olive/20">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 bg-olive/20 rounded-full flex items-center justify-center">
                                    <ExternalLink size={16} className="text-olive" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-warm-dark mb-2">Required: Memorial Authorization</h4>
                                <p className="text-sm text-warm-dark/70 mb-4">
                                    Before proceeding to payment, you must review and complete the Memorial Authorization Form. This establishes your legal authority to create a memorial.
                                </p>
                                <Link
                                    href="/legal/memorial-authorization"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-olive/10 hover:bg-olive/20 text-olive rounded-lg text-sm font-medium transition-all"
                                >
                                    <ExternalLink size={16} />
                                    Open Memorial Authorization Form
                                </Link>
                                <p className="text-xs text-warm-dark/60 mt-3">
                                    This will open in a new tab. You can close it when done and return here to proceed with payment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={!acceptedTerms || isProcessing}
                    className={`w-full py-5 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${acceptedTerms && !isProcessing
                        ? 'bg-gradient-to-r from-olive/10 via-warm-brown to-olive/10 hover:shadow-lg glass-btn-dark'
                        : 'bg-warm-border/30 text-warm-dark/40 cursor-not-allowed'
                        }`}
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-surface-low/30 border-t-surface-low rounded-full animate-spin" />
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
                    <p className="text-xs text-warm-dark/50">
                        Secure payment powered by Stripe. Your information is encrypted and protected.
                    </p>
                </div>

                {/* Additional Note for Concierge */}
                <div className="mt-8 p-6 bg-gradient-to-br from-olive/10 to-warm-muted/10 rounded-xl border border-olive/20">
                    <p className="text-sm text-warm-dark/70 text-center leading-relaxed">
                        After payment, we'll contact you within 24 hours to schedule your first consultation call and begin creating your memorial.
                    </p>
                </div>
            </div>
        </div>
    );
}
