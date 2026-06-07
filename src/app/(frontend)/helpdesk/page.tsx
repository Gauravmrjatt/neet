import React from 'react'
import type { Metadata } from 'next'
import { getHelpdeskItems } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateFAQSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { HelpdeskSearch } from '@/components/helpdesk/HelpdeskSearch'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Helpdesk',
    description: 'Frequently asked questions and support',
    path: '/helpdesk',
  })
}

function getAnswerText(answer: any): string {
  if (!answer?.root?.children) return ''
  return answer.root.children
    .map((node: any) => {
      if (node.type === 'text') return node.text
      if (node.children) return getAnswerText({ root: node })
      return ''
    })
    .join(' ')
}

export default async function HelpdeskPage() {
  const { docs: items } = await getHelpdeskItems()

  const faqItems = items.map((item: any) => ({
    question: item.question,
    answer: getAnswerText(item.answer) || 'See our documentation for more details.',
  }))

  const helpdeskItems = items.map((item: any) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    category: item.category,
  }))

  return (
    <>
      {faqItems.length > 0 && <JsonLd data={generateFAQSchema(faqItems)} />}
      <PageHero
        title="Helpdesk"
        subtitle="Find answers to common questions about NEET counselling, plans, and services."
      />
      <Section className="bg-card">
        <Container className="max-w-3xl">
          {items.length > 0 ? (
            <HelpdeskSearch items={helpdeskItems} />
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
