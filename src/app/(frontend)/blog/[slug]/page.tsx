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

      <Section>
        <Container className="max-w-4xl">
          <article>
            <header className="mb-8">
              {blog.categories && blog.categories.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {blog.categories.map((cat: any, i: number) => (
                    <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      {cat.category}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{blog.title}</h1>
              <div className="mt-4 flex items-center gap-4 text-muted-foreground">
                {author && (
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {(author.name || author.email).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">{author.name || author.email}</span>
                  </div>
                )}
                {blog.publishedAt && (
                  <time className="text-sm">{formatDate(blog.publishedAt)}</time>
                )}
              </div>
            </header>

            {featuredImage?.url && (
              <div className="mb-8 overflow-hidden rounded-lg">
                <img
                  src={featuredImage.url}
                  alt={featuredImage.alt || blog.title}
                  className="h-auto w-full"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <RichText content={blog.content} />
            </div>
          </article>

          {relatedBlogs.length > 0 && (
            <div className="mt-16 border-t pt-12">
              <h2 className="mb-8 text-2xl font-bold">Related Articles</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {relatedBlogs.map((related: any) => {
                  const relImage = typeof related.featuredImage === 'object' ? related.featuredImage as Media : null
                  return (
                    <Link
                      key={related.id}
                      href={`/blog/${related.slug}`}
                      className="group overflow-hidden rounded-lg border transition hover:shadow-lg"
                    >
                      {relImage?.url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relImage.url}
                            alt={relImage.alt || related.title}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-primary">{related.title}</h3>
                        {related.publishedAt && (
                          <p className="mt-1 text-sm text-muted-foreground">{formatDate(related.publishedAt)}</p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
