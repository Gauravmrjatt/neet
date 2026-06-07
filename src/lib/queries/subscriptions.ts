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

export const getActiveSubscription = cache(async (userId: string): Promise<Subscription | null> => {
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
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as Subscription) || null
})

export async function markPredictorUsed(userId: string): Promise<void> {
  const payload = await getPayloadClient()
  const subscription = await getActiveSubscription(userId)
  if (subscription && !subscription.predictorUsed) {
    await payload.update({
      collection: 'subscriptions',
      id: subscription.id,
      data: { predictorUsed: true },
    })
  }
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
