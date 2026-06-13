import { ComparisonTable } from '@/components/shared/ComparisonTable'

interface CutoffTableProps {
  year?: number
  general?: number
  obc?: number
  sc?: number
  st?: number
  ews?: number
}

export function CutoffTable({ year = 2025, general, obc, sc, st, ews }: CutoffTableProps) {
  const hasData = general || obc || sc || st || ews
  if (!hasData) return null

  return (
    <ComparisonTable
      title={`Cutoff Ranks (${year})`}
      columns={[
        { label: 'Category' },
        { label: 'Closing Rank' },
      ]}
      rows={[
        ...(general ? [{ label: 'General', columnA: general.toString() }] : []),
        ...(obc ? [{ label: 'OBC', columnA: obc.toString() }] : []),
        ...(sc ? [{ label: 'SC', columnA: sc.toString() }] : []),
        ...(st ? [{ label: 'ST', columnA: st.toString() }] : []),
        ...(ews ? [{ label: 'EWS', columnA: ews.toString() }] : []),
      ]}
    />
  )
}
