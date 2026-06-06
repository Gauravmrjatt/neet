import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVideoBySlug } from '@/lib/queries'
import { generateVideoMetadata } from '@/lib/seo'
import { generateVideoObjectSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { formatDate } from '@/lib/utils'
import { Media } from '@/payload-types'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

interface VideoPageProps {
  params: Promise<{ slug: string }>
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/)
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return url
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params
  const video = await getVideoBySlug(slug)
  if (!video) return { title: 'Video Not Found' }
  const thumbnail = typeof video.thumbnail === 'object' ? video.thumbnail as Media : null
  return generateVideoMetadata({
    seo: video.seo ? {
      metaTitle: video.seo.metaTitle || undefined,
      metaDescription: video.seo.metaDescription || undefined,
      ogImage: video.seo.ogImage && typeof video.seo.ogImage === 'object' ? { url: (video.seo.ogImage as Media).url || undefined } : undefined,
      keywords: video.seo.keywords?.map((k: any) => k.keyword).filter(Boolean) as string[] | undefined,
    } : undefined,
    title: video.title,
    description: video.description?.root?.children?.map((c: any) => c.text).join('') || undefined,
    thumbnail: thumbnail ? { url: thumbnail.url || undefined } : null,
    slug: video.slug,
  })
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params
  const video = await getVideoBySlug(slug)

  if (!video) notFound()

  const thumbnail = typeof video.thumbnail === 'object' ? video.thumbnail as Media : null
  const embedUrl = getEmbedUrl(video.videoUrl)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateVideoObjectSchema({
        title: video.title,
        description: video.description?.root?.children?.map((c: any) => c.text).join('') || undefined,
        thumbnail: thumbnail ? { url: thumbnail.url || undefined } : null,
        publishedAt: video.publishedAt || undefined,
        duration: video.duration || undefined,
        videoUrl: video.videoUrl,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Videos', url: `${siteUrl}/videos` },
        { name: video.title, url: `${siteUrl}/videos/${video.slug}` },
      ])} />

      <Section className="bg-white">
        <Container className="max-w-4xl">
          <Link
            href="/videos"
            className="inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-button-gold mb-6"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Videos
          </Link>

          <div className="mb-6">
            {video.category && (
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                {video.category}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">
              {video.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {video.publishedAt && (
                <div className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time>{formatDate(video.publishedAt)}</time>
                </div>
              )}
              {video.duration && (
                <div className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{video.duration}</span>
                </div>
              )}
            </div>
          </div>

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

          {video.description && (
            <div className="mt-8 prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              <RichText content={video.description} />
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
