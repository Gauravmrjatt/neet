'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Loader2, AlertTriangle, Stethoscope, Leaf, PawPrint,
  GraduationCap, Hash, Target, ChevronDown, Info,
} from 'lucide-react'
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

const COURSE_GROUPS: { id: CourseGroup; label: string; shortLabel: string; icon: React.ElementType; courses: string[] }[] = [
  { id: 'mcc', label: 'MBBS & BDS', shortLabel: 'MBBS', icon: Stethoscope, courses: ['MBBS', 'BDS', 'B.Sc. Nursing'] },
  { id: 'ayush', label: 'AYUSH', shortLabel: 'AYUSH', icon: Leaf, courses: ['BAMS', 'BUMS', 'BSMS'] },
  { id: 'vet', label: 'Veterinary', shortLabel: 'Vet', icon: PawPrint, courses: ['BVSc & AH'] },
]

type InputMode = 'rank' | 'score'

export function PredictorForm({ filterOptions }: PredictorFormProps) {
  const [courseGroup, setCourseGroup] = useState<CourseGroup>('mcc')
  const [inputMode, setInputMode] = useState<InputMode>('rank')

  const COURSE_CATEGORIES: Record<CourseGroup, string[]> = {
    mcc: ['GN', 'GN-PH', 'OBC', 'OBC-PH', 'EWS', 'EWS-PH', 'SC', 'SC-PH', 'ST', 'ST-PH', 'OP'],
    ayush: ['GEN', 'OBC', 'EWS', 'SC', 'ST'],
    vet: ['GEN', 'OBC', 'EWS', 'SC', 'ST'],
  }

  const COURSE_QUOTAS: Record<CourseGroup, string[]> = {
    mcc: ['AIQ', 'NRI', 'AMU'],
    ayush: ['AIQ', 'Central', 'Management', 'Minority'],
    vet: ['AIQ'],
  }

  const [rank, setRank] = useState('')
  const [score, setScore] = useState('')
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

  React.useEffect(() => {
    if (!hasResults) return
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => setShowLeaveWarning(true)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [hasResults])

  React.useEffect(() => {
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

      if (inputMode === 'rank') {
        const rankNum = parseInt(rank, 10)
        if (!rank || isNaN(rankNum) || rankNum < 1) {
          setError('Please enter a valid NEET All India Rank.')
          setStatus('idle')
          return
        }
      } else {
        const scoreNum = parseInt(score, 10)
        if (!score || isNaN(scoreNum) || scoreNum < 1 || scoreNum > 720) {
          setError('Please enter a valid NEET score (1-720).')
          setStatus('idle')
          return
        }
      }

      if (!category) {
        setError('Please select your category.')
        setStatus('idle')
        return
      }

      try {
        const body: Record<string, unknown> = { category }
        if (inputMode === 'rank') {
          body.rank = parseInt(rank, 10)
        } else {
          body.score = parseInt(score, 10)
        }
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
    [inputMode, rank, score, category, quota, state, course],
  )

  const handleReset = useCallback(() => {
    setResponse(null)
    setError('')
    setStatus('idle')
    setCreditsRemaining(null)
  }, [])

  if (creditsRemaining !== null && creditsRemaining <= 0 && !response) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-lg">
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <AlertTriangle className="h-7 w-7 text-amber-500" />
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
              className="border-primary-navy/20 text-primary-navy hover:bg-primary-navy/5"
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
        <PredictorResults response={response} onReset={handleReset} inputMode={inputMode} />
      </>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-br from-primary-navy/[0.03] to-transparent px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-navy/10">
            <Target className="h-5 w-5 text-primary-navy" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-navy">
              NEET College Predictor
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your rank or score to find the best college options.
            </p>
          </div>
        </div>
      </div>

      {/* Course Group Tabs */}
      <div className="border-b border-border bg-muted/20 px-6 pt-4 pb-0">
        <Tabs value={courseGroup} onValueChange={(v) => setCourseGroup(v as CourseGroup)}>
          <TabsList className="h-auto w-full gap-0 bg-transparent p-0">
            {COURSE_GROUPS.map((group) => {
              const Icon = group.icon
              const isActive = courseGroup === group.id
              return (
                <TabsTrigger
                  key={group.id}
                  value={group.id}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-t-lg rounded-b-none border-b-2 px-4 py-3 text-xs font-medium transition-all sm:text-sm',
                    isActive
                      ? 'border-primary-navy bg-card text-primary-navy shadow-sm'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{group.label}</span>
                  <span className="sm:hidden">{group.shortLabel}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Input Mode Toggle */}
        <div className="mb-5 flex gap-1.5 rounded-lg border border-border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setInputMode('rank')}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
              inputMode === 'rank'
                ? 'bg-card text-primary-navy shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Hash className="h-4 w-4" />
            By Rank
          </button>
          <button
            type="button"
            onClick={() => setInputMode('score')}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
              inputMode === 'score'
                ? 'bg-card text-primary-navy shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <GraduationCap className="h-4 w-4" />
            By Score
          </button>
        </div>

        {/* Rank / Score Input */}
        <div className="mb-5">
          {inputMode === 'rank' ? (
            <div>
              <Label htmlFor="rank" className="text-sm font-semibold text-primary-navy">
                NEET All India Rank <span className="text-destructive">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="rank"
                  type="number"
                  min="1"
                  max="2000000"
                  placeholder="e.g. 50000"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="h-11 pl-4 pr-12 text-base tabular-nums"
                  required={inputMode === 'rank'}
                  disabled={status === 'loading'}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  AIR
                </span>
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="score" className="text-sm font-semibold text-primary-navy">
                NEET Score (out of 720) <span className="text-destructive">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="score"
                  type="number"
                  min="1"
                  max="720"
                  placeholder="e.g. 600"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="h-11 pl-4 pr-16 text-base tabular-nums"
                  required={inputMode === 'score'}
                  disabled={status === 'loading'}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  / 720
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Filters
            </span>
            <div className="group relative">
              <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground/50 transition-colors hover:text-muted-foreground" />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 text-xs text-muted-foreground shadow-md opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                Category is required. State, course, and quota are optional filters to narrow your results.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="category" className="text-xs font-medium text-muted-foreground">
                Category <span className="text-destructive">*</span>
              </Label>
              <div className="relative mt-1">
                <select
                  id="category"
                  aria-label="Your category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-navy/20 focus-visible:border-primary-navy/40 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={status === 'loading'}
                  required
                >
                  <option value="">Select Category</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="course" className="text-xs font-medium text-muted-foreground">
                Course
              </Label>
              <div className="relative mt-1">
                <select
                  id="course"
                  aria-label="Course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="flex h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-navy/20 focus-visible:border-primary-navy/40 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={status === 'loading'}
                >
                  <option value="">All Courses</option>
                  {availableCourses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="quota" className="text-xs font-medium text-muted-foreground">
                Quota
              </Label>
              <div className="relative mt-1">
                <select
                  id="quota"
                  aria-label="Quota"
                  value={quota}
                  onChange={(e) => setQuota(e.target.value)}
                  className="flex h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-navy/20 focus-visible:border-primary-navy/40 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={status === 'loading'}
                >
                  <option value="">All Quotas</option>
                  {availableQuotas.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {courseGroup === 'mcc' && (
              <div>
                <Label htmlFor="state" className="text-xs font-medium text-muted-foreground">
                  State
                </Label>
                <div className="relative mt-1">
                  <select
                    id="state"
                    aria-label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="flex h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-navy/20 focus-visible:border-primary-navy/40 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={status === 'loading'}
                  >
                    <option value="">All States</option>
                    {availableStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 p-3.5 text-sm text-destructive"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="h-12 w-full bg-button-gold text-sm font-bold text-primary-navy shadow-sm hover:bg-button-gold-hover hover:shadow active:scale-[0.97] sm:w-auto sm:px-10"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Analyzing your chances...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Target className="h-4 w-4" />
                Predict My College
              </span>
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
