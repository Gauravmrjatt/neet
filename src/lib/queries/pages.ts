import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { Page } from '@/payload-types'

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  return result.docs[0] || null
})
