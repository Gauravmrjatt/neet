import React from 'react'
import type { Metadata } from 'next'
import { getHelpdeskItems } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateFAQSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
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
      <Section>
        <Container className="max-w-3xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Helpdesk</h1>
            <p className="mt-4 text-lg text-muted-foreground">Frequently asked questions and support</p>
          </div>

          {items.length > 0 ? (
            <HelpdeskSearch items={helpdeskItems} />
          ) : (
            <p className="text-center text-muted-foreground">No help articles available yet.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
