import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface DistrictCardProps {
  district: any
  stateSlug: string
}

export function DistrictCard({ district, stateSlug }: DistrictCardProps) {
  return (
    <Link href={`/states/${stateSlug}/${district.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow group hover:-translate-y-0.5">
        <CardHeader>
          <h3 className="text-lg font-bold text-primary-navy group-hover:text-button-gold-hover transition-colors">
            {district.name}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/70">
              {district.collegeCount > 0
                ? `${district.collegeCount} medical college${district.collegeCount !== 1 ? 's' : ''}`
                : 'No medical colleges'}
            </span>
            <span className="text-primary-navy group-hover:text-button-gold-hover text-xs font-medium transition-colors">
              View Guide →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
