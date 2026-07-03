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
  score: number
}

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
  score: number
  chance?: 'Safe' | 'Likely' | 'Risky'
  probability?: number
}

export interface PredictRequest {
  rank?: number
  score?: number
  category: string
  quota?: string
  state?: string
  course?: string
}

export interface PredictResponse {
  premium: boolean
  creditsRemaining: number
  total: number
  results: PredictionResult[]
}
