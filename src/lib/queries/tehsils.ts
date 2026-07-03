import { cache } from 'react'
import { getPayloadClient } from '../payload'

export const getTehsilsByDistrict = cache(async (districtId: string) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'tehsils',
    where: {
      district: { equals: districtId },
      status: { equals: 'active' },
    },
    sort: 'order',
    depth: 1,
  })
})

export const getTehsilBySlug = cache(async (slug: string, districtSlug?: string, stateSlug?: string) => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = {
    slug: { equals: slug },
    status: { equals: 'active' },
  }
  if (stateSlug) {
    const stateResult = await payload.find({
      collection: 'states',
      where: { slug: { equals: stateSlug } },
      limit: 1,
      depth: 0,
    })
    if (stateResult.docs[0]) {
      where.state = { equals: stateResult.docs[0].id }
    }
  }
  if (districtSlug) {
    const districtResult = await payload.find({
      collection: 'districts',
      where: { slug: { equals: districtSlug } },
      limit: 1,
      depth: 0,
    })
    if (districtResult.docs[0]) {
      where.district = { equals: districtResult.docs[0].id }
    }
  }
  const result = await payload.find({
    collection: 'tehsils',
    where,
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
})

export const getCollegesByTehsil = cache(async (tehsilId: string) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'colleges',
    where: {
      tehsil: { equals: tehsilId },
      status: { equals: 'active' },
    },
    sort: 'order',
    depth: 1,
  })
})

export const getTehsilsWithCollegeCount = cache(async (districtId: string) => {
  const payload = await getPayloadClient()
  const tehsils = await payload.find({
    collection: 'tehsils',
    where: { district: { equals: districtId }, status: { equals: 'active' } },
    sort: 'order',
    limit: 200,
    depth: 1,
  })
  const withCounts = await Promise.all(
    tehsils.docs.map(async (t: any) => {
      const count = await payload.count({
        collection: 'colleges',
        where: { tehsil: { equals: t.id }, status: { equals: 'active' } },
      })
      return { ...t, collegeCount: count.totalDocs }
    }),
  )
  return withCounts
})
