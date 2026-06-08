import { NextRequest, NextResponse } from 'next/server'

const cookieProtectedRoutes = ['/admin/custom']

const DEBUG_AUTH =
  process.env.DEBUG_AUTH === 'true' || process.env.NODE_ENV !== 'production'

function authLog(scope: string, data: Record<string, unknown>) {
  if (!DEBUG_AUTH) return
  const tag = `[auth:${scope}]`
  // eslint-disable-next-line no-console
  console.log(tag, JSON.stringify({ time: new Date().toISOString(), ...data }))
}

type DecodedToken = {
  role: string | null
  expired: boolean
  decoded: Record<string, unknown> | null
}

/**
 * SECURITY NOTE: This middleware does NOT verify the JWT signature.
 * It only decodes the payload to read the role for routing purposes.
 * A forged JWT with `role: "admin"` would pass this check, but would
 * fail at Payload's API layer where `payload.auth()` performs proper
 * signature verification. The middleware is a UX redirect layer, not
 * a security boundary.
 */
function getRoleFromToken(token: string): DecodedToken {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { role: null, expired: true, decoded: null }
    }

    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'),
    ) as Record<string, unknown>

    const now = Math.floor(Date.now() / 1000)
    const expired = typeof payload.exp === 'number' && payload.exp < now

    return {
      role: typeof payload.role === 'string' ? payload.role : null,
      expired,
      decoded: payload,
    }
  } catch {
    return { role: null, expired: true, decoded: null }
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    authLog('request', {
      pathname,
      hasToken: !!token,
      tokenLength: token?.length ?? 0,
    })

    if (!token) {
      authLog('decision', { pathname, action: 'redirect', to: '/admin/login', reason: 'no-token' })
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const { role, expired, decoded } = getRoleFromToken(token)
    authLog('decode', {
      pathname,
      iat: decoded?.iat ?? null,
      exp: decoded?.exp ?? null,
      role: decoded?.role ?? null,
      email: decoded?.email ?? null,
      expired,
    })

    if (expired) {
      authLog('decision', { pathname, action: 'redirect', to: '/admin/login', reason: 'expired' })
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (role !== 'admin') {
      authLog('decision', { pathname, role, action: 'redirect', to: '/my-plan' })
      return NextResponse.redirect(new URL('/my-plan', request.url))
    }

    authLog('decision', { pathname, role, action: 'allow' })
  }

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
