import { getPayloadClient } from '../payload'
import type { Helpdesk } from '@/payload-types'

export async function getHelpdeskItems({
  category,
  status = 'active',
}: {
  category?: 'admission' | 'exam' | 'counselling' | 'technical' | 'other'
  status?: 'active' | 'inactive'
} = {}) {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: status } }
  if (category) where.category = { equals: category }

  return payload.find({
    collection: 'helpdesk',
    where,
    sort: 'order',
  })
}

export async function getHelpdeskCategories(): Promise<string[]> {
  const payload = await getPayloadClient()
  const items = await payload.find({
    collection: 'helpdesk',
    where: { status: { equals: 'active' } },
    sort: 'order',
  })

  const categories = [
    ...new Set(
      items.docs
        .map((item: Helpdesk) => item.category)
        .filter((c): c is NonNullable<typeof c> => c != null)
    ),
  ]
  return categories
}
