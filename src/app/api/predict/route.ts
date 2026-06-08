import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getActiveSubscription, markPredictorUsed } from '@/lib/queries'
import { checkLimit, extractClientIp } from '@/lib/rate-limit'
import { predict } from '@/lib/predictor/engine'
import type { PredictRequest, PredictResponse } from '@/lib/predictor/types'

const ANON_LIMIT = { limit: 15, windowMs: 60 * 60 * 1000 }
const AUTH_LIMIT = { limit: 120, windowMs: 60 * 60 * 1000 }

const MAX_BODY_BYTES = 1024 // 1 KB — a predict request is tiny
const MAX_RANK = 2_000_000
const MAX_STRING_LEN = 64

function sanitize(val: unknown, maxLen = MAX_STRING_LEN): string | undefined {
  if (typeof val !== 'string') return undefined
  const trimmed = val.trim().slice(0, maxLen)
  return trimmed.length > 0 ? trimmed : undefined
}

export async function POST(request: Request) {
  try {
    // --- Rate limit (first thing, before any expensive work) ---
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

    // --- Body size guard ---
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request body too large.' }, { status: 413 })
    }

    const body: PredictRequest = await request.json()

    // --- Input hardening ---
    if (typeof body.rank !== 'number' || !Number.isFinite(body.rank) || body.rank < 1 || body.rank > MAX_RANK) {
      return NextResponse.json(
        { error: `A valid NEET rank (1–${MAX_RANK.toLocaleString()}) is required.` },
        { status: 400 },
      )
    }

    const category = sanitize(body.category)
    const quota = sanitize(body.quota)
    const state = sanitize(body.state)
    const course = sanitize(body.course)

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required.' },
        { status: 400 },
      )
    }

    const filtered: PredictRequest = { rank: Math.floor(body.rank), category }
    if (quota) filtered.quota = quota
    if (state) filtered.state = state
    if (course) filtered.course = course

    // --- Predict (engine already imports data at module scope) ---
    const { results, summary } = predict(filtered)

    let isPremium = false
    if (user) {
      const subscription = await getActiveSubscription(user.id)
      if (subscription) {
        if (subscription.predictorUsed) {
          return NextResponse.json(
            {
              error:
                'You have already used your one-time prediction. Please purchase a new plan to predict again.',
              code: 'PREDICTOR_ALREADY_USED',
            },
            { status: 403 },
          )
        }
        isPremium = true
      }
    }

    if (isPremium && results.length > 0) {
      await markPredictorUsed(user!.id)
    }

    const response: PredictResponse = {
      premium: isPremium,
      total: results.length,
      summary,
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
