import type { Metadata } from 'next'

interface SEOData {
  metaTitle?: string
  metaDescription?: string
  ogImage?: { url?: string } | null
  keywords?: string[]
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description,
  ogImage,
  keywords,
  noIndex = false,
  path = '',
}: SEOData & { path?: string; title?: string; description?: string }): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const siteName = 'NEET Counselling'

  const metadata: Metadata = {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || 'Expert NEET and JOSAA counselling services',
    keywords: keywords?.join(', '),
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: title || siteName,
      description: description || 'Expert NEET and JOSAA counselling services',
      url: `${siteUrl}${path}`,
      siteName,
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: title || siteName,
      description: description || 'Expert NEET and JOSAA counselling services',
    },
    alternates: {
      canonical: `${siteUrl}${path}`,
    },
  }

  if (ogImage?.url) {
    metadata.openGraph!.images = [{ url: ogImage.url, width: 1200, height: 630 }]
    metadata.twitter!.images = [ogImage.url]
  }

  return metadata
}

export function generateBlogMetadata(blog: {
  seo?: SEOData
  title?: string
  excerpt?: string
  featuredImage?: { url?: string } | null
  slug?: string
}): Metadata {
  return generateMetadata({
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    ogImage: blog.seo?.ogImage || blog.featuredImage,
    keywords: blog.seo?.keywords,
    noIndex: blog.seo?.noIndex,
    path: `/blog/${blog.slug}`,
  })
}

export function generateVideoMetadata(video: {
  seo?: SEOData
  title?: string
  description?: string
  thumbnail?: { url?: string } | null
  slug?: string
}): Metadata {
  return generateMetadata({
    title: video.seo?.metaTitle || video.title,
    description: video.seo?.metaDescription || video.description?.substring(0, 160),
    ogImage: video.seo?.ogImage || video.thumbnail,
    keywords: video.seo?.keywords,
    noIndex: video.seo?.noIndex,
    path: `/videos/${video.slug}`,
  })
}

export function generatePageMetadata(page: {
  seo?: SEOData
  title?: string
  slug?: string
}): Metadata {
  return generateMetadata({
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    ogImage: page.seo?.ogImage,
    keywords: page.seo?.keywords,
    noIndex: page.seo?.noIndex,
    path: `/${page.slug}`,
  })
}
