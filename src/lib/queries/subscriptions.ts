import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { Subscription } from '@/payload-types'

export const getUserSubscription = cache(async (userId: string): Promise<Subscription | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'subscriptions',
    where: {
      user: {
        equals: userId,
      },
    },
    sort: '-createdAt',
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as Subscription) || null
})

export const getUserSubscriptions = cache(async (userId: string): Promise<Subscription[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'subscriptions',
    where: {
      user: {
        equals: userId,
      },
    },
    sort: '-createdAt',
    depth: 2,
  })
  return result.docs as Subscription[]
})

export const getSubscriptionsByUser = getUserSubscriptions

export const getActiveSubscriptions = cache(async (userId: string): Promise<Subscription[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'subscriptions',
    where: {
      and: [
        {
          user: {
            equals: userId,
          },
        },
        {
          status: {
            in: ['active', 'pending'],
          },
        },
      ],
    },
    sort: '-createdAt',
    depth: 2,
  })
  return result.docs as Subscription[]
})

export const getTotalCredits = cache(async (userId: string): Promise<number> => {
  const payload = await getPayloadClient()
  // First try reading from user's wallet (new system)
  try {
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })
    const walletCredits = (user as any).predictionCreditsRemaining ?? 0
    if (walletCredits > 0) return walletCredits
  } catch {
    // Silently fall through
  }
  // Fallback: sum credits from old per-subscription system (for unmigrated users)
  try {
    const subscriptions = await getActiveSubscriptions(userId)
    const total = subscriptions.reduce((sum, sub) => sum + (sub.creditsRemaining || 0), 0)
    console.log(`[Credits] User ${userId}: fallback to subscription credits, total: ${total}`)
    return total
  } catch {
    return 0
  }
})

export async function decrementCredits(userId: string): Promise<boolean> {
  const payload = await getPayloadClient()
  // Try atomic decrement on user wallet first
  try {
    const UserModel = payload.db.collections['users']
    if (UserModel) {
      const result = await UserModel.updateOne(
        { _id: userId, predictionCreditsRemaining: { $gt: 0 } },
        { $inc: { predictionCreditsRemaining: -1 } },
      )
      if (result.modifiedCount > 0) return true
    }
  } catch {
    // Silently fall through to legacy method
  }
  // Fallback: decrement from old per-subscription system
  const subscriptions = await getActiveSubscriptions(userId)
  const sub = subscriptions.find((s) => (s.creditsRemaining || 0) > 0)
  if (!sub) return false
  await payload.update({
    collection: 'subscriptions',
    id: sub.id,
    data: { creditsRemaining: (sub.creditsRemaining || 1) - 1 },
  })
  return true
}

export const hasActiveOrPendingSubscription = cache(async (userId: string): Promise<boolean> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'subscriptions',
    where: {
      and: [
        {
          user: {
            equals: userId,
          },
        },
        {
          status: {
            in: ['pending', 'active'],
          },
        },
      ],
    },
    limit: 1,
  })
  return result.docs.length > 0
})
