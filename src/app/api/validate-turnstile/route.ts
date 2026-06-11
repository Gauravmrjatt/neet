import { NextResponse } from 'next/server'
import { verifyTurnstileToken } from '@/lib/turnstile'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing or invalid token' }, { status: 400 })
    }

    const result = await verifyTurnstileToken(token)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Verification failed' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('validate-turnstile error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
