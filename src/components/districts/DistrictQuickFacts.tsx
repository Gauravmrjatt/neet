import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface DistrictQuickFactsProps {
  district: any
  state: any
  collegeCount: number
  govtCount?: number
  privateCount?: number
}

export function DistrictQuickFacts({ district, state, collegeCount, govtCount, privateCount }: DistrictQuickFactsProps) {
  const facts: { label: string; value: string | number }[] = [
    { label: 'State', value: state?.name || '-' },
    { label: 'District', value: district.name },
    { label: 'Total Colleges', value: collegeCount },
  ]

  if (govtCount !== undefined) {
    facts.push({ label: 'Government Colleges', value: govtCount })
  }

  if (privateCount !== undefined) {
    facts.push({ label: 'Private Colleges', value: privateCount })
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold text-primary-navy">Quick Facts</h3>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex justify-between gap-4">
              <dt className="text-sm text-foreground/70">{fact.label}</dt>
              <dd className="text-sm font-semibold text-primary-navy shrink-0">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
