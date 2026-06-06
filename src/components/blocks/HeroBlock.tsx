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
      className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#062963] via-[#062963] to-[#041d45]"
      style={bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {bgUrl && <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />}
      {/* Decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-button-gold/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <Container className="relative z-10 text-center text-white">
        <h1 className="font-display text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
          {heading}
        </h1>
        {subheading && (
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/85 sm:text-xl leading-relaxed">
            {subheading}
          </p>
        )}
        {ctaText && ctaLink && (
          <div className="mt-10">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 rounded-full bg-button-gold px-7 py-3 text-base font-semibold text-primary shadow-md transition-all duration-200 ease-out hover:bg-button-gold-hover hover:shadow-lg active:scale-[0.98]"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </Container>
    </section>
  )
}
