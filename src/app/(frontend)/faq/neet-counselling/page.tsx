import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'NEET Counselling FAQs 2026 — Everything You Need to Know',
    description: 'Get answers to all your NEET counselling questions: what is NEET counselling, how does it work, AIQ vs state quota difference, documents needed, round-wise process, fees, and expert tips for 2026.',
    path: '/faq/neet-counselling',
  })
}

const GEO_FAQS = [
  {
    question: 'What is NEET counselling?',
    answer: 'NEET counselling is the centralized seat allocation process for undergraduate medical (MBBS, BDS) and AYUSH courses in India. It is conducted by the Medical Counselling Committee (MCC) for 15% All India Quota (AIQ) seats and by state authorities for the remaining 85% state quota seats. Candidates who qualify NEET UG can participate in counselling rounds to secure admission based on their rank, category, and preferences.',
  },
  {
    question: 'How does NEET counselling work?',
    answer: 'NEET counselling works in a step-by-step process: (1) Registration on the counselling portal, (2) Payment of counselling fee and security deposit, (3) Choice filling and locking — candidates select and rank their preferred colleges and courses, (4) Seat allotment based on NEET rank, category, and choices, (5) Reporting to the allotted college for document verification and admission confirmation. MCC conducts 4 rounds: Round 1, Round 2, Mop-Up Round, and Stray Vacancy Round.',
  },
  {
    question: 'What is the difference between AIQ and state quota in NEET counselling?',
    answer: 'AIQ (All India Quota) covers 15% of government medical college seats across India, plus all seats in deemed universities, central universities (AMU, BHU, DU), AIIMS, and JIPMER. It is conducted by MCC at mcc.nic.in and is open to candidates from any state. State quota covers the remaining 85% of government college seats and is conducted by individual state counselling authorities. State quota is generally restricted to candidates who meet the state\'s domicile requirements.',
  },
  {
    question: 'What documents are required for NEET counselling?',
    answer: 'The key documents required for NEET counselling are: NEET UG 2026 admit card and scorecard, Class 10 and 12 mark sheets and certificates, Category certificate (SC/ST/OBC-NCL/EWS) if applicable, PwD certificate if applicable, Domicile certificate (for state quota), Aadhaar card or government ID proof, Passport-size photographs, and Provisional allotment letter (after seat allotment). Ensure category certificates are issued within the validity period specified by the counselling authority.',
  },
  {
    question: 'How many rounds are there in NEET counselling?',
    answer: 'MCC NEET counselling has 4 rounds: Round 1 (free exit — no penalty for not reporting), Round 2 (security deposit required, forfeited on withdrawal), Mop-Up Round (also called Round 3), and Stray Vacancy Round (final round for leftover seats). State counselling may have 3-4 rounds depending on the state. In 2025, out of 39,478 MCC allottees, 46% did not report in Round 1, 3,782 upgraded in Round 2, and 2,199 upgraded in Round 3.',
  },
  {
    question: 'Can I get MBBS with 50000 rank in NEET?',
    answer: 'Yes, a NEET rank of 50,000 can secure MBBS seats, especially in state quota or deemed universities. For AIQ government seats, ranks below 5,000-10,000 are typically needed for top colleges. However, at rank 50,000, you can get MBBS in many state government colleges (especially in states with more seats), deemed universities like KMC Manipal, SRMC Chennai, or private colleges. Use our NEET college predictor to check specific college options for your rank.',
  },
  {
    question: 'What is the NEET counselling fee for 2026?',
    answer: 'The NEET counselling fee for 2026 varies by quota. For AIQ counselling: General/EWS candidates pay ₹1,000 (non-refundable) + ₹2,00,000 refundable security deposit, SC/ST/OBC/PwD pay ₹500 (non-refundable) + ₹50,000 refundable deposit. For deemed universities: ₹5,000 non-refundable fee + ₹2,00,000 refundable deposit. State counselling fees vary by state, typically ₹500-₹2,500 for registration plus varying security deposits.',
  },
  {
    question: 'When does NEET counselling 2026 start?',
    answer: 'NEET counselling 2026 is expected to begin in July-August 2026, approximately 3-4 weeks after NEET results (expected in June 2026). Due to the NEET 2026 re-exam on June 21, the counselling schedule may be delayed by 3-4 weeks compared to normal years. MCC typically announces the schedule on mcc.nic.in after results are declared. State counselling runs on parallel timelines from July to October.',
  },
  {
    question: 'How to check NEET seat allotment result?',
    answer: 'NEET seat allotment results are published on the official MCC website (mcc.nic.in) in PDF format. To check: visit mcc.nic.in, go to the UG counselling section, click on the seat allotment result link for the relevant round, download the PDF, and search for your roll number using Ctrl+F. Results are first released as provisional (with a grievance window) and then as final. You can also check your allotment status by logging into your MCC counselling account.',
  },
  {
    question: 'What is the NEET counselling process for state quota?',
    answer: 'State quota NEET counselling covers 85% of government medical college seats in each state. The process varies by state but generally includes: separate registration on the state counselling portal, choice filling for state colleges, seat allotment based on NEET rank and state-specific reservation policy, and reporting. Domicile requirements differ — some states (like Maharashtra) require domicile, while others (like Karnataka OPN quota) are open to all-India candidates. Register for both MCC AIQ and your state counselling to maximize options.',
  },
  {
    question: 'What are the best NEET college predictor tools?',
    answer: 'The best NEET college predictors use historical MCC and state counselling cutoff data (3-5 years) to estimate admission chances. Key factors to evaluate: data freshness (last 3-5 years of cutoffs), coverage (MBBS, BDS, AYUSH, state-wise), category handling (General, OBC, SC, ST, EWS), and output format (safe/likely/risky bands). Look for predictors that base results on official MCC and state allotment data rather than estimates.',
  },
  {
    question: 'What is choice filling in NEET counselling?',
    answer: 'Choice filling is the step where candidates select and rank their preferred colleges and courses in order of preference. You can fill up to 300 choices across different colleges and courses. The allotment algorithm assigns you the highest-ranked choice for which you meet the cutoff. Key strategies: fill all choices you would accept (no penalty for long lists), research past-year cutoffs before ordering choices, place your dream college first, and always lock your choices before the deadline.',
  },
]

export default async function NEETCounsellingFAQPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'FAQs', url: `${siteUrl}/faq` },
        { name: 'NEET Counselling FAQs', url: `${siteUrl}/faq/neet-counselling` },
      ])} />
      <JsonLd data={generateFAQSchema(GEO_FAQS)} />

      <PageHero
        badge="FAQs"
        title="NEET Counselling 2026 — All Your Questions Answered"
        subtitle="Quick, concise answers to the most common NEET counselling questions. Optimized for quick reading and AI-powered search assistants."
      />

      <Section>
        <Container className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {GEO_FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-4xl">
          <div className="rounded-xl bg-primary-navy p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Need Personalised Guidance?</h2>
            <p className="text-white/80 mb-6">Get one-on-one counselling from our expert counsellors.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-button-gold px-6 py-3 font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
              >
                Talk to an Expert
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                View Plans
              </Link>
              <Link
                href="/counselling"
                className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Read Guides
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
