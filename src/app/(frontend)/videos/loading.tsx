import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

export default function VideosLoading() {
  return (
    <Section className="bg-navbar-bg/30">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="aspect-video bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
