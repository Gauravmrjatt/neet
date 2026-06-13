import { cache } from 'react'
import { getPayloadClient } from '../payload'

export const getStates = cache(async ({ status = 'active' }: { status?: 'active' | 'inactive' } = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'states',
    where: { status: { equals: status } },
    sort: 'order',
  })
})

export const getStateBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'states',
    where: { slug: { equals: slug }, status: { equals: 'active' } },
    limit: 1,
  })
  return result.docs[0] || null
})

export const getStatesWithCounselling = cache(async () => {
  const payload = await getPayloadClient()
  const states = await payload.find({
    collection: 'states',
    where: { status: { equals: 'active' } },
    sort: 'order',
  })

  const statesWithCounts = await Promise.all(
    states.docs.map(async (state) => {
      const count = await payload.count({
        collection: 'counselling',
        where: { state: { equals: state.id }, status: { equals: 'published' } },
      })
      return { ...state, counsellingCount: count.totalDocs }
    }),
  )

  return statesWithCounts
})
