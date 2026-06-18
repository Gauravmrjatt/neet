import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { BlockRenderer } from '@/components/blocks'
import { PredictorForm } from '@/components/predictor/PredictorForm'
import { getFilterOptions } from '@/lib/predictor/filters'
import { getPredictorPage } from '@/lib/queries/globals'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateWebApplicationSchema, generateHowToSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPredictorPage()
  if (!data) {
    return generateSEOMetadata({
      title: 'NEET College Predictor',
      path: '/predictor',
    })
  }

  return generateSEOMetadata({
    title: data.seo?.metaTitle || data.hero?.title || 'NEET College Predictor',
    description: data.seo?.metaDescription || 'Predict your NEET 2026 college based on rank, category, and state quota. Get accurate college predictions from our AI-powered NEET college predictor tool.',
    ogImage: data.seo?.ogImage ? { url: (data.seo.ogImage as any)?.url } : undefined,
    keywords: data.seo?.keywords?.map((k: any) => k.keyword).filter(Boolean) as string[] | undefined,
    noIndex: data.seo?.noIndex ?? undefined,
    path: '/predictor',
  })
}

export default async function PredictorPage() {
  const data = await getPredictorPage()
  if (!data) notFound()

  const filterOptions = getFilterOptions()
  const hero = data.hero
  const beforeForm = data.beforeForm as any[] | null | undefined
  const afterForm = data.afterForm as any[] | null | undefined
  const disclaimer = data.disclaimer
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'College Predictor', url: `${siteUrl}/predictor` },
      ])} />
      <JsonLd data={generateWebApplicationSchema({
        name: 'NEET College Predictor 2026',
        description: 'Predict your medical college chances based on NEET rank, category, and state quota',
      })} />
      <JsonLd data={generateHowToSchema([
        { name: 'Enter your NEET rank', text: 'Input your NEET 2026 rank or expected percentile' },
        { name: 'Select your category', text: 'Choose your category (General, OBC, SC, ST, EWS, PWD)' },
        { name: 'Choose state quota', text: 'Select your home state for state quota counselling analysis' },
        { name: 'Get predictions', text: 'View predicted colleges matching your profile with cutoff trends' },
      ])} />
      <PageHero
        badge={hero?.badge || 'NEET College Predictor'}
        title={hero?.title || 'Predict Your College'}
        subtitle={hero?.subtitle || undefined}
      />

      {beforeForm && beforeForm.length > 0 && (
        <Section>
          <Container>
            <BlockRenderer blocks={beforeForm} />
          </Container>
        </Section>
      )}

      <Section className="bg-navbar-bg/30">
        <Container className="max-w-5xl">
          <PredictorForm filterOptions={filterOptions} />
        </Container>
      </Section>

      {afterForm && afterForm.length > 0 && (
        <Section>
          <Container>
            <BlockRenderer blocks={afterForm} />
          </Container>
        </Section>
      )}

      {disclaimer?.isEnabled !== false && (
        <section className="bg-primary-navy py-12 text-center text-white">
          <Container>
            <p className="text-sm text-white/60">
              {disclaimer?.text ||
                'Based on official MCC, AACCC & VCI NEET UG counselling data. Predictions are estimates and do not guarantee admission.'}
            </p>
          </Container>
        </section>
      )}
    </>
  )
}
