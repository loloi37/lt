'use client';

import { useState, use } from 'react';
import {
    ArrowLeft, Mail, User,
    Loader2, CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type AnonStep =
    | 'form'
    | 'verify'
    | 'success';

export default function AnonymousContributePage({
    params
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = use(params);
    const router = useRouter();

    const [step, setStep] =
        useState<AnonStep>('form');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] =
        useState<string | null>(null);
    const [contributionId, setContributionId] =
        useState<string | null>(null);

    const handleSendCode = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `/api/invite/${token}/anonymous/send-code`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email })
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setStep('verify');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `/api/invite/${token}/anonymous/verify`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email, code, name
                    })
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setContributionId(data.contributionId);
            setStep('success');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 1 — Name and email
    if (step === 'form') {
        return (
            <div className="min-h-screen bg-surface-low
        flex items-center justify-center p-6">
                <div className="max-w-md w-full">

                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center
              gap-2 text-warm-dark/40
              hover:text-warm-dark mb-8
              transition-colors text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <h1 className="font-serif text-3xl
            text-warm-dark mb-2">
                        Contribute without an account
                    </h1>
                    <p className="text-warm-dark/50 text-sm
            mb-8 leading-relaxed">
                        We will send a quick verification code
                        to your email to confirm your identity.
                        No password needed.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50
              border border-red-200 rounded-xl">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSendCode}
                        className="space-y-5"
                    >
                        <div>
                            <label className="block text-xs
                font-medium text-warm-dark/50
                uppercase tracking-wider mb-2">
                                Your name
                            </label>
                            <div className="relative">
                                <User size={16}
                                    className="absolute left-4
                    top-1/2 -translate-y-1/2
                    text-warm-dark/30" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e =>
                                        setName(e.target.value)}
                                    placeholder="e.g. Aunt Margaret"
                                    required
                                    className="w-full pl-11 pr-4
                    py-3 glass-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs
                font-medium text-warm-dark/50
                uppercase tracking-wider mb-2">
                                Your email
                            </label>
                            <div className="relative">
                                <Mail size={16}
                                    className="absolute left-4
                    top-1/2 -translate-y-1/2
                    text-warm-dark/30" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e =>
                                        setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-11 pr-4
                    py-3 glass-input"
                                />
                            </div>
                            <p className="text-xs
                text-warm-dark/30 mt-1">
                                Used only to verify your identity
                                and link your contribution.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl
                font-medium transition-all flex
                items-center justify-center gap-2
                ${loading
                                    ? 'bg-warm-border/20 text-warm-dark/30'
                                    : 'glass-btn-dark'
                                }`}
                        >
                            {loading
                                ? <Loader2 size={18}
                                    className="animate-spin" />
                                : 'Send verification code →'
                            }
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Step 2 — OTP verification
    if (step === 'verify') {
        return (
            <div className="min-h-screen bg-surface-low
        flex items-center justify-center p-6">
                <div className="max-w-md w-full
          text-center">

                    <div className="w-16 h-16 bg-olive/10
            rounded-full flex items-center
            justify-center mx-auto mb-6">
                        <Mail size={32}
                            className="text-olive" />
                    </div>

                    <h1 className="font-serif text-3xl
            text-warm-dark mb-3">
                        Check your email
                    </h1>
                    <p className="text-warm-dark/50 text-sm
            mb-8 leading-relaxed">
                        We sent a 6-digit code to{' '}
                        <strong>{email}</strong>.
                        Enter it below to continue.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50
              border border-red-200 rounded-xl
              text-left">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handleVerifyCode}
                        className="space-y-5"
                    >
                        <input
                            type="text"
                            value={code}
                            onChange={e =>
                                setCode(e.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 6)
                                )
                            }
                            placeholder="000000"
                            maxLength={6}
                            required
                            className="w-full py-4 text-center
                text-3xl tracking-[0.5em] border
                border-warm-border/40 rounded-xl
                bg-surface-low/50 text-warm-dark
                focus:outline-none focus:border-olive
                transition-all font-mono"
                        />

                        <button
                            type="submit"
                            disabled={loading || code.length < 6}
                            className={`w-full py-3.5 rounded-xl font-medium transition-all
                ${loading || code.length < 6
                                    ? 'bg-warm-border/20 text-warm-dark/30 cursor-not-allowed'
                                    : 'glass-btn-dark'
                                }`}
                        >
                            {loading
                                ? 'Verifying...'
                                : 'Verify & continue →'
                            }
                        </button>
                    </form>

                    <button
                        onClick={() => {
                            setStep('form');
                            setCode('');
                            setError(null);
                        }}
                        className="mt-4 text-sm
              text-warm-dark/30 hover:text-warm-dark
              transition-colors"
                    >
                        Use a different email
                    </button>
                </div>
            </div >
        );
    }

    // Step 3 — Success
    return (
        <div className="min-h-screen bg-surface-low flex
      items-center justify-center p-6">
            <div className="max-w-md w-full text-center">

                <div className="w-16 h-16 bg-olive/10
          rounded-full flex items-center
          justify-center mx-auto mb-6">
                    <CheckCircle size={32}
                        className="text-olive" />
                </div>

                <h1 className="font-serif text-3xl
          text-warm-dark mb-3">
                    Identity verified
                </h1>
                <p className="text-warm-dark/50 text-sm
          leading-relaxed mb-8">
                    You are now ready to contribute. The
                    archive owner will review your submission
                    before it becomes part of the permanent
                    record.
                </p>

                <a
                    href={`/invite/${token}/contribute?anonymous=true&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`}
                    className="inline-block w-full py-4 glass-btn-dark rounded-xl font-medium transition-all"
                >
                    Share your memory →
                </a>

            </div>
        </div >
    );
}