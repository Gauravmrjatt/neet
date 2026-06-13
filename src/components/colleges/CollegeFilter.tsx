'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

const types = [
  { label: 'All', value: '' },
  { label: 'Government', value: 'government' },
  { label: 'Private', value: 'private' },
  { label: 'Deemed', value: 'deemed' },
  { label: 'Central', value: 'central' },
]

interface CollegeFilterProps {
  states?: { slug: string; name: string }[]
}

export function CollegeFilter({ states = [] }: CollegeFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentType = searchParams.get('type') || ''
  const currentState = searchParams.get('state') || ''

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8 items-center">
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <Button
            key={t.value}
            variant={currentType === t.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilter('type', t.value)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      {states.length > 0 && (
        <select
          value={currentState}
          onChange={(e) => handleFilter('state', e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
      )}
    </div>
  )
}
