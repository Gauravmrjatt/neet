import React from 'react'
import Link from 'next/link'
import { Media } from '@/payload-types'
import { Container } from '@/components/layout/Container'

interface HeroBlockProps {
  heading: string
  subheading?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  backgroundImage?: (string | null) | Media
}

export function HeroBlock({ heading, subheading, ctaText, ctaLink, backgroundImage }: HeroBlockProps) {
  const bgUrl = typeof backgroundImage === 'object' ? backgroundImage?.url : null

  return (
    <section
      className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900"
      style={bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {bgUrl && <div className="absolute inset-0 bg-black/50" />}
      <Container className="relative z-10 text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{heading}</h1>
        {subheading && (
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/80 sm:text-xl">{subheading}</p>
        )}
        {ctaText && ctaLink && (
          <div className="mt-10">
            <Link
              href={ctaLink}
              className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-900 shadow-sm hover:bg-white/90"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </Container>
    </section>
  )
}
