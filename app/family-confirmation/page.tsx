'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Check, ExternalLink, Loader2, Shield, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function FamilyConfirmationPage() {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isOpeningAuth, setIsOpeningAuth] = useState(false);
    const [authorizationCompleted, setAuthorizationCompleted] = useState(false);
    const [currentMemorialId, setCurrentMemorialId] = useState<string | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const router = useRouter();
    const auth = useAuth();

    // Auth guard
    useEffect(() => {
        if (auth.loading) return;
        if (!auth.authenticated) {
            router.replace('/login?next=/family-confirmation');
            return;
        }
    }, [auth.loading, auth.authenticated, router]);

    // On mount: restore memorialId and check if auth was already completed
    useEffect(() => {
        const storedId = localStorage.getItem('family-memorial-id');
        if (storedId && storedId !== 'null' && storedId !== 'undefined') {
            setCurrentMemorialId(storedId);
            if (localStorage.getItem(`lv-auth-${storedId}`) === 'done') {
                setAuthorizationCompleted(true);
            }
        }
    }, []);

    // Poll for authorization completion
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

    const getOrCreateMemorial = async (): Promise<string> => {
        const supabase = createClient();
        let memorialId = currentMemorialId || localStorage.getItem('family-memorial-id');

        // Verify existing memorial still exists
        if (memorialId && memorialId !== 'null' && memorialId !== 'undefined') {
            const { data: existing } = await supabase
                .from('memorials').select('id').eq('id', memorialId).maybeSingle();
            if (!existing) {
                memorialId = null;
                localStorage.removeItem('family-memorial-id');
            }
        }

        // Create new memorial if needed
        if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Please sign in to continue.');
            const { data, error: insertError } = await supabase
                .from('memorials')
                .insert({
                    user_id: user.id,
                    slug: `family-memorial-${Date.now()}`,
                    state: 'creating',
                    plan: 'family',
                })
                .select()
                .single();
            if (insertError || !data) throw new Error(insertError?.message || 'Could not initialize archive');
            memorialId = data.id;
            localStorage.setItem('family-memorial-id', memorialId!);
        }

        setCurrentMemorialId(memorialId);
        return memorialId!;
    };

    const handleOpenAuthorization = async () => {
        setIsOpeningAuth(true);
        try {
            const memorialId = await getOrCreateMemorial();
            const url = `/authorization/${memorialId}?type=family&popup=true`;
            window.open(url, '_blank', 'width=960,height=820,scrollbars=yes,resizable=yes');
        } catch (err: any) {
            alert(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsOpeningAuth(false);
        }
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const memorialId = await getOrCreateMemorial();
            router.replace(`/payment?memorialId=${memorialId}&plan=family&amount=2940`);
        } catch (error: any) {
            console.error('Payment error:', error);
            alert(error.message || 'Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const canPay = acceptedTerms && authorizationCompleted && !isProcessing;

    return (
        <div className="min-h-screen bg-ivory font-serif">
            <div className="border-b border-sand/20 bg-white/60 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link href="/pricing" className="inline-flex items-center gap-2 text-charcoal/40 hover:text-charcoal transition-colors text-sm font-sans">
                        <ArrowLeft size={16} />
                        Back to plans
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mist mb-6 border border-mist/20 px-4 py-2 rounded-full">
                        <Shield size={14} />
                        Family Legacy Network
                    </div>
                    <h1 className="font-serif text-4xl text-charcoal mb-4">Seal the Family Archive</h1>
                    <p className="text-lg text-charcoal/50 max-w-xl mx-auto">
                        $2,940 — A single payment for a permanent family archive.
                        No monthly fees. No renewals. No surprises.
                    </p>
                </div>

                {/* What's included */}
                <div className="bg-white rounded-2xl border border-sand/25 p-8 mb-8 max-w-2xl mx-auto">
                    <h3 className="text-sm font-medium text-charcoal/40 uppercase tracking-wider mb-4 font-sans">Included in Family Legacy Network</h3>
                    <div className="space-y-3 mb-8">
                        {[
                            'Everything in Personal Archive',
                            'Multi-device sync (Anchor system)',
                            'Link multiple family memorials together',
                            'Distributed backup across family devices',
                            'Shared family timeline',
                            'Family contributor invitations',
                            'Priority support from preservation team',
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle size={16} className="text-mist flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-charcoal/70">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-sand/20 pt-6">
                        <h3 className="text-sm font-medium text-charcoal/40 uppercase tracking-wider mb-6 font-sans">Before Payment</h3>

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
                                    <Link href="/legal/terms" className="text-charcoal underline font-medium" target="_blank">Terms of Service</Link>
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
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal hover:bg-charcoal/90 text-ivory rounded-lg text-xs font-medium font-sans transition-all disabled:opacity-50"
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
                                            Waiting for authorization...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Button */}
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={handlePayment}
                        disabled={!canPay}
                        className={`w-full py-4 rounded-xl font-medium font-sans transition-all flex items-center justify-center gap-2 ${canPay
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
                            'Proceed to payment — $2,940'
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
