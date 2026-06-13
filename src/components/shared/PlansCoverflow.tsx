import Link from 'next/link'
import { getPricingCards } from '@/lib/queries/pricing'
import { getSiteSettings } from '@/lib/queries/globals'
import { PlansCarousel } from './PlansCarousel'
import { Sparkles } from 'lucide-react'

export async function PlansCoverflow() {
  const [cards, settings] = await Promise.all([
    getPricingCards(),
    getSiteSettings().catch(() => ({ stats: { students: '17,000+' } })),
  ])
  const studentCount = (settings as any)?.stats?.students || '17,000+'

  const plans = cards.map((card: any) => {
    const planId = String(typeof card.id === 'object' ? card.id?.id || card.planName : (card.id || card.planName))
    return {
      id: planId,
      planName: String(card.planName || ''),
      subtitle: String(card.subtitle || ''),
      price: String(card.price || '').startsWith('₹') ? String(card.price) : `₹${card.price}`,
      originalPrice: card.originalPrice || undefined,
      discount: card.discount || undefined,
      badge: card.badge || undefined,
      colorScheme: card.colorScheme || 'standard',
      colleges: card.colleges || undefined,
      description: card.description || undefined,
      features: (card.features || []).map((f: any) => String(f?.feature || f || '')),
      ctaText: card.ctaText || 'Get Started',
      ctaLink: `/checkout/${planId}`,
    }
  })

  return (
    <section
      aria-label="Counselling plans"
      className="plans-coverflow-section relative py-14 sm:py-20 px-3 sm:px-4 overflow-hidden gov-dots"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <p className="glass-pill inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3 h-3 text-button-gold" aria-hidden="true" />
            Plans
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-navy mb-2 tracking-tight">
            Choose Your Plan
          </h2>
          <p className="text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto">
            Trusted by{' '}
            <span className="text-primary-navy font-bold">{studentCount}</span>
            {' '}students — compare all counselling options below
          </p>
        </div>

        {plans.length > 0 ? (
          <PlansCarousel plans={plans} />
        ) : (
          <p className="text-center text-foreground/60 py-10">
            No pricing plans configured yet. Add them from the admin panel.
          </p>
        )}

        <p className="text-center text-xs sm:text-sm text-foreground/60 mt-8">
          explore more on{' '}
          <Link
            href="/pricing"
            className="text-primary-navy underline decoration-button-gold decoration-2 underline-offset-4 hover:text-button-gold-hover font-semibold transition-colors duration-200 ease-out"
          >
            our pricing page →
          </Link>
        </p>
      </div>
    </section>
  )
}
