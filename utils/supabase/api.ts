import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create an authenticated Supabase client for API routes.
 * This reads the session from cookies and verifies the user server-side.
 * Use this instead of trusting client-sent userId.
 */
export async function createAuthenticatedClient() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored in read-only contexts (GET routes)
          }
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { supabase, user, error };
}
