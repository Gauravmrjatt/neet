import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { Counselor, Specialization } from '@/payload-types'

export const getCounselors = cache(async ({
  specialization,
  status = 'active',
}: {
  specialization?: string
  status?: 'active' | 'inactive'
} = {}) => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: status } }
  if (specialization) where['specializations.specialization.slug'] = { equals: specialization }

  return payload.find({
    collection: 'counselors',
    where,
    sort: 'order',
    depth: 1,
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

export const getSpecializations = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'specializations',
    sort: 'name',
    limit: 100,
  })
  return result.docs as Specialization[]
})
