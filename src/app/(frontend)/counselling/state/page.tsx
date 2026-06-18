import type { Metadata } from 'next'
import Link from 'next/link'
import { getStatesWithCounselling } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getPageSeoByPath } from '@/lib/page-seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { StateGrid } from '@/components/counselling/StateGrid'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/counselling/state')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'State-Wise NEET Counselling 2026 — Complete Guide for All States',
    description: pageSeo?.metaDescription || 'Get state-specific NEET counselling information for all 28 states and 8 UTs. Find counselling authorities, important dates, eligibility criteria, and document requirements.',
    path: '/counselling/state',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function StateCounsellingPage() {
  const states = await getStatesWithCounselling()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const pageSeo = await getPageSeoByPath('/counselling/state')

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'State-Wise Counselling', url: `${siteUrl}/counselling/state` },
      ])} />
      {states.length > 0 && <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageSeo?.metaTitle || 'State-Wise NEET Counselling 2026',
        description: pageSeo?.metaDescription,
        hasPart: generateItemListSchema(states.map((s: any) => ({
          url: `${siteUrl}/counselling/state/${s.slug}`,
          name: `${s.name} NEET Counselling 2026`,
        }))).itemListElement,
      }} />}
      <PageHero
        badge="All States"
        title="State-Wise NEET Counselling 2026"
        subtitle="Comprehensive counselling information for every Indian state. Find state-specific authorities, dates, eligibility, and document requirements."
      />
      <Section tone="cream">
        <Container className="max-w-3xl text-center">
          <p className="text-foreground/80 leading-relaxed">
            Each Indian state has its own NEET counselling authority, schedule, reservation policy, and seat matrix. Find detailed state-wise information — including official websites, counselling procedures, important dates, document requirements, and medical college lists — for all 28 states and union territories.
          </p>
        </Container>
      </Section>
      <Section tone="cream" className="pt-0">
        <Container>
          <StateGrid states={states} />
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="rounded-xl bg-gradient-to-br from-primary-navy to-primary-navy-dark p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Don&apos;t See Your State?</h2>
            <p className="text-white/80 mb-6 max-w-2xl">
              We are adding state-specific guides regularly. Contact our counsellors for personalised guidance about your state&apos;s counselling process.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-button-gold px-6 py-3 font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
            >
              Get Personalised Help
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
