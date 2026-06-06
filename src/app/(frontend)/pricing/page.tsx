import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { PricingCard } from '@/payload-types'
import { getPricingCards } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Pricing',
    description:
      'Transparent pricing for NEET & JOSAA counselling plans. Choose the plan that fits your admission journey.',
    path: '/pricing',
  })
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <span className={cn('mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-button-gold/20', className)}>
      <Check className="h-3 w-3 text-button-gold" strokeWidth={3} />
    </span>
  )
}

function PricingCardItem({ card }: { card: PricingCard }) {
  const isPopular = card.popular

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-3xl border p-8 transition-all duration-300 ease-out',
        isPopular
          ? 'bg-primary text-white border-primary shadow-xl ring-2 ring-button-gold scale-[1.02]'
          : 'bg-white text-foreground border-primary/10 hover:border-primary/30 hover:shadow-md hover:-translate-y-1',
      )}
    >
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-button-gold px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
          Most Popular
        </span>
      )}

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold uppercase tracking-wide">{card.planName}</h3>
          {card.subtitle && (
            <p className={cn('mt-1 text-sm leading-snug', isPopular ? 'text-white/70' : 'text-muted-foreground')}>
              {card.subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {card.discount && (
            <Badge
              className={cn(
                'border-0 px-3 py-1 text-xs font-bold',
                isPopular
                  ? 'bg-button-gold text-primary hover:bg-button-gold'
                  : 'bg-primary/10 text-primary hover:bg-primary/10',
              )}
            >
              {card.discount}
            </Badge>
          )}
          {!card.discount && card.badge && (
            <Badge
              variant="outline"
              className={cn(
                'px-3 py-1 text-xs font-semibold',
                isPopular
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-primary/20 bg-primary/5 text-primary',
              )}
            >
              {card.badge}
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{card.price}</span>
        {card.originalPrice && (
          <span className={cn('text-lg line-through', isPopular ? 'text-white/50' : 'text-muted-foreground')}>
            {card.originalPrice}
          </span>
        )}
      </div>

      {card.description && (
        <p className={cn('mb-6 text-sm leading-relaxed', isPopular ? 'text-white/80' : 'text-muted-foreground')}>
          {card.description}
        </p>
      )}

      {card.colleges && (
        <div
          className={cn(
            'mb-6 rounded-xl p-3 text-sm font-medium',
            isPopular ? 'bg-white/10' : 'bg-primary/5',
          )}
        >
          <p
            className={cn(
              'mb-1 text-xs font-semibold uppercase tracking-wider',
              isPopular ? 'text-white/60' : 'text-primary/70',
            )}
          >
            Colleges covered
          </p>
          <p>{card.colleges}</p>
        </div>
      )}

      {card.features && card.features.length > 0 && (
        <ul className="mb-8 flex-1 space-y-2.5">
          {card.features.map((f, i) => (
            <li
              key={f.id ?? i}
              className={cn(
                'flex items-start text-sm leading-relaxed',
                isPopular ? 'text-white/90' : 'text-foreground',
              )}
            >
              <CheckIcon />
              <span>{f.feature}</span>
            </li>
          ))}
        </ul>
      )}

      {card.ctaText && card.id && (
        <Button
          asChild
          size="lg"
          className={cn(
            'h-12 w-full text-base font-bold',
            isPopular
              ? 'bg-button-gold hover:bg-button-gold-hover text-primary'
              : 'bg-primary hover:bg-primary-navy-dark text-primary-foreground',
          )}
        >
          <Link href={`/checkout/${card.id}`}>{card.ctaText}</Link>
        </Button>
      )}
    </div>
  )
}

const TRUST_POINTS = [
  {
    title: 'Expert Counsellors',
    description: 'Personal guidance from IIT/NIT alumni with 500+ successful admissions.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
  },
  {
    title: 'Data-Driven Insights',
    description: 'Real cutoffs, previous year trends & seat matrices updated for 2025-26.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
  },
  {
    title: 'End-to-End Support',
    description: 'From choice filling to seat allotment — we are with you at every step.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
  {
    title: 'Money-Back Guarantee',
    description: 'Not satisfied? Get a full refund within 7 days, no questions asked.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    ),
  },
]

const FAQS = [
  {
    q: 'Can I switch plans later?',
    a: 'Yes. You can upgrade to a higher plan at any time and pay the difference. Downgrades take effect at the next billing cycle.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Every plan comes with a 7-day money-back guarantee. If you are not satisfied, contact support for a full refund.',
  },
  {
    q: 'Are the college cutoffs updated?',
    a: 'All cutoffs, seat matrices and college data are refreshed before every counselling round for the current academic year.',
  },
  {
    q: 'Is one-on-one counselling included?',
    a: 'The Premium and Complete plans include scheduled one-on-one sessions with senior counsellors. Basic plans have access to group sessions.',
  },
]

export default async function PricingPage() {
  const cards = await getPricingCards()

  return (
    <>
      <PageHero
        badge="Pricing Plans"
        title="Choose the Plan That Gets You In"
        subtitle="Transparent pricing. No hidden fees. Pick the counselling plan that matches your ambition — from single-round guidance to full admission coverage."
      />
      <div className="bg-primary py-10 text-center -mt-px">
        <Container>
          <Button
            asChild
            size="lg"
            variant="gold"
          >
            <Link href="#plans">View Plans</Link>
          </Button>
        </Container>
      </div>

      <Section id="plans" className="bg-navbar-bg/30">
        <Container>
          {cards.length > 0 ? (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 pt-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {cards.map((card) => (
                <PricingCardItem key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-primary/20 bg-white p-12 text-center">
              <p className="font-display text-lg font-semibold text-primary">No plans available yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Pricing plans will appear here once added from the admin panel.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Why Thousands Trust Us
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Built by IIT alumni. Battle-tested across 5 counselling seasons.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((point) => (
              <div
                key={point.title}
                className="group rounded-2xl border border-primary/10 bg-white p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {point.icon}
                  </svg>
                </div>
                <h3 className="font-display text-base font-bold text-primary">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-navbar-bg/30">
        <Container className="max-w-3xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-primary/10 bg-white p-5 transition-all duration-200 ease-out open:border-primary/30 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-primary">
                  <span>{faq.q}</span>
                  <span className="ml-4 text-primary transition-transform duration-300 group-open:rotate-45">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <section className="relative overflow-hidden bg-primary py-20 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-button-gold/20 blur-3xl" />
        <Container className="relative z-10 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Still not sure which plan?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
            Book a free 15-minute call with our counsellors and we will help you pick the right
            plan.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              variant="gold"
            >
              <Link href="/contact">Book a Free Call</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
