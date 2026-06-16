import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { INDIA_CITIES } from '@/lib/cities'

export const revalidate = 3600

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
    { url: `${siteUrl}/predictor`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${siteUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/live-counselling`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/faq`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${siteUrl}/faq/neet-counselling`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ]

  const predictorSlugPages = [
    { url: `${siteUrl}/predictor/obc`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/predictor/ayush`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/predictor/vet`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/predictor/state-karnataka`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/predictor/state-maharashtra`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/predictor/state-uttar-pradesh`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/predictor/state-rajasthan`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/predictor/state-bihar`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/predictor/state-tamil-nadu`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/predictor/state-delhi`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
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

  const pages = await payload.find({
    collection: 'pages',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })
  const cmsPages = pages.docs.map((page: any) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
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

  const counsellingPosts = await payload.find({
    collection: 'counselling',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })
  const counsellingPages = counsellingPosts.docs.map((post: any) => ({
    url: `${siteUrl}/counselling/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const states = await payload.find({
    collection: 'states',
    where: { status: { equals: 'active' } },
    limit: 100,
  })
  const statePages = states.docs.map((state: any) => ({
    url: `${siteUrl}/counselling/state/${state.slug}`,
    lastModified: new Date(state.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const colleges = await payload.find({
    collection: 'colleges',
    where: { status: { equals: 'active' } },
    limit: 2000,
  })
  const collegePages = colleges.docs
    .filter((college: any) => {
      const slug = college.slug || ''
      // Filter out fragment/garbage slugs (too short, look like truncated text)
      if (slug.length < 8) return false
      if (slug.startsWith('t-of-the-') || slug.startsWith('x-of-the-') || slug.startsWith('e-and-the-')) return false
      if (/^(is|ge|t-|ing|ays|w-|e-)-/.test(slug)) return false
      return true
    })
    .map((college: any) => ({
      url: `${siteUrl}/colleges/${college.slug}`,
      lastModified: new Date(college.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const newStaticPages = [
    { url: `${siteUrl}/counselling`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${siteUrl}/counselling/state`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${siteUrl}/colleges`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ]

  const cityPages = INDIA_CITIES.map((city) => ({
    url: `${siteUrl}/counsellors/${city.slug}`,
    lastModified: new Date('2026-01-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...newStaticPages, ...predictorSlugPages, ...blogPages, ...cmsPages, ...videoPages, ...counsellingPages, ...statePages, ...collegePages, ...cityPages]
}
