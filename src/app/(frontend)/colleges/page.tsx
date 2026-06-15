import type { Metadata } from 'next'
import Link from 'next/link'
import { getColleges, getStates, getCutoffRecordsForColleges } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getPageSeoByPath } from '@/lib/page-seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { CollegeCard } from '@/components/colleges/CollegeCard'
import { CollegeFilter } from '@/components/colleges/CollegeFilter'
import { Pagination } from '@/components/shared/Pagination'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/colleges')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'Medical Colleges in India — MBBS Fees & Cutoffs 2026',
    description: pageSeo?.metaDescription || 'Find all NMC-approved medical colleges in India for NEET 2026. Compare government, private, and deemed university MBBS colleges by fees, cutoffs, and location.',
    path: '/colleges',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string; state?: string }>
}) {
  const { page: pageParam, type, state: stateSlug } = await searchParams
  const currentPage = parseInt(pageParam || '1', 10)
  const [collegesData, statesData] = await Promise.all([
    getColleges({
      page: currentPage,
      limit: 20,
      type: type || undefined,
      stateSlug: stateSlug || undefined,
    }),
    getStates(),
  ])

  const states = statesData.docs.map((s: any) => ({ slug: s.slug, name: s.name }))
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const pageSeo = await getPageSeoByPath('/colleges')

  const collegeIds = collegesData.docs.map((c: any) => c.id)
  const cutoffMap = collegeIds.length > 0 ? await getCutoffRecordsForColleges(collegeIds) : new Map()

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'Medical Colleges', url: `${siteUrl}/colleges` },
      ])} />
      {collegesData.docs.length > 0 && <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageSeo?.metaTitle || 'Medical Colleges in India',
        description: pageSeo?.metaDescription,
        hasPart: generateItemListSchema(collegesData.docs.map((c: any) => ({
          url: `${siteUrl}/colleges/${c.slug}`,
          name: c.name,
        }))).itemListElement,
      }} />}
      <PageHero
        badge="College Directory"
        title="Medical Colleges in India 2026"
        subtitle="Browse NMC-approved medical colleges across India. Filter by type, state, and compare fees and cutoffs."
      />
      <Section tone="cream">
        <Container className="max-w-3xl text-center">
          <p className="text-foreground/80 leading-relaxed">
            India has over 700 NMC-approved medical colleges offering MBBS, BDS, and AYUSH courses. Browse and compare government, private, deemed, and central university colleges by fees, cutoff ranks, seat availability, and location. Find the right college for your NEET 2026 rank and preferences.
          </p>
        </Container>
      </Section>
      <Section tone="cream" className="pt-0">
        <Container>
          <CollegeFilter states={states} />
          {collegesData.docs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {collegesData.docs.map((college: any) => (
                <CollegeCard key={college.id} college={college} bestCutoff={cutoffMap.get(college.id) || null} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-foreground/60">
              <p className="text-lg font-semibold text-primary-navy mb-2">No colleges found</p>
              <p>Try adjusting your filters.</p>
            </div>
          )}
          <Pagination totalPages={collegesData.totalPages} currentPage={currentPage} basePath="/colleges" />
        </Container>
      </Section>
    </>
  )
}
