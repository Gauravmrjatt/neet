import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStateBySlug, getCounsellingByState, getCollegesByState } from '@/lib/queries'
import { getDistrictsWithCollegeCount } from '@/lib/queries/districts'
import { getSiteSettings } from '@/lib/queries/globals'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateItemListSchema, generateFAQSchema } from '@/lib/structured-data'
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
    title: `${state.name} NEET Counselling ${new Date().getFullYear()} — Complete District-Wise Guide`,
    description: `Complete ${state.name} NEET counselling guide with district-wise information. Find cutoffs, fees, medical colleges, and counselling process for every district in ${state.name}.`,
    keywords: [
      `${state.name} NEET counselling`,
      `${state.name} medical colleges`,
      `NEET cutoff ${state.name}`,
      `${state.name} MBBS admission`,
      `medical colleges in ${state.name}`,
      `${state.name} state counselling`,
      `${state.name} NEET ${new Date().getFullYear()}`,
      `district wise counselling ${state.name}`,
    ],
    path: `/states/${state.slug}`,
  })
}

const STATE_FAQS = [
  {
    q: (state: string) => `How does NEET counselling work in ${state}?`,
    a: (state: string, authority: string) =>
      `NEET counselling in ${state} is conducted by ${authority || state + ' counselling authority'}. 85% of state quota seats are filled through state counselling, while 15% All India Quota seats go through MCC counselling. The process includes registration, choice filling, seat allotment based on NEET rank and category, document verification, and college reporting.`,
  },
  {
    q: (state: string) => `How many medical colleges are there in ${state}?`,
    a: (state: string, _authority: string, _totalColleges: number) =>
      `${state} has several government and private medical colleges offering MBBS, BDS, and other medical courses. Each district within ${state} has different numbers of colleges. Check our district-wise guides for detailed information about medical colleges, fee structure, and cutoff marks.`,
  },
  {
    q: (state: string) => `What is the NEET cutoff for ${state} medical colleges?`,
    a: (state: string, _authority: string) =>
      `NEET cutoff for medical colleges in ${state} varies by college type (government/private), category (General/OBC/SC/ST), and quota (AIQ/state). Government colleges typically have higher cutoff ranks than private colleges. Check our district-specific cutoff pages for detailed opening and closing ranks.`,
  },
  {
    q: (state: string) => `What documents are needed for ${state} NEET counselling?`,
    a: (state: string, _authority: string) =>
      `Students from ${state} need: NEET scorecard, Class 10 and 12 mark sheets, ${state} domicile certificate, category certificate (SC/ST/OBC-NCL/EWS), Aadhaar card, passport-size photos, and migration certificate. State quota candidates must provide valid ${state} domicile proof to claim state quota benefits.`,
  },
  {
    q: (state: string) => `When does ${state} NEET counselling start?`,
    a: (_state: string, _authority: string) =>
      `NEET UG ${new Date().getFullYear()} counselling typically begins in July. MCC Round 1 registration opens mid-July, followed by ${_state} state counselling. Multiple rounds are conducted through August-September. Subscribe to our updates for real-time notifications about ${_state} counselling dates and deadlines.`,
  },
]

export default async function StateDistrictPage({ params }: PageProps) {
  const { slug } = await params
  const state: any = await getStateBySlug(slug)
  if (!state) notFound()

  const [districts, colleges, settings] = await Promise.all([
    getDistrictsWithCollegeCount(slug),
    getCollegesByState(slug),
    getSiteSettings().catch(() => null),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const year = new Date().getFullYear()
  const totalColleges = colleges.docs.length

  const faqs = STATE_FAQS.map(f => ({
    question: f.q(state.name),
    answer: f.a(state.name, state.counsellingAuthority || '', totalColleges),
  }))

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
      {faqs.length > 0 && <JsonLd data={generateFAQSchema(faqs)} />}

      <PageHero
        badge={state.code || ''}
        title={`${state.name} NEET Counselling ${year}`}
        subtitle={`District-wise guides for ${state.name}. Find counselling details, cutoffs, fees, and colleges in your district.`}
      />

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-border bg-card p-6 mb-8">
                <h2 className="text-xl font-bold text-primary-navy mb-3">NEET Counselling in {state.name}</h2>
                <p className="text-foreground/80 leading-relaxed">
                  {state.name} offers medical education through {totalColleges} NMC-approved medical colleges
                  across its districts. NEET counselling for {state.name} students involves two tracks —
                  All India Quota (15% seats) through MCC counselling and state quota (85% seats) through
                  {state.counsellingAuthority ? ` ${state.counsellingAuthority}` : ' the state counselling authority'}.
                  Each district in {state.name} has unique cutoff trends, fee structures, and college options.
                  Use our district-wise guides below to find detailed information specific to your area.
                </p>
              </div>

              {districts.length > 0 ? (
                <>
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Districts in {state.name}</h2>
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
                </>
              ) : (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <p className="text-foreground/70">District pages for {state.name} are being created. Check back soon.</p>
                </div>
              )}

              <div className="rounded-xl border border-border bg-card p-6 mt-8">
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
                    <span className="font-semibold text-primary-navy">{totalColleges}</span>
                  </div>
                </CardContent>
              </Card>

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
