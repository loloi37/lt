// app/family-confirmation/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Check, ExternalLink, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FamilyConfirmationPage() {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isOpeningAuth, setIsOpeningAuth] = useState(false);
    const [authorizationCompleted, setAuthorizationCompleted] = useState(false);
    const [currentMemorialId, setCurrentMemorialId] = useState<string | null>(null);
    const [authUserId, setAuthUserId] = useState<string | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const router = useRouter();

    // Get authenticated user
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setAuthUserId(user.id);
        });
    }, []);

    // On mount: restore memorialId and check if auth was already completed
    useEffect(() => {
        const storedId = localStorage.getItem('current-memorial-id');
        if (storedId && storedId !== 'null' && storedId !== 'undefined') {
            setCurrentMemorialId(storedId);
            if (localStorage.getItem(`lv-auth-${storedId}`) === 'done') {
                setAuthorizationCompleted(true);
            }
        }
    }, []);

    // Poll DB every 3 s and listen for postMessage from popup
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
            if (localStorage.getItem(`lv-auth-${currentMemorialId}`) === 'done') {
                setAuthorizationCompleted(true);
                return;
            }
            const { data } = await createClient()
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

    useEffect(() => {
        if (authorizationCompleted && pollRef.current) clearInterval(pollRef.current);
    }, [authorizationCompleted]);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const supabase = createClient();
            let memorialId = currentMemorialId || localStorage.getItem('current-memorial-id');

            if (memorialId && memorialId !== 'null' && memorialId !== 'undefined') {
                const { data: existing } = await supabase
                    .from('memorials').select('id').eq('id', memorialId).maybeSingle();
                if (!existing) { memorialId = null; localStorage.removeItem('current-memorial-id'); }
            }

            if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Please sign in to continue.');
                const { data, error: insertError } = await supabase
                    .from('memorials')
                    .insert({ user_id: user.id, slug: `family-memorial-${Date.now()}`, paid: false, mode: 'family' })
                    .select().single();
                if (insertError) { console.error('Memorial insert error:', insertError); throw insertError; }
                memorialId = data.id;
                localStorage.setItem('current-memorial-id', memorialId!);
                setCurrentMemorialId(memorialId);
            }

            // Use the same embedded Stripe Elements page as Personal
            router.push(`/payment?memorialId=${memorialId}&plan=family&amount=2940`);
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
            const supabase = createClient();
            let memorialId = currentMemorialId || localStorage.getItem('current-memorial-id');

            if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Please sign in to continue.');
                const { data, error: insertError } = await supabase
                    .from('memorials')
                    .insert({ user_id: user.id, slug: `family-memorial-${Date.now()}`, mode: 'family', paid: false })
                    .select().single();
                if (insertError || !data) {
                    console.error('Memorial insert error:', insertError);
                    throw new Error(insertError?.message || 'Could not initialize your archive');
                }
                memorialId = data.id;
                localStorage.setItem('current-memorial-id', memorialId!);
            }
            setCurrentMemorialId(memorialId);

            const url = `/authorization/${memorialId}?type=account&popup=true`;
            window.open(url, '_blank', 'width=960,height=820,scrollbars=yes,resizable=yes');
        } catch (err: any) {
            alert(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsOpeningAuth(false);
        }
    };

    const canPay = acceptedTerms && authorizationCompleted && !isProcessing;

    return (
        <div className="min-h-screen bg-ivory">
            <div className="border-b border-sand/20 bg-white/60 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link href="/choice-pricing" className="inline-flex items-center gap-2 text-charcoal/40 hover:text-charcoal transition-colors text-sm">
                        <ArrowLeft size={16} />
                        <span>Back to plans</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl text-charcoal mb-4">Seal the Archive</h1>
                    <p className="text-lg text-charcoal/50">$2,940 — A single payment for a permanent family archive. No monthly fees. No renewals. No surprises.</p>
                </div>

                {/* Steps before payment */}
                <div className="bg-white rounded-2xl border border-sand/25 p-8 mb-8 max-w-2xl mx-auto">
                    <h3 className="text-sm font-medium text-charcoal/40 uppercase tracking-wider mb-6">Before Payment</h3>

                    {/* Step 1 — Accept terms */}
                    <label className="flex items-start gap-4 cursor-pointer group mb-6">
                        <div className="relative flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="w-5 h-5 border-2 border-sand/40 rounded cursor-pointer accent-charcoal"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-charcoal/60 group-hover:text-charcoal/80 transition-colors">
                                I accept the{' '}
                                <Link href="/legal/terms" className="text-charcoal underline font-medium" target="_blank">General Conditions</Link>
                                {' '}and{' '}
                                <Link href="/legal/privacy" className="text-charcoal underline font-medium" target="_blank">Privacy Policy</Link>
                            </p>
                        </div>
                    </label>

                    {/* Step 2 — Authorization form */}
                    <div className={`p-6 rounded-xl border transition-all ${acceptedTerms ? 'border-sand/30 bg-sand/5' : 'border-sand/15 bg-sand/5 opacity-40 pointer-events-none'}`}>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {authorizationCompleted ? (
                                    <div className="w-7 h-7 bg-charcoal rounded-full flex items-center justify-center">
                                        <Check size={14} className="text-ivory" strokeWidth={2.5} />
                                    </div>
                                ) : (
                                    <div className="w-7 h-7 bg-sand/20 rounded-full flex items-center justify-center">
                                        <ExternalLink size={14} className="text-charcoal/30" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-charcoal text-sm mb-1">Memorial Authorization</h4>
                                {authorizationCompleted ? (
                                    <p className="text-xs text-charcoal/40">
                                        Authorization completed. You may now proceed to payment.
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-xs text-charcoal/40 mb-4">
                                            Confirm your legal authority to create this family archive. The form opens in a new window.
                                        </p>
                                        <button
                                            onClick={handleOpenAuthorization}
                                            disabled={isOpeningAuth || !acceptedTerms}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal hover:bg-charcoal/90 text-ivory rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                                        >
                                            {isOpeningAuth ? (
                                                <div className="w-3.5 h-3.5 border-2 border-ivory/40 border-t-ivory rounded-full animate-spin" />
                                            ) : (
                                                <ExternalLink size={13} />
                                            )}
                                            Open Authorization Form
                                        </button>
                                    </>
                                )}

                                {currentMemorialId && !authorizationCompleted && !isOpeningAuth && (
                                    <p className="text-[11px] text-charcoal/25 mt-3 flex items-center gap-1.5">
                                        <Loader2 size={10} className="animate-spin" />
                                        Waiting for authorization…
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Button */}
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={handlePayment}
                        disabled={!canPay}
                        className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${canPay
                            ? 'bg-charcoal hover:bg-charcoal/90 text-ivory'
                            : 'bg-sand/20 text-charcoal/25 cursor-not-allowed'
                            }`}
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                                Preparing payment...
                            </>
                        ) : (
                            'Proceed to payment ($2,940)'
                        )}
                    </button>

                    {!authorizationCompleted && acceptedTerms && (
                        <p className="text-center text-[11px] text-charcoal/25 mt-3">
                            Complete the authorization form above to enable payment.
                        </p>
                    )}

                    <p className="text-center text-[11px] text-charcoal/20 mt-6">
                        Secure payment powered by Stripe. Your information is encrypted.
                    </p>
                </div>
            </div>
        </div>
    );
}
