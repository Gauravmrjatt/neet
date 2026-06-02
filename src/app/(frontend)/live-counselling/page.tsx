import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUpcomingSessions } from '@/lib/queries'
import { getCurrentUser } from '@/lib/auth'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { formatDate } from '@/lib/utils'
import { Counselor } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Live Counselling',
    description: 'Join live counselling sessions and Q&A',
    path: '/live-counselling',
  })
}

export default async function LiveCounsellingPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login?redirect=/live-counselling')
  }

  const { docs: sessions } = await getUpcomingSessions()

  return (
    <Section>
      <Container>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Live Counselling</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join live counselling sessions and Q&A with experts
          </p>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {sessions.map((session: any) => {
              const counsellor = typeof session.counsellor === 'object' ? session.counsellor as Counselor : null
              return (
                <div key={session.id} className="rounded-lg border p-6 transition hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{session.title}</h2>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      session.status === 'live' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {session.status === 'live' ? 'LIVE' : 'Upcoming'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(session.scheduledAt)}</span>
                    </div>
                    {session.duration && (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{session.duration}</span>
                      </div>
                    )}
                    {counsellor && (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{counsellor.name}</span>
                      </div>
                    )}
                  </div>

                  {session.meetingUrl && session.status === 'live' && (
                    <div className="mt-6">
                      <a
                        href={session.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Join Live Session
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No upcoming live sessions scheduled.</p>
        )}
      </Container>
    </Section>
  )
}
