import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSessionById } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { RichText } from '@/components/shared/RichText'
import { formatDate } from '@/lib/utils'
import { Counselor } from '@/payload-types'

interface SessionDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: SessionDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const session = await getSessionById(id)
  if (!session) return { title: 'Session Not Found' }
  const seo = (session as any).seo
  return generateSEOMetadata({
    title: seo?.metaTitle || session.title,
    description: seo?.metaDescription || `Join ${session.title} — a live NEET counselling session${session.duration ? ` (${session.duration})` : ''}. Get expert guidance on MBBS admission and college selection.`,
    ogImage: seo?.ogImage || undefined,
    path: `/live-counselling/${id}`,
  })
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = await params
  const session = await getSessionById(id)

  if (!session) notFound()

  const counsellor = typeof session.counsellor === 'object' ? session.counsellor as Counselor : null
  const isLive = session.status === 'live'
  const isScheduled = session.status === 'scheduled'
  const isCompleted = session.status === 'completed'

  const statusConfig = {
    live: {
      label: 'Live',
      classes: 'bg-destructive/10 text-destructive border border-destructive/30',
      pulse: true,
    },
    scheduled: {
      label: 'Upcoming',
      classes: 'bg-primary-navy/10 text-primary-navy',
      pulse: false,
    },
    completed: {
      label: 'Completed',
      classes: 'bg-muted text-muted-foreground',
      pulse: false,
    },
    cancelled: {
      label: 'Cancelled',
      classes: 'bg-destructive/5 text-destructive/70',
      pulse: false,
    },
  }

  const status = statusConfig[session.status as keyof typeof statusConfig] || statusConfig.scheduled

  return (
    <>
      <PageHero
        badge="Live Sessions"
        title={session.title}
        subtitle={isLive ? 'This session is live now' : isScheduled ? 'Session details' : `Session ${status.label.toLowerCase()}`}
      />
      <Section className="bg-navbar-bg/30">
        <Container className="max-w-3xl">
          <Link
            href="/live-counselling"
            className="inline-flex items-center text-sm text-primary-navy hover:text-button-gold transition-colors mb-8"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Live Sessions
          </Link>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-primary-navy sm:text-3xl">{session.title}</h1>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${status.classes}`}
              >
                {status.pulse && (
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
                )}
                {status.label}
              </span>
            </div>

            {/* Description */}
            {session.description && (
              <div className="mt-6 prose prose-lg max-w-none text-muted-foreground">
                <RichText content={session.description} />
              </div>
            )}

            {/* Meta Info */}
            <div className="mt-8 space-y-4 border-t border-border pt-6">
              <div className="flex items-center gap-3 text-sm">
                <svg className="h-5 w-5 text-primary-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-primary-navy">{formatDate(session.scheduledAt)}</span>
              </div>

              {session.duration && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 text-primary-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-primary-navy">{session.duration}</span>
                </div>
              )}

              {counsellor && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 text-primary-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-muted-foreground">Counsellor:</span>
                  <span className="font-medium text-primary-navy">{counsellor.name}</span>
                </div>
              )}

              {session.maxParticipants && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 text-primary-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-muted-foreground">Max Participants:</span>
                  <span className="font-medium text-primary-navy">{session.maxParticipants}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 border-t border-border pt-6">
              {isLive && session.meetingUrl ? (
                <a
                  href={session.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-md bg-button-gold hover:bg-button-gold-hover text-primary-navy px-6 py-3 text-base font-bold transition-colors"
                >
                  Join Live Session
                </a>
              ) : isScheduled ? (
                <div className="rounded-lg bg-primary-navy/5 p-4 text-center">
                  <p className="text-sm font-medium text-primary-navy">Session starts {formatDate(session.scheduledAt)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">The join link will appear here when the session goes live.</p>
                </div>
              ) : isCompleted ? (
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">This session has ended.</p>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
