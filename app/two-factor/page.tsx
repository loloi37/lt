'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2, Shield, Smartphone } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';

interface TwoFactorFactorSummary {
    id: string;
    friendlyName: string;
    status: 'pending' | 'verified';
}

interface TwoFactorState {
    enabled: boolean;
    requiresChallenge: boolean;
    factors: TwoFactorFactorSummary[];
    recoveryCodesRemaining: number;
}

function TwoFactorChallengeScreen() {
    const auth = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/dashboard';
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [state, setState] = useState<TwoFactorState | null>(null);
    const [mode, setMode] = useState<'totp' | 'recovery'>('totp');
    const [selectedFactorId, setSelectedFactorId] = useState('');
    const [code, setCode] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadState = async () => {
            if (auth.loading) return;

            if (!auth.authenticated) {
                router.replace(`/login?next=${encodeURIComponent(`/two-factor?next=${encodeURIComponent(next)}`)}`);
                return;
            }

            try {
                const response = await fetch('/api/security/two-factor/state', {
                    cache: 'no-store',
                });
                const payload = await response.json();

                if (!response.ok) {
                    throw new Error(payload.error || 'Could not load two-factor settings.');
                }

                if (cancelled) return;

                setState(payload);

                const verifiedFactors = (payload.factors || []).filter((factor: TwoFactorFactorSummary) => factor.status === 'verified');
                setSelectedFactorId(verifiedFactors[0]?.id || '');

                if (!payload.enabled || !payload.requiresChallenge) {
                    router.replace(next);
                }
            } catch (loadError: any) {
                if (!cancelled) {
                    setError(loadError.message || 'Could not load the two-factor challenge.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadState();

        return () => {
            cancelled = true;
        };
    }, [auth.authenticated, auth.loading, next, router]);

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/security/two-factor/challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    mode === 'totp'
                        ? { method: 'totp', factorId: selectedFactorId, code }
                        : { method: 'recovery', recoveryCode }
                ),
            });

            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload.error || 'Could not verify the second factor.');
            }

            await auth.revalidate();
            router.replace(next);
            router.refresh();
        } catch (submitError: any) {
            setError(submitError.message || 'Could not verify this two-factor challenge.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut({ scope: 'local' });
        window.location.href = '/login';
    };

    if (loading || auth.loading) {
        return (
            <div className="min-h-screen bg-surface-low flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={28} className="mx-auto mb-3 animate-spin text-olive" />
                    <p className="text-sm text-warm-muted">Loading two-factor challenge...</p>
                </div>
            </div>
        );
    }

    const verifiedFactors = (state?.factors || []).filter((factor) => factor.status === 'verified');

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-mid via-surface-low to-surface-high flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-warm-muted hover:text-warm-dark transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-warm-border/30 p-8">
                    <div className="mb-6 flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-olive/10 text-olive">
                            <Shield size={22} />
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl text-warm-dark">Verify your sign-in</h1>
                            <p className="mt-2 text-sm text-warm-muted leading-relaxed">
                                Enter a code from your authenticator app, or use a recovery code if you lost access to it.
                            </p>
                        </div>
                    </div>

                    <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-surface-low/50 p-1">
                        <button
                            onClick={() => setMode('totp')}
                            className={`rounded-2xl px-4 py-3 text-sm transition-colors ${mode === 'totp' ? 'bg-white text-warm-dark shadow-sm' : 'text-warm-muted'}`}
                        >
                            Authenticator
                        </button>
                        <button
                            onClick={() => setMode('recovery')}
                            className={`rounded-2xl px-4 py-3 text-sm transition-colors ${mode === 'recovery' ? 'bg-white text-warm-dark shadow-sm' : 'text-warm-muted'}`}
                        >
                            Recovery code
                        </button>
                    </div>

                    {mode === 'totp' ? (
                        <>
                            {verifiedFactors.length > 1 && (
                                <div className="mb-4">
                                    <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-warm-outline">
                                        Authenticator
                                    </label>
                                    <select
                                        value={selectedFactorId}
                                        onChange={(event) => setSelectedFactorId(event.target.value)}
                                        className="w-full rounded-xl border border-warm-border/30 bg-surface-low/40 px-4 py-3 text-sm text-warm-dark focus:outline-none focus:ring-2 focus:ring-olive/15"
                                    >
                                        {verifiedFactors.map((factor) => (
                                            <option key={factor.id} value={factor.id}>
                                                {factor.friendlyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-warm-outline">
                                    Verification code
                                </label>
                                <div className="relative">
                                    <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-outline" />
                                    <input
                                        value={code}
                                        onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        placeholder="123456"
                                        className="w-full rounded-xl border border-warm-border/30 bg-surface-low/40 py-3 pl-11 pr-4 text-sm tracking-[0.22em] text-warm-dark focus:outline-none focus:ring-2 focus:ring-olive/15"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mb-4">
                            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-warm-outline">
                                Recovery code
                            </label>
                            <input
                                value={recoveryCode}
                                onChange={(event) => setRecoveryCode(event.target.value.toUpperCase())}
                                autoComplete="one-time-code"
                                placeholder="ABCD-EFGH-IJKL-MNOP"
                                className="w-full rounded-xl border border-warm-border/30 bg-surface-low/40 px-4 py-3 text-sm tracking-[0.12em] text-warm-dark focus:outline-none focus:ring-2 focus:ring-olive/15"
                            />
                            <p className="mt-2 text-xs text-warm-outline">
                                {state?.recoveryCodesRemaining || 0} recovery code{state?.recoveryCodesRemaining !== 1 ? 's' : ''} remaining
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <div className="flex items-start gap-2">
                                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleSignOut}
                            className="flex-1 rounded-xl border border-warm-border/30 px-4 py-3 text-sm text-warm-dark/70 transition-colors hover:bg-surface-low"
                        >
                            Sign out
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || (mode === 'totp' ? code.trim().length < 6 : recoveryCode.trim().length < 8)}
                            className="flex-1 rounded-xl bg-warm-dark px-4 py-3 text-sm text-surface-low transition-colors hover:bg-warm-dark/90 disabled:opacity-60"
                        >
                            {submitting ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 size={15} className="animate-spin" />
                                    Verifying
                                </span>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TwoFactorPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-surface-low flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-warm-border/30 border-t-olive rounded-full animate-spin" />
                </div>
            }
        >
            <TwoFactorChallengeScreen />
        </Suspense>
    );
}
