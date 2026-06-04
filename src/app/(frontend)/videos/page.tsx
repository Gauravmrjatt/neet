import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getVideos } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { Media } from '@/payload-types'

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
      <Section className="bg-[#F6F3EE]/30">
        <Container>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = (cat.value === selectedCategory) || (!cat.value && !selectedCategory)
              return (
                <Link
                  key={cat.label}
                  href={cat.value ? `/videos?category=${cat.value}` : '/videos'}
                  className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#062963] text-white'
                      : 'border border-gray-300 bg-white text-[#062963] hover:bg-[#062963] hover:text-white'
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
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        {thumbnail?.url ? (
                          <img
                            src={thumbnail.url}
                            alt={thumbnail.alt || video.title}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#062963] to-[#041d45]">
                            <svg className="h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 rounded bg-[#062963]/90 px-2 py-1 text-xs font-medium text-white">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h2 className="font-bold text-[#062963] group-hover:text-[#FBAC1A] transition-colors line-clamp-2">
                          {video.title}
                        </h2>
                        {video.category && (
                          <span className="mt-3 inline-block rounded-full bg-[#062963]/10 text-[#062963] px-2.5 py-0.5 text-xs font-medium capitalize">
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
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#062963] hover:bg-[#062963] hover:text-white transition-colors"
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
                          ? 'bg-[#062963] text-white'
                          : 'border border-gray-300 bg-white text-[#062963] hover:bg-[#062963] hover:text-white'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link
                      href={`/videos?page=${currentPage + 1}${category ? `&category=${category}` : ''}`}
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
              <p className="text-lg font-semibold text-[#062963]">No videos available yet</p>
              <p className="mt-2 text-sm text-gray-500">Check back soon for new content.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
