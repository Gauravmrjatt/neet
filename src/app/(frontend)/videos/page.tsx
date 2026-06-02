import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getVideos } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
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
    <Section>
      <Container>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Videos</h1>
          <p className="mt-4 text-lg text-muted-foreground">Video guides and tutorials for NEET preparation</p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.value ? `/videos?category=${cat.value}` : '/videos'}
              className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition ${
                (cat.value === selectedCategory) || (!cat.value && !selectedCategory)
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-accent'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video: any) => {
                const thumbnail = typeof video.thumbnail === 'object' ? video.thumbnail as Media : null
                return (
                  <Link
                    key={video.id}
                    href={`/videos/${video.slug}`}
                    className="group overflow-hidden rounded-lg border transition hover:shadow-lg"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      {thumbnail?.url ? (
                        <img
                          src={thumbnail.url}
                          alt={thumbnail.alt || video.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-1 text-xs text-white">
                          {video.duration}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="font-semibold group-hover:text-primary">{video.title}</h2>
                      {video.category && (
                        <span className="mt-2 inline-block rounded-full bg-muted px-2 py-1 text-xs capitalize">
                          {video.category}
                        </span>
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
                    href={`/videos?page=${currentPage - 1}${category ? `&category=${category}` : ''}`}
                    className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/videos?page=${p}${category ? `&category=${category}` : ''}`}
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
                    href={`/videos?page=${currentPage + 1}${category ? `&category=${category}` : ''}`}
                    className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">No videos available yet.</p>
        )}
      </Container>
    </Section>
  )
}
