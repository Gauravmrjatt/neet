import React from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { generateFAQSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'

interface FAQItem {
  question: string
  answer: string
  id?: string | null
}

interface FAQBlockProps {
  title?: string | null
  items?: FAQItem[] | null
}

export function FAQBlock({ title, items }: FAQBlockProps) {
  if (!items?.length) return null

  return (
    <>
      <JsonLd data={generateFAQSchema(items.map((item) => ({ question: item.question, answer: item.answer })))} />
      <Section>
        <Container className="max-w-3xl">
          {title && (
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            </div>
          )}
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={item.id || index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>
    </>
  )
}
