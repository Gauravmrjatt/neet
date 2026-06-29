import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
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
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-primary-navy group-hover:text-button-gold-hover transition-colors">
              {district.name}
            </h3>
            {district.collegeCount !== undefined && district.collegeCount > 0 && (
              <Badge className="shrink-0" variant="secondary">
                {district.collegeCount} {district.collegeCount === 1 ? 'College' : 'Colleges'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {district.description && (
            <p className="text-sm text-foreground/70 line-clamp-2">
              {district.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
