import React from 'react'
import { Media } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

interface ImageBlockProps {
  image: string | Media
  caption?: string | null
  alignment?: 'left' | 'center' | 'right' | null
}

export function ImageBlock({ image, caption, alignment = 'center' }: ImageBlockProps) {
  const media = typeof image === 'object' ? image : null
  if (!media?.url) return null

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  return (
    <Section>
      <Container className="max-w-4xl">
        <figure className={alignmentClasses[alignment || 'center']}>
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.url}
              alt={media.alt || caption || ''}
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
          {caption && (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </figure>
      </Container>
    </Section>
  )
}
