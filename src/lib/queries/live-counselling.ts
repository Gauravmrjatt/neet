import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { LiveCounselling } from '@/payload-types'

export const getLiveCounsellingSessions = cache(async ({
  status,
  limit = 10,
}: {
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
  limit?: number
} = {}) => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = {}
  if (status) where.status = { equals: status }

  return payload.find({
    collection: 'live-counselling',
    where,
    limit,
    sort: '-scheduledAt',
  })
})

export const getUpcomingSessions = cache(async (limit = 5) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'live-counselling',
    where: {
      status: { in: ['scheduled', 'live'] },
      scheduledAt: { greater_than: new Date().toISOString() },
    },
    limit,
    sort: 'scheduledAt',
  })
})

export const getSessionById = cache(async (id: string): Promise<LiveCounselling | null> => {
  const payload = await getPayloadClient()
  try {
    return await payload.findByID({
      collection: 'live-counselling',
      id,
    })
  } catch {
    return null
  }
})

export const getLiveCounsellingSession = getSessionById
