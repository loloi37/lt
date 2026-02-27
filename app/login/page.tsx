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

    router.push(next);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mist/10 via-ivory to-stone/10 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-sand/30 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-charcoal mb-2">Welcome Back</h1>
            <p className="text-charcoal/60 text-sm">
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
              <label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-sand/40 rounded-xl bg-ivory/50 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-mist focus:ring-2 focus:ring-mist/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="w-full pl-11 pr-4 py-3 border border-sand/40 rounded-xl bg-ivory/50 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-mist focus:ring-2 focus:ring-mist/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-sand/20 text-charcoal/30 cursor-not-allowed'
                  : 'bg-charcoal hover:bg-charcoal/90 text-ivory'
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
            <p className="text-sm text-charcoal/50">
              Don&apos;t have an account?{' '}
              <Link
                href={`/signup${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`}
                className="text-mist font-medium hover:underline"
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
        <div className="min-h-screen bg-ivory flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-sand/30 border-t-charcoal/40 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
