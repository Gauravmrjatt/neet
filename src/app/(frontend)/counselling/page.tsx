import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCounsellingPosts } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getPageSeoByPath } from '@/lib/page-seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { CounsellingCard } from '@/components/counselling/CounsellingCard'
import { CounsellingFilter } from '@/components/counselling/CounsellingFilter'
import { Pagination } from '@/components/shared/Pagination'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/counselling')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'NEET Counselling 2026 — Complete Guide & Expert Tips',
    description: pageSeo?.metaDescription || 'Find everything about NEET counselling 2026: AIQ, state quota, college selection, document checklist, cutoff analysis, and MBBS abroad guidance from expert counsellors.',
    path: '/counselling',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function CounsellingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page: pageParam, category } = await searchParams
  const currentPage = parseInt(pageParam || '1', 10)
  const { docs: posts, totalPages } = await getCounsellingPosts({
    page: currentPage,
    limit: 12,
    category: category || undefined,
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const pageSeo = await getPageSeoByPath('/counselling')

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'Counselling Guides', url: `${siteUrl}/counselling` },
      ])} />
      <PageHero
        badge="NEET 2026"
        title="NEET Counselling 2026"
        subtitle="Complete guides, expert tips, and state-wise counselling information for NEET UG and PG aspirants."
      />
      <Section tone="cream">
        <Container className="max-w-3xl text-center">
          <p className="text-foreground/80 leading-relaxed">
            NEET counselling 2026 is your gateway to MBBS, BDS, AYUSH, and nursing admissions across India. Whether you are applying through MCC&apos;s AIQ counselling or your state quota, our expert guides walk you through every step — from registration and choice filling to seat allotment and document verification. Browse our comprehensive guides below.
          </p>
        </Container>
      </Section>
      <Section tone="cream" className="relative pt-0">
        <Container>
          <Suspense fallback={<div className="flex flex-wrap gap-2 mb-8"><div className="h-8 w-20 rounded-full bg-muted animate-pulse" /><div className="h-8 w-24 rounded-full bg-muted animate-pulse" /><div className="h-8 w-20 rounded-full bg-muted animate-pulse" /><div className="h-8 w-28 rounded-full bg-muted animate-pulse" /><div className="h-8 w-20 rounded-full bg-muted animate-pulse" /></div>}>
            <CounsellingFilter />
          </Suspense>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <CounsellingCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-foreground/60">
              <p className="text-lg font-semibold text-primary-navy mb-2">No guides available yet</p>
              <p>Check back soon for new counselling guides.</p>
            </div>
          )}
          <Pagination totalPages={totalPages} currentPage={currentPage} basePath="/counselling" />
          <div className="mt-12 rounded-xl bg-primary-navy p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Need Personalised Counselling?</h2>
            <p className="text-white/80 mb-6">Get one-on-one guidance from our expert counsellors.</p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-button-gold px-6 py-3 font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
            >
              Talk to a Counsellor
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
