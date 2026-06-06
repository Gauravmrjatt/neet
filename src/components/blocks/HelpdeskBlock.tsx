import React from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface HelpdeskItem {
  question?: string | null
  answer?: string | null
  id?: string | null
}

interface HelpdeskCategory {
  name?: string | null
  items?: HelpdeskItem[] | null
  id?: string | null
}

interface HelpdeskBlockProps {
  title?: string | null
  subtitle?: string | null
  categories?: HelpdeskCategory[] | null
}

export function HelpdeskBlock({ title, subtitle, categories }: HelpdeskBlockProps) {
  if (!categories?.length) return null

  return (
    <Section>
      <Container className="max-w-3xl">
        {title && (
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {categories.map((category, catIndex) => (
          <div key={category.id || catIndex} className="mb-10">
            {category.name && (
              <h3 className="mb-4 font-display text-xl font-semibold tracking-tight">
                {category.name}
              </h3>
            )}
            {category.items && category.items.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item, itemIndex) => (
                  <AccordionItem key={item.id || itemIndex} value={`${catIndex}-${itemIndex}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        ))}
      </Container>
    </Section>
  )
}
