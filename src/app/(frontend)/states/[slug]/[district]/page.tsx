import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStateBySlug } from '@/lib/queries'
import { getDistrictBySlug, getCollegesByDistrict, getCutoffsByDistrict, getNearbyDistricts } from '@/lib/queries/districts'
import { getTehsilsByDistrict } from '@/lib/queries/tehsils'
import { getSiteSettings } from '@/lib/queries/globals'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateArticleSchema, generateFAQSchema } from '@/lib/structured-data'
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
    keywords: district.seo?.keywords?.length ? district.seo.keywords : [
      `${district.name} NEET counselling`,
      `${district.name} medical colleges`,
      `NEET cutoff ${district.name}`,
      `${district.name} MBBS admission`,
      `medical colleges in ${district.name}`,
      `${state.name} NEET counselling`,
      `${district.name} fee structure MBBS`,
      `state counselling ${state.name}`,
    ],
    path: `/states/${state.slug}/${district.slug}`,
    noIndex: true,
  })
}

const DISTRICT_FAQS = [
  {
    q: (district: string) => `How many medical colleges are there in ${district}?`,
    a: (district: string, _state: string, collegeCount: number, govtCount: number, pvtCount: number) =>
      collegeCount > 0
        ? `${district} has ${collegeCount} medical college(s) — ${govtCount} government and ${pvtCount} private. Government colleges offer affordable MBBS education with fees as low as ₹10,000–₹1,00,000 per year, while private college fees range from ₹5–₹25 lakh per year.`
        : `${district} currently does not have any NMC-approved medical colleges within its boundaries. Students from ${district} typically apply to colleges in nearby districts and across ${_state}.`,
  },
  {
    q: (_district: string) => 'What is the NEET counselling process in this district?',
    a: (district: string, state: string) =>
      `Students from ${district} follow a two-step counselling process. First, register with MCC (mcc.nic.in) for 15% All India Quota seats. Second, register with ${state} state counselling authority for 85% state quota seats. The process includes choice filling, seat allotment based on NEET rank, document verification, and college reporting.`,
  },
  {
    q: (district: string) => `What documents are needed for NEET counselling in ${district}?`,
    a: (_district: string, state: string) =>
      `Essential documents include: NEET scorecard, Class 10 and 12 mark sheets, ${state} domicile certificate, category certificate (SC/ST/OBC-NCL/EWS) if applicable, Aadhaar card, passport-size photographs, and migration certificate. Keep multiple self-attested copies for verification at the counselling centre.`,
  },
  {
    q: (_district: string) => 'When does NEET counselling start this year?',
    a: (_district: string, _state: string) =>
      `NEET UG ${new Date().getFullYear()} counselling begins in July after results. MCC Round 1 registration opens mid-July, followed by choice filling and allotment. Multiple rounds including mop-up and stray vacancy are conducted through September.`,
  },
  {
    q: (district: string) => `Can students from ${district} get admission in other state colleges?`,
    a: (_district: string, _state: string) =>
      `Yes, through the 15% All India Quota (AIQ) conducted by MCC, students can apply to medical colleges across India. AIQ seats are available in all government colleges except some state-specific reservations. Deemed universities and central institutions like AIIMS and JIPMER also accept All India Rank.`,
  },
]

export default async function DistrictHubPage({ params }: PageProps) {
  const { slug, district: districtSlug } = await params
  const state: any = await getStateBySlug(slug)
  if (!state) notFound()

  const district: any = await getDistrictBySlug(districtSlug, slug)
  if (!district) notFound()

  const [colleges, cutoffs, nearbyDistricts, tehsils, settings] = await Promise.all([
    getCollegesByDistrict(district.id),
    getCutoffsByDistrict(district.id),
    getNearbyDistricts(district.id),
    getTehsilsByDistrict(district.id),
    getSiteSettings().catch(() => null),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const collegeCount = colleges.docs.length
  const govtCount = colleges.docs.filter((c: any) => c.type === 'government' || c.type === 'central').length
  const privateCount = collegeCount - govtCount
  const pageTypes = Object.keys(SUBPAGE_LABELS)
  const year = new Date().getFullYear()

  const faqs = DISTRICT_FAQS.map(f => ({
    question: f.q(district.name),
    answer: f.a(district.name, state.name, collegeCount, govtCount, privateCount),
  }))

  return (
    <>
      <JsonLd data={generateArticleSchema({
        title: `${district.name} NEET Counselling ${year}`,
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
      {faqs.length > 0 && <JsonLd data={generateFAQSchema(faqs)} />}

      <PageHero
        badge={`${district.name}, ${state.name}`}
        title={`${district.name} NEET Counselling ${year}`}
        subtitle="Comprehensive district-level counselling guide with cutoff, fees, colleges, and admission information."
      />

      <DistrictSubNav activeType="" stateSlug={state.slug} districtSlug={district.slug} />

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-bold text-primary-navy mb-3">About NEET Counselling in {district.name}</h2>
                <p className="text-foreground/80 leading-relaxed">
                  {district.name} is a district in {state.name} with {collegeCount} medical college(s) —
                  {govtCount > 0 && ` ${govtCount} government`}{govtCount > 0 && privateCount > 0 ? ' and' : ''}{privateCount > 0 && ` ${privateCount} private`}.
                  NEET counselling for {district.name} students involves registration with MCC for 15% AIQ seats and
                  with {state.counsellingAuthority || state.name + ' state counselling authority'} for state quota seats.
                  Our comprehensive guide provides district-specific information about cutoffs, fees, colleges, and
                  the step-by-step counselling process to help you secure an MBBS seat.
                </p>
              </div>

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
                      {type === 'all-medical-colleges' && `${collegeCount} colleges in ${district.name}`}
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

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-bold text-primary-navy mb-3">Important Dates for NEET Counselling {year}</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground/70">NEET UG {year} Exam</span>
                    <span className="font-semibold text-primary-navy">May {year}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground/70">Result Declaration</span>
                    <span className="font-semibold text-primary-navy">June {year}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground/70">MCC Round 1 Registration</span>
                    <span className="font-semibold text-primary-navy">July {year}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground/70">{state.name} State Counselling</span>
                    <span className="font-semibold text-primary-navy">July-August {year}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-foreground/70">Academic Session Begins</span>
                    <span className="font-semibold text-primary-navy">September {year}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-bold text-primary-navy mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4 divide-y divide-border">
                  {faqs.map((faq, i) => (
                    <div key={i} className={i > 0 ? 'pt-4' : ''}>
                      <h3 className="font-medium text-primary-navy mb-2">{faq.question}</h3>
                      <p className="text-sm text-foreground/70">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <DistrictQuickFacts
                district={district}
                state={state}
                collegeCount={collegeCount}
                govtCount={govtCount}
                privateCount={privateCount}
              />
              {settings?.phone && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-primary-navy mb-3 text-sm">Helpline Numbers</h3>
                    <div className="space-y-2">
                      {settings.phone.split(/[,;]+/).map((num: string) => num.trim()).filter(Boolean).map((num: string, i: number) => (
                        <div key={i}>
                          <a href={`tel:${num.replace(/[^0-9+]/g, '')}`} className="text-sm font-semibold text-primary-navy hover:underline">
                            {num}
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
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

      {collegeCount > 0 && (
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
