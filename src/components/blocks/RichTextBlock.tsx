import React from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/shared/RichText'

interface RichTextBlockProps {
  heading?: string
  body?: any
  content?: any
}

export function RichTextBlock({ heading, body, content }: RichTextBlockProps) {
  const richTextContent = content || body
  if (!richTextContent) return null

  return (
    <Section>
      <Container className="max-w-4xl">
        {heading && <h2 className="mb-6 text-3xl font-bold">{heading}</h2>}
        <div className="prose prose-lg max-w-none">
          <RichText content={richTextContent} maxHeadingLevel={2} />
        </div>
      </Container>
    </Section>
  )
}
