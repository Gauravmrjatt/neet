import React from 'react'
import type { Metadata } from 'next'
import { getAboutPage } from '@/lib/queries/about'
import { generatePageMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { AboutFromCms } from '@/components/about/AboutFromCms'

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage()

  return generatePageMetadata({
    seo: {
      metaTitle: about?.seo?.metaTitle || about?.hero?.title || undefined,
      metaDescription: about?.seo?.metaDescription || undefined,
      ogImage: about?.seo?.ogImage
        ? { url: (about.seo.ogImage as any)?.url || undefined }
        : undefined,
      keywords: about?.seo?.keywords
        ?.map((k: any) => k.keyword)
        .filter(Boolean) as string[] | undefined,
      noIndex: about?.seo?.noIndex || undefined,
    },
    title: about?.hero?.title || 'About',
    slug: 'about',
  })
}

export default async function AboutPage() {
  const about = await getAboutPage()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'About', url: `${siteUrl}/about` },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: about?.hero?.title || 'About NEET Counselling',
        description: about?.seo?.metaDescription || '',
      }} />
      <AboutFromCms data={about} />
    </>
  )
}
