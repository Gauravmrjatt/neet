import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { Check } from 'lucide-react'

interface PricingFeature {
  feature?: string | null
  id?: string | null
}

interface PricingCardData {
  planName?: string | null
  price?: number | null
  features?: PricingFeature[] | null
  popular?: boolean | null
  ctaText?: string | null
  ctaLink?: string | null
  id?: string | null
}

interface PricingBlockProps {
  title?: string | null
  subtitle?: string | null
  pricingCards?: PricingCardData[] | null
}

export function PricingBlock({ title, subtitle, pricingCards }: PricingBlockProps) {
  if (!pricingCards?.length) return null

  return (
    <Section>
      <Container>
        {title && (
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pricingCards.map((card, index) => (
            <div
              key={card.id || index}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md',
                card.popular
                  ? 'border-primary/30 ring-2 ring-primary/40 shadow-md'
                  : 'border-primary/10'
              )}
            >
              {card.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-button-gold px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
                  Popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold tracking-tight">{card.planName}</h3>
              {card.price != null && (
                <p className="mt-4 font-display text-4xl font-bold text-primary">
                  {formatCurrency(card.price)}
                </p>
              )}
              {card.features && card.features.length > 0 && (
                <ul className="mt-6 space-y-3 flex-1">
                  {card.features.map((f, i) => (
                    <li key={f.id || i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </span>
                      <span className="leading-relaxed">{f.feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              {card.ctaText && card.ctaLink && (
                <div className="mt-8">
                  <Link
                    href={card.ctaLink}
                    className={cn(
                      'inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ease-out active:scale-[0.98]',
                      card.popular
                        ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-navy-dark hover:shadow-md'
                        : 'border-2 border-primary/15 bg-background text-foreground hover:border-primary/40 hover:bg-primary/5'
                    )}
                  >
                    {card.ctaText}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
