import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStateBySlug, getCounsellingByState, getCollegesByState } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateFAQSchema, generateArticleSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CounsellingCard } from '@/components/counselling/CounsellingCard'
import { CollegeCard } from '@/components/colleges/CollegeCard'
import { Disclaimer } from '@/components/shared/Disclaimer'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const state: any = await getStateBySlug(slug)
  if (!state) return { title: 'Not Found' }
  const seoKeywords = state.seo?.keywords?.map((k: any) => k.keyword).filter(Boolean)
  return generateSEOMetadata({
    title: state.seo?.metaTitle || `${state.name} NEET Counselling 2026 — Complete Guide`,
    description: state.seo?.metaDescription || `Complete NEET counselling guide for ${state.name}. Find counselling authority, important dates, eligibility, documents, and medical colleges.`,
    path: `/counselling/state/${state.slug}`,
    ogImage: state.seo?.ogImage,
    keywords: seoKeywords,
  })
}

export default async function StateDetailPage({ params }: PageProps) {
  const { slug } = await params
  const state: any = await getStateBySlug(slug)
  if (!state) notFound()

  const [counsellingPosts, colleges] = await Promise.all([
    getCounsellingByState(slug),
    getCollegesByState(slug),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateArticleSchema({
        title: `${state.name} NEET Counselling 2026`,
        description: state.description ? `Complete NEET counselling guide for ${state.name}` : undefined,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        authorName: 'NEET Counselling Experts',
        publisherLogo: `${siteUrl}/logo.png`,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'State Counselling', url: `${siteUrl}/counselling/state` },
        { name: state.name, url: `${siteUrl}/counselling/state/${state.slug}` },
      ])} />
      {state.importantDates && state.importantDates.length > 0 && <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: state.importantDates.map((d: any) => ({
          '@type': 'Question',
          name: `When is ${d.label} for ${state.name} NEET counselling?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${d.label}: ${d.date || 'Tentative'}. ${d.description || ''}`.trim(),
          },
        })),
      }} />}

      <PageHero
        badge={state.code || ''}
        title={`${state.name} NEET Counselling 2026`}
        subtitle={state.counsellingAuthority ? `Authority: ${state.counsellingAuthority}` : `Complete counselling guide for ${state.name}`}
      />

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {state.description && (
                <div className="prose prose-lg max-w-none prose-headings:text-primary-navy">
                  <RichText content={state.description} />
                </div>
              )}

              {state.counsellingProcess && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Counselling Process</h2>
                  <p className="text-foreground/80">{state.counsellingProcess}</p>
                </div>
              )}

              {state.importantDates && state.importantDates.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Important Dates</h2>
                  <div className="divide-y divide-border">
                    {state.importantDates.map((date: any, i: number) => (
                      <div key={i} className="py-3 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-primary-navy">{date.label}</p>
                          {date.description && (
                            <p className="text-sm text-foreground/70 mt-0.5">{date.description}</p>
                          )}
                        </div>
                        {date.date && (
                          <span className="shrink-0 rounded-full bg-button-gold/15 px-3 py-1 text-sm font-semibold text-primary-navy">
                            {date.date}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {state.counsellingWebsite && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-2">Official Website</h2>
                  <a
                    href={state.counsellingWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-navy underline hover:text-button-gold-hover"
                  >
                    {state.counsellingWebsite}
                  </a>
                </div>
              )}

              {state.eligibilityNotes && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Eligibility</h2>
                  <div className="prose prose-sm max-w-none prose-headings:text-primary-navy">
                    <RichText content={state.eligibilityNotes} />
                  </div>
                </div>
              )}

              {state.documentRequirements && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Required Documents</h2>
                  <div className="prose prose-sm max-w-none prose-headings:text-primary-navy">
                    <RichText content={state.documentRequirements} />
                  </div>
                </div>
              )}

              {state.reservationPolicy && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Reservation Policy</h2>
                  <div className="prose prose-sm max-w-none prose-headings:text-primary-navy">
                    <RichText content={state.reservationPolicy} />
                  </div>
                </div>
              )}

              {state.feeStructureNotes && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-primary-navy mb-4">Fee Structure</h2>
                  <div className="prose prose-sm max-w-none prose-headings:text-primary-navy">
                    <RichText content={state.feeStructureNotes} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-primary-navy">Quick Info</h3>
                </CardHeader>
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
                  {colleges.docs.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Medical Colleges</span>
                      <span className="font-semibold text-primary-navy">{colleges.docs.length}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {(counsellingPosts as any).docs.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="font-bold text-primary-navy">Guides</h3>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(counsellingPosts as any).docs.map((post: any) => (
                      <Link
                        key={post.id}
                        href={`/counselling/${post.slug}`}
                        className="block text-sm text-primary-navy hover:text-button-gold-hover transition-colors"
                      >
                        {post.title}
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}

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

      <Section>
        <Container className="max-w-4xl">
          <Disclaimer type="educational" />
        </Container>
      </Section>
      {colleges.docs.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Medical Colleges in {state.name}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {colleges.docs.map((college: any) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section tone="cream">
        <Container>
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h2 className="text-2xl font-bold text-primary-navy mb-4">
              {state.name} NEET Counselling 2026
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
              Get expert guidance for {state.name} NEET counselling. Our experienced counsellors help you navigate the admission process, choose the right college, and secure your seat.
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
                View All Colleges
              </Link>
              <Link
                href="/counselling"
                className="inline-flex items-center rounded-lg border border-border bg-card px-6 py-3 font-semibold text-primary-navy hover:bg-muted transition-colors"
              >
                All Counselling Guides
              </Link>
            </div>
            <p className="mt-4 text-sm text-foreground/60">
              Need one-on-one help? <Link href="/counsellors" className="underline text-primary-navy hover:text-button-gold-hover">Find a counsellor near you</Link>
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
