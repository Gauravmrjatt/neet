import allotmentData from '@/data/neet-allotment-data.json'
import type { AllotmentRecord } from './types'

export interface FilterOptions {
  categories: string[]
  quotas: string[]
  states: string[]
  courses: string[]
  phases: number[]
}

export function getFilterOptions(): FilterOptions {
  const data = allotmentData as AllotmentRecord[]

  const categorySet = new Set<string>()
  const quotaSet = new Set<string>()
  const stateSet = new Set<string>()
  const courseSet = new Set<string>()
  const phaseSet = new Set<number>()

  for (const rec of data) {
    categorySet.add(rec.candidateCategory)
    quotaSet.add(rec.quota)
    stateSet.add(rec.state)
    courseSet.add(rec.course)
    phaseSet.add(rec.phase)
  }

  return {
    categories: Array.from(categorySet).sort(),
    quotas: Array.from(quotaSet).sort(),
    states: Array.from(stateSet).sort(),
    courses: Array.from(courseSet).sort(),
    phases: Array.from(phaseSet).sort((a, b) => a - b),
  }
}
