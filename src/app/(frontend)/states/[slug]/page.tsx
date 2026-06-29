import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStateBySlug, getCounsellingByState, getCollegesByState } from '@/lib/queries'
import { getDistrictsWithCollegeCount } from '@/lib/queries/districts'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const state: any = await getStateBySlug(slug)
  if (!state) return { title: 'Not Found' }
  return generateSEOMetadata({
    title: `${state.name} NEET Counselling 2026 — Complete District-Wise Guide`,
    description: `Complete ${state.name} NEET counselling guide with district-wise information. Find cutoffs, fees, medical colleges, and counselling process for every district in ${state.name}.`,
    path: `/states/${state.slug}`,
  })
}

export default async function StateDistrictPage({ params }: PageProps) {
  const { slug } = await params
  const state: any = await getStateBySlug(slug)
  if (!state) notFound()

  const [districts, colleges] = await Promise.all([
    getDistrictsWithCollegeCount(slug),
    getCollegesByState(slug),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'States', url: `${siteUrl}/states` },
        { name: state.name, url: `${siteUrl}/states/${state.slug}` },
      ])} />
      {districts.length > 0 && <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Districts in ${state.name}`,
        itemListElement: districts.map((d: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${siteUrl}/states/${state.slug}/${d.slug}`,
          name: `${d.name} NEET Counselling`,
        })),
      }} />}

      <PageHero
        badge={state.code || ''}
        title={`${state.name} NEET Counselling 2026`}
        subtitle={`District-wise guides for ${state.name}. Find counselling details, cutoffs, fees, and colleges in your district.`}
      />

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3">
              {districts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {districts.map((d: any) => (
                    <Link key={d.id} href={`/states/${state.slug}/${d.slug}`}>
                      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-primary-navy">{d.name}</h3>
                          <p className="text-xs text-foreground/60 mt-1">
                            {d.collegeCount || 0} college{(d.collegeCount || 0) !== 1 ? 's' : ''}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <p className="text-foreground/70">District pages for {state.name} are being created. Check back soon.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><h3 className="font-bold text-primary-navy">Quick Info</h3></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {state.code && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">State Code</span>
                      <span className="font-semibold text-primary-navy">{state.code}</span>
                    </div>
                  )}
                  {state.counsellingAuthority && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Authority</span>
                      <span className="font-semibold text-primary-navy text-right">{state.counsellingAuthority}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Districts</span>
                    <span className="font-semibold text-primary-navy">{districts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Total Colleges</span>
                    <span className="font-semibold text-primary-navy">{colleges.docs.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Link
                href={`/counselling/state/${state.slug}`}
                className="block rounded-xl border border-border bg-card p-4 text-sm text-primary-navy hover:bg-muted transition-colors text-center font-medium"
              >
                View {state.name} Counselling Guide
              </Link>

              <div className="rounded-xl bg-primary-navy p-6 text-white text-center">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-white/80 text-sm mb-4">Get personalised {state.name} counselling guidance</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-lg bg-button-gold px-4 py-2 text-sm font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
                >
                  Book a Session
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
