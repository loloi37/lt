'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Mail, Lock, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setConfirmationSent(true);
    setLoading(false);
  };

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-mid via-surface-low to-surface-high flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-warm-border/30 p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-olive" />
            </div>
            <h1 className="font-serif text-3xl text-warm-dark mb-3">Check Your Email</h1>
            <p className="text-warm-muted mb-6">
              We sent a confirmation link to{' '}
              <strong className="text-warm-dark">{email}</strong>.
              <br />
              Click the link to activate your account.
            </p>
            <p className="text-xs text-warm-outline">
              Didn&apos;t receive it? Check your spam folder, or{' '}
              <button
                onClick={() => setConfirmationSent(false)}
                className="text-olive underline"
              >
                try again
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-mid via-surface-low to-surface-high flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-warm-muted hover:text-warm-dark transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-warm-border/30 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-warm-dark mb-2">Create Your Account</h1>
            <p className="text-warm-muted text-sm">
              Begin preserving your legacy
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-warm-outline uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-border" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 glass-input rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-warm-outline uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-border" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-3 glass-input rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-warm-outline uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-border" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-4 py-3 glass-input rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-surface-high text-warm-outline cursor-not-allowed'
                  : 'glass-btn-primary'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-warm-muted">
              Already have an account?{' '}
              <Link
                href={`/login${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`}
                className="text-olive font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-low flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-warm-border/30 border-t-olive rounded-full animate-spin" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
