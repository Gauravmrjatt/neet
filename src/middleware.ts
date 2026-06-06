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
    // Payload hashes the secret with SHA-256 internally to meet HS256's
    // 32-byte minimum key length. We must do the same or the signature
    // will never match — that was the bug producing
    // JWSSignatureVerificationFailed.
    const hashed = new Uint8Array(await crypto.subtle.digest('SHA-256', secretBytes))
    const key = await crypto.subtle.importKey(
      'raw',
      hashed,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    authLog('jwt', {
      step: 'key',
      ok: true,
      alg: 'HS256',
      keyByteLength: hashed.byteLength,
      keyDerivation: 'sha256(secret)',
    })

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value

  // Admin routes — require admin role. Exclude /admin/login (Payload's
  // own login page) so unauthenticated visitors are sent there.
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

    const role = await getRoleFromToken(token)
    authLog('decision', { pathname, role, action: role === 'admin' ? 'allow' : 'redirect', to: role === 'admin' ? null : '/my-plan' })

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/my-plan', request.url))
    }
  }

  // Cheap cookie-existence gate for the routes AGENTS.md documents.
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
