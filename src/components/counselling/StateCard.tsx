import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface StateCardProps {
  state: any
}

export function StateCard({ state }: StateCardProps) {
  return (
    <Link href={`/counselling/state/${state.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow group hover:-translate-y-0.5">
        <CardHeader>
          <h3 className="text-lg font-bold text-primary-navy group-hover:text-button-gold-hover transition-colors">
            {state.name}
          </h3>
        </CardHeader>
        <CardContent>
          {state.counsellingAuthority && (
            <p className="text-sm text-foreground/70 mb-2">
              <span className="font-medium">Authority:</span> {state.counsellingAuthority}
            </p>
          )}
          {state.counsellingCount !== undefined && (
            <p className="text-sm text-foreground/70">
              {state.counsellingCount > 0 ? (
                <><span className="font-medium">{state.counsellingCount}</span> guides available</>
              ) : (
                'Coming soon'
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
