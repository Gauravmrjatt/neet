import { getPayloadClient } from '../payload'
import type { Counselor } from '@/payload-types'

export async function getCounselors({
  specialization,
  status = 'active',
}: {
  specialization?: 'jee' | 'neet' | 'josaa' | 'general'
  status?: 'active' | 'inactive'
} = {}) {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: status } }
  if (specialization) where.specializations = { contains: specialization }

  return payload.find({
    collection: 'counselors',
    where,
    sort: 'order',
  })
}

export async function getCounselorBySlug(slug: string): Promise<Counselor | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'counselors',
    where: { slug: { equals: slug }, status: { equals: 'active' } },
    limit: 1,
  })
  return result.docs[0] || null
}
