import { Container } from '@/components/layout/Container'

interface PageHeroProps {
  title: string
  subtitle?: string
  badge?: string
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary-navy py-16 sm:py-20 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-button-gold blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white blur-3xl" />
      </div>
      <Container className="relative text-center">
        {badge && (
          <span className="mb-4 inline-block rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-white/90">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-white/70">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  )
}
