import { getPayloadClient } from '../payload'
import type { Blog } from '@/payload-types'

export async function getBlogs({
  limit = 10,
  page = 1,
  category,
  status = 'published',
}: {
  limit?: number
  page?: number
  category?: string
  status?: 'draft' | 'published'
} = {}) {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: status } }
  if (category) where.categories = { contains: category }

  return payload.find({
    collection: 'blogs',
    where,
    limit,
    page,
    sort: '-publishedAt',
  })
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  return result.docs[0] || null
}

export async function getRecentBlogs(limit = 5) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'blogs',
    where: { status: { equals: 'published' } },
    limit,
    sort: '-publishedAt',
  })
}
