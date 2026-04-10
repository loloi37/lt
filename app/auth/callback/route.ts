import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // "next" is the redirect path after sign-in (e.g., /dashboard, /invite/[token])
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If the redirect target is an invite page, go straight there so the
      // token automatically resumes — the user never has to re-open the link.
      const target = next.startsWith('/') ? next : `/${next}`;
      return NextResponse.redirect(`${origin}${target}`);
    }
  }

  // If the "next" param points to an invite page, redirect there anyway so
  // the invite shell can detect the user is now authenticated and resume.
  if (next.startsWith('/invite/')) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // If the code exchange fails, redirect to login with an error hint
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
