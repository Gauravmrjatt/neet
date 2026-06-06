import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const cookieProtectedRoutes = ['/live-counselling', '/admin/custom']

async function getRoleFromToken(token: string): Promise<string | null> {
  try {
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) return null

    // Use crypto.subtle.importKey so short PAYLOAD_SECRET values still work.
    // jose's raw Uint8Array path enforces a 32-byte minimum for HS256 and
    // throws on shorter secrets; a CryptoKey bypasses that check.
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )

    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return (payload?.role as string) || null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value

  // Admin routes — require admin role. Exclude /admin/login (Payload's own login page)
  // so unauthenticated admins are sent to Payload's login, not the user login.
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const role = await getRoleFromToken(token)
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/my-plan', request.url))
    }
  }

  // Other protected routes — require any authenticated user
  if (cookieProtectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
