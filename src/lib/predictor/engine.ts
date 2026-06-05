import allotmentData from '@/data/neet-allotment-data.json'
import type { AllotmentRecord, PredictionResult, PredictRequest, Chance } from './types'

const CHANCE_HIGH: Chance = 'High'
const CHANCE_GOOD: Chance = 'Good'
const CHANCE_LOW: Chance = 'Low'
const CHANCE_THRESHOLD = 1.07

function classifyChance(rank: number, closingRank: number): Chance {
  if (rank <= closingRank) return CHANCE_HIGH
  if (rank <= closingRank * CHANCE_THRESHOLD) return CHANCE_GOOD
  return CHANCE_LOW
}

export function predict(request: PredictRequest): {
  results: PredictionResult[]
  summary: { high: number; good: number; low: number }
} {
  const { rank, category, quota, state, course, phase } = request

  let filtered: AllotmentRecord[] = [...(allotmentData as AllotmentRecord[])]

  if (category) {
    const cat = category.toLowerCase()
    filtered = filtered.filter((r) => r.candidateCategory.toLowerCase() === cat)
  }
  if (quota) {
    const q = quota.toLowerCase()
    filtered = filtered.filter((r) => r.quota.toLowerCase() === q)
  }
  if (state) {
    const s = state.toLowerCase()
    filtered = filtered.filter((r) => r.state.toLowerCase() === s)
  }
  if (course) {
    const c = course.toLowerCase()
    filtered = filtered.filter((r) => r.course.toLowerCase() === c)
  }
  if (phase !== undefined && phase !== null) {
    filtered = filtered.filter((r) => r.phase === phase)
  }

  const results: PredictionResult[] = filtered
    .map((r) => ({
      institute: r.institute,
      state: r.state,
      course: r.course,
      quota: r.quota,
      candidateCategory: r.candidateCategory,
      allottedCategory: r.allottedCategory,
      closingRank: r.rank,
      phase: r.phase,
      chance: classifyChance(rank, r.rank),
    }))
    .sort((a, b) => b.closingRank - a.closingRank)

  const high = results.filter((r) => r.chance === CHANCE_HIGH).length
  const good = results.filter((r) => r.chance === CHANCE_GOOD).length
  const low = results.filter((r) => r.chance === CHANCE_LOW).length

  return { results, summary: { high, good, low } }
}
