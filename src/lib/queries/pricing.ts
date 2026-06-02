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
