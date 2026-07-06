import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/queries'
import { generatePageMetadata } from '@/lib/seo'
import { BlockRenderer } from '@/components/blocks'
import { JsonLd } from '@/components/shared/JsonLd'
import { generateBreadcrumbSchema } from '@/lib/structured-data'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neetcounselors.com'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}

  return generatePageMetadata({
    seo: page.seo
      ? {
          metaTitle: page.seo.metaTitle ?? undefined,
          metaDescription: page.seo.metaDescription ?? undefined,
          ogImage: page.seo.ogImage
            ? { url: (page.seo.ogImage as any)?.url || undefined }
            : undefined,
          noIndex: page.seo.noIndex ?? undefined,
        }
      : undefined,
    title: page.title,
    slug: page.slug,
  })
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: page.title || page.slug, url: `${siteUrl}/${page.slug}` },
  ]

  return (
    <main>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      {page.content && page.content.length > 0 && <BlockRenderer blocks={page.content} />}
    </main>
  )
}
