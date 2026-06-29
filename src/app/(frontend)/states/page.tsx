import type { Metadata } from 'next'
import Link from 'next/link'
import { getStates } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { getDistrictsForSite } from '@/lib/queries/districts'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'State-Wise NEET Counselling 2026 — District Guides for All States',
    description: 'Find NEET counselling information for every state and district in India. Get district-specific cutoff, fees, college lists, and counselling process guides.',
    path: '/states',
  })
}

export default async function StatesDirectoryPage() {
  const states = await getStates()
  const allDistricts = await getDistrictsForSite()

  const districtCountByState = new Map<string, number>()
  for (const d of allDistricts) {
    const stateId = typeof d.state === 'object' ? d.state?.id : d.state
    if (stateId) districtCountByState.set(stateId, (districtCountByState.get(stateId) || 0) + 1)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'States', url: `${siteUrl}/states` },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'State-Wise NEET Counselling 2026',
        hasPart: (states.docs || []).map((s: any) => ({
          '@type': 'ListItem',
          position: 1,
          url: `${siteUrl}/states/${s.slug}`,
          name: `${s.name} NEET Counselling`,
        })),
      }} />

      <PageHero
        badge="All States"
        title="State-Wise NEET Counselling 2026"
        subtitle="Comprehensive district-level guides for every Indian state and union territory. Find cutoffs, fees, colleges, and counselling details for your district."
      />

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(states.docs || []).map((state: any) => {
              const stateId = state.id
              const districtCount = districtCountByState.get(stateId) || 0
              return (
                <Link key={state.id} href={`/states/${state.slug}`}>
                  <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-primary-navy text-lg">{state.name}</h3>
                        {state.code && (
                          <span className="shrink-0 rounded-full bg-primary-navy/10 px-2.5 py-0.5 text-xs font-semibold text-primary-navy">
                            {state.code}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/70">
                        {districtCount} district{districtCount !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </Container>
      </Section>
    </>
  )
}
