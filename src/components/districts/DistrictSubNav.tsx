import Link from 'next/link'

interface DistrictSubNavProps {
  activeType: string
  stateSlug: string
  districtSlug: string
}

const TABS = [
  { label: 'Counselling', value: 'neet-counselling' },
  { label: 'MBBS Admission', value: 'mbbs-admission' },
  { label: 'Cutoff', value: 'cutoff' },
  { label: 'Fees', value: 'fees' },
  { label: 'Documents', value: 'documents-required' },
  { label: 'Choice Filling', value: 'choice-filling' },
  { label: 'Seat Matrix', value: 'seat-matrix' },
  { label: 'All Colleges', value: 'all-medical-colleges' },
  { label: 'Govt Colleges', value: 'government-medical-colleges' },
  { label: 'Private Colleges', value: 'private-medical-colleges' },
  { label: 'MCC', value: 'mcc-counselling' },
  { label: 'State', value: 'state-counselling' },
  { label: 'Expected Cutoff', value: 'expected-cutoff' },
  { label: 'Dates', value: 'important-dates' },
  { label: 'FAQ', value: 'faq' },
  { label: 'News', value: 'news' },
  { label: 'Updates', value: 'updates' },
]

export function DistrictSubNav({ activeType, stateSlug, districtSlug }: DistrictSubNavProps) {
  return (
    <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeType === tab.value
            return (
              <Link
                key={tab.value}
                href={`/states/${stateSlug}/${districtSlug}/${tab.value}`}
                className={`shrink-0 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-button-gold text-primary-navy'
                    : 'bg-muted text-foreground/70 hover:text-primary-navy hover:bg-muted/80'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
