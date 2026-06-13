import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const typeLabels: Record<string, string> = {
  government: 'Government',
  private: 'Private',
  deemed: 'Deemed',
  central: 'Central',
}

const typeColors: Record<string, string> = {
  government: 'bg-green-100 text-green-800',
  private: 'bg-blue-100 text-blue-800',
  deemed: 'bg-purple-100 text-purple-800',
  central: 'bg-orange-100 text-orange-800',
}

interface CollegeCardProps {
  college: any
}

export function CollegeCard({ college }: CollegeCardProps) {
  const stateName = typeof college.state === 'object' ? college.state?.name : ''

  return (
    <Link href={`/colleges/${college.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow group hover:-translate-y-0.5">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-primary-navy group-hover:text-button-gold-hover transition-colors">
              {college.name}
            </h3>
            {college.type && (
              <Badge className={`shrink-0 ${typeColors[college.type] || ''}`}>
                {typeLabels[college.type] || college.type}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-foreground/70">
            {stateName && (
              <p><span className="font-medium text-foreground/90">State:</span> {stateName}</p>
            )}
            {college.city && (
              <p><span className="font-medium text-foreground/90">City:</span> {college.city}</p>
            )}
            {college.feeStructure?.totalCourseFee && (
              <p><span className="font-medium text-foreground/90">Fee:</span> {college.feeStructure.totalCourseFee}</p>
            )}
            {college.cutoffs?.general && (
              <p><span className="font-medium text-foreground/90">Cutoff (Gen):</span> {college.cutoffs.general}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
