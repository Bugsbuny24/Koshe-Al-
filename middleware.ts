import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip admin panel - it handles its own auth
  if (pathname.startsWith('/x42-panel')) {
    return NextResponse.next();
  }

  // Skip public routes
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/manifest')
  ) {
    const res = NextResponse.next();
    addSecurityHeaders(res);
    return res;
  }

  // Protect app routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/mentor') ||
      pathname.startsWith('/builder') || pathname.startsWith('/plans') ||
      pathname.startsWith('/profile') || pathname.startsWith('/courses') ||
      pathname.startsWith('/deploy') || pathname.startsWith('/marketplace') ||
      pathname.startsWith('/community') || pathname.startsWith('/create') ||
      pathname.startsWith('/settings') || pathname.startsWith('/learning-path')) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    addSecurityHeaders(response);
    return response;
  }

  const res = NextResponse.next();
  addSecurityHeaders(res);
  return res;
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

