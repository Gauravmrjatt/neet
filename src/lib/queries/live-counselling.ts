import { getPayloadClient } from '../payload'
import type { LiveCounselling } from '@/payload-types'

export async function getLiveCounsellingSessions({
  status,
  limit = 10,
}: {
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
  limit?: number
} = {}) {
  const payload = await getPayloadClient()
  const where: Record<string, any> = {}
  if (status) where.status = { equals: status }

  return payload.find({
    collection: 'live-counselling',
    where,
    limit,
    sort: '-scheduledAt',
  })
}

export async function getUpcomingSessions(limit = 5) {
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
}

export async function getSessionById(id: string): Promise<LiveCounselling | null> {
  const payload = await getPayloadClient()
  try {
    return await payload.findByID({
      collection: 'live-counselling',
      id,
    })
  } catch {
    return null
  }
}
