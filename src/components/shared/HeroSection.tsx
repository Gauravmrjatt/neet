import Link from 'next/link'
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
    <section className="bg-gradient-to-r from-gray-50 to-gray-100 pt-5 pb-10 px-4 text-center">
      <p
        className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full mb-3 tracking-wide uppercase"
        style={{
          background: 'linear-gradient(135deg, rgba(6,41,99,0.1) 0%, rgba(255,255,255,0.6) 50%, rgba(6,41,99,0.1) 100%)',
          color: '#062963',
          border: '1.5px solid rgba(6,41,99,0.25)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {badge}
      </p>

      <h2 className="text-2xl sm:text-4xl font-bold text-[#062963] mb-3">
        {heading}
        <span className="text-green-700">
          {' '}from (
          <Link href={secondaryCtaLink} className="underline decoration-green-600 hover:text-green-900">
            {priceText}
          </Link>
          )
        </span>
      </h2>

      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-5 max-w-xl mx-auto">
        {description}
      </p>

      <p className="text-xs sm:text-sm text-gray-600 mb-4">
        {hindiDescription}
      </p>

      <div className="flex flex-row gap-4 justify-center">
        <Button asChild size="lg" className="bg-[#FBAC1A] hover:bg-[#e09b18] text-[#062963] font-semibold shadow-sm">
          <Link href={primaryCtaLink}>{primaryCtaText}</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="bg-[#062963] hover:bg-[#041d45] text-white border-[#062963] font-semibold shadow-sm">
          <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
        </Button>
      </div>
    </section>
  )
}
