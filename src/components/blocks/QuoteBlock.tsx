import React from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

interface QuoteBlockProps {
  quote: string
  author?: string | null
  style?: 'default' | 'highlight' | 'border' | null
}

export function QuoteBlock({ quote, author, style = 'default' }: QuoteBlockProps) {
  const styleClasses = {
    default: 'bg-muted/50 border-l-4 border-primary-navy',
    highlight: 'bg-button-gold/10 border-l-4 border-button-gold',
    border: 'bg-card border border-border rounded-lg',
  }

  return (
    <Section>
      <Container className="max-w-4xl">
        <blockquote className={`${styleClasses[style || 'default']} px-6 py-4`}>
          <p className="text-lg italic leading-relaxed text-foreground">
            &ldquo;{quote}&rdquo;
          </p>
          {author && (
            <cite className="mt-3 block text-sm not-italic text-muted-foreground">
              &mdash; {author}
            </cite>
          )}
        </blockquote>
      </Container>
    </Section>
  )
}
