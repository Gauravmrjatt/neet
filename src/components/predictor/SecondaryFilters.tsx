'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { PredictionResult } from '@/lib/predictor/types'

interface SecondaryFiltersProps {
  results: PredictionResult[]
  onFilterChange: (filtered: PredictionResult[]) => void
}

type FilterTab = 'state' | 'course' | 'allottedCategory' | 'quota' | 'phase' | 'chance'

interface FilterState {
  state: string[]
  course: string[]
  allottedCategory: string[]
  quota: string[]
  phase: number[]
  chance: string[]
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'state', label: 'State' },
  { id: 'course', label: 'Course' },
  { id: 'allottedCategory', label: 'Allotted Category' },
  { id: 'quota', label: 'Quota' },
  { id: 'phase', label: 'Phase' },
  { id: 'chance', label: 'Chance' },
]

const CHANCE_OPTIONS = ['High', 'Good', 'Low']

export function SecondaryFilters({ results, onFilterChange }: SecondaryFiltersProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('state')
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    state: [],
    course: [],
    allottedCategory: [],
    quota: [],
    phase: [],
    chance: [],
  })
  const [stateSearch, setStateSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [pendingFilters, setPendingFilters] = useState<FilterState>(selectedFilters)

  const filterOptions = useMemo(() => {
    const stateSet = new Set<string>()
    const courseSet = new Set<string>()
    const allottedCategorySet = new Set<string>()
    const quotaSet = new Set<string>()
    const phaseSet = new Set<number>()

    for (const r of results) {
      stateSet.add(r.state)
      courseSet.add(r.course)
      allottedCategorySet.add(r.allottedCategory)
      quotaSet.add(r.quota)
      phaseSet.add(r.phase)
    }

    return {
      states: Array.from(stateSet).sort(),
      courses: Array.from(courseSet).sort(),
      allottedCategories: Array.from(allottedCategorySet).sort(),
      quotas: Array.from(quotaSet).sort((a, b) => {
        if (a === 'All India') return -1
        if (b === 'All India') return 1
        return a.localeCompare(b)
      }),
      phases: Array.from(phaseSet).sort((a, b) => a - b),
    }
  }, [results])

  const filteredStates = useMemo(() => {
    if (!stateSearch) return filterOptions.states
    const search = stateSearch.toLowerCase()
    return filterOptions.states.filter((s) => s.toLowerCase().includes(search))
  }, [filterOptions.states, stateSearch])

  useEffect(() => {
    setPendingFilters(selectedFilters)
  }, [selectedFilters])

  useEffect(() => {
    if (
      Object.values(selectedFilters).every((arr) => arr.length === 0)
    ) {
      onFilterChange(results)
      return
    }

    const filtered = results.filter((r) => {
      if (selectedFilters.state.length > 0 && !selectedFilters.state.includes(r.state)) return false
      if (selectedFilters.course.length > 0 && !selectedFilters.course.includes(r.course)) return false
      if (selectedFilters.allottedCategory.length > 0 && !selectedFilters.allottedCategory.includes(r.allottedCategory)) return false
      if (selectedFilters.quota.length > 0 && !selectedFilters.quota.includes(r.quota)) return false
      if (selectedFilters.phase.length > 0 && !selectedFilters.phase.includes(r.phase)) return false
      if (selectedFilters.chance.length > 0 && !selectedFilters.chance.includes(r.chance)) return false
      return true
    })

    onFilterChange(filtered)
  }, [selectedFilters, results, onFilterChange])

  const toggleFilter = useCallback((tab: FilterTab, value: string | number) => {
    setPendingFilters((prev) => {
      const arr = prev[tab] as (string | number)[]
      const newArr = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      return { ...prev, [tab]: newArr }
    })
  }, [])

  const toggleAll = useCallback((tab: FilterTab) => {
    setPendingFilters((prev) => {
      const options = tab === 'state' ? filterOptions.states
        : tab === 'course' ? filterOptions.courses
        : tab === 'allottedCategory' ? filterOptions.allottedCategories
        : tab === 'quota' ? filterOptions.quotas
        : tab === 'phase' ? filterOptions.phases
        : CHANCE_OPTIONS
      const current = prev[tab] as (string | number)[]
      const allSelected = current.length === options.length
      return { ...prev, [tab]: allSelected ? [] : [...options] }
    })
  }, [filterOptions])

  const clearAll = useCallback(() => {
    setPendingFilters({
      state: [],
      course: [],
      allottedCategory: [],
      quota: [],
      phase: [],
      chance: [],
    })
  }, [])

  const confirmSelections = useCallback(() => {
    setSelectedFilters(pendingFilters)
  }, [pendingFilters])

  const activeFilterCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0)
  }, [selectedFilters])

  const renderCheckboxItems = useCallback((
    options: (string | number)[],
    selected: (string | number)[],
    tab: FilterTab,
  ) => {
    return options.map((option) => {
      const value = String(option)
      const isSelected = selected.includes(option)
      return (
        <label
          key={value}
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
            isSelected ? 'bg-primary-navy/10 text-primary-navy' : 'hover:bg-muted/50',
          )}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleFilter(tab, option)}
            className="h-4 w-4 rounded border-gray-300 text-primary-navy focus:ring-primary-navy/20"
          />
          <span className="flex-1 truncate">{value}</span>
          {tab === 'phase' && <span className="text-xs text-muted-foreground">Phase</span>}
        </label>
      )
    })
  }, [toggleFilter])

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🔍</span>
          <span className="text-sm font-semibold text-primary-navy">Refine Your Results</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-primary-navy px-2 py-0.5 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-border">
          <div className="flex overflow-x-auto border-b border-border">
            {TABS.map((tab) => {
              const count = tab.id === 'state' ? pendingFilters.state.length
                : tab.id === 'course' ? pendingFilters.course.length
                : tab.id === 'allottedCategory' ? pendingFilters.allottedCategory.length
                : tab.id === 'quota' ? pendingFilters.quota.length
                : tab.id === 'phase' ? pendingFilters.phase.length
                : pendingFilters.chance.length
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'text-primary-navy after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-navy'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-1.5 rounded-full bg-primary-navy/10 px-1.5 py-0.5 text-xs font-bold text-primary-navy">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="p-4">
            {activeTab === 'state' && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search states..."
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      className="pl-9 text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAll('state')}
                    className="text-xs"
                  >
                    {pendingFilters.state.length === filterOptions.states.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-0.5">
                  {renderCheckboxItems(filteredStates, pendingFilters.state, 'state')}
                </div>
              </div>
            )}

            {activeTab === 'course' && (
              <div>
                <div className="mb-3 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAll('course')}
                    className="text-xs"
                  >
                    {pendingFilters.course.length === filterOptions.courses.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {renderCheckboxItems(filterOptions.courses, pendingFilters.course, 'course')}
                </div>
              </div>
            )}

            {activeTab === 'allottedCategory' && (
              <div>
                <div className="mb-3 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAll('allottedCategory')}
                    className="text-xs"
                  >
                    {pendingFilters.allottedCategory.length === filterOptions.allottedCategories.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {renderCheckboxItems(filterOptions.allottedCategories, pendingFilters.allottedCategory, 'allottedCategory')}
                </div>
              </div>
            )}

            {activeTab === 'quota' && (
              <div>
                <div className="mb-3 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAll('quota')}
                    className="text-xs"
                  >
                    {pendingFilters.quota.length === filterOptions.quotas.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {renderCheckboxItems(filterOptions.quotas, pendingFilters.quota, 'quota')}
                </div>
              </div>
            )}

            {activeTab === 'phase' && (
              <div>
                <div className="mb-3 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAll('phase')}
                    className="text-xs"
                  >
                    {pendingFilters.phase.length === filterOptions.phases.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {renderCheckboxItems(filterOptions.phases, pendingFilters.phase, 'phase')}
                </div>
              </div>
            )}

            {activeTab === 'chance' && (
              <div>
                <div className="mb-3 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAll('chance')}
                    className="text-xs"
                  >
                    {pendingFilters.chance.length === CHANCE_OPTIONS.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {renderCheckboxItems(CHANCE_OPTIONS, pendingFilters.chance, 'chance')}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-4">
              {activeFilterCount > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-muted-foreground"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear All
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={confirmSelections}
                className="bg-primary-navy text-white hover:bg-primary-navy-dark"
              >
                Confirm Selections
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
