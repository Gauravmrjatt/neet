import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getUpcomingSessions } from '@/lib/queries'
import { getPageSeoByPath } from '@/lib/page-seo'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { formatDate } from '@/lib/utils'
import { Counselor } from '@/payload-types'
import { RichText } from '@/components/shared/RichText'

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/live-counselling')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'Live NEET Counselling Sessions — Expert Q&A & Guidance 2026',
    description: pageSeo?.metaDescription || 'Join live NEET counselling sessions and Q&A with expert counsellors. Get real-time answers about MBBS admission, college selection, and counselling process.',
    path: '/live-counselling',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function LiveCounsellingPage() {
  const pageSeo = await getPageSeoByPath('/live-counselling')
  const { docs: sessions } = await getUpcomingSessions()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'Live Counselling', url: `${siteUrl}/live-counselling` },
      ])} />
      <PageHero
        badge="Live Sessions"
        title="Live Counselling"
        subtitle="Join live counselling sessions and Q&A with our expert counsellors"
      />
      <Section className="bg-navbar-bg/30">
        <Container>
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {sessions.map((session: any) => {
                const counsellor = typeof session.counsellor === 'object' ? session.counsellor as Counselor : null
                const isLive = session.status === 'live'
                return (
                  <Link
                    key={session.id}
                    href={`/live-counselling/${session.id}`}
                    className="block rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold text-primary-navy">{session.title}</h2>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          isLive
                            ? 'bg-destructive/10 text-destructive border border-destructive/30'
                            : 'bg-primary-navy/10 text-primary-navy'
                        }`}
                      >
                        {isLive && (
                          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
                        )}
                        {isLive ? 'Live' : 'Upcoming'}
                      </span>
                    </div>

                    {session.description && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        <RichText content={session.description} />
                      </div>
                    )}

                    <div className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-primary-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(session.scheduledAt)}</span>
                      </div>
                      {session.duration && (
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-primary-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{session.duration}</span>
                        </div>
                      )}
                      {counsellor && (
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-primary-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-primary-navy">{counsellor.name}</span>
                        </div>
                      )}
                    </div>

                    {session.meetingUrl && isLive && (
                      <div className="mt-6">
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center rounded-md bg-button-gold hover:bg-button-gold-hover text-primary-navy px-4 py-2.5 text-sm font-bold transition-colors"
                        >
                          Join Live Session
                        </a>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <p className="text-lg font-semibold text-primary-navy">No upcoming live sessions</p>
              <p className="mt-2 text-sm text-muted-foreground">Check back soon for new sessions.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
