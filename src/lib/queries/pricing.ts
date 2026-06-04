import { getPayloadClient } from '../payload'
import type { PricingCard } from '@/payload-types'

export async function getPricingCards(): Promise<PricingCard[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pricing-cards',
    sort: 'order',
    limit: 100,
  })
  return result.docs
}

export async function getPricingCardById(id: string): Promise<PricingCard | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.findByID({
      collection: 'pricing-cards',
      id,
    })
    return result as PricingCard
  } catch {
    return null
  }
}
