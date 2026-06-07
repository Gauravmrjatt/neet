import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { PricingCard } from '@/payload-types'

export const getPricingCards = cache(async (): Promise<PricingCard[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pricing-cards',
    sort: 'order',
    limit: 100,
  })
  return result.docs
})

export const getPricingCardById = cache(async (id: string): Promise<PricingCard | null> => {
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
})
