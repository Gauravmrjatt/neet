export interface AllotmentRecord {
  institute: string
  state: string
  course: string
  quota: string
  candidateCategory: string
  allottedCategory: string
  rank: number
  phase: number
}

export type Chance = 'High' | 'Good' | 'Low'

export interface PredictionResult {
  institute: string
  state: string
  course: string
  quota: string
  candidateCategory: string
  allottedCategory: string
  closingRank: number
  phase: number
  chance: Chance
}

export interface PredictRequest {
  rank: number
  category?: string
  quota?: string
  state?: string
  course?: string
  phase?: number
}

export interface PredictResponse {
  premium: boolean
  total: number
  summary: {
    high: number
    good: number
    low: number
  }
  results: PredictionResult[]
}
