import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getVideos } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Videos',
    description: 'Video guides and tutorials for NEET preparation',
    path: '/videos',
  })
}

const CATEGORIES = [
  { label: 'All', value: undefined },
  { label: 'Lectures', value: 'lecture' },
  { label: 'Tips', value: 'tips' },
  { label: 'Interviews', value: 'interview' },
  { label: 'Other', value: 'other' },
]

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category, page: pageParam } = await searchParams
  const currentPage = parseInt(pageParam || '1', 10)
  const selectedCategory = category as 'lecture' | 'tips' | 'interview' | 'other' | undefined

  const { docs: videos, totalPages } = await getVideos({
    page: currentPage,
    limit: 12,
    category: selectedCategory,
  })

  return (
    <>
      <PageHero
        title="Videos"
        subtitle="Video guides and tutorials for NEET preparation"
      />
      <Section className="bg-navbar-bg/30">
        <Container>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = (cat.value === selectedCategory) || (!cat.value && !selectedCategory)
              return (
                <Link
                  key={cat.label}
                  href={cat.value ? `/videos?category=${cat.value}` : '/videos'}
                  className={cn(
                    'inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ease-out active:scale-[0.98]',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-primary/15 bg-white text-primary hover:border-primary/40 hover:bg-primary/5'
                  )}
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
                      className="group overflow-hidden rounded-2xl border border-primary/10 bg-white transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {thumbnail?.url ? (
                          <img
                            src={thumbnail.url}
                            alt={thumbnail.alt || video.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary-navy-dark">
                            <svg className="h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h2 className="font-display font-bold text-primary transition-colors group-hover:text-button-gold line-clamp-2">
                          {video.title}
                        </h2>
                        {video.category && (
                          <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium capitalize text-primary">
                            {video.category}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-14 flex justify-center gap-2 flex-wrap">
                  {currentPage > 1 && (
                    <Link
                      href={`/videos?page=${currentPage - 1}${category ? `&category=${category}` : ''}`}
                      className="inline-flex items-center rounded-full border border-primary/15 bg-white px-5 py-2 text-sm font-semibold text-primary transition-all duration-200 ease-out hover:border-primary/40 hover:bg-primary/5"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/videos?page=${p}${category ? `&category=${category}` : ''}`}
                      className={cn(
                        'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ease-out',
                        p === currentPage
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'border border-primary/15 bg-white text-primary hover:border-primary/40 hover:bg-primary/5'
                      )}
                    >
                      {p}
                    </Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link
                      href={`/videos?page=${currentPage + 1}${category ? `&category=${category}` : ''}`}
                      className="inline-flex items-center rounded-full border border-primary/15 bg-white px-5 py-2 text-sm font-semibold text-primary transition-all duration-200 ease-out hover:border-primary/40 hover:bg-primary/5"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-primary/20 bg-white p-12 text-center">
              <p className="font-display text-lg font-semibold text-primary">No videos available yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Check back soon for new content.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
