'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    errorParam === 'auth_callback_failed'
      ? 'Authentication failed. Please try again.'
      : null
  );
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Use replace to prevent back-button going to login after successful auth
    router.replace(next);
    router.refresh();
  };

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
            <h1 className="font-serif text-3xl text-warm-dark mb-2">Welcome Back</h1>
            <p className="text-warm-muted text-sm">
              Sign in to continue to your archives
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Your password"
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-warm-muted">
              Don&apos;t have an account?{' '}
              <Link
                href={`/signup${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`}
                className="text-olive font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-low flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-warm-border/30 border-t-olive rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
