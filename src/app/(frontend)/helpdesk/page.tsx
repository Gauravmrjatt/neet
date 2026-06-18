import React from 'react'
import type { Metadata } from 'next'
import { getHelpdeskItems, getSiteSettings } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getPageSeoByPath } from '@/lib/page-seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { HelpdeskSearch } from '@/components/helpdesk/HelpdeskSearch'
import { getLexicalText } from '@/lib/lexical'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/helpdesk')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'Helpdesk — NEET Counselling Support & FAQs',
    description: pageSeo?.metaDescription || 'Get answers to common questions about NEET counselling, eligibility, documents, pricing plans, and admission process. Contact our support team for personalised help.',
    path: '/helpdesk',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function HelpdeskPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
  const searchParams = await props.searchParams
  const searchQuery = searchParams?.q || ''
  const currentPage = parseInt(searchParams?.page || '1', 10)

  const [{ docs: items, totalPages, totalDocs }, settings] = await Promise.all([
    getHelpdeskItems({ search: searchQuery || undefined, page: currentPage, limit: 20 }),
    getSiteSettings(),
  ])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const pageSeo = await getPageSeoByPath('/helpdesk')

  const faqItems = items.map((item: any) => ({
    question: item.question,
    answer: getLexicalText(item.answer) || 'See our documentation for more details.',
  }))

  const helpdeskItems = items.map((item: any) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    category: item.category,
  }))

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'Helpdesk', url: `${siteUrl}/helpdesk` },
      ])} />
      {faqItems.length > 0 && <JsonLd data={generateFAQSchema(faqItems)} />}
      <PageHero
        title="Helpdesk"
        subtitle="Find answers to common questions about NEET counselling, plans, and services."
      />
      <Section className="bg-card">
        <Container className="max-w-3xl">
          {items.length > 0 ? (
            <HelpdeskSearch
              items={helpdeskItems}
              search={searchQuery}
              page={currentPage}
              totalPages={totalPages}
              totalDocs={totalDocs}
              contactEmail={settings?.contactEmail}
              phone={settings?.phone}
              address={settings?.address}
            />
          ) : (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <p className="text-lg font-semibold text-primary-navy">No help articles available yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Check back soon for new articles.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
