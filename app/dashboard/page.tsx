// ============================================
// FILE 3: app/dashboard/page.tsx
// ============================================
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const savedMode = localStorage.getItem('legacy-vault-mode') || 'personal';
    const userId = localStorage.getItem('user-id');

    if (userId) {
      router.push(`/dashboard/${savedMode}/${userId}`);
    } else {
      // If no user exists yet, send them to pricing to start the process
      router.push('/choice-pricing');
    }
  }, [router]);


  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4" />
        <p className="text-charcoal/60">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}