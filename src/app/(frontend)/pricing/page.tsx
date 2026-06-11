import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  Check,
  Users,
  BarChart3,
  Handshake,
  Shield,
  Award,
  Target,
  BookOpen,
  Headphones,
  Heart,
  Star,
  Zap,
  GraduationCap,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PricingCard } from '@/payload-types'
import { getPricingCards } from '@/lib/queries'
import { getHelpdeskItems } from '@/lib/queries'
import { getPricingPage } from '@/lib/queries/globals'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const iconMap: Record<string, LucideIcon> = {
  Users,
  BarChart3,
  Handshake,
  Shield,
  Award,
  Target,
  BookOpen,
  Headphones,
  Heart,
  Star,
  Zap,
  GraduationCap,
  TrendingUp,
  Clock,
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPricingPage()

  return generateSEOMetadata({
    title: data?.seo?.metaTitle || 'Pricing',
    description: data?.seo?.metaDescription || undefined,
    ogImage: data?.seo?.ogImage ? { url: (data.seo.ogImage as any)?.url } : undefined,
    keywords: data?.seo?.keywords?.map((k: any) => k.keyword).filter(Boolean) as string[] | undefined,
    noIndex: data?.seo?.noIndex ?? undefined,
    path: '/pricing',
  })
}

function PricingCardItem({ card }: { card: PricingCard }) {
  const isPopular = card.popular

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-8 transition-all duration-300',
        isPopular
          ? 'bg-primary-navy text-white border-primary-navy shadow-xl ring-2 ring-button-gold scale-[1.02]'
          : 'bg-card text-primary-navy border-border hover:border-primary-navy/40 hover:shadow-lg',
      )}
    >
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-button-gold px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-navy shadow-md">
          Most Popular
        </span>
      )}

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h3 className={cn('text-lg font-bold uppercase tracking-wide')}>{card.planName}</h3>
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
                'border-0 px-2.5 py-1 text-xs font-bold',
                isPopular
                  ? 'bg-button-gold text-primary-navy hover:bg-button-gold'
                  : 'bg-primary-navy/10 text-primary-navy hover:bg-primary-navy/10',
              )}
            >
              {card.discount}
            </Badge>
          )}
          {!card.discount && card.badge && (
            <Badge
              variant="outline"
              className={cn(
                'px-2.5 py-1 text-xs font-semibold',
                isPopular
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-primary-navy/20 bg-primary-navy/5 text-primary-navy',
              )}
            >
              {card.badge}
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-2 flex items-baseline gap-3">
        <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">{card.price}</span>
        {card.originalPrice && (
          <span className={cn('text-lg line-through', isPopular ? 'text-white/50' : 'text-muted-foreground/70')}>
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
            'mb-6 rounded-lg p-3 text-sm font-medium',
            isPopular ? 'bg-white/10' : 'bg-primary-navy/5',
          )}
        >
          <p
            className={cn(
              'mb-1 text-xs font-semibold uppercase tracking-wider',
              isPopular ? 'text-white/60' : 'text-primary-navy/70',
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
                isPopular ? 'text-white/90' : 'text-primary-navy',
              )}
            >
              <Check
                className="mr-2.5 mt-0.5 h-5 w-5 flex-shrink-0 text-button-gold"
                aria-hidden="true"
                strokeWidth={2.5}
              />
              <span>{f.feature}</span>
            </li>
          ))}
        </ul>
      )}

      {card.ctaText && card.id && (
        <Button
          asChild
          className={cn(
            'h-12 w-full rounded-md text-base font-bold transition-colors',
            isPopular
              ? 'bg-button-gold hover:bg-button-gold-hover text-primary-navy'
              : 'bg-primary-navy hover:bg-primary-navy-dark text-white',
          )}
        >
          <Link href={`/checkout/${card.id}`}>{card.ctaText}</Link>
        </Button>
      )}
    </div>
  )
}

export default async function PricingPage() {
  const [cms, cards, faqResult] = await Promise.all([
    getPricingPage(),
    getPricingCards(),
    getHelpdeskItems({ category: 'pricing' }).catch(() => ({ docs: [] })),
  ])
  const faqs = faqResult.docs

  const hero = cms?.hero
  const ctaBanner = cms?.ctaBanner
  const trustSection = cms?.trustSection
  const faqSection = cms?.faqSection
  const bottomCta = cms?.bottomCta

  return (
    <>
      <PageHero
        badge={hero?.badge || 'Pricing Plans'}
        title={hero?.title || 'Choose the Plan That Gets You In'}
        subtitle={hero?.subtitle || undefined}
      />

      {ctaBanner?.isEnabled !== false && (
        <div className="bg-primary-navy py-8 text-center -mt-px">
          <Container>
            {ctaBanner?.text && (
              <p className="mb-4 text-sm text-white/80">{ctaBanner.text}</p>
            )}
            {ctaBanner?.buttonText && (
              <Button
                asChild
                size="lg"
                className="bg-button-gold hover:bg-button-gold-hover text-primary-navy font-bold"
              >
                <Link href={ctaBanner?.buttonLink || '#plans'}>{ctaBanner.buttonText}</Link>
              </Button>
            )}
          </Container>
        </div>
      )}

      <Section id="plans" className="bg-navbar-bg/30">
        <Container>
          {cards.length > 0 ? (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 pt-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {cards.map((card) => (
                <PricingCardItem key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <p className="text-lg font-semibold text-primary-navy">No plans available yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Pricing plans will appear here once added from the admin panel.
              </p>
            </div>
          )}
        </Container>
      </Section>

      {trustSection?.items && trustSection.items.length > 0 && (
        <Section className="bg-background">
          <Container>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-navy mb-3 sm:mb-4 leading-tight tracking-tight">
                {trustSection.heading || 'Why Thousands Trust Us'}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trustSection.items.map((point: any) => {
                const Icon = iconMap[point.icon || 'Users']
                return (
                  <div
                    key={point.id}
                    className="glass-card rounded-2xl p-6 shadow-sm bg-card-bg border border-primary-navy/10 hover:shadow-md hover:-translate-y-0.5 hover:border-primary-navy/20 transition-all duration-200 ease-out group"
                  >
                    <span className="inline-flex w-12 h-12 rounded-2xl bg-button-gold/15 text-primary-navy items-center justify-center mb-4 group-hover:bg-button-gold/25 transition-colors duration-200 ease-out">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <h3 className="font-display font-bold text-primary-navy text-lg lg:text-xl mb-2 tracking-tight">
                      {point.title}
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">{point.description}</p>
                  </div>
                )
              })}
            </div>
          </Container>
        </Section>
      )}

      <Section className="bg-navbar-bg/30">
        <Container className="max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-navy mb-3 sm:mb-4 leading-tight tracking-tight">
              {faqSection?.heading || 'Frequently Asked Questions'}
            </h2>
          </div>
          {faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.id || i}
                  value={faq.id || `faq-${i}`}
                  className="glass-card rounded-2xl px-5 mb-3 last:mb-0 border border-primary-navy/10 shadow-sm"
                >
                  <AccordionTrigger className="text-base font-semibold text-primary-navy hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-foreground/70">
                    <RichText content={faq.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-sm text-foreground/60 py-8">
              No pricing FAQs available yet. Check back later.
            </p>
          )}
        </Container>
      </Section>

      {bottomCta?.isEnabled !== false && (
        <section className="bg-primary-navy py-16 text-white">
          <Container className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {bottomCta?.heading || 'Still not sure which plan?'}
            </h2>
            {bottomCta?.description && (
              <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-white/80">
                {bottomCta.description}
              </p>
            )}
            {bottomCta?.buttonText && (
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-md bg-button-gold hover:bg-button-gold-hover px-8 text-base font-bold text-primary-navy"
                >
                  <Link href={bottomCta?.buttonLink || '/contact'}>{bottomCta.buttonText}</Link>
                </Button>
              </div>
            )}
          </Container>
        </section>
      )}
    </>
  )
}
