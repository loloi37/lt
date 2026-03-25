'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

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

    const checkin = searchParams.get('checkin');

    // Use server-validated state to determine the correct dashboard
    // This is the single source of truth — no stale browser cache
    const paidArchive = auth.archives.find(a => a.paid);
    let mode = 'personal';
    if (paidArchive) {
      mode = paidArchive.mode;
    } else if (auth.archives.length > 0) {
      mode = auth.archives[0].mode || 'draft';
    }

    const url = `/dashboard/${mode}/${auth.user!.id}${checkin ? '?checkin=true' : ''}`;
    router.replace(url);
  }, [auth.loading, auth.authenticated, auth.archives, auth.user, searchParams, router]);

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
