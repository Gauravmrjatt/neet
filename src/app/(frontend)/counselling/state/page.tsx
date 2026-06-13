import type { Metadata } from 'next'
import Link from 'next/link'
import { getStatesWithCounselling } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { StateGrid } from '@/components/counselling/StateGrid'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'State-Wise NEET Counselling 2026 — Complete Guide for All States',
    description: 'Get state-specific NEET counselling information for all 28 states and 8 UTs. Find counselling authorities, important dates, eligibility criteria, and document requirements.',
    path: '/counselling/state',
  })
}

export default async function StateCounsellingPage() {
  const states = await getStatesWithCounselling()

  return (
    <>
      <PageHero
        badge="All States"
        title="State-Wise NEET Counselling 2026"
        subtitle="Comprehensive counselling information for every Indian state. Find state-specific authorities, dates, eligibility, and document requirements."
      />
      <Section tone="cream">
        <Container className="max-w-3xl text-center">
          <p className="text-foreground/80 leading-relaxed">
            Each Indian state has its own NEET counselling authority, schedule, reservation policy, and seat matrix. Find detailed state-wise information — including official websites, counselling procedures, important dates, document requirements, and medical college lists — for all 28 states and union territories.
          </p>
        </Container>
      </Section>
      <Section tone="cream" className="pt-0">
        <Container>
          <StateGrid states={states} />
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="rounded-xl bg-gradient-to-br from-primary-navy to-primary-navy-dark p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Don&apos;t See Your State?</h2>
            <p className="text-white/80 mb-6 max-w-2xl">
              We are adding state-specific guides regularly. Contact our counsellors for personalised guidance about your state&apos;s counselling process.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-button-gold px-6 py-3 font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
            >
              Get Personalised Help
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
