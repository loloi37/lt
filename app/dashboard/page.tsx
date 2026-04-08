'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, getDashboardPath } from '@/components/providers/AuthProvider';

function DashboardRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (auth.loading) return;

    if (!auth.authenticated) {
      router.replace('/login?next=/dashboard');
      return;
    }

    // Single source of truth: resolve the correct dashboard from the
    // server-validated plan, not from ad-hoc archive inspection. This
    // keeps plan-based navigation consistent with the plan guards in
    // each dashboard page and prevents back-and-forth redirects.
    const checkin = searchParams.get('checkin');
    const basePath = getDashboardPath(auth);
    const url = checkin ? `${basePath}?checkin=true` : basePath;
    router.replace(url);
  }, [auth, searchParams, router]);

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-warm-border/30 border-t-olive rounded-full animate-spin mx-auto mb-4" />
        <p className="text-warm-muted">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

export default function DashboardRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-low flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-warm-border/30 border-t-olive rounded-full animate-spin mx-auto" />
      </div>
    }>
      <DashboardRedirectContent />
    </Suspense>
  );
}
