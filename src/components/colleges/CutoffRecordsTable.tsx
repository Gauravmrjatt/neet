'use client'

import { useState, useMemo } from 'react'
import type { CutoffRecordData } from '@/lib/queries/cutoffs'

const CATEGORY_LABELS: Record<string, string> = {
  'General': 'General',
  'General PwD': 'General (PwD)',
  'OBC-NCL': 'OBC-NCL',
  'OBC-NCL PwD': 'OBC-NCL (PwD)',
  'SC': 'SC',
  'SC PwD': 'SC (PwD)',
  'ST': 'ST',
  'ST PwD': 'ST (PwD)',
  'EWS': 'EWS',
  'EWS PwD': 'EWS (PwD)',
  'OP': 'OP',
  'GEN': 'GEN',
  'OBC': 'OBC',
}

const CATEGORY_ORDER = ['General', 'General PwD', 'OBC-NCL', 'OBC-NCL PwD', 'EWS', 'EWS PwD', 'SC', 'SC PwD', 'ST', 'ST PwD', 'OP', 'OBC', 'GEN']

interface CutoffRecordsTableProps {
  records: CutoffRecordData[]
}

export function CutoffRecordsTable({ records }: CutoffRecordsTableProps) {
  const courses = useMemo(() => [...new Set(records.map(r => r.course))].sort(), [records])
  const [activeCourse, setActiveCourse] = useState(courses[0] || '')

  const courseYears = useMemo(() => {
    const years = new Set(records.filter(r => r.course === activeCourse).map(r => r.year))
    return [...years].sort((a, b) => b - a)
  }, [records, activeCourse])
  const [activeYear, setActiveYear] = useState(courseYears[0] || 0)

  const courseYearRounds = useMemo(() => {
    const rounds = new Set(records.filter(r => r.course === activeCourse && r.year === activeYear).map(r => r.round))
    return [...rounds].sort((a, b) => a - b)
  }, [records, activeCourse, activeYear])
  const [activeRound, setActiveRound] = useState(courseYearRounds[0] || 1)

  const filtered = useMemo(() => {
    return records
      .filter(r => r.course === activeCourse && r.year === activeYear && r.round === activeRound)
      .sort((a, b) => {
        const catA = CATEGORY_ORDER.indexOf(a.category)
        const catB = CATEGORY_ORDER.indexOf(b.category)
        if (catA !== catB) return catA - catB
        return a.quota.localeCompare(b.quota)
      })
  }, [records, activeCourse, activeYear, activeRound])

  if (records.length === 0) return null

  const activeCourseExists = activeCourse && courses.includes(activeCourse)
  if (!activeCourseExists) return null

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold text-primary-navy mb-4">Cutoff Ranks</h2>

      {courses.length > 1 && (
        <div className="flex gap-1 mb-4 flex-wrap">
          {courses.map(course => (
            <button
              key={course}
              onClick={() => { setActiveCourse(course); setActiveYear(0); setActiveRound(1) }}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeCourse === course
                  ? 'bg-primary-navy text-white'
                  : 'bg-muted text-foreground/70 hover:text-primary-navy'
              }`}
            >
              {course}
            </button>
          ))}
        </div>
      )}

      {courseYears.length > 1 && (
        <div className="flex gap-1 mb-4 flex-wrap">
          {courseYears.map(year => (
            <button
              key={year}
              onClick={() => { setActiveYear(year); setActiveRound(1) }}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeYear === year
                  ? 'bg-primary-navy text-white'
                  : 'bg-muted text-foreground/70 hover:text-primary-navy'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {courseYearRounds.length > 1 && (
        <div className="flex gap-1 mb-4 flex-wrap">
          {courseYearRounds.map(round => (
            <button
              key={round}
              onClick={() => setActiveRound(round)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeRound === round
                  ? 'bg-primary-navy text-white'
                  : 'bg-muted text-foreground/70 hover:text-primary-navy'
              }`}
            >
              Round {round}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-navy text-white">
                <th className="px-4 py-3 text-left font-semibold">Quota</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-right font-semibold">Opening Rank</th>
                <th className="px-4 py-3 text-right font-semibold">Closing Rank</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                  <td className="px-4 py-3 font-medium text-primary-navy">{r.quota}</td>
                  <td className="px-4 py-3 text-foreground/80">{CATEGORY_LABELS[r.category] || r.category}</td>
                  <td className="px-4 py-3 text-right text-foreground/80">{r.openingRank.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary-navy">{r.closingRank.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-foreground/60 py-4 text-center">No cutoff data for this selection.</p>
      )}
    </div>
  )
}
