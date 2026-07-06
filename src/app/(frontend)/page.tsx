import { Metadata } from 'next'
import Link from 'next/link'
import { getHomePageSEO, getSiteSettings, getNewsTicker, getTestimonials, getWhyChooseUs } from '@/lib/queries/globals'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from '@/lib/structured-data'
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

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  let seo: any = {}
  try {
    seo = await getHomePageSEO()
  } catch {}
  return generateSEOMetadata({
    title: seo?.metaTitle || 'NEET Counselling 2026 — College Predictor, Cutoff & Expert Guidance',
    description: seo?.metaDescription || 'Get expert NEET Counselling 2026 guidance with college predictor by rank, AIQ & state quota support, MBBS/BDS cutoff analysis, and personalised counselling. Trusted by 13L+ aspirants.',
    ogImage: seo?.ogImage,
  })
}

export default async function HomePage() {
  let siteName = 'NEET Counselling'
  let newsTickerItems: any[] = []
  let notificationBar: any = null
  let testimonials: any[] = []
  let settings: any = null
  let whyChooseUs: any = null
  try {
    const [s, ticker, testimonialsData, wcu] = await Promise.all([
      getSiteSettings().catch(() => null),
      getNewsTicker().catch(() => null),
      getTestimonials().catch(() => null),
      getWhyChooseUs().catch(() => null),
    ])
    settings = s
    if (settings?.siteName) siteName = settings.siteName
    newsTickerItems = ticker?.items?.filter((i: any) => i.isActive) || []
    notificationBar = settings?.notificationBar || null
    testimonials = testimonialsData?.testimonials || []
    whyChooseUs = wcu
  } catch {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const schemaPhone = settings?.phone
  const schemaLogo = settings?.schema?.logo?.url ? `${siteUrl}${settings.schema.logo.url}` : undefined

  return (
    <>
      <JsonLd data={generateOrganizationSchema(
        siteName,
        [
          settings?.socialMedia?.facebook,
          settings?.socialMedia?.twitter,
          settings?.socialMedia?.instagram,
          settings?.socialMedia?.youtube,
          settings?.socialMedia?.linkedin,
        ].filter(Boolean) as string[],
        schemaPhone,
        schemaLogo,
      )} />
      <JsonLd data={generateWebSiteSchema({
        name: siteName,
        url: siteUrl,
        description: 'Expert NEET counselling for MBBS, BDS, AYUSH & Veterinary admissions in India. College predictor, rank analysis, and personalised guidance.',
        searchActionUrl: `${siteUrl}/predictor?rank={search_term_string}`,
      })} />
      <JsonLd data={generateLocalBusinessSchema({
        name: siteName,
        telephone: schemaPhone || '+91-9509698208',
        logoUrl: schemaLogo,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
      ])} />
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
