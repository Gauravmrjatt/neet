import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCollegeBySlug, getColleges, getCutoffRecords, getCutoffRecordsForColleges } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateCollegeOrUniversitySchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CutoffRecordsTable } from '@/components/colleges/CutoffRecordsTable'
import { CollegeCard } from '@/components/colleges/CollegeCard'
import { Disclaimer } from '@/components/shared/Disclaimer'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const college: any = await getCollegeBySlug(slug)
  if (!college) return { title: 'Not Found' }
  const stateName = typeof college.state === 'object' ? college.state?.name : ''
  const seoKeywords = college.seo?.keywords?.map((k: any) => k.keyword).filter(Boolean)
  return generateSEOMetadata({
    title: college.seo?.metaTitle || `${college.name} — MBBS Fees, Cutoff, Admission 2026`,
    description: college.seo?.metaDescription || `${college.name} ${stateName} — MBBS fees, cutoff ranks, seat matrix, and admission process 2026. NMC-approved medical college.`,
    path: `/colleges/${college.slug}`,
    ogImage: college.seo?.ogImage || college.image,
    keywords: seoKeywords,
  })
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params
  const college: any = await getCollegeBySlug(slug)
  if (!college) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const stateName = typeof college.state === 'object' ? college.state?.name : ''
  const stateSlug = typeof college.state === 'object' ? college.state?.slug : ''

  const [cutoffRecords, { docs: similarColleges }] = await Promise.all([
    getCutoffRecords({ collegeId: college.id, limit: 500 }),
    getColleges({ stateSlug: stateSlug || undefined, limit: 4 }),
  ])
  const filteredSimilar = similarColleges.filter((c: any) => c.id !== college.id).slice(0, 3)
  const similarIds = filteredSimilar.map((c: any) => c.id)
  const similarCutoffMap = similarIds.length > 0 ? await getCutoffRecordsForColleges(similarIds) : new Map()

  const typeLabels: Record<string, string> = {
    government: 'Government',
    private: 'Private',
    deemed: 'Deemed University',
    central: 'Central University',
  }

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Colleges', url: `${siteUrl}/colleges` },
        { name: college.name, url: `${siteUrl}/colleges/${college.slug}` },
      ])} />
      <JsonLd data={generateCollegeOrUniversitySchema({
        name: college.name,
        description: college.seo?.metaDescription,
        url: `${siteUrl}/colleges/${college.slug}`,
        image: college.image?.url || college.seo?.ogImage?.url,
        city: college.city,
        state: stateName,
        courses: college.courses?.map((c: any) => c.course).filter(Boolean),
        established: college.established,
        ranking: college.ranking,
      })} />

      <PageHero
        badge={typeLabels[college.type] || college.type}
        title={college.name}
        subtitle={[stateName, college.city].filter(Boolean).join(', ')}
      />

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {college.description && (
                <div className="prose prose-lg max-w-none prose-headings:text-primary-navy">
                  <RichText content={college.description} />
                </div>
              )}

              {college.courses && college.courses.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Courses & Seats</h2>
                  <div className="divide-y divide-border">
                    {college.courses.map((course: any, i: number) => (
                      <div key={i} className="py-3 flex items-center justify-between">
                        <span className="font-medium text-primary-navy">{course.course}</span>
                        <div className="flex items-center gap-4 text-sm text-foreground/70">
                          {course.duration && <span>Duration: {course.duration}</span>}
                          {course.seats && <span>Seats: {course.seats}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {college.feeStructure && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Fee Structure</h2>
                  <div className="space-y-3 text-sm">
                    {college.feeStructure.mbbsAnnual && (
                      <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-foreground/70">Annual MBBS Fee</span>
                        <span className="font-semibold text-primary-navy">₹{college.feeStructure.mbbsAnnual.toLocaleString()}</span>
                      </div>
                    )}
                    {college.feeStructure.totalCourseFee && (
                      <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-foreground/70">Total Course Fee</span>
                        <span className="font-semibold text-primary-navy">{college.feeStructure.totalCourseFee}</span>
                      </div>
                    )}
                    {college.feeStructure.hostelFee && (
                      <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-foreground/70">Hostel Fee</span>
                        <span className="font-semibold text-primary-navy">₹{college.feeStructure.hostelFee.toLocaleString()}</span>
                      </div>
                    )}
                    {college.feeStructure.otherFees && (
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Other Fees</span>
                        <span className="font-semibold text-primary-navy">{college.feeStructure.otherFees}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {cutoffRecords.length > 0 && (
                <CutoffRecordsTable records={cutoffRecords} />
              )}

              {college.features && college.features.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Key Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {college.features.map((f: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                        <span className="h-2 w-2 rounded-full bg-button-gold shrink-0" />
                        {f.feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-primary-navy">Quick Facts</h3>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {college.type && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Type</span>
                      <Badge variant="secondary">{typeLabels[college.type]}</Badge>
                    </div>
                  )}
                  {college.accreditation && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Accreditation</span>
                      <span className="font-semibold text-primary-navy">{college.accreditation.toUpperCase()}</span>
                    </div>
                  )}
                  {college.established && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Established</span>
                      <span className="font-semibold text-primary-navy">{college.established}</span>
                    </div>
                  )}
                  {college.hospitalInfo?.hospitalBeds && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Hospital Beds</span>
                      <span className="font-semibold text-primary-navy">{college.hospitalInfo.hospitalBeds}</span>
                    </div>
                  )}
                  {college.website && (
                    <div className="pt-2">
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-navy underline hover:text-button-gold-hover text-sm"
                      >
                        Visit Website →
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="rounded-xl bg-primary-navy p-6 text-white text-center">
                <h3 className="font-bold text-lg mb-2">Want to Get Into {college.name}?</h3>
                <p className="text-white/80 text-sm mb-4">Our counsellors can help you plan your admission strategy</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-lg bg-button-gold px-4 py-2 text-sm font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
                >
                  Get Guidance
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-4xl">
          <Disclaimer type="educational" />
        </Container>
      </Section>
      {filteredSimilar.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold text-primary-navy mb-6">
              Similar Colleges in {stateName}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {filteredSimilar.map((c: any) => (
                <CollegeCard key={c.id} college={c} bestCutoff={similarCutoffMap.get(c.id) || null} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
