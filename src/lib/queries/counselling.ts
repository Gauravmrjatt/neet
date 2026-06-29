import { cache } from 'react'
import { getPayloadClient } from '../payload'

async function resolveStateId(slug: string): Promise<string | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'states',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return result.docs[0]?.id || null
}

export const getCounsellingPosts = cache(async ({
  limit = 12,
  page = 1,
  category,
  state,
  status = 'published',
  sort = '-publishedAt',
}: {
  limit?: number
  page?: number
  category?: string
  state?: string
  status?: 'draft' | 'published'
  sort?: string
} = {}) => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: status } }
  if (category) where.category = { equals: category }
  if (state) {
    const stateId = await resolveStateId(state)
    if (stateId) where.state = { equals: stateId }
  }

  return payload.find({
    collection: 'counselling',
    where,
    limit,
    page,
    sort,
  })
})

export const getCounsellingPostBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'counselling',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  return result.docs[0] || null
})

export const getCounsellingBySlug = getCounsellingPostBySlug

export const getRecentCounsellingPosts = cache(async (limit = 5) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'counselling',
    where: { status: { equals: 'published' } },
    limit,
    sort: '-publishedAt',
  })
})

export const getCounsellingByCategory = cache(async (category: string) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'counselling',
    where: { category: { equals: category }, status: { equals: 'published' } },
    sort: '-publishedAt',
  })
})

export const getCounsellingByState = cache(async (stateSlug: string) => {
  const payload = await getPayloadClient()
  const stateId = await resolveStateId(stateSlug)
  if (!stateId) return { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
  return payload.find({
    collection: 'counselling',
    where: { state: { equals: stateId }, status: { equals: 'published' } },
    sort: '-publishedAt',
  })
})
