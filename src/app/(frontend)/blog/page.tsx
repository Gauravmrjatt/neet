import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getBlogs } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
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
    <>
      <PageHero
        title="Blog"
        subtitle="Latest articles, guides, and insights for NEET aspirants"
      />
      <Section className="bg-[#F6F3EE]/30">
        <Container>
          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog: any) => {
                  const featuredImage = typeof blog.featuredImage === 'object' ? blog.featuredImage as Media : null
                  return (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {featuredImage?.url ? (
                        <div className="aspect-video overflow-hidden bg-gray-100">
                          <img
                            src={featuredImage.url}
                            alt={featuredImage.alt || blog.title}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-[#062963] to-[#041d45]" />
                      )}
                      <div className="p-6">
                        {blog.categories && blog.categories.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {blog.categories.map((cat: any, i: number) => (
                              <span
                                key={i}
                                className="rounded-full bg-[#062963]/10 text-[#062963] px-2.5 py-1 text-xs font-medium"
                              >
                                {cat.category}
                              </span>
                            ))}
                          </div>
                        )}
                        <h2 className="text-lg font-bold text-[#062963] group-hover:text-[#FBAC1A] transition-colors">
                          {blog.title}
                        </h2>
                        {blog.publishedAt && (
                          <p className="mt-2 text-xs text-gray-500">{formatDate(blog.publishedAt)}</p>
                        )}
                        {blog.excerpt && (
                          <p className="mt-3 line-clamp-3 text-sm text-gray-600">{blog.excerpt}</p>
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
                      href={`/blog?page=${currentPage - 1}`}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#062963] hover:bg-[#062963] hover:text-white transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}`}
                      className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        p === currentPage
                          ? 'bg-[#062963] text-white'
                          : 'border border-gray-300 bg-white text-[#062963] hover:bg-[#062963] hover:text-white'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link
                      href={`/blog?page=${currentPage + 1}`}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#062963] hover:bg-[#062963] hover:text-white transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-[#062963]">No blog posts available yet</p>
              <p className="mt-2 text-sm text-gray-500">Check back soon for new articles.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
