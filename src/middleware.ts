import { jwtVerify, SignJWT } from 'jose'
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
  // Short fingerprint of the secret to compare with what Payload sees
  // (Payload's source: payload/dist/auth/jwt.js uses new TextEncoder().encode(secret)
  //  directly — no hashing). If the two fingerprints differ, the env var
  // loaded in the edge runtime is not the same as in the Node.js runtime.
  const secretFingerprint = Array.from(
    new Uint8Array(await crypto.subtle.digest('SHA-256', secretBytes)).slice(0, 6),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  authLog('jwt', {
    step: 'input',
    secretLength: secret.length,
    secretByteLength: secretBytes.byteLength,
    secretFingerprint,
    secretHeadTail: `${JSON.stringify(secret.slice(0, 4))}…${JSON.stringify(secret.slice(-4))}`,
    tokenLength: token.length,
    tokenPreview: `${token.slice(0, 24)}…`,
  })

  // Try multiple key strategies in order, logging which one succeeds.
  // Payload's jwtSign uses: new TextEncoder().encode(secret) — raw bytes.
  // We mirror that exactly as the first candidate.
  const candidates: Array<{ name: string; bytes: Uint8Array }> = [
    { name: 'raw', bytes: secretBytes },
    { name: 'sha256', bytes: new Uint8Array(await crypto.subtle.digest('SHA-256', secretBytes)) },
  ]

  for (const cand of candidates) {
    try {
      const key = await crypto.subtle.importKey(
        'raw',
        cand.bytes,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify'],
      )

      // Self-test: sign a test JWT with the same key and immediately verify it.
      // If this round-trip fails, the key derivation is wrong for this candidate.
      const iat = Math.floor(Date.now() / 1000)
      const testToken = await new SignJWT({ selftest: true })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt(iat)
        .setExpirationTime(iat + 60)
        .sign(cand.bytes)
      const selfCheck = await jwtVerify(testToken, key, { algorithms: ['HS256'] }).catch(
        (e: unknown) => ({ error: e instanceof Error ? e.message : String(e) }),
      )

      authLog('jwt', {
        step: 'selftest',
        candidate: cand.name,
        keyByteLength: cand.bytes.byteLength,
        selfTestOk: !('error' in selfCheck),
        selfTestError: 'error' in selfCheck ? selfCheck.error : undefined,
      })

      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
      authLog('jwt', {
        step: 'verify',
        ok: true,
        candidate: cand.name,
        role: (payload as { role?: string })?.role ?? null,
        payloadKeys: payload ? Object.keys(payload) : [],
        exp: (payload as { exp?: number })?.exp ?? null,
      })
      return ((payload as { role?: string })?.role as string) || null
    } catch (err) {
      authLog('jwt', {
        step: 'verify',
        ok: false,
        candidate: cand.name,
        error: err instanceof Error ? err.message : String(err),
        errorName: err instanceof Error ? err.name : 'Unknown',
      })
    }
  }

  authLog('jwt', { step: 'verify', ok: false, summary: 'all candidates failed' })
  return null
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
