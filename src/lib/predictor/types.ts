export interface AllotmentRecord {
  institute: string
  state: string
  course: string
  quota: string
  category: string
  openingRank: number
  closingRank: number
  round: number
  year: number
  collegeType: string
  fees: number
}

export type Chance = 'Safe' | 'Likely' | 'Risky'

export interface PredictionResult {
  institute: string
  state: string
  course: string
  quota: string
  category: string
  openingRank: number
  closingRank: number
  expectedRound: string
  collegeType: string
  fees: number
  year: number
  chance: Chance
  probability: number
}

export interface PredictRequest {
  rank: number
  category: string
  quota?: string
  state?: string
  course?: string
}

export interface PredictResponse {
  premium: boolean
  creditsRemaining: number
  total: number
  summary: {
    safe: number
    likely: number
    risky: number
  }
  results: PredictionResult[]
}
