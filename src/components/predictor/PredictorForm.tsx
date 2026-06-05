'use client'

import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { PredictorResults } from './PredictorResults'
import type { PredictResponse } from '@/lib/predictor/types'
import type { FilterOptions } from '@/lib/predictor/filters'

interface PredictorFormProps {
  filterOptions: FilterOptions
}

type FormStatus = 'idle' | 'loading' | 'error'

export function PredictorForm({ filterOptions }: PredictorFormProps) {
  const [rank, setRank] = useState('')
  const [category, setCategory] = useState('')
  const [quota, setQuota] = useState('')
  const [state, setState] = useState('')
  const [course, setCourse] = useState('')

  const [status, setStatus] = useState<FormStatus>('idle')
  const [error, setError] = useState('')
  const [response, setResponse] = useState<PredictResponse | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setStatus('loading')
      setError('')
      setResponse(null)

      const rankNum = parseInt(rank, 10)
      if (!rank || isNaN(rankNum) || rankNum < 1) {
        setError('Please enter a valid NEET All India Rank.')
        setStatus('idle')
        return
      }

      try {
        const body: Record<string, unknown> = { rank: rankNum }
        if (category) body.category = category
        if (quota) body.quota = quota
        if (state) body.state = state
        if (course) body.course = course

        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to get predictions.')
        }

        const data: PredictResponse = await res.json()
        setResponse(data)
        setStatus('idle')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
        setStatus('idle')
      }
    },
    [rank, category, quota, state, course],
  )

  const handleReset = useCallback(() => {
    setResponse(null)
    setError('')
    setStatus('idle')
  }, [])

  const selectClasses =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'

  if (!response) {
    return (
      <Card className="border-gray-200 bg-white shadow-lg">
        <CardHeader className="border-b border-gray-200 bg-[#062963]/5">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="predictor">🎯</span>
            <div>
              <CardTitle className="text-xl font-bold text-[#062963]">
                Enter Your NEET Details
              </CardTitle>
              <p className="mt-1 text-sm text-gray-600">
                Fill in the fields below to predict your college admission chances.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="rank" className="text-sm font-semibold text-[#062963]">
                NEET All India Rank (AIR) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rank"
                type="number"
                min="1"
                max="2000000"
                placeholder="e.g. 50000"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="mt-1.5 border-gray-300 focus:border-[#062963] focus:ring-[#062963]"
                required
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-semibold text-[#062963]">
                Your Category
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(selectClasses, 'mt-1.5 border-gray-300')}
                disabled={status === 'loading'}
              >
                <option value="">-- Select Category (Optional) --</option>
                {filterOptions.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="quota" className="text-sm font-semibold text-[#062963]">
                Quota
              </Label>
              <select
                id="quota"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className={cn(selectClasses, 'mt-1.5 border-gray-300')}
                disabled={status === 'loading'}
              >
                <option value="">-- Select Quota (Optional) --</option>
                {filterOptions.quotas.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="state" className="text-sm font-semibold text-[#062963]">
                State
              </Label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={cn(selectClasses, 'mt-1.5 border-gray-300')}
                disabled={status === 'loading'}
              >
                <option value="">-- Select State (Optional) --</option>
                {filterOptions.states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="course" className="text-sm font-semibold text-[#062963]">
                Course
              </Label>
              <select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className={cn(selectClasses, 'mt-1.5 border-gray-300')}
                disabled={status === 'loading'}
              >
                <option value="">-- Select Course (Optional) --</option>
                {filterOptions.courses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="h-11 w-full bg-[#FBAC1A] hover:bg-[#e09b18] text-[#062963] font-bold text-base"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Predicting...
                </span>
              ) : (
                'Predict My College'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return <PredictorResults response={response} onReset={handleReset} />
}
