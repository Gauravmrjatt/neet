import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStateBySlug } from '@/lib/queries'
import { getDistrictBySlug, getDistrictContent, getCollegesByDistrict, getCutoffsByDistrict, getNearbyDistricts } from '@/lib/queries/districts'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateArticleSchema, generateFAQSchema, generateHowToSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { DistrictSubNav } from '@/components/districts/DistrictSubNav'
import { NearbyDistricts } from '@/components/districts/NearbyDistricts'
import { CutoffRecordsTable } from '@/components/colleges/CutoffRecordsTable'
import { templates, type TemplateContext } from '@/lib/templates/district-content-templates'
import { Card, CardContent } from '@/components/ui/card'

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

const VALID_SUBPAGES = new Set(Object.keys(SUBPAGE_LABELS))

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string; district: string; subpage: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, district: districtSlug, subpage } = await params
  if (!VALID_SUBPAGES.has(subpage)) return { title: 'Not Found' }

  const state: any = await getStateBySlug(slug)
  const district: any = await getDistrictBySlug(districtSlug, slug)
  if (!state || !district) return { title: 'Not Found' }

  const content = await getDistrictContent(district.id, subpage)
  if (content?.seo?.metaTitle) {
    return generateSEOMetadata({
      title: content.seo.metaTitle,
      description: content.seo.metaDescription || undefined,
      path: `/states/${state.slug}/${district.slug}/${subpage}`,
      noIndex: content.seo.noIndex || undefined,
    })
  }

  const template = templates[subpage]
  if (template) {
    const colleges = await getCollegesByDistrict(district.id)
    const cutoffs = await getCutoffsByDistrict(district.id)
    const nearby = await getNearbyDistricts(district.id)
    const tpl = template({ district, state, colleges: colleges.docs, cutoffs: cutoffs.docs, nearbyDistricts: nearby, relatedBlogs: [], year: String(new Date().getFullYear()) })
    return generateSEOMetadata({
      title: tpl.metaTitle,
      description: tpl.metaDescription,
      path: `/states/${state.slug}/${district.slug}/${subpage}`,
    })
  }

  return generateSEOMetadata({
    title: `${SUBPAGE_LABELS[subpage]} for ${district.name}, ${state.name} ${new Date().getFullYear()}`,
    description: `Learn about ${SUBPAGE_LABELS[subpage].toLowerCase()} for NEET counselling in ${district.name}, ${state.name}.`,
    path: `/states/${state.slug}/${district.slug}/${subpage}`,
  })
}

const COLLEGE_SUBPAGES = new Set(['all-medical-colleges', 'government-medical-colleges', 'private-medical-colleges'])
const CUTOFF_SUBPAGES = new Set(['cutoff', 'expected-cutoff'])
const FEE_SUBPAGES = new Set(['fees', 'seat-matrix'])

function renderCollegeTable(colleges: any[], subpage: string, state: any): React.ReactNode {
  const filtered = subpage === 'government-medical-colleges'
    ? colleges.filter((c: any) => c.type === 'government' || c.type === 'central')
    : subpage === 'private-medical-colleges'
    ? colleges.filter((c: any) => c.type === 'private' || c.type === 'deemed')
    : colleges

  if (filtered.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-navy text-white">
              <th className="px-4 py-3 text-left font-semibold">College</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">City</th>
              <th className="px-4 py-3 text-right font-semibold">Annual Fee</th>
              <th className="px-4 py-3 text-right font-semibold">Gen. Cutoff</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: any, i: number) => {
              const feeDisplay = c.feeStructure?.mbbsAnnual
                ? `₹${(c.feeStructure.mbbsAnnual / 100000).toFixed(1)}L`
                : c.feeStructure?.totalCourseFee || '—'
              const cutoffDisplay = c.cutoffs?.general
                ? c.cutoffs.general.toLocaleString()
                : '—'
              const cityDisplay = typeof c.city === 'string' ? c.city : c.city?.name || c.city || '—'
              return (
                <tr key={c.id} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                  <td className="px-4 py-3 font-medium text-primary-navy">
                    {c.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.type === 'government' || c.type === 'central'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.type === 'government' ? 'Govt' : c.type === 'central' ? 'Central' : c.type === 'deemed' ? 'Deemed' : 'Private'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{cityDisplay}</td>
                  <td className="px-4 py-3 text-right text-foreground/70">{feeDisplay}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary-navy">{cutoffDisplay}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function renderFeeTable(colleges: any[]): React.ReactNode {
  const withFees = colleges.filter((c: any) => c.feeStructure?.mbbsAnnual || c.feeStructure?.totalCourseFee)
  if (withFees.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-navy text-white">
              <th className="px-4 py-3 text-left font-semibold">College</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-right font-semibold">Annual Fee</th>
              <th className="px-4 py-3 text-right font-semibold">Total Course Fee</th>
              <th className="px-4 py-3 text-right font-semibold">Hostel Fee</th>
            </tr>
          </thead>
          <tbody>
            {withFees.map((c: any, i: number) => (
              <tr key={c.id} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                <td className="px-4 py-3 font-medium text-primary-navy">{c.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    c.type === 'government' || c.type === 'central'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.type === 'government' ? 'Govt' : c.type === 'central' ? 'Central' : c.type === 'deemed' ? 'Deemed' : 'Private'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-foreground/70">
                  {c.feeStructure?.mbbsAnnual ? `₹${(c.feeStructure.mbbsAnnual / 100000).toFixed(1)}L` : '—'}
                </td>
                <td className="px-4 py-3 text-right text-foreground/70">{c.feeStructure?.totalCourseFee || '—'}</td>
                <td className="px-4 py-3 text-right text-foreground/70">
                  {c.feeStructure?.hostelFee ? `₹${(c.feeStructure.hostelFee / 100000).toFixed(1)}L` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function renderSeatMatrix(colleges: any[]): React.ReactNode {
  const withCourses = colleges.filter((c: any) => c.courses?.length > 0)
  if (withCourses.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-navy text-white">
              <th className="px-4 py-3 text-left font-semibold">College</th>
              <th className="px-4 py-3 text-left font-semibold">Course</th>
              <th className="px-4 py-3 text-left font-semibold">Duration</th>
              <th className="px-4 py-3 text-right font-semibold">Seats</th>
            </tr>
          </thead>
          <tbody>
            {withCourses.map((c: any) =>
              (c.courses || []).map((cr: any, ci: number) => (
                <tr key={`${c.id}-${ci}`} className="bg-card even:bg-muted/30">
                  {ci === 0 && (
                    <td className="px-4 py-3 font-medium text-primary-navy" rowSpan={c.courses.length}>
                      {c.name}
                    </td>
                  )}
                  <td className="px-4 py-3 text-foreground/70">{cr.course || 'MBBS'}</td>
                  <td className="px-4 py-3 text-foreground/70">{cr.duration || '5.5 Years'}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary-navy">{cr.seats || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function counsellingCTA(district: any, state: any, siteUrl: string): React.ReactNode {
  return (
    <div className="rounded-xl bg-gradient-to-br from-primary-navy to-blue-900 p-6 text-white">
      <h3 className="text-xl font-bold mb-2">Get Expert NEET Counselling Guidance</h3>
      <p className="text-white/80 text-sm mb-4">
        Our experienced counsellors provide personalised guidance for NEET counselling in {district.name}, {state.name}. 
        Get help with college selection, choice filling strategy, document verification, and seat allotment tracking.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center rounded-lg bg-button-gold px-5 py-2.5 text-sm font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
        >
          Book a Free Session
        </Link>
        <Link
          href={`https://wa.me/919509698208?text=${encodeURIComponent(`Hi, I need NEET counselling guidance for ${district.name}, ${state.name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/25 transition-colors"
        >
          Chat on WhatsApp
        </Link>
      </div>
      <p className="text-white/60 text-xs mt-3">
        Trusted by thousands of students across {state.name} for NEET UG counselling {new Date().getFullYear()}.
      </p>
    </div>
  )
}

function lastUpdatedDate(): React.ReactNode {
  const now = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const formatted = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
  return (
    <p className="text-xs text-foreground/40 text-right">
      Last updated: {formatted}
    </p>
  )
}

export default async function DistrictSubPage({ params }: PageProps) {
  const { slug, district: districtSlug, subpage } = await params
  if (!VALID_SUBPAGES.has(subpage)) notFound()

  const state: any = await getStateBySlug(slug)
  if (!state) notFound()

  const district: any = await getDistrictBySlug(districtSlug, slug)
  if (!district) notFound()

  const [content, colleges, cutoffs, nearbyDistricts] = await Promise.all([
    getDistrictContent(district.id, subpage),
    getCollegesByDistrict(district.id),
    getCutoffsByDistrict(district.id),
    getNearbyDistricts(district.id),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const label = SUBPAGE_LABELS[subpage] || subpage

  const template = templates[subpage]
  const templateOutput = template ? template({
    district,
    state,
    colleges: colleges.docs,
    cutoffs: cutoffs.docs,
    nearbyDistricts,
    relatedBlogs: [],
    year: String(new Date().getFullYear()),
  } as TemplateContext) : null

  const processSubpages = new Set(['neet-counselling', 'mbbs-admission', 'choice-filling', 'mcc-counselling', 'state-counselling'])
  const collegeCount = colleges.docs.length
  const govtCount = colleges.docs.filter((c: any) => c.type === 'government' || c.type === 'central').length
  const pvtCount = collegeCount - govtCount

  return (
    <>
      <JsonLd data={generateArticleSchema({
        title: `${label} — ${district.name}, ${state.name}`,
        description: `Information about ${label.toLowerCase()} for NEET counselling in ${district.name}, ${state.name}`,
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
        { name: label, url: `${siteUrl}/states/${state.slug}/${district.slug}/${subpage}` },
      ])} />
      {templateOutput?.faqs && templateOutput.faqs.length > 0 && (
        <JsonLd data={generateFAQSchema(templateOutput.faqs.map(f => ({ question: f.question, answer: f.answer })))} />
      )}
      {processSubpages.has(subpage) && (
        <JsonLd data={generateHowToSchema([
          { name: `Register for NEET Counselling`, text: `Visit the official counselling portal, register with your NEET roll number and personal details, and pay the registration fee.` },
          { name: `Upload Documents`, text: `Upload scanned copies of all required documents including NEET scorecard, admit card, class 10 and 12 marksheets, domicile certificate, and category certificate.` },
          { name: `Fill College Choices`, text: `List your preferred medical colleges and courses in order of priority. Fill all available choices to maximize your chances of seat allotment.` },
          { name: `Lock Choices`, text: `Review and lock your choices before the deadline. Locked choices cannot be modified in that round.` },
          { name: `Check Allotment Result`, text: `Check the seat allotment result on the counselling portal. If allotted, download the allotment letter and report to the college.` },
        ])} />
      )}

      <PageHero
        badge={`${district.name}`}
        title={`${label} in ${district.name}, ${state.name}`}
        subtitle={`Complete information about ${label.toLowerCase()} for NEET counselling in ${district.name} district.`}
      />

      <DistrictSubNav activeType={subpage} stateSlug={state.slug} districtSlug={district.slug} />

      <Section tone="cream">
        <Container>
          {collegeCount > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              <div className="rounded-lg bg-primary-navy/10 px-4 py-2 text-sm">
                <span className="font-bold text-primary-navy">{collegeCount}</span>{' '}
                <span className="text-foreground/70">Medical College{collegeCount !== 1 ? 's' : ''}</span>
              </div>
              {govtCount > 0 && (
                <div className="rounded-lg bg-green-50 px-4 py-2 text-sm">
                  <span className="font-bold text-green-800">{govtCount}</span>{' '}
                  <span className="text-green-700">Government</span>
                </div>
              )}
              {pvtCount > 0 && (
                <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm">
                  <span className="font-bold text-amber-800">{pvtCount}</span>{' '}
                  <span className="text-amber-700">Private</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {content?.content ? (
                <>
                  <div className="prose prose-lg max-w-none prose-headings:text-primary-navy">
                    <RichText content={content.content} />
                  </div>
                  {lastUpdatedDate()}
                </>
              ) : templateOutput ? (
                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none prose-headings:text-primary-navy">
                    <p>{templateOutput.metaDescription}</p>
                  </div>

                  {/* Real data sections for college pages */}
                  {COLLEGE_SUBPAGES.has(subpage) && collegeCount > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-primary-navy">
                        {subpage === 'all-medical-colleges' ? 'Medical Colleges' : 
                         subpage === 'government-medical-colleges' ? 'Government Medical Colleges' : 
                         'Private Medical Colleges'} in {district.name}
                      </h2>
                      {renderCollegeTable(colleges.docs, subpage, state)}
                    </div>
                  )}

                  {/* Cutoff data table */}
                  {CUTOFF_SUBPAGES.has(subpage) && cutoffs.docs.length > 0 && (
                    <CutoffRecordsTable records={cutoffs.docs as any} />
                  )}

                  {/* Fee table */}
                  {FEE_SUBPAGES.has(subpage) && collegeCount > 0 && (
                    <div className="space-y-4">
                      {subpage === 'fees' && (
                        <>
                          <h2 className="text-xl font-bold text-primary-navy">Fee Structure in {district.name}</h2>
                          {renderFeeTable(colleges.docs)}
                        </>
                      )}
                      {subpage === 'seat-matrix' && (
                        <>
                          <h2 className="text-xl font-bold text-primary-navy">Seat Matrix in {district.name}</h2>
                          {renderSeatMatrix(colleges.docs)}
                        </>
                      )}
                    </div>
                  )}

                  {/* Template H2 content */}
                  {templateOutput.h2s.map((h2, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-6">
                      <h2 className="text-xl font-bold text-primary-navy mb-4">{h2}</h2>
                      <p className="text-foreground/80">{getH2Content(h2, district, state, collegeCount, govtCount, pvtCount)}</p>
                    </div>
                  ))}

                  {/* FAQ section */}
                  {templateOutput.faqs.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h2 className="text-xl font-bold text-primary-navy mb-4">Frequently Asked Questions</h2>
                      <div className="space-y-4 divide-y divide-border">
                        {templateOutput.faqs.map((faq, i) => (
                          <div key={i} className={i > 0 ? 'pt-4' : ''}>
                            <h3 className="font-medium text-primary-navy mb-2">{faq.question}</h3>
                            <p className="text-sm text-foreground/70">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lastUpdatedDate()}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">{label}</h2>
                  <p className="text-foreground/70 mb-6">
                    Content for {label.toLowerCase()} in {district.name} is being prepared. Check our main counselling guide for now.
                  </p>
                  <Link
                    href={`/counselling/state/${state.slug}`}
                    className="inline-flex items-center rounded-lg bg-primary-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-navy/90 transition-colors"
                  >
                    View {state.name} Counselling Guide
                  </Link>
                </div>
              )}

              {/* Counselling CTA — on every page */}
              {counsellingCTA(district, state, siteUrl)}

              {templateOutput && templateOutput.internalLinks.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Related Pages</h2>
                  <div className="flex flex-wrap gap-3">
                    {templateOutput.internalLinks.map((link, i) => (
                      <Link
                        key={i}
                        href={link.url}
                        className="inline-flex items-center rounded-lg bg-primary-navy/10 px-4 py-2 text-sm font-medium text-primary-navy hover:bg-primary-navy/20 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Quick stats card */}
              <Card>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-bold text-primary-navy text-lg">{district.name} at a Glance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">State</span>
                      <span className="font-semibold text-primary-navy">{state.name}</span>
                    </div>
                    {state.code && (
                      <div className="flex justify-between">
                        <span className="text-foreground/70">State Code</span>
                        <span className="font-semibold text-primary-navy">{state.code}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Medical Colleges</span>
                      <span className="font-semibold text-primary-navy">{collegeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Government</span>
                      <span className="font-semibold text-primary-navy">{govtCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Private</span>
                      <span className="font-semibold text-primary-navy">{pvtCount}</span>
                    </div>
                    {nearbyDistricts.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <span className="text-foreground/70 text-xs">Nearby Districts</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {nearbyDistricts.slice(0, 5).map((nd: any) => (
                            <Link
                              key={nd.id || nd.slug}
                              href={`/states/${state.slug}/${nd.slug}/${subpage}`}
                              className="text-xs bg-muted px-2 py-1 rounded text-foreground/70 hover:text-primary-navy hover:bg-primary-navy/10 transition-colors"
                            >
                              {nd.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {state.counsellingAuthority && (
                <div className="rounded-xl border border-border bg-card p-4 text-sm">
                  <h3 className="font-bold text-primary-navy mb-2">Counselling Authority</h3>
                  <p className="text-foreground/70">{state.counsellingAuthority}</p>
                  {state.counsellingWebsite && (
                    <a
                      href={state.counsellingWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-primary-navy font-medium hover:underline text-xs"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              )}

              <NearbyDistricts districts={nearbyDistricts} stateSlug={state.slug} />

              {/* CTA in sidebar */}
              <Link
                href="/contact"
                className="block rounded-xl bg-button-gold p-5 text-center hover:bg-button-gold-hover transition-colors"
              >
                <h3 className="font-bold text-primary-navy text-lg mb-1">Need Help?</h3>
                <p className="text-primary-navy/80 text-sm mb-3">Get personalised counselling from our experts</p>
                <span className="inline-flex items-center rounded-lg bg-primary-navy px-4 py-2 text-sm font-semibold text-white">
                  Book a Session
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

function getH2Content(h2: string, district: any, state: any, collegeCount: number, govtCount: number, pvtCount: number): string {
  const h = h2.toLowerCase()
  if (h.includes('overview') || h.includes('introduction')) {
    return `${district.name} is a district in ${state.name}. NEET counselling for students in ${district.name} involves registration with MCC for All India Quota seats and with ${state.counsellingAuthority || state.name + ' state counselling authority'} for state quota seats. ${district.name} has ${collegeCount} medical college(s) — ${govtCount} government and ${pvtCount} private. Understanding the counselling process, eligibility criteria, and important dates is essential for securing an MBBS seat. Our expert counsellors provide personalised guidance to help you navigate the entire process step by step.`
  }
  if (h.includes('college')) {
    if (collegeCount > 0) {
      return `${district.name} has ${collegeCount} medical college(s) (${govtCount} government, ${pvtCount} private). Government colleges offer affordable MBBS education with fees as low as ₹10,000-₹1,00,000 per year. Private college fees range from ₹5-₹25 lakh per year. Students from ${district.name} also apply to colleges in nearby districts and across ${state.name}. Use our college directory and predictor to find the best options for your NEET rank.`
    }
    return `${district.name} currently does not have any NMC-approved medical colleges within its boundaries. Students from ${district.name} typically apply to medical colleges in nearby districts within ${state.name} and across India through both AIQ and state counselling. Contact our counsellors to explore the best options for your rank and preferences.`
  }
  if (h.includes('cutoff')) {
    return `NEET cutoff ranks for medical colleges ${collegeCount > 0 ? 'in ' + district.name : 'accessible to ' + district.name + ' students'} vary by institution type and category. Government college closing ranks are typically higher than private colleges. General category cutoffs are the highest, followed by OBC-NCL, EWS, SC, and ST. Cutoff trends depend on NEET exam difficulty, number of applicants, and seat availability each year. Check our cutoff tables above for detailed college-wise opening and closing ranks.`
  }
  if (h.includes('fee') || h.includes('fee structure')) {
    return `Medical college fees ${collegeCount > 0 ? 'in ' + district.name : 'for ' + district.name + ' students'} vary significantly by college type. Government colleges charge ₹10,000–₹1,00,000 per year, making them the most affordable option. Private colleges charge ₹5–₹25 lakh per year. Deemed universities and NRI quota seats have higher fee structures. Hostel and miscellaneous fees are additional. Use our fee comparison table above for college-wise details. Our counsellors can help you plan your finances and explore education loan options.`
  }
  if (h.includes('document')) {
    return `Essential documents for NEET counselling include: NEET ${new Date().getFullYear()} Admit Card, NEET Scorecard/Rank Letter, Class 10 Certificate (date of birth proof), Class 12 Marksheet, Aadhaar Card, Passport-size photographs, and ${state.name} Domicile Certificate (for state quota). Category certificate (SC/ST/OBC-NCL/EWS) if applicable, PwD certificate if applicable, and income certificate for EWS. Ensure all documents are self-attested and carry multiple sets for verification.`
  }
  if (h.includes('choice')) {
    return `Choice filling is a critical step in NEET counselling. List colleges in ${district.name} and nearby districts in order of genuine preference. Fill all 300 available choices across different colleges and courses — do not leave any slots empty. Use a mix of dream colleges, realistic options, and safe backups. Lock your choices before the scheduled deadline — unlocked choices are not considered in seat allotment. Our expert counsellors provide personalised choice filling strategy based on your NEET rank and category.`
  }
  if (h.includes('date') || h.includes('schedule')) {
    return `NEET counselling ${new Date().getFullYear()} follows a structured schedule. MCC Round 1 registration typically starts in July, followed by choice filling and seat allotment. ${state.name} state counselling dates are announced separately by ${state.counsellingAuthority || 'the state counselling authority'}. Multiple rounds are conducted including mop-up and stray vacancy rounds. Subscribe to our updates for real-time notifications about important deadlines and schedule changes for ${district.name} students.`
  }
  if (h.includes('faq') || h.includes('question')) {
    return `Find answers to common questions about NEET counselling for ${district.name}, ${state.name}. Topics include eligibility criteria, required documents, choice filling strategy, seat allotment process, college selection tips, fee payment, and reporting procedures. Our comprehensive FAQ section covers both MCC and ${state.name} state counselling processes.`
  }
  if (h.includes('seat')) {
    return `MBBS seat distribution in ${district.name} includes 15% All India Quota seats (filled by MCC) and 85% state quota seats (filled by ${state.name} state counselling). ${collegeCount > 0 ? `Medical colleges in ${district.name} offer MBBS seats through both AIQ and state quota. ` : ''}Private and deemed university management quota and NRI quota seats are also available. Check the seat matrix table above for college-wise and course-wise seat distribution.`
  }
  if (h.includes('government')) {
    if (govtCount > 0) return `${district.name} has ${govtCount} government medical college(s) offering affordable MBBS education with fees as low as ₹10,000–₹1,00,000 per year. Admission is through NEET UG counselling — 15% AIQ seats through MCC and 85% state quota through ${state.name} counselling. Government colleges are the most sought-after due to their low fees and quality education.`
    return `${district.name} does not have government medical colleges. Students seeking affordable MBBS education at government colleges can apply to colleges in nearby districts through ${state.name} state counselling or explore central institutions through AIQ counselling.`
  }
  if (h.includes('private')) {
    if (pvtCount > 0) return `${district.name} has ${pvtCount} private medical college(s) offering MBBS at higher fees (₹5–₹25 lakh/year). These colleges offer management quota and NRI quota seats in addition to regular merit seats through counselling. Deemed universities may have higher fee structures.`
    return `While ${district.name} does not have private medical colleges, students can explore private options in other districts of ${state.name} and across India. Private college fees range from ₹5–₹25 lakh per year with management and NRI quota options available.`
  }
  if (h.includes('mcc')) {
    return `MCC (Medical Counselling Committee) conducts NEET counselling for 15% All India Quota seats in government colleges, all seats in deemed universities, central universities, ESIC, AIIMS, and JIPMER. ${district.name} students must register on mcc.nic.in to participate. MCC counselling has multiple rounds including mop-up and stray vacancy. All India Rank (AIR) determines seat allocation in AIQ counselling.`
  }
  if (h.includes('state counselling') || h.includes('state quota')) {
    return `${state.name} state counselling covers 85% of government college seats. ${district.name} students need valid ${state.name} domicile to claim state quota benefits. The counselling is conducted by ${state.counsellationAuthority || state.name + ' counselling authority'}. State counselling typically starts after the first round of MCC counselling. Reservation policies as per ${state.name} state government norms apply.`
  }
  if (h.includes('reservation')) {
    return `${state.name} follows central reservation policy (SC 15%, ST 7.5%, OBC-NCL 27%, EWS 10%, PwD 5%) plus any state-specific reservations. ${district.name} students should check their category eligibility and keep relevant certificates ready for verification during counselling.`
  }
  if (h.includes('news') || h.includes('update') || h.includes('alert')) {
    return `Stay informed about the latest NEET counselling ${new Date().getFullYear()} updates for ${district.name}, ${state.name}. Get real-time information about registration deadlines, seat allotment results, cutoff announcements, counselling rounds, and important notifications from MCC and ${state.name} counselling authorities.`
  }
  if (h.includes('trend') || h.includes('prediction') || h.includes('expected')) {
    return `Expected NEET cutoff for ${district.name} colleges is based on previous year trends, exam difficulty, and seat availability. ${collegeCount > 0 ? `Colleges in ${district.name} have shown consistent cutoff trends over the past few years.` : ''} Use our college predictor with your NEET rank and category to estimate your chances at specific colleges.`
  }
  return `${district.name} is a district in ${state.name} with ${collegeCount} medical college(s) (${govtCount} government, ${pvtCount} private). Our comprehensive NEET counselling guide provides detailed information about ${h2.toLowerCase()} to help students from ${district.name} successfully navigate the ${new Date().getFullYear()} admission process.`
}


