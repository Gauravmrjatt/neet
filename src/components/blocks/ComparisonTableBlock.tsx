import { ComparisonTable } from '@/components/shared/ComparisonTable'

interface ComparisonRowData {
  label: string
  columnA?: string
  columnB?: string
  columnC?: string
}

interface ComparisonTableBlockProps {
  heading?: string
  rows?: ComparisonRowData[]
}

export function ComparisonTableBlock({ heading, rows }: ComparisonTableBlockProps) {
  if (!rows || rows.length === 0) return null

  const columns = [
    { label: 'Feature' },
    { label: 'Option A' },
    { label: 'Option B' },
    { label: 'Option C' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ComparisonTable title={heading} columns={columns} rows={rows} />
    </div>
  )
}
