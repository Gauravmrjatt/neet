import mccData from '@/data/neet-allotment-data.json'
import ayushData from '@/data/ayush-cutoff-data.json'
import vetData from '@/data/vet-cutoff-data.json'
import type { AllotmentRecord, PredictionResult, PredictRequest, Chance } from './types'

const DATA_MAP: Record<string, AllotmentRecord[]> = {
  MBBS: mccData as AllotmentRecord[],
  BDS: mccData as AllotmentRecord[],
  Nursing: mccData as AllotmentRecord[],
  'B.Sc. Nursing': mccData as AllotmentRecord[],
  BAMS: ayushData as AllotmentRecord[],
  BHMS: ayushData as AllotmentRecord[],
  BUMS: ayushData as AllotmentRecord[],
  BSMS: ayushData as AllotmentRecord[],
  'BVSc & AH': vetData as AllotmentRecord[],
}

function getDataset(course?: string): AllotmentRecord[] {
  if (course && DATA_MAP[course]) return DATA_MAP[course]
  const all = [...(mccData as AllotmentRecord[]), ...(ayushData as AllotmentRecord[]), ...(vetData as AllotmentRecord[])]
  return all
}

const CHANCE_LIKELY_THRESHOLD = 1.07
const CHANCE_RISKY_THRESHOLD = 1.15

function classifyChance(rank: number, closingRank: number): { chance: Chance; probability: number } {
  if (rank <= closingRank) return { chance: 'Safe', probability: 85 }
  if (rank <= closingRank * CHANCE_LIKELY_THRESHOLD) return { chance: 'Likely', probability: 65 }
  return { chance: 'Risky', probability: 35 }
}

function predictRound(record: AllotmentRecord): string {
  if (record.round <= 0) return 'R1'
  return `R${record.round}`
}

export function predict(request: PredictRequest): {
  results: PredictionResult[]
  summary: { safe: number; likely: number; risky: number }
} {
  const { rank, category, quota, state, course } = request
  const dataset = getDataset(course)

  let filtered: AllotmentRecord[] = [...dataset]

  if (category) {
    const cat = category.toLowerCase()
    filtered = filtered.filter((r) => r.category.toLowerCase() === cat)
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

  filtered = filtered.filter((r) => rank <= r.closingRank * CHANCE_RISKY_THRESHOLD)

  const results: PredictionResult[] = filtered
    .map((r) => {
      const { chance, probability } = classifyChance(rank, r.closingRank)
      return {
        institute: r.institute,
        state: r.state,
        course: r.course,
        quota: r.quota,
        category: r.category,
        openingRank: r.openingRank,
        closingRank: r.closingRank,
        expectedRound: predictRound(r),
        collegeType: r.collegeType,
        fees: r.fees,
        year: r.year,
        chance,
        probability,
      }
    })
    .sort((a, b) => a.closingRank - b.closingRank)

  const safe = results.filter((r) => r.chance === 'Safe').length
  const likely = results.filter((r) => r.chance === 'Likely').length
  const risky = results.filter((r) => r.chance === 'Risky').length

  return { results, summary: { safe, likely, risky } }
}
