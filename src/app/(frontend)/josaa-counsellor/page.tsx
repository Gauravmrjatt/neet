import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCounselors } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Media } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'JOSAA Counsellor',
    description: 'Expert guidance for JOSAA counselling process',
    path: '/josaa-counsellor',
  })
}

export default async function JosaaCounsellorPage() {
  const { docs: counselors } = await getCounselors({ specialization: 'josaa' })

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-900 py-20 text-white">
        <Container className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">JOSAA Counselling</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/80">
            Get personalized guidance for the JOSAA counselling process. Our experienced counsellors
            will help you understand the process, choose the right colleges, and maximize your chances of admission.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-900 shadow-sm hover:bg-white/90"
            >
              Get Started
            </Link>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our JOSAA Experts</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Counsellors specialized in JOSAA counselling process
            </p>
          </div>

          {counselors.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {counselors.map((counselor: any) => {
                const imageUrl = typeof counselor.image === 'object' ? counselor.image?.url : null
                return (
                  <div key={counselor.id} className="rounded-lg border p-6 text-center transition hover:shadow-lg">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={counselor.name}
                        className="mx-auto h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted text-2xl font-bold">
                        {counselor.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="mt-4 text-lg font-semibold">{counselor.name}</h3>
                    <p className="text-sm text-muted-foreground">{counselor.designation}</p>
                    {counselor.experience && (
                      <p className="mt-1 text-xs text-muted-foreground">{counselor.experience} years experience</p>
                    )}
                    {counselor.specializations && counselor.specializations.length > 0 && (
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {counselor.specializations.map((s: any, i: number) => (
                          <span key={i} className="rounded-full bg-muted px-2 py-1 text-xs capitalize">
                            {s.specialization}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No JOSAA counsellors listed yet.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
