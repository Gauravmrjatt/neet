import { cache } from 'react'
import { getPayloadClient } from '../payload'

export const getDistricts = cache(async ({
  limit = 100,
  page = 1,
  stateSlug,
  status = 'active',
  sort = 'order',
}: {
  limit?: number
  page?: number
  stateSlug?: string
  status?: 'active' | 'inactive'
  sort?: string
} = {}) => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { status: { equals: status } }
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
  return payload.find({
    collection: 'districts',
    where,
    limit,
    page,
    sort,
    depth: 2,
  })
})

export const getDistrictBySlug = cache(async (slug: string, stateSlug?: string) => {
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
  const result = await payload.find({
    collection: 'districts',
    where,
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
})

export const getDistrictContent = cache(async (
  districtId: string,
  type: string,
) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'district-content',
    where: {
      district: { equals: districtId },
      type: { equals: type },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] || null
})

export const getCollegesByDistrict = cache(async (districtId: string) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'colleges',
    where: {
      district: { equals: districtId },
      status: { equals: 'active' },
    },
    sort: 'order',
    depth: 1,
  })
})

export const getCutoffsByDistrict = cache(async (districtId: string) => {
  const payload = await getPayloadClient()
  const colleges = await payload.find({
    collection: 'colleges',
    where: { district: { equals: districtId }, status: { equals: 'active' } },
    limit: 100,
    depth: 0,
  })
  const collegeIds = colleges.docs.map(c => c.id)
  if (collegeIds.length === 0) return { docs: [], totalDocs: 0 }
  return payload.find({
    collection: 'cutoff-records',
    where: {
      college: { in: collegeIds },
    },
    limit: 500,
    sort: '-year',
    depth: 1,
  })
})

export const getNearbyDistricts = cache(async (districtId: string) => {
  const payload = await getPayloadClient()
  const district = await payload.findByID({
    collection: 'districts',
    id: districtId,
    depth: 2,
  })
  if (!district) return []
  return (district as any).nearbyDistricts || []
})

export const getDistrictsWithCollegeCount = cache(async (stateSlug: string) => {
  const payload = await getPayloadClient()
  const stateResult = await payload.find({
    collection: 'states',
    where: { slug: { equals: stateSlug } },
    limit: 1,
    depth: 0,
  })
  if (!stateResult.docs[0]) return []
  const stateId = stateResult.docs[0].id

  const districts = await payload.find({
    collection: 'districts',
    where: { state: { equals: stateId }, status: { equals: 'active' } },
    sort: 'order',
    limit: 200,
    depth: 1,
  })

  const withCounts = await Promise.all(
    districts.docs.map(async (d: any) => {
      const count = await payload.count({
        collection: 'colleges',
        where: { district: { equals: d.id }, status: { equals: 'active' } },
      })
      return { ...d, collegeCount: count.totalDocs }
    }),
  )

  return withCounts
})

export const getDistrictsForSite = cache(async () => {
  const payload = await getPayloadClient()
  const districts = await payload.find({
    collection: 'districts',
    where: { status: { equals: 'active' } },
    limit: 2000,
    depth: 1,
  })
  return districts.docs
})
