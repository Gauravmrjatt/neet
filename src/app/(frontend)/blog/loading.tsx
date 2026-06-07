import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

export default function BlogLoading() {
  return (
    <Section className="bg-navbar-bg/30">
      <Container>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="aspect-video bg-muted" />
              <div className="space-y-3 p-6">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
