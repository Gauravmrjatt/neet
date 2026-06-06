import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

interface CTABlockProps {
  heading: string
  description?: string | null
  buttonText: string
  buttonLink: string
}

export function CTABlock({ heading, description, buttonText, buttonLink }: CTABlockProps) {
  return (
    <Section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-button-gold/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <Container className="relative z-10 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {heading}
        </h2>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/85 leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-8">
          <Link
            href={buttonLink}
            className="inline-flex items-center gap-2 rounded-full bg-button-gold px-7 py-3 text-base font-semibold text-primary shadow-md transition-all duration-200 ease-out hover:bg-button-gold-hover hover:shadow-lg active:scale-[0.98]"
          >
            {buttonText}
          </Link>
        </div>
      </Container>
    </Section>
  )
}
