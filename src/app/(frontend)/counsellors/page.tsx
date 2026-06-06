import React from 'react'
import type { Metadata } from 'next'
import { getCounselors } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
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
    <>
      <PageHero
        title="Our Counsellors"
        subtitle="Find experienced NEET counsellors to guide your journey to a top medical college."
      />
      <Section className="bg-navbar-bg/30">
        <Container>
          <CounselorFilter counselors={counselorData} />
        </Container>
      </Section>
    </>
  )
}
