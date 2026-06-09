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
            equals: 'active',
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
  const subscriptions = await getActiveSubscriptions(userId)
  return subscriptions.reduce((sum, sub) => sum + (sub.creditsRemaining || 0), 0)
})

export async function decrementCredits(userId: string): Promise<boolean> {
  const payload = await getPayloadClient()
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
