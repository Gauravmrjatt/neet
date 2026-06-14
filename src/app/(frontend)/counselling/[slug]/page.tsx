import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCounsellingPostBySlug, getRecentCounsellingPosts } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getLexicalText } from '@/lib/lexical'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { formatDate } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks'
import { CounsellingCard } from '@/components/counselling/CounsellingCard'
import { Disclaimer } from '@/components/shared/Disclaimer'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post: any = await getCounsellingPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  const featuredImage = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const seoKeywords = post.seo?.keywords?.map((k: any) => k.keyword).filter(Boolean)
  const ogImageUrl = post.seo?.ogImage && typeof post.seo.ogImage === 'object'
    ? { url: post.seo.ogImage.url || undefined }
    : featuredImage
      ? { url: featuredImage.url || undefined }
      : undefined
  return generateSEOMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || 'NEET counselling guide and expert tips',
    path: `/counselling/${post.slug}`,
    ogImage: ogImageUrl,
    keywords: seoKeywords,
  })
}

export default async function CounsellingDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [post, { docs: recentPosts }] = await Promise.all([
    getCounsellingPostBySlug(slug),
    getRecentCounsellingPosts(4),
  ])

  if (!post) notFound()

  const p: any = post
  const featuredImage = typeof p.featuredImage === 'object' ? p.featuredImage : null
  const author = typeof p.author === 'object' ? p.author : null
  const relatedPosts = recentPosts.filter((r: any) => r.id !== p.id).slice(0, 3)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const faqItems = p.blocks
    ?.filter((b: any) => b.blockType === 'faqBlock')
    ?.flatMap((b: any) => b.items || []) || []

  return (
    <>
      <JsonLd data={generateArticleSchema({
        title: p.title,
        description: p.excerpt,
        image: featuredImage?.url,
        datePublished: p.publishedAt,
        dateModified: p.updatedAt,
        authorName: author?.name || 'NEET Counselling Experts',
        authorUrl: author?.url || undefined,
        publisherLogo: `${siteUrl}/logo.png`,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Counselling', url: `${siteUrl}/counselling` },
        { name: p.title, url: `${siteUrl}/counselling/${p.slug}` },
      ])} />
      {faqItems.length > 0 && (
        <JsonLd data={generateFAQSchema(faqItems)} />
      )}

      <article>
        <header className="bg-primary-navy py-12 sm:py-16 text-white">
          <Container className="max-w-4xl">
            <Link
              href="/counselling"
              className="inline-flex items-center text-sm text-white/70 hover:text-button-gold transition-colors mb-4"
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Guides
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              {p.title}
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
              {p.publishedAt && (
                <time>{formatDate(p.publishedAt)}</time>
              )}
            </div>
          </Container>
        </header>

        {featuredImage?.url && (
          <div className="relative -mt-8 mb-8 sm:mb-12">
            <Container className="max-w-4xl">
              <div className="overflow-hidden rounded-xl border border-border shadow-lg">
                <img
                  src={featuredImage.url}
                  alt={featuredImage.alt || p.title}
                  fetchPriority="high"
                  decoding="async"
                  className="h-auto w-full"
                />
              </div>
            </Container>
          </div>
        )}

        <Section className="bg-card">
          <Container className="max-w-4xl">
            <div className="prose prose-lg max-w-none prose-headings:text-primary-navy prose-a:text-primary-navy">
              <RichText content={p.content} maxHeadingLevel={2} />
            </div>
            {p.blocks && p.blocks.length > 0 && (
              <div className="mt-8">
                <BlockRenderer blocks={p.blocks} />
              </div>
            )}
          </Container>
        </Section>

        <Section>
          <Container className="max-w-4xl">
            <Disclaimer type="educational" />
          </Container>
        </Section>
        {relatedPosts.length > 0 && (
          <Section className="bg-navbar-bg/30">
            <Container className="max-w-4xl">
              <div className="border-t border-border pt-12">
                <h2 className="mb-8 text-2xl font-bold text-primary-navy">Related Guides</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {relatedPosts.map((related: any) => (
                    <CounsellingCard key={related.id} post={related} />
                  ))}
                </div>
              </div>
            </Container>
          </Section>
        )}

        <Section>
          <Container className="max-w-4xl">
            <div className="rounded-xl bg-primary-navy p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Need Personalised Help?</h2>
              <p className="text-white/80 mb-6">
                Talk to our expert counsellors for one-on-one guidance tailored to your rank and preferences.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-lg bg-button-gold px-6 py-3 font-semibold text-primary-navy hover:bg-button-gold-hover transition-colors"
                >
                  Book a Free Consultation
                </Link>
                <Link
                  href="/counsellors"
                  className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Browse Counsellors
                </Link>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Also explore: <Link href="/counselling/state" className="underline hover:text-button-gold">State Counselling Guides</Link> &middot; <Link href="/colleges" className="underline hover:text-button-gold">College Directory</Link> &middot; <Link href="/faq" className="underline hover:text-button-gold">FAQs</Link>
              </p>
            </div>
          </Container>
        </Section>
      </article>
    </>
  )
}
