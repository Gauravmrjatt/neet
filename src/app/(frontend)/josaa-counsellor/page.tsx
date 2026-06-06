import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCounselors } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
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
      <PageHero
        badge="JOSAA Counselling"
        title="JOSAA Counselling Experts"
        subtitle="Get personalized guidance for the JOSAA counselling process. Our experienced counsellors will help you understand the process, choose the right colleges, and maximize your chances of admission."
      />

      <div className="bg-primary py-10 text-center -mt-px">
        <Container>
          <Button asChild size="lg" variant="gold">
            <Link href="/contact">Get Started</Link>
          </Button>
        </Container>
      </div>

      <Section className="bg-navbar-bg/30">
        <Container>
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Our JOSAA Experts
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
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
                    className="group rounded-2xl border border-primary/10 bg-white p-7 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                  >
                    {imageUrl ? (
                      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full ring-2 ring-primary/20">
                        <img
                          src={imageUrl}
                          alt={counselor.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                        {counselor.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="mt-4 font-display text-lg font-bold text-primary">{counselor.name}</h3>
                    <p className="text-sm text-muted-foreground">{counselor.designation}</p>
                    {counselor.experience && (
                      <p className="mt-1 text-xs font-medium text-primary/80">
                        {counselor.experience} years experience
                      </p>
                    )}
                    {counselor.specializations && counselor.specializations.length > 0 && (
                      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                        {counselor.specializations.map((s: any, i: number) => (
                          <span
                            key={i}
                            className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium capitalize text-primary"
                          >
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
            <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-primary/20 bg-white p-12 text-center">
              <p className="font-display text-lg font-semibold text-primary">No JOSAA counsellors listed yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Our JOSAA specialists will appear here once added.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
