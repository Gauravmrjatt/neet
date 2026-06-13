import { StateCard } from './StateCard'

interface StateGridProps {
  states: any[]
}

export function StateGrid({ states }: StateGridProps) {
  if (!states || states.length === 0) {
    return (
      <div className="text-center py-12 text-foreground/60">
        No states available yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {states.map((state) => (
        <StateCard key={state.id} state={state} />
      ))}
    </div>
  )
}
