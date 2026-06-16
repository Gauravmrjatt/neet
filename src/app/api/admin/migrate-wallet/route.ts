import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'

const BATCH_SIZE = 50

export async function POST(request: Request) {
  try {
    // Admin-only access
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { dryRun } = await request.json().catch(() => ({ dryRun: false }))

    const payload = await getPayloadClient()
    const UserModel = payload.db.collections['users']

    if (!UserModel) {
      return NextResponse.json({ error: 'User collection not found' }, { status: 500 })
    }

    // Find all users who have subscriptions with credits remaining (paginated)
    const userCreditMap = new Map<string, number>()
    let page = 1
    let hasMore = true

    while (hasMore) {
      const batch = await payload.find({
        collection: 'subscriptions',
        where: {
          and: [
            { status: { in: ['active', 'pending'] } },
            { creditsRemaining: { greater_than: 0 } },
          ],
        },
        depth: 1,
        limit: 100,
        page,
      })

      for (const sub of batch.docs) {
        const userId = typeof sub.user === 'object' ? sub.user?.id : sub.user
        if (!userId) continue
        const existing = userCreditMap.get(userId) || 0
        userCreditMap.set(userId, existing + (sub.creditsRemaining || 0))
      }

      hasMore = batch.hasNextPage
      page++
    }

    const results = {
      dryRun,
      total: userCreditMap.size,
      processed: 0,
      skipped: 0,
      errors: 0,
      details: [] as { userId: string; credits: number; status: string }[],
    }

    // Process in batches
    const entries = Array.from(userCreditMap.entries())
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE)

      const operations = batch.map(async ([userId, credits]) => {
        try {
          // Skip users who already have wallet credits (idempotent)
          const existingUser = await payload.findByID({
            collection: 'users',
            id: userId,
          })
          const currentWallet = (existingUser as any).predictionCreditsRemaining ?? 0

          if (currentWallet > 0) {
            results.skipped++
            results.details.push({
              userId,
              credits,
              status: `skipped (wallet already has ${currentWallet} credits)`,
            })
            return
          }

          if (dryRun) {
            results.details.push({
              userId,
              credits,
              status: `would add ${credits} credits (dry run)`,
            })
            return
          }

          // Atomically add credits to wallet
          await UserModel.updateOne(
            { _id: userId },
            {
              $inc: {
                predictionCredits: credits,
                predictionCreditsRemaining: credits,
              },
            },
          )

          results.processed++
          results.details.push({
            userId,
            credits,
            status: `added ${credits} credits`,
          })
        } catch (err) {
          results.errors++
          results.details.push({
            userId,
            credits,
            status: `error: ${err instanceof Error ? err.message : 'unknown'}`,
          })
        }
      })

      await Promise.all(operations)
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed. Check server logs.' },
      { status: 500 },
    )
  }
}
