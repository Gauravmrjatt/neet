import Link from 'next/link'
import { getPricingCards } from '@/lib/queries/pricing'
import { PlansCarousel } from './PlansCarousel'

export async function PlansCoverflow() {
  const cards = await getPricingCards()

  const plans = cards.map((card: any) => {
    const planId = String(typeof card.id === 'object' ? card.id?.id || card.planName : (card.id || card.planName))
    return {
      id: planId,
      subtitle: String(card.subtitle || card.planName || ''),
      price: String(card.price || '').startsWith('₹') ? String(card.price) : `₹${card.price}`,
      originalPrice: card.originalPrice || undefined,
      discount: card.discount || undefined,
      badge: card.badge || undefined,
      colorScheme: card.colorScheme || 'standard',
      colleges: card.colleges || undefined,
      features: (card.features || []).map((f: any) => String(f?.feature || f || '')),
      ctaText: card.ctaText || 'Get Started',
      ctaLink: `/checkout/${planId}`,
    }
  })

  return (
    <section className="plans-coverflow-section py-8 sm:py-12 px-3 sm:px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-xl sm:text-3xl font-bold text-center text-[#062963] mb-1 tracking-tight">
          Choose Your Plan
        </h2>
        <p className="text-center text-xs sm:text-sm text-slate-600 mb-2 max-w-xl mx-auto lg:hidden">
          Trusted by 17,000+ students — swipe or use arrows to compare all options
        </p>
        <p className="text-center text-sm text-slate-600 mb-2 max-w-2xl mx-auto hidden lg:block">
          Trusted by 17,000+ students — compare all counselling options below
        </p>

        {plans.length > 0 ? (
          <PlansCarousel plans={plans} />
        ) : (
          <p className="text-center text-gray-500 py-10">
            No pricing plans configured yet. Add them from the admin panel.
          </p>
        )}

        <p className="text-center text-xs text-slate-500 mt-6">
          Full details on{' '}
          <Link href="/pricing" className="text-[#062963] underline hover:text-[#041d45] font-medium">
            our pricing page →
          </Link>
        </p>
      </div>
    </section>
  )
}
