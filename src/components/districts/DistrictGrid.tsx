import { DistrictCard } from './DistrictCard'

interface DistrictGridProps {
  districts: any[]
  stateSlug: string
}

export function DistrictGrid({ districts, stateSlug }: DistrictGridProps) {
  if (districts.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-foreground/60">
        No districts found
      </p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {districts.map((district) => (
        <DistrictCard
          key={district.id || district.slug}
          district={district}
          stateSlug={stateSlug}
        />
      ))}
    </div>
  )
}
