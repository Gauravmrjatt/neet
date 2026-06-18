import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCounselors } from '@/lib/queries'
import { getCityBySlug, INDIA_CITIES } from '@/lib/cities'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getPageSeoByPath } from '@/lib/page-seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { CounselorCard } from '@/components/shared/CounselorCard'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return INDIA_CITIES.map((city) => ({ city: city.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return { title: 'Not Found' }
  const pageSeo = await getPageSeoByPath('/counsellors')
  return generateSEOMetadata({
    title: `Best NEET Counsellors in ${city.name} 2026 — MBBS Guidance`,
    description: `Find the best NEET counsellors in ${city.name} for 2026 admissions. Get expert guidance for MBBS, BDS, and medical college admission in ${city.name}, ${city.state}. Book a free consultation.`,
    path: `/counsellors/${city.slug}`,
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function CityCounsellorsPage({ params }: PageProps) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  const { docs: counselors } = await getCounselors()
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
      <JsonLd data={generateLocalBusinessSchema({
        name: `NEET Counselling ${city.name}`,
        addressLocality: city.name,
        addressRegion: city.state,
        url: `${siteUrl}/counsellors/${city.slug}`,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'Counsellors', url: `${siteUrl}/counsellors` },
        { name: city.name, url: `${siteUrl}/counsellors/${city.slug}` },
      ])} />

      <PageHero
        badge={`${city.name}`}
        title={`Best NEET Counsellors in ${city.name}`}
        subtitle={`Expert NEET counselling and MBBS admission guidance for students in ${city.name}, ${city.state}. Get personalised support from experienced counsellors.`}
      />

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-bold text-primary-navy mb-4">
                  NEET Counselling Services in {city.name}
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  If you are a NEET aspirant in {city.name}, our expert counsellors provide end-to-end guidance for MBBS, BDS, and AYUSH admissions. From AIQ counselling to state quota strategies, we help you navigate the complex admission process.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {[
                    'Personalised college shortlisting',
                    'Choice filling strategy',
                    'Document verification assistance',
                    'State & AIQ counselling guidance',
                    'Fee structure analysis',
                    'Cutoff & rank analysis',
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-button-gold" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-bold text-primary-navy mb-4">
                  Why Choose Our {city.name} NEET Counsellors?
                </h2>
                <div className="space-y-4">
                  <p className="text-foreground/80">
                    Our counsellors understand the specific challenges faced by {city.name} students — from local counselling procedures to regional fee structures. With years of experience and a track record of successful admissions, we provide reliable, data-driven guidance.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-navy" />
                      <strong className="text-primary-navy">Local Expertise:</strong> Deep knowledge of {city.name} and {city.state} counselling procedures
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-navy" />
                      <strong className="text-primary-navy">One-on-One Support:</strong> Personalised attention for every student
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-navy" />
                      <strong className="text-primary-navy">Data-Driven:</strong> College predictions based on real cutoff data
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-navy" />
                      <strong className="text-primary-navy">End-to-End Guidance:</strong> From rank analysis to final admission
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl bg-primary-navy p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  Get Free NEET Counselling in {city.name}
                </h2>
                <p className="text-white/80 mb-6">
                  Book a free consultation with our expert counsellors. We will analyse your NEET score and help you choose the best medical college.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-lg bg-button-gold px-6 py-3 font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
                  >
                    Book Free Consultation
                  </Link>
                  <Link
                    href={`/counselling/state/${city.state.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    {city.state} Counselling Guide
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-primary-navy">Our Counsellors</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {counselorData.length > 0 ? (
                    counselorData.map((counselor: any) => (
                      <Link
                        key={counselor.id}
                        href="/counsellors"
                        className="block rounded-lg border border-border p-3 hover:bg-muted transition-colors"
                      >
                        <p className="font-semibold text-primary-navy text-sm">{counselor.name}</p>
                        <p className="text-xs text-foreground/70 mt-0.5">{counselor.designation}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/60">Counsellor profiles coming soon.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-bold text-primary-navy">Quick Links</h3>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Link href="/counselling" className="block text-primary-navy hover:text-button-gold-hover transition-colors">
                    → NEET Counselling Guide 2026
                  </Link>
                  <Link href="/counselling/state" className="block text-primary-navy hover:text-button-gold-hover transition-colors">
                    → State-Wise Counselling
                  </Link>
                  <Link href="/colleges" className="block text-primary-navy hover:text-button-gold-hover transition-colors">
                    → Medical College Directory
                  </Link>
                  <Link href="/faq" className="block text-primary-navy hover:text-button-gold-hover transition-colors">
                    → NEET Counselling FAQs
                  </Link>
                  <Link href="/pricing" className="block text-primary-navy hover:text-button-gold-hover transition-colors">
                    → View Plans & Pricing
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">
              NEET Counselling Across India
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {INDIA_CITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/counsellors/${c.slug}`}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    c.slug === city.slug
                      ? 'bg-primary-navy text-white'
                      : 'bg-card border border-border text-primary-navy hover:bg-muted'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
