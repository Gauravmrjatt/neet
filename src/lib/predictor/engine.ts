import mccData from '@/data/neet-allotment-data.json'
import bdsData from '@/data/bds-cutoff-data.json'
import ayushData from '@/data/ayush-cutoff-data.json'
import vetData from '@/data/vet-cutoff-data.json'
import type { AllotmentRecord, PredictionResult, PredictRequest } from './types'

const DATA_MAP: Record<string, AllotmentRecord[]> = {
  MBBS: mccData as AllotmentRecord[],
  BDS: bdsData as AllotmentRecord[],
  Nursing: bdsData as AllotmentRecord[],
  'B.Sc. Nursing': bdsData as AllotmentRecord[],
  BAMS: ayushData as AllotmentRecord[],
  BHMS: ayushData as AllotmentRecord[],
  BUMS: ayushData as AllotmentRecord[],
  BSMS: ayushData as AllotmentRecord[],
  'BVSc & AH': vetData as AllotmentRecord[],
}

function getDataset(course?: string): AllotmentRecord[] {
  if (course && DATA_MAP[course]) return DATA_MAP[course]
  return [
    ...(mccData as AllotmentRecord[]),
    ...(bdsData as AllotmentRecord[]),
    ...(ayushData as AllotmentRecord[]),
    ...(vetData as AllotmentRecord[]),
  ]
}

export function predict(request: PredictRequest): {
  results: PredictionResult[]
  summary: { safe: number; likely: number; risky: number }
} {
  const { rank, score, category, quota, state, course } = request
  const dataset = getDataset(course)

  let filtered: AllotmentRecord[] = [...dataset]

  const cat = category?.toLowerCase().trim() || ''
  if (cat) {
    filtered = filtered.filter(
      (r) => r.category?.toLowerCase().trim() === cat,
    )
  }

  if (quota) {
    const q = quota.toLowerCase().trim()
    filtered = filtered.filter((r) => r.quota?.toLowerCase().trim() === q)
  }

  if (state) {
    const s = state.toLowerCase().trim()
    filtered = filtered.filter((r) => r.state?.toLowerCase().trim() === s)
  }

  if (course) {
    const c = course.toLowerCase().trim()
    filtered = filtered.filter((r) => r.course?.toLowerCase().trim() === c)
  }

  if (score && score > 0) {
    filtered = filtered.filter((r) => r.score > 0 && r.score >= score * 0.7)
    filtered = filtered.filter((r) => r.score <= Math.max(720, score * 1.3))
  }

  filtered = filtered.filter((r) => r.closingRank > 0)

  if (rank && rank > 0) {
    filtered = filtered.filter((r) => r.closingRank >= rank)
  }

  const results: PredictionResult[] = filtered
    .map((r) => ({
      institute: r.institute,
      state: r.state,
      course: r.course,
      quota: r.quota,
      category: r.category,
      openingRank: r.openingRank,
      closingRank: r.closingRank,
      expectedRound: r.round > 0 ? `R${r.round}` : 'R1',
      collegeType: r.collegeType,
      fees: r.fees,
      year: r.year,
      score: r.score,
    }))
    .sort((a, b) => a.closingRank - b.closingRank)

  const safe = results.filter((r) => r.closingRank >= (rank || r.closingRank)).length
  const likely = results.filter(
    (r) => r.closingRank > 0 && r.closingRank >= (rank || r.closingRank) * 0.93,
  ).length
  const risky = results.length - safe - likely

  return { results, summary: { safe, likely, risky } }
}
