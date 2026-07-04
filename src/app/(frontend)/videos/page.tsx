import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getVideos, getVideoCategories } from '@/lib/queries'
import { getPageSeoByPath } from '@/lib/page-seo'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Media } from '@/payload-types'

export const revalidate = 3600

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}): Promise<Metadata> {
  const { category, page: pageParam } = await searchParams
  const currentPage = parseInt(pageParam || '1', 10)
  const pageSeo = await getPageSeoByPath('/videos')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'NEET Counselling Videos — Expert Guidance & Tutorials 2026',
    description: pageSeo?.metaDescription || 'Watch NEET counselling video guides, expert tips, college selection advice, and step-by-step tutorials for MBBS admission and counselling process.',
    path: '/videos',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || currentPage > 1 || !!category,
  })
}

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const pageSeo = await getPageSeoByPath('/videos')
  const { category, page: pageParam } = await searchParams
  const currentPage = parseInt(pageParam || '1', 10)
  const selectedCategory = category as string | undefined

  const [{ docs: videos, totalPages }, { items }] = await Promise.all([
    getVideos({
      page: currentPage,
      limit: 12,
      category: selectedCategory,
    }),
    getVideoCategories(),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const categories = [
    { label: 'All', value: undefined as string | undefined },
    ...(items ?? []).map((c) => ({ label: c.label, value: c.value })),
  ]

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'Videos', url: `${siteUrl}/videos` },
      ])} />
      <PageHero
        title="Videos"
        subtitle="Video guides and tutorials for NEET preparation"
      />
      <Section className="bg-navbar-bg/30">
        <Container>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const isActive = (cat.value === selectedCategory) || (!cat.value && !selectedCategory)
              return (
                <Link
                  key={cat.label}
                  href={cat.value ? `/videos?category=${cat.value}` : '/videos'}
                  className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary-navy text-white'
                      : 'border border-border bg-card text-primary-navy hover:bg-primary-navy hover:text-white'
                  }`}
                >
                  {cat.label}
                </Link>
              )
            })}
          </div>

          {videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video: any) => {
                  const thumbnail = typeof video.thumbnail === 'object' ? video.thumbnail as Media : null
                  return (
                    <Link
                      key={video.id}
                      href={`/videos/${video.slug}`}
                      className="group overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {thumbnail?.url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={thumbnail.url}
                            alt={thumbnail.alt || video.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-navy to-primary-navy-dark">
                            <svg className="h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 rounded bg-primary-navy/90 px-2 py-1 text-xs font-medium text-white">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h2 className="font-bold text-primary-navy group-hover:text-button-gold transition-colors line-clamp-2">
                          {video.title}
                        </h2>
                        {video.category && (
                          <span className="mt-3 inline-block rounded-full bg-primary-navy/10 text-primary-navy px-2.5 py-0.5 text-xs font-medium capitalize">
                            {video.category}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2 flex-wrap">
                  {currentPage > 1 && (
                    <Link
                      href={`/videos?page=${currentPage - 1}${category ? `&category=${category}` : ''}`}
                      className="inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-primary-navy hover:bg-primary-navy hover:text-white transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/videos?page=${p}${category ? `&category=${category}` : ''}`}
                      className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        p === currentPage
                          ? 'bg-primary-navy text-white'
                          : 'border border-border bg-card text-primary-navy hover:bg-primary-navy hover:text-white'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link
                      href={`/videos?page=${currentPage + 1}${category ? `&category=${category}` : ''}`}
                      className="inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-primary-navy hover:bg-primary-navy hover:text-white transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <p className="text-lg font-semibold text-primary-navy">No videos available yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Check back soon for new content.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
