import React from 'react'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { PredictorForm } from '@/components/predictor/PredictorForm'
import { getFilterOptions } from '@/lib/predictor/filters'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateFAQSchema, generateWebApplicationSchema, generateHowToSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'

interface PageProps {
  params: Promise<{ slug: string }>
}

type PredictorVariant = {
  badge: string
  title: string
  subtitle: string
  metaTitle: string
  metaDescription: string
  filterCategory?: string
  keywords: string[]
  faqs?: { question: string; answer: string }[]
}

const PREDICTOR_VARIANTS: Record<string, PredictorVariant> = {
  obc: {
    badge: 'OBC Category Predictor',
    title: 'NEET College Predictor for OBC Category 2026',
    subtitle: 'Get accurate MBBS/BDS college predictions for OBC-NCL category students. Check admission chances in government and private medical colleges with OBC reservation benefits.',
    metaTitle: 'NEET College Predictor for OBC Category 2026 — OBC-NCL MBBS College Predictor',
    metaDescription: 'Predict MBBS/BDS colleges for OBC-NCL category based on NEET rank. Get OBC cutoff-based college predictions with safe, likely, and risky analysis for AIQ and state quota seats.',
    keywords: ['neet college predictor for obc', 'obc neet college predictor 2026', 'neet obc cutoff predictor', 'mbbs college predictor obc ncl', 'neet obc category college prediction'],
    faqs: [
      { question: 'What is the OBC-NCL cutoff for NEET 2026?', answer: 'OBC-NCL cutoff varies by college and quota. For top government colleges, closing ranks typically range from AIR 5,000-50,000 depending on the college. Use our predictor for college-specific estimates.' },
      { question: 'Can OBC students get government MBBS seats with low rank?', answer: 'Yes, OBC-NCL category has reserved seats in all government colleges. With ranks up to 5-6 lakh, OBC students can still get MBBS seats in state quota or private colleges, especially in states with higher seat availability.' },
      { question: 'Do OBC students need separate registration for NEET counselling?', answer: 'OBC-NCL students must provide valid OBC-NCL certificate issued within the last year. Registration on MCC and state portals is the same as general category, but category documents must be uploaded during registration.' },
    ],
  },
  ayush: {
    badge: 'AYUSH College Predictor',
    title: 'NEET AYUSH College Predictor 2026 — BAMS, BHMS, BUMS, BSMS',
    subtitle: 'Predict your admission chances for AYUSH courses (BAMS, BHMS, BUMS, BSMS) based on NEET rank, category, and state quota. Covers all AYUSH colleges across India.',
    metaTitle: 'AYUSH College Predictor 2026 — BAMS/BHMS/BUMS/BSMS College Predictor',
    metaDescription: 'Free AYUSH college predictor for NEET 2026. Predict BAMS, BHMS, BUMS, and BSMS colleges based on your rank. Covers government and private AYUSH colleges under AIQ and state quota.',
    keywords: ['ayush college predictor 2026', 'bams college predictor', 'bhms college predictor', 'ayush counselling 2026', 'neet ayush college prediction'],
    faqs: [
      { question: 'What is the AYUSH counselling process?', answer: 'AYUSH counselling is conducted separately by AACCC (Ayush Admissions Central Counseling Committee) for 15% AIQ seats. State AYUSH counselling is handled by respective state authorities. Registration is separate from MBBS/BDS counselling.' },
      { question: 'Can I get AYUSH seat with low NEET rank?', answer: 'Yes, AYUSH courses generally have lower cutoffs than MBBS. Ranks up to 10-15 lakh can secure seats in government AYUSH colleges, especially in states with more AYUSH colleges like Maharashtra, Gujarat, and Rajasthan.' },
      { question: 'What AYUSH courses are available through NEET?', answer: 'BAMS (Ayurveda), BHMS (Homeopathy), BUMS (Unani), BSMS (Siddha), and B.Sc. Nursing. Each has different cutoff trends. BAMS generally has the highest demand, followed by BHMS.' },
    ],
  },
  vet: {
    badge: 'Veterinary College Predictor',
    title: 'NEET Veterinary College Predictor 2026 — BVSc & AH',
    subtitle: 'Predict your admission chances for BVSc & AH (Bachelor of Veterinary Science) colleges based on your NEET rank, category, and state quota.',
    metaTitle: 'Veterinary College Predictor 2026 — BVSc & AH College Predictor',
    metaDescription: 'Free BVSc college predictor for NEET 2026. Predict veterinary college admissions based on your NEET rank. Covers all government and private veterinary colleges under VCI counselling.',
    keywords: ['veterinary college predictor 2026', 'bvsc college predictor', 'neet veterinary counselling', 'vet college prediction by rank', 'veterinary admission 2026 neet'],
    faqs: [
      { question: 'Is NEET score valid for veterinary admission?', answer: 'Yes, NEET UG scores are accepted for BVSc & AH admissions. Counselling is conducted by VCI (Veterinary Council of India) for AIQ seats and state veterinary universities for state quota seats.' },
      { question: 'What is the veterinary counselling process?', answer: 'Veterinary counselling is conducted separately from MBBS/AYUSH. The VCI counselling covers approximately 15% AIQ seats in government veterinary colleges. State-level counselling covers the remaining 85% seats.' },
    ],
  },
}

const STATE_VARIANTS: Record<string, { name: string; badge: string }> = {
  'karnataka': { name: 'Karnataka', badge: 'Karnataka State Predictor' },
  'maharashtra': { name: 'Maharashtra', badge: 'Maharashtra State Predictor' },
  'uttar-pradesh': { name: 'Uttar Pradesh', badge: 'Uttar Pradesh State Predictor' },
  'rajasthan': { name: 'Rajasthan', badge: 'Rajasthan State Predictor' },
  'bihar': { name: 'Bihar', badge: 'Bihar State Predictor' },
  'tamil-nadu': { name: 'Tamil Nadu', badge: 'Tamil Nadu State Predictor' },
  'delhi': { name: 'Delhi', badge: 'Delhi State Predictor' },
  'west-bengal': { name: 'West Bengal', badge: 'West Bengal State Predictor' },
  'gujarat': { name: 'Gujarat', badge: 'Gujarat State Predictor' },
  'andhra-pradesh': { name: 'Andhra Pradesh', badge: 'Andhra Pradesh State Predictor' },
  'telangana': { name: 'Telangana', badge: 'Telangana State Predictor' },
  'kerala': { name: 'Kerala', badge: 'Kerala State Predictor' },
  'madhya-pradesh': { name: 'Madhya Pradesh', badge: 'Madhya Pradesh State Predictor' },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  if (slug.startsWith('state-')) {
    const stateKey = slug.replace('state-', '')
    const state = STATE_VARIANTS[stateKey]
    if (!state) return { title: 'Not Found' }
    return generateSEOMetadata({
      title: `NEET College Predictor for ${state.name} 2026 — ${state.name} State Quota College Predictor`,
      description: `Predict ${state.name} NEET counselling 2026 college options based on your rank and category. Get state quota MBBS/BDS/AYUSH college predictions with ${state.name} domicile cutoff analysis.`,
      path: `/predictor/${slug}`,
    })
  }

  const variant = PREDICTOR_VARIANTS[slug]
  if (!variant) return { title: 'Not Found' }

  return generateSEOMetadata({
    title: variant.metaTitle,
    description: variant.metaDescription,
    path: `/predictor/${slug}`,
    keywords: variant.keywords,
  })
}

export default async function PredictorSlugPage({ params }: PageProps) {
  const { slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  if (slug.startsWith('state-')) {
    const stateKey = slug.replace('state-', '')
    const state = STATE_VARIANTS[stateKey]
    if (!state) notFound()

    const filterOptions = getFilterOptions()
    const stateName = state.name

    return (
      <>
        <JsonLd data={generateBreadcrumbSchema([
          { name: 'Home', url: siteUrl },
          { name: 'College Predictor', url: `${siteUrl}/predictor` },
          { name: `${stateName} Predictor`, url: `${siteUrl}/predictor/${slug}` },
        ])} />
        <PageHero
          badge={state.badge}
          title={`${stateName} NEET College Predictor 2026`}
          subtitle={`Predict MBBS/BDS/AYUSH colleges available through ${stateName} state quota counselling based on your NEET rank, category, and domicile status. Get personalized college predictions with ${stateName} cutoff analysis.`}
        />

        <Section className="bg-navbar-bg/30">
          <Container className="max-w-5xl">
            <PredictorForm filterOptions={filterOptions} />
          </Container>
        </Section>

        <Section>
          <Container className="max-w-4xl">
            <div className="rounded-xl bg-primary-navy p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Need Help with {stateName} NEET Counselling?</h2>
              <p className="text-white/80 mb-6">Our {stateName}-based counsellors can guide you through the state quota process.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/counsellors" className="inline-flex items-center rounded-lg bg-button-gold px-6 py-3 font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors">
                  Find a Counsellor
                </Link>
                <Link href="/counselling" className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
                  Read Guides
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </>
    )
  }

  const variant = PREDICTOR_VARIANTS[slug]
  if (!variant) notFound()

  const filterOptions = getFilterOptions()
  const breadcrumbName = variant.badge.replace(' Predictor', '')

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'College Predictor', url: `${siteUrl}/predictor` },
        { name: breadcrumbName, url: `${siteUrl}/predictor/${slug}` },
      ])} />
      <JsonLd data={generateWebApplicationSchema({
        name: `NEET ${breadcrumbName} College Predictor 2026`,
        description: `Predict ${breadcrumbName.toLowerCase()} college admissions based on NEET rank`,
      })} />
      {variant.faqs && variant.faqs.length > 0 && (
        <JsonLd data={generateFAQSchema(variant.faqs)} />
      )}

      <PageHero
        badge={variant.badge}
        title={variant.title}
        subtitle={variant.subtitle}
      />

      <Section className="bg-navbar-bg/30">
        <Container className="max-w-5xl">
          <PredictorForm filterOptions={filterOptions} />
        </Container>
      </Section>

      {variant.faqs && variant.faqs.length > 0 && (
        <Section>
          <Container className="max-w-3xl">
            <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {variant.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
