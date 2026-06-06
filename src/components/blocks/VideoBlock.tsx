import React from 'react'
import { Media } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

interface VideoBlockProps {
  title?: string | null
  videoUrl: string
  thumbnail?: (string | null) | Media
  description?: string | null
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null

  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/)
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return url
}

export function VideoBlock({ title, videoUrl, thumbnail, description }: VideoBlockProps) {
  const embedUrl = getEmbedUrl(videoUrl)

  return (
    <Section>
      <Container className="max-w-4xl">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
          </div>
        )}
        <div className="overflow-hidden rounded-2xl border border-primary/10 shadow-md">
          <div className="aspect-video">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <p className="text-muted-foreground">Video not available</p>
              </div>
            )}
          </div>
        </div>
        {description && <p className="mt-5 text-center text-muted-foreground leading-relaxed">{description}</p>}
      </Container>
    </Section>
  )
}
