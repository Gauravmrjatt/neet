import React from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/shared/RichText'

interface RichTextBlockProps {
  content?: any
}

export function RichTextBlock({ content }: RichTextBlockProps) {
  if (!content) return null

  return (
    <Section>
      <Container className="max-w-4xl">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground">
          <RichText content={content} />
        </div>
      </Container>
    </Section>
  )
}
