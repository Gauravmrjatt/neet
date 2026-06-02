import React from 'react'
import type { Metadata } from 'next'
import { getCounselors } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { CounselorFilter } from '@/components/counsellors/CounselorFilter'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Counsellors',
    description: 'Find experienced NEET counsellors',
    path: '/counsellors',
  })
}

export default async function CounsellorsPage() {
  const { docs: counselors } = await getCounselors()

  const counselorData = counselors.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    designation: c.designation,
    image: c.image,
    specializations: c.specializations,
    experience: c.experience,
  }))

  return (
    <Section>
      <Container>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Counsellors</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find experienced NEET counsellors to guide your journey
          </p>
        </div>
        <CounselorFilter counselors={counselorData} />
      </Container>
    </Section>
  )
}
