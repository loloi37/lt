// ============================================
// FILE 3: app/dashboard/page.tsx
// ============================================
'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const savedMode = localStorage.getItem('legacy-vault-mode') || 'personal';
    const userId = localStorage.getItem('user-id');
    const checkin = searchParams.get('checkin');

    if (userId) {
      const url = `/dashboard/${savedMode}/${userId}${checkin ? '?checkin=true' : ''}`;
      router.push(url);
    } else {
      router.push('/choice-pricing');
    }
  }, [router, searchParams]);


  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-mist/30 border-t-mist rounded-full animate-spin mx-auto mb-4" />
        <p className="text-charcoal/60">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}