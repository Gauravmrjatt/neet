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
    description: data.seo?.metaDescription || undefined,
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

  return (
    <>
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
