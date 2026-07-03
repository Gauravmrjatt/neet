import mccData from '@/data/neet-allotment-data.json'
import bdsData from '@/data/bds-cutoff-data.json'
import ayushData from '@/data/ayush-cutoff-data.json'
import vetData from '@/data/vet-cutoff-data.json'
import type { AllotmentRecord } from './types'

export interface FilterOptions {
  categories: string[]
  quotas: string[]
  states: string[]
  courses: string[]
  collegeTypes: string[]
}

export function getFilterOptions(): FilterOptions {
  const all = [
    ...(mccData as AllotmentRecord[]),
    ...(bdsData as AllotmentRecord[]),
    ...(ayushData as AllotmentRecord[]),
    ...(vetData as AllotmentRecord[]),
  ]

  const categorySet = new Set<string>()
  const quotaSet = new Set<string>()
  const stateSet = new Set<string>()
  const courseSet = new Set<string>()
  const collegeTypeSet = new Set<string>()

  for (const rec of all) {
    if (rec.category) categorySet.add(rec.category)
    if (rec.quota) quotaSet.add(rec.quota)
    if (rec.state) stateSet.add(rec.state)
    if (rec.course) courseSet.add(rec.course)
    if (rec.collegeType) collegeTypeSet.add(rec.collegeType)
  }

  const sortQuotas = (a: string, b: string) => {
    if (a === 'All India' || a === 'AIQ') return -1
    if (b === 'All India' || b === 'AIQ') return 1
    return a.localeCompare(b)
  }

  return {
    categories: Array.from(categorySet).sort(),
    quotas: Array.from(quotaSet).sort(sortQuotas),
    states: Array.from(stateSet).sort(),
    courses: Array.from(courseSet).sort(),
    collegeTypes: Array.from(collegeTypeSet).sort(),
  }
}
