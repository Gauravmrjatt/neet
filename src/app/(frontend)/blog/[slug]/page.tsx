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
import { ArrowLeft, Calendar } from 'lucide-react'

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

      <article className="bg-white">
        {/* Article Header */}
        <header className="relative overflow-hidden bg-primary py-14 sm:py-20 text-white">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-button-gold/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <Container className="relative z-10 max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-semibold text-white/75 transition-colors hover:text-button-gold mb-5"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Blog
            </Link>
            {blog.categories && blog.categories.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {blog.categories.map((cat: any, i: number) => (
                  <span
                    key={i}
                    className="rounded-full bg-button-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm"
                  >
                    {cat.category}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {blog.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/75">
              {author && (
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-button-gold text-sm font-bold text-primary">
                    {(author.name || author.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-white">{author.name || author.email}</span>
                </div>
              )}
              {blog.publishedAt && (
                <div className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
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
              <div className="overflow-hidden rounded-2xl border border-primary/10 shadow-md">
                <img
                  src={featuredImage.url}
                  alt={featuredImage.alt || blog.title}
                  className="h-auto w-full"
                />
              </div>
            </Container>
          </div>
        )}

        {/* Article Content */}
        <Section className="bg-white">
          <Container className="max-w-4xl">
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground">
              <RichText content={blog.content} />
            </div>
          </Container>
        </Section>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <Section className="bg-navbar-bg/30">
            <Container className="max-w-4xl">
              <div className="border-t border-primary/10 pt-14">
                <h2 className="font-display mb-8 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {relatedBlogs.map((related: any) => {
                    const relImage = typeof related.featuredImage === 'object' ? related.featuredImage as Media : null
                    return (
                      <Link
                        key={related.id}
                        href={`/blog/${related.slug}`}
                        className="group overflow-hidden rounded-2xl border border-primary/10 bg-white transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                      >
                        {relImage?.url ? (
                          <div className="aspect-video overflow-hidden bg-muted">
                            <img
                              src={relImage.url}
                              alt={relImage.alt || related.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-primary to-primary-navy-dark" />
                        )}
                        <div className="p-5">
                          <h3 className="font-display font-semibold text-primary transition-colors group-hover:text-button-gold">
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
