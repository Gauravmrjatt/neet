import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getTotalCredits, decrementCredits } from '@/lib/queries'
import { checkLimit, extractClientIp } from '@/lib/rate-limit'
import { predict } from '@/lib/predictor/engine'
import type { PredictRequest, PredictResponse } from '@/lib/predictor/types'

const ANON_LIMIT = { limit: 15, windowMs: 60 * 60 * 1000 }
const AUTH_LIMIT = { limit: 120, windowMs: 60 * 60 * 1000 }

const MAX_BODY_BYTES = 1024
const MAX_RANK = 2_000_000
const MAX_SCORE = 720
const MAX_STRING_LEN = 64

function sanitize(val: unknown, maxLen = MAX_STRING_LEN): string | undefined {
  if (typeof val !== 'string') return undefined
  const trimmed = val.trim().slice(0, maxLen)
  return trimmed.length > 0 ? trimmed : undefined
}

export async function POST(request: Request) {
  try {
    const clientIp = extractClientIp(request)
    const user = await getCurrentUser()
    const { limit, windowMs } = user ? AUTH_LIMIT : ANON_LIMIT
    const rl = checkLimit(`predict:${user?.id ?? clientIp}`, { limit, windowMs })

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rl.retryAfterSeconds),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(rl.remaining),
          },
        },
      )
    }

    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request body too large.' }, { status: 413 })
    }

    const body: PredictRequest = await request.json()

    const category = sanitize(body.category)
    if (!category) {
      return NextResponse.json({ error: 'Category is required.' }, { status: 400 })
    }

    const hasRank = typeof body.rank === 'number' && Number.isFinite(body.rank) && body.rank >= 1
    const hasScore = typeof body.score === 'number' && Number.isFinite(body.score) && body.score >= 1

    if (!hasRank && !hasScore) {
      return NextResponse.json(
        { error: 'Either a valid NEET rank (1–20,00,000) or score (1–720) is required.' },
        { status: 400 },
      )
    }

    if (hasRank && (body.rank! > MAX_RANK || body.rank! < 1)) {
      return NextResponse.json(
        { error: `Rank must be between 1 and ${MAX_RANK.toLocaleString('en-IN')}.` },
        { status: 400 },
      )
    }

    if (hasScore && (body.score! > MAX_SCORE || body.score! < 1)) {
      return NextResponse.json(
        { error: `Score must be between 1 and ${MAX_SCORE}.` },
        { status: 400 },
      )
    }

    const quota = sanitize(body.quota)
    const state = sanitize(body.state)
    const course = sanitize(body.course)

    const filtered: PredictRequest = { category }
    if (hasRank) filtered.rank = Math.floor(body.rank!)
    if (hasScore) filtered.score = Math.floor(body.score!)
    if (quota) filtered.quota = quota
    if (state) filtered.state = state
    if (course) filtered.course = course

    const { results, summary } = predict(filtered)

    let isPremium = false
    let creditsRemaining = 0
    if (user) {
      creditsRemaining = await getTotalCredits(user.id)
      if (creditsRemaining > 0) {
        isPremium = true
      }
    }

    if (isPremium && results.length > 0) {
      await decrementCredits(user!.id)
      creditsRemaining = Math.max(0, creditsRemaining - 1)
    }

    const response: PredictResponse = {
      premium: isPremium,
      creditsRemaining,
      total: results.length,
      results: isPremium ? results : results.slice(0, 1),
    }

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(rl.remaining),
      },
    })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    )
  }
}
