'use client'

import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
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
    'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'

  if (!response) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center gap-2 border-b border-border bg-primary-navy/5 px-5 py-3">
          <span className="text-xl" role="img" aria-label="predictor">🎯</span>
          <div>
            <h2 className="text-base font-bold text-primary-navy">
              Enter Your NEET Details
            </h2>
            <p className="text-xs text-muted-foreground">
              Fill in the fields below to predict your college admission chances.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <div>
              <Label htmlFor="rank" className="text-xs font-semibold text-primary-navy">
                Rank (AIR) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rank"
                type="number"
                min="1"
                max="2000000"
                placeholder="e.g. 50000"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="mt-1 h-10 text-sm"
                required
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-xs font-semibold text-primary-navy">
                Category
              </Label>
              <select
                id="category"
                aria-label="Your category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(selectClasses, 'mt-1')}
                disabled={status === 'loading'}
              >
                <option value="">All Categories</option>
                {filterOptions.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="quota" className="text-xs font-semibold text-primary-navy">
                Quota
              </Label>
              <select
                id="quota"
                aria-label="Quota"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className={cn(selectClasses, 'mt-1')}
                disabled={status === 'loading'}
              >
                <option value="">All Quotas</option>
                {filterOptions.quotas.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="state" className="text-xs font-semibold text-primary-navy">
                State
              </Label>
              <select
                id="state"
                aria-label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={cn(selectClasses, 'mt-1')}
                disabled={status === 'loading'}
              >
                <option value="">All States</option>
                {filterOptions.states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="course" className="text-xs font-semibold text-primary-navy">
                Course
              </Label>
              <select
                id="course"
                aria-label="Course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className={cn(selectClasses, 'mt-1')}
                disabled={status === 'loading'}
              >
                <option value="">All Courses</option>
                {filterOptions.courses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}

          <div className="mt-4">
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="h-10 w-full bg-button-gold hover:bg-button-gold-hover text-primary-navy font-bold text-sm sm:w-auto sm:px-8"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Predicting...
                </span>
              ) : (
                'Predict My College'
              )}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return <PredictorResults response={response} onReset={handleReset} />
}
