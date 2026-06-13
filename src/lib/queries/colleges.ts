import { cache } from 'react'
import { getPayloadClient } from '../payload'

export const getColleges = cache(async ({
  limit = 20,
  page = 1,
  type,
  stateSlug,
  sort = 'order',
  status = 'active',
}: {
  limit?: number
  page?: number
  type?: string
  stateSlug?: string
  sort?: string
  status?: 'active' | 'inactive'
} = {}) => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: status } }
  if (type) where.type = { equals: type }
  if (stateSlug) where.state = { equals: stateSlug }

  return payload.find({
    collection: 'colleges',
    where,
    limit,
    page,
    sort,
  })
})

export const getCollegeBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'colleges',
    where: { slug: { equals: slug }, status: { equals: 'active' } },
    limit: 1,
  })
  return result.docs[0] || null
})

export const getCollegesByState = cache(async (stateSlug: string) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'colleges',
    where: { state: { equals: stateSlug }, status: { equals: 'active' } },
    sort: 'order',
  })
})

export const getCollegesByType = cache(async (type: string) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'colleges',
    where: { type: { equals: type }, status: { equals: 'active' } },
    sort: 'order',
  })
})

export const getTopColleges = cache(async (limit = 10) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'colleges',
    where: { status: { equals: 'active' } },
    limit,
    sort: 'ranking',
  })
})
