'use client';

import { useState } from 'react';
import {
    ArrowLeft, Mail, Lock, User,
    Loader2, Eye, EyeOff
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { InvitationData } from '../page';

type AuthMode = 'signup' | 'login';

interface Props {
    invitation: InvitationData;
    onSuccess: () => void;
    onBack: () => void;
}

export default function InviteAuthStep({
    invitation,
    onSuccess,
    onBack
}: Props) {
    const [mode, setMode] =
        useState<AuthMode>('signup');
    const [name, setName] = useState('');
    const [email, setEmail] = useState(
        invitation.inviteeEmail || ''
    );
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(
        null
    );

    const emailIsLocked =
        !!invitation.inviteeEmail &&
        mode === 'signup';

    const emailDiffers =
        mode === 'signup' &&
        invitation.inviteeEmail &&
        email.trim().toLowerCase() !==
        invitation.inviteeEmail.toLowerCase() &&
        email.trim() !== '';

    const supabase = createClient();

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                // Validate
                if (!name.trim()) {
                    setError('Please enter your name.');
                    setLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters.');
                    setLoading(false);
                    return;
                }

                // ADDED: Destructure `data`
                const { data, error: signUpError } =
                    await supabase.auth.signUp({
                        email: email.trim(),
                        password,
                        options: {
                            data: { full_name: name.trim() },
                            // ADDED: Tell Supabase to send them right back to this invite page after verifying!
                            emailRedirectTo: window.location.href,
                        }
                    });

                if (signUpError) throw signUpError;

                // ADDED: Handle the email confirmation requirement gracefully
                if (!data.session) {
                    setError('Account created! Please check your email and click the confirmation link to join the archive.');
                    setLoading(false);
                    return;
                }

                onSuccess();
            } else {
                // Login mode remains the same
                const { error: signInError } =
                    await supabase.auth.signInWithPassword({
                        email: email.trim(),
                        password
                    });

                if (signInError) throw signInError;
                onSuccess();
            }
        } catch (err: any) {
            const msg = err.message || '';
            if (msg.includes('already registered')) {
                setError('This email already has an account. Try logging in instead.');
                setMode('login');
            } else if (msg.includes('Invalid login')) {
                setError('Incorrect email or password. Please try again.');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br 
      from-mist/10 via-ivory to-stone/10">

            {/* Minimal header */}
            <div className="border-b border-sand/20 
        bg-white/60 backdrop-blur-sm">
                <div className="max-w-2xl mx-auto px-6 
          py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center 
              gap-2 text-charcoal/40 
              hover:text-charcoal transition-colors 
              text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <span className="text-xs tracking-widest 
            uppercase text-charcoal/30 font-sans">
                        Legacy Vault
                    </span>
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 
        py-16">

                {/* Context header — keeps user grounded */}
                <div className="text-center mb-10">
                    <h1 className="font-serif text-3xl 
            text-charcoal mb-3">
                        {mode === 'signup'
                            ? `Create your space to join 
                 ${invitation.memorial.fullName}
                 's archive`
                            : 'Welcome back'
                        }
                    </h1>
                    <p className="text-charcoal/50 text-sm">
                        {mode === 'signup'
                            ? 'A free account keeps your contributions linked to you over time.'
                            : `Log in to continue to ${invitation.memorial.fullName}'s archive.`
                        }
                    </p>
                </div>

                {/* Email differs warning */}
                {emailDiffers && (
                    <div className="mb-6 p-4 bg-sand/20 
            border border-sand/40 rounded-xl">
                        <p className="text-xs 
              text-charcoal/60 leading-relaxed">
                            This invitation was sent to{' '}
                            <strong>
                                {invitation.inviteeEmail}
                            </strong>
                            . Since you are using a different
                            email, the archive owner will see
                            your name and email as the person
                            who responded. That is completely
                            fine.
                        </p>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 
            border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Name field — signup only */}
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-xs 
                font-medium text-charcoal/50 
                uppercase tracking-wider mb-2">
                                Your name
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute 
                  left-4 top-1/2 -translate-y-1/2 
                  text-charcoal/30" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e =>
                                        setName(e.target.value)}
                                    placeholder="e.g. Margaret Chen"
                                    required
                                    className="w-full pl-11 pr-4 
                    py-3 border border-sand/40 
                    rounded-xl bg-ivory/50 
                    text-charcoal focus:outline-none 
                    focus:border-mist focus:ring-2 
                    focus:ring-mist/10 transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email field */}
                    <div>
                        <label className="block text-xs 
              font-medium text-charcoal/50 
              uppercase tracking-wider mb-2">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute 
                left-4 top-1/2 -translate-y-1/2 
                text-charcoal/30" />
                            <input
                                type="email"
                                value={email}
                                onChange={e =>
                                    !emailIsLocked &&
                                    setEmail(e.target.value)}
                                readOnly={emailIsLocked}
                                placeholder="you@example.com"
                                required
                                className={`w-full pl-11 pr-4 
                  py-3 border border-sand/40 
                  rounded-xl text-charcoal 
                  focus:outline-none focus:border-mist 
                  focus:ring-2 focus:ring-mist/10 
                  transition-all ${emailIsLocked
                                        ? 'bg-sand/10 cursor-not-allowed text-charcoal /60'
                                        : 'bg-ivory/50'
                                    }`}
                            />
                        </div>
                        {emailIsLocked && (
                            <p className="text-xs 
                text-charcoal/30 mt-1">
                                Pre-filled from your invitation.
                            </p>
                        )}
                    </div>

                    {/* Password field */}
                    <div>
                        <label className="block text-xs 
              font-medium text-charcoal/50 
              uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute 
                left-4 top-1/2 -translate-y-1/2 
                text-charcoal/30" />
                            <input
                                type={
                                    showPassword ? 'text' : 'password'
                                }
                                value={password}
                                onChange={e =>
                                    setPassword(e.target.value)}
                                placeholder={
                                    mode === 'signup'
                                        ? 'At least 6 characters'
                                        : 'Your password'
                                }
                                required
                                className="w-full pl-11 pr-12 
                  py-3 border border-sand/40 
                  rounded-xl bg-ivory/50 
                  text-charcoal focus:outline-none 
                  focus:border-mist focus:ring-2 
                  focus:ring-mist/10 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(p => !p)}
                                className="absolute right-4 
                  top-1/2 -translate-y-1/2 
                  text-charcoal/30 
                  hover:text-charcoal/60"
                            >
                                {showPassword
                                    ? <EyeOff size={16} />
                                    : <Eye size={16} />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-xl 
              font-medium transition-all flex 
              items-center justify-center gap-2 
              ${loading
                                ? 'bg-sand/20 text-charcoal/30 cursor-not-allowed'
                                : 'bg-charcoal hover:bg-charcoal/90 text-ivory'
                            }`}
                    >
                        {loading
                            ? <>
                                <Loader2 size={18}
                                    className="animate-spin" />
                                {mode === 'signup'
                                    ? 'Creating your account...'
                                    : 'Logging in...'
                                }
                            </>
                            : mode === 'signup'
                                ? 'Create account & continue →'
                                : 'Log in & continue →'
                        }
                    </button>
                </form>

                {/* Mode toggle */}
                <div className="mt-6 text-center">
                    {mode === 'signup' ? (
                        <p className="text-sm text-charcoal/50">
                            Already have an account?{' '}
                            <button
                                onClick={() => {
                                    setMode('login');
                                    setError(null);
                                }}
                                className="text-mist font-medium 
                  hover:underline"
                            >
                                Log in instead
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-charcoal/50">
                            Don't have an account?{' '}
                            <button
                                onClick={() => {
                                    setMode('signup');
                                    setError(null);
                                }}
                                className="text-mist font-medium 
                  hover:underline"
                            >
                                Create one
                            </button>
                        </p>
                    )}
                </div>

                {/* Anonymous option — the key addition */}
                <div className="mt-8 pt-6 border-t 
          border-sand/20 text-center">
                    <p className="text-xs text-charcoal/30 mb-3">
                        Prefer not to create an account?
                    </p>

                    <a
                        href={`/invite/${invitation.id}/anonymous`}
                        className="text-sm text-charcoal/40 hover:text-charcoal transition-colors underline underline-offset-4"
                    >
                        Contribute without an account
                    </a>
                </div>

            </div >
        </div >
    );
}