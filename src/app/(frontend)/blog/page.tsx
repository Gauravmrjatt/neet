import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Calendar, BookOpen, GraduationCap, MapPin, HelpCircle } from 'lucide-react'
import { getBlogs } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateItemListSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getPageSeoByPath } from '@/lib/page-seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { formatDate, cn } from '@/lib/utils'
import { Media } from '@/payload-types'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/blog')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'NEET Counselling Blog — Guides, Tips & Expert Advice for 2026',
    description: pageSeo?.metaDescription || 'NEET counselling guides, MBBS admission tips, college selection advice, and expert insights for medical aspirants in India',
    path: '/blog',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const { page: pageParam, sort: sortParam } = await searchParams
  const currentPage = parseInt(pageParam || '1', 10)
  const sort = sortParam === 'oldest' ? 'createdAt' : '-createdAt'
  const { docs: blogs, totalPages, totalDocs } = await getBlogs({ page: currentPage, limit: 9, sort })

  const [pageSeo, siteUrl] = await Promise.all([
    getPageSeoByPath('/blog'),
    Promise.resolve(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  ])

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: pageSeo?.breadcrumbLabel || 'Blog', url: `${siteUrl}/blog` },
      ])} />
      <JsonLd data={generateItemListSchema(
        blogs.map((blog: any, index: number) => ({
          url: `${siteUrl}/blog/${blog.slug}`,
          name: blog.title,
        }))
      )} />

      <PageHero
        badge="Insights & Guides"
        title="Blog"
        subtitle="Latest articles, guides, and insights for aspiring doctors"
      />

      <Section tone="cream" className="relative">
        <Container>
          {blogs.length > 0 ? (
            <>
              <div className="mb-8 flex items-center justify-between gap-4">
                <p className="inline-flex items-center gap-2 text-sm text-foreground/70">
                  <BookOpen className="h-4 w-4 text-primary-navy" aria-hidden="true" />
                  Showing <span className="font-semibold text-primary-navy">{blogs.length}</span> of <span className="font-semibold text-primary-navy">{totalDocs?.toLocaleString('en-IN')}</span> articles
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog?sort=newest${currentPage > 1 ? `&page=${currentPage}` : ''}`}
                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      sort === '-createdAt'
                        ? 'bg-primary-navy text-white'
                        : 'border border-border bg-card text-primary-navy hover:bg-primary-navy hover:text-white'
                    }`}
                  >
                    Newest
                  </Link>
                  <Link
                    href={`/blog?sort=oldest${currentPage > 1 ? `&page=${currentPage}` : ''}`}
                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      sort === 'createdAt'
                        ? 'bg-primary-navy text-white'
                        : 'border border-border bg-card text-primary-navy hover:bg-primary-navy hover:text-white'
                    }`}
                  >
                    Oldest
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog: any) => {
                  const featuredImage = typeof blog.featuredImage === 'object' ? blog.featuredImage as Media : null
                  return (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {featuredImage?.url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={featuredImage.url}
                            alt={featuredImage.alt || blog.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-linear-to-br from-primary-navy to-primary-navy-dark" />
                        )}
                        {/* Gold ribbon on hover */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-button-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-navy opacity-0 shadow-sm transition-opacity duration-200 ease-out group-hover:opacity-100"
                        >
                          Read
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        {blog.categories && blog.categories.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {blog.categories.map((cat: any, i: number) => (
                              <span
                                key={i}
                                className="rounded-full bg-button-gold/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-navy"
                              >
                                {cat.category}
                              </span>
                            ))}
                          </div>
                        )}
                        <h2 className="font-display text-lg font-bold leading-snug text-primary-navy transition-colors duration-200 ease-out group-hover:text-button-gold-hover">
                          {blog.title}
                        </h2>
                        {blog.publishedAt && (
                          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground/60">
                            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                            <time dateTime={blog.publishedAt}>{formatDate(blog.publishedAt)}</time>
                          </p>
                        )}
                        {blog.excerpt && (
                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/70">
                            {blog.excerpt}
                          </p>
                        )}
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-navy transition-colors duration-200 ease-out group-hover:text-button-gold-hover">
                          Read article
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label="Blog pagination"
                  className="mt-14 flex flex-wrap items-center justify-center gap-2"
                >
                  {currentPage > 1 ? (
                    <Link
                      href={`/blog?page=${currentPage - 1}${sortParam ? `&sort=${sortParam}` : ''}`}
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary-navy shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Previous
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-2xl border border-border bg-card/60 px-4 py-2 text-sm font-semibold text-foreground/40"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Previous
                    </span>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}${sortParam ? `&sort=${sortParam}` : ''}`}
                      aria-current={p === currentPage ? 'page' : undefined}
                      className={cn(
                        'inline-flex h-10 min-w-10 items-center justify-center rounded-2xl px-3 text-sm font-semibold transition-all duration-200 ease-out',
                        p === currentPage
                          ? 'bg-primary-navy text-primary-foreground shadow-sm'
                          : 'border border-border bg-card text-primary-navy shadow-sm hover:-translate-y-0.5 hover:shadow-md',
                      )}
                    >
                      {p}
                    </Link>
                  ))}

                  {currentPage < totalPages ? (
                    <Link
                      href={`/blog?page=${currentPage + 1}${sortParam ? `&sort=${sortParam}` : ''}`}
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary-navy shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-2xl border border-border bg-card/60 px-4 py-2 text-sm font-semibold text-foreground/40"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-button-gold/15 text-primary-navy">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-5 font-display text-lg font-bold text-primary-navy">
                No blog posts available yet
              </p>
              <p className="mt-2 text-sm text-foreground/60">
                Check back soon for new articles.
              </p>
            </div>
          )}
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-bold text-primary-navy mb-6">Need More Help?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/counselling" className="inline-flex items-center gap-2 rounded-lg bg-primary-navy px-5 py-3 text-sm font-semibold text-white hover:bg-primary-navy-dark transition-colors">
                <BookOpen className="h-4 w-4" />
                Counselling Guides
              </Link>
              <Link href="/counselling/state" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-primary-navy hover:bg-muted transition-colors">
                <MapPin className="h-4 w-4" />
                State-Wise Info
              </Link>
              <Link href="/colleges" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-primary-navy hover:bg-muted transition-colors">
                <GraduationCap className="h-4 w-4" />
                College Directory
              </Link>
              <Link href="/faq" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-primary-navy hover:bg-muted transition-colors">
                <HelpCircle className="h-4 w-4" />
                FAQs
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
