import { cache } from 'react'
import { getPayloadClient } from '../payload'

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
  if (state) where['state.slug'] = { equals: state }

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
  return payload.find({
    collection: 'counselling',
    where: { 'state.slug': { equals: stateSlug }, status: { equals: 'published' } },
    sort: '-publishedAt',
  })
})
