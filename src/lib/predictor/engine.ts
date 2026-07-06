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

const GROUP_DEFAULT: Record<string, AllotmentRecord[]> = {
  mcc: mccData as AllotmentRecord[],
  ayush: ayushData as AllotmentRecord[],
  vet: vetData as AllotmentRecord[],
}

const CATEGORY_ALIAS: Record<string, string> = {
  'general': 'GN',
  'gn': 'GN',
  'gen': 'GN',
  'general pwd': 'GN-PH',
  'gn-ph': 'GN-PH',
  'general-ph': 'GN-PH',
  'obc-ncl': 'OBC',
  'obc': 'OBC',
  'obc-ncl pwd': 'OBC-PH',
  'obc-ph': 'OBC-PH',
  'ews': 'EWS',
  'ews pwd': 'EWS-PH',
  'ews-ph': 'EWS-PH',
  'scheduled caste': 'SC',
  'sc': 'SC',
  'scheduled caste pwd': 'SC-PH',
  'sc-ph': 'SC-PH',
  'scheduled tribe': 'ST',
  'st': 'ST',
  'scheduled tribe pwd': 'ST-PH',
  'st-ph': 'ST-PH',
  'op': 'OP',
}

const QUOTA_ALIAS: Record<string, string> = {
  'all india': 'AIQ',
  'aiq': 'AIQ',
  'nri': 'NRI',
  'amu quota': 'AMU',
  'amu': 'AMU',
  'amq': 'AMQ',
}

function normalizeValue(val: string, aliasMap: Record<string, string>): string {
  const lower = val.toLowerCase().trim()
  return aliasMap[lower] || lower
}

function getDataset(course?: string, courseGroup?: string): AllotmentRecord[] {
  if (course && DATA_MAP[course]) return DATA_MAP[course]
  if (courseGroup && GROUP_DEFAULT[courseGroup]) return GROUP_DEFAULT[courseGroup]
  return mccData as AllotmentRecord[]
}

export function predict(request: PredictRequest): {
  results: PredictionResult[]
  summary: { safe: number; likely: number; risky: number }
} {
  const { rank, score, category, quota, state, course, courseGroup } = request
  const dataset = getDataset(course, courseGroup)

  let filtered: AllotmentRecord[] = [...dataset]

  const cat = category?.toLowerCase().trim() || ''
  if (cat) {
    const catCanonical = normalizeValue(cat, CATEGORY_ALIAS)
    filtered = filtered.filter((r) => {
      const recCat = r.category?.toLowerCase().trim() || ''
      return normalizeValue(recCat, CATEGORY_ALIAS) === catCanonical
    })
  }

  if (quota) {
    const q = quota.toLowerCase().trim()
    const qCanonical = normalizeValue(q, QUOTA_ALIAS)
    filtered = filtered.filter((r) => {
      const recQ = r.quota?.toLowerCase().trim() || ''
      return normalizeValue(recQ, QUOTA_ALIAS) === qCanonical
    })
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

  // Deduplicate by (institute, course, quota) — prefer most recent year, then highest closingRank
  const bestMap = new Map<string, AllotmentRecord>()
  for (const r of filtered) {
    const key = `${r.institute}||${r.course}||${r.quota}`
    const existing = bestMap.get(key)
    if (!existing) {
      bestMap.set(key, r)
    } else if (r.year > existing.year || (r.year === existing.year && r.closingRank > existing.closingRank)) {
      bestMap.set(key, r)
    }
  }
  filtered = Array.from(bestMap.values())

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
