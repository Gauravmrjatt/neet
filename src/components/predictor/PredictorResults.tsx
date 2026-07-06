'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Search, GraduationCap, Building2, MapPin, Filter,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, RotateCcw, Lock, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PredictResponse, PredictionResult } from '@/lib/predictor/types'
import { SecondaryFilters } from './SecondaryFilters'

interface PredictorResultsProps {
  response: PredictResponse
  onReset: () => void
  inputMode?: 'rank' | 'score'
}

const COLLEGE_TYPE_STYLES: Record<string, string> = {
  'Govt-State': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60',
  'Govt-AIIMS': 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/60',
  'Govt-Central': 'bg-purple-50 text-purple-700 ring-1 ring-purple-200/60',
  'Govt-Aided': 'bg-teal-50 text-teal-700 ring-1 ring-teal-200/60',
  'Govt-DNB': 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200/60',
  'Govt-Deemed': 'bg-sky-50 text-sky-700 ring-1 ring-sky-200/60',
  'Govt-ESI': 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/60',
  'Private': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
  'Private-Deemed': 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/60',
  'Private-Deemed-Minority': 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/60',
  'Private-Minority': 'bg-pink-50 text-pink-700 ring-1 ring-pink-200/60',
  'Private-University': 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/60',
  'Private-University-Minority': 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/60',
}

const PER_PAGE = 25

type SortField = 'closingRank' | 'openingRank' | 'score' | 'institute' | 'year'
type SortDir = 'asc' | 'desc'

const UnlockPremiumPanel = React.memo(function UnlockPremiumPanel({ total }: { total: number }) {
  return (
    <div className="mx-4 my-4 overflow-hidden rounded-xl border border-button-gold/30 bg-gradient-to-br from-button-gold/[0.08] via-button-gold/[0.04] to-transparent">
      <div className="flex flex-col items-center gap-4 px-6 py-10 text-center sm:px-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-button-gold/15">
          <Lock className="h-6 w-6 text-button-gold" />
        </div>
        <div>
          <p className="text-lg font-bold text-primary-navy">
            {total.toLocaleString('en-IN')} More College{total !== 1 ? 's' : ''} Available
          </p>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Unlock the full list with personalized chance analysis for every college.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {['Full college list', 'All round cutoffs', 'Score & rank data'].map((tag) => (
            <span key={tag} className="rounded-full bg-primary-navy/5 px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
        <Button
          asChild
          className="mt-1 h-10 px-8 bg-button-gold text-sm font-bold text-primary-navy hover:bg-button-gold-hover"
        >
          <Link href="/pricing">Unlock Full Results</Link>
        </Button>
        <p className="text-xs text-muted-foreground/60">
          Already purchased a plan?{' '}
          <Link href="/login?redirect=/predictor" className="underline hover:text-primary-navy">Log in</Link>
        </p>
      </div>
    </div>
  )
})

const ResultRow = React.memo(function ResultRow({
  result,
  index,
}: {
  result: PredictionResult
  index: number
}) {
  const typeStyle = COLLEGE_TYPE_STYLES[result.collegeType] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-200/60'
  return (
    <tr className="border-b border-border/50 transition-colors hover:bg-muted/30 group">
      <td className="px-4 py-3.5 text-xs text-muted-foreground tabular-nums">{index + 1}</td>
      <td className="min-w-[220px] px-4 py-3.5">
        <div className="font-medium text-primary-navy text-sm leading-tight">{result.institute}</div>
        <div className="mt-0.5 text-xs text-muted-foreground md:hidden">{result.state || '—'}</div>
      </td>
      <td className="hidden px-4 py-3.5 text-sm text-muted-foreground md:table-cell">{result.state || '—'}</td>
      <td className="hidden px-4 py-3.5 sm:table-cell">
        <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', typeStyle)}>
          {result.collegeType || '—'}
        </span>
      </td>
      <td className="hidden px-4 py-3.5 text-sm text-muted-foreground lg:table-cell">{result.quota}</td>
      <td className="hidden px-4 py-3.5 text-right text-sm tabular-nums text-muted-foreground lg:table-cell">
        {result.score > 0 ? result.score : '—'}
      </td>
      <td className="hidden px-4 py-3.5 text-right text-sm tabular-nums text-muted-foreground lg:table-cell">
        {result.openingRank > 0 ? result.openingRank.toLocaleString('en-IN') : '—'}
      </td>
      <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-foreground">
        {result.closingRank.toLocaleString('en-IN')}
      </td>
      <td className="hidden px-4 py-3.5 text-sm sm:table-cell">
        <Badge variant="outline" className="border-border/60 bg-background text-xs font-medium">
          {result.expectedRound}
        </Badge>
      </td>
    </tr>
  )
})

const SummaryCard = React.memo(function SummaryCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string
  value: number | string
  color: string
  icon: React.ElementType
}) {
  return (
    <div className={cn('rounded-xl border p-4 shadow-sm', color)}>
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/60">
          <Icon className="h-4.5 w-4.5 opacity-70" />
        </div>
        <span className="text-2xl font-bold tabular-nums text-primary-navy">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </span>
      </div>
      <p className="mt-2 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  )
})

export const PredictorResults = React.memo(function PredictorResults({ response, onReset, inputMode }: PredictorResultsProps) {
  const { results, total, premium, creditsRemaining } = response

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRound, setSelectedRound] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('closingRank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [displayResults, setDisplayResults] = useState<PredictionResult[]>(results)

  const roundOptions = useMemo(() => {
    const rounds = Array.from(new Set(results.map((r) => r.expectedRound).filter(Boolean)))
    rounds.sort((a, b) => {
      const na = parseInt(a.replace('R', ''), 10)
      const nb = parseInt(b.replace('R', ''), 10)
      return na - nb
    })
    return [{ value: '', label: 'All Rounds' }, ...rounds.map((r) => ({ value: r, label: r }))]
  }, [results])

  const handleFilterChange = useCallback((filtered: PredictionResult[]) => {
    setDisplayResults(filtered)
    setCurrentPage(1)
  }, [])

  const summaryData = useMemo(() => {
    const uniqueColleges = new Set(results.map((r) => r.institute)).size
    const states = new Set(results.map((r) => r.state)).size
    const types = new Set(results.filter((r) => r.collegeType).map((r) => r.collegeType)).size
    return { uniqueColleges, states, types }
  }, [results])

  const roundFiltered = useMemo(() => {
    if (!selectedRound) return displayResults
    return displayResults.filter((r) => r.expectedRound === selectedRound)
  }, [displayResults, selectedRound])

  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return roundFiltered
    const q = searchQuery.toLowerCase().trim()
    return roundFiltered.filter((r) =>
      r.institute.toLowerCase().includes(q) ||
      r.state?.toLowerCase().includes(q) ||
      r.collegeType?.toLowerCase().includes(q) ||
      r.course?.toLowerCase().includes(q)
    )
  }, [roundFiltered, searchQuery])

  const sorted = useMemo(() => {
    const copy = [...searchFiltered]
    copy.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'closingRank': cmp = a.closingRank - b.closingRank; break
        case 'openingRank': cmp = a.openingRank - b.openingRank; break
        case 'score': cmp = a.score - b.score; break
        case 'institute': cmp = a.institute.localeCompare(b.institute); break
        case 'year': cmp = a.year - b.year; break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [searchFiltered, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = sorted.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        return field
      }
      setSortDir(field === 'institute' ? 'asc' : 'asc')
      return field
    })
  }, [])

  const SortIcon = useCallback(({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
    return sortDir === 'asc'
      ? <ArrowUp className="ml-1 h-3 w-3 text-primary-navy" />
      : <ArrowDown className="ml-1 h-3 w-3 text-primary-navy" />
  }, [sortField, sortDir])

  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safePage > 3) pages.push('...')
      const start = Math.max(2, safePage - 1)
      const end = Math.min(totalPages - 1, safePage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (safePage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, safePage])

  if (results.length === 0) {
    return (
      <Card className="border-border bg-card shadow-lg">
        <CardContent className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search className="h-7 w-7 text-muted-foreground/60" />
          </div>
          <CardTitle className="mb-2 text-xl text-primary-navy">No Matching Colleges Found</CardTitle>
          <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            No colleges matched your {inputMode || 'rank'} and filters. Try adjusting your category, quota, or expanding
            your search criteria.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary-navy/5 px-3 py-1">Lower rank requirement</span>
            <span className="rounded-full bg-primary-navy/5 px-3 py-1">Different category</span>
            <span className="rounded-full bg-primary-navy/5 px-3 py-1">All states</span>
          </div>
          <Button
            onClick={onReset}
            className="mt-6 bg-button-gold hover:bg-button-gold-hover text-primary-navy font-semibold"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          label="Total Results"
          value={total}
          color="bg-card border-primary-navy/15"
          icon={GraduationCap}
        />
        <SummaryCard
          label="Unique Colleges"
          value={summaryData.uniqueColleges}
          color="bg-blue-50/80 border-blue-200/60"
          icon={Building2}
        />
        <SummaryCard
          label="States Covered"
          value={summaryData.states}
          color="bg-emerald-50/80 border-emerald-200/60"
          icon={MapPin}
        />
        <SummaryCard
          label="College Types"
          value={summaryData.types}
          color="bg-amber-50/80 border-amber-200/60"
          icon={Filter}
        />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="w-fit border-primary-navy/20 text-primary-navy hover:bg-primary-navy/5"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Try Different {inputMode === 'score' ? 'Score' : 'Rank'}
        </Button>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search colleges..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="pl-9 h-9 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Round Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-1">Round:</span>
        {roundOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setSelectedRound(opt.value); setCurrentPage(1) }}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-all',
              selectedRound === opt.value
                ? 'bg-primary-navy text-white shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Secondary Filters */}
      <SecondaryFilters results={results} onFilterChange={handleFilterChange} />

      {/* Credits / Premium Banner */}
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm',
          premium
            ? 'border-green-200 bg-green-50/80 text-green-800'
            : 'border-button-gold/30 bg-button-gold/5 text-primary-navy',
        )}
      >
        {premium ? (
          <>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100">
              <Lock className="h-3.5 w-3.5 text-green-600" />
            </span>
            <div className="flex-1">
              <span className="font-semibold">{creditsRemaining} prediction{creditsRemaining !== 1 ? 's' : ''} remaining</span>{' '}
              after this one. Do not refresh or leave this page.
            </div>
            <Badge className="shrink-0 border-0 bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-100">
              Premium
            </Badge>
          </>
        ) : (
          <>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-button-gold/20">
              <Lock className="h-3.5 w-3.5 text-button-gold" />
            </span>
            <div className="flex-1">
              Showing <span className="font-semibold">1 of {total.toLocaleString('en-IN')}</span>{' '}
              matching college{total !== 1 ? 's' : ''}.{' '}
              <Link href="/pricing" className="font-semibold underline hover:text-button-gold">
                Purchase a plan
              </Link>{' '}
              to see the full list.
            </div>
          </>
        )}
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3">
                  <button type="button" onClick={() => handleSort('institute')} className="inline-flex items-center hover:text-foreground transition-colors">
                    Institute <SortIcon field="institute" />
                  </button>
                </th>
                <th className="hidden px-4 py-3 md:table-cell">State</th>
                <th className="hidden px-4 py-3 sm:table-cell">Type</th>
                <th className="hidden px-4 py-3 lg:table-cell">Quota</th>
                <th className="hidden px-4 py-3 text-right lg:table-cell">
                  <button type="button" onClick={() => handleSort('score')} className="inline-flex items-center hover:text-foreground transition-colors">
                    Score <SortIcon field="score" />
                  </button>
                </th>
                <th className="hidden px-4 py-3 text-right lg:table-cell">
                  <button type="button" onClick={() => handleSort('openingRank')} className="inline-flex items-center hover:text-foreground transition-colors">
                    Opening <SortIcon field="openingRank" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button type="button" onClick={() => handleSort('closingRank')} className="inline-flex items-center hover:text-foreground transition-colors">
                    Closing <SortIcon field="closingRank" />
                  </button>
                </th>
                <th className="hidden px-4 py-3 sm:table-cell">Round</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                <>
                  {paginated.map((result, i) => (
                    <ResultRow
                      key={`${result.institute}-${result.closingRank}-${result.year}-${(safePage - 1) * PER_PAGE + i}`}
                      result={result}
                      index={(safePage - 1) * PER_PAGE + i}
                    />
                  ))}

               
                </>
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No colleges match your current filters. Try adjusting your filter selections.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
   {!premium && (
                    <UnlockPremiumPanel total={sorted.length} />
                  )}
        {/* Pagination */}
        {sorted.length > PER_PAGE && (
          <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {((safePage - 1) * PER_PAGE + 1).toLocaleString('en-IN')}–{Math.min(safePage * PER_PAGE, sorted.length).toLocaleString('en-IN')} of {sorted.length.toLocaleString('en-IN')} results
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={safePage <= 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {pageNumbers.map((num, idx) =>
                num === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">...</span>
                ) : (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={cn(
                      'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md border px-2 text-xs font-medium transition-colors',
                      safePage === num
                        ? 'border-primary-navy bg-primary-navy text-white'
                        : 'border-border text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {num}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={safePage >= totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={onReset}
          variant="outline"
          className="border-primary-navy/20 text-primary-navy hover:bg-primary-navy/5"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Try Different {inputMode === 'score' ? 'Score' : 'Rank'}
        </Button>
        {!premium && (
          <Button asChild className="bg-primary-navy hover:bg-primary-navy-dark text-white font-semibold">
            <Link href="/pricing">View Pricing Plans</Link>
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground/60">
        Predictions are based on previous year closing ranks from official MCC/State allotment data. Actual cutoffs
        may vary. This is not a guarantee of admission. Each prediction uses 1 credit.
      </p>
    </div>
  )
})
