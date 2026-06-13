interface ComparisonRow {
  label: string
  columnA?: string
  columnB?: string
  columnC?: string
}

interface ComparisonTableProps {
  title?: string
  columns?: { label: string }[]
  rows: ComparisonRow[]
}

export function ComparisonTable({ title, columns, rows }: ComparisonTableProps) {
  if (!rows || rows.length === 0) return null

  const hasColumnA = rows.some((r) => r.columnA)
  const hasColumnB = rows.some((r) => r.columnB)
  const hasColumnC = rows.some((r) => r.columnC)

  return (
    <section className="py-8">
      {title && (
        <h2 className="text-2xl font-bold text-primary-navy mb-6">{title}</h2>
      )}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          {columns && (
            <thead>
              <tr className="bg-primary-navy text-white">
                <th className="px-4 py-3 text-left font-semibold">{columns[0]?.label || ''}</th>
                {hasColumnA && <th className="px-4 py-3 text-left font-semibold">{columns[1]?.label || 'Option A'}</th>}
                {hasColumnB && <th className="px-4 py-3 text-left font-semibold">{columns[2]?.label || 'Option B'}</th>}
                {hasColumnC && <th className="px-4 py-3 text-left font-semibold">{columns[3]?.label || 'Option C'}</th>}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                <td className="px-4 py-3 font-medium text-primary-navy">{row.label}</td>
                {hasColumnA && <td className="px-4 py-3 text-foreground/80">{row.columnA}</td>}
                {hasColumnB && <td className="px-4 py-3 text-foreground/80">{row.columnB}</td>}
                {hasColumnC && <td className="px-4 py-3 text-foreground/80">{row.columnC}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
