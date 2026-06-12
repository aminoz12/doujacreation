import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// NOTE: This middleware is a CHEAP first gate for UX (redirect to login) and
// to reject obviously-unauthenticated API noise early. It only checks for the
// PRESENCE of the session cookie — it does NOT validate the token against the
// database. Real authorization is enforced in each /api/admin/* route handler
// via requireAdmin() (see lib/api-auth.ts). Never rely on middleware alone for
// authz.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth API endpoints must stay reachable without a session.
  if (
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout' ||
    pathname === '/api/admin/session'
  ) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get('admin_session')?.value

  // Protected admin API: return 401 JSON (a redirect would be wrong for fetch).
  if (pathname.startsWith('/api/admin/')) {
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // Allow login page without auth (with or without trailing slash)
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return NextResponse.next()
  }

  // Redirect /admin to /admin/dashboard (or login if not authenticated)
  if (pathname === '/admin' || pathname === '/admin/') {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Check auth for all other admin pages
  if (pathname.startsWith('/admin/')) {
    if (!sessionToken) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/', '/admin/:path*', '/api/admin/:path*']
}
