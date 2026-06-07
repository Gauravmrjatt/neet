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

function ChanceBadge({ chance }: { chance: string }) {
  const styles: Record<string, string> = {
    High: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    Good: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    Low: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
  }

  return (
    <Badge variant="outline" className={cn('border-0 px-2.5 py-1 text-xs font-semibold', styles[chance] || 'bg-gray-100 text-gray-800')}>
      {chance === 'High' && '🟢 '}
      {chance === 'Good' && '🟡 '}
      {chance === 'Low' && '🔴 '}
      {chance}
    </Badge>
  )
}

function UnlockCtaRow({ total }: { total: number }) {
  return (
    <tr className="border-b border-border bg-gradient-to-r from-button-gold/5 to-button-gold/10">
      <td colSpan={8} className="px-6 py-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="mb-1 text-3xl" role="img" aria-label="locked">🔒</div>
          <p className="text-lg font-bold text-primary-navy">
            {total.toLocaleString('en-IN')} More College{total !== 1 ? 's' : ''} Available
          </p>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Unlock the full list of <span className="font-semibold text-button-gold">{total.toLocaleString('en-IN')} eligible college{total !== 1 ? 's' : ''}</span> with personalized chance analysis.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary-navy/5 px-3 py-1">Full college list</span>
            <span className="rounded-full bg-primary-navy/5 px-3 py-1">Chance analysis</span>
            <span className="rounded-full bg-primary-navy/5 px-3 py-1">Dedicated counsellor</span>
          </div>
          <Button
            asChild
            size="sm"
            className="mt-1 h-9 px-6 bg-button-gold text-xs font-bold text-primary-navy hover:bg-button-gold-hover"
          >
            <Link href="/pricing">Unlock</Link>
          </Button>
          <p className="text-xs text-muted-foreground/70">
            Already purchased a plan?{' '}
            <Link href="/login?redirect=/predictor" className="underline hover:text-primary-navy">Log in</Link> to see all results.
          </p>
        </div>
      </td>
    </tr>
  )
}

function ResultRow({
  result,
  index,
  isTeaser,
}: {
  result: PredictResponse['results'][number]
  index: number
  isTeaser: boolean
}) {
  return (
    <tr className={cn('border-b border-border transition hover:bg-muted/50', isTeaser && 'opacity-30')}>
      <td className="px-4 py-3 text-sm text-muted-foreground">{index + 1}</td>
      <td className="px-4 py-3 text-sm font-medium text-primary-navy">{result.institute}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{result.state}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{result.course}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">{result.quota}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{result.allottedCategory}</td>
      <td className="px-4 py-3 text-right text-sm tabular-nums text-foreground">{result.closingRank.toLocaleString('en-IN')}</td>
      <td className="px-4 py-3 text-right"><ChanceBadge chance={result.chance} /></td>
    </tr>
  )
}

export function PredictorResults({ response, onReset }: PredictorResultsProps) {
  const { results, summary, total, premium } = response

  if (results.length === 0) {
    return (
      <Card className="border-border bg-card shadow-lg">
        <CardContent className="py-12 text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <CardTitle className="mb-2 text-xl text-primary-navy">No Matching Colleges Found</CardTitle>
          <p className="mb-6 text-sm text-muted-foreground">Try adjusting your rank, category, or filters to find matching colleges.</p>
          <Button onClick={onReset} className="bg-button-gold hover:bg-button-gold-hover text-primary-navy font-semibold">Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  const premiumResultsCount = premium ? results.length : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-primary-navy sm:text-xl">
            {total} Eligible College{total !== 1 ? 's' : ''} Found
          </h2>
          <div className="mt-1 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" /> High: {summary.high}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-yellow-700">
              <span className="h-2 w-2 rounded-full bg-yellow-500" /> Good: {summary.good}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-red-700">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Low: {summary.low}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!premium && (
            <Badge className="border-0 bg-button-gold/10 px-3 py-1.5 text-xs font-bold text-button-gold hover:bg-button-gold/10">
              Showing Top 1
            </Badge>
          )}
          {premium && (
            <Badge className="border-0 bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-100">
              Premium &middot; Full Access
            </Badge>
          )}
        </div>
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
              <ResultRow result={results[0]} index={0} isTeaser={false} />

              {!premium && total > 1 && (
                <>
                  <UnlockCtaRow total={total} />
                  <tr>
                    <td colSpan={8} className="px-0 py-0">
                    <div className="relative overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          {[1, 2, 3].map((i) => (
                            <tr key={i} className="border-b border-border opacity-40">
                              <td className="px-4 py-3 text-sm text-muted-foreground">{total - (3 - i)}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">................................</td>
                              <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">---</td>
                              <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">---</td>
                              <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">---</td>
                              <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">---</td>
                              <td className="px-4 py-3 text-right text-sm text-muted-foreground">------</td>
                              <td className="px-4 py-3 text-right">---</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="pointer-events-none absolute inset-0 backdrop-blur-[6px]" />
                    </div>
                  </td>
                </tr>
                </>
              )}

              {premium && results.slice(1).map((result, i) => (
                <ResultRow key={`${result.institute}-${i}`} result={result} index={i + 1} isTeaser={false} />
              ))}
            </tbody>
          </table>
        </div>

        {premium && total > premiumResultsCount && (
          <div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
            Showing all {total} results.
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onReset} variant="outline" className="border-primary-navy/30 text-primary-navy hover:bg-primary-navy/5">
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
}
