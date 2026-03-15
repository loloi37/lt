// app/authorization/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Shield, Check, AlertTriangle, ArrowLeft, Type, Clock, Loader2, Users, User } from 'lucide-react';

export default function AuthorizationPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const memorialId = unwrappedParams.id;
    const router = useRouter();
    const searchParams = useSearchParams();

    const isAccountLevel = searchParams.get('type') === 'account';
    const isPopup = searchParams.get('popup') === 'true';

    const [loading, setLoading] = useState(true);
    const [memorialName, setMemorialName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [emailVerificationSent, setEmailVerificationSent] = useState(false);

    const [identity, setIdentity] = useState({
        fullName: '',
        email: '',
        relationship: isAccountLevel ? 'Account Holder' : ''
    });

    const [agreements, setAgreements] = useState({
        legal_authority: false,
        good_faith: false,
        permanence: false,
        indemnification: false
    });

    const [signatureType, setSignatureType] = useState<'typed'>('typed');
    const [signatureValue, setSignatureValue] = useState<string | null>(null);
    const [signatureTimestamp, setSignatureTimestamp] = useState<string | null>(null);
    const [finalConfirmation, setFinalConfirmation] = useState(false);

    useEffect(() => {
        loadData();
    }, [memorialId]);

    const loadData = async () => {
        try {
            if (isAccountLevel) {
                setMemorialName("Family Plan Account");
                setLoading(false);
                return;
            }

            const { data, error } = await createClient()
                .from('memorials')
                .select('stories, state')
                .eq('id', memorialId)
                .single();

            if (error) throw error;

            const fullName = data?.stories?.fullName || 'the Deceased';
            setMemorialName(fullName);

        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleAgreement = (key: keyof typeof agreements) => {
        setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSignatureInput = (val: string | null) => {
        setSignatureValue(val);
        setFinalConfirmation(false);
        if (val) {
            setSignatureTimestamp(new Date().toLocaleString('en-US', {
                timeZoneName: 'short', dateStyle: 'long', timeStyle: 'long'
            }));
        } else {
            setSignatureTimestamp(null);
        }
    };

    const handleAuthorize = async () => {
        if (!memorialId) return;
        setIsSubmitting(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;

            const response = await fetch('/api/authorization/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memorialId,
                    userId,
                    identity,
                    agreements,
                    signature: { type: signatureType, content: signatureValue },
                    authorizationType: isAccountLevel ? 'account' : 'individual',
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setIsSuccess(true);
            setEmailVerificationSent(true);

            if (isPopup) {
                try {
                    window.opener?.postMessage({ type: 'lv-auth-complete', memorialId }, '*');
                } catch (_) {}
                localStorage.setItem(`lv-auth-${memorialId}`, 'done');
            } else {
                setTimeout(() => {
                    const redirectTo = searchParams.get('redirect');
                    if (redirectTo === 'payment') {
                        router.push(`/payment?memorialId=${memorialId}`);
                    } else {
                        router.push(`/create?id=${memorialId}&authorized=true`);
                    }
                }, 3000);
            }

        } catch (err: any) {
            console.error("Authorization failed:", err);
            alert("Authorization failed: " + err.message);
            setIsSubmitting(false);
        }
    };

    const allAgreed = Object.values(agreements).every(Boolean);
    const isIdentityComplete = identity.fullName.trim().length > 2 && identity.email.includes('@');
    const isSignatureValid = signatureValue?.trim().toLowerCase() === identity.fullName.trim().toLowerCase();

    if (loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-mist/30 border-t-mist rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory text-charcoal font-sans selection:bg-mist/20 pb-20">
            <header className="border-b border-sand/30 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => router.back()} className="text-sm text-charcoal/60 hover:text-charcoal flex items-center gap-2 transition-colors">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="flex items-center gap-2 text-mist font-medium">
                        <Shield size={18} />
                        <span className="text-sm tracking-wide uppercase">
                            {isAccountLevel ? 'Master Account Authorization' : 'Archive Authorization'}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-mist/10 rounded-2xl text-mist mb-6">
                        {isAccountLevel ? <Users size={32} /> : <User size={32} />}
                    </div>
                    <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
                        {isAccountLevel ? 'Master Guardian Declaration' : 'Declaration of Authority'}
                    </h1>
                    <p className="text-charcoal/60 leading-relaxed">
                        {isAccountLevel
                          ? "As the Master Guardian, you are assuming legal responsibility for all archives created under this Family Account."
                          : `Establishing the permanent archive for ${memorialName}.`
                        }
                    </p>
                </div>

                {/* 1. Identity Form */}
                <div className="bg-white p-8 rounded-2xl border border-sand/40 shadow-sm mb-8">
                    <h2 className="font-serif text-xl text-charcoal mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-mist text-ivory flex items-center justify-center text-xs font-sans">1</span>
                        Your Identity
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-charcoal/60 mb-1 uppercase tracking-wide">Full Legal Name</label>
                            <input
                                type="text"
                                value={identity.fullName}
                                onChange={e => setIdentity({...identity, fullName: e.target.value})}
                                placeholder="e.g. Eleanor Marie Thompson"
                                className="w-full px-4 py-3 rounded-lg border border-sand/40 focus:outline-none focus:ring-2 focus:ring-mist/20 bg-ivory/30"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-charcoal/60 mb-1 uppercase tracking-wide">Email Address</label>
                                <input
                                    type="email"
                                    value={identity.email}
                                    onChange={e => setIdentity({...identity, email: e.target.value})}
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 rounded-lg border border-sand/40 focus:outline-none focus:ring-2 focus:ring-mist/20 bg-ivory/30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-charcoal/60 mb-1 uppercase tracking-wide">
                                    {isAccountLevel ? 'Your Role' : 'Relationship to Deceased'}
                                </label>
                                <input
                                    type="text"
                                    value={identity.relationship}
                                    onChange={e => setIdentity({...identity, relationship: e.target.value})}
                                    placeholder={isAccountLevel ? "Account Holder" : "e.g. Daughter, Executor"}
                                    disabled={isAccountLevel}
                                    className={`w-full px-4 py-3 rounded-lg border border-sand/40 focus:outline-none focus:ring-2 focus:ring-mist/20 bg-ivory/30 ${isAccountLevel ? 'opacity-60 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Declarations */}
                <div className={`bg-white p-8 rounded-2xl border border-sand/40 shadow-sm mb-8 transition-all ${!isIdentityComplete ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <h2 className="font-serif text-xl text-charcoal mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-mist text-ivory flex items-center justify-center text-xs font-sans">2</span>
                        Solemn Declarations
                    </h2>

                    <div className="space-y-4">
                        <label className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${agreements.legal_authority ? 'border-mist/50 bg-mist/5' : 'border-transparent hover:bg-sand/10'}`}>
                            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${agreements.legal_authority ? 'bg-mist border-mist text-ivory' : 'border-sand/60 bg-white'}`}>
                                {agreements.legal_authority && <Check size={12} strokeWidth={3} />}
                            </div>
                            <input type="checkbox" className="hidden" checked={agreements.legal_authority} onChange={() => toggleAgreement('legal_authority')} />
                            <div>
                                <p className="font-medium text-sm text-charcoal">I assert legal authority.</p>
                                <p className="text-xs text-charcoal/60 mt-1">
                                    {isAccountLevel
                                      ? "I am responsible for all content created within this Family Account."
                                      : "I am the next of kin, executor, or have explicit consent from the legal representative."}
                                </p>
                            </div>
                        </label>

                        <label className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${agreements.good_faith ? 'border-mist/50 bg-mist/5' : 'border-transparent hover:bg-sand/10'}`}>
                            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${agreements.good_faith ? 'bg-mist border-mist text-ivory' : 'border-sand/60 bg-white'}`}>
                                {agreements.good_faith && <Check size={12} strokeWidth={3} />}
                            </div>
                            <input type="checkbox" className="hidden" checked={agreements.good_faith} onChange={() => toggleAgreement('good_faith')} />
                            <div>
                                <p className="font-medium text-sm text-charcoal">I am acting in good faith.</p>
                                <p className="text-xs text-charcoal/60 mt-1">I will ensure all content is accurate, respectful, and dignified.</p>
                            </div>
                        </label>

                        <label className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${agreements.permanence ? 'border-mist/50 bg-mist/5' : 'border-transparent hover:bg-sand/10'}`}>
                            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${agreements.permanence ? 'bg-mist border-mist text-ivory' : 'border-sand/60 bg-white'}`}>
                                {agreements.permanence && <Check size={12} strokeWidth={3} />}
                            </div>
                            <input type="checkbox" className="hidden" checked={agreements.permanence} onChange={() => toggleAgreement('permanence')} />
                            <div>
                                <p className="font-medium text-sm text-charcoal">I understand the permanence.</p>
                                <p className="text-xs text-charcoal/60 mt-1">These archives are intended as a permanent historical and family record.</p>
                            </div>
                        </label>

                        <label className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${agreements.indemnification ? 'border-stone/50 bg-stone/5' : 'border-transparent hover:bg-sand/10'}`}>
                            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${agreements.indemnification ? 'bg-stone border-stone text-ivory' : 'border-sand/60 bg-white'}`}>
                                {agreements.indemnification && <Check size={12} strokeWidth={3} />}
                            </div>
                            <input type="checkbox" className="hidden" checked={agreements.indemnification} onChange={() => toggleAgreement('indemnification')} />
                            <div>
                                <p className="font-medium text-sm text-charcoal">I agree to indemnify Legacy Vault.</p>
                                <p className="text-xs text-charcoal/60 mt-1">I hold Legacy Vault harmless from any claims or family disputes arising from this account.</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* 3. Email Verification Notice */}
                <div className={`bg-white p-8 rounded-2xl border border-sand/40 shadow-sm mb-8 transition-all ${!allAgreed ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <h2 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-mist text-ivory flex items-center justify-center text-xs font-sans">3</span>
                        Email Verification
                    </h2>
                    <div className="p-4 bg-mist/5 border border-mist/20 rounded-xl flex items-start gap-3">
                        <AlertTriangle size={18} className="text-mist flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-charcoal/70 leading-relaxed">
                            A verification email will be sent to <strong>{identity.email || 'your email address'}</strong> upon submission.
                            Your authorization will include your email address, IP address, and timestamp for legal record-keeping.
                        </p>
                    </div>
                </div>

                {/* 4. Typed Signature */}
                {allAgreed && isIdentityComplete && (
                    <div className="bg-white p-8 rounded-2xl border border-sand/40 shadow-sm mb-8 animate-fadeIn">
                        <h2 className="font-serif text-xl text-charcoal mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-mist text-ivory flex items-center justify-center text-xs font-sans">4</span>
                            Digital Signature
                        </h2>

                        <div className="mb-6">
                            <div className="space-y-2">
                                <input type="text" placeholder={`Type "${identity.fullName}" to sign`} className="w-full px-4 py-4 rounded-xl border-2 border-sand/40 focus:outline-none focus:ring-2 focus:ring-mist/20 bg-ivory/30 font-serif text-xl text-center" onChange={(e) => handleSignatureInput(e.target.value)} value={signatureValue || ''} />
                                {signatureValue && !isSignatureValid && <p className="text-xs text-red-500 text-center">Must exactly match your full name.</p>}
                            </div>
                        </div>

                        {isSignatureValid && (
                            <div className="p-6 bg-sand/5 rounded-xl border border-sand/20 animate-fadeIn">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="font-serif text-3xl text-charcoal italic">{signatureValue}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-mist font-mono mt-2 bg-white px-3 py-1 rounded-full border border-mist/20">
                                        <Clock size={12} /> {signatureTimestamp}
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-sand/20">
                                    <label className="flex items-center justify-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${finalConfirmation ? 'bg-charcoal border-charcoal text-ivory' : 'border-charcoal/30 bg-white group-hover:border-charcoal'}`}>
                                            {finalConfirmation && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={finalConfirmation} onChange={() => setFinalConfirmation(!finalConfirmation)} />
                                        <span className="text-sm font-medium text-charcoal">I confirm this signature is legally binding.</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-center pb-8">
                    <button
                        onClick={handleAuthorize}
                        disabled={
                            !allAgreed ||
                            !isIdentityComplete ||
                            !isSignatureValid ||
                            !finalConfirmation ||
                            isSubmitting
                        }
                        className="btn-paper w-full py-4 rounded-lg bg-charcoal text-ivory font-medium shadow-lg hover:bg-charcoal/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
                        {isAccountLevel ? 'Authorize Family Account' : 'Authorize Memorial'}
                    </button>
                </div>
                {isSuccess && (
                    <div className="fixed inset-0 z-[110] bg-ivory/95 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
                        <div className="max-w-md w-full text-center">
                            <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="text-ivory" size={28} strokeWidth={2.5} />
                            </div>
                            <h2 className="font-serif text-3xl text-charcoal mb-4">Authorization Recorded</h2>
                            <p className="text-charcoal/50 mb-8 leading-relaxed">
                                Your authorization has been recorded. {emailVerificationSent ? 'A verification email has been sent to your address.' : 'You may now proceed.'}
                            </p>

                            {isPopup ? (
                                <div className="bg-parchment border border-sand rounded-2xl p-6">
                                    <p className="font-medium text-charcoal mb-1">
                                        You can now close this window.
                                    </p>
                                    <p className="text-sm text-charcoal/55 mb-5">
                                        Return to the previous window to proceed with your payment.
                                    </p>
                                    <button
                                        onClick={() => window.close()}
                                        className="px-6 py-2.5 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-charcoal/90 transition-all"
                                    >
                                        Close this window
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-charcoal/40 text-sm italic">
                                    <Loader2 size={16} className="animate-spin" />
                                    Returning to your archive…
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
