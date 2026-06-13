import { Metadata } from 'next'
import Link from 'next/link'
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
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { HelpCircle, BookText, GraduationCap, MapPin } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  let seo: any = {}
  try {
    seo = await payload.findGlobal({ slug: 'home-page-seo' })
  } catch {}
  return generateSEOMetadata({
    title: seo?.metaTitle || '2026 — College Predictor & Expert Guidance',
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
      <JsonLd data={generateOrganizationSchema(siteName, [
        settings?.socialMedia?.facebook,
        settings?.socialMedia?.twitter,
        settings?.socialMedia?.instagram,
        settings?.socialMedia?.youtube,
        settings?.socialMedia?.linkedin,
      ].filter(Boolean) as string[])} />
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
      <Section tone="cream">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-primary-navy mb-8">Popular Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Link href="/counselling" className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
              <BookText className="h-8 w-8 text-primary-navy" />
              <span className="text-sm font-semibold text-primary-navy">Counselling Guides</span>
            </Link>
            <Link href="/counselling/state" className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
              <MapPin className="h-8 w-8 text-primary-navy" />
              <span className="text-sm font-semibold text-primary-navy">State-Wise Info</span>
            </Link>
            <Link href="/colleges" className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
              <GraduationCap className="h-8 w-8 text-primary-navy" />
              <span className="text-sm font-semibold text-primary-navy">College Directory</span>
            </Link>
            <Link href="/faq" className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
              <HelpCircle className="h-8 w-8 text-primary-navy" />
              <span className="text-sm font-semibold text-primary-navy">FAQs</span>
            </Link>
          </div>
        </Container>
      </Section>
      <TestimonialMarquee
        testimonials={testimonials}
        studentCount={settings?.stats?.students || '17,000+'}
      />
    </>
  )
}
