import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Refresh the session token (Fast, cookie-based refresh)
  let supabaseResponse = await updateSession(request);

  // 2. Setup the server client for auth checks
  // This must match your cookie settings in updateSession to keep them in sync
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Re-verify the user server-side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. DEFINE PROTECTED ROUTES
  const PROTECTED_PREFIXES = ['/dashboard', '/archive', '/create', '/succession', '/admin'];
  const isProtectedRoute = PROTECTED_PREFIXES.some((path) => pathname.startsWith(path));

  // Redirect to login if user is not authenticated and trying to access a protected route
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    const redirectTo = url.pathname + url.search;
    url.pathname = '/login';
    url.searchParams.set('next', redirectTo);
    return NextResponse.redirect(url);
  }

  // 4. PREVENT AUTH LOOPS
  // If user is logged in and tries to access login/signup, send them to dashboard
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // 5. CACHE HARDENING
  // Prevent browser caching of state-critical pages to ensure role changes are caught
  const noCachePaths = [
    '/archive',
    '/create',
    '/dashboard',
    '/choice-pricing',
    '/personal-confirmation',
    '/family-confirmation',
    '/payment-success'
  ];

  const shouldNoCache = noCachePaths.some((path) => pathname.startsWith(path));

  if (shouldNoCache) {
    supabaseResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    supabaseResponse.headers.set('Pragma', 'no-cache');
    supabaseResponse.headers.set('Expires', '0');
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
