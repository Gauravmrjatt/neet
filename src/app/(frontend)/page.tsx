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
    title: seo?.metaTitle || 'NEET Counselling 2026 — College Predictor & Expert Guidance',
    description: seo?.metaDescription || 'Expert NEET and JOSAA counselling for 2026 admissions. Predict your college, get personalized guidance from experienced counsellors, and secure your seat.',
    ogImage: seo?.ogImage,
    keywords: seo?.keywords,
  })
}

export default async function HomePage() {
  const payload = await getPayloadClient()

  let siteName = 'NEET Counselling'
  let newsTickerItems: any[] = []
  let notificationBar: any = null
  let testimonials: any[] = []
  let settings: any = null
  let whyChooseUs: any = null
  try {
    const [s, ticker, testimonialsData, wcu] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
      payload.findGlobal({ slug: 'news-ticker' }).catch(() => null),
      payload.findGlobal({ slug: 'testimonials' }).catch(() => null),
      payload.findGlobal({ slug: 'why-choose-us' }).catch(() => null),
    ])
    settings = s
    if (settings?.siteName) siteName = settings.siteName
    newsTickerItems = ticker?.items?.filter((i: any) => i.isActive) || []
    notificationBar = settings?.notificationBar || null
    testimonials = testimonialsData?.testimonials || []
    whyChooseUs = wcu
  } catch {}

  return (
    <>
      <JsonLd data={generateOrganizationSchema(siteName)} />
      <NewsTicker items={newsTickerItems} />
      <HeroSection />
      <PlansCoverflow />
      <BlogUpdateStrip
        text={notificationBar?.text}
        link={notificationBar?.link}
        isEnabled={notificationBar?.isEnabled}
      />
      <TrustBadges />
      <WhyChooseUs studentCount={settings?.stats?.students || '17,000+'} data={whyChooseUs} />
      <TestimonialMarquee
        testimonials={testimonials}
        studentCount={settings?.stats?.students || '17,000+'}
      />
    </>
  )
}
