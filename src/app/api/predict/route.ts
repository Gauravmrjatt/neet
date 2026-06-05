import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getActiveSubscription } from '@/lib/queries'
import { predict } from '@/lib/predictor/engine'
import type { PredictRequest, PredictResponse } from '@/lib/predictor/types'

export async function POST(request: Request) {
  try {
    const body: PredictRequest = await request.json()

    if (!body.rank || typeof body.rank !== 'number' || body.rank < 1) {
      return NextResponse.json(
        { error: 'A valid NEET rank is required.' },
        { status: 400 },
      )
    }

    const { results, summary } = predict(body)

    const user = await getCurrentUser()
    let isPremium = false
    if (user) {
      const subscription = await getActiveSubscription(user.id)
      isPremium = !!subscription
    }

    const response: PredictResponse = {
      premium: isPremium,
      total: results.length,
      summary,
      results: isPremium ? results : results.slice(0, 1),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    )
  }
}
