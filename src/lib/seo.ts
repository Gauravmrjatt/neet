import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/queries/globals'

interface SEOData {
  metaTitle?: string
  metaDescription?: string
  ogImage?: { url?: string } | null
  keywords?: string[]
  noIndex?: boolean
}

export async function generateMetadata({
  title,
  description,
  ogImage,
  keywords,
  noIndex = false,
  path = '',
}: SEOData & { path?: string; title?: string; description?: string }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  let siteName = 'NEET Counselling'
  let siteDescription = 'Expert NEET and JOSAA counselling services'

  try {
    const settings = await getSiteSettings()
    if (settings?.siteName) siteName = settings.siteName
    if (settings?.siteDescription) siteDescription = settings.siteDescription
  } catch {}

  const ogImageUrl = ogImage?.url || `${siteUrl}/og-default.png`

  const metadata: Metadata = {
    title: title || siteName,
    description: description || siteDescription,
    keywords: keywords && keywords.length > 0 ? keywords.join(', ') : undefined,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: title || siteName,
      description: description || siteDescription,
      url: `${siteUrl}${path}`,
      siteName,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || siteName,
      description: description || siteDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${siteUrl}${path}`,
    },
  }

  return metadata
}

export async function generateBlogMetadata(blog: {
  seo?: SEOData
  title?: string
  excerpt?: string
  featuredImage?: { url?: string } | null
  slug?: string
  publishedAt?: string
  updatedAt?: string
}): Promise<Metadata> {
  const meta = await generateMetadata({
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    ogImage: blog.seo?.ogImage || blog.featuredImage,
    keywords: blog.seo?.keywords,
    noIndex: blog.seo?.noIndex,
    path: `/blog/${blog.slug}`,
  })
  if (meta.openGraph) {
    const og = meta.openGraph as any
    og.type = 'article'
    if (blog.publishedAt) {
      og.publishedTime = blog.publishedAt
    }
    if (blog.updatedAt) {
      og.modifiedTime = blog.updatedAt
    }
  }
  return meta
}

export async function generateVideoMetadata(video: {
  seo?: SEOData
  title?: string
  description?: string
  thumbnail?: { url?: string } | null
  slug?: string
}): Promise<Metadata> {
  return generateMetadata({
    title: video.seo?.metaTitle || video.title,
    description: video.seo?.metaDescription || video.description?.substring(0, 160),
    ogImage: video.seo?.ogImage || video.thumbnail,
    keywords: video.seo?.keywords,
    noIndex: video.seo?.noIndex,
    path: `/videos/${video.slug}`,
  })
}

export async function generatePageMetadata(page: {
  seo?: SEOData
  title?: string
  slug?: string
}): Promise<Metadata> {
  return generateMetadata({
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    ogImage: page.seo?.ogImage,
    keywords: page.seo?.keywords,
    noIndex: page.seo?.noIndex,
    path: `/${page.slug}`,
  })
}
