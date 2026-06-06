import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const cookieProtectedRoutes = ['/live-counselling', '/admin/custom']

// Set DEBUG_AUTH=true to force-enable logs in production. Off by default in prod.
const DEBUG_AUTH =
  process.env.DEBUG_AUTH === 'true' || process.env.NODE_ENV !== 'production'

function authLog(scope: string, data: Record<string, unknown>) {
  if (!DEBUG_AUTH) return
  const tag = `[auth:${scope}]`
  // eslint-disable-next-line no-console
  console.log(tag, JSON.stringify({ time: new Date().toISOString(), ...data }))
}

/**
 * Verifies the payload-token JWT and returns the user's role.
 * Logs every step of the verification so the root cause of a failure
 * (short secret, wrong secret, missing role, expired token, etc.) is
 * visible in the server logs.
 *
 * NOTE: currently not wired into any access control — kept here so the
 * role check can be re-enabled later with full diagnostic logging.
 */
export async function getRoleFromToken(token: string): Promise<string | null> {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) {
    authLog('jwt', { step: 'secret', ok: false, error: 'PAYLOAD_SECRET is not set' })
    return null
  }

  const secretBytes = new TextEncoder().encode(secret)
  authLog('jwt', {
    step: 'input',
    secretLength: secret.length,
    secretByteLength: secretBytes.byteLength,
    tokenLength: token.length,
    tokenPreview: `${token.slice(0, 24)}…`,
  })

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    authLog('jwt', { step: 'key', ok: true, alg: 'HS256' })

    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    authLog('jwt', {
      step: 'verify',
      ok: true,
      role: (payload as { role?: string })?.role ?? null,
      payloadKeys: payload ? Object.keys(payload) : [],
      exp: (payload as { exp?: number })?.exp ?? null,
    })
    return ((payload as { role?: string })?.role as string) || null
  } catch (err) {
    authLog('jwt', {
      step: 'verify',
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      errorName: err instanceof Error ? err.name : 'Unknown',
    })
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value

  // Observability: log every /admin request's auth state. This is the
  // signal we need to debug why an admin was being redirected to /my-plan
  // when the role check was active. Fire-and-forget so the response is
  // never blocked by verification work.
  if (pathname.startsWith('/admin')) {
    authLog('request', {
      pathname,
      hasToken: !!token,
      tokenLength: token?.length ?? 0,
    })
    if (token) {
      void getRoleFromToken(token)
    }
  }

  // Cheap cookie-existence gate for the routes the AGENTS.md documents.
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
