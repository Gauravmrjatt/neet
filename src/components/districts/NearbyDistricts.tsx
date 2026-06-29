import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface NearbyDistrictsProps {
  districts: any[]
  stateSlug: string
}

export function NearbyDistricts({ districts, stateSlug }: NearbyDistrictsProps) {
  if (districts.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold text-primary-navy">Nearby Districts</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {districts.map((district) => (
            <li key={district.id || district.slug}>
              <Link
                href={`/states/${stateSlug}/${district.slug}`}
                className="text-sm text-foreground/70 hover:text-button-gold-hover transition-colors"
              >
                {district.name}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
