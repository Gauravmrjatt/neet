import type { Metadata } from 'next'
import Link from 'next/link'
import { getHelpdeskItems, getHelpdeskCategories } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getPageSeoByPath } from '@/lib/page-seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { HelpdeskSearch } from '@/components/helpdesk/HelpdeskSearch'
import { getLexicalText } from '@/lib/lexical'

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/faq')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'NEET Counselling FAQs 2026 — Answers to All Your Questions',
    description: pageSeo?.metaDescription || 'Find answers to all your NEET counselling questions. Eligibility, documents, process, colleges, fees, and expert tips for NEET UG and PG counselling 2026.',
    path: '/faq',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function FAQPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
  const searchParams = await props.searchParams
  const searchQuery = searchParams?.q || ''
  const currentPage = parseInt(searchParams?.page || '1', 10)

  const [helpdeskData, categories] = await Promise.all([
    getHelpdeskItems({ search: searchQuery || undefined, page: currentPage, limit: 20 }),
    getHelpdeskCategories(),
  ])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const pageSeo = await getPageSeoByPath('/faq')

  const faqItems = helpdeskData.docs
    .filter((item: any) => item.question && item.answer)
    .map((item: any) => ({
      question: item.question,
      answer: getLexicalText(item.answer) || item.answer || 'Contact us for more details.',
    }))

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'FAQs', url: `${siteUrl}/faq` },
      ])} />
      {faqItems.length > 0 && <JsonLd data={generateFAQSchema(faqItems)} />}

      <PageHero
        badge="FAQs"
        title="NEET Counselling FAQs 2026"
        subtitle="Find quick answers to the most common questions about NEET counselling, eligibility, documents, colleges, and more."
      />

      <Section tone="cream">
        <Container className="max-w-4xl">
          <HelpdeskSearch
            items={helpdeskData.docs}
            search={searchQuery}
            page={currentPage}
            totalPages={helpdeskData.totalPages}
            totalDocs={helpdeskData.totalDocs}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-4xl">
          <div className="rounded-xl bg-primary-navy p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Still Have Questions?</h2>
            <p className="text-white/80 mb-6">Our expert counsellors are here to help you one-on-one.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-button-gold px-6 py-3 font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
              >
                Ask a Counsellor
              </Link>
              <Link
                href="/counselling"
                className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Read Our Guides
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
