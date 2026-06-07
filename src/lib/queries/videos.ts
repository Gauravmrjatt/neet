import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { Video } from '@/payload-types'

export const getVideos = cache(async ({
  limit = 12,
  page = 1,
  category,
}: {
  limit?: number
  page?: number
  category?: 'lecture' | 'tips' | 'interview' | 'other'
} = {}) => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: 'published' } }
  if (category) where.category = { equals: category }

  return payload.find({
    collection: 'videos',
    where,
    limit,
    page,
    sort: '-publishedAt',
  })
})

export const getVideoBySlug = cache(async (slug: string): Promise<Video | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'videos',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  return result.docs[0] || null
})
