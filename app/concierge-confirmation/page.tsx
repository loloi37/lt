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
                    amount: 6500, // $6,500
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
        <div className="min-h-screen bg-gradient-to-br from-mist/10 via-ivory to-stone/10">
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
                    <div className="inline-flex items-center justify-center gap-2 mb-4">
                        <Sparkles size={32} className="text-mist" />
                        <h1 className="font-serif text-4xl text-charcoal">
                            Confirm Your Order
                        </h1>
                    </div>
                    <p className="text-lg text-charcoal/70">
                        Conciergerie Service - $6,500
                    </p>
                    <div className="inline-block px-4 py-1.5 bg-mist/20 text-mist text-sm font-semibold rounded-full border border-mist/30 mt-3">
                        Premium White-Glove Service
                    </div>
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

                    {/* What's Included */}
                    <div className="bg-gradient-to-br from-mist/5 to-stone/5 rounded-xl p-6 mb-6">
                        <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                            <Sparkles size={18} className="text-mist" />
                            What's Included
                        </h3>
                        <ul className="space-y-2 text-sm text-charcoal/70">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Dedicated concierge service</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Personal consultation calls</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>We handle all content creation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Professional photo and video editing</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Unlimited revisions</span>
                            </li>
                        </ul>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-sand/30 pt-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-charcoal/70">Conciergerie Service</span>
                            <span className="text-charcoal font-medium">$6,500.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-charcoal/70">Tax</span>
                            <span className="text-charcoal font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold border-t border-sand/30 pt-4">
                            <span className="text-charcoal">Total</span>
                            <span className="text-mist">$6,500.00</span>
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
                                className="w-6 h-6 text-mist border-2 border-sand/40 rounded focus:ring-2 focus:ring-mist/30 cursor-pointer"
                            />
                            {acceptedTerms && (
                                <Check size={16} className="absolute top-1 left-1 text-ivory pointer-events-none" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-charcoal group-hover:text-charcoal/80 transition-colors">
                                I accept the{' '}
                                <Link href="/legal/terms" className="text-mist hover:text-mist/80 underline font-medium">
                                    General Conditions
                                </Link>
                                {' '}and{' '}
                                <Link href="/legal/privacy" className="text-mist hover:text-mist/80 underline font-medium">
                                    Privacy Policy
                                </Link>
                            </p>
                            <p className="text-sm text-charcoal/60 mt-2">
                                By checking this box, you agree to our terms of service and acknowledge that you have read our privacy policy.
                            </p>
                        </div>
                    </label>

                    {/* Memorial Authorization Link */}
                    <div className="p-6 bg-gradient-to-br from-mist/5 to-stone/5 rounded-xl border-2 border-mist/20">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 bg-mist/20 rounded-full flex items-center justify-center">
                                    <ExternalLink size={16} className="text-mist" />
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
<<<<<<< HEAD
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-mist hover:bg-mist/90 text-ivory rounded-lg text-sm font-medium transition-all"
=======
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-sage hover:bg-sage/90 text-ivory rounded-lg btn-paper text-sm font-medium transition-all"
>>>>>>> origin/claude/pastel-color-palette-avZIb
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
<<<<<<< HEAD
                    className={`w-full py-5 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${acceptedTerms && !isProcessing
                        ? 'bg-gradient-to-r from-mist via-stone to-mist/90 hover:shadow-lg text-ivory'
=======
                    className={`w-full py-5 rounded-lg btn-paper font-semibold text-lg transition-all flex items-center justify-center gap-2 ${acceptedTerms && !isProcessing
                        ? 'bg-gradient-to-r from-sage via-terracotta to-sage/90 hover:shadow-lg text-ivory'
>>>>>>> origin/claude/pastel-color-palette-avZIb
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

                {/* Additional Note for Concierge */}
                <div className="mt-8 p-6 bg-gradient-to-br from-mist/10 to-stone/10 rounded-xl border border-mist/20">
                    <p className="text-sm text-charcoal/70 text-center leading-relaxed">
                        After payment, we'll contact you within 24 hours to schedule your first consultation call and begin creating your memorial.
                    </p>
                </div>
            </div>
        </div>
    );
}