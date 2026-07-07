import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { MediaImage } from './MediaImage'
import { Mail, Phone, Briefcase } from 'lucide-react'

interface CounselorCardProps {
  counselor: any
}

export const CounselorCard = memo(function CounselorCard({ counselor }: CounselorCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary-navy/10">
        <MediaImage media={counselor.image} fill />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div>
          <h4 className="text-sm font-semibold text-primary-navy">{counselor.name}</h4>
          <p className="text-xs text-muted-foreground">{counselor.designation}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {counselor.experience && (
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {counselor.experience}yrs
            </span>
          )}
          {counselor.email && (
            <a href={`mailto:${counselor.email}`} className="inline-flex items-center gap-1 hover:text-primary-navy hover:underline">
              <Mail className="h-3 w-3" />
              {counselor.email}
            </a>
          )}
          {counselor.phone && (
            <a href={`tel:${counselor.phone}`} className="inline-flex items-center gap-1 hover:text-primary-navy hover:underline">
              <Phone className="h-3 w-3" />
              {counselor.phone}
            </a>
          )}
        </div>
        {counselor.specializations?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {counselor.specializations.map((s: any) => (
              <Badge key={s.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                {typeof s.specialization === 'object' ? s.specialization?.name : s.specialization}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
