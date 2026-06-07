import React from 'react'
import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { PredictorForm } from '@/components/predictor/PredictorForm'
import { getFilterOptions } from '@/lib/predictor/filters'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'AI College Predictor',
    description:
      'Predict your NEET college admission chances. Enter your rank, category, and preferences to see which colleges you can get into.',
    path: '/predictor',
  })
}

export default function PredictorPage() {
  const filterOptions = getFilterOptions()

  return (
    <>
      <PageHero
        badge="AI College Predictor"
        title="Predict Your NEET College"
        subtitle="Enter your NEET rank and details to see which colleges you can get into — based on official MCC allotment data."
      />

      <Section className="bg-navbar-bg/30">
        <Container className="max-w-5xl">
          <PredictorForm filterOptions={filterOptions} />
        </Container>
      </Section>

      <section className="bg-primary-navy py-12 text-center text-white">
        <Container>
          <p className="text-sm text-white/60">
            Based on official MCC NEET UG counselling data. Predictions are estimates and do not
            guarantee admission.
          </p>
        </Container>
      </section>
    </>
  )
}
