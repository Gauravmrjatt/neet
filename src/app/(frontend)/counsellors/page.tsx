import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCounselors, getSpecializations } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getPageSeoByPath } from '@/lib/page-seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { CounselorFilter } from '@/components/counsellors/CounselorFilter'
import { Card, CardContent } from '@/components/ui/card'
import { INDIA_CITIES } from '@/lib/cities'

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/counsellors')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'Best NEET Counsellors in India — MBBS, BDS Admission Guidance 2026',
    description: pageSeo?.metaDescription || 'Find experienced NEET counsellors for MBBS, BDS, and medical college admission guidance. Expert counsellors in Mumbai, Delhi, Bangalore, and across India. Book a free consultation.',
    path: '/counsellors',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function CounsellorsPage() {
  const { docs: counselors } = await getCounselors()
  const specializations = await getSpecializations()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const pageSeo = await getPageSeoByPath('/counsellors')

  const counselorData = counselors.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    designation: c.designation,
    image: c.image,
    specializations: c.specializations,
    experience: c.experience,
  }))

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'Counsellors', url: `${siteUrl}/counsellors` },
      ])} />
      <PageHero
        title="Our Counsellors"
        subtitle="Find experienced NEET counsellors to guide your journey to a top medical college."
      />
      <Section className="bg-navbar-bg/30">
        <Container>
          <CounselorFilter counselors={counselorData} specializations={specializations} />
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-primary-navy mb-4">Find Counsellors in Your City</h2>
            <div className="flex flex-wrap gap-2">
              {INDIA_CITIES.slice(0, 10).map((city) => (
                <Link
                  key={city.slug}
                  href={`/counsellors/${city.slug}`}
                  className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary-navy hover:bg-muted transition-colors"
                >
                  {city.name}
                </Link>
              ))}
              <Link
                href="/counsellors/mumbai"
                className="inline-flex items-center rounded-full bg-primary-navy px-4 py-2 text-sm font-medium text-white hover:bg-primary-navy-dark transition-colors"
              >
                View All Cities →
              </Link>
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-primary-navy mb-3">Counselling Guides</h3>
                <p className="text-sm text-foreground/70 mb-4">Step-by-step guides for NEET counselling, AIQ, and state quota processes.</p>
                <Link href="/counselling" className="text-sm font-semibold text-primary-navy hover:text-button-gold-hover transition-colors">
                  Explore Guides →
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-primary-navy mb-3">State-Wise Info</h3>
                <p className="text-sm text-foreground/70 mb-4">State-specific counselling details, authorities, dates, and eligibility.</p>
                <Link href="/counselling/state" className="text-sm font-semibold text-primary-navy hover:text-button-gold-hover transition-colors">
                  View States →
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-primary-navy mb-3">Medical Colleges</h3>
                <p className="text-sm text-foreground/70 mb-4">Browse NMC-approved medical colleges with fees, cutoffs, and seats.</p>
                <Link href="/colleges" className="text-sm font-semibold text-primary-navy hover:text-button-gold-hover transition-colors">
                  Browse Colleges →
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
