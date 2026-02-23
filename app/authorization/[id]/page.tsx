// app/authorization/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Added useSearchParams
import { supabase } from '@/lib/supabase';
import { Shield, Check, AlertTriangle, ArrowLeft, PenTool, Type, Clock, Loader2, Users, User } from 'lucide-react';
import SignaturePad from '@/components/SignaturePad';
import fp from '@fingerprintjs/fingerprintjs';
import VideoRecorder from '@/components/VideoRecorder';

const PUBLIC_FIGURE_KEYWORDS = [
  'President', 'Queen', 'King', 'Senator', 'Governor', 
  'CEO', 'Founder', 'Director', 'Minister', 'Artist', 'Actor'
];

export default function AuthorizationPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const memorialId = unwrappedParams.id;
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Check if this is a Master Account authorization or a Specific Individual one
    const isAccountLevel = searchParams.get('type') === 'account';
    // Opened in a popup window from the confirmation page
    const isPopup = searchParams.get('popup') === 'true';

    const [loading, setLoading] = useState(true);
    const [memorialName, setMemorialName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [wantsVideo, setWantsVideo] = useState(false);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null); // To store the recorded video

    const [isSuccess, setIsSuccess] = useState(false);
    
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

    const [signatureType, setSignatureType] = useState<'drawn' | 'typed'>('typed');
    const [signatureValue, setSignatureValue] = useState<string | null>(null);
    const [signatureTimestamp, setSignatureTimestamp] = useState<string | null>(null);
    const [finalConfirmation, setFinalConfirmation] = useState(false);

    const [isMandatory, setIsMandatory] = useState(false);
    const [mandatoryReason, setMandatoryReason] = useState('');

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

            const { data, error } = await supabase
                .from('memorials')
                .select('step1, mode') // Added mode
                .eq('id', memorialId)
                .single();

            if (error) throw error;
            
            const fullName = data?.step1?.fullName || 'the Deceased';
            setMemorialName(fullName);

            // --- HIGH RISK DETECTION LOGIC ---
            let mandatory = false;
            let reason = '';

            // 1. Check if Concierge/Premium
            if (data.mode === 'concierge') {
                mandatory = true;
                reason = 'Required for white-glove Concierge Service to ensure maximum legal protection.';
            } 
            // 2. Check for public figure keywords in name
            else if (PUBLIC_FIGURE_KEYWORDS.some(k => fullName.toLowerCase().includes(k.toLowerCase()))) {
                mandatory = true;
                reason = 'Required for archives of public figures to prevent identity disputes.';
            }
            // 3. Strongly recommend for Family mode (optional but flagged)
            else if (data.mode === 'family') {
                setWantsVideo(true); // Default to on, but user can still uncheck unless mandatory
            }

            if (mandatory) {
                setIsMandatory(true);
                setMandatoryReason(reason);
                setWantsVideo(true);
            }
            // ---------------------------------

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

    // Add this helper function at the top of your component or inside handleAuthorize
    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleAuthorize = async () => {
        if (!memorialId) return;
        setIsSubmitting(true);

        try {
            // 1. Generate Device Fingerprint
            const agent = await fp.load();
            const fpResult = await agent.get();
            const fingerprint = fpResult.visitorId;
            const userId = localStorage.getItem('user-id');

            // 2. Prepare Video Data (if recorded)
            let videoData = null;
            if (wantsVideo && videoBlob) {
                videoData = await blobToBase64(videoBlob);
            }

            // 3. Submit to Server API
            const response = await fetch('/api/authorization/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memorialId,
                    userId,
                    identity,
                    agreements,
                    signature: { type: signatureType, content: signatureValue },
                    fingerprint,
                    authorizationType: isAccountLevel ? 'account' : 'individual',
                    videoContent: videoData // <--- ADDED THE VIDEO DATA HERE
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setIsSuccess(true);

            if (isPopup) {
                // Signal the parent confirmation window that auth is done
                try {
                    window.opener?.postMessage({ type: 'lv-auth-complete', memorialId }, '*');
                } catch (_) {}
                // Write to localStorage as a fallback (parent polls this)
                localStorage.setItem(`lv-auth-${memorialId}`, 'done');
                // No auto-redirect — user closes the window manually
            } else {
                // Normal flow: redirect back after 3.5 s
                setTimeout(() => {
                    const redirectTo = searchParams.get('redirect');
                    if (redirectTo === 'personal') {
                        router.push('/personal-confirmation?authorized=true');
                    } else if (redirectTo === 'family') {
                        router.push('/family-confirmation?authorized=true');
                    } else if (isAccountLevel) {
                        router.push('/family-confirmation?authorized=true');
                    } else {
                        router.push(`/create?id=${memorialId}&authorized=true`);
                    }
                }, 3500);
            }

        } catch (err: any) {
            console.error("Authorization failed:", err);
            alert("Authorization failed: " + err.message);
            setIsSubmitting(false);
        }
    };

    const allAgreed = Object.values(agreements).every(Boolean);
    const isIdentityComplete = identity.fullName.trim().length > 2 && identity.email.includes('@');
    const isSignatureValid = signatureType === 'drawn' 
        ? !!signatureValue 
        : signatureValue?.trim().toLowerCase() === identity.fullName.trim().toLowerCase();

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
                                    disabled={isAccountLevel} // User doesn't need to type it for Account level
                                    className={`w-full px-4 py-3 rounded-lg border border-sand/40 focus:outline-none focus:ring-2 focus:ring-mist/20 bg-ivory/30 ${isAccountLevel ? 'opacity-60 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Declarations - Dynamic Wording */}
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


                {/* 2.5 Video Verification (Smarter Logic) */}
                <div className={`bg-white p-8 rounded-2xl border border-sand/40 shadow-sm mb-8 transition-all ${!allAgreed ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="font-serif text-xl text-charcoal flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-mist text-ivory flex items-center justify-center text-xs font-sans">2.5</span>
                            Video Signature
                        </h2>
                        {isMandatory ? (
                            <div className="px-3 py-1 bg-charcoal text-ivory text-[10px] font-bold uppercase tracking-widest rounded-full border border-charcoal/20 flex items-center gap-1">
                                <Shield size={10} /> Required
                            </div>
                        ) : (
                            <div className="px-3 py-1 bg-stone/10 text-stone text-[10px] font-bold uppercase tracking-widest rounded-full border border-stone/20">
                                Recommended
                            </div>
                        )}
                    </div>
                    
                    <p className="text-sm text-charcoal/60 mb-6 leading-relaxed">
                        {isMandatory 
                            ? "Due to the nature of this archive, a video signature is required to ensure maximum legal protection for the family."
                            : "Adding a video signature provides irrefutable proof of your identity. It is securely stored and only accessed if a legal dispute arises."
                        }
                    </p>

                    {/* The Mandatory Reason Banner */}
                    {isMandatory && (
                        <div className="mb-6 p-4 bg-mist/5 border border-mist/20 rounded-xl flex items-start gap-3">
                            <AlertTriangle size={18} className="text-mist flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-charcoal/70 leading-relaxed">
                                <strong>Why is this required?</strong> {mandatoryReason} 
                                <br />
                                This additional precaution protects everyone—including you—in case of future family conflict or claims regarding the archive's validity.
                            </p>
                        </div>
                    )}

                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-all ${
                        isMandatory 
                        ? 'bg-ivory border-sand/20 opacity-80 cursor-default' 
                        : 'border-sand/60 hover:border-mist/40 hover:bg-mist/5 cursor-pointer group'
                    }`}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${wantsVideo ? 'bg-mist border-mist text-ivory' : 'border-sand/60 bg-white group-hover:border-sand'}`}>
                            {wantsVideo && <Check size={14} strokeWidth={3} />}
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={wantsVideo}
                            onChange={() => !isMandatory && setWantsVideo(!wantsVideo)} // Disable toggling if mandatory
                            disabled={isMandatory}
                        />
                        <span className="text-sm font-medium text-charcoal">
                            {isMandatory ? "I will record my video signature below." : "Yes, I want to strengthen my authorization with a 10-second video."}
                        </span>
                    </label>

                    {wantsVideo && (
                        <div className="mt-8 p-6 bg-ivory rounded-xl border border-sand/40 animate-fadeIn">
                            <VideoRecorder 
                                fullName={identity.fullName}
                                deceasedName={memorialName}
                                onComplete={(blob) => setVideoBlob(blob)}
                            />
                            
                            {videoBlob && (
                                <div className="mt-4 flex items-center justify-center gap-2 text-mist font-medium text-sm animate-fadeIn">
                                    Video recorded and signed.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. Signature */}
                {allAgreed && isIdentityComplete && (
                    <div className="bg-white p-8 rounded-2xl border border-sand/40 shadow-sm mb-8 animate-fadeIn">
                        <h2 className="font-serif text-xl text-charcoal mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-mist text-ivory flex items-center justify-center text-xs font-sans">3</span>
                            Digital Signature
                        </h2>

                        <div className="flex gap-2 p-1 bg-sand/10 rounded-xl mb-6">
                            <button onClick={() => { setSignatureType('typed'); setSignatureValue(''); }} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${signatureType === 'typed' ? 'bg-white shadow-sm text-charcoal' : 'text-charcoal/50 hover:text-charcoal'}`}>
                                <Type size={16} /> Type Name
                            </button>
                            <button onClick={() => { setSignatureType('drawn'); setSignatureValue(''); }} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${signatureType === 'drawn' ? 'bg-white shadow-sm text-charcoal' : 'text-charcoal/50 hover:text-charcoal'}`}>
                                <PenTool size={16} /> Draw Signature
                            </button>
                        </div>

                        <div className="mb-6">
                            {signatureType === 'typed' ? (
                                <div className="space-y-2">
                                    <input type="text" placeholder={`Type "${identity.fullName}" to sign`} className="w-full px-4 py-4 rounded-xl border-2 border-sand/40 focus:outline-none focus:ring-2 focus:ring-mist/20 bg-ivory/30 font-serif text-xl text-center" onChange={(e) => handleSignatureInput(e.target.value)} value={signatureValue || ''} />
                                    {signatureValue && !isSignatureValid && <p className="text-xs text-red-500 text-center">Must exactly match your full name.</p>}
                                </div>
                            ) : ( <SignaturePad onEnd={handleSignatureInput} /> )}
                        </div>

                        {isSignatureValid && (
                            <div className="p-6 bg-sand/5 rounded-xl border border-sand/20 animate-fadeIn">
                                <div className="flex flex-col items-center gap-2">
                                    {signatureType === 'drawn' ? <img src={signatureValue!} alt="Signature" className="h-16 object-contain" /> : <p className="font-serif text-3xl text-charcoal italic">{signatureValue}</p>}
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
                    {wantsVideo && !videoBlob && allAgreed && isSignatureValid && (
                        <p className="text-xs text-stone mb-4 flex items-center justify-center gap-1 animate-pulse">Please complete your 10-second video recording to continue.</p>
                    )}
                    <button 
                        onClick={handleAuthorize}
                        disabled={
                            !allAgreed || 
                            !isIdentityComplete || 
                            !isSignatureValid || 
                            !finalConfirmation || 
                            isSubmitting || 
                            (wantsVideo && !videoBlob) // <--- ADD THIS CHECK
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
                            <h2 className="font-serif text-3xl text-charcoal mb-4">Authorization Complete</h2>
                            <p className="text-charcoal/60 mb-8 leading-relaxed">
                                Your legal declaration and signature have been recorded.
                            </p>

                            {isPopup ? (
                                /* Popup mode: ask user to close this window */
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
                                /* Normal mode: auto-redirect */
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