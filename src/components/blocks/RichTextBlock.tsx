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
        <div className="prose prose-lg max-w-none">
          <RichText content={content} />
        </div>
      </Container>
    </Section>
  )
}
