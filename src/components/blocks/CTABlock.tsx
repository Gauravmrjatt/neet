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
    <Section className="bg-primary text-primary-foreground">
      <Container className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        {description && <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">{description}</p>}
        <div className="mt-8">
          <Link
            href={buttonLink}
            className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm hover:bg-white/90"
          >
            {buttonText}
          </Link>
        </div>
      </Container>
    </Section>
  )
}
