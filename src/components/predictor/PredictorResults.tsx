'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { PredictResponse, PredictionResult, Chance } from '@/lib/predictor/types'
import { SecondaryFilters } from './SecondaryFilters'

interface PredictorResultsProps {
  response: PredictResponse
  onReset: () => void
}

const CHANCE_STYLES: Record<Chance, { badge: string; bg: string; border: string; icon: string }> = {
  Safe: { badge: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100', bg: 'bg-green-50', border: 'border-green-200', icon: '🟢' },
  Likely: { badge: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100', bg: 'bg-amber-50', border: 'border-amber-200', icon: '🟡' },
  Risky: { badge: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100', bg: 'bg-red-50', border: 'border-red-200', icon: '🔴' },
}

const ChanceBadge = React.memo(function ChanceBadge({ chance, probability }: { chance: Chance; probability: number }) {
  const s = CHANCE_STYLES[chance]
  return (
    <Badge variant="outline" className={cn('border-0 px-2.5 py-1 text-xs font-semibold', s.badge)}>
      <span className="mr-1">{s.icon}</span>
      {chance} {probability}%
    </Badge>
  )
})

const UnlockPremiumPanel = React.memo(function UnlockPremiumPanel({ total }: { total: number }) {
  return (
    <tr>
      <td colSpan={9} className="px-0 py-0">
        <div className="relative overflow-hidden">
          <div className="flex flex-col items-center gap-3 bg-gradient-to-b from-button-gold/[0.07] to-button-gold/[0.12] px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-button-gold/20 text-3xl">
              🔒
            </div>
            <div>
              <p className="text-lg font-bold text-primary-navy">
                {total.toLocaleString('en-IN')} More College{total !== 1 ? 's' : ''} Available
              </p>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                Unlock the full list with personalized chance analysis for every college.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary-navy/5 px-3 py-1">Full college list</span>
              <span className="rounded-full bg-primary-navy/5 px-3 py-1">Chance analysis</span>
              <span className="rounded-full bg-primary-navy/5 px-3 py-1">Dedicated counsellor</span>
            </div>
            <Button
              asChild
              className="mt-1 h-10 px-8 bg-button-gold text-sm font-bold text-primary-navy hover:bg-button-gold-hover"
            >
              <Link href="/pricing">Unlock Full Results</Link>
            </Button>
            <p className="text-xs text-muted-foreground/70">
              Already purchased a plan?{' '}
              <Link href="/login?redirect=/predictor" className="underline hover:text-primary-navy">Log in</Link>
            </p>
          </div>
        </div>
      </td>
    </tr>
  )
})

const ResultRow = React.memo(function ResultRow({
  result,
  index,
}: {
  result: PredictResponse['results'][number]
  index: number
}) {
  const isFreePreview = index === 0
  return (
    <tr
      className={cn(
        'border-b border-border transition-colors hover:bg-muted/40 result-row',
        !isFreePreview && 'opacity-0',
      )}
    >
      <td className="px-4 py-3 text-sm text-muted-foreground">{index + 1}</td>
      <td className="min-w-[200px] px-4 py-3 text-sm font-medium text-primary-navy uppercase">
        {result.institute}
      </td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{result.state || '—'}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{result.course}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">{result.quota}</td>
      <td className="hidden px-4 py-3 text-right text-sm tabular-nums text-muted-foreground lg:table-cell">
        {result.openingRank > 0 ? result.openingRank.toLocaleString('en-IN') : '—'}
      </td>
      <td className="px-4 py-3 text-right text-sm tabular-nums text-foreground">
        {result.closingRank.toLocaleString('en-IN')}
      </td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
        {result.expectedRound}
      </td>
      <td className="px-4 py-3 text-right">
        <ChanceBadge chance={result.chance} probability={result.probability} />
      </td>
    </tr>
  )
})

const SummaryCard = React.memo(function SummaryCard({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: number | string
  color: string
  icon: string
}) {
  return (
    <div className={cn('rounded-xl border p-4 shadow-sm', color)}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold tabular-nums">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</span>
      </div>
      <p className="mt-1 text-xs font-medium">{label}</p>
    </div>
  )
})

export const PredictorResults = React.memo(function PredictorResults({ response, onReset }: PredictorResultsProps) {
  const { results, summary, total, premium, creditsRemaining } = response
  const [displayResults, setDisplayResults] = useState<PredictionResult[]>(results)

  const handleFilterChange = useCallback((filtered: PredictionResult[]) => {
    setDisplayResults(filtered)
  }, [])

  if (results.length === 0) {
    return (
      <Card className="border-border bg-card shadow-lg">
        <CardContent className="py-16 text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <CardTitle className="mb-2 text-xl text-primary-navy">No Matching Colleges Found</CardTitle>
          <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            No colleges matched your rank and filters. Try adjusting your category, quota, or expanding
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

  const summaryCards = [
    { label: 'Total Colleges', value: total, color: 'bg-card border-primary-navy/20', icon: '🎓' },
    { label: 'Safe', value: summary.safe, color: 'bg-green-50 border-green-200', icon: '🟢' },
    { label: 'Likely', value: summary.likely, color: 'bg-amber-50 border-amber-200', icon: '🟡' },
    { label: 'Risky', value: summary.risky, color: 'bg-red-50 border-red-200', icon: '🔴' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      <div className="flex justify-center sm:justify-start">
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="border-primary-navy/30 text-primary-navy hover:bg-primary-navy/5"
        >
          Try Different Rank
        </Button>
      </div>

      <SecondaryFilters results={results} onFilterChange={handleFilterChange} />

      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border px-4 py-3 text-sm',
          premium
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-button-gold/30 bg-button-gold/5 text-primary-navy',
        )}
      >
        <span className="text-lg">{premium ? '⚠️' : '🔒'}</span>
        <div className="flex-1">
          {premium ? (
            <>
              <span className="font-semibold">{creditsRemaining} prediction{creditsRemaining !== 1 ? 's' : ''} remaining</span>{' '}
              after this one. Do not refresh or leave this page — your current results will be lost.
            </>
          ) : (
            <>
              Showing <span className="font-semibold">1 of {total.toLocaleString('en-IN')}</span>{' '}
              matching college{total !== 1 ? 's' : ''}.{' '}
              <Link href="/pricing" className="font-semibold underline hover:text-button-gold">
                Purchase a plan
              </Link>{' '}
              to see the full list.
            </>
          )}
        </div>
        {premium && (
          <Badge className="shrink-0 border-0 bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-100">
            Premium
          </Badge>
        )}
      </div>

      <style jsx>{`
        @keyframes rowFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .result-row {
          animation: rowFadeIn 300ms ease-out forwards;
        }
        .result-row:nth-child(1) { animation-delay: 0ms; }
        .result-row:nth-child(2) { animation-delay: 40ms; }
        .result-row:nth-child(3) { animation-delay: 80ms; }
        .result-row:nth-child(4) { animation-delay: 120ms; }
        .result-row:nth-child(5) { animation-delay: 160ms; }
        .result-row:nth-child(6) { animation-delay: 200ms; }
        .result-row:nth-child(7) { animation-delay: 240ms; }
        .result-row:nth-child(8) { animation-delay: 280ms; }
        .result-row:nth-child(9) { animation-delay: 320ms; }
        .result-row:nth-child(10) { animation-delay: 360ms; }
      `}</style>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-navy/5 text-left text-xs font-semibold uppercase tracking-wider text-primary-navy/70">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Institute</th>
                <th className="hidden px-4 py-3 md:table-cell">State</th>
                <th className="hidden px-4 py-3 md:table-cell">Course</th>
                <th className="hidden px-4 py-3 lg:table-cell">Quota</th>
                <th className="hidden px-4 py-3 text-right lg:table-cell">Opening Rank</th>
                <th className="px-4 py-3 text-right">Closing Rank</th>
                <th className="hidden px-4 py-3 sm:table-cell">Exp. Round</th>
                <th className="px-4 py-3 text-right">Chance</th>
              </tr>
            </thead>
            <tbody>
              {displayResults.length > 0 ? (
                <>
                  <ResultRow result={displayResults[0]} index={0} />

                  {!premium && displayResults.length > 1 && (
                    <UnlockPremiumPanel total={displayResults.length} />
                  )}

                  {premium && displayResults.slice(1).map((result, i) => (
                    <ResultRow key={`${result.institute}-${i}`} result={result} index={i + 1} />
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No colleges match your current filters. Try adjusting your filter selections.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {premium && (
          <div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
            Showing all {displayResults.length.toLocaleString('en-IN')} of {total.toLocaleString('en-IN')} result{total !== 1 ? 's' : ''}.
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={onReset}
          variant="outline"
          className="border-primary-navy/30 text-primary-navy hover:bg-primary-navy/5"
        >
          Try Different Rank
        </Button>
        {!premium && (
          <Button asChild className="bg-primary-navy hover:bg-primary-navy-dark text-white font-semibold">
            <Link href="/pricing">View Pricing Plans</Link>
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground/70">
        Predictions are based on previous year closing ranks from official allotment data. Actual cutoffs
        may vary. This is not a guarantee of admission. Each prediction uses 1 credit.
      </p>
    </div>
  )
})
