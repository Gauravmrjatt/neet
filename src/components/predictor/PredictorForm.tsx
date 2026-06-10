'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Loader2, AlertTriangle, Stethoscope, Leaf, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { PredictResponse } from '@/lib/predictor/types'
import type { FilterOptions } from '@/lib/predictor/filters'
import dynamic from 'next/dynamic'

const PredictorResults = dynamic(() => import('./PredictorResults').then((m) => ({ default: m.PredictorResults })), {
  ssr: false,
})
import { PredictorLeaveWarning, useLeaveWarning } from './PredictorLeaveWarning'

interface PredictorFormProps {
  filterOptions: FilterOptions
}

type FormStatus = 'idle' | 'loading' | 'error'

type CourseGroup = 'mcc' | 'ayush' | 'vet'

const COURSE_GROUPS: { id: CourseGroup; label: string; icon: React.ElementType; courses: string[] }[] = [
  { id: 'mcc', label: 'MBBS & BDS', icon: Stethoscope, courses: ['MBBS', 'BDS', 'B.Sc. Nursing'] },
  { id: 'ayush', label: 'AYUSH', icon: Leaf, courses: ['BAMS', 'BUMS', 'BSMS'] },
  { id: 'vet', label: 'Veterinary', icon: PawPrint, courses: ['BVSc & AH'] },
]

export function PredictorForm({ filterOptions }: PredictorFormProps) {
  const [courseGroup, setCourseGroup] = useState<CourseGroup>('mcc')

  const COURSE_CATEGORIES: Record<CourseGroup, string[]> = {
    mcc: ['General', 'General PwD', 'OBC-NCL', 'OBC-NCL PwD', 'EWS', 'EWS PwD', 'Scheduled Caste', 'Scheduled Caste PwD', 'Scheduled Tribe', 'Scheduled Tribe PwD', 'OP'],
    ayush: ['GEN', 'OBC', 'EWS', 'SC', 'ST'],
    vet: ['GEN', 'OBC', 'EWS', 'SC', 'ST'],
  }

  const COURSE_QUOTAS: Record<CourseGroup, string[]> = {
    mcc: ['All India', 'AIQ', 'Deemed/Paid Seats', 'NRI', 'AMU Quota', 'Delhi University', 'ESI', 'IP University', 'Open Seat'],
    ayush: ['AIQ', 'Central', 'Management', 'Minority'],
    vet: ['AIQ'],
  }
  const [rank, setRank] = useState('')
  const [category, setCategory] = useState('')
  const [quota, setQuota] = useState('')
  const [state, setState] = useState('')
  const [course, setCourse] = useState('')

  const [status, setStatus] = useState<FormStatus>('idle')
  const [error, setError] = useState('')
  const [response, setResponse] = useState<PredictResponse | null>(null)
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
  const [showLeaveWarning, setShowLeaveWarning] = useState(false)

  const hasResults = response !== null
  useLeaveWarning(hasResults)

  useEffect(() => {
    if (!hasResults) return

    window.history.pushState(null, '', window.location.href)

    const handlePopState = () => {
      setShowLeaveWarning(true)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [hasResults])

  useEffect(() => {
    setCategory('')
    setQuota('')
    setCourse('')
  }, [courseGroup])

  const availableCourses = useMemo(
    () => COURSE_GROUPS.find((g) => g.id === courseGroup)?.courses ?? [],
    [courseGroup],
  )

  const availableCategories = useMemo(
    () => COURSE_CATEGORIES[courseGroup],
    [courseGroup],
  )

  const availableQuotas = useMemo(
    () => COURSE_QUOTAS[courseGroup],
    [courseGroup],
  )

  const availableStates = useMemo(() => {
    if (courseGroup === 'ayush' || courseGroup === 'vet') return []
    return filterOptions.states
  }, [courseGroup, filterOptions.states])

  const handleConfirmLeave = useCallback(() => {
    setShowLeaveWarning(false)
    setResponse(null)
  }, [])

  const handleCancelLeave = useCallback(() => {
    setShowLeaveWarning(false)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setStatus('loading')
      setError('')
      setResponse(null)
      setCreditsRemaining(null)

      const rankNum = parseInt(rank, 10)
      if (!rank || isNaN(rankNum) || rankNum < 1) {
        setError('Please enter a valid NEET All India Rank.')
        setStatus('idle')
        return
      }

      if (!category) {
        setError('Please select your category.')
        setStatus('idle')
        return
      }

      try {
        const body: Record<string, unknown> = { rank: rankNum, category }
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
          if (res.status === 403 && data.code === 'PREDICTOR_ALREADY_USED') {
            setCreditsRemaining(0)
            setStatus('idle')
            return
          }
          throw new Error(data.error || 'Failed to get predictions.')
        }

        const data: PredictResponse = await res.json()
        setResponse(data)
        setCreditsRemaining(data.creditsRemaining)
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
    setCreditsRemaining(null)
  }, [])

  const selectClasses = useMemo(
    () => 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    [],
  )

  const handleRankChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setRank(e.target.value), [])
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value), [])
  const handleQuotaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setQuota(e.target.value), [])
  const handleStateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setState(e.target.value), [])
  const handleCourseChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setCourse(e.target.value), [])
  const handleCourseGroupChange = useCallback((value: string) => setCourseGroup(value as CourseGroup), [])

  if (creditsRemaining !== null && creditsRemaining <= 0 && !response) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-lg">
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
            ⏳
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-navy">
              No Predictions Remaining
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              You have used all your prediction credits. To predict again, please
              purchase a new plan.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-button-gold hover:bg-button-gold-hover text-primary-navy font-bold"
            >
              <Link href="/pricing">View Plans</Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-primary-navy/30 text-primary-navy hover:bg-primary-navy/5"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (response) {
    return (
      <>
        <PredictorLeaveWarning
          open={showLeaveWarning}
          onOpenChange={(open) => {
            if (!open) handleCancelLeave()
          }}
          onConfirmLeave={handleConfirmLeave}
        />
        <PredictorResults response={response} onReset={handleReset} />
      </>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg">
      <div className="flex flex-col gap-3 border-b border-border bg-primary-navy/[0.04] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-button-gold/20 text-lg">
            🎯
          </span>
          <div>
            <h2 className="text-balance text-lg font-bold text-primary-navy">
              Enter Your NEET Details
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your rank and filters to predict your college admission chances.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-5">
        <Tabs value={courseGroup} onValueChange={handleCourseGroupChange}>
          <TabsList className="w-full">
            {COURSE_GROUPS.map((group) => {
              const Icon = group.icon
              return (
                <TabsTrigger key={group.id} value={group.id} className="flex-1 gap-1.5 text-xs sm:text-sm">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{group.label}</span>
                  <span className="sm:hidden">{group.label.replace(' & BDS', '')}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      <form onSubmit={handleSubmit} className="p-6 pt-4">
        <div className="mb-6">
          <Label htmlFor="rank" className="text-sm font-semibold text-primary-navy">
            NEET All India Rank <span className="text-destructive">*</span>
          </Label>
          <Input
            id="rank"
            type="number"
            min="1"
            max="2000000"
            placeholder="Enter your AIR (e.g. 50000)"
            value={rank}
            onChange={handleRankChange}
            className="mt-1 h-10 text-sm"
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Filters
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="category" className="text-xs font-semibold text-primary-navy">
                Category <span className="text-destructive">*</span>
              </Label>
              <select
                id="category"
                aria-label="Your category"
                value={category}
                onChange={handleCategoryChange}
                className={cn(selectClasses, 'mt-1')}
                disabled={status === 'loading'}
                required
              >
                <option value="">Select Category</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
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
                onChange={handleCourseChange}
                className={cn(selectClasses, 'mt-1.5')}
                disabled={status === 'loading'}
              >
                <option value="">All Courses</option>
                {availableCourses.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
                onChange={handleQuotaChange}
                className={cn(selectClasses, 'mt-1.5')}
                disabled={status === 'loading'}
              >
                <option value="">All Quotas</option>
                {availableQuotas.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {courseGroup === 'mcc' && (
              <div>
                <Label htmlFor="state" className="text-xs font-semibold text-primary-navy">
                  State
                </Label>
                <select
                  id="state"
                  aria-label="State"
                  value={state}
                  onChange={handleStateChange}
                  className={cn(selectClasses, 'mt-1.5')}
                  disabled={status === 'loading'}
                >
                  <option value="">All States</option>
                  {availableStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div
            className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="h-12 w-full bg-button-gold text-sm font-bold text-primary-navy hover:bg-button-gold-hover active:scale-[0.96] sm:w-auto sm:px-10"
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
          {creditsRemaining !== null && creditsRemaining > 0 && (
            <span className="text-xs text-muted-foreground">
              {creditsRemaining} prediction{creditsRemaining !== 1 ? 's' : ''} remaining
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
