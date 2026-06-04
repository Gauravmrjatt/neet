import { getPayloadClient } from '../payload'
import type { Subscription } from '@/payload-types'

/**
 * Get the most recent subscription for a user, regardless of status.
 * Used by /my-plan to determine what state the user is in.
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
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
    depth: 2, // Populate user, plan, assignedCounselor, assignedPage
  })
  return (result.docs[0] as Subscription) || null
}

/**
 * Get the user's active subscription (status = 'active') with full relations populated.
 * Used by /my-plan to render assigned content.
 */
export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
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
    depth: 2, // Populate user, plan, assignedCounselor, assignedPage
  })
  return (result.docs[0] as Subscription) || null
}

/**
 * Check if user has any pending or active subscription.
 * Used by checkout to prevent duplicate purchases.
 */
export async function hasActiveOrPendingSubscription(userId: string): Promise<boolean> {
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
}
