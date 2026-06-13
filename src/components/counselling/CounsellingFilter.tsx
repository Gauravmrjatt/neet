'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  function handleFilter(category: string) {
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat) => (
        <Button
          key={cat.value}
          variant={currentCategory === cat.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilter(cat.value)}
          className="rounded-full"
        >
          {cat.label}
        </Button>
      ))}
    </div>
  )
}
