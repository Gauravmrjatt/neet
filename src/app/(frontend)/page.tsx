import { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateOrganizationSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { NewsTicker } from '@/components/layout/NewsTicker'
import { HeroSection } from '@/components/shared/HeroSection'
import { BlogUpdateStrip } from '@/components/shared/BlogUpdateStrip'
import { TrustBadges } from '@/components/shared/TrustBadge'
import { PlansCoverflow } from '@/components/shared/PlansCoverflow'
import { WhyChooseUs } from '@/components/shared/WhyChooseUs'
import { TestimonialMarquee } from '@/components/shared/TestimonialMarquee'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  let seo: any = {}
  try {
    seo = await payload.findGlobal({ slug: 'home-page-seo' })
  } catch {}
  return generateSEOMetadata({
    title: seo?.metaTitle || 'Home',
    description: seo?.metaDescription || 'Expert NEET and JOSAA counselling services',
    ogImage: seo?.ogImage,
    keywords: seo?.keywords,
  })
}

export default async function HomePage() {
  const payload = await getPayloadClient()

  let newsTickerItems: any[] = []
  try {
    const ticker = await payload.findGlobal({ slug: 'news-ticker' })
    newsTickerItems = ticker?.items?.filter((i: any) => i.isActive) || []
  } catch {}

  return (
    <>
      <JsonLd data={generateOrganizationSchema()} />
      <NewsTicker items={newsTickerItems} />
      <HeroSection />
      <BlogUpdateStrip />
      <TrustBadges />
      <PlansCoverflow />
      <WhyChooseUs />
      <TestimonialMarquee />
    </>
  )
}
