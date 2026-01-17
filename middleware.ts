import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page without auth (with or without trailing slash)
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return NextResponse.next()
  }

  // Redirect /admin to /admin/dashboard (or login if not authenticated)
  if (pathname === '/admin' || pathname === '/admin/') {
    const sessionToken = request.cookies.get('admin_session')?.value
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login/', request.url))
    }
    return NextResponse.redirect(new URL('/admin/dashboard/', request.url))
  }

  // Check auth for all other admin routes
  if (pathname.startsWith('/admin/')) {
    const sessionToken = request.cookies.get('admin_session')?.value
    if (!sessionToken) {
      const loginUrl = new URL('/admin/login/', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/', '/admin/:path*']
}
