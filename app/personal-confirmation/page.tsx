// app/personal-confirmation/page.tsx
'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { ArrowLeft, Check, ExternalLink, ArrowUpCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function PersonalConfirmationContent() {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isOpeningAuth, setIsOpeningAuth] = useState(false);
    const [authorizationCompleted, setAuthorizationCompleted] = useState(false);
    const [currentMemorialId, setCurrentMemorialId] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const upgradeMemorialId = searchParams.get('memorialId');
    const isDraftUpgrade = !!upgradeMemorialId;

    // On mount: restore memorialId from URL/localStorage and check if auth was already completed
    useEffect(() => {
        const storedId = upgradeMemorialId || localStorage.getItem('current-memorial-id');
        if (storedId && storedId !== 'null' && storedId !== 'undefined') {
            setCurrentMemorialId(storedId);
            if (localStorage.getItem(`lv-auth-${storedId}`) === 'done') {
                setAuthorizationCompleted(true);
            }
        }
    }, [upgradeMemorialId]);

    // Poll the DB every 3 s for auth completion, and listen for postMessage from popup
    useEffect(() => {
        if (!currentMemorialId || authorizationCompleted) return;

        const handleMessage = (event: MessageEvent) => {
            if (
                event.data?.type === 'lv-auth-complete' &&
                event.data?.memorialId === currentMemorialId
            ) {
                setAuthorizationCompleted(true);
            }
        };
        window.addEventListener('message', handleMessage);

        pollRef.current = setInterval(async () => {
            // Also check localStorage (set by the popup window)
            if (localStorage.getItem(`lv-auth-${currentMemorialId}`) === 'done') {
                setAuthorizationCompleted(true);
                return;
            }
            const { data } = await supabase
                .from('memorial_authorizations')
                .select('id')
                .eq('memorial_id', currentMemorialId)
                .in('status', ['pending', 'approved'])
                .maybeSingle();
            if (data) setAuthorizationCompleted(true);
        }, 3000);

        return () => {
            window.removeEventListener('message', handleMessage);
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [currentMemorialId, authorizationCompleted]);

    // Stop polling once done
    useEffect(() => {
        if (authorizationCompleted && pollRef.current) {
            clearInterval(pollRef.current);
        }
    }, [authorizationCompleted]);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            let memorialId = upgradeMemorialId || currentMemorialId || localStorage.getItem('current-memorial-id');

            if (memorialId && memorialId !== 'null' && memorialId !== 'undefined') {
                const { data: existing } = await supabase
                    .from('memorials').select('id').eq('id', memorialId).maybeSingle();
                if (!existing) { memorialId = null; localStorage.removeItem('current-memorial-id'); }
            }

            if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
                const userId = localStorage.getItem('user-id');
                const { data, error: insertError } = await supabase
                    .from('memorials')
                    .insert({ user_id: userId, slug: `memorial-${Date.now()}`, mode: 'personal', paid: false })
                    .select().single();
                if (insertError) throw insertError;
                memorialId = data.id;
                localStorage.setItem('current-memorial-id', memorialId!);
                setCurrentMemorialId(memorialId);
            }

            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memorialId, plan: 'Personal', amount: 1500, isDraftUpgrade }),
            });
            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'LEGAL_AUTH_REQUIRED') {
                    setAuthorizationCompleted(false);
                    alert('Please complete the Memorial Authorization Form first.');
                    return;
                }
                throw new Error(data.error || 'Payment initialization failed');
            }

            if (data.url) window.location.href = data.url;
        } catch (error: any) {
            console.error('Payment error:', error);
            alert(error.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOpenAuthorization = async () => {
        setIsOpeningAuth(true);
        try {
            let memorialId = upgradeMemorialId || currentMemorialId || localStorage.getItem('current-memorial-id');

            if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
                const userId = localStorage.getItem('user-id');
                const { data, error: insertError } = await supabase
                    .from('memorials')
                    .insert({ user_id: userId, slug: `memorial-${Date.now()}`, mode: 'personal', paid: false })
                    .select().single();
                if (insertError || !data) throw new Error('Could not initialize your archive');
                memorialId = data.id;
                localStorage.setItem('current-memorial-id', memorialId!);
                setCurrentMemorialId(memorialId);
            } else {
                setCurrentMemorialId(memorialId);
            }

            const url = `/authorization/${memorialId}?type=individual&popup=true`;
            window.open(url, '_blank', 'width=960,height=820,scrollbars=yes,resizable=yes');
        } catch (err: any) {
            alert(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsOpeningAuth(false);
        }
    };

    const canPay = acceptedTerms && authorizationCompleted && !isProcessing;

    return (
        <div className="min-h-screen bg-gradient-to-br from-mist/10 via-ivory to-stone/10">
            <div className="border-b border-sand/30 bg-white/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link
                        href={isDraftUpgrade ? '/choice-pricing' : '/choice-pricing'}
                        className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>{isDraftUpgrade ? 'Back to my drafts' : 'Back to plans'}</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    {isDraftUpgrade ? (
                        <>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-mist/10 text-mist rounded-full text-sm font-semibold mb-4">
                                <ArrowUpCircle size={16} />
                                Upgrading from Draft to Personal
                            </div>
                            <h1 className="font-serif text-4xl text-charcoal mb-4">Activate Your Memorial</h1>
                            <p className="text-lg text-charcoal/70">Your draft is ready — unlock the full Personal plan for $1,500</p>
                        </>
                    ) : (
                        <>
                            <h1 className="font-serif text-4xl text-charcoal mb-4">Confirm Your Order</h1>
                            <p className="text-lg text-charcoal/70">Personal Plan - $1,500</p>
                        </>
                    )}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl border border-sand/30 shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-charcoal mb-6">Order Summary</h2>
                    {isDraftUpgrade && (
                        <div className="mb-6 p-4 bg-mist/5 border border-mist/20 rounded-xl">
                            <p className="text-sm text-charcoal/70">
                                <strong>Draft upgrade:</strong> Your existing draft memorial will be upgraded to the Personal plan. All your work is preserved — watermarks are removed and lifetime hosting is activated immediately after payment.
                            </p>
                        </div>
                    )}
                    <div className="prose max-w-none mb-8">
                        <p className="text-charcoal/70 leading-relaxed mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p className="text-charcoal/70 leading-relaxed mb-4">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p className="text-charcoal/70 leading-relaxed">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                    </div>
                    <div className="border-t border-sand/30 pt-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-charcoal/70">{isDraftUpgrade ? 'Draft → Personal Upgrade' : 'Personal Plan'}</span>
                            <span className="text-charcoal font-medium">$1,500.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-charcoal/70">Tax</span>
                            <span className="text-charcoal font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold border-t border-sand/30 pt-4">
                            <span className="text-charcoal">Total</span>
                            <span className="text-mist">$1,500.00</span>
                        </div>
                    </div>
                </div>

                {/* Steps before payment */}
                <div className="bg-white rounded-2xl border border-sand/30 shadow-sm p-8 mb-8">
                    <h3 className="text-lg font-semibold text-charcoal mb-6">Before Payment</h3>

                    {/* Step 1 — Accept terms */}
                    <label className="flex items-start gap-4 cursor-pointer group mb-6">
                        <div className="relative flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="w-6 h-6 border-2 border-sand/40 rounded cursor-pointer accent-charcoal"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-charcoal group-hover:text-charcoal/80 transition-colors">
                                I accept the{' '}
                                <Link href="/legal/terms" className="text-mist hover:text-mist/80 underline font-medium" target="_blank">General Conditions</Link>
                                {' '}and{' '}
                                <Link href="/legal/privacy" className="text-mist hover:text-mist/80 underline font-medium" target="_blank">Privacy Policy</Link>
                            </p>
                        </div>
                    </label>

                    {/* Step 2 — Authorization form */}
                    <div className={`p-6 rounded-xl border-2 transition-all ${acceptedTerms ? 'border-sand/40 bg-parchment/40' : 'border-sand/20 bg-sand/10 opacity-50 pointer-events-none'}`}>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {authorizationCompleted ? (
                                    <div className="w-8 h-8 bg-charcoal rounded-full flex items-center justify-center">
                                        <Check size={16} className="text-ivory" strokeWidth={2.5} />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 bg-mist/20 rounded-full flex items-center justify-center">
                                        <ExternalLink size={16} className="text-mist" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-charcoal mb-1">Memorial Authorization</h4>
                                {authorizationCompleted ? (
                                    <p className="text-sm text-charcoal/60 mb-4">
                                        Authorization completed. You may now proceed to payment.
                                    </p>
                                ) : (
                                    <p className="text-sm text-charcoal/60 mb-4">
                                        Complete the authorization form to confirm your legal authority to create this memorial.
                                        The form opens in a new window — return here when done.
                                    </p>
                                )}

                                {!authorizationCompleted && (
                                    <button
                                        onClick={handleOpenAuthorization}
                                        disabled={isOpeningAuth || !acceptedTerms}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-mist hover:bg-mist/90 text-ivory rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                                    >
                                        {isOpeningAuth ? (
                                            <div className="w-4 h-4 border-2 border-ivory/40 border-t-ivory rounded-full animate-spin" />
                                        ) : (
                                            <ExternalLink size={15} />
                                        )}
                                        Open Memorial Authorization Form
                                    </button>
                                )}

                                {/* Waiting indicator — auth window opened but not yet completed */}
                                {currentMemorialId && !authorizationCompleted && !isOpeningAuth && (
                                    <p className="text-xs text-charcoal/40 mt-3 flex items-center gap-1.5">
                                        <Loader2 size={11} className="animate-spin" />
                                        Waiting for authorization to be completed…
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={!canPay}
                    className={`w-full py-5 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                        canPay
                            ? 'bg-charcoal hover:bg-charcoal/90 text-ivory hover:shadow-lg'
                            : 'bg-sand/30 text-charcoal/30 cursor-not-allowed'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                            Processing…
                        </>
                    ) : (
                        isDraftUpgrade ? 'Upgrade to Personal ($1,500)' : 'Proceed to Payment ($1,500)'
                    )}
                </button>

                {!authorizationCompleted && acceptedTerms && (
                    <p className="text-center text-xs text-charcoal/40 mt-3">
                        Complete the authorization form above to enable payment.
                    </p>
                )}

                <div className="mt-6 text-center">
                    <p className="text-xs text-charcoal/40">
                        Secure payment powered by Stripe. Your information is encrypted and protected.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function PersonalConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <PersonalConfirmationContent />
        </Suspense>
    );
}
