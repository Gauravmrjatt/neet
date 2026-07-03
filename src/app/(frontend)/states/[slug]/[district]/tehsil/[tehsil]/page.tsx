import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStateBySlug } from '@/lib/queries'
import { getDistrictBySlug, getCollegesByDistrict } from '@/lib/queries/districts'
import { getTehsilBySlug, getCollegesByTehsil, getTehsilsByDistrict } from '@/lib/queries/tehsils'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateArticleSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { Disclaimer } from '@/components/shared/Disclaimer'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string; district: string; tehsil: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, district: districtSlug, tehsil: tehsilSlug } = await params
  const state: any = await getStateBySlug(slug)
  const district: any = await getDistrictBySlug(districtSlug, slug)
  const tehsil: any = await getTehsilBySlug(tehsilSlug, districtSlug, slug)
  if (!state || !district || !tehsil) return { title: 'Not Found' }
  return generateSEOMetadata({
    title: tehsil.seo?.metaTitle || `${tehsil.name} NEET Counselling ${new Date().getFullYear()} — ${district.name}, ${state.name}`,
    description: tehsil.seo?.metaDescription || `Complete NEET counselling guide for ${tehsil.name} tehsil, ${district.name}, ${state.name}. Find medical colleges, cutoff marks, fee structure, and counselling process for students from ${tehsil.name}.`,
    path: `/states/${state.slug}/${district.slug}/tehsil/${tehsil.slug}`,
  })
}

export default async function TehsilHubPage({ params }: PageProps) {
  const { slug, district: districtSlug, tehsil: tehsilSlug } = await params
  const state: any = await getStateBySlug(slug)
  if (!state) notFound()

  const district: any = await getDistrictBySlug(districtSlug, slug)
  if (!district) notFound()

  const tehsil: any = await getTehsilBySlug(tehsilSlug, districtSlug, slug)
  if (!tehsil) notFound()

  const [tehsilColleges, districtColleges, tehsilsInDistrict] = await Promise.all([
    getCollegesByTehsil(tehsil.id),
    getCollegesByDistrict(district.id),
    getTehsilsByDistrict(district.id),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const collegeCount = tehsilColleges.docs.length
  const districtCollegeCount = districtColleges.docs.length

  return (
    <>
      <JsonLd data={generateArticleSchema({
        title: `${tehsil.name} NEET Counselling ${new Date().getFullYear()}`,
        description: `Complete NEET counselling guide for ${tehsil.name} tehsil, ${district.name}, ${state.name}`,
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
        { name: tehsil.name, url: `${siteUrl}/states/${state.slug}/${district.slug}/tehsil/${tehsil.slug}` },
      ])} />

      <PageHero
        badge={`${tehsil.name}, ${district.name}`}
        title={`${tehsil.name} NEET Counselling ${new Date().getFullYear()}`}
        subtitle="Comprehensive tehsil-level counselling guide with college information, fee details, and admission strategy."
      />

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-bold text-primary-navy mb-3">NEET Counselling for Students from {tehsil.name}</h2>
                <p className="text-foreground/80 leading-relaxed">
                  {tehsil.name} is a tehsil in {district.name} district, {state.name}. Students from {tehsil.name} 
                  aspiring for MBBS and medical courses appear for NEET UG and participate in counselling through 
                  MCC for All India Quota seats and {state.counsellingAuthority || state.name + ' state counselling authority'} 
                  for state quota seats.
                  {collegeCount > 0
                    ? ` ${tehsil.name} has ${collegeCount} medical college(s) within its boundaries. Students also have access to ${districtCollegeCount} medical colleges across ${district.name} district.`
                    : ` There are no NMC-approved medical colleges directly in ${tehsil.name}. Students typically apply to ${districtCollegeCount} medical colleges across ${district.name} district and other institutions in ${state.name}.`
                  }
                  {' '}Our expert counsellors provide personalised guidance for college selection, choice filling strategy,
                  document verification, and seat allotment tracking.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-lg bg-button-gold px-5 py-2.5 text-sm font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
                  >
                    Get Free Counselling
                  </Link>
                  <Link
                    href={`https://wa.me/919509698208?text=${encodeURIComponent(`Hi, I need NEET counselling guidance for ${tehsil.name}, ${district.name}, ${state.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-primary-navy hover:bg-muted transition-colors"
                  >
                    Chat on WhatsApp
                  </Link>
                </div>
              </div>

              {collegeCount > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-primary-navy">Medical Colleges in {tehsil.name}</h2>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-primary-navy text-white">
                            <th className="px-4 py-3 text-left font-semibold">College</th>
                            <th className="px-4 py-3 text-left font-semibold">Type</th>
                            <th className="px-4 py-3 text-right font-semibold">Annual Fee</th>
                            <th className="px-4 py-3 text-right font-semibold">Gen. Cutoff</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tehsilColleges.docs.map((c: any, i: number) => {
                            const feeDisplay = c.feeStructure?.mbbsAnnual
                              ? `₹${(c.feeStructure.mbbsAnnual / 100000).toFixed(1)}L`
                              : c.feeStructure?.totalCourseFee || '—'
                            const cutoffDisplay = c.cutoffs?.general
                              ? c.cutoffs.general.toLocaleString()
                              : '—'
                            return (
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
                                <td className="px-4 py-3 text-right text-foreground/70">{feeDisplay}</td>
                                <td className="px-4 py-3 text-right font-semibold text-primary-navy">{cutoffDisplay}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {collegeCount === 0 && districtCollegeCount > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-3">Nearby Medical Colleges</h2>
                  <p className="text-foreground/80 mb-4">
                    While {tehsil.name} does not have medical colleges within its boundaries, students can apply to
                    colleges across {district.name} district and nearby areas in {state.name}.
                  </p>
                  <div className="rounded-lg bg-primary-navy/5 p-4">
                    <p className="text-sm text-foreground/70">
                      <span className="font-semibold text-primary-navy">{districtCollegeCount}</span> medical colleges
                      available in {district.name} district. Contact our counsellors for personalised college
                      recommendations based on your NEET rank and category.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/states/${state.slug}/${district.slug}/all-medical-colleges`}
                      className="inline-flex items-center rounded-lg bg-primary-navy px-4 py-2 text-sm font-semibold text-white hover:bg-primary-navy/90 transition-colors"
                    >
                      View All {district.name} Colleges
                    </Link>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-bold text-primary-navy mb-3">Counselling Process</h2>
                <p className="text-foreground/80 leading-relaxed">
                  The NEET counselling process for students from {tehsil.name} involves several steps:
                  registration on the official counselling portal, document upload and verification,
                  choice filling where you list preferred colleges and courses, seat allotment based
                  on your NEET rank and preferences, and finally reporting to the allotted college.
                  Students from {tehsil.name} participate in both MCC counselling (for 15% All India Quota)
                  and {state.name} state counselling (for 85% state quota seats).
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-primary-navy to-blue-900 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Get Personalised NEET Counselling</h3>
                <p className="text-white/80 text-sm mb-4">
                  Our experienced counsellors provide one-on-one guidance for students from {tehsil.name}. 
                  Get help with college selection, choice filling strategy, document preparation, and 
                  seat allotment tracking throughout the counselling process.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-lg bg-button-gold px-5 py-2.5 text-sm font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
                  >
                    Book a Free Session
                  </Link>
                  <Link
                    href={`https://wa.me/919509698208?text=${encodeURIComponent(`Hi, I need NEET counselling guidance for ${tehsil.name}, ${district.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/25 transition-colors"
                  >
                    Chat on WhatsApp
                  </Link>
                </div>
                <p className="text-white/60 text-xs mt-3">
                  Trusted by thousands of students across {state.name}.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-bold text-primary-navy text-lg">Quick Facts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Tehsil</span>
                      <span className="font-semibold text-primary-navy">{tehsil.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">District</span>
                      <span className="font-semibold text-primary-navy">{district.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">State</span>
                      <span className="font-semibold text-primary-navy">{state.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Medical Colleges</span>
                      <span className="font-semibold text-primary-navy">{collegeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total in District</span>
                      <span className="font-semibold text-primary-navy">{districtCollegeCount}</span>
                    </div>
                    {tehsil.lgdCode && (
                      <div className="flex justify-between">
                        <span className="text-foreground/70">LGD Code</span>
                        <span className="font-semibold text-primary-navy">{tehsil.lgdCode}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {tehsilsInDistrict.docs.length > 1 && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-primary-navy mb-3 text-sm">Tehsils in {district.name}</h3>
                    <div className="space-y-1">
                      {tehsilsInDistrict.docs.map((t: any) => (
                        <Link
                          key={t.id}
                          href={`/states/${state.slug}/${district.slug}/tehsil/${t.slug}`}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            t.id === tehsil.id
                              ? 'bg-primary-navy text-white font-medium'
                              : 'text-foreground/70 hover:bg-muted hover:text-primary-navy'
                          }`}
                        >
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

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

              <Card>
                <CardContent className="p-5">
                  <h3 className="font-bold text-primary-navy mb-2 text-sm">Quick Links</h3>
                  <div className="space-y-2">
                    <Link href={`/states/${state.slug}/${district.slug}`} className="block text-sm text-primary-navy hover:underline">
                      {district.name} District Hub
                    </Link>
                    <Link href={`/states/${state.slug}/${district.slug}/cutoff`} className="block text-sm text-primary-navy hover:underline">
                      {district.name} Cutoff
                    </Link>
                    <Link href={`/states/${state.slug}/${district.slug}/fees`} className="block text-sm text-primary-navy hover:underline">
                      {district.name} Fee Structure
                    </Link>
                    <Link href={`/counselling/state/${state.slug}`} className="block text-sm text-primary-navy hover:underline">
                      {state.name} Counselling
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container className="max-w-4xl">
          <Disclaimer type="educational" />
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h2 className="text-2xl font-bold text-primary-navy mb-4">
              Need Help with {tehsil.name} NEET Counselling?
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
              Get expert guidance for NEET counselling in {tehsil.name}, {district.name}, {state.name}. 
              Our counsellors help with college selection, choice filling, and admission strategy.
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
