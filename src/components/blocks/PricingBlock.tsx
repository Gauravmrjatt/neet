import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

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
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingCards.map((card, index) => (
            <div
              key={card.id || index}
              className={cn(
                'relative rounded-lg border p-8',
                card.popular && 'border-primary shadow-lg ring-2 ring-primary'
              )}
            >
              {card.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Popular
                </span>
              )}
              <h3 className="text-xl font-semibold">{card.planName}</h3>
              {card.price != null && (
                <p className="mt-4 text-4xl font-bold">{formatCurrency(card.price)}</p>
              )}
              {card.features && card.features.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {card.features.map((f, i) => (
                    <li key={f.id || i} className="flex items-center text-sm text-muted-foreground">
                      <svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f.feature}
                    </li>
                  ))}
                </ul>
              )}
              {card.ctaText && card.ctaLink && (
                <div className="mt-8">
                  <Link
                    href={card.ctaLink}
                    className={cn(
                      'inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold',
                      card.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border bg-background hover:bg-accent'
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
