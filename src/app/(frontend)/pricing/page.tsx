import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
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
import { getPricingCards } from '@/lib/queries'
import { getHelpdeskItems } from '@/lib/queries'
import { getPricingPage } from '@/lib/queries/globals'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateServiceSchema, generateFAQSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { PlansCarousel } from '@/components/shared/PlansCarousel'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export const revalidate = 3600

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
    description: data?.seo?.metaDescription || 'Compare NEET counselling plans starting from ₹399. Get college prediction, expert guidance, and personalised counselling from experienced NEET counsellors.',
    ogImage: data?.seo?.ogImage ? { url: (data.seo.ogImage as any)?.url } : undefined,
    keywords: data?.seo?.keywords?.map((k: any) => k.keyword).filter(Boolean) as string[] | undefined,
    noIndex: data?.seo?.noIndex ?? undefined,
    path: '/pricing',
  })
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Pricing', url: `${siteUrl}/pricing` },
      ])} />
      <JsonLd data={generateServiceSchema({
        serviceType: 'NEET Counselling',
        providerName: 'NEET Counselling',
        offers: cards.map((card) => ({
          name: card.planName || '',
          description: card.description || undefined,
          price: card.price ? card.price.replace(/[^0-9,]/g, '') : undefined,
        })),
      })} />
      {faqs.length > 0 && <JsonLd data={generateFAQSchema(faqs.map((f) => ({ question: f.question, answer: typeof f.answer === 'string' ? f.answer : '' })))} />}
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
            <PlansCarousel
              plans={cards.map((card) => ({
                id: String(card.id),
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
                ctaLink: `/checkout/${card.id}`,
                popular: card.popular || false,
              }))}
            />
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
