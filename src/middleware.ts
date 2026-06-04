import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/live-counselling', '/my-plan', '/checkout']
const adminRoutes = ['/admin/custom']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
