import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStateBySlug } from '@/lib/queries'
import { getDistrictBySlug, getCollegesByDistrict, getCutoffsByDistrict, getNearbyDistricts } from '@/lib/queries/districts'
import { getTehsilsByDistrict } from '@/lib/queries/tehsils'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateArticleSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CollegeCard } from '@/components/colleges/CollegeCard'
import { DistrictSubNav } from '@/components/districts/DistrictSubNav'
import { NearbyDistricts } from '@/components/districts/NearbyDistricts'
import { Disclaimer } from '@/components/shared/Disclaimer'

const SUBPAGE_LABELS: Record<string, string> = {
  'neet-counselling': 'NEET Counselling',
  'mbbs-admission': 'MBBS Admission',
  'cutoff': 'Cutoff',
  'fees': 'Fees',
  'documents-required': 'Documents Required',
  'choice-filling': 'Choice Filling',
  'seat-matrix': 'Seat Matrix',
  'all-medical-colleges': 'All Medical Colleges',
  'government-medical-colleges': 'Government Colleges',
  'private-medical-colleges': 'Private Colleges',
  'mcc-counselling': 'MCC Counselling',
  'state-counselling': 'State Counselling',
  'expected-cutoff': 'Expected Cutoff',
  'important-dates': 'Important Dates',
  'faq': 'FAQ',
  'news': 'News',
  'updates': 'Updates',
}

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string; district: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, district: districtSlug } = await params
  const state: any = await getStateBySlug(slug)
  const district: any = await getDistrictBySlug(districtSlug, slug)
  if (!state || !district) return { title: 'Not Found' }
  return generateSEOMetadata({
    title: district.seo?.metaTitle || `${district.name}, ${state.name} NEET Counselling ${new Date().getFullYear()} — District Guide`,
    description: district.seo?.metaDescription || `Complete NEET counselling guide for ${district.name}, ${state.name}. Find medical colleges, cutoff marks, fee structure, and counselling process for ${district.name} students.`,
    path: `/states/${state.slug}/${district.slug}`,
  })
}

export default async function DistrictHubPage({ params }: PageProps) {
  const { slug, district: districtSlug } = await params
  const state: any = await getStateBySlug(slug)
  if (!state) notFound()

  const district: any = await getDistrictBySlug(districtSlug, slug)
  if (!district) notFound()

  const [colleges, cutoffs, nearbyDistricts, tehsils] = await Promise.all([
    getCollegesByDistrict(district.id),
    getCutoffsByDistrict(district.id),
    getNearbyDistricts(district.id),
    getTehsilsByDistrict(district.id),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const govtColleges = colleges.docs.filter((c: any) => c.type === 'government' || c.type === 'central')
  const privateColleges = colleges.docs.filter((c: any) => c.type === 'private' || c.type === 'deemed')
  const pageTypes = Object.keys(SUBPAGE_LABELS)

  return (
    <>
      <JsonLd data={generateArticleSchema({
        title: `${district.name} NEET Counselling ${new Date().getFullYear()}`,
        description: `Complete NEET counselling guide for ${district.name}, ${state.name}`,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        authorName: 'NEET Counselling Experts',
        publisherLogo: `${siteUrl}/logo.png`,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'States', url: `${siteUrl}/states` },
        { name: state.name, url: `${siteUrl}/states/${state.slug}` },
        { name: district.name, url: `${siteUrl}/states/${state.slug}/${district.slug}` },
      ])} />

      <PageHero
        badge={`${district.name}, ${state.name}`}
        title={`${district.name} NEET Counselling ${new Date().getFullYear()}`}
        subtitle="Comprehensive district-level counselling guide with cutoff, fees, colleges, and admission information."
      />

      <DistrictSubNav activeType="" stateSlug={state.slug} districtSlug={district.slug} />

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {district.description && (
                <div className="prose prose-lg max-w-none prose-headings:text-primary-navy">
                  <RichText content={district.description} />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {pageTypes.map((type) => (
                  <Link
                    key={type}
                    href={`/states/${state.slug}/${district.slug}/${type}`}
                    className="rounded-xl border border-border bg-card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <h3 className="font-semibold text-primary-navy text-sm">{SUBPAGE_LABELS[type]}</h3>
                    <p className="text-xs text-foreground/60 mt-1">
                      {type === 'cutoff' && `Check NEET cutoff for ${district.name}`}
                      {type === 'fees' && `MBBS fee structure in ${district.name}`}
                      {type === 'all-medical-colleges' && `${colleges.docs.length} colleges in ${district.name}`}
                      {type === 'faq' && `Frequently asked questions for ${district.name}`}
                      {type === 'neet-counselling' && `Complete counselling process for ${district.name}`}
                      {type === 'choice-filling' && `Choice filling strategy for ${district.name}`}
                      {type === 'documents-required' && `Documents needed for ${district.name}`}
                      {type === 'seat-matrix' && `Seat distribution in ${district.name}`}
                      {type !== 'cutoff' && type !== 'fees' && type !== 'all-medical-colleges' && type !== 'faq' && type !== 'neet-counselling' && type !== 'choice-filling' && type !== 'documents-required' && type !== 'seat-matrix' && `Learn about ${SUBPAGE_LABELS[type].toLowerCase()} in ${district.name}`}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <DistrictQuickFacts
                district={district}
                state={state}
                collegeCount={colleges.docs.length}
                govtCount={govtColleges.length}
                privateCount={privateColleges.length}
              />
              {tehsils.docs.length > 0 && (
                <Card>
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-bold text-primary-navy text-lg">Tehsils in {district.name}</h3>
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      {tehsils.docs.map((t: any) => (
                        <Link
                          key={t.id}
                          href={`/states/${state.slug}/${district.slug}/tehsil/${t.slug}`}
                          className="block rounded-lg px-3 py-1.5 text-sm text-foreground/70 hover:text-primary-navy hover:bg-primary-navy/5 transition-colors"
                        >
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              <NearbyDistricts districts={nearbyDistricts} stateSlug={state.slug} />
            </div>
          </div>
        </Container>
      </Section>

      {colleges.docs.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Medical Colleges in {district.name}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {colleges.docs.map((college: any) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section tone="cream">
        <Container className="max-w-4xl">
          <Disclaimer type="educational" />
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h2 className="text-2xl font-bold text-primary-navy mb-4">
              Need Help with {district.name} NEET Counselling?
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
              Get expert guidance for NEET counselling in {district.name}, {state.name}. Our counsellors help with college selection, choice filling, and admission strategy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-primary-navy px-6 py-3 font-semibold text-white hover:bg-primary-navy-dark transition-colors"
              >
                Talk to a Counsellor
              </Link>
              <Link
                href={`/colleges?state=${state.slug}`}
                className="inline-flex items-center rounded-lg border border-border bg-card px-6 py-3 font-semibold text-primary-navy hover:bg-muted transition-colors"
              >
                View All {state.name} Colleges
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

function DistrictQuickFacts({ district, state, collegeCount, govtCount, privateCount }: any) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-primary-navy">Quick Facts</h3>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/70">District</span>
          <span className="font-semibold text-primary-navy">{district.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">State</span>
          <span className="font-semibold text-primary-navy">{state.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Total Colleges</span>
          <span className="font-semibold text-primary-navy">{collegeCount}</span>
        </div>
        {govtCount > 0 && (
          <div className="flex justify-between">
            <span className="text-foreground/70">Government</span>
            <span className="font-semibold text-primary-navy">{govtCount}</span>
          </div>
        )}
        {privateCount > 0 && (
          <div className="flex justify-between">
            <span className="text-foreground/70">Private</span>
            <span className="font-semibold text-primary-navy">{privateCount}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
