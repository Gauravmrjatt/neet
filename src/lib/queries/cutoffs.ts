import { cache } from 'react'
import { getPayloadClient } from '../payload'

export interface CutoffRecordData {
  id: string
  college: string
  course: string
  year: number
  round: number
  quota: string
  category: string
  openingRank: number
  closingRank: number
  collegeType?: string
  fees?: number
}

export const getCutoffRecords = cache(async ({
  collegeId,
  year,
  course,
  limit = 500,
}: {
  collegeId: string
  year?: number
  course?: string
  limit?: number
}): Promise<CutoffRecordData[]> => {
  const payload = await getPayloadClient()
  const where: Record<string, any> = { college: { equals: collegeId } }
  if (year) where.year = { equals: year }
  if (course) where.course = { equals: course }

  const result = await payload.find({
    collection: 'cutoff-records',
    where,
    limit,
    sort: '-year',
    depth: 0,
  })

  return result.docs.map((d: any) => ({
    id: d.id,
    college: typeof d.college === 'object' ? d.college.id : d.college,
    course: d.course,
    year: d.year,
    round: d.round,
    quota: d.quota,
    category: d.category,
    openingRank: d.openingRank,
    closingRank: d.closingRank,
    collegeType: d.collegeType,
    fees: d.fees,
  }))
})

export const getBestCutoffForCollege = cache(async (
  collegeId: string,
  course = 'MBBS',
): Promise<{ year: number; round: number; category: string; closingRank: number } | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'cutoff-records',
    where: {
      college: { equals: collegeId },
      course: { equals: course },
      category: { equals: 'General' },
      quota: { equals: 'All India' },
      round: { equals: 1 },
    },
    limit: 1,
    sort: '-year',
    depth: 0,
  })
  if (!result.docs[0]) return null
  const d = result.docs[0] as any
  return {
    year: d.year,
    round: d.round,
    category: d.category,
    closingRank: d.closingRank,
  }
})

export const getCutoffRecordsForColleges = cache(async (
  collegeIds: string[],
): Promise<Map<string, { year: number; closingRank: number }>> => {
  if (collegeIds.length === 0) return new Map()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'cutoff-records',
    where: {
      college: { in: collegeIds },
      course: { equals: 'MBBS' },
      category: { equals: 'General' },
      quota: { equals: 'All India' },
      round: { equals: 1 },
    },
    limit: collegeIds.length * 2,
    sort: '-year',
    depth: 0,
  })

  const map = new Map<string, { year: number; closingRank: number }>()
  const seen = new Set<string>()
  for (const d of result.docs as any[]) {
    const cid = typeof d.college === 'object' ? d.college.id : d.college
    if (!seen.has(cid)) {
      seen.add(cid)
      map.set(cid, { year: d.year, closingRank: d.closingRank })
    }
  }
  return map
})
