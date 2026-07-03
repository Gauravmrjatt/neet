import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { INDIA_CITIES } from '@/lib/cities'

export const dynamic = 'force-dynamic'

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
    depth: 0,
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
    depth: 0,
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
    depth: 0,
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
    depth: 0,
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
    depth: 0,
  })
  const stateLookup = new Map(states.docs.map((s: any) => [s.id, s.slug]))
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
    depth: 0,
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
    { url: `${siteUrl}/states`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
  ]

  const cityPages = INDIA_CITIES.map((city) => ({
    url: `${siteUrl}/counsellors/${city.slug}`,
    lastModified: new Date('2026-01-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const stateDistrictPages = states.docs.map((s: any) => ({
    url: `${siteUrl}/states/${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const allDistricts = await payload.find({
    collection: 'districts',
    where: { status: { equals: 'active' } },
    limit: 2000,
    depth: 0,
  })

  const districtLookup = new Map(allDistricts.docs.map((d: any) => [d.id, d]))

  const districtHubPages = allDistricts.docs.map((d: any) => {
    const stateSlug = stateLookup.get(d.state as string) || ''
    return {
      url: `${siteUrl}/states/${stateSlug}/${d.slug}`,
      lastModified: new Date(d.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }
  })

  const districtContent = await payload.find({
    collection: 'district-content',
    where: { status: { equals: 'published' } },
    limit: 20000,
    depth: 0,
    sort: '-updatedAt',
  })

  const subpageSet = new Set<string>()
  const districtSubpages: MetadataRoute.Sitemap[number][] = []

  for (const dc of districtContent.docs as any[]) {
    const districtId = dc.district as string
    const district = districtLookup.get(districtId)
    if (!district) continue
    const stateSlug = stateLookup.get(district.state as string)
    if (!stateSlug) continue
    const url = `${siteUrl}/states/${stateSlug}/${district.slug}/${dc.type}`
    if (subpageSet.has(url)) continue
    subpageSet.add(url)
    districtSubpages.push({
      url,
      lastModified: new Date(dc.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })
  }

  const allTehsils = await payload.find({
    collection: 'tehsils',
    where: { status: { equals: 'active' } },
    limit: 7000,
    depth: 0,
  })

  const tehsilPages = allTehsils.docs.map((t: any) => {
    const districtId = t.district as string
    const district = districtLookup.get(districtId)
    if (!district) return null
    const stateSlug = stateLookup.get(district.state as string)
    if (!stateSlug) return null
    return {
      url: `${siteUrl}/states/${stateSlug}/${district.slug}/tehsil/${t.slug}`,
      lastModified: new Date(t.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  }).filter((x): x is NonNullable<typeof x> => x != null)

  return [...staticPages, ...newStaticPages, ...predictorSlugPages, ...blogPages, ...cmsPages, ...videoPages, ...counsellingPages, ...statePages, ...collegePages, ...cityPages, ...stateDistrictPages, ...districtHubPages, ...districtSubpages, ...tehsilPages]
}
