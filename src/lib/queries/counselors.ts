import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { Counselor } from '@/payload-types'

export const getCounselors = cache(async ({
  specialization,
  status = 'active',
}: {
  specialization?: 'jee' | 'neet' | 'josaa' | 'general'
  status?: 'active' | 'inactive'
} = {}) => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: status } }
  if (specialization) where['specializations.specialization'] = { equals: specialization }

  return payload.find({
    collection: 'counselors',
    where,
    sort: 'order',
  })
})

export const getCounselorBySlug = cache(async (slug: string): Promise<Counselor | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'counselors',
    where: { slug: { equals: slug }, status: { equals: 'active' } },
    limit: 1,
  })
  return result.docs[0] || null
})
