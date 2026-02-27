'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

function DashboardRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    redirectToDashboard();
  }, []);

  const redirectToDashboard = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login?next=/dashboard');
      return;
    }

    const checkin = searchParams.get('checkin');

    // Determine the mode from the user's most recent memorial
    const { data: memorial } = await supabase
      .from('memorials')
      .select('mode')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const mode = memorial?.mode || 'personal';
    const url = `/dashboard/${mode}/${user.id}${checkin ? '?checkin=true' : ''}`;
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-mist/30 border-t-mist rounded-full animate-spin mx-auto mb-4" />
        <p className="text-charcoal/60">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

export default function DashboardRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-mist/30 border-t-mist rounded-full animate-spin mx-auto" />
      </div>
    }>
      <DashboardRedirectContent />
    </Suspense>
  );
}
