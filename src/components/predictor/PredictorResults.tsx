'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { PredictResponse } from '@/lib/predictor/types'

interface PredictorResultsProps {
  response: PredictResponse
  onReset: () => void
}

const ChanceBadge = React.memo(function ChanceBadge({ chance }: { chance: string }) {
  const styles: Record<string, string> = {
    High: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    Good: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    Low: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
  }

  return (
    <Badge variant="outline" className={cn('border-0 px-2.5 py-1 text-xs font-semibold', styles[chance] || 'bg-gray-100 text-gray-800')}>
      {chance === 'High' && <span className="mr-1">🟢</span>}
      {chance === 'Good' && <span className="mr-1">🟡</span>}
      {chance === 'Low' && <span className="mr-1">🔴</span>}
      {chance}
    </Badge>
  )
})

const UnlockPremiumPanel = React.memo(function UnlockPremiumPanel({ total }: { total: number }) {
  return (
    <tr>
      <td colSpan={8} className="px-0 py-0">
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
  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/40">
      <td className="px-4 py-3 text-sm text-muted-foreground">{index + 1}</td>
      <td className="min-w-[200px] px-4 py-3 text-sm font-medium text-primary-navy">
        {result.institute}
      </td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{result.state}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{result.course}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">{result.quota}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{result.allottedCategory}</td>
      <td className="px-4 py-3 text-right text-sm tabular-nums text-foreground">
        {result.closingRank.toLocaleString('en-IN')}
      </td>
      <td className="px-4 py-3 text-right">
        <ChanceBadge chance={result.chance} />
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
        <span className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</span>
      </div>
      <p className="mt-1 text-xs font-medium">{label}</p>
    </div>
  )
})

export const PredictorResults = React.memo(function PredictorResults({ response, onReset }: PredictorResultsProps) {
  const { results, summary, total, premium } = response

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
    { label: 'High Chance', value: summary.high, color: 'bg-green-50 border-green-200', icon: '🟢' },
    { label: 'Good Chance', value: summary.good, color: 'bg-yellow-50 border-yellow-200', icon: '🟡' },
    { label: 'Low Chance', value: summary.low, color: 'bg-red-50 border-red-200', icon: '🔴' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

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
              <span className="font-semibold">Results are shown once.</span>{' '}
              Do not refresh or leave this page — your data will be lost and you'll need to
              purchase again.
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
                <th className="hidden px-4 py-3 sm:table-cell">Allotted Cat.</th>
                <th className="px-4 py-3 text-right">Closing Rank</th>
                <th className="px-4 py-3 text-right">Chance</th>
              </tr>
            </thead>
            <tbody>
              <ResultRow result={results[0]} index={0} />

              {!premium && total > 1 && (
                <UnlockPremiumPanel total={total} />
              )}

              {premium && results.slice(1).map((result, i) => (
                <ResultRow key={`${result.institute}-${i}`} result={result} index={i + 1} />
              ))}
            </tbody>
          </table>
        </div>

        {premium && (
          <div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
            Showing all {total.toLocaleString('en-IN')} result{total !== 1 ? 's' : ''}.
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
        Predictions are based on previous year closing ranks from official MCC data. Actual cutoffs
        may vary. This is not a guarantee of admission.
      </p>
    </div>
  )
})
