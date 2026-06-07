import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

export default function LiveCounsellingLoading() {
  return (
    <Section className="bg-navbar-bg/30">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-6">
              <div className="h-5 w-2/3 rounded bg-muted" />
              <div className="mt-4 space-y-2.5">
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-4 w-1/4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
