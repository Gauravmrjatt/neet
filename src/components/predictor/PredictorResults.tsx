'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

function PremiumUpsellCard({ total }: { total: number }) {
  return (
    <div className="relative z-10 mx-auto mt-8 max-w-lg">
      <Card className="border-[#FBAC1A]/40 bg-gradient-to-br from-[#062963] to-[#0a3d7a] text-white shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-2 text-4xl">🔒</div>
          <CardTitle className="text-2xl font-bold text-white">
            {total} More College{total !== 1 ? 's' : ''} Available
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-base leading-relaxed text-white/80">
            Unlock the full list of <strong className="text-[#FBAC1A]">{total} eligible college{total !== 1 ? 's' : ''}</strong>{' '}
            with personalized chance analysis.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-white/70">
            <span className="rounded-full bg-white/10 px-3 py-1">Full college list</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Chance analysis</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Dedicated counsellor</span>
          </div>
          <Button
            asChild
            size="lg"
            className="mt-2 h-12 w-full bg-[#FBAC1A] hover:bg-[#e09b18] text-[#062963] font-bold text-base"
          >
            <Link href="/pricing">View Plans &amp; Unlock All Results</Link>
          </Button>
          <p className="text-xs text-white/50">
            Already purchased a plan? <Link href="/login?redirect=/predictor" className="underline text-white/70 hover:text-white">Log in</Link> to see all results.
          </p>
        </CardContent>
      </Card>
    </div>
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
    <tr className={cn('border-b border-gray-100 transition hover:bg-gray-50', isTeaser && 'opacity-30')}>
      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
      <td className="px-4 py-3 text-sm font-medium text-[#062963]">{result.institute}</td>
      <td className="hidden px-4 py-3 text-sm text-gray-600 md:table-cell">{result.state}</td>
      <td className="hidden px-4 py-3 text-sm text-gray-600 md:table-cell">{result.course}</td>
      <td className="hidden px-4 py-3 text-sm text-gray-600 lg:table-cell">{result.quota}</td>
      <td className="hidden px-4 py-3 text-sm text-gray-600 sm:table-cell">{result.allottedCategory}</td>
      <td className="px-4 py-3 text-right text-sm tabular-nums text-gray-900">{result.closingRank.toLocaleString('en-IN')}</td>
      <td className="px-4 py-3 text-right"><ChanceBadge chance={result.chance} /></td>
    </tr>
  )
}

export function PredictorResults({ response, onReset }: PredictorResultsProps) {
  const { results, summary, total, premium } = response

  if (results.length === 0) {
    return (
      <Card className="border-gray-200 bg-white shadow-lg">
        <CardContent className="py-12 text-center">
          <div className="mb-4 text-5xl">🔍</div>
          <CardTitle className="mb-2 text-xl text-[#062963]">No Matching Colleges Found</CardTitle>
          <p className="mb-6 text-sm text-gray-600">Try adjusting your rank, category, or filters to find matching colleges.</p>
          <Button onClick={onReset} className="bg-[#FBAC1A] hover:bg-[#e09b18] text-[#062963] font-semibold">Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  const premiumResultsCount = premium ? results.length : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-[#062963] sm:text-xl">
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
            <Badge className="border-0 bg-[#FBAC1A]/10 px-3 py-1.5 text-xs font-bold text-[#FBAC1A] hover:bg-[#FBAC1A]/10">
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

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#062963]/5 text-left text-xs font-semibold uppercase tracking-wider text-[#062963]/70">
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
                <tr>
                  <td colSpan={8} className="px-0 py-0">
                    <div className="relative overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          {[1, 2, 3].map((i) => (
                            <tr key={i} className="border-b border-gray-100 opacity-40">
                              <td className="px-4 py-3 text-sm text-gray-400">{total - (3 - i)}</td>
                              <td className="px-4 py-3 text-sm text-gray-400">................................</td>
                              <td className="hidden px-4 py-3 text-sm text-gray-400 md:table-cell">---</td>
                              <td className="hidden px-4 py-3 text-sm text-gray-400 md:table-cell">---</td>
                              <td className="hidden px-4 py-3 text-sm text-gray-400 lg:table-cell">---</td>
                              <td className="hidden px-4 py-3 text-sm text-gray-400 sm:table-cell">---</td>
                              <td className="px-4 py-3 text-right text-sm text-gray-400">------</td>
                              <td className="px-4 py-3 text-right">---</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="pointer-events-none absolute inset-0 backdrop-blur-[6px]" />
                    </div>
                  </td>
                </tr>
              )}

              {premium && results.slice(1).map((result, i) => (
                <ResultRow key={`${result.institute}-${i}`} result={result} index={i + 1} isTeaser={false} />
              ))}
            </tbody>
          </table>
        </div>

        {premium && total > premiumResultsCount && (
          <div className="border-t border-gray-100 px-4 py-3 text-center text-xs text-gray-500">
            Showing all {total} results.
          </div>
        )}
      </div>

      {!premium && total > 1 && <PremiumUpsellCard total={total - 1} />}

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onReset} variant="outline" className="border-[#062963]/30 text-[#062963] hover:bg-[#062963]/5">
          Try Different Rank
        </Button>
        {!premium && (
          <Button asChild className="bg-[#062963] hover:bg-[#041d45] text-white font-semibold">
            <Link href="/pricing">View Pricing Plans</Link>
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400">
        Predictions are based on previous year closing ranks from official MCC data. Actual cutoffs
        may vary. This is not a guarantee of admission.
      </p>
    </div>
  )
}
