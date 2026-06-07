import React from 'react'
import type { Metadata } from 'next'
import { getAboutPage } from '@/lib/queries/about'
import { generatePageMetadata } from '@/lib/seo'
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
  return <AboutFromCms data={about} />
}
