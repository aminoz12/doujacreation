import { NextResponse } from 'next/server'
import { getSession } from './auth'

/**
 * Authorization guard for protected /api/admin/* route handlers.
 *
 * Returns the authenticated admin session, or a 401 NextResponse that the
 * handler should return immediately.
 *
 * Usage at the very top of every protected handler:
 *
 *   const auth = await requireAdmin()
 *   if (auth instanceof NextResponse) return auth
 *   // authenticated — auth.admin_id / auth.username are available
 *
 * Authorization is enforced HERE, in the data/route layer — never rely on
 * middleware alone for authz. Next.js middleware is meant for redirects and
 * has had auth-bypass classes of bugs; the route handler is the real gate.
 */
export async function requireAdmin(): Promise<
  { admin_id: string; username: string } | NextResponse
> {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
  return session
}
