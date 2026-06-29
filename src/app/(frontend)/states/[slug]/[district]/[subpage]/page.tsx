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
import { templates, type TemplateContext } from '@/lib/templates/district-content-templates'

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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {content?.content ? (
                <div className="prose prose-lg max-w-none prose-headings:text-primary-navy">
                  <RichText content={content.content} />
                </div>
              ) : templateOutput ? (
                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none prose-headings:text-primary-navy">
                    <p>{templateOutput.metaDescription}</p>
                  </div>

                  {templateOutput.h2s.map((h2, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-6">
                      <h2 className="text-xl font-bold text-primary-navy mb-4">{h2}</h2>
                      <p className="text-foreground/80">
                        {getH2Placeholder(h2, district, state, colleges.docs.length)}
                      </p>
                    </div>
                  ))}

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
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">{label}</h2>
                  <p className="text-foreground/70">
                    Content for {label.toLowerCase()} in {district.name} is being prepared. Check our main counselling guide for now.
                  </p>
                </div>
              )}

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
              <NearbyDistricts districts={nearbyDistricts} stateSlug={state.slug} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

function getH2Placeholder(h2: string, district: any, state: any, collegeCount: number): string {
  if (h2.toLowerCase().includes('overview') || h2.toLowerCase().includes('introduction')) {
    return `${district.name} is a district in ${state.name}. NEET counselling for ${district.name} students involves registration with MCC (for AIQ seats) and ${state.counsellingAuthority || state.name + ' state counselling authority'} for state quota seats. The district has ${collegeCount} medical college(s).`
  }
  if (h2.toLowerCase().includes('college')) {
    return `${district.name} has ${collegeCount} medical college(s). Students from ${district.name} also apply to colleges in nearby districts and across ${state.name}. Use our college directory to explore options.`
  }
  if (h2.toLowerCase().includes('cutoff')) {
    return `NEET cutoff for ${district.name} medical colleges varies by institution and category. Government college cutoffs are typically higher. Check detailed cutoff data for specific colleges in ${district.name}.`
  }
  if (h2.toLowerCase().includes('fee') || h2.toLowerCase().includes('fee structure')) {
    return `Medical college fees in ${district.name} vary by college type. Government colleges charge ₹10,000-₹1,00,000 per year. Private colleges charge ₹5-25 lakh per year. Check our fee guide for detailed information.`
  }
  if (h2.toLowerCase().includes('document')) {
    return `Essential documents for NEET counselling in ${district.name} include: NEET Admit Card, Scorecard, Class 10 & 12 marksheets, Aadhaar Card, passport photos, and ${state.name} domicile certificate for state quota.`
  }
  if (h2.toLowerCase().includes('choice')) {
    return `For choice filling, list colleges in ${district.name} and nearby districts in order of genuine preference. Fill all 300 choices for MCC counselling. Use our college predictor to build a data-driven strategy.`
  }
  if (h2.toLowerCase().includes('date') || h2.toLowerCase().includes('schedule')) {
    return `NEET counselling ${new Date().getFullYear()} dates for ${district.name} follow the MCC and ${state.name} state counselling schedules. Registration typically starts in July. Stay updated with our important dates page.`
  }
  if (h2.toLowerCase().includes('faq') || h2.toLowerCase().includes('question')) {
    return `Find answers to common questions about NEET counselling in ${district.name}, including eligibility, documents, choice filling, seat allotment, and college selection.`
  }
  if (h2.toLowerCase().includes('seat')) {
    return `MBBS seat distribution in ${district.name} colleges includes AIQ seats (15%), state quota seats (85%), and management quota seats in private colleges. Check the seat matrix for college-wise breakdown.`
  }
  if (h2.toLowerCase().includes('government')) {
    const govtColleges = collegeCount > 0 ? `${district.name} has government medical colleges offering affordable MBBS education with fees as low as ₹10,000 per year.` : `${district.name} does not have government medical colleges. Students typically apply to government colleges in nearby districts.`
    return govtColleges
  }
  if (h2.toLowerCase().includes('private')) {
    return `Private medical colleges in nearby areas offer MBBS at higher fees with management and NRI quota seats. Fees range from ₹5-25 lakh per year depending on the institution.`
  }
  if (h2.toLowerCase().includes('mcc')) {
    return `MCC (Medical Counselling Committee) conducts NEET counselling for 15% All India Quota seats. ${district.name} students must register on mcc.nic.in for AIQ seats in addition to ${state.name} state counselling.`
  }
  if (h2.toLowerCase().includes('state counselling') || h2.toLowerCase().includes('state quota')) {
    return `${state.name} state counselling covers 85% of government college seats. ${district.name} students need valid ${state.name} domicile to claim state quota benefits. The counselling is conducted by ${state.counsellingAuthority || state.name + ' counselling authority'}.`
  }
  return `Information about ${h2.toLowerCase()} for NEET counselling in ${district.name}, ${state.name}.`
}
