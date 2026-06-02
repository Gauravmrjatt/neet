import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const payload = await getPayloadClient()

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${siteUrl}/videos`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/helpdesk`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${siteUrl}/counsellors`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/josaa-counsellor`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  const blogs = await payload.find({
    collection: 'blogs',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })
  const blogPages = blogs.docs.map((blog: any) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const videos = await payload.find({
    collection: 'videos',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })
  const videoPages = videos.docs.map((video: any) => ({
    url: `${siteUrl}/videos/${video.slug}`,
    lastModified: new Date(video.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages, ...videoPages]
}
