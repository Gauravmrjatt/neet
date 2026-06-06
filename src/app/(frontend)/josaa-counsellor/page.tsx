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

      <div className="bg-[#062963] py-8 text-center -mt-px">
        <Container>
          <Button
            asChild
            size="lg"
            className="bg-[#FBAC1A] hover:bg-[#e09b18] text-[#062963] font-semibold"
          >
            <Link href="/contact">Get Started</Link>
          </Button>
        </Container>
      </div>

      <Section className="bg-[#F6F3EE]/30">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#062963] sm:text-4xl">
              Our JOSAA Experts
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
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
                    className="rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {imageUrl ? (
                      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-[#062963]/20">
                        <img
                          src={imageUrl}
                          alt={counselor.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#062963] text-2xl font-bold text-white">
                        {counselor.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="mt-4 text-lg font-bold text-[#062963]">{counselor.name}</h3>
                    <p className="text-sm text-gray-600">{counselor.designation}</p>
                    {counselor.experience && (
                      <p className="mt-1 text-xs text-[#062963]/70 font-medium">
                        {counselor.experience} years experience
                      </p>
                    )}
                    {counselor.specializations && counselor.specializations.length > 0 && (
                      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                        {counselor.specializations.map((s: any, i: number) => (
                          <span
                            key={i}
                            className="rounded-full bg-[#062963]/10 text-[#062963] px-2.5 py-0.5 text-xs font-medium capitalize"
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
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-[#062963]">No JOSAA counsellors listed yet</p>
              <p className="mt-2 text-sm text-gray-500">Our JOSAA specialists will appear here once added.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
