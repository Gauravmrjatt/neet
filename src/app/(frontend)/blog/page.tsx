import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getBlogs } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { formatDate } from '@/lib/utils'
import { Media } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Blog',
    description: 'Latest articles and guides for NEET aspirants',
    path: '/blog',
  })
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const currentPage = parseInt(pageParam || '1', 10)
  const { docs: blogs, totalPages, page: paginationPage } = await getBlogs({ page: currentPage, limit: 9 })

  return (
    <Section>
      <Container>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">Latest articles and guides for NEET aspirants</p>
        </div>

        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog: any) => {
                const featuredImage = typeof blog.featuredImage === 'object' ? blog.featuredImage as Media : null
                return (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group overflow-hidden rounded-lg border transition hover:shadow-lg"
                  >
                    {featuredImage?.url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={featuredImage.url}
                          alt={featuredImage.alt || blog.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {blog.categories && blog.categories.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {blog.categories.map((cat: any, i: number) => (
                            <span key={i} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                              {cat.category}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="text-xl font-semibold group-hover:text-primary">{blog.title}</h2>
                      {blog.publishedAt && (
                        <p className="mt-2 text-sm text-muted-foreground">{formatDate(blog.publishedAt)}</p>
                      )}
                      {blog.excerpt && (
                        <p className="mt-3 line-clamp-3 text-muted-foreground">{blog.excerpt}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/blog?page=${p}`}
                    className={`inline-flex items-center rounded-md px-4 py-2 text-sm ${
                      p === currentPage
                        ? 'bg-primary text-primary-foreground'
                        : 'border hover:bg-accent'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">No blog posts available yet.</p>
        )}
      </Container>
    </Section>
  )
}
