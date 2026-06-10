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
    title: 'NEET College Predictor — MBBS, BDS, AYUSH & Veterinary',
    description:
      'Predict your NEET college admission chances for MBBS, BDS, BAMS, BHMS, BUMS, BSMS & BVSc colleges. Enter your rank, category, and preferences to get Safe, Likely & Risky predictions based on official MCC, AACCC & VCI data.',
    path: '/predictor',
  })
}

export default function PredictorPage() {
  const filterOptions = getFilterOptions()

  return (
    <>
      <PageHero
        badge="NEET College Predictor"
        title="Predict Your College"
        subtitle="Select your course stream — MBBS/BDS, AYUSH or Veterinary — enter your rank and get personalized admission predictions with Safe, Likely &amp; Risky probability analysis based on official allotment data."
      />

      <Section className="bg-navbar-bg/30">
        <Container className="max-w-5xl">
          <PredictorForm filterOptions={filterOptions} />
        </Container>
      </Section>

      <section className="bg-primary-navy py-12 text-center text-white">
        <Container>
          <p className="text-sm text-white/60">
            Based on official MCC, AACCC &amp; VCI NEET UG counselling data. Predictions are estimates and do not
            guarantee admission.
          </p>
        </Container>
      </section>
    </>
  )
}
