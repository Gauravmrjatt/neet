import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCounselors } from '@/lib/queries'
import { getPageSeoByPath } from '@/lib/page-seo'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Media } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/josaa-counsellor')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'JOSAA Counselling Experts — IIT/NIT Admission Guidance 2026',
    description: pageSeo?.metaDescription || 'Get expert JOSAA counselling guidance for IIT, NIT, and IIIT admissions. Our experienced counsellors help you navigate the JOSAA seat allocation process.',
    path: '/josaa-counsellor',
    ogImage: pageSeo?.ogImage || undefined,
  })
}

export default async function JosaaCounsellorPage() {
  const pageSeo = await getPageSeoByPath('/josaa-counsellor')
  const { docs: counselors } = await getCounselors({ specialization: 'josaa' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'JOSAA Counselling', url: `${siteUrl}/josaa-counsellor` },
      ])} />
      <PageHero
        badge="JOSAA Counselling"
        title="JOSAA Counselling Experts"
        subtitle="Get personalized guidance for the JOSAA counselling process. Our experienced counsellors will help you understand the process, choose the right colleges, and maximize your chances of admission."
      />

      <div className="bg-primary-navy py-8 text-center -mt-px">
        <Container>
          <Button
            asChild
            size="lg"
            className="bg-button-gold hover:bg-button-gold-hover text-primary-navy font-semibold"
          >
            <Link href="/contact">Get Started</Link>
          </Button>
        </Container>
      </div>

      <Section className="bg-navbar-bg/30">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
              Our JOSAA Experts
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Counsellors specialized in JOSAA counselling process
            </p>
          </div>

          {counselors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {counselors.map((counselor: any) => {
                const imageUrl = typeof counselor.image === 'object' ? counselor.image?.url : null
                return (
                  <div
                    key={counselor.id}
                    className="rounded-xl border border-border bg-card p-6 text-center transition hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {imageUrl ? (
                      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-primary-navy/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={counselor.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-navy text-2xl font-bold text-white">
                        {counselor.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="mt-4 text-lg font-bold text-primary-navy">{counselor.name}</h3>
                    <p className="text-sm text-muted-foreground">{counselor.designation}</p>
                    {counselor.experience && (
                      <p className="mt-1 text-xs text-primary-navy/70 font-medium">
                        {counselor.experience} years experience
                      </p>
                    )}
                    {counselor.specializations && counselor.specializations.length > 0 && (
                      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                        {counselor.specializations.map((s: any, i: number) => (
                          <span
                            key={s.id || i}
                            className="rounded-full bg-primary-navy/10 text-primary-navy px-2.5 py-0.5 text-xs font-medium capitalize"
                          >
                            {typeof s.specialization === 'object' && s.specialization !== null
                              ? s.specialization.name
                              : s.specialization}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <p className="text-lg font-semibold text-primary-navy">No JOSAA counsellors listed yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Our JOSAA specialists will appear here once added.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
