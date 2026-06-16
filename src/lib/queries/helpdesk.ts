import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { Helpdesk } from '@/payload-types'

export const getHelpdeskItems = cache(async ({
  category,
  status = 'active',
  search,
  page = 1,
  limit = 20,
}: {
  category?: 'admission' | 'exam' | 'counselling' | 'pricing' | 'technical' | 'other'
  status?: 'active' | 'inactive'
  search?: string
  page?: number
  limit?: number
} = {}) => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: status } }
  if (category) where.category = { equals: category }
  if (search) where.question = { contains: search }

  return payload.find({
    collection: 'helpdesk',
    where,
    sort: 'order',
    page,
    limit,
  })
})

export const getHelpdeskCategories = cache(async (): Promise<string[]> => {
  const payload = await getPayloadClient()
  const items = await payload.find({
    collection: 'helpdesk',
    where: { status: { equals: 'active' } },
    sort: 'order',
    limit: 100,
  })

  const categories = [
    ...new Set(
      items.docs
        .map((item: Helpdesk) => item.category)
        .filter((c): c is NonNullable<typeof c> => c != null)
    ),
  ]
  return categories
})
