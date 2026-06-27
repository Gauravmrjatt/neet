'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const categories = [
  { label: 'All', value: '' },
  { label: 'NEET UG', value: 'ug-counselling' },
  { label: 'NEET PG', value: 'pg-counselling' },
  { label: 'State', value: 'state-counselling' },
  { label: 'MBBS Abroad', value: 'abroad' },
  { label: 'Guides', value: 'guide' },
]

export function CounsellingFilter() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  function hrefFor(catValue: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    if (catValue) {
      params.set('category', catValue)
    } else {
      params.delete('category')
    }
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat) => (
        <Link key={cat.value} href={hrefFor(cat.value)} scroll={false}>
          <Button
            variant={currentCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
          >
            {cat.label}
          </Button>
        </Link>
      ))}
    </div>
  )
}
