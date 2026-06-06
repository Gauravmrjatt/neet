import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const cookieProtectedRoutes = ['/live-counselling', '/admin/custom']

async function getRoleFromToken(token: string): Promise<string | null> {
  try {
    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET)
    const { payload } = await jwtVerify(token, secret)
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
