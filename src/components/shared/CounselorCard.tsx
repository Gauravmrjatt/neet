import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MediaImage } from './MediaImage'
import { Mail, Phone, Briefcase } from 'lucide-react'

interface CounselorCardProps {
  counselor: any
}

export function CounselorCard({ counselor }: CounselorCardProps) {
  return (
    <Card className="h-full">
      <div className="relative aspect-square">
        <MediaImage media={counselor.image} fill />
      </div>
      <CardHeader>
        <h3 className="text-xl font-semibold">{counselor.name}</h3>
        <p className="text-muted-foreground">{counselor.designation}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {counselor.experience && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4" />
            <span>{counselor.experience} years experience</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {counselor.specializations?.map((spec: string) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
        {counselor.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${counselor.email}`} className="hover:underline">
              {counselor.email}
            </a>
          </div>
        )}
        {counselor.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            <a href={`tel:${counselor.phone}`} className="hover:underline">
              {counselor.phone}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
