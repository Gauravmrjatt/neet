import React from 'react'
import { Media } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

interface Testimonial {
  name: string
  quote: string
  image?: (string | null) | Media
  designation?: string | null
  id?: string | null
}

interface TestimonialBlockProps {
  heading?: string | null
  testimonials?: Testimonial[] | null
}

export function TestimonialBlock({ heading, testimonials }: TestimonialBlockProps) {
  if (!testimonials?.length) return null

  return (
    <Section>
      <Container>
        {heading && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const avatarUrl = typeof testimonial.image === 'object' ? testimonial.image?.url : null
            return (
              <div key={testimonial.id || index} className="rounded-lg border p-6">
                <blockquote className="text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <div className="mt-6 flex items-center gap-4">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={testimonial.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    {testimonial.designation && (
                      <p className="text-xs text-muted-foreground">{testimonial.designation}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
