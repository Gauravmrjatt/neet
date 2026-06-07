import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogBySlug, getRecentBlogs } from '@/lib/queries'
import { generateBlogMetadata } from '@/lib/seo'
import { generateBlogPostingSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { formatDate } from '@/lib/utils'
import { Media, User } from '@/payload-types'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) return { title: 'Blog Post Not Found' }
  const featuredImage = typeof blog.featuredImage === 'object' ? blog.featuredImage as Media : null
  return generateBlogMetadata({
    seo: blog.seo ? {
      metaTitle: blog.seo.metaTitle || undefined,
      metaDescription: blog.seo.metaDescription || undefined,
      ogImage: blog.seo.ogImage && typeof blog.seo.ogImage === 'object' ? { url: (blog.seo.ogImage as Media).url || undefined } : undefined,
      keywords: blog.seo.keywords?.map((k: any) => k.keyword).filter(Boolean) as string[] | undefined,
    } : undefined,
    title: blog.title,
    excerpt: blog.excerpt || undefined,
    featuredImage: featuredImage ? { url: featuredImage.url || undefined } : null,
    slug: blog.slug,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) notFound()

  const featuredImage = typeof blog.featuredImage === 'object' ? blog.featuredImage as Media : null
  const author = typeof blog.author === 'object' ? blog.author as User : null
  const { docs: recentBlogs } = await getRecentBlogs(3)
  const relatedBlogs = recentBlogs.filter((b: any) => b.id !== blog.id).slice(0, 2)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <JsonLd data={generateBlogPostingSchema({
        title: blog.title,
        excerpt: blog.excerpt || undefined,
        featuredImage: featuredImage ? { url: featuredImage.url || undefined } : null,
        publishedAt: blog.publishedAt || undefined,
        updatedAt: blog.updatedAt,
        author: author ? { name: author.name || author.email } : undefined,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Blog', url: `${siteUrl}/blog` },
        { name: blog.title, url: `${siteUrl}/blog/${blog.slug}` },
      ])} />

      <article className="bg-card">
        {/* Article Header */}
        <header className="bg-primary-navy py-12 sm:py-16 text-white">
          <Container className="max-w-4xl">
            <Link href="/blog" className="inline-flex items-center text-sm text-white/70 hover:text-button-gold transition-colors mb-4">
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
            {blog.categories && blog.categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {blog.categories.map((cat: any, i: number) => (
                  <span
                    key={i}
                    className="rounded-full bg-button-gold text-primary-navy px-3 py-1 text-xs font-semibold"
                  >
                    {cat.category}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              {blog.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
              {author && (
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-button-gold text-primary-navy text-sm font-bold">
                    {(author.name || author.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-white">{author.name || author.email}</span>
                </div>
              )}
              {blog.publishedAt && (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time>{formatDate(blog.publishedAt)}</time>
                </div>
              )}
            </div>
          </Container>
        </header>

        {/* Featured Image */}
        {featuredImage?.url && (
          <div className="relative -mt-8 mb-8 sm:mb-12">
            <Container className="max-w-4xl">
              <div className="overflow-hidden rounded-xl border border-border shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredImage.url}
                  alt={featuredImage.alt || blog.title}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
            </Container>
          </div>
        )}

        {/* Article Content */}
        <Section className="bg-card">
          <Container className="max-w-4xl">
            <div className="prose prose-lg max-w-none prose-headings:text-primary-navy prose-a:text-primary-navy prose-a:no-underline hover:prose-a:underline">
              <RichText content={blog.content} />
            </div>
          </Container>
        </Section>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <Section className="bg-navbar-bg/30">
            <Container className="max-w-4xl">
              <div className="border-t border-border pt-12">
                <h2 className="mb-8 text-2xl font-bold text-primary-navy">Related Articles</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {relatedBlogs.map((related: any) => {
                    const relImage = typeof related.featuredImage === 'object' ? related.featuredImage as Media : null
                    return (
                      <Link
                        key={related.id}
                        href={`/blog/${related.slug}`}
                        className="group overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg hover:-translate-y-0.5"
                      >
                        {relImage?.url ? (
                          <div className="aspect-video overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={relImage.url}
                              alt={relImage.alt || related.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-primary-navy to-primary-navy-dark" />
                        )}
                        <div className="p-5">
                          <h3 className="font-semibold text-primary-navy group-hover:text-button-gold transition-colors">
                            {related.title}
                          </h3>
                          {related.publishedAt && (
                            <p className="mt-2 text-xs text-muted-foreground">{formatDate(related.publishedAt)}</p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </Container>
          </Section>
        )}
      </article>
    </>
  )
}
