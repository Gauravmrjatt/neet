import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPayloadClient } from '@/lib/payload'

export async function HeroSection() {
  const payload = await getPayloadClient()
  let settings: any = {}
  try {
    settings = await payload.findGlobal({ slug: 'site-settings' })
  } catch {}

  const hero = settings?.hero || {}
  const badge = hero.badge || "🇮🇳 India's Best NEET College Predictor"
  const heading = hero.heading || 'NEET Counselling 2026 — Predict Your College & Start Expert Guidance'
  const priceText = hero.priceText || '₹2399/-'
  const description = hero.description || "NEET Counselling — India's trusted NEET counselling team for NEET counselling 2026: NEET rank-based college predictor, round-wise predictions, JOSAA & CSAB choice strategy, and counselor support for students and parents."
  const hindiDescription = hero.hindiDescription || 'नीट काउंसलिंग — read free JOSAA counseling guides on our blog.'
  const primaryCtaText = hero.primaryCtaText || 'Predict My College'
  const primaryCtaLink = hero.primaryCtaLink || '/counsellors'
  const secondaryCtaText = hero.secondaryCtaText || 'View Plans'
  const secondaryCtaLink = hero.secondaryCtaLink || '/pricing'

  return (
    <section className="relative gov-dots pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 overflow-hidden">
      {/* Soft decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-button-gold/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-[#062963]/8 blur-3xl"
      />

      <div className="relative max-w-5xl mx-auto text-center">
        <p
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2 rounded-full mb-6 tracking-wide uppercase shadow-sm transition-all duration-200 ease-out"
          style={{
            background:
              'linear-gradient(135deg, rgba(251,172,26,0.12) 0%, rgba(255,255,255,0.85) 50%, rgba(6,41,99,0.08) 100%)',
            color: '#062963',
            border: '1.5px solid rgba(6,41,99,0.18)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-button-gold" aria-hidden="true" />
          {badge}
        </p>

        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#062963] mb-5 tracking-tight leading-[1.1]">
          {heading}
          <span className="block mt-3 text-button-gold text-xl sm:text-2xl lg:text-3xl font-semibold">
            starting from{' '}
            <Link
              href={secondaryCtaLink}
              className="underline decoration-button-gold decoration-2 underline-offset-4 hover:text-button-gold-hover transition-colors duration-200 ease-out"
            >
              {priceText}
            </Link>
          </span>
        </h1>

        <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3 max-w-2xl mx-auto">
          {description}
        </p>

        <p className="text-xs sm:text-sm text-foreground/60 mb-8 max-w-2xl mx-auto italic">
          {hindiDescription}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-button-gold hover:bg-button-gold-hover text-[#062963] font-bold shadow-md hover:shadow-lg transition-all duration-200 ease-out px-7 py-6 text-base"
          >
            <Link href={primaryCtaLink} className="flex items-center gap-2">
              {primaryCtaText}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-2xl bg-[#062963] hover:bg-primary-navy-dark text-white border-[#062963] font-bold shadow-md hover:shadow-lg transition-all duration-200 ease-out px-7 py-6 text-base"
          >
            <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
