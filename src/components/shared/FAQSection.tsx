import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  title?: string
  subtitle?: string
  items: FAQItem[]
}

export function FAQSection({ title = 'Frequently Asked Questions', subtitle, items }: FAQSectionProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl">
        {title && (
          <h2 className="text-2xl font-bold text-primary-navy text-center mb-2">{title}</h2>
        )}
        {subtitle && (
          <p className="text-foreground/70 text-center mb-8 max-w-2xl mx-auto">{subtitle}</p>
        )}
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-primary-navy">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export function generateFAQItems(items: FAQItem[]) {
  return items
}
