'use client';

import DashboardNav from '@/components/dashboard/DashboardNav';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.authenticated) {
      router.replace('/login?next=/dashboard');
    }
  }, [auth.loading, auth.authenticated, router]);

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-surface-low flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-warm-border/30 border-t-olive rounded-full animate-spin" />
      </div>
    );
  }

  if (!auth.authenticated) return null;

  return (
    <div className="min-h-screen bg-surface-low flex flex-col md:flex-row">
      <aside className="md:w-64 md:min-h-screen md:border-r border-warm-border/30 bg-surface-mid/40 backdrop-blur-sm">
        <div className="hidden md:block px-6 pt-6 pb-2">
          <h1 className="font-serif text-xl text-warm-dark">Ulumae</h1>
          <p className="text-xs text-warm-muted mt-1">Your living archive</p>
        </div>
        <DashboardNav />
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
