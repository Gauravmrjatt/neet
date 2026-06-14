import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

interface PolymorphicReference {
  relationTo: string
  value: Record<string, unknown> | string
}

interface PostEntry {
  id?: string | null
  post: PolymorphicReference | string | Record<string, unknown> | null
}

interface RelatedPostsBlockProps {
  title?: string | null
  posts?: PostEntry[] | null
}

function extractPost(postEntry: PostEntry): { url: string; title: string; image?: string; excerpt?: string } | null {
  const raw = postEntry.post
  if (!raw || typeof raw === 'string') return null

  const polymorphic = raw as PolymorphicReference
  const doc = polymorphic.relationTo ? polymorphic.value : raw
  if (!doc || typeof doc === 'string') return null

  const value = doc as Record<string, unknown>

  const slug = value.slug as string | undefined
  const title = (value.title as string) || (value.name as string) || 'Untitled'
  const excerpt = value.excerpt as string | undefined
  const featuredImage = value.featuredImage
  const image = typeof featuredImage === 'object' && featuredImage ? (featuredImage as Record<string, unknown>)?.url as string | undefined : undefined

  const relationTo = (raw as PolymorphicReference).relationTo
  const collectionMap: Record<string, string> = {
    blogs: 'blog',
    counselling: 'counselling',
    pages: '',
  }
  const prefix = collectionMap[relationTo]
  if (prefix === undefined) return null
  if (!slug) return null

  const url = prefix ? `/${prefix}/${slug}` : `/${slug}`

  return { url, title, image, excerpt }
}

const POSTS_TO_SHOW = 6

export function RelatedPostsBlock({ title, posts }: RelatedPostsBlockProps) {
  if (!posts?.length) return null

  const resolved = posts.map(extractPost).filter(Boolean)
  if (!resolved.length) return null

  const display = resolved.slice(0, POSTS_TO_SHOW)

  return (
    <Section>
      <Container>
        {title && (
          <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {display.map((post, i) => (
            <Link
              key={i}
              href={post!.url}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-button-gold hover:shadow-md"
            >
              {post!.image && (
                <div className="mb-4 overflow-hidden rounded-lg">
    <img
                    src={post!.image}
                    alt={post!.title}
                    loading="lazy"
                    className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
<h3 className="font-semibold text-primary-navy group-hover:text-button-gold">
                {post!.title}
              </h3>
              {post!.excerpt && (
                <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
                  {post!.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}
