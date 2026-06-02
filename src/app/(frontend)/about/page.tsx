import React from 'react'
import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/queries'
import { generatePageMetadata } from '@/lib/seo'
import { BlockRenderer } from '@/components/blocks'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about')
  if (page) {
    return generatePageMetadata({
      seo: page.seo ? {
        metaTitle: page.seo.metaTitle || undefined,
        metaDescription: page.seo.metaDescription || undefined,
        ogImage: page.seo.ogImage ? { url: (page.seo.ogImage as any).url || undefined } : undefined,
        keywords: page.seo.keywords?.map((k: any) => k.keyword).filter(Boolean) as string[] | undefined,
        noIndex: page.seo.noIndex || undefined,
      } : undefined,
      title: page.title,
      slug: page.slug,
    })
  }
  return {
    title: 'About',
    description: 'Learn about our mission to help NEET aspirants',
  }
}

function DefaultAboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-900 py-20 text-white">
        <Container className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About Us</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/80">
            Our mission is to help NEET aspirants achieve their dreams through expert guidance and personalized counselling.
          </p>
        </Container>
      </section>

      <Section>
        <Container className="max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>Our Mission</h2>
            <p>
              We are dedicated to providing expert guidance and support to NEET aspirants.
              Our team of experienced counsellors helps students navigate the complex counselling
              process and make informed decisions about their medical career.
            </p>

            <h2>Why Choose Us?</h2>
            <ul>
              <li>Experienced counsellors with proven track records</li>
              <li>Personalized guidance tailored to your needs</li>
              <li>Comprehensive support throughout the counselling process</li>
              <li>Access to exclusive resources and video content</li>
              <li>Live sessions for real-time interaction with experts</li>
            </ul>

            <h2>Our Team</h2>
            <p>
              Our team consists of medical professionals, education experts, and experienced
              counsellors who have guided thousands of students to successful admissions in
              top medical colleges across India.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default async function AboutPage() {
  const page = await getPageBySlug('about')

  if (page?.content) {
    return <BlockRenderer blocks={page.content} />
  }

  return <DefaultAboutPage />
}
